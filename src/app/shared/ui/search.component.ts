import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
type EventArg = { target: { value: string } };
@Component({
  selector: 'lab-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form>
      <label>Search activities</label>
      <input #searchInput id="search" type="search" placeholder=" Start typing..." />
    </form>
  `,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Output() search = new EventEmitter<string>();

  /**
   * Connects to the search input through a rxjs stream to the event emitter
   * @description
   */
  ngAfterViewInit(): void {
    const searchElement = this.searchInput.nativeElement;
    fromEvent<EventArg>(searchElement, 'input')
      .pipe(
        debounceTime(300),
        map((event: EventArg) => event.target.value),
        filter((value: string) => value.length == 0 || value.length >= 2),
        distinctUntilChanged(),
      )
      .subscribe((value) => this.search.emit(value));
  }
}
