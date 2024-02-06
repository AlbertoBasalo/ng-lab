# 6 Patrones de escalado

Reparto de responsabilidades y reutilización de código.

## 6.1 Patrón Container/Presenter.

### 6.1.1 Crear componente presentational

```bash
# Create presentational home componente
ng g c routes/home/activity
# Move presentational logic
```

```html
<div>
  <span>
    <a [routerLink]="['/bookings', activity().slug]">{{ activity().name }}</a>
  </span>
  <span>{{ activity().location }}</span>
  <span>{{ activity().price | currency }}</span>
  <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
</div>
```

move imports ` imports: [CurrencyPipe, DatePipe, RouterLink],`

declare input

```typescript
activity = input.required<Activity>();
```

#### 6.1.1.2 🚫 Bookings example

```bash
# Create presentational bookings componente
ng g c routes/bookings/bookings
# Move presentational logic
```

```css
.draft {
  color: aqua;
  font-style: italic;
}
.published {
  color: navy;
}
.confirmed {
  color: green;
}
.sold-out {
  color: teal;
  font-style: italic;
}
.done {
  color: olive;
  font-style: italic;
}
.cancelled {
  color: maroon;
  font-style: italic;
}
```

```html
<article>
  <header>
    <h2>{{ activity().name }} at {{ activity().location }}</h2>
    <div>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      <span [class]="activity().status">{{ activity().status | uppercase }}</span>
    </div>
  </header>
  <main>
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
  </main>
  <footer>
    @if (isBookable()) {
    <h4>New Bookings</h4>
    @if (remainingPlaces() > 0) {
    <label for="newParticipants">How many participants want to book?</label>
    <input
      type="number"
      name="newParticipants"
      [ngModel]="newParticipants()"
      (ngModelChange)="onNewParticipantsChange($event)"
      min="0"
      [max]="maxNewParticipants()" />
    } @else {
    <div>
      <button class="secondary outline" (click)="onNewParticipantsChange(0)">Reset</button>
      <span>No more places available</span>
    </div>
    }
    <button [disabled]="booked() || newParticipants() === 0" (click)="onBookParticipantsClick()">
      Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
    </button>
    <div>{{ bookedMessage() }}</div>
    }
  </footer>
</article>
```

```typescript
  activity = input<Activity>(NULL_ACTIVITY);
  alreadyParticipants = input(0);
  booked = input(false);
  newParticipants = signal(0);

  maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
  isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));

  participants = signal<{ id: number }[]>([]);

  totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
  remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
  bookingAmount = computed(() => this.newParticipants() * this.activity().price);

  bookedMessage = computed(() => {
    if (this.booked()) return `Booked USD ${this.bookingAmount()}`;
    return '';
  });

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#changeStatusOnTotalParticipants(), ALLOW_WRITE);
  }

  #changeStatusOnTotalParticipants() {
    const totalParticipants = this.totalParticipants();
    const activity = this.activity();
    let newStatus = activity.status;
    if (totalParticipants >= activity.maxParticipants) {
      newStatus = 'sold-out';
    } else if (totalParticipants >= activity.minParticipants) {
      newStatus = 'confirmed';
    } else {
      newStatus = 'published';
    }
    activity.status = newStatus;
    this.participants.update((participants) => {
      participants.splice(0, participants.length);
      for (let i = 0; i < totalParticipants; i++) {
        participants.push({ id: participants.length + 1 });
      }
      return participants;
    });
  }

  onNewParticipantsChange(newParticipants: number) {
    if (newParticipants > this.maxNewParticipants()) {
      newParticipants = this.maxNewParticipants();
    }
    this.newParticipants.set(newParticipants);
  }

  onBookParticipantsClick() {
    const newBooking: Booking = {
      id: 0,
      userId: 0,
      activityId: this.activity().id,
      date: new Date(),
      participants: this.newParticipants(),
      payment: {
        method: 'creditCard',
        amount: this.bookingAmount(),
        status: 'pending',
      },
    };
  }
```

