import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1660810900148 implements MigrationInterface {
    name = 'Initial1660810900148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "isOwner" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "developer_company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_80265d3aa4ef21b97ef16a03509" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be143dfda4f1cc71e6188c0ddf" ON "developer_company" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_app" ("id" SERIAL NOT NULL, "appId" integer NOT NULL, "userId" integer NOT NULL, "installed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_f23ceb83ab7d5cae76f53b128c4" UNIQUE ("userId", "appId"), CONSTRAINT "PK_ae1b3d4b8710de89a0c1091f315" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0bf33b4616073bff8d2b7a02a8" ON "user_app" ("appId") `);
        await queryRunner.query(`CREATE INDEX "IDX_68d4b7eb842f384eb6dee326ae" ON "user_app" ("userId") `);
        await queryRunner.query(`CREATE TABLE "app" ("id" SERIAL NOT NULL, "developerId" integer NOT NULL, "name" character varying NOT NULL, "icon" character varying, "shortDescription" character varying, "longDescription" text, "price" numeric(12,2) NOT NULL, "published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9478629fc093d229df09e560aea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd27679682a0d26bdaa51236ff" ON "app" ("developerId") `);
        await queryRunner.query(`CREATE TABLE "payment_transaction" ("id" SERIAL NOT NULL, "appId" integer NOT NULL, "userId" integer NOT NULL, "amountPaid" numeric(12,2) NOT NULL, "commissionAmount" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_829e0efb7ee293ce337bb1472d" ON "payment_transaction" ("appId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c30515be97af9ab6316b00ddeb" ON "payment_transaction" ("userId") `);
        await queryRunner.query(`ALTER TABLE "developer_company" ADD CONSTRAINT "FK_be143dfda4f1cc71e6188c0ddf7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_app" ADD CONSTRAINT "FK_0bf33b4616073bff8d2b7a02a83" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_app" ADD CONSTRAINT "FK_68d4b7eb842f384eb6dee326aec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app" ADD CONSTRAINT "FK_cd27679682a0d26bdaa51236ff9" FOREIGN KEY ("developerId") REFERENCES "developer_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_829e0efb7ee293ce337bb1472dd" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_c30515be97af9ab6316b00ddeb1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_c30515be97af9ab6316b00ddeb1"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_829e0efb7ee293ce337bb1472dd"`);
        await queryRunner.query(`ALTER TABLE "app" DROP CONSTRAINT "FK_cd27679682a0d26bdaa51236ff9"`);
        await queryRunner.query(`ALTER TABLE "user_app" DROP CONSTRAINT "FK_68d4b7eb842f384eb6dee326aec"`);
        await queryRunner.query(`ALTER TABLE "user_app" DROP CONSTRAINT "FK_0bf33b4616073bff8d2b7a02a83"`);
        await queryRunner.query(`ALTER TABLE "developer_company" DROP CONSTRAINT "FK_be143dfda4f1cc71e6188c0ddf7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c30515be97af9ab6316b00ddeb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_829e0efb7ee293ce337bb1472d"`);
        await queryRunner.query(`DROP TABLE "payment_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd27679682a0d26bdaa51236ff"`);
        await queryRunner.query(`DROP TABLE "app"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68d4b7eb842f384eb6dee326ae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0bf33b4616073bff8d2b7a02a8"`);
        await queryRunner.query(`DROP TABLE "user_app"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be143dfda4f1cc71e6188c0ddf"`);
        await queryRunner.query(`DROP TABLE "developer_company"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
