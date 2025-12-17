import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceEntity1765943362799 implements MigrationInterface {
    name = 'UpdateServiceEntity1765943362799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."services_status_enum" RENAME TO "services_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum" AS ENUM('HOLD', 'IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "status" TYPE "public"."services_status_enum" USING "status"::"text"::"public"."services_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."services_status_enum" RENAME TO "services_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum" AS ENUM('HOLD', 'IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "status" TYPE "public"."services_status_enum" USING "status"::"text"::"public"."services_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum_old" AS ENUM('IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "status" TYPE "public"."services_status_enum_old" USING "status"::"text"::"public"."services_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."services_status_enum_old" RENAME TO "services_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."services_status_enum_old" AS ENUM('IN_PROGRESS', 'QC', 'DELIVERY_READY', 'DELIVERED', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "status" TYPE "public"."services_status_enum_old" USING "status"::"text"::"public"."services_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."services_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."services_status_enum_old" RENAME TO "services_status_enum"`);
    }

}
