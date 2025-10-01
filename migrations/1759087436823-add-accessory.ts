import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccessory1759087436823 implements MigrationInterface {
    name = 'AddAccessory1759087436823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accessories" ("id" SERIAL NOT NULL, "accessory_name" character varying NOT NULL, "accessory_received" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4849cfa5b51ec8d79d0d5f34791" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accessories"`);
    }

}
