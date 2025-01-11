import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConfig } from '../jwtconfig';
import { ormConfig } from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DiscogsModule } from './discogs/discogs.module';
import { SettingsModule } from './settings/settings.module';
import { SpinsModule } from './spins/spins.module';
import { UserModule } from './users/user.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    JwtModule.register(jwtConfig),
    UserModule,
    AuthModule,
    SettingsModule,
    SpinsModule,
    DiscogsModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
