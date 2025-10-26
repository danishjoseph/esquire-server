import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceEntity1761481392250 implements MigrationInterface {
    name = 'UpdateServiceEntity1761481392250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "services" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_c896350eb4a5969991bccfb0759" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_fada557eb1f0a0b751f815b11c6" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_fada557eb1f0a0b751f815b11c6"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_c896350eb4a5969991bccfb0759"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "created_by"`);
    }

}
