import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1761577329043 implements MigrationInterface {
    name = 'UpdateUserEntity1761577329043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2ca016813ffcce3392b3eb8ed0c" UNIQUE ("sub")`);
        await queryRunner.query(`CREATE INDEX "IDX_USERS_SUB" ON "users" ("sub") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_USERS_SUB"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2ca016813ffcce3392b3eb8ed0c"`);
    }

}
