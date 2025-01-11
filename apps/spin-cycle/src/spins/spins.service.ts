import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page, SpinEntity, SpinOut } from '@spin-cycle-mono/shared';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SpinsService {
  constructor(
    @InjectRepository(SpinEntity)
    private readonly spinRepository: Repository<SpinEntity>,
  ) {}

  async create(spin: DeepPartial<SpinEntity>): Promise<SpinEntity> {
    return this.spinRepository.save(spin);
  }

  async update(spin: SpinEntity, update: DeepPartial<SpinEntity>): Promise<SpinEntity> {
    const updated: SpinEntity = Object.assign(spin, update);
    return this.spinRepository.save(updated);
  }

  async findById(id: number): Promise<SpinEntity | null> {
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
    const pageCount = Math.ceil(itemCount / perPage);
    return new Page<SpinOut>(spins, page, itemCount, pageCount, page === 1, page === pageCount);
  }
}
