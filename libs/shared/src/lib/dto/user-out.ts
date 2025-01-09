import { UserEntity } from '../entities/user.entity';

export class UserOut {
  public static fromUser(entity: UserEntity): UserOut {
    return new UserOut(entity.id, entity.discogsId, entity.discogsUsername, entity.email);
  }

  id: string;
  discogsId: number;
  email: string;
  username: string;

  constructor(id: string, discogsId: number, username: string, email: string) {
    this.id = id;
    this.discogsId = discogsId;
    this.username = username;
    this.email = email;
  }
}
