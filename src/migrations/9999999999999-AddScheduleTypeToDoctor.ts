import { MigrationInterface, QueryRunner } from "typeorm";

// The class name and the 'name' property are now updated to match the new filename.
export class AddScheduleTypeToDoctor9999999999999 implements MigrationInterface {
    name = 'AddScheduleTypeToDoctor9999999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // These are the original commands that failed to run properly.
        await queryRunner.query(`CREATE TYPE "public"."doctor_schedule_type_enum" AS ENUM('stream', 'wave')`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD "schedule_type" "public"."doctor_schedule_type_enum" NOT NULL DEFAULT 'stream'`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD "wave_limit" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD "booked_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // The 'down' migration is here for completeness.
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP COLUMN "booked_count"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "wave_limit"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "schedule_type"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_schedule_type_enum"`);
    }

}