import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertServiceSectionNames1766657650350 implements MigrationInterface {
    name = 'InsertServiceSectionNames1766657650350'

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`
           INSERT INTO service_sections (service_section_name)
           VALUES
           ('LAP_FOE'),
           ('LAP_CARE'),
           ('CHIP_LEVEL'),
           ('DESKTOP_CARE'),
           ('IPG'),
           ('VENDOR_ASP'),
           ('OUTSOURCE'),
           ('OUTDOOR'),
           ('HOLD');
       `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`
           DELETE FROM service_sections
           WHERE service_section_name IN (
               'LAP_FOE',
               'LAP_CARE',
               'CHIP_LEVEL',
               'DESKTOP_CARE',
               'IPG',
               'VENDOR_ASP',
               'OUTSOURCE',
               'OUTDOOR',
               'HOLD'
           );
       `);
    }

}
