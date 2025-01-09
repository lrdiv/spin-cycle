import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisStore } from 'connect-redis';
import 'dotenv/config';
import session from 'express-session';
import { RedisClientType, createClient } from 'redis';

import { AppModule } from './app.module';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  await redisClient.connect();

  app.use(
    session({
      name: 'oauth',
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
