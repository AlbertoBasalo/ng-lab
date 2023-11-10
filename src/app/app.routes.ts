import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./routes/home/home.page') },
  { path: 'about', loadComponent: () => import('./routes/about.page') },
  {
    path: 'auth/register',
    loadComponent: () => import('./routes/auth/register.page'),
  },
  {
    path: 'activities/:slug',
    loadComponent: () => import('./routes/activities/activity-details.page'),
  },
  { path: '**', redirectTo: 'home' },
];
