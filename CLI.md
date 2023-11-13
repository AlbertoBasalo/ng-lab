# Angular v17 Lab scripts

## Generate project

```bash
# install angular cli
npm install -g @angular/cli@17.0.0
# command to create this project
ng new ng-lab -s -t -p=lab -S --ssr --style=css
```

### Run project

```bash
# install dependencies
npm install
# run project
npm start
# add eslint and prettier
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier prettier typescript
```

````

### Configure project schematics

```json
{
  "@schematics/angular:component": {
    "changeDetection": "OnPush",
    "flat": true,
    "inlineStyle": false,
    "inlineTemplate": true,
    "skipTests": true,
    "style": "none"
  }
}
````

## Layout

```bash
npm i @picocss/pico
ng g c layout/header
ng g c layout/footer
```

## Main pages

```bash
ng g c routes/home/home --type=page
ng g c routes/about/about --type=page
```

## Security pages

```bash
ng g c routes/auth/register --type=page
ng g c routes/auth/register --type=form
```

## Home page

```bash
ng g c routes/home/activities --type=list
ng g s routes/home/activities
```

## Activity details page

```bash
ng g c routes/activities/activity-details --type=page
ng g c routes/activities/activity-details
ng g s routes/activities/activity-details
```

## Search Component

```bash
ng g c shared/search
```
