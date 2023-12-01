import { Activity } from './activity.type';

export function validateParticipants(activity: Activity) {
  if (activity.minParticipants > activity.maxParticipants) {
    return {
      participants: 'Min participants should be less than max participants',
      minParticipants: activity.minParticipants,
      maxParticipants: activity.maxParticipants,
    };
  }
  return null;
}

export function validateDate(activity: Activity) {
  if (activity.date < new Date()) {
    return {
      date: 'Date should be in the future',
    };
  }
  return null;
}
