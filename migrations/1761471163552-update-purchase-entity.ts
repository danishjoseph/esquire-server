import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePurchaseEntity1761471163552 implements MigrationInterface {
    name = 'UpdatePurchaseEntity1761471163552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_70ebb313de49b0256d21b1527d4" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_8c2337a204df46eb73ea68745c1" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_8c2337a204df46eb73ea68745c1"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_70ebb313de49b0256d21b1527d4"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "created_by"`);
    }

}
