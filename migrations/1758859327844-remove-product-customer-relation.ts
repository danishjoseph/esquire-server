import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProductCustomerRelation1758859327844
  implements MigrationInterface
{
  name = 'RemoveProductCustomerRelation1758859327844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query( `ALTER TABLE "products" DROP CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e"`,);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "customer_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "customer_id" integer`);
    await queryRunner.query( `ALTER TABLE "products" ADD CONSTRAINT "FK_91c1e7c771331a85a9a4c3f638e" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,);
  }
}
