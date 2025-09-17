import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomer1758129124264 implements MigrationInterface {
  name = 'AddCustomer1758129124264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "mobile" character varying(20) NOT NULL, "alt_mobile" character varying(20), "email" character varying(100), "address" text, "house_office" character varying(100), "street_building" character varying(100), "area" character varying(100), "pincode" character varying(10), "district" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
