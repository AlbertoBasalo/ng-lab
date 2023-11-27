import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('@routes/home/home.page') },
  {
    path: 'auth/login',
    loadComponent: () => import('@routes/auth/login/login.page'),
  },
  {
    path: 'auth/profile',
    canMatch: [authGuard],
    loadComponent: () => import('@routes/auth/profile/profile.page'),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('@routes/auth/register/register.page'),
  },
  {
    path: 'activities',
    loadComponent: () => import('@routes/activities/activities.page'),
  },
  {
    path: 'activities/new',
    canMatch: [authGuard],
    loadComponent: () =>
      import('@routes/activities/new-activity/new-activity.page'),
  },
  {
    path: 'activities/:slug',
    loadComponent: () => import('@routes/activities/slug/activity-slug.page'),
  },
  { path: '**', redirectTo: 'home' },
];
