import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { TimeSlot } from 'src/entities/timeslot.entity';
import { Patient } from 'src/entities/patient.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, TimeSlot, Patient])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
