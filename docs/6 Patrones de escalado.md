# 6 Patrones de escalado

Reparto de responsabilidades y reutilización de código.

## 6.1 Patrón Container/Presenter

Separación de la lógica de presentación y la lógica de negocio.

> Carpeta routes/home

### 6.1.1 Extraer presentación a un componente simple

`routes/home/activity.component`

```bash
# Create presentational home componente
ng g c routes/home/activity
```

- Move presentational logic

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

- move imports and declare input

```typescript
{
 imports: [CurrencyPipe, DatePipe, RouterLink],
}
activity = input.required<Activity>();
```

### 6.1.2 Refactorizar componente contenedor inteligente

`routes/home/home.page`

- cambiar imports

```typescript
imports: [ActivityComponent],
```

- declarar uso de componente

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

## 6.2 Servicios e inyección de dependencias

> Carpeta routes/home

### 6.2.1 Extraer lógica y datos a un servicio fachada

`routes/home/home.service`

```bash
# Create home service
ng g s routes/home/home
```

```typescript
@Injectable({
  providedIn: "root",
})
export class HomeService {
  #http = inject(HttpClient);
  #apiUrl = "http://localhost:3000/activities";

  getActivities() {
    return this.#http.get<Activity[]>(this.#apiUrl);
  }
}
```

### 6.2.2 Inyectar dependencias en el componente contenedor

`routes/home/home.page`

```typescript
export default class HomePage {
  #service = inject(HomeService);
  activities: Signal<Activity[]> = toSignal(this.#service.getActivities(), { initialValue: [] });
}
```

## 6.3 Principio DRY con código compartido

Reutilización de código en componentes.

> Carpeta shared

### 6.3.1 Componentes reutilizables

```bash
# generate activity-state component
ng g s shared/ui/activity-state
```

`shared/ui/activity-state.component`

### 6.3.2 Servicios y utilidades de datos comunes

```bash
# generate activities service
ng g s shared/api/activities
# go to shared/api folder
cd shared/api
# create file api.functions.ts
touch api/signal.functions.ts
```

`shared/api/activities.service`

```typescript
@Injectable
export class ActivitiesService {
  #http = inject(HttpClient);
  #apiUrl = "http://localhost:3000/activities";

  getActivities() {
    return this.#http.get<Activity[]>(this.#apiUrl);
  }
}
```

`shared/api/signal.functions`

```typescript
export type ApiTarget$<T, K> = (sourceValue: T) => Observable<K>;

export function toSignalMap<T, K>(source: Signal<T>, apiTarget$: ApiTarget$<T, K>, initialValue: K): Signal<K> {
  const source$ = toObservable(source);
  const apiResult$ = source$.pipe(switchMap(apiTarget$));
  return toSignal(apiResult$, { initialValue });
}
```

`bookings.page`

```typescript
activity: Signal<Activity> = toSignalMap(this.slug, (slug) => this.#service.getActivityBySlug$(slug), NULL_ACTIVITY);
```

### 6.3.3 Lógica y tipos de dominio

```bash
# go to shared folder
cd shared
# move domain into shared
mv domain shared
touch domain/activity.functions.ts
```

`shared/domain/activity.type`
`shared/domain/booking.type`

`shared/domain/activity.functions`
