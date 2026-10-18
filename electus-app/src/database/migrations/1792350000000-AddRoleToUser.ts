import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUser1792350000000 implements MigrationInterface {
  name = 'AddRoleToUser1792350000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "role" character varying NOT NULL DEFAULT 'admin';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN IF EXISTS "role";
    `);
  }
}
