export type Activity = {
  id: string;
  name: string;
  slug: string;
  price: number;
  date: Date;
  duration: number;
  location: string;
  minParticipants: number;
  maxParticipants: number;
};

export const NULL_ACTIVITY: Activity = {
  id: '',
  name: '',
  slug: '',
  price: 0,
  date: new Date(),
  duration: 0,
  location: '',
  minParticipants: 0,
  maxParticipants: 0,
};
