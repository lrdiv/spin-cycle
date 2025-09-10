import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaImprovements1757442196051 implements MigrationInterface {
  name = 'SchemaImprovements1757442196051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Defaults that match app semantics
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "allPlayed" SET DEFAULT false');
    await queryRunner.query('ALTER TABLE "spins" ALTER COLUMN "played" SET DEFAULT true');

    // Unique Discogs ID per user
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsid_unique'
        ) THEN
          ALTER TABLE "users" ADD CONSTRAINT "users_discogsid_unique" UNIQUE ("discogsId");
        END IF;
      END $$;
    `);

    // Index on Discogs username for faster lookups
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "users_discogsusername_idx" ON "users" ("discogsUsername")');

    // Partial unique on email (allow multiple NULLs)
    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_email_uniq" ON "users" ("email") WHERE "email" IS NOT NULL',
    );

    // Composite index for spin history pagination by user
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "spins_user_created_idx" ON "spins" ("userId", "createdAt" DESC)',
    );

    // Make spins.userId NOT NULL only if there are no NULLs
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "spins" WHERE "userId" IS NULL) THEN
          ALTER TABLE "spins" ALTER COLUMN "userId" SET NOT NULL;
        END IF;
      END $$;
    `);

    // Data integrity checks
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsid_positive') THEN
          ALTER TABLE "users" ADD CONSTRAINT "users_discogsid_positive" CHECK ("discogsId" > 0);
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsfolder_nonneg') THEN
          ALTER TABLE "users" ADD CONSTRAINT "users_discogsfolder_nonneg" CHECK ("discogsFolder" >= 0);
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spins_discogsid_positive') THEN
          ALTER TABLE "spins" ADD CONSTRAINT "spins_discogsid_positive" CHECK ("discogsId" > 0);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query('DROP INDEX IF EXISTS "spins_user_created_idx"');
    await queryRunner.query('DROP INDEX IF EXISTS "users_discogsusername_idx"');
    await queryRunner.query('DROP INDEX IF EXISTS "users_email_uniq"');

    // Drop constraints if exist
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsid_unique') THEN
          ALTER TABLE "users" DROP CONSTRAINT "users_discogsid_unique";
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsid_positive') THEN
          ALTER TABLE "users" DROP CONSTRAINT "users_discogsid_positive";
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_discogsfolder_nonneg') THEN
          ALTER TABLE "users" DROP CONSTRAINT "users_discogsfolder_nonneg";
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spins_discogsid_positive') THEN
          ALTER TABLE "spins" DROP CONSTRAINT "spins_discogsid_positive";
        END IF;
      END $$;
    `);

    // Revert defaults to previous state
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "allPlayed" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "spins" ALTER COLUMN "played" DROP DEFAULT');

    // Loosen NOT NULL on spins.userId if set
    await queryRunner.query('ALTER TABLE "spins" ALTER COLUMN "userId" DROP NOT NULL');
  }
}
