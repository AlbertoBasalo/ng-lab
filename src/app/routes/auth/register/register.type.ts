import { Role } from '@shared/domain/user.type';

/*
 * Registering Credentials
 * @description Plain object used for registering a new user
 */
export type Register = {
  name: string;
  email: string;
  password: string;
  role: Role;
  acceptedTerms: boolean;
};
