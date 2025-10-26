import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceLogEntity1761481995505 implements MigrationInterface {
    name = 'UpdateServiceLogEntity1761481995505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_logs" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_8aa90535da5a7828d944e113f65" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_ecbcea4640250a6eae178b5e506" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_ecbcea4640250a6eae178b5e506"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_8aa90535da5a7828d944e113f65"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "service_logs" DROP COLUMN "created_by"`);
    }

}
