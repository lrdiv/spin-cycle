import { Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { SettingsController } from './settings.controller';

@Module({
  controllers: [SettingsController],
  imports: [UserModule],
})
export class SettingsModule {}
