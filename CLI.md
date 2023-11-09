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
ng g c layout/header
ng g c layout/footer
```

## Main pages

```bash
ng g c routes/home --type=page
ng g c routes/about --type=page
```

## Security pages

```bash
ng g c routes/auth/login --type=page
ng g c routes/auth/register --type=page
```
