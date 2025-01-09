import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@spin-cycle-mono/shared';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  update(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByDiscogsId(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { discogsId: id } });
  }

  findByIdWithSpins(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['spins'] });
  }
}
