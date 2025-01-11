import { SpinEntity } from '../entities/spin.entity';

export class SpinOut {
  id: number;
  discogsId: number;
  artistName: string;
  recordName: string;
  createdAt: Date;
  played: boolean;

  constructor(id: number, discogsId: number, artistName: string, recordName: string, createdAt: Date, played: boolean) {
    this.id = id;
    this.discogsId = discogsId;
    this.artistName = artistName;
    this.recordName = recordName;
    this.createdAt = createdAt;
    this.played = played;
  }

  static fromSpin(spin: SpinEntity): SpinOut {
    return new SpinOut(spin.id, spin.discogsId, spin.artistName, spin.recordName, spin.createdAt, spin.played);
  }
}
