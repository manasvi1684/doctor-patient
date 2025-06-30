import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { TimeSlot } from 'src/entities/timeslot.entity';
import { CreateAppointmentDto } from 'src/auth/dto/create-appointment.dto';
import { Patient } from 'src/entities/patient.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(TimeSlot)
    private timeSlotRepo: Repository<TimeSlot>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async bookAppointment(
    patientId: number,
    dto: CreateAppointmentDto,
  ) {
    const doctor = await this.doctorRepo.findOne({
      where: { doctor_id: dto.doctor_id },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const slot = await this.timeSlotRepo.findOne({
      where: {
        doctor: { doctor_id: dto.doctor_id },
        date: new Date(dto.date),
        start_time: dto.start_time,
        end_time: dto.end_time,
      },
    });
    if (!slot) throw new NotFoundException('Time slot not found');

    const patient = await this.patientRepo.findOne({
      where: { patient_id: patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    if (doctor.schedule_type === 'stream') {
      if (!slot.is_available) throw new ConflictException('Slot already booked');

      const appointment = this.appointmentRepo.create({
        doctor,
        patient,
        appointment_date: dto.date,
        time_slot: `${dto.start_time} - ${dto.end_time}`,
        appointment_status: 'booked',
      });

      await this.appointmentRepo.save(appointment);
      slot.is_available = false;
      await this.timeSlotRepo.save(slot);

      return { message: 'Appointment booked (stream)', appointment };
    }

    // Wave scheduling
    if (doctor.schedule_type === 'wave') {
      const waveLimit = doctor.wave_limit ?? 3;

      if (slot.booked_count >= waveLimit)
        throw new ConflictException('Wave slot is full');

      const appointment = this.appointmentRepo.create({
        doctor,
        patient,
        appointment_date: dto.date,
        time_slot: `${dto.start_time} - ${dto.end_time}`,
        appointment_status: 'booked',
      });

      await this.appointmentRepo.save(appointment);
      slot.booked_count += 1;
      if (slot.booked_count >= waveLimit) slot.is_available = false;

      await this.timeSlotRepo.save(slot);

      return { message: 'Appointment booked (wave)', appointment };
    }

    throw new BadRequestException('Invalid schedule type');
  }
}
