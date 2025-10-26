import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductEntity1761469287792 implements MigrationInterface {
    name = 'UpdateProductEntity1761469287792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_c1af9b47239151e255f62e03247" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_c1af9b47239151e255f62e03247"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_by"`);
    }

}
