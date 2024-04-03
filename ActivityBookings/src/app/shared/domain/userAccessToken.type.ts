import { NULL_USER, User } from './user.type';

/** User access token type definition
 * @description This is a DTO for the user access token entity with user and accessToken fields
 */
export type UserAccessToken = {
  user: User;
  accessToken: string;
};

/** Null object pattern for the UserAccessToken type */
export const NULL_USER_ACCESS_TOKEN: UserAccessToken = {
  user: NULL_USER,
  accessToken: '',
};
