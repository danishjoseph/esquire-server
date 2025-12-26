import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntities1766657650243 implements MigrationInterface {
    name = 'AddEntities1766657650243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('FOE', 'ADMIN', 'ENGINEER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "sub" character varying NOT NULL, "name" character varying, "mobile" character varying(20), "email" character varying(100), "role" "public"."users_role_enum" NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_2ca016813ffcce3392b3eb8ed0c" UNIQUE ("sub"), CONSTRAINT "UQ_2ca016813ffcce3392b3eb8ed0c" UNIQUE ("sub"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_USERS_SUB" ON "users" ("sub") `);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "mobile" character varying(20) NOT NULL, "alt_mobile" character varying(20), "email" character varying(100), "address" text, "house_office" character varying(100), "street_building" character varying(100), "area" character varying(100), "pincode" character varying(10), "district" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_DISTRICT" ON "customers" ("district") `);
        await queryRunner.query(`CREATE INDEX "IDX_PINCODE" ON "customers" ("pincode") `);
        await queryRunner.query(`CREATE INDEX "IDX_EMAIL" ON "customers" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ALT_MOBILE" ON "customers" ("alt_mobile") `);
        await queryRunner.query(`CREATE INDEX "IDX_MOBILE" ON "customers" ("mobile") `);
        await queryRunner.query(`CREATE INDEX "IDX_NAME" ON "customers" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."service_sections_service_section_name_enum" AS ENUM('LAP_FOE', 'LAP_CARE', 'CHIP_LEVEL', 'DESKTOP_CARE', 'IPG', 'VENDOR_ASP', 'OUTSOURCE', 'OUTDOOR', 'HOLD')`);
        await queryRunner.query(`CREATE TABLE "service_sections" ("id" SERIAL NOT NULL, "service_section_name" "public"."service_sections_service_section_name_enum" NOT NULL, CONSTRAINT "PK_c1b9911786f5e5b6b40f79d1221" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accessories" ("id" SERIAL NOT NULL, "accessory_name" character varying NOT NULL, "accessory_received" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "service_id" integer, "created_by" integer, CONSTRAINT "PK_4849cfa5b51ec8d79d0d5f34791" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_logs_service_log_type_enum" AS ENUM('DIAGNOSIS', 'COMPLAINTS', 'STATUS_UPDATE', 'FEEDBACK')`);
        await queryRunner.query(`CREATE TABLE "service_logs" ("id" SERIAL NOT NULL, "service_log_type" "public"."service_logs_service_log_type_enum" NOT NULL, "log_description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "service_log_id" integer, "created_by" integer, "updated_by" integer, CONSTRAINT "PK_bca63249c66fd0803d17ca79e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum" AS ENUM('IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."services_service_type_enum" AS ENUM('INHOUSE', 'OUTDOOR')`);
        await queryRunner.query(`CREATE TYPE "public"."services_service_status_enum" AS ENUM('CHARGEABLE', 'WARRANTY_FREE', 'FREE')`);
        await queryRunner.query(`CREATE TYPE "public"."services_product_condition_enum" AS ENUM('EXCELLENT', 'VERY_GOOD', 'GOOD', 'POOR', 'VERY_POOR', 'DAMAGED')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "status" "public"."services_status_enum" NOT NULL, "service_type" "public"."services_service_type_enum" NOT NULL, "service_status" "public"."services_service_status_enum", "case_id" character varying(20) NOT NULL, "quotation_amount" numeric NOT NULL, "service_charge" numeric NOT NULL, "gst_amount" numeric NOT NULL, "total_amount" numeric NOT NULL, "advance_amount" numeric NOT NULL, "product_condition" "public"."services_product_condition_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "purchase_id" integer, "service_section_id" integer, "created_by" integer, "updated_by" integer, CONSTRAINT "UQ_10c16607995ccf4fbed33542475" UNIQUE ("case_id"), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_SERVICE_CASE_ID" ON "services" ("case_id") `);
        await queryRunner.query(`CREATE TYPE "public"."purchases_purchase_status_enum" AS ENUM('ESQUIRE', 'NON_ESQUIRE')`);
        await queryRunner.query(`CREATE TYPE "public"."purchases_warranty_status_enum" AS ENUM('UNDER_1YR', 'WARRANTY_UPGRADE', 'ASC', 'NON_WARRANTY')`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "purchase_status" "public"."purchases_purchase_status_enum" NOT NULL, "warranty_status" "public"."purchases_warranty_status_enum" NOT NULL, "purchase_date" date, "invoice_number" character varying(50), "warranty_expiry" date, "asc_start_date" date, "asc_expiry_date" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "customer_id" integer, "created_by" integer, "updated_by" integer, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum" AS ENUM('normal_laptop', 'gaming_laptop', 'tablet', 'normal_desktop_cpu', 'gaming_cpu', 'monitors', 'ups', 'ipg_products', 'accessories', 'cctv_dvr_nvr', 'cctv_camera', 'smps', 'others')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "serial_number" character varying(100) NOT NULL, "category" "public"."products_category_enum" NOT NULL, "name" character varying(100) NOT NULL, "brand" character varying(100), "model_name" character varying(100), "product_warranty" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, CONSTRAINT "UQ_d95100c677e0db71a45424229b7" UNIQUE ("serial_number"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_PRODUCT_SERIAL_NUMBER" ON "products" ("serial_number") `);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_8f138f284609b045dc64c91757a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_3b68fb19c315b75686c7f87fe78" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accessories" ADD CONSTRAINT "FK_Service_Accessory" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accessories" ADD CONSTRAINT "FK_014b2c21762aaaf695f2869475e" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_Service_Log_Service" FOREIGN KEY ("service_log_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_8aa90535da5a7828d944e113f65" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_ecbcea4640250a6eae178b5e506" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_Purchase_Service" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_ServiceSection_Service" FOREIGN KEY ("service_section_id") REFERENCES "service_sections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_c896350eb4a5969991bccfb0759" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_fada557eb1f0a0b751f815b11c6" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_1ce91bd87ddfcecde930deeaab9" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_6b126c5c1c05fc81e93fc8d427a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_70ebb313de49b0256d21b1527d4" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_8c2337a204df46eb73ea68745c1" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_c1af9b47239151e255f62e03247" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_c1af9b47239151e255f62e03247"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_8c2337a204df46eb73ea68745c1"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_70ebb313de49b0256d21b1527d4"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_6b126c5c1c05fc81e93fc8d427a"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_1ce91bd87ddfcecde930deeaab9"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_fada557eb1f0a0b751f815b11c6"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_c896350eb4a5969991bccfb0759"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_ServiceSection_Service"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_Purchase_Service"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_ecbcea4640250a6eae178b5e506"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_8aa90535da5a7828d944e113f65"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_Service_Log_Service"`);
        await queryRunner.query(`ALTER TABLE "accessories" DROP CONSTRAINT "FK_014b2c21762aaaf695f2869475e"`);
        await queryRunner.query(`ALTER TABLE "accessories" DROP CONSTRAINT "FK_Service_Accessory"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_3b68fb19c315b75686c7f87fe78"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_8f138f284609b045dc64c91757a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PRODUCT_SERIAL_NUMBER"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_warranty_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_purchase_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_SERVICE_CASE_ID"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_product_condition_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_service_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_service_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum"`);
        await queryRunner.query(`DROP TABLE "service_logs"`);
        await queryRunner.query(`DROP TYPE "public"."service_logs_service_log_type_enum"`);
        await queryRunner.query(`DROP TABLE "accessories"`);
        await queryRunner.query(`DROP TABLE "service_sections"`);
        await queryRunner.query(`DROP TYPE "public"."service_sections_service_section_name_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_NAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MOBILE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ALT_MOBILE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PINCODE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_DISTRICT"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USERS_SUB"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
