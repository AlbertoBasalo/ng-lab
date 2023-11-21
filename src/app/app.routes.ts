import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./routes/home/home.page') },
  {
    path: 'auth/login',
    loadComponent: () => import('./routes/auth/login.page'),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./routes/auth/register.page'),
  },
  {
    path: 'activities',
    loadComponent: () => import('./routes/activities/activities.page'),
  },
  {
    path: 'activities/:slug',
    loadComponent: () => import('./routes/activities/slug/activity-slug.page'),
  },
  { path: '**', redirectTo: 'home' },
];
