import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { jwtConfig } from '../jwt.config';
import { ormConfig } from '../orm.config';
import { AuthModule } from './auth/auth.module';
import { DiscogsModule } from './discogs/discogs.module';
import { MailerModule } from './mailer/mailer.module';
import { SettingsModule } from './settings/settings.module';
import { SpinsModule } from './spins/spins.module';
import { UserModule } from './users/user.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'spin-cycle-client', 'browser'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    JwtModule.register(jwtConfig),
    UserModule,
    AuthModule,
    SettingsModule,
    SpinsModule,
    DiscogsModule,
    MailerModule,
    WorkerModule,
  ],
})
export class AppModule {}
