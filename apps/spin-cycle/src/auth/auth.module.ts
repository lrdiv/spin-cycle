import { Module } from '@nestjs/common';

import { UserModule } from '../user.module';
import { AuthController } from './auth.controller';
import { OauthService } from './oauth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [OauthService],
})
export class AuthModule {}
