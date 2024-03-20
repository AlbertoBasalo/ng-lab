import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/** Starting point
 * @param {AppComponent} AppComponent - The root component of the application
 * @param {appConfig} appConfig - The configuration of the application
 */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
