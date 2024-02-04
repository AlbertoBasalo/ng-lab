# 5 Comunicaciones HTTP

Envío, recepción y manejo de datos asínconos

## 5.1 Consumo de un API Rest.

### 5.1.1 Reading data

```bash
npm i -D json-server json-server-auth
npm i -D copyfiles
#script "api": "json-server-auth ./db/prod/d.json -r ./db/r.json -d 2000",
npm run api
```



```typescript
//config provider
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
  ],
};

```

```typescript
// Home Page
export default class HomePage {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';
  activities = signal<Activity[]>([]);

  constructor() {
    this.#http$.get<Activity[]>(this.#apiUrl).subscribe((activities) => {
      this.activities.set(activities);
    });
  }
}
```

```typescript
// Bookings Page
export default class BookingsPage {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';
  slug = input<string>();

  activity = signal<Activity>(NULL_ACTIVITY);
  
  constructor() {
    effect(() => this.#getActivityBySlug(), { allowSignalWrites: true });
    effect(() => this.#fillParticipants(), { allowSignalWrites: true });
    effect(() => this.#changeStatus());
  }

  #getActivityBySlug() {
	const url = `${this.#apiUrl}?slug=${this.slug()}`;
    this.#http$.get<Activity[]>(url).subscribe((activities) => {
      this.activity.set(activities[0] || NULL_ACTIVITY);
    });;
  }
```

### 5.1.2 Posting data

> sacar el tema de las señales de este problem y mostrar sólo el post y el update ❓

```typescript
// Bookings Page
export default class BookingsPage {
  #http$ = inject(HttpClient);
  #activitiesUrl = 'http://localhost:3000/activities';
  #bookingsUrl = 'http://localhost:3000/bookings';
  
  onBookClick() {
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
    this.#http$.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error('Error creating booking', error),
    });
  }

  #updateActivityStatus() {
    if (this.booked()) {
      const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
      this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
        next: () => console.log('Activity status updated'),
        error: (error) => console.error('Error updating activity status', error),
      });
    }
  }    
}
```



```typescript
// Bookings Page
export default class BookingsPage {  
  constructor() {
    effect(() => this.#getActivityBySlug(), { allowSignalWrites: true });
    effect(() => this.#getActivityParticipants(), { allowSignalWrites: true });
    effect(() => this.#fillParticipants(), { allowSignalWrites: true });
    effect(() => this.#changeStatus());
    effect(() => this.#updateActivityStatus());
  }
    
  #getActivityBySlug() {
    const activityUrl = `${this.#activitiesUrl}?slug=${this.slug()}`;
    this.#http$.get<Activity[]>(activityUrl).subscribe((activities) => {
      this.activity.set(activities[0] || NULL_ACTIVITY);
    });
  }

  #getActivityParticipants() {
    const id = this.activity().id;
    if (id === 0) return;
    const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
    this.#http$.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }
}
```

> Traer la lección sobre asincronismo y señales a este punto ❓

> Dejar la lección de operadores (map, tap)  para el final ❓

## 5.2 Operadores comunes de RxJS.

### 5.2.1 To Do

### 5.2.2 To Do

## 5.3 Asincronismo y señales

### 5.3.1 To Do

### 5.3.2 To Do



