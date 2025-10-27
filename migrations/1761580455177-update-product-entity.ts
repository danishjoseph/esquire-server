import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductEntity1761580455177 implements MigrationInterface {
    name = 'UpdateProductEntity1761580455177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "product_warranty" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_warranty"`);
    }

}
