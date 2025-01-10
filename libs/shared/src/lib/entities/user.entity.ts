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
  ) {
    this.id = id;
    this.email = email;
    this.discogsId = discogsId;
    this.discogsUsername = discogsUsername;
    this.discogsToken = discogsToken;
    this.discogsSecret = discogsSecret;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  discogsUsername: string;

  @Column()
  discogsId: number;

  @Column()
  discogsToken: string;

  @Column()
  discogsSecret: string;

  @Column()
  discogsFolder: number = 0;

  @Column()
  discogsFolderName: string = 'All';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date | null = null;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date | null = null;

  @OneToMany(() => SpinEntity, (spin) => spin.user, { cascade: false })
  spins!: SpinEntity[];
}
