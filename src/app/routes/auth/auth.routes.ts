import { Routes } from '@angular/router';
import { authGuard } from '@shared/services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page'),
  },
  {
    path: 'profile',
    canMatch: [authGuard],
    loadComponent: () => import('./profile/profile.page'),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page'),
  },
];

export default routes;
