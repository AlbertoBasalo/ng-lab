# Test with Jest

## Desinstalar Karma y Jasmine

```bash
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter @types/jasmine jasmine-core
```

## Instalar Jest

```bash
npm install -D jest @types/jest
```

Asignar Jest en el archivo angular.json

```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:jest",
    "options": {
      "polyfills": ["zone.js", "zone.js/testing"],
      "tsConfig": "tsconfig.spec.json"
    }
  }
}
```

## Incluir tipos Jest en `tsconfig.spec.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```
