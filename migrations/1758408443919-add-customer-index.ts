import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerIndex1758408443919 implements MigrationInterface {
  name = 'AddCustomerIndex1758408443919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_DISTRICT" ON "customers" ("district") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PINCODE" ON "customers" ("pincode") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMAIL" ON "customers" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ALT_MOBILE" ON "customers" ("alt_mobile") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MOBILE" ON "customers" ("mobile") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_NAME" ON "customers" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_NAME"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_MOBILE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ALT_MOBILE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMAIL"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PINCODE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_DISTRICT"`);
  }
}