### 6.1.2 Refactorizar component container

```typescript
imports: [ActivityComponent],
```

```html
<article>
  <header>
    <h2>Activities</h2>
  </header>
  <main>
    @for (activity of activities(); track activity.id) {
    <lab-activity [activity]="activity" />
    }
  </main>
</article>
```

#### 6.1.2.2 🚫 Bookings example

```typescript
imports: [BookingsComponent],
```

```html
@if (activity(); as activity) {
<lab-bookings [activity]="activity" [alreadyParticipants]="alreadyParticipants()" />
}
```

```typescript
export default class BookingsPage {
  #http$ = inject(HttpClient);
  #activitiesUrl = "http://localhost:3000/activities";
  #bookingsUrl = "http://localhost:3000/bookings";
  slug = input<string>();
  alreadyParticipants = signal(0);

  activity: Signal<Activity> = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.#http$.get<Activity[]>(`${this.#activitiesUrl}?slug=${slug}`).pipe(
          map((activities) => activities[0] || NULL_ACTIVITY),
          catchError((error) => {
            console.error("Error getting activity", error);
            return of(NULL_ACTIVITY);
          })
        )
      )
    ),
    { initialValue: NULL_ACTIVITY }
  );

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  #getParticipantsOnActivity() {
    const id = this.activity().id;
    if (id === 0) return;
    const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
    this.#http$.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #updateActivityOnBookings() {
    //if (!this.booked()) return;
    // const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
    // this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
    //   next: () => console.log('Activity status updated'),
    //   error: (error) => console.error('Error updating activity', error),
    // });
  }

  // onBookParticipantsClick() {
  //   const newBooking: Booking = {
  //     id: 0,
  //     userId: 0,
  //     activityId: this.activity().id,
  //     date: new Date(),
  //     participants: this.newParticipants(),
  //     payment: {
  //       method: 'creditCard',
  //       amount: this.bookingAmount(),
  //       status: 'pending',
  //     },
  //   };
  //   this.#http$.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
  //     next: () => this.booked.set(true),
  //     error: (error) => console.error('Error creating booking', error),
  //   });
  // }
}
```

### 6.1.3 🚧 Input y Output ❓

> 🚧 Output syntax will change to be the same as input

> ❓ Wait for changes and move to the end?

Parent Container component

```typescript
export default class BookingsPage {
  #http$ = inject(HttpClient);
  #activitiesUrl = "http://localhost:3000/activities";
  #bookingsUrl = "http://localhost:3000/bookings";

  // input division
  slug = input<string>();

  // signal division
  alreadyParticipants = signal(0);
  booked = signal(false);
  activityStatusUpdated = signal(false);

  // interop division
  activity: Signal<Activity> = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.#http$.get<Activity[]>(`${this.#activitiesUrl}?slug=${slug}`).pipe(
          map((activities) => activities[0] || NULL_ACTIVITY),
          catchError((error) => {
            console.error("Error getting activity", error);
            return of(NULL_ACTIVITY);
          })
        )
      )
    ),
    { initialValue: NULL_ACTIVITY }
  );

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  onNewParticipantsChange(totalParticipants: number) {
    let newStatus = this.activity().status;
    if (totalParticipants >= this.activity().maxParticipants) {
      newStatus = "sold-out";
    } else if (totalParticipants >= this.activity().minParticipants) {
      newStatus = "confirmed";
    } else {
      newStatus = "published";
    }
    if (newStatus === this.activity().status) return;
    this.activity().status = newStatus;
    this.activityStatusUpdated.set(true);
  }

  #getParticipantsOnActivity() {
    const id = this.activity().id;
    if (id === 0) return;
    const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
    this.#http$.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #updateActivityOnBookings() {
    if (!this.booked()) return;
    if (!this.activityStatusUpdated()) return;
    const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
    this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
      next: () => console.log("Activity status updated"),
      error: (error) => console.error("Error updating activity", error),
    });
  }

  onNewBooking(newBooking: Booking) {
    this.#http$.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error("Error creating booking", error),
    });
  }
}
```

```html
@if (activity(); as activity) {
<lab-bookings
  [activity]="activity"
  [alreadyParticipants]="alreadyParticipants()"
  [booked]="booked()"
  (book)="onNewBooking($event)"
  (changeParticipants)="onNewParticipantsChange($event)" />
}
```

Child Presenter component

```typescript
export class BookingsComponent {
  // input division
  activity = input<Activity>(NULL_ACTIVITY);
  alreadyParticipants = input(0);
  booked = input(false);
  newParticipants = signal(0);

