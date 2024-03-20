import { ChangeDetectionStrategy, Component, Signal, computed, input } from '@angular/core';
/**
 * Component for presenting the participants of an activity
 */
@Component({
  selector: 'lab-participants',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4>Participants</h4>
    <div>Already Participants: {{ alreadyParticipants() }}</div>
    <div>Max Participants: {{ activity().maxParticipants }}</div>
    <ul>
      <li>New Participants: {{ newParticipants() }}</li>
      <li>Remaining places: {{ remainingPlaces() }}</li>
      <li>Total participants: {{ totalParticipants() }}</li>
    </ul>
    <div>
      @for (participant of participants(); track participant.id) {
        <span [attr.data-tooltip]="participant.id">🏃</span>
      } @empty {
        <span>🕸️</span>
      }
    </div>
  `,
})
export class ParticipantsComponent {
  // * Input signals division

  /** The activity to be presented */
  activity = input.required<{ maxParticipants: number }>();
  /** The number of already booked participants */
  alreadyParticipants = input.required<number>();
  /** The number of new participants */
  newParticipants = input.required<number>();
  /** The number of remaining places */
  remainingPlaces = input.required<number>();
  /** The total number of participants */
  totalParticipants = input.required<number>();

  // * Computed division

  /** The participants (a fake array at the moment) to be presented */
  participants: Signal<{ id: number }[]> = computed(() => {
    const length = this.totalParticipants();
    const fakeParticipants = [];
    for (let i = 0; i < length; i++) {
      fakeParticipants.push({ id: fakeParticipants.length + 1 });
    }
    return fakeParticipants;
  });
}
