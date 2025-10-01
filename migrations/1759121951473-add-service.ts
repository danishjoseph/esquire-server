import { MigrationInterface, QueryRunner } from "typeorm";

export class AddService1759121951473 implements MigrationInterface {
    name = 'AddService1759121951473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum" AS ENUM('IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."services_service_type_enum" AS ENUM('INHOUSE', 'OUTDOOR')`);
        await queryRunner.query(`CREATE TYPE "public"."services_service_status_enum" AS ENUM('CHARGEABLE', 'WARRANTY_FREE', 'FREE')`);
        await queryRunner.query(`CREATE TYPE "public"."services_product_condition_enum" AS ENUM('EXCELLENT', 'VERY_GOOD', 'GOOD', 'POOR', 'VERY_POOR', 'DAMAGED')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "status" "public"."services_status_enum" NOT NULL, "service_type" "public"."services_service_type_enum" NOT NULL, "service_status" "public"."services_service_status_enum" NOT NULL, "case_id" character varying(20) NOT NULL, "quotation_amount" numeric NOT NULL, "service_charge" numeric NOT NULL, "gst_amount" numeric NOT NULL, "total_amount" numeric NOT NULL, "advance_amount" numeric NOT NULL, "product_condition" "public"."services_product_condition_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "purchase_id" integer, "service_section_id" integer, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_SERVICE_CASE_ID" ON "services" ("case_id") `);
        await queryRunner.query(`ALTER TABLE "accessories" ADD "service_id" integer`);
        await queryRunner.query(`ALTER TABLE "accessories" ADD CONSTRAINT "FK_Service_Accessory" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_Purchase_Service" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_ServiceSection_Service" FOREIGN KEY ("service_section_id") REFERENCES "service_sections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_ServiceSection_Service"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_Purchase_Service"`);
        await queryRunner.query(`ALTER TABLE "accessories" DROP CONSTRAINT "FK_Service_Accessory"`);
        await queryRunner.query(`ALTER TABLE "accessories" DROP COLUMN "service_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_SERVICE_CASE_ID"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_product_condition_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_service_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_service_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum"`);
    }

}
