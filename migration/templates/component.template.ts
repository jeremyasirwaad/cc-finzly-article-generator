/**
 * TEMPLATE — Angular 20 standalone page component (signals + OnPush).
 * Replace __Page__ / __page__ / selector. Keep ChangeDetectionStrategy.OnPush.
 * Import ONLY the Material modules this page actually uses. See angular-scaffolding skill.
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
// import { MatTableModule } from '@angular/material/table';
// import { __Page__Store } from './__page__.store';
// import { __Model__ } from './__page__.model';

@Component({
  selector: 'app-__page__',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* MatTableModule, ... only what's used */],
  templateUrl: './__page__.component.html',
  styleUrl: './__page__.component.scss',
})
export class __Page__Component {
  // private store = inject(__Page__Store);

  // --- inputs (Ext config) ---
  readonly mode = input<'view' | 'edit'>('view');

  // --- outputs (Ext fireEvent) ---
  readonly saved = output<unknown>();

  // --- state (ViewModel data) ---
  // readonly rows = this.store.data;
  // readonly loading = this.store.loading;
  readonly selected = signal<unknown | null>(null);

  // --- derived (ViewModel formulas) ---
  readonly canSave = computed(() => this.selected() != null);

  // --- lifecycle (autoLoad / afterrender) ---
  ngOnInit(): void {
    // this.store.load();
  }

  // --- methods (ViewController) ---
  // onSave(): void { ... this.saved.emit(...) }
}
