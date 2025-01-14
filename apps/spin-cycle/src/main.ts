import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisStore } from 'connect-redis';
import 'dotenv/config';
import session from 'express-session';
import { RedisClientType, createClient } from 'redis';

import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'production') {
  import('./sentry');
}

const corsOrigin: string[] =
  process.env.NODE_ENV === 'production'
    ? ['https://spincycle.lrdiv.co', 'https://discogs.com']
    : ['http://localhost:4200'];

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'PATCH', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  await redisClient.connect();

  app.use(
    session({
      name: 'oauth',
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      proxy: true,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
