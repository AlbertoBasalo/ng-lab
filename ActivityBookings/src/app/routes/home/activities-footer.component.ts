import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { SortOrders } from '@domain/filter.type';

/**
 * A presentational component for the footer of the activities page
 * @argument search The search input signal coming from the route query params
 * @argument sortBy The sort_by input signal coming from the route query params
 * @argument order The order input signal coming from the route query params
 * @argument activitiesCount The activities count input signal
 * @argument favoritesCount The favorites count input signal
 * @description This component is a presentational component that shows the current filter, order by, sort, activities count and favorites count
 */
@Component({
  selector: 'lab-activities-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <small>
        <span>
          Filtering by <mark>{{ search() }}</mark
          >.
        </span>
        <span>
          Order by <mark>{{ sortBy() }} {{ order() }}</mark
          >.
        </span>
        <span>
          Got <mark>{{ activitiesCount() }}</mark> activities.
        </span>
        <span>
          You have selected <mark>{{ favoritesCount() }}</mark> favorites.
        </span>
      </small>
    </footer>
  `,
})
export class ActivitiesFooterComponent {
  // * Input signals division

  /** The search input signal coming from the route query params*/
  search: InputSignal<string> = input.required<string>();
  /** The order by input signal coming from the route query params*/
  sortBy: InputSignal<string> = input.required<string>();
  /** The sort input signal coming from the route query params*/
  order: InputSignal<SortOrders> = input.required<SortOrders>();
  /** The activities count input signal*/
  activitiesCount: InputSignal<number> = input.required<number>();
  /** The favorites count input signal*/
  favoritesCount: InputSignal<number> = input.required<number>();
}
