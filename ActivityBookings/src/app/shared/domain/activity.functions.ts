import { Activity } from './activity.type';

export function changeActivityStatus(activity: Activity, totalParticipants: number) {
  if (['draft', 'done', 'cancelled'].includes(activity.status)) return;
  if (totalParticipants >= activity.maxParticipants) {
    activity.status = 'sold-out';
  } else if (totalParticipants >= activity.minParticipants) {
    activity.status = 'confirmed';
  }
}
