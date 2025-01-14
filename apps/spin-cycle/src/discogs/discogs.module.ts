import { Module } from '@nestjs/common';

import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../users/user.module';
import { DiscogsAuthService } from './discogs-auth.service';
import { DiscogsController } from './discogs.controller';
import { DiscogsService } from './discogs.service';

@Module({
  controllers: [DiscogsController],
  providers: [DiscogsAuthService, DiscogsService],
  exports: [DiscogsAuthService, DiscogsService],
  imports: [MailerModule, UserModule],
})
export class DiscogsModule {}
