import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { LabelDataComponent } from '@shared/ui/label-data.component';

@Component({
  selector: 'lab-activity-slug',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, LabelDataComponent],
  styles: `
    .data {
      font-weight: bold;
    }
  `,
  template: `
    <section name="ActivityDetails">
      <lab-label-data label="State" [data]="activity().status" />
      <lab-label-data label="Price" [data]="activity().price" unit="€" />
      <lab-label-data label="Date" [data]="activity().date | date: 'fullDate'" />
      <lab-label-data label="Minimum" [data]="activity().minParticipants" unit="participants" />
      <lab-label-data label="Maximum Capacity" [data]="activity().maxParticipants" unit="participants" />
      <lab-label-data label="Current" [data]="participants()" unit="booked" />
      <lab-label-data label="Available" [data]="availablePlaces()" unit="places" />
    </section>
  `,
})
export class ActivitySlugComponent {
  // I/O division
  @Input({ required: true }) activity!: Signal<Activity>;
  @Input({ required: true }) participants!: Signal<number>;
  @Input({ required: true }) availablePlaces!: Signal<number>;

  // Data division
}
