/**
 * Booking type definition
 * @description This is a DTO for the booking entity
 */
export type Booking = {
  id: number;
  activityId: number;
  userId: number;
  date: Date;
  participants: number;
};

export const NULL_BOOKING: Booking = {
  id: 0,
  activityId: 0,
  userId: 0,
  date: new Date(),
  participants: 0,
};
