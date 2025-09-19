import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { SpinEntity } from './spin.entity';

@Entity('users')
export class UserEntity {
  constructor(
    id: string,
    email: string,
    discogsUsername: string,
    discogsId: number,
    discogsToken: string,
    discogsSecret: string,
    spins: SpinEntity[],
    createdAt: Date = new Date(),
  ) {
    this.id = id;
    this.email = email;
    this.discogsId = discogsId;
    this.discogsUsername = discogsUsername;
    this.discogsToken = discogsToken;
    this.discogsSecret = discogsSecret;
    this.spins = spins;
    this.createdAt = createdAt;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  allPlayed: boolean = false;

  @Column()
  discogsUsername: string;

  @Column()
  discogsId: number;

  @Column()
  discogsToken: string;

  @Column()
  discogsSecret: string;

  @Column({ default: 0 })
  discogsFolder: number = 0;

  @Column({ default: 'All' })
  discogsFolderName: string = 'All';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date | null = null;

  @UpdateDateColumn({ nullable: true, type: 'timestamp with time zone' })
  updatedAt: Date | null = null;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  pausedAt: Date | null = null;

  @OneToMany(() => SpinEntity, (spin) => spin.user, { cascade: false })
  spins: SpinEntity[];
}
