import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';

export type ActivityBooking = Booking & {
  activity: Activity;
};
