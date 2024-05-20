import { Activity, ActivityStatus } from './activity.type';

/**
 * Calculate the next status of an activity based on the total number of participants
 * @param activity The current activity
 * @param participants The total number of participants
 * @returns The next status of the activity
 */
export function getNextActivityStatus(activity: Activity, participants: number): ActivityStatus {
  // If the activity is draft, done or cancelled, the status remains the same.
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return activity.status;
  // Calculate the next status based on the number of participants
  if (participants >= activity.maxParticipants) return 'sold-out';
  if (participants >= activity.minParticipants) return 'confirmed';
  return activity.status;
}
