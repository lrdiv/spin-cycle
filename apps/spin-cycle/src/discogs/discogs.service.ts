import { Injectable } from '@nestjs/common';
import { FolderOut, UserEntity } from '@spin-cycle-mono/shared';
import OAuth from 'oauth-1.0a';

import { DiscogsAuthService } from './discogs-auth.service';

@Injectable()
export class DiscogsService {
  private readonly client: OAuth;

  constructor(private readonly oauthService: DiscogsAuthService) {
    this.client = oauthService.client;
  }

  async getFolders(user: UserEntity): Promise<FolderOut[]> {
    const url = `https://api.discogs.com/users/${user.discogsUsername}/collection/folders`;
    const headers: OAuth.Header = this.getHeaders(url, user);
    const resp: Response = await fetch(url, { headers: { Authorization: headers.Authorization } });
    const json = await resp.json();
    return json.folders.map((folder: { id: number; name: string; count: number }) => {
      return new FolderOut(folder.id, folder.name, folder.count);
    });
  }

  private getHeaders(url: string, user: UserEntity, method = 'GET'): OAuth.Header {
    const { discogsToken: key, discogsSecret: secret } = user;
    return this.client.toHeader(this.client.authorize({ url, method }, { key, secret }));
  }
}
