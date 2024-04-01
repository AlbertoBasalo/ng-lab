import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { activityResolver } from './routes/bookings/activity.resolver';

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
    path: 'auth/login',
    loadComponent: () => import('./routes/auth/login.page'),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./routes/auth/register.page'),
  },
  {
    path: 'bookings/:slug',
    loadComponent: () => import('./routes/bookings/bookings.page'),
    canActivate: [authGuard],
    resolve: {
      activity: activityResolver,
    },
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
