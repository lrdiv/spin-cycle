import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@spin-cycle-mono/shared';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  update(user: UserEntity, update: DeepPartial<UserEntity>): Promise<UserEntity> {
    const updated: UserEntity = Object.assign(user, update);
    return this.userRepository.save(updated);
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByDiscogsId(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { discogsId: id } });
  }

  findAllWithUnplayedAndUnpaused(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { allPlayed: false, email: Not(IsNull()), pausedAt: Not(IsNull()) },
      relations: [],
    });
  }
}
