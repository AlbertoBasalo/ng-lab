import { Activity, ActivityStatus } from './activity.type';

export function getNextActivityStatus(
  activity: Activity,
  totalParticipants: number,
): ActivityStatus {
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return activity.status;
  if (totalParticipants >= activity.maxParticipants) {
    return 'sold-out';
  }
  if (totalParticipants >= activity.minParticipants) {
    return 'confirmed';
  }
  return activity.status;
}
