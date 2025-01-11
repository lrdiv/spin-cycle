import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  findByDiscogsUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { discogsUsername: username } });
  }

  findByDiscogsUsernameWithSpins(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { discogsUsername: username }, relations: ['spins'] });
  }

  findByIdWithSpins(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['spins'] });
  }

  async getUserFromRequest(userId: string): Promise<UserEntity> {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user: UserEntity | null = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
