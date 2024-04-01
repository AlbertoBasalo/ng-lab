# 8 - Seguridad y validación de datos

## 8.1. Formularios para recogida segura de datos

`ng g c routes/auth/register --type=form`

```html
<form [formGroup]="form" (submit)="onSubmit()">
  <label for="username">
    <span>Username</span>
    <small>{{ form.controls['username'].errors | json }}</small>
    <input
      id="username"
      type="text"
      formControlName="username"
      [attr.aria-invalid]="form.controls['username'].invalid" />
  </label>
  <label for="email">
    <span>Email</span>
    <small>{{ form.controls['email'].errors | json }}</small>
    <input id="email" type="email" formControlName="email" [attr.aria-invalid]="form.controls['email'].invalid" />
  </label>
  <label for="password">
    <span>Password</span>
    <small>{{ form.controls['password'].errors | json }}</small>
    <input
      id="password"
      type="password"
      formControlName="password"
      [attr.aria-invalid]="form.controls['password'].invalid" />
  </label>
  <label for="confirm">
    <span>Confirm password</span>
    <small>{{ form.controls['confirm'].errors | json }}</small>
    <input
      id="confirm"
      type="password"
      formControlName="confirm"
      [attr.aria-invalid]="form.controls['confirm'].invalid" />
  </label>
  <label for="terms">
    <span>Accept the terms and conditions</span>
    <input id="terms" type="checkbox" formControlName="terms" [attr.aria-invalid]="form.controls['terms'].invalid" />
  </label>
  <button type="submit" [disabled]="form.invalid">Register</button>
</form>
```

```typescript
export class RegisterForm {
  register = output<Register>();

  form: FormGroup = new FormGroup(
    {
      username: new FormControl("A", Validators.required),
      email: new FormControl("a@b.c", [Validators.required, Validators.email]),
      password: new FormControl("1234", [Validators.required, Validators.minLength(4)]),
      confirm: new FormControl("123", [Validators.required, Validators.minLength(4)]),
      terms: new FormControl(false, Validators.requiredTrue),
    },
    {
      validators: matchValidator("password", "confirm"),
    }
  );

  onSubmit() {
    if (this.form.valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm, ...register } = this.form.value;
      this.register.emit(register);
    }
  }
}
```

```typescript
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
```

```html
<article>
  <header>
    <h2>Register</h2>
  </header>
  <main>
    <lab-register (register)="onRegister($event)" />
  </main>
  <footer>
    <a [routerLink]="['/auth', 'login']">Login if already have an account</a>
  </footer>
</article>
```

```typescript
export default class RegisterPage {
  onRegister(register: Register) {
    console.log("Register", register);
  }
}
```

`ng g s shared/api/auth-repository`

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthRepository {
  constructor() {}
}
```
