import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceLog1759515303432 implements MigrationInterface {
    name = 'AddServiceLog1759515303432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."service_logs_service_log_type_enum" AS ENUM('DIAGNOSIS', 'COMPLAINTS', 'STATUS_UPDATE', 'FEEDBACK')`);
        await queryRunner.query(`CREATE TABLE "service_logs" ("id" SERIAL NOT NULL, "service_log_type" "public"."service_logs_service_log_type_enum" NOT NULL, "log_description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "service_log_id" integer, CONSTRAINT "PK_bca63249c66fd0803d17ca79e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_logs" ADD CONSTRAINT "FK_Service_Log_Service" FOREIGN KEY ("service_log_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_logs" DROP CONSTRAINT "FK_Service_Log_Service"`);
        await queryRunner.query(`DROP TABLE "service_logs"`);
        await queryRunner.query(`DROP TYPE "public"."service_logs_service_log_type_enum"`);
    }

}
