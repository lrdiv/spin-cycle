import { SpinEntity, UserEntity } from '@spin-cycle-mono/shared';
import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  database: process.env.DB_DATABASE,
  entities: [UserEntity, SpinEntity],
  synchronize: false,
  migrations: ['apps/spin-cycle/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  logging: true,
});
