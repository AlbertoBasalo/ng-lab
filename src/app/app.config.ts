import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor } from '@core/auth/auth.interceptor';
import { ErrorService } from '@core/error.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: ErrorService },
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),

    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
