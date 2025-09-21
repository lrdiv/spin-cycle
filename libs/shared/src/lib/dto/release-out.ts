import { IDiscogsRelease } from '../discogs-response';

export class ReleaseOut {
  discogsId: number;
  artistName: string;
  recordName: string;
  // ISO string from Discogs indicating when the item was added to the user's collection
  dateAdded?: string;

  constructor(discogsId: number, artistName: string, recordName: string, dateAdded?: string) {
    this.discogsId = discogsId;
    this.artistName = artistName;
    this.recordName = recordName;
    this.dateAdded = dateAdded;
  }

  static fromDiscogsResponse(release: IDiscogsRelease): ReleaseOut {
    const joinedArtists: string = release.basic_information.artists.map((artist) => artist.name).join(', ');
    return new ReleaseOut(release.id, joinedArtists, release.basic_information.title, release.date_added);
  }
}
