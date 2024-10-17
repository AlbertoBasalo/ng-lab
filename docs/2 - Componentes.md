# 2 Componentes

Los bloques de construcción de Angular.

## 2.1 Generación de components.

### 2.1.1 EL CLI y el Angular.json

```json
{
  "schematics": {
    "@schematics/angular:component": {
      "changeDetection": "OnPush",
      "flat": true,
      "inlineTemplate": true,
      "inlineStyle": true,
      "skipTests": true,
      "standalone": true
    }
  }
}
```

```bash
ng g environments
ng g c core/layout/header
ng g c core/layout/footer
```

## 2.2 Anatomía de un componente: plantillas y lógica.

> **Contexto** explícito en el imports de cada componente standalone.

```typescript
@Component({
  selector: "lab-root",
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <lab-header />
    <router-outlet />
    <lab-footer />
  `,
  styles: [],
})
export class AppComponent {}
```

### 2.2.1 Plantillas para las vistas

`npm start`

```html
<lab-header />
<p>Angular works!</p>
<router-outlet></router-outlet>
<lab-footer />

<header>
  <nav>
    <a href="">Astro Bookings</a>
  </nav>
</header>

<footer>
  <nav>
    <a [href]="" target="_blank">© 2024 Alberto Basalo</a>
    <button>Accept Cookies</button>
  </nav>
</footer>
```

### 2.2.2 Propiedades y métodos

```html
<header>
  <nav>
    <a href="">{{ title }}</a>
  </nav>
</header>
```

```typescript
export class HeaderComponent {
  title = "Astro Bookings";
}
```

```typescript
export class FooterComponent {
  author = {
    name: "Alberto Basalo",
    homepage: "<https://albertobasalo.dev>",
  };

  year = new Date().getFullYear();

  onAcceptClick() {
    console.log("Cookies accepted!");
  }
}
```

```html
<footer>
  <nav>
    <a [href]="author.homepage">© {{ year }} {{ author.name }}</a>
    <button (click)="onAcceptClick()">Accept Cookies</button>
  </nav>
</footer>
```

## 2.3 Presentación de datos

### 2.3.1 Datos y transformación

```
ng g c bookings/bookings
```

Carpeta `Models` para los modelos

```tsx
@Component({
  selector: "lab-bookings",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  template: ``,
})
export class BookingsComponent {
  launch: LaunchDto = {
    id: "1",
    agencyId: "1",
    rocketId: "1",
    date: new Date(2029, 5, 1),
    mission: "Moon Landing",
    destination: "Moon",
    pricePerSeat: 100,
    status: "scheduled",
  };
  currentTravelers = 3;
}
```

```html
<article>
  <header>
    <h2>{{ launch.mission }}</h2>
    <div [class]="launch.status">
      <span>{{ launch.destination }}</span>
      <span>{{ launch.pricePerSeat | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
      <span>{{ launch.date | date: 'dd/MM/yyyy' }}</span>
      <span>{{ launch.status | uppercase }}</span>
    </div>
  </header>
  <main>
    <p>Travelers: {{ currentTravelers }}</p>
  </main>
  <footer>
    <button>Book now!</button>
    <button>Cancel</button>
  </footer>
</article>
```

### 2.3.2 Custom pipes

```json
"@schematics/angular:pipe": {
    "skipTests": true
},
```

`ng g pipe bookings/launchTitle`

```typescript
@Pipe({
  name: "launchTitle",
})
export class LaunchTitlePipe implements PipeTransform {
  transform(launch: LaunchDto, ...args: unknown[]): string {
    return `${launch.mission} to ${launch.destination}`;
  }
}
```

```html
<header>
  <h2>{{ launch | launchTitle }}</h2>
  <div [class]="launch.status">
    <span>{{ launch.price | currency }}</span>
    <span>{{ launch.date | date }}</span>
    <span>{{ launch.status | uppercase }}</span>
  </div>
</header>
```

### 2.3.3 Estilos

`npm install @picocss/pico`

`"styles": ["node_modules/@picocss/pico/css/pico.min.css", "src/styles.css"],`

// 'scheduled', 'confirmed', 'launched', 'delayed', 'aborted'

```css
.scheduled {
  color: violet;
  font-style: italic;
}
.confirmed {
  color: green;
}
.delayed {
  color: limegreen;
  font-style: italic;
}
.launched {
  color: orange;
  font-style: italic;
}
.aborted {
  color: red;
  font-style: italic;
}
```
