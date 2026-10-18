import { MigrationInterface, QueryRunner } from "typeorm";

export class BaselineSchema1792339136470 implements MigrationInterface {
  name = 'BaselineSchema1792339136470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. UUID Extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. Cosine Similarity Function
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cosine_similarity(a double precision[], b double precision[])
      RETURNS double precision AS $$
      DECLARE
          dot_product double precision := 0;
          norm_a double precision := 0;
          norm_b double precision := 0;
          len integer;
          i integer;
      BEGIN
          IF a IS NULL OR b IS NULL THEN
              RETURN 0;
          END IF;
          len := array_length(a, 1);
          IF len IS NULL OR len != array_length(b, 1) THEN
              RETURN 0;
          END IF;

          FOR i IN 1..len LOOP
              dot_product := dot_product + (a[i] * b[i]);
              norm_a := norm_a + (a[i] * a[i]);
              norm_b := norm_b + (b[i] * b[i]);
          END LOOP;

          IF norm_a = 0 OR norm_b = 0 THEN
              RETURN 0;
          END IF;

          RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
      END;
      $$ LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE;
    `);

    // 3. Candidate Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "candidate" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fullName" character varying NOT NULL,
        "email" character varying,
        "phone" character varying,
        "reviewStatus" character varying NOT NULL DEFAULT 'pending',
        "processingStatus" character varying NOT NULL DEFAULT 'done',
        "aiSummary" text,
        "cvText" text,
        "skills" text,
        "hollandCode" text,
        "education" character varying,
        "experience" character varying,
        "portfolioUrl" character varying,
        "hasPortfolio" boolean NOT NULL DEFAULT false,
        "matchScore" double precision,
        "cvFilePath" character varying,
        "embedding" double precision[],
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_id" PRIMARY KEY ("id")
      );
    `);

    // 4. Users Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying,
        "fullName" character varying NOT NULL,
        "avatarUrl" character varying,
        "riasecTarget" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    // 5. User Sessions Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "deviceName" character varying NOT NULL,
        "token" text NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "PK_user_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_sessions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 6. Notifications Table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "type" character varying NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "badgeLabel" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_sessions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate";`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS cosine_similarity(double precision[], double precision[]);`);
  }
}
