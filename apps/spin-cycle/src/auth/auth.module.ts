import { Module } from '@nestjs/common';

import { DiscogsModule } from '../discogs/discogs.module';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, DiscogsModule],
  controllers: [AuthController],
})
export class AuthModule {}
