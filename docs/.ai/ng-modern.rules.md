# Angular Modern rules

General guidelines for projects compatible with modern Angular (17 or higher).

## Angular modern modules

### No Modules, but still folders

- Create a `core` folder for global providers.
- Create a `core/layout` folder for layout components.
- Create a `shared/ui` folder for basic UI components.

This is the import graph for the root `AppModule`.

```text
App
  |- Core
    |- Layout
      |- Atoms
```

### Lazy Routes

- Declare a `routes/feature` module for each routed feature of the application.

This is the import graph for the lazy `FeatureModule`.

```text
Feature
  |- Shared
    |- Ui
```

## Angular modern components

- Use `standalone: true` for components, directives, and pipes.
- Export components, directives, and pipes from the shared modules (Atoms and UI).
- Export the Layout component to be used in the AppComponent.
- Use auto close tags for templates.
- Use `@if` and `@for` conditional and repetitive structures.
- Use `@defer` and `@placeholder` for lazy loading components.

Angular.json configuration for cli schematics.

```json
{
  "schematics": {
    "@schematics/angular:component": {
      "changeDetection": "OnPush",
      "flat": true,
      "inlineStyle": true,
      "inlineTemplate": true,
      "skipTests": true,
      "standalone": true
    }
  }
}
```

### Types of components

- **Container**: Use services to get and manage data. Use type `page` for routed pages or `widget` for embedded components.
- **Presenter**: Receives data through `@Input()` and emits events through `@Output()` properties without changing it. Can be shared or not. Use default `component` type.
- **Atom**: Basic presentation components eager loaded and used across the application. Use type `atom`.

Example of CLI commands to generate those components.

```bash
# An atom component
ng g c shared/atoms/my-atom --export=true --type=atom

# A shared block component
ng g c shared/ui/my-block --export=true --type=block

# A page component
ng g c routes/home/home  --skip-selector=true --type=page

# A feature component
ng g c routes/home/product-list

# A widget component
ng g c somewhere/my-widget --export=true --type=widget
```

## Injectable services

- Use `providedIn: 'root'` by default for every service, even if it's used only in a specific feature.
- Exceptionally provide services for certain components or features with an empty `@Injectable()` decorator.
- Use function `inject(token)` to get services in components, directives, and pipes.
- Do not use constructor injection in components, directives, and pipes.
- Generate a service for every page or widget component.

### Inversion of control

- In certain cases, use `@Injectable` to declare a class token that can be provided with an specific instance in a specific module.

```typescript
// service.ts
@Injectable()
export class MyService {
  // Could be abstract
}
```

```typescript
// custom-service.ts
export class CustomService extends MyService {
  // Custom implementation
}
```

```typescript
// module.ts
@NgModule({
  providers: [{ provide: MyService, useClass: CustomService }],
})
export class MyModule {
  // could use `useValue` to provide a specific instance
  // could use `useFactory` to provide a dynamic instance
  // could also be provided for a component or feature
}
```

### Framework customization

- Some framework behaviors can be customized with IoC.

> For example, the Http Interceptors feature.

```typescript
// module.ts
@NgModule({
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true }],
})
export class CoreModule {}
```

## Angular routing

- Use a routing module to declare the routes for root or for a feature module.
- Use lazy modules for every feature route of the application.
- Use guards to prevent access to routes that are not allowed.
- Prefer loading data in components, use resolvers if can be shared across multiple components.
- Prefer `routerLink` for navigation over `router.navigate()`.

## Http

- Use `HttpClientModule` to send requests.
- Use `HttpInterceptor` to handle requests and responses globally for authentication, logging, etc.
- Declare Repository services to manage resources from an API following the clean architecture pattern.

Example of shared repository service.

```typescript
// resource-repository.service.ts
@Injectable({ providedIn: "root" })
export class ResourceRepositoryService {
  readonly #baseUrl = "https://api.example.com/resources";
  readonly #http = inject(HttpClient);

  getAll(): Observable<Resource[]> {
    return this.#http.get<Resource[]>(`${this.#baseUrl}/`);
  }

  getById(id: string): Observable<Resource> {
    return this.#http.get<Resource>(`${this.#baseUrl}/${id}`);
  }

  post(resource: Partial<Resource>): Observable<Resource> {
    return this.#http.post<Resource>(this.#baseUrl, resource);
  }
}
```

## Signals

- Use signals for data binding and change detection on every component.
- Use `computed` to create derived data.
- Use `effect` only when necessary to perform side effects, that do not change the component state.
- Use `toSignal(observable$)` to bind observables to the view.
- Use `toObservable(signal)` to pass a signal to a non-Angular service.

## Non Angular domain and utilities

- Use a `shared/domain` folder for entities, types, interfaces, and constants.
- Use a `shared/util` folder for functions, helpers, etc.
- Test utilities and entities without the need of Angular modules.

## Testing

- Do end-to-end tests for user interactions with Cypress (or Playwright).
- Do integration tests for logic services (with real dependencies), but mock http services.
- Do unit tests for entities and utilities.
- Consider when make sense to unit test your declarables (components, directives, and pipes).
