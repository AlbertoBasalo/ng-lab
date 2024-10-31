import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * A custom attribute directive that validates a password
 * @requires NG_VALIDATORS provider to work
 * @implements `Validator` with the `validate` method
 */
@Directive({
  selector: '[labValidPassword]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidPasswordDirective, multi: true }],
})
export class ValidPasswordDirective implements Validator {
  /**
   * Validates a password
   * - Will be called by the angular forms framework
   * @param control - The control to validate
   * @returns The validation errors (invalid) or null (valid)
   */
  validate(control: AbstractControl): ValidationErrors | null {
    const NO_ERRORS = null;
    const password = control.value;
    const hasDigits = /\d/.test(password);
    if (!hasDigits) {
      return { hasDigits: 'Password must contain at least one digit' };
    }
    const hasLetters = /[a-zA-Z]/.test(password);
    if (!hasLetters) {
      return { hasLetters: 'Password must contain at least one letter' };
    }
    return NO_ERRORS;
  }
}
