/**
 * Register type definition.
 * @description This is a DTO for the register entity with username, email, password and terms fields
 */
export type Register = {
  username: string;
  email: string;
  password: string;
  terms: boolean;
};

/** Null object pattern for the Register type */
export const NULL_REGISTER: Register = {
  username: '',
  email: '',
  password: '',
  terms: false,
};