  // output division
  @Output() book = new EventEmitter<Booking>();
  @Output() changeParticipants = new EventEmitter<number>();

  // signal division
  participants = signal<{ id: number }[]>([]);

  // computed division
  maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
  isBookable = computed(() => ["published", "confirmed"].includes(this.activity().status));
  totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
  remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
  bookingAmount = computed(() => this.newParticipants() * this.activity().price);
  bookedMessage = computed(() => (this.booked() ? `Booked USD ${this.bookingAmount()}` : ""));

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#changeStatusOnTotalParticipants(), ALLOW_WRITE);
  }

  #changeStatusOnTotalParticipants() {
    const totalParticipants = this.totalParticipants();
    this.changeParticipants.emit(totalParticipants);
    this.participants.update((participants) => {
      participants.splice(0, participants.length);
      for (let i = 0; i < totalParticipants; i++) {
        participants.push({ id: participants.length + 1 });
      }
      return participants;
    });
  }

  onNewParticipantsChange(newParticipants: number) {
    if (newParticipants > this.maxNewParticipants()) {
      newParticipants = this.maxNewParticipants();
    }
    this.newParticipants.set(newParticipants);
  }

  onBookParticipantsClick() {
    const newBooking: Booking = {
      id: 0,
      userId: 0,
      activityId: this.activity().id,
      date: new Date(),
      participants: this.newParticipants(),
      payment: {
        method: "creditCard",
        amount: this.bookingAmount(),
        status: "pending",
      },
    };
    this.book.emit(newBooking);
  }
}
```

```html
<article>
  <header>
    <h2>{{ activity().name }} at {{ activity().location }}</h2>
    <div>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      <span [class]="activity().status">{{ activity().status | uppercase }}</span>
    </div>
  </header>
  <main>
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
  </main>
  <footer>
    @if (isBookable()) {
    <h4>New Bookings</h4>
    @if (remainingPlaces() > 0) {
    <label for="newParticipants">How many participants want to book?</label>
    <input
      type="number"
      name="newParticipants"
      [ngModel]="newParticipants()"
      (ngModelChange)="onNewParticipantsChange($event)"
      min="0"
      [max]="maxNewParticipants()" />
    } @else {
    <div>
      <button class="secondary outline" (click)="onNewParticipantsChange(0)">Reset</button>
      <span>No more places available</span>
    </div>
    }
    <button [disabled]="booked() || newParticipants() === 0" (click)="onBookParticipantsClick()">
      Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
    </button>
    <div>{{ bookedMessage() }}</div>
    }
  </footer>
</article>
```

## 6.2 Servicios e inyección de dependencias

> Extraer lógica de negocio e infraestructura a servicios

### 6.2.1 Extraer lógica a un servicio

```bash
# Create home service
ng g s routes/home/home
```

```typescript
@Injectable({
  providedIn: "root",
})
export class HomeService {
  #http$ = inject(HttpClient);
  #apiUrl = "http://localhost:3000/activities";

