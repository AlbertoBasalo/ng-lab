export type Register = {
  username: string;
  email: string;
  password: string;
  terms: boolean;
};

export const DEFAULT_REGISTER: Register = {
  username: '',
  email: '',
  password: '',
  terms: false,
};
