/**
 * Login type definition.
 * @description This is a DTO for the login entity with email and password fields
 */
export type Login = {
  email: string;
  password: string;
};

/** Null object pattern for the Login type */
export const NULL_LOGIN: Login = {
  email: '',
  password: '',
};
