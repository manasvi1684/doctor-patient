// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { dataSourceOptions } from '../data-source'; // <-- IMPORT THE CONFIG

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Use the imported configuration here
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    DoctorModule,
    AppointmentModule,
  ],
})
export class AppModule {}