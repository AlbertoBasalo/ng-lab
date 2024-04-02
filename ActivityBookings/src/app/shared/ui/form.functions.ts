import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Match validator
 * @param controlName The first form control
 * @param matchingControlName The second form control
 * @returns The validator function that checks if both values are equal
 */
export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  // Main function is a factory that returns the validator function for the current form
  return (form: AbstractControl): ValidationErrors | null => {
    const first = form.get(controlName);
    const second = form.get(matchingControlName);

    if (first && second && first.value !== second.value) {
      const validationErrors: ValidationErrors = { dataMismatch: true };
      second.setErrors(validationErrors);
      return validationErrors;
    }

    return null;
  };
}

/** Range validator
 * @param minControlName The form control with the minimum value
 * @param maxControlName The second form control with the maximum value
 * @returns The validator function that checks if min <= max
 */
export function rangeValidator(minControlName: string, maxControlName: string): ValidatorFn {
  // Main function is a factory that returns the validator function for the current form
  return (form: AbstractControl): ValidationErrors | null => {
    const min = form.get(minControlName);
    const max = form.get(maxControlName);

    if (min && max && min.value > max.value) {
      const validationErrors: ValidationErrors = { rangeMismatch: true };
      max.setErrors(validationErrors);
      return validationErrors;
    }

    return null;
  };
}
