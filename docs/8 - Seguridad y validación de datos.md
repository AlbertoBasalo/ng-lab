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
  #apiUrl = "http://localhost:3000";
  #http = inject(HttpClient);
  #authStore = inject(AuthStore);
  postRegister$(register: Register): Observable<UserAccessToken> {
    return this.#http
      .post<UserAccessToken>(`${this.#apiUrl}/register`, register)
      .pipe(tap((userAccessToken) => this.#authStore.setState(userAccessToken)));
  }
  postLogin$(login: Login): Observable<UserAccessToken> {
    return this.#http
      .post<UserAccessToken>(`${this.#apiUrl}/login`, login)
      .pipe(tap((userAccessToken) => this.#authStore.setState(userAccessToken)));
  }
}
```

`ng g s shared/state/auth-store`

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  #localRepository: LocalRepository = inject(LocalRepository);
  #state: WritableSignal<UserAccessToken> = signal<UserAccessToken>(NULL_USER_ACCESS_TOKEN);
  isAuthenticated: Signal<boolean> = computed(() => this.#state().accessToken !== "");
  isAnonymous: Signal<boolean> = computed(() => this.#state().accessToken === "");
  userId: Signal<string> = computed(() => this.#state().user.id);
  setState(userAccessToken: UserAccessToken): void {
    this.#state.set(userAccessToken);
  }
}
```

## 8.2. Interceptores de comunicaciones y guardias de navegación

`ng g g core/auth --implements=CanActivate`

```typescript
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(["/auth", "login"]);
};
```

```typescript
export const routes: Routes = [
  {
    path: "bookings/:slug",
    loadComponent: () => import("./routes/bookings/bookings.page"),
    canActivate: [authGuard],
    resolve: {
      activity: activityResolver,
    },
  },
];
```

`ng g r routes/bookings/activity`

```typescript
export const activityResolver: ResolveFn<Activity> = (route: ActivatedRouteSnapshot) => {
  const slug: string = route.paramMap.get("slug") || "";
  const bookingsService = inject(BookingsService);
  return bookingsService.getActivityBySlug$(slug);
};
```

```typescript
export default class BookingsPage {
  #route = inject(ActivatedRoute);
  #resolvedActivity: Activity = this.#route.snapshot.data["activity"];
  activity: Signal<Activity> = signal(this.#resolvedActivity);
}
```

`ng g interceptor core/auth`

```typescript
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authStore = inject(AuthStore);
  const accessToken: string = authStore.accessToken();
  const router: Router = inject(Router);
  req = req.clone({
    setHeaders: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authStore.setState(NULL_USER_ACCESS_TOKEN);
        router.navigate(["/auth", "login"]);
      }
      return throwError(() => error);
    })
  );
};
```

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

## 8.3. Presentación condicional y diferida de feedback al usuario

`ng g c routes/activity/activity --type=page`

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityForm],
  template: `
    <lab-activity (save)="onSave($event)" />
  `,
})
export default class ActivityPage {
  #activityService = inject(ActivityService);

  onSave(activity: Activity) {
    this.#activityService.postActivity$(activity).subscribe();
  }
}
```

`ng g c routes/activity/activity --type=form`

```typescript
export class ActivityForm {
  save = output<Activity>();
  form: FormGroup = new FormGroup({
    name: new FormControl("A", Validators.required),
    price: new FormControl("0", Validators.required),
    date: new FormControl(new Date(), Validators.required),
    location: new FormControl("D", Validators.required),
    minParticipants: new FormControl("0", Validators.required),
    maxParticipants: new FormControl("10", Validators.required),
  });

  onSubmit() {
    this.save.emit(this.form.value);
  }
}
```

`ng g c shared/ui/lab-control`

```typescript
export class ControlComponent {
  /** The form control name to bind to */
  controlName = input.required<string>();
  /** The label to display */
  labelDisplay = input.required<string>();
  /** The errors to display if any */
  errors = input<unknown>();
}
```

```html
<label [for]="controlName()">
  <span>{{ labelDisplay() }}</span>
  @if (errors()) {
  <small>{{ errors() | json }}</small>
  }
  <ng-content />
</label>
```

```html
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
```

`ng g s routes/activity/activity `

```typescript
@Injectable({
  providedIn: "root",
})
export class ActivityService {
  #activitiesRepository = inject(ActivitiesRepository);
  #authStore = inject(AuthStore);

