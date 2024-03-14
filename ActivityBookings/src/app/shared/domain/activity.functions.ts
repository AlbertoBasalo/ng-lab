import { Activity, ActivityStatus } from './activity.type';

/**
 * Calculate the next status of an activity based on the total number of participants
 * @param activity The current activity
 * @param totalParticipants The total number of participants
 * @returns The next status of the activity
 */
export function getNextActivityStatus(activity: Activity, totalParticipants: number): ActivityStatus {
  // If the activity is draft, done or cancelled, return the current status
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return activity.status;
  // Calculate the next status based on the total number of participants
  if (totalParticipants >= activity.maxParticipants) return 'sold-out';
  if (totalParticipants >= activity.minParticipants) return 'confirmed';
  return activity.status;
}
