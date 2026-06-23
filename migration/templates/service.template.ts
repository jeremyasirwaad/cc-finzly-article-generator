/**
 * TEMPLATE — feature service replacing an Ext.data.Store (signals + HttpClient).
 * PRESERVE THE API CONTRACT: same endpoint, same param names, same response mapping
 * as the Ext proxy/reader/writer. See data-layer-migration skill.
 */
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// export interface __Model__ { id: number; /* fields from Ext.data.Model */ }

@Injectable({ providedIn: 'root' })
export class __Page__Store {
  private http = inject(HttpClient);

  private _data = signal<unknown[]>([]);   // <__Model__[]>
  private _loading = signal(false);
  private _total = signal(0);
  private _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly total = this._total.asReadonly();
  readonly error = this._error.asReadonly();

  /** Mirror the Ext proxy: same URL + param names (start/limit/sort/filter or page/pageSize). */
  load(params: { page?: number; limit?: number; sort?: string; filter?: string } = {}): void {
    this._loading.set(true);
    this._error.set(null);
    this.http
      .get<{ rows: unknown[]; total: number }>('/api/__resource__', { params: this.toParams(params) })
      .subscribe({
        next: (res) => {                       // match reader.rootProperty / totalProperty exactly
          this._data.set(res.rows);
          this._total.set(res.total);
          this._loading.set(false);
        },
        error: (e) => {
          this._error.set(String(e?.message ?? e));
          this._loading.set(false);
        },
      });
  }

  // create/update/destroy -> match Ext writer (single vs batch)
  // save(record): Observable<...> { return this.http.post('/api/__resource__', record); }

  private toParams(p: Record<string, unknown>): HttpParams {
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(p)) if (v != null) hp = hp.set(k, String(v));
    return hp;
  }
}
