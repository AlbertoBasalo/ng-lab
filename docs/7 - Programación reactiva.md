# 7 Programación reactiva

## 7.1 Un almacén global basado en Signals

### 7.1.1 Crear un store basado en signals

```bash
# Generate as a normal service
ng g s shared/state/favorites-store
# Rename to FavoritesStore class in a favorites.store.ts file
# Add  "@state/*": ["src/app/shared/state/*"] to tsconfig.json
```

```typescript
export class FavoritesStore {
  #state: WritableSignal<string[]> = signal<string[]>([]);

  count: Signal<number> = computed(() => this.#state().length);
  state: Signal<string[]> = this.#state.asReadonly();

  setState(favorites: string[]): void {
    this.#state.set(favorites);
  }
}
```

### 7.1.2 Uso desde páginas o componentes inteligentes

Desde la `home.page.ts`

```typescript
export default class HomePage {
  #service = inject(HomeService);

  #favorites = inject(FavoritesStore);

  activities: Signal<Activity[]> = toSignal(this.#service.getActivities$(), { initialValue: [] });

  favorites: string[] = this.#favorites.state();

  onFavoritesChange(favorites: string[]): void {
    console.log("Favorites changed", favorites);
    this.#favorites.setState(favorites);
  }
}
```

Desde el `header.component.ts`

```typescript
export class HeaderComponent {
  #favorites = inject(FavoritesStore);

  readonly title = "Activity Bookings";

  favCount = this.#favorites.count;
}
```

Renombrarlo como `header.widget` para remarcar su comportamiento inteligente

### 7.1.3 Persistencia y reutilización

`ng g s shared/services/platform`

```typescript
@Injectable({
  providedIn: "root",
})
export class PlatformService {
  #platformId = inject(PLATFORM_ID);
  get isServer() {
    return isPlatformServer(this.#platformId);
  }
  get isBrowser() {
    return !this.isServer;
  }
}
```

`ng g s shared/services/local-repository`

```typescript
export class LocalRepository {
  #platformService = inject(PlatformService);

  save(key: string, value: any): void {
    if (this.#platformService.isServer) return;
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  load<T>(key: string, defaultValue: T): T {
    if (this.#platformService.isServer) return defaultValue;
    const found = localStorage.getItem(key);
    if (found) {
      return JSON.parse(found);
    }
    this.save(key, defaultValue);
    return defaultValue;
  }

  remove(key: string): void {
    if (this.#platformService.isServer) return;
    localStorage.removeItem(key);
  }
}
```

`ng g c routes/favorites --type=page --flat=false`

```typescript
@Component({
  selector: "lab-favorites",
  standalone: true,
  imports: [],
  template: `
    @for (favorite of favorites(); track favorite) {
      <div>{{ favorite }}</div>
      <hr />
    } @empty {
      <div>No favorites yet</div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FavoritesPage {
  #favorites: FavoritesStore = inject(FavoritesStore);
  favorites: Signal<string[]> = this.#favorites.state;
}
```

en el `activity.component`

```html
<input
  type="checkbox"
  name=""
  class="secondary outline"
  [checked]="favorites().includes(activity().slug)"
  (click)="toggleFavorite(activity().slug)" />
```

---

- 2 Flujo de datos unidireccional (buscador)
- 3 Operadores avanzados de RxJs (buscador)
