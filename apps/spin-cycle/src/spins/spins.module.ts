import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpinEntity } from '@spin-cycle-mono/shared';

import { DiscogsModule } from '../discogs/discogs.module';
import { UserModule } from '../users/user.module';
import { SpinsController } from './spins.controller';
import { SpinsService } from './spins.service';

@Module({
  controllers: [SpinsController],
  providers: [SpinsService],
  imports: [TypeOrmModule.forFeature([SpinEntity]), UserModule, DiscogsModule],
  exports: [SpinsService],
})
export class SpinsModule {}
