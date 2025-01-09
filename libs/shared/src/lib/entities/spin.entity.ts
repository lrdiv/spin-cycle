import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('spins')
export class SpinEntity {
  constructor(id: number, artistName: string, recordName: string) {
    this.id = id;
    this.artistName = artistName;
    this.recordName = recordName;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artistName: string;

  @Column()
  recordName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null = null;

  @ManyToOne(() => UserEntity, (user) => user.spins, { onDelete: 'CASCADE' })
  user!: UserEntity;
}
