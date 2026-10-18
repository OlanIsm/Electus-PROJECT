import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyIdToUserAndCandidate1792340000000 implements MigrationInterface {
  name = 'AddCompanyIdToUserAndCandidate1792340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add companyId to users table
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "companyId" character varying;
    `);

    // 2. Add companyId to candidate table
    await queryRunner.query(`
      ALTER TABLE "candidate" 
      ADD COLUMN IF NOT EXISTS "companyId" character varying;
    `);

    // 3. Create index on candidate companyId for fast tenant-scoped queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_candidate_companyId" 
      ON "candidate" ("companyId");
    `);

    // 4. Backfill existing users: companyId defaults to their own user id
    await queryRunner.query(`
      UPDATE "users" 
      SET "companyId" = id 
      WHERE "companyId" IS NULL;
    `);

    // 5. Backfill existing candidates: associate with the first existing user company if available
    await queryRunner.query(`
      UPDATE "candidate" 
      SET "companyId" = (SELECT "companyId" FROM "users" LIMIT 1) 
      WHERE "companyId" IS NULL 
        AND EXISTS (SELECT 1 FROM "users");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_companyId";`);
    await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN IF EXISTS "companyId";`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "companyId";`);
  }
}
