import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProduct1758517242106 implements MigrationInterface {
  name = 'AddProduct1758517242106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_category_enum" AS ENUM('normal_laptop', 'gaming_laptop', 'tablet', 'normal_desktop_cpu', 'gaming_cpu', 'monitors', 'ups', 'ipg_products', 'accessories', 'cctv_dvr_nvr', 'cctv_camera', 'smps', 'others')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "serial_number" character varying(100) NOT NULL, "category" "public"."products_category_enum" NOT NULL, "name" character varying(100) NOT NULL, "brand" character varying(100), "model_name" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer, CONSTRAINT "UQ_d95100c677e0db71a45424229b7" UNIQUE ("serial_number"), CONSTRAINT "UQ_d95100c677e0db71a45424229b7" UNIQUE ("serial_number"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PRODUCT_SERIAL_NUMBER" ON "products" ("serial_number") `,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_PRODUCT_SERIAL_NUMBER"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
  }
}
