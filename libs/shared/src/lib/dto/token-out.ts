import { UserOut } from './user-out';

export class TokenOut {
  user: UserOut;
  token: string;

  constructor(user: UserOut, token: string) {
    this.user = user;
    this.token = token;
  }
}
