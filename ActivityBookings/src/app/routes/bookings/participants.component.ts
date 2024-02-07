import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'lab-participants',
  standalone: true,
  imports: [],
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsComponent {
  // input division
  activity = input.required<{ maxParticipants: number }>();
  alreadyParticipants = input.required<number>();
  newParticipants = input.required<number>();
  remainingPlaces = input.required<number>();
  totalParticipants = input.required<number>();

  // computed division
  participants = computed(() => {
    const length = this.totalParticipants();
    const fakeParticipants = [];
    for (let i = 0; i < length; i++) {
      fakeParticipants.push({ id: fakeParticipants.length + 1 });
    }
    return fakeParticipants;
  });
}
