import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

/* const launches = LAUNCHES_DB;
launches.forEach((launch) => {
  console.log(launch.id, calculateLaunchStatus(launch));
}); */
