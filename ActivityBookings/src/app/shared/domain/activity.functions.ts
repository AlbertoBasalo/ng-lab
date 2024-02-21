import { Activity, ActivityStatus } from './activity.type';

/**
 * Calculate the next status of an activity based on the total number of participants
 * @param activity The current activity
 * @param totalParticipants The total number of participants
 * @returns The next status of the activity
 */
export function getNextActivityStatus(
  activity: Activity,
  totalParticipants: number,
): ActivityStatus {
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return activity.status;
  if (totalParticipants >= activity.maxParticipants) return 'sold-out';
  if (totalParticipants >= activity.minParticipants) return 'confirmed';
  return activity.status;
}
