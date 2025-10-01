import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceSections1759087436923 implements MigrationInterface {
    name = 'AddServiceSections1759087436923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."service_sections_service_section_name_enum" AS ENUM('LAP_CARE', 'CHIP_LEVEL', 'DESKTOP_CARE', 'IPG', 'VENDOR_ASP', 'OUTSOURCE', 'HOLD')`);
        await queryRunner.query(`CREATE TABLE "service_sections" ("id" SERIAL NOT NULL, "service_section_name" "public"."service_sections_service_section_name_enum" NOT NULL, CONSTRAINT "PK_c1b9911786f5e5b6b40f79d1221" PRIMARY KEY ("id"))`);
        // Insert initial data
        const serviceSections = ['LAP_CARE', 'CHIP_LEVEL', 'DESKTOP_CARE', 'IPG', 'VENDOR_ASP', 'OUTSOURCE', 'HOLD'];
        for (const section of serviceSections) {
            await queryRunner.query(`
                INSERT INTO "service_sections"("service_section_name")
                VALUES ('${section}')
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service_sections"`);
        await queryRunner.query(`DROP TYPE "public"."service_sections_service_section_name_enum"`);
    }

}
