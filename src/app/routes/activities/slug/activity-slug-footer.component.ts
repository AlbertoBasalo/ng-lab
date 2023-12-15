import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';

@Component({
  selector: 'lab-activity-slug-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      @if (isOwner()) {
        <button id="editActivity" (click)="edit.emit()">Edit and manage your activity</button>
      } @else {
        @if (isBookable()) {
          <p>{{ availableText() }}</p>
          @if (availablePlaces() > 0) {
            <button id="bookingActivity" (click)="booking.emit()">Book now</button>
          }
        }
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlugFooterComponent {
  @Input({ required: true }) isOwner!: Signal<boolean>;
  @Input({ required: true }) availableText!: Signal<string>;
  @Input({ required: true }) isBookable!: Signal<boolean>;
  @Input({ required: true }) availablePlaces!: Signal<number>;
  @Output() booking = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}
