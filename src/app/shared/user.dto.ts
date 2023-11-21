export type User = {
  id: string;
  username: string;
  email: string;
};

export const NULL_USER: User = {
  id: '',
  username: '',
  email: '',
} as const;
