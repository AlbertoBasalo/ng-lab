import { NULL_USER, User } from './user.type';

/**
 * API User Token including the access token and the user profile
 */
export type UserToken = {
  /** JWT with the server signed user identification */
  accessToken: string;
  /** User profile */
  user: User;
};

export const NULL_USER_TOKEN: UserToken = {
  accessToken: '',
  user: NULL_USER,
} as const;
