import { Activity } from './activity.type';

export function changeActivityStatus(activity: Activity, totalParticipants: number) {
  let newStatus = activity.status;
  if (totalParticipants >= activity.maxParticipants) {
    newStatus = 'sold-out';
  } else if (totalParticipants >= activity.minParticipants) {
    newStatus = 'confirmed';
  } else {
    newStatus = 'published';
  }
  activity.status = newStatus;
}
