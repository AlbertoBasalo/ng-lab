import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  tap,
} from 'rxjs';
type EventArg = { target: { value: string } };
@Component({
  selector: 'lab-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      #searchInput
      id="search"
      type="search"
      placeholder="Type fo find..."
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Output() search = new EventEmitter<string>();

  ngAfterViewInit(): void {
    fromEvent<EventArg>(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        map((event) => event.target.value),
        filter((value: string) => value.length == 0 || value.length >= 2),
        distinctUntilChanged(),
        tap((value) => console.log('search_input', value)),
      )
      .subscribe((value) => this.search.emit(value));
  }
}
