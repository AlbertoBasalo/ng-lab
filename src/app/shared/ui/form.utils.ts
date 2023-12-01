import { AbstractControl, FormGroup, Validators } from '@angular/forms';

export const passwordValidators = [
  Validators.required,
  Validators.minLength(4),
];

/**
 * Checks if the control is invalid
 * @param form The form group holding the control
 * @param controlName The name of the control to check
 * @returns True if the control is invalid, false otherwise
 */
export function showError(form: FormGroup, controlName: string) {
  const control: AbstractControl | null = form.get(controlName);
  if (!control) return false;
  return control.invalid;
}

/**
 * Marks the control after it has been touched
 * @param form The form group holding the control
 * @param controlName The name of the control to check
 * @returns True if the control is invalid, false otherwise
 */
export function markError(form: FormGroup, controlName: string) {
  const control: AbstractControl | null = form.get(controlName);
  if (!control) return null;
  if (!control.touched) return null;
  return control.invalid;
}
