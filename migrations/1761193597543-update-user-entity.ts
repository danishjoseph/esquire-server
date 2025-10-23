import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1761193597543 implements MigrationInterface {
    name = 'UpdateUserEntity1761193597543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "sub" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mobile" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mobile" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sub"`);
    }

}
