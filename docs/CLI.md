# Angular v17 Lab scripts

## Generate project

```bash
# install angular cli
npm install -g @angular/cli@17.0.0
# command to create this project
ng new ng-lab -s -t -p=lab -S --ssr --style=css
# add eslint and prettier
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier prettier typescript npm-check-updates standard-version
```

### Run project

```bash
# install dependencies
npm install
# run project
npm start
```

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
```

## Layout

```bash
npm i @picocss/pico
ng g c layout/header
ng g c layout/footer
```

## Home page

```bash
ng g c routes/home/home --type=page
```

## Auth pages

```bash
ng g c routes/auth/register --type=page
ng g c routes/auth/register --type=form
ng g c routes/auth/login --type=page
ng g c routes/auth/login --type=form
ng g c routes/auth/profile --type=page
ng g c routes/auth/profile
ng g s routes/auth/auth
ng g s routes/auth/profile
```

## API

```bash
npm i -D json-server json-server-auth
npm i -D copyfiles
```

## Activities page

```bash
ng g c routes/activities/activities --type=page
ng g c routes/activities/activities --type=list
ng g s routes/activities/activities
```

## Activity/slug details page

```bash
ng g c routes/activities/slug/activity-slug --type=page
ng g c routes/activities/slug/activity-slug
ng g c routes/activities/slug/activity-slug-footer
ng g s routes/activities/slug/activity-slug
```

## Search Component

```bash
ng g c shared/search
```

## Working and Error Components

```bash
ng g c shared/ui/working
ng g c shared/ui/error
ng g c shared/ui/status
```

## Core services

```bash
ng g s core/error
ng g interceptor core/auth
ng g interceptor core/base
```

## Shared services

```bash
ng g s shared/services/navigation-effect
ng g s shared/services/storage-effect
ng g s shared/services/window
ng g s shared/services/log
ng g g shared/services/auth
```

## Create a new activity

```bash
ng g c routes/activities/new-activity --flat=false --skip-selector --style=none --type=page
ng g c routes/activities/new-activity --flat=false --type=form
ng g s routes/activities/new-activity
```

## Shared components

```bash
ng g c shared/ui/label-data
```

## Bookings page

```bash
ng g c routes/bookings/bookings --type=page
ng g c routes/bookings/bookings --type=list
ng g s routes/bookings/bookings
```

## Notifications feature

```bash
ng g c core/notifications
ng g class shared/services/notifications --type=store
```

## Page template component

```bash
ng g c shared/ui/page --type=template
ng g c shared/ui/list --type=template
```

## New booking feature

```bash
ng g c routes/bookings/new-booking --flat=false --skip-selector --style=none --type=page
ng g c routes/bookings/new-booking --flat=false --type=form
ng g s routes/bookings/new-booking/new-booking
ng g class routes/bookings/new-booking/new-booking --type=page-store
```

## Activity/slug admin page

```bash
ng g c routes/activities/slug/admin/activity-slug-admin --type=page
ng g c routes/activities/slug/admin/activity-slug-admin
ng g class routes/activities/slug/admin/activity-slug-admin --type=page-store
ng g s routes/activities/slug/admin/activity-slug-admin
```
