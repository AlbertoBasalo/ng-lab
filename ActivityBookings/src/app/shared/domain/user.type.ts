/**
 * User type representation on the client side.
 * @description This is a DTO for the user entity without password field
 */
export type User = {
  id: number;
  username: string;
  email: string;
  terms: boolean;
};

/** Null object pattern for the User type */
export const NULL_USER: User = {
  id: 0,
  username: '',
  email: '',
  terms: false,
};
