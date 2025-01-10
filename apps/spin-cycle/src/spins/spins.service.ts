import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpinEntity } from '@spin-cycle-mono/shared';
import { Repository } from 'typeorm';

@Injectable()
export class SpinsService {
  constructor(
    @InjectRepository(SpinEntity)
    private readonly spinRepository: Repository<SpinEntity>,
  ) {}
}
