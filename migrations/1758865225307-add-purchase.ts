import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPurchase1758865225307 implements MigrationInterface {
  name = 'AddPurchase1758865225307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."purchases_purchase_status_enum" AS ENUM('ESQUIRE', 'NON_ESQUIRE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."purchases_warranty_status_enum" AS ENUM('UNDER_1YR', 'WARRANTY_UPGRADE', 'ASC', 'NON_WARRANTY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "purchase_status" "public"."purchases_purchase_status_enum" NOT NULL, "warranty_status" "public"."purchases_warranty_status_enum" NOT NULL, "purchase_date" TIMESTAMP NOT NULL, "invoice_number" character varying(50) NOT NULL, "warranty_expiry" TIMESTAMP NOT NULL, "asc_start_date" TIMESTAMP, "asc_expiry_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "customer_id" integer, CONSTRAINT "UQ_425eace41167a65a8082d2c7852" UNIQUE ("invoice_number"), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PURCHASE_INVOICE_NUMBER" ON "purchases" ("invoice_number") `,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "customer_id"`);
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_1ce91bd87ddfcecde930deeaab9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_6b126c5c1c05fc81e93fc8d427a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_6b126c5c1c05fc81e93fc8d427a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_1ce91bd87ddfcecde930deeaab9"`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "customer_id" integer`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_PURCHASE_INVOICE_NUMBER"`,
    );
    await queryRunner.query(`DROP TABLE "purchases"`);
    await queryRunner.query(
      `DROP TYPE "public"."purchases_warranty_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."purchases_purchase_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
