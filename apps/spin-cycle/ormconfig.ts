import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SpinEntity, UserEntity } from '@spin-cycle-mono/shared';
import 'dotenv/config';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity, SpinEntity],
  synchronize: true,
  logging: true,
};
