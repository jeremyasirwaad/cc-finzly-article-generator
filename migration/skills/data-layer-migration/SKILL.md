---
name: data-layer-migration
description: How to translate the Ext JS data layer (Ext.data.Store, Model, proxy/reader/writer, TreeStore, ChainedStore, associations) into Angular 20 feature services that expose signals + RxJS over HttpClient, preserving the exact API contract. Load when migrating a page that reads/writes data, or when building the service behind a grid/form/combo.
---

# Ext data layer → Angular services (signals + HttpClient)

**Prime directive: the backend does not change.** Same URLs, same params, same request bodies,
same response shapes. The behavior-parity eval asserts request parity, so any "cleanup" of the API
shape will fail the gate. Migrate the *client* data layer only.

## The core pattern

One Ext `Store` (+ its `Model` + `proxy`) → one **injectable feature service** that:
- owns the data as a **`signal()`** (and derived `computed()` for filters/sorts/sums),
- loads/saves via **`HttpClient`**,
- exposes loading/error state as signals,
- mirrors the store's params (sort/filter/page/group) as inputs.

```ts
// users.model.ts  — Ext.data.Model -> interface (+ optional class for methods)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
  // Ext field 'name' with convert: -> computed in a class or a pipe, never a hidden mutation
}

// users.store.ts  — Ext.data.Store -> service exposing signals
@Injectable({ providedIn: 'root' })
export class UsersStore {
  private http = inject(HttpClient);

  private _data = signal<User[]>([]);
  private _loading = signal(false);
  private _total = signal(0);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly total = this._total.asReadonly();

  // mirror Ext proxy: same endpoint, same param names (rootProperty, totalProperty)
  load(params: { page?: number; limit?: number; sort?: string; filter?: string } = {}) {
    this._loading.set(true);
    this.http.get<{ rows: User[]; total: number }>('/api/users', { params: this.toHttpParams(params) })
      .subscribe({
        next: res => { this._data.set(res.rows); this._total.set(res.total); this._loading.set(false); },
        error: () => this._loading.set(false),
      });
  }
}
```

## Mapping table

| Ext | Angular | Notes |
|---|---|---|
| `Ext.data.Model` (fields) | TS `interface` | field types → TS types; **keep field names** |
| Model `convert` / calculated field | `computed()` or pure pipe | never mutate source data silently |
| Model `validators` | reuse as form `Validators` (see mapping skill) | single source of truth |
| Model `associations` (hasMany/belongsTo) | nested types + service methods | replicate lazy vs eager loading |
| `Ext.data.Store` | feature service w/ `signal<T[]>` | one per logical collection |
| `proxy: ajax/rest` | `HttpClient` methods | **same url/method/params** |
| `reader.rootProperty` | response mapping (`res.rows`) | match exactly |
| `writer` (create/update/destroy) | `post/put/delete` methods | preserve batch vs single |
| `autoLoad` | call `load()` in component `ngOnInit`/constructor effect | |
| remote `sort`/`filter`/`pageSize` | params on `load()` | server-side stays server-side |
| local `sort`/`filter` | `computed()` deriving from the data signal | |
| `Ext.data.TreeStore` | tree datasource service (nodes signal) | expand → load children |
| `Ext.data.ChainedStore` | `computed()` over the source store signal | no data duplication |
| `Ext.data.Session` / batch | a service coordinating dirty records → batch save | |
| store `load`/`update` events | effects / explicit method returns | components react to signals |

## Forms ↔ data

- Ext `form.loadRecord(model)` → patch the `FormGroup` from the loaded object (`form.patchValue`).
- Ext `form.updateRecord()` + `store.sync()` → read `form.value`, send via service `save()`.
- Dirty tracking (`form.isDirty()`) → `formGroup.dirty`; disable Save until dirty & valid.

## Combos / autocompletes

- Local combo store → static options array (signal).
- Remote combo (`queryMode:'remote'`, `typeAhead`) → debounced query → service method →
  async options. Preserve `minChars`, `queryDelay`, `pageSize` behavior so the network trace matches.

## Gotchas that break parity

- **Param name drift** (`start`/`limit`/`sort` vs `page`/`pageSize`) — copy Ext's exact names.
- **Date/number formatting** done in the store/reader — keep it; don't move formatting into the API.
- **Implicit sorting** Ext applies client-side by default — replicate or the row order differs (visual diff!).
- **Caching/`autoSync`** — match when requests fire; behavior-parity asserts request timing/count.
