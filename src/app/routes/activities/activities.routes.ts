import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./activities.page'),
  },
  {
    path: 'new',
    canMatch: [authGuard],
    loadComponent: () => import('./new-activity/new-activity.page'),
  },
  {
    path: ':slug',
    loadComponent: () => import('./slug/activity-slug.page'),
  },
];

export default routes;
