import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { provideErrorHandler } from './core/error.service';

/**
 * The configuration of the application
 * It provides client hydration for server-side rendering
 * It provides the HTTP client with fetch and an auth interceptor
 * It provides the router with the routes and component input binding
 * It provides the error handler for the application
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideErrorHandler(),
  ],
};
