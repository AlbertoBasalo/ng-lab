import { Routes } from '@angular/router';
import { authGuard } from '@shared/services/auth.guard';

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
  {
    path: ':slug/admin',
    loadComponent: () => import('./slug/admin/activity-slug-admin.page'),
  },
];

export default routes;
