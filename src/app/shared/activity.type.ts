export type Activity = {
  id: string;
  name: string;
  slug: string;
  price: number;
  date: Date;
  minParticipants: number;
  maxParticipants: number;
};

export const NULL_ACTIVITY: Activity = {
  id: '',
  name: '',
  slug: '',
  price: 0,
  date: new Date(),
  minParticipants: 0,
  maxParticipants: 0,
};
