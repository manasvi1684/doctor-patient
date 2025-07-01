import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScheduleTypeToDoctor1751350971070 implements MigrationInterface {
    name = 'AddScheduleTypeToDoctor1751350971070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."doctor_schedule_type_enum" AS ENUM('stream', 'wave')`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD "schedule_type" "public"."doctor_schedule_type_enum" NOT NULL DEFAULT 'stream'`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD "wave_limit" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD "booked_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP COLUMN "booked_count"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "wave_limit"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "schedule_type"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_schedule_type_enum"`);
    }

}
