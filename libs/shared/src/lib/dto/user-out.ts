import { UserEntity } from '../entities/user.entity';
import { FolderOut } from './folder-out';

export class UserOut {
  public static fromUser(entity: UserEntity): UserOut {
    const folder: FolderOut = new FolderOut(entity.discogsFolder, entity.discogsFolderName);
    return new UserOut(entity.id, entity.discogsId, entity.discogsUsername, entity.email, folder);
  }

  id: string;
  discogsId: number;
  email: string | null;
  username: string;

  folderId: number = 0;
  folderName: string = 'All';

  constructor(id: string, discogsId: number, username: string, email: string | null, folder: FolderOut) {
    this.id = id;
    this.discogsId = discogsId;
    this.username = username;
    this.email = email;
    if (folder?.id) {
      this.folderId = folder.id;
    }
    if (folder?.name) {
      this.folderName = folder.name;
    }
  }
}
