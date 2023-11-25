export type Booking = {
  id: number;
  activityId: string;
  userId: number;
  date: Date;
  participants: number;
};

export const NULL_BOOKING: Booking = {
  id: 0,
  activityId: '',
  userId: 0,
  date: new Date(),
  participants: 0,
};