  postActivity$(newActivity: Activity) {
    newActivity.userId = this.#authStore.userId();
    newActivity.slug = (newActivity.name + "-" + newActivity.location).toLowerCase().replace(/ /g, "_");
    return this.#activitiesRepository.postActivity$(newActivity);
  }
}
```

`ng g c shared/ui/feedback`

```typescript
export class FeedbackComponent {
  feedback: InputSignal<Feedback> = input<Feedback>({ status: "idle", message: "" });
  status: Signal<FeedbackStatus> = computed(() => this.feedback().status);
  message: Signal<string> = computed(() => this.feedback().message);
}
```

```html
<div>
  @switch (status()) { @case ('busy') {
  <fieldset role="group">
    <input disabled [value]="message() || 'Busy'" />
    <button disabled aria-busy="true" class="outline">.</button>
  </fieldset>
  } @case ('success') {
  <input disabled aria-invalid="false" [value]="message() || 'Success'" />
  } @case ('error') {
  <input disabled aria-invalid="true" [value]="message() || 'Error'" />
  } }
</div>
```

```typescript
export default class ActivityPage {
  #activityService = inject(ActivityService);
  feedback: WritableSignal<Feedback> = signal<Feedback>({ status: "idle", message: "" });
  onSave(activity: Activity) {
    this.feedback.set({ status: "busy", message: "Saving activity" });
    this.#activityService.postActivity$(activity).subscribe({
      next: () => this.feedback.set({ status: "success", message: "Activity saved" }),
      error: () => this.feedback.set({ status: "error", message: "Failed to save activity" }),
    });
  }
}
```

```html
<lab-activity (save)="onSave($event)" />
<lab-feedback [feedback]="feedback()" />
```

`ng g s shared/state/notifications-store`

```typescript
export type Notification = { message: string; type: "info" | "error" };
@Injectable({
  providedIn: "root",
})
export class NotificationsStore {
  #state: WritableSignal<Notification[]> = signal<Notification[]>([]);

  notifications: Signal<Notification[]> = this.#state.asReadonly();
  count: Signal<number> = computed(() => this.#state().length);

  addNotification(notification: Notification): void {
    this.#state.update((current) => [...current, notification]);
  }
  clearNotifications(): void {
    this.#state.set([]);
  }
}
```

`ng g class core/error.service`

```typescript
export class ErrorService implements ErrorHandler {
  #notificationsStore: NotificationsStore = inject(NotificationsStore);
  handleError(error: any): void {
    const notification: Notification = { message: "An error occurred", type: "error" };
    if (error instanceof HttpErrorResponse) {
      notification.message = error.message;
    } else {
      notification.message = error.toString();
    }
    this.#notificationsStore.addNotification(notification);
  }
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    { provide: ErrorHandler, useClass: ErrorService },
  ],
};
```

`ng g c shared/ui/notifications`

```typescript
export class NotificationsComponent {
  notifications: InputSignal<Notification[]> = input<Notification[]>([]);
  close = output();
}
```

```html
<dialog open>
  <article>
    <header>
      <h2>Notifications</h2>
    </header>
    @for (notification of notifications(); track notification) { @if (notification.type === 'error') {
    <input disabled aria-invalid="true" [value]="notification.message" />
    } @else {
    <input disabled aria-invalid="false" [value]="notification.message" />
    } }
    <footer>
      <button (click)="close.emit()">Close</button>
    </footer>
  </article>
</dialog>
```

```typescript
export class FooterWidget {
  #notificationsStore: NotificationsStore = inject(NotificationsStore);

  showNotification: WritableSignal<boolean> = signal<boolean>(false);

  notifications: Signal<Notification[]> = this.#notificationsStore.notifications;
  notificationsCount: Signal<number> = this.#notificationsStore.count;
  hasNotifications: Signal<boolean> = computed(() => this.notificationsCount() > 0);

  toggleNotifications(): void {
    this.showNotification.update((current) => !current);
  }
  onNotificationsClose(): void {
    this.showNotification.set(false);
    this.#notificationsStore.clearNotifications();
  }
}
```

```html
<footer>
  <nav>
    <span>
      <a [href]="author.homepage" target="_blank">© {{ getYear() }} {{ author.name }}</a>
    </span>
    @if (hasNotifications()) {
    <button [attr.data-tooltip]="notificationsCount()" (click)="toggleNotifications()" class="outline">🔥</button>
    }
    <span>
      @switch (cookiesStatus()) { @case ('pending') {
      <lab-cookies (cancel)="cookiesStatus.set('rejected')" (accept)="cookiesStatus.set($event)" />
      } @case ('rejected') {
      <small data-tooltip="No cookies applied">🍪 ❌</small>
      } @case ('essentials') {
      <small data-tooltip="Essential cookies applied">🍪 ✅</small>
      } @case ('all') {
      <small data-tooltip="All cookies applied">🍪 ✅ ✅</small>
      } }
    </span>
  </nav>
</footer>
@if (showNotification()) {
<lab-notifications [notifications]="notifications()" (close)="onNotificationsClose()" />
}
```
