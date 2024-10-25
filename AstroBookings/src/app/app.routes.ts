import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/home/home.page'),
  },
  {
    path: 'about',
    loadComponent: () => import('./routes/about/about.page'),
  },
  {
    path: 'login',
    loadComponent: () => import('./routes/login/login.page'),
  },
  {
    path: 'launches/:id/bookings',
    loadComponent: () => import('./routes/launches/bookings/bookings.page'),
  },
];
