import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1751307735439 implements MigrationInterface {
    name = 'Init1751307735439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "schedule_type"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "wave_limit"`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD "booked_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "doctor" ALTER COLUMN "wave_limit" SET DEFAULT '1'`);

        // ADD IF NOT ALREADY ADDED IN A PREVIOUS MIGRATION
        await queryRunner.query(`ALTER TABLE "doctor" ADD "schedule_type" VARCHAR NOT NULL DEFAULT 'stream'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "schedule_type"`);
        await queryRunner.query(`ALTER TABLE "doctor" ALTER COLUMN "wave_limit" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP COLUMN "booked_count"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "wave_limit" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "schedule_type" character varying NOT NULL DEFAULT 'stream'`);
    }
}
