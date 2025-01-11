import { IDiscogsRelease } from '../discogs-response';

export class ReleaseOut {
  discogsId: number;
  artistName: string;
  recordName: string;

  constructor(discogsId: number, artistName: string, recordName: string) {
    this.discogsId = discogsId;
    this.artistName = artistName;
    this.recordName = recordName;
  }

  static fromDiscogsResponse(release: IDiscogsRelease): ReleaseOut {
    const joinedArtists: string = release.basic_information.artists.map((artist) => artist.name).join(', ');
    return new ReleaseOut(release.id, joinedArtists, release.basic_information.title);
  }
}
