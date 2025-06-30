import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { TimeSlot } from './entities/timeslot.entity';
import { User } from './entities/user.entity';
import { DoctorAvailability } from './entities/doctor_availability.entity';

import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // ✅ Use unified database URL
      ssl: {
        rejectUnauthorized: false, // ✅ Required for Render
      },
      entities: [Doctor, Patient, Appointment, TimeSlot, User, DoctorAvailability],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    DoctorModule,
    AppointmentModule,
  ],
})
export class AppModule {}
