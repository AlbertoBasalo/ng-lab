import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { Activity } from '@domain/activity.type';
import { DEFAULT_FILTER, Filter, SortOrders } from '@domain/filter.type';
import { FavoritesStore } from '@services/state/favorites.store';
import { FilterWidget } from '@ui/filter.widget';
import { Observable, switchMap } from 'rxjs';
import { ActivitiesFooterComponent } from './activities-footer.component';
import { ActivityComponent } from './activity.component';
import { HomeService } from './home.service';

/**
 * Routed component for the Home page.
 * - Uses the ActivityComponent and ActivitiesFooterComponent for the presentation
 * - Uses the HomeService as facade to get the activities
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityComponent, FilterWidget, ActivitiesFooterComponent],
  template: `
    <article>
      <header>
        <h2>Activities</h2>
        <lab-filter />
      </header>
      @defer (when hasData()) {
        <main id="activities-list">
          @for (activity of activities(); track activity.id) {
            <lab-activity [activity]="activity" [(favorites)]="favorites" />
          } @empty {
            <p>No activities found</p>
          }
        </main>
        <lab-activities-footer
          [activitiesCount]="activities().length"
          [favoritesCount]="favorites().length"
          [search]="search()"
          [sortBy]="sortBy()"
          [order]="order()" />
      } @placeholder {
        <p>
          <input disabled aria-invalid="true" value="Sorry, something went wrong" />
        </p>
      } @loading (minimum 500ms) {
        <p aria-busy="true">Loading activities</p>
      }
    </article>
  `,
})
export default class HomePage {
  // ! fix initial double api call

  // * Injected services division

  /** The service to get the activities*/
  #service: HomeService = inject(HomeService);
  /** The title service to update the title*/
  #title: Title = inject(Title);
  /** The meta service to update the meta tags*/
  #meta: Meta = inject(Meta);
  /** Signal based store of the favorites*/
  #favoritesStore: FavoritesStore = inject(FavoritesStore);

  // * Input signals division

  /** The search input signal coming from the route query params*/
  search: InputSignal<string> = input<string>(DEFAULT_FILTER.search);
  /** The order by input signal coming from the route query params*/
  sortBy: InputSignal<string> = input<string>(DEFAULT_FILTER.sortBy);
  /** The sort input signal coming from the route query params*/
  order: InputSignal<SortOrders> = input<SortOrders>(DEFAULT_FILTER.order);

  // * Computed signals and interop division

  /** Computed filter from the search, orderBy and sort signals */
  #filter: Signal<Filter> = computed(() => ({ search: this.search(), sortBy: this.sortBy(), order: this.order() }));
  /** The filter signal interop as an observable */
  #filter$: Observable<Filter> = toObservable(this.#filter);
  /** A function that returns the observable of activities based on the filter */
  #getActivitiesByFilter$ = (filter: Filter) => this.#service.getActivitiesByFilter$(filter);
  /** Pipeline with a switch map to get the activities observable based on the filter observable */
  #filter$SwitchMapApi$: Observable<Activity[]> = this.#filter$.pipe(switchMap(this.#getActivitiesByFilter$));
  /** The activities signal based on the filter observable */
  activities: Signal<Activity[]> = toSignal(this.#filter$SwitchMapApi$, { initialValue: [] });
  /** Signal of the presence of activities */
  hasData: Signal<boolean> = computed(() => this.activities().length > 0);

  // * Signals division

  /** Signal array of favorites shared with the ActivityComponent*/
  favorites: WritableSignal<string[]> = signal([]);

  constructor() {
    this.#title.setTitle('Activities to book');
    this.#meta.updateTag({ name: 'description', content: 'Activities to book' });
    effect(() => this.#onFavoritesChange(this.favorites()), { allowSignalWrites: true });
  }

  // * Effect handlers division

  /** Handles the change of the favorites list signal propagating it to the store
   * @param favorites The new list of favorites
   */
  #onFavoritesChange(favorites: string[]): void {
    console.log('Favorites changed', favorites);
    this.#favoritesStore.setState(favorites);
  }
}
