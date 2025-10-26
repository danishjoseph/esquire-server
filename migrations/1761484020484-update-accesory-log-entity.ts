import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccesoryLogEntity1761484020484 implements MigrationInterface {
    name = 'UpdateAccesoryLogEntity1761484020484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessories" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "accessories" ADD CONSTRAINT "FK_014b2c21762aaaf695f2869475e" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessories" DROP CONSTRAINT "FK_014b2c21762aaaf695f2869475e"`);
        await queryRunner.query(`ALTER TABLE "accessories" DROP COLUMN "created_by"`);
    }

}
