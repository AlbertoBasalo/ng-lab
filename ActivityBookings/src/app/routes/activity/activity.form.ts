import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity } from '@domain/activity.type';

@Component({
  selector: 'lab-activity',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <label for="name">
        <span>Name</span><small>{{ form.controls['name'].errors | json }}</small>
        <input id="name" type="text" formControlName="name" [attr.aria-invalid]="form.controls['name'].invalid" />
      </label>
      <label for="price">
        <span>Price</span><small>{{ form.controls['price'].errors | json }}</small>
        <input id="price" type="number" formControlName="price" [attr.aria-invalid]="form.controls['price'].invalid" />
      </label>
      <label for="date">
        <span>Date</span><small>{{ form.controls['date'].errors | json }}</small>
        <input id="date" type="date" formControlName="date" [attr.aria-invalid]="form.controls['date'].invalid" />
      </label>
      <label for="location">
        <span>Location</span><small>{{ form.controls['location'].errors | json }}</small>
        <input
          id="location"
          type="text"
          formControlName="location"
          [attr.aria-invalid]="form.controls['location'].invalid" />
      </label>
      <label for="minParticipants">
        <span>Min participants</span><small>{{ form.controls['minParticipants'].errors | json }}</small>
        <input
          id="minParticipants"
          type="number"
          formControlName="minParticipants"
          [attr.aria-invalid]="form.controls['minParticipants'].invalid" />
      </label>
      <label for="maxParticipants">
        <span>Max participants</span><small>{{ form.controls['maxParticipants'].errors | json }}</small>
        <input
          id="maxParticipants"
          type="number"
          formControlName="maxParticipants"
          [attr.aria-invalid]="form.controls['maxParticipants'].invalid" />
      </label>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityForm {
  save = output<Activity>();
  form: FormGroup = new FormGroup({
    name: new FormControl('A', Validators.required),
    price: new FormControl('0', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    location: new FormControl('D', Validators.required),
    minParticipants: new FormControl('0', Validators.required),
    maxParticipants: new FormControl('10', Validators.required),
  });

  onSubmit() {
    this.save.emit(this.form.value);
  }
}
