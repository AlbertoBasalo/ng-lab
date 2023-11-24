import { Routes } from '@angular/router';
import { authGuard } from '@shared/auth.guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('@routes/home/home.page') },
  {
    path: 'auth/login',
    loadComponent: () => import('@routes/auth/login.page'),
  },
  {
    path: 'auth/profile',
    canActivate: [authGuard],
    loadComponent: () => import('@routes/auth/profile.page'),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('@routes/auth/register.page'),
  },
  {
    path: 'activities',
    loadComponent: () => import('@routes/activities/activities.page'),
  },
  {
    path: 'activities/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@routes/activities/new-activity/new-activity.page'),
  },
  {
    path: 'activities/:slug',
    loadComponent: () => import('@routes/activities/slug/activity-slug.page'),
  },
  { path: '**', redirectTo: 'home' },
];
