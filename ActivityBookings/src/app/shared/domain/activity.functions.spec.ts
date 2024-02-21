import { getNextActivityStatus } from './activity.functions';
import { Activity, NULL_ACTIVITY } from './activity.type';

describe('The getNextActivityStatus function', () => {
  const activity: Activity = {
    ...NULL_ACTIVITY,
    status: 'published',
    minParticipants: 2,
    maxParticipants: 3,
  };

  it('should return `sold-out` if the total number of participants is >= the max number of participants', () => {
    const totalParticipants = activity.maxParticipants;
    const nextStatus = getNextActivityStatus(activity, totalParticipants);
    expect(nextStatus).toBe('sold-out');
  });

  it('should return `confirmed` if the total number of participants is >= the min number of participants', () => {
    const totalParticipants = activity.minParticipants;
    const nextStatus = getNextActivityStatus(activity, totalParticipants);
    expect(nextStatus).toBe('confirmed');
  });

  it('should return the same activity status if it is draft, done, or cancelled', () => {
    const totalParticipants = 0;
    const nonBookableActivity: Activity = { ...activity, status: 'draft' };
    const nextStatus = getNextActivityStatus(nonBookableActivity, totalParticipants);
    expect(nextStatus).toBe(nonBookableActivity.status);
  });

  it('should return the same activity status if none of the conditions are met', () => {
    const totalParticipants = activity.minParticipants - 1;
    const nextStatus = getNextActivityStatus(activity, totalParticipants);
    expect(nextStatus).toBe(activity.status);
  });
});
