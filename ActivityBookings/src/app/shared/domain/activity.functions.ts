import { Activity } from './activity.type';

export function changeActivityStatus(activity: Activity, totalParticipants: number): boolean {
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return false;
  if (totalParticipants >= activity.maxParticipants) {
    activity.status = 'sold-out';
    return true;
  }
  if (totalParticipants >= activity.minParticipants) {
    activity.status = 'confirmed';
    return true;
  }
  return false;
}
