---
name: angular-scaffolding
description: Angular 20 project conventions for the migration — standalone components, signals, new control flow, functional providers, and the per-page folder layout. Load when generating the Angular skeleton for a migrated page (component/service/route/styles) so output is consistent across all 150 pages.
---

# Angular 20 scaffolding conventions

Every migrated page follows the same shape so 150 pages stay consistent and reviewable. No
NgModules, no `*ngIf`, no constructor DI for new code.

## Per-page folder layout

```
src/app/features/<feature>/<page>/
  <page>.component.ts        # standalone, signals, ChangeDetectionStrategy.OnPush
  <page>.component.html      # @if / @for / @switch
  <page>.component.scss      # Ext-parity styles (explicit px from the spec)
  <page>.store.ts            # feature service (if the page owns data) — see data-layer-migration
  <page>.model.ts            # interfaces from Ext models
  <page>.routes.ts           # lazy route(s) for this feature
  <page>.parity.spec.ts      # the parity test (Playwright) — generated from the page spec
```

## Component conventions

```ts
@Component({
  selector: 'app-users-grid',
  standalone: true,                      // (default in v20, keep explicit for clarity)
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule /* only what's used */],
  templateUrl: './users-grid.component.html',
  styleUrl: './users-grid.component.scss',
})
export class UsersGridComponent {
  private store = inject(UsersStore);
  // inputs as signals:
  readonly mode = input<'view' | 'edit'>('view');
  // outputs:
  readonly rowSelected = output<User>();
  // state:
  readonly rows = this.store.data;
  readonly loading = this.store.loading;
  readonly selected = signal<User | null>(null);
  readonly canSave = computed(() => this.selected() != null);

  ngOnInit() { this.store.load(); }       // or constructor effect()
}
```

- **State → `signal()`; derived → `computed()`; side-effects → `effect()`.**
- **Inputs → `input()` / `input.required()`; outputs → `output()`.**
- **DI → `inject()`**.
- **Template → `@if` / `@for (x of xs(); track x.id)` / `@switch`.**
- **`async` pipe** only when a value is genuinely a stream; prefer signals.

## Routing

```ts
// app.routes.ts (provideRouter)
export const routes: Routes = [
  { path: 'users', loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES) },
];
// users.routes.ts
export const USERS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./users-grid/users-grid.component').then(m => m.UsersGridComponent),
    canActivate: [authGuard] },           // functional guard
];
```
- Mirror Ext hash routes (`#users/edit/5`) to Angular paths (`users/edit/5`); preserve params.
- **Lazy-load every feature** — keeps the 150-page bundle reasonable and matches the strangler model.

## Styling for parity

- One global `_extjs-parity.scss` partial overrides Material defaults onto Ext metrics
  (row heights, control heights ~22–28px, paddings, borders, focus rings, font-size).
- Per-page `.scss` carries the explicit dimensions captured in the page spec.
- Build a Material theme that reproduces the Ext theme palette + typography (see mapping skill).
- **Do not** rely on Material defaults for spacing — the visual eval compares pixels.

## Shared components

- Don't pre-build a component library. When the **2nd or 3rd** page needs the same Ext widget,
  extract a shared standalone component to `src/app/shared/`. (strangler-integration covers this.)

## Quality bar (what angular-code-reviewer checks)

- OnPush + signals; no `any`; no NgModules; no `*ngIf/*ngFor`; no logic in templates beyond
  `computed()`; subscriptions cleaned up (prefer signals/`takeUntilDestroyed`); a11y attributes
  present; lint/build clean. **And it must still pass the parity gate** — idiomatic but non-matching
  code is a fail.
