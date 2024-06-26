import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DEFAULT_FILTER, Filter, SortOrders } from '@domain/filter.type';
import { Observable, map } from 'rxjs';
import { SearchComponent } from './search.component';

/**
 * The widget (smart component) to filter the activities.
 * Is a form to filter the activities by search term, orderBy and sort order
 * @description Sends changes to the query params via an effect
 * Imports the FormsModule to use the NgModel directive
 * Imports the SearchComponent to use the search term as a model
 */
@Component({
  selector: 'lab-filter',
  standalone: true,
  imports: [FormsModule, SearchComponent],
  template: `
    <form>
      <lab-search [(searchTerm)]="search" />
      <fieldset class="grid">
        <select name="sortBy" [(ngModel)]="sortBy" aria-label="Choose field to sort by...">
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
        </select>
        <fieldset>
          <legend>Sort order:</legend>
          <input type="radio" name="order" id="asc" value="asc" [(ngModel)]="order" />
          <label for="asc">Ascending</label>
          <input type="radio" name="order" id="desc" value="desc" [(ngModel)]="order" />
          <label for="desc">Descending</label>
        </fieldset>
      </fieldset>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterWidget {
  // * Injected services division

  /** The activated route to get the query params*/
  #activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  #router: Router = inject(Router);

  // * Input signals division

  /** The query params as an observable of filter filled with default values*/
  #filterParams$: Observable<Filter> = this.#activatedRoute.queryParams.pipe(
    map((params: Params) => ({ ...DEFAULT_FILTER, ...params })),
  );
  /** The default filter signal based on the query params or the default filter*/
  #defaultFilter: Signal<Filter> = toSignal(this.#filterParams$, { initialValue: DEFAULT_FILTER });

  // * Writable signals division

  /** The search text signal */
  search: WritableSignal<string> = signal<string>(this.#defaultFilter().search);
  /** The sort_by field signal */
  sortBy: WritableSignal<string> = signal<string>(this.#defaultFilter().sortBy);
  /** The sort order signal */
  order: WritableSignal<SortOrders> = signal<SortOrders>(this.#defaultFilter().order);

  // * Computed signals division

  // The filter signal based on the search, sortBy and order models
  #filter: Signal<Filter> = computed(() => ({ search: this.search(), sortBy: this.sortBy(), order: this.order() }));

  constructor() {
    // could be a property
    effect(() => this.#onFilterChange(this.#filter()));
  }

  /**
   * Update the query params when the filter changes
   * @param filter The filter to update the query params
   */
  #onFilterChange(filter: Filter) {
    this.#router.navigate([], { queryParams: filter });
  }
}
