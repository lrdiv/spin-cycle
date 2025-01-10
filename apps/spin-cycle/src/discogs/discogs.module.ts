import { Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { DiscogsAuthService } from './discogs-auth.service';
import { DiscogsController } from './discogs.controller';
import { DiscogsService } from './discogs.service';

@Module({
  controllers: [DiscogsController],
  providers: [DiscogsAuthService, DiscogsService],
  exports: [DiscogsAuthService, DiscogsService],
  imports: [UserModule],
})
export class DiscogsModule {}
