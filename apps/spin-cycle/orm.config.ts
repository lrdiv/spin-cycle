import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SpinEntity, UserEntity } from '@spin-cycle-mono/shared';
import 'dotenv/config';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  database: process.env.DB_DATABASE,
  entities: [UserEntity, SpinEntity],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
};
