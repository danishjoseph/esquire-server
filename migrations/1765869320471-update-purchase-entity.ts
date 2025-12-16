import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePurchaseEntity1765869320471 implements MigrationInterface {
    name = 'UpdatePurchaseEntity1765869320471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_PURCHASE_INVOICE_NUMBER"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "UQ_425eace41167a65a8082d2c7852"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "UQ_purchases_invoice_number"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "UQ_purchases_invoice_number" UNIQUE ("invoice_number")`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "UQ_425eace41167a65a8082d2c7852" UNIQUE ("invoice_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_PURCHASE_INVOICE_NUMBER" ON "purchases" ("invoice_number") `);
    }

}
