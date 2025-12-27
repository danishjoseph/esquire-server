import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePurchaseEntity1766804992191 implements MigrationInterface {
    name = 'UpdatePurchaseEntity1766804992191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_PURCHASE_PRODUCT" ON "purchases" ("product_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_PURCHASE_PRODUCT"`);
    }

}
