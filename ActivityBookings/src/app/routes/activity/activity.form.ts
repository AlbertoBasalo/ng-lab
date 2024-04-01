import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity } from '@domain/activity.type';
import { ControlComponent } from '@ui/control.component';

@Component({
  selector: 'lab-activity',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ControlComponent],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <lab-control controlName="name" labelDisplay="Activity Name" [errors]="form.controls['name'].errors">
        <input formControlName="name" [attr.aria-invalid]="form.controls['name'].invalid" />
      </lab-control>
      <lab-control controlName="location" labelDisplay="Location" [errors]="form.controls['location'].errors">
        <input
          id="location"
          type="text"
          formControlName="location"
          [attr.aria-invalid]="form.controls['location'].invalid" />
      </lab-control>
      <lab-control controlName="price" labelDisplay="Price" [errors]="form.controls['price'].errors">
        <input id="price" type="number" formControlName="price" [attr.aria-invalid]="form.controls['price'].invalid" />
      </lab-control>
      <lab-control controlName="date" labelDisplay="Date" [errors]="form.controls['date'].errors">
        <input id="date" type="date" formControlName="date" [attr.aria-invalid]="form.controls['date'].invalid" />
      </lab-control>
      <lab-control
        controlName="minParticipants"
        labelDisplay="Minimum Participants"
        [errors]="form.controls['minParticipants'].errors">
        <input
          id="minParticipants"
          type="number"
          formControlName="minParticipants"
          [attr.aria-invalid]="form.controls['minParticipants'].invalid" />
      </lab-control>
      <lab-control
        controlName="maxParticipants"
        labelDisplay="Maximum Participants"
        [errors]="form.controls['maxParticipants'].errors">
        <input
          id="maxParticipants"
          type="number"
          formControlName="maxParticipants"
          [attr.aria-invalid]="form.controls['maxParticipants'].invalid" />
      </lab-control>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
})
export class ActivityForm {
  save = output<Activity>();
  form: FormGroup = new FormGroup({
    name: new FormControl('A', Validators.required),
    location: new FormControl('D', Validators.required),
    price: new FormControl('0', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    minParticipants: new FormControl('0', Validators.required),
    maxParticipants: new FormControl('10', Validators.required),
  });

  onSubmit() {
    this.save.emit(this.form.value);
  }
}
