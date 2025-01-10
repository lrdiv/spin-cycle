export class SpinOut {
  artistName: string;
  recordName: string;
  createdAt: Date;
  played: boolean;

  constructor(artistName: string, recordName: string, createdAt: Date, played: boolean) {
    this.artistName = artistName;
    this.recordName = recordName;
    this.createdAt = createdAt;
    this.played = played;
  }
}
