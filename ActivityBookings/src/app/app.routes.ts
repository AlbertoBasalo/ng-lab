import { Routes } from '@angular/router';
import { authGuard } from './core/providers/auth.guard';
import { activityResolver } from './routes/activity/bookings/activity.resolver';

/**
 * Routes configuration for the application
 * Contains the different routes with their components and guards
 * The routes are lazy loaded to improve the performance
 * The routes are protected by the authGuard to check if the user is authenticated
 * The bookings route uses the activityResolver to load the activity data
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/home/home.page'),
  },
  {
    path: 'activity',
    loadComponent: () => import('./routes/activity/activity.page'),
  },
  {
    path: 'activity/bookings/:slug',
    loadComponent: () => import('./routes/activity/bookings/bookings.page'),
    canActivate: [authGuard],
    resolve: {
      activity: activityResolver,
    },
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./routes/auth/login/login.page'),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./routes/auth/register/register.page'),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./routes/favorites/favorites.page'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
