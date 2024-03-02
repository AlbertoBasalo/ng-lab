import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ModelSignal,
  Signal,
  effect,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, tap } from 'rxjs';

@Component({
  selector: 'lab-search',
  standalone: true,
  imports: [FormsModule],
  template: ` <input #searchInput type="search" name="search" [ngModel]="searchTerm()" placeholder="Search..." /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  searchInputEl: Signal<ElementRef | undefined> = viewChild('searchInput', { read: ElementRef });

  searchTerm: ModelSignal<string> = model<string>('');

  constructor() {
    effect(() => {
      const inputEl = this.searchInputEl();
      if (!inputEl) return;
      // Observable from search events
      fromEvent<Event>(inputEl.nativeElement, 'input')
        .pipe(
          tap((event: Event) => console.log('input event', event)),
          map((event: Event) => (event.target as HTMLInputElement).value),
          tap((value) => console.log('input value', value)),
          filter((value) => value.length > 2),
          tap((filteredValue) => console.log('input value after filter', filteredValue)),
          debounceTime(300),
          tap((debouncedValue) => console.log('input value after debounce', debouncedValue)),
          distinctUntilChanged(),
          tap((distinctValue) => console.log('input value after distinctUntilChanged', distinctValue)),
        )
        .subscribe((searchTerm) => this.searchTerm.set(searchTerm));
    });
  }
}
