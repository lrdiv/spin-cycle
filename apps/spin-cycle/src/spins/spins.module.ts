import { Module } from '@nestjs/common';

import { DiscogsModule } from '../discogs/discogs.module';
import { UserModule } from '../users/user.module';
import { SpinsController } from './spins.controller';

@Module({
  controllers: [SpinsController],
  imports: [UserModule, DiscogsModule],
})
export class SpinsModule {}
