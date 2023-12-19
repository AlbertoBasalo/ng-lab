import { UserToken } from '../../domain/user-token.type';

export type AuthProcess = {
  interactive: boolean;
  url: string;
  mustLogin?: boolean;
};

export type AuthState = {
  userToken: UserToken;
  authProcess: AuthProcess;
};
