export type Role = 'organizer' | 'participant' | '';

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
};

export const NULL_USER: User = {
  id: 0,
  username: '',
  email: '',
  role: '',
} as const;
