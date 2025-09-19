import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPausedAtToUsers1757952000000 implements MigrationInterface {
  name = 'AddPausedAtToUsers1757952000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP WITH TIME ZONE NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "pausedAt"');
  }
}
