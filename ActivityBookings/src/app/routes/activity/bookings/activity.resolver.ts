import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Activity } from '@domain/activity.type';
import { BookingsService } from './bookings.service';

/**
 * Resolver function to get the activity by slug
 * @param route ActivatedRouteSnapshot with the slug parameter
 * @returns An observable with the activity data
 */
export const activityResolver: ResolveFn<Activity> = (route: ActivatedRouteSnapshot) => {
  const slug: string = route.paramMap.get('slug') || '';
  const bookingsService = inject(BookingsService);
  return bookingsService.getActivityBySlug$(slug);
};
