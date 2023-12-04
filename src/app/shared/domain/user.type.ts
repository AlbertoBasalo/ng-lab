export type User = {
  id: number;
  username: string;
  email: string;
};

export const NULL_USER: User = {
  id: 0,
  username: '',
  email: '',
} as const;
