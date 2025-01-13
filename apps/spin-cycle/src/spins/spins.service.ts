import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page, SpinEntity, SpinOut, UserEntity } from '@spin-cycle-mono/shared';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SpinsService {
  constructor(
    @InjectRepository(SpinEntity)
    private readonly spinRepository: Repository<SpinEntity>,
  ) {}

  create(spin: DeepPartial<SpinEntity>): Promise<SpinEntity> {
    return this.spinRepository.save(spin);
  }

  update(spin: SpinEntity, update: DeepPartial<SpinEntity>): Promise<SpinEntity> {
    const updated: SpinEntity = Object.assign(spin, update);
    return this.spinRepository.save(updated);
  }

  findById(id: number): Promise<SpinEntity | null> {
    return this.spinRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async getPageForUser(userId: string, page: number): Promise<Page<SpinOut>> {
    const perPage: number = 25;
    const query: SelectQueryBuilder<SpinEntity> = this.spinRepository
      .createQueryBuilder('spin')
      .where('spin.userId = :userId', { userId })
      .orderBy('spin.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();
    const spins: SpinOut[] = entities.map((spin: SpinEntity) => SpinOut.fromSpin(spin));
    const pageCount: number = Math.ceil(itemCount / perPage);
    const lastPage: boolean = pageCount === 0 || page === pageCount;
    return new Page<SpinOut>(spins, page, itemCount, pageCount, page === 1, lastPage);
  }

  findAllForUser(user: UserEntity) {
    return this.spinRepository.find({ where: { user: { id: user.id } } });
  }
}
