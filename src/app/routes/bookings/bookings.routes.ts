import { Routes } from '@angular/router';
import { authGuard } from '@auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./bookings.page'),
  },
  {
    path: 'new',
    canMatch: [authGuard],
    loadComponent: () => import('./new-booking/new-booking.page'),
  },
];

export default routes;
