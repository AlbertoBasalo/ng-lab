import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@routes/home/home.page'),
  },
  {
    path: 'auth',
    loadChildren: () => import('@routes/auth/auth.routes'),
  },
  {
    path: 'activities',
    loadChildren: () => import('@routes/activities/activities.routes'),
  },
  {
    path: 'bookings',
    loadChildren: () => import('@routes/bookings/bookings.routes'),
  },
  { path: '**', redirectTo: 'home' },
];
