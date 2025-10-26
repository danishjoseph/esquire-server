import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCustomerEntity1761466760910 implements MigrationInterface {
    name = 'UpdateCustomerEntity1761466760910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_8f138f284609b045dc64c91757a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_3b68fb19c315b75686c7f87fe78" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_3b68fb19c315b75686c7f87fe78"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_8f138f284609b045dc64c91757a"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "created_by"`);
    }

}
