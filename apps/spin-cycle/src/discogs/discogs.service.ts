import { Injectable } from '@nestjs/common';
import {
  FolderOut,
  IDiscogsRelease,
  IDiscogsReleases,
  ReleaseOut,
  SpinEntity,
  UserEntity,
} from '@spin-cycle-mono/shared';
import OAuth from 'oauth-1.0a';

import { AllReleasesSpunException } from '../spins/spins.exception';
import { DiscogsAuthService } from './discogs-auth.service';

@Injectable()
export class DiscogsService {
  private readonly client: OAuth;

  constructor(private readonly oauthService: DiscogsAuthService) {
    this.client = this.oauthService.client;
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

  async getRandomRecord(user: UserEntity): Promise<ReleaseOut> {
    const allRecords: ReleaseOut[] = await this.getAllRecordsFromFolder(user);
    const playedSpins: SpinEntity[] = user.spins.filter((spin: SpinEntity) => spin.played);
    return this.getUnplayedSpin(playedSpins, allRecords);
  }

  private getUnplayedSpin(spins: SpinEntity[], records: ReleaseOut[]): ReleaseOut {
    if (!records.length) {
      throw new AllReleasesSpunException();
    }

    const randomIndex: number = Math.floor(Math.random() * records.length);
    const randomRelease: ReleaseOut = records[randomIndex];
    const played: boolean = spins.some((spin: SpinEntity) => {
      return spin.discogsId === randomRelease.discogsId;
    });

    if (!played) {
      return randomRelease;
    }

    const remainder: ReleaseOut[] = records.filter((r: ReleaseOut) => r.discogsId !== randomRelease.discogsId);
    return this.getUnplayedSpin(spins, remainder);
  }

  private async getAllRecordsFromFolder(user: UserEntity): Promise<ReleaseOut[]> {
    const first: IDiscogsReleases = await this.getRecordsPageFromFolder(user, 1);
    const firstPage: ReleaseOut[] = first.releases.map((r: IDiscogsRelease) => ReleaseOut.fromDiscogsResponse(r));
    if (first.pagination.page === first.pagination.pages) {
      return firstPage;
    }

    const remaining: number[] = this.getRange(2, first.pagination.pages + 1);
    const promises: Array<IDiscogsReleases> = await Promise.all(
      remaining.map((page: number) => {
        return this.getRecordsPageFromFolder(user, page);
      }),
    );

    return promises.reduce(
      (all: ReleaseOut[], page: IDiscogsReleases) => {
        const releases: ReleaseOut[] = page.releases.map((release) => ReleaseOut.fromDiscogsResponse(release));
        return [...all, ...releases];
      },
      [...firstPage],
    );
  }

  private async getRecordsPageFromFolder(user: UserEntity, page: number = 1): Promise<IDiscogsReleases> {
    const { discogsUsername: username, discogsFolder: folder } = user;
    const url = `https://api.discogs.com/users/${username}/collection/folders/${folder}/releases?page=${page}&per_page=100`;
    const headers: OAuth.Header = this.getHeaders(url, user);
    return fetch(url, { headers: { Authorization: headers.Authorization } }).then((res) => res.json());
  }

  private getHeaders(url: string, user: UserEntity, method = 'GET'): OAuth.Header {
    const { discogsToken: key, discogsSecret: secret } = user;
    return this.client.toHeader(this.client.authorize({ url, method }, { key, secret }));
  }

  private getRange(start: number, end: number, step: number = 1): number[] {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
  }
}
