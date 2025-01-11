import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('spins')
export class SpinEntity {
  constructor(
    id: number,
    user: UserEntity,
    discogsId: number,
    artistName: string,
    recordName: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.user = user;
    this.discogsId = discogsId;
    this.artistName = artistName;
    this.recordName = recordName;
    this.createdAt = createdAt;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discogsId: number;

  @Column()
  artistName: string;

  @Column()
  recordName: string;

  @Column()
  played: boolean = true;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.spins, { onDelete: 'CASCADE' })
  user!: UserEntity;
}
