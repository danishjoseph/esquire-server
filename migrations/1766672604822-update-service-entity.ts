import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceEntity1766672604822 implements MigrationInterface {
    name = 'UpdateServiceEntity1766672604822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "assigned_user" integer`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_bd5b85f3a18960afc56b6f2f0f0" FOREIGN KEY ("assigned_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_bd5b85f3a18960afc56b6f2f0f0"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "assigned_user"`);
    }

}