  getActivities$() {
    return this.#http$.get<Activity[]>(this.#apiUrl);
  }
}
```

```typescript
export default class HomePage {
  #service = inject(HomeService);
  activities: Signal<Activity[]> = toSignal(this.#service.getActivities$(), { initialValue: [] });
}
```

#### 6.2.1.2 🚫 Bookings example

```bash
# Create home service
ng g s routes/home/home
# Create bookings service
ng g s routes/bookings/bookings
```

```typescript
@Injectable({
  providedIn: "root",
})
export class BookingsService {
  #http$ = inject(HttpClient);
  #activitiesUrl = "http://localhost:3000/activities";
  #bookingsUrl = "http://localhost:3000/bookings";

  getActivityBySlug$(slug: string | undefined) {
    if (!slug) return of(NULL_ACTIVITY);
    const url = `${this.#activitiesUrl}?slug=${slug}`;
    return this.#http$.get<Activity[]>(url).pipe(
      map((activities) => activities[0] || NULL_ACTIVITY),
      catchError((_) => of(NULL_ACTIVITY))
    );
  }

  getBookingsByActivityId$(activityId: number) {
    const url = `${this.#bookingsUrl}?activityId=${activityId}`;
    return this.#http$.get<Booking[]>(url);
  }

  postBooking$(booking: Booking) {
    return this.#http$.post<Booking>(this.#bookingsUrl, booking);
  }

  putActivity$(activity: Activity) {
    const url = `${this.#activitiesUrl}/${activity.id}`;
    return this.#http$.put<Activity>(url, activity);
  }
}
```

```typescript
export default class BookingsPage {
  #service = inject(BookingsService);

  slug = input<string>();

  alreadyParticipants = signal(0);
  booked = signal(false);
  activityStatusUpdated = signal(false);

  activity: Signal<Activity> = toSignal(
    toObservable(this.slug).pipe(switchMap((slug) => this.#service.getActivityBySlug$(slug))),
    { initialValue: NULL_ACTIVITY }
  );

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  onNewParticipantsChange(totalParticipants: number) {
    const oldStatus = this.activity().status as string;
    let newStatus = this.activity().status;
    if (totalParticipants >= this.activity().maxParticipants) {
      newStatus = "sold-out";
    } else if (totalParticipants >= this.activity().minParticipants) {
      newStatus = "confirmed";
    } else {
      newStatus = "published";
    }
    if (newStatus === oldStatus) return;
    this.activity().status = newStatus;
    this.activityStatusUpdated.set(true);
  }

  #getParticipantsOnActivity() {
    const id = this.activity().id;
    if (id === 0) return;
    this.#service.getBookingsByActivityId$(id).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #updateActivityOnBookings() {
    if (!this.booked()) return;
    if (!this.activityStatusUpdated()) return;
    this.#service.putActivity$(this.activity()).subscribe({
      next: () => console.log("Activity status updated"),
      error: (error) => console.error("Error updating activity", error),
    });
  }

  onNewBooking(newBooking: Booking) {
    this.#service.postBooking$(newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error("Error creating booking", error),
    });
  }
}
```

## 6.3 Uso funcional, local y global de Signals

### 6.3.1 Simplificación de señales con observables

```bash
# make shared folder
mkdir shared
# move domain into shared
mv domain shared
# make api folder
cd shared
mkdir api
# create file api.functions.ts
touch api/api.functions.ts
```

```typescript
export type ApiTarget$<T, K> = (sourceValue: T) => Observable<K>;

export function toSignalMap<T, K>(source: Signal<T>, apiTarget$: ApiTarget$<T, K>, initialValue: K): Signal<K> {
  const source$ = toObservable(source);
  const apiResult$ = source$.pipe(switchMap(apiTarget$));
  return toSignal(apiResult$, { initialValue });
}
```

```typescript
activity: Signal<Activity> = toSignalMap(this.slug, (slug) => this.#service.getActivityBySlug$(slug), NULL_ACTIVITY);
```

### 6.3.2 Descomposición de componentes y almacén local

```bash

```

```typescript

```

```html

```

### 6.3.3 Comunicación con almacén global

```bash

```

```typescript

```

```html

```
