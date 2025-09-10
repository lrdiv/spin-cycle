import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1757441492483 implements MigrationInterface {
  name = 'Initial1757441492483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure UUID extension exists for uuid_generate_v4()
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create users table if missing
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" character varying,
        "allPlayed" boolean NOT NULL,
        "discogsUsername" character varying NOT NULL,
        "discogsId" integer NOT NULL,
        "discogsToken" character varying NOT NULL,
        "discogsSecret" character varying NOT NULL,
        "discogsFolder" integer NOT NULL DEFAULT 0,
        "discogsFolderName" character varying NOT NULL DEFAULT 'All',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE
      )
    `);

    // Ensure all columns exist (if table existed previously)
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "allPlayed" boolean');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsUsername" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsId" integer');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsToken" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsSecret" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsFolder" integer');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discogsFolderName" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE');
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE');

    // Apply defaults and not-null where safe
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "discogsFolder" SET DEFAULT 0');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "discogsFolderName" SET DEFAULT \'All\'');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()');

    // Try to enforce NOT NULL on known non-null fields if possible
    // Use updates/guards to prevent errors if nulls exist
    await queryRunner.query('UPDATE "users" SET "allPlayed" = false WHERE "allPlayed" IS NULL');
    await queryRunner.query('UPDATE "users" SET "discogsFolder" = 0 WHERE "discogsFolder" IS NULL');
    await queryRunner.query('UPDATE "users" SET "discogsFolderName" = \'All\' WHERE "discogsFolderName" IS NULL');
    await queryRunner.query('UPDATE "users" SET "createdAt" = now() WHERE "createdAt" IS NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "allPlayed" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "discogsFolder" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "discogsFolderName" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL');

    // Conditionally enforce NOT NULL when no NULLs exist to avoid failure
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "users" WHERE "discogsUsername" IS NULL) THEN
          ALTER TABLE "users" ALTER COLUMN "discogsUsername" SET NOT NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "users" WHERE "discogsId" IS NULL) THEN
          ALTER TABLE "users" ALTER COLUMN "discogsId" SET NOT NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "users" WHERE "discogsToken" IS NULL) THEN
          ALTER TABLE "users" ALTER COLUMN "discogsToken" SET NOT NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "users" WHERE "discogsSecret" IS NULL) THEN
          ALTER TABLE "users" ALTER COLUMN "discogsSecret" SET NOT NULL;
        END IF;
      END $$;
    `);

    // Ensure primary key exists if table pre-existed without it
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
          WHERE t.relname = 'users' AND c.contype = 'p'
        ) THEN
          ALTER TABLE "users" ADD PRIMARY KEY ("id");
        END IF;
      END $$;
    `);

    // Create spins table if missing
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spins" (
        "id" SERIAL PRIMARY KEY,
        "discogsId" integer NOT NULL,
        "artistName" character varying NOT NULL,
        "recordName" character varying NOT NULL,
        "played" boolean NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" uuid
      )
    `);

    // Ensure columns exist on spins
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "discogsId" integer');
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "artistName" character varying');
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "recordName" character varying');
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "played" boolean');
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP');
    await queryRunner.query('ALTER TABLE "spins" ADD COLUMN IF NOT EXISTS "userId" uuid');

    // Apply safe defaults
    await queryRunner.query('ALTER TABLE "spins" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP');
    await queryRunner.query('UPDATE "spins" SET "played" = true WHERE "played" IS NULL');
    await queryRunner.query('ALTER TABLE "spins" ALTER COLUMN "played" SET NOT NULL');

    // Conditionally enforce NOT NULL on other fields when safe
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "spins" WHERE "discogsId" IS NULL) THEN
          ALTER TABLE "spins" ALTER COLUMN "discogsId" SET NOT NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "spins" WHERE "artistName" IS NULL) THEN
          ALTER TABLE "spins" ALTER COLUMN "artistName" SET NOT NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM "spins" WHERE "recordName" IS NULL) THEN
          ALTER TABLE "spins" ALTER COLUMN "recordName" SET NOT NULL;
        END IF;
      END $$;
    `);

    // Ensure FK to users exists (by relation, regardless of name)
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
          JOIN pg_class rt ON c.confrelid = rt.oid
          WHERE t.relname = 'spins' AND rt.relname = 'users' AND c.contype = 'f'
        ) THEN
          ALTER TABLE "spins"
          ADD CONSTRAINT "FK_spins_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK if it exists
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_spins_user'
        ) THEN
          ALTER TABLE "spins" DROP CONSTRAINT "FK_spins_user";
        END IF;
      END $$;
    `);
    await queryRunner.query('DROP TABLE IF EXISTS "spins"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}
