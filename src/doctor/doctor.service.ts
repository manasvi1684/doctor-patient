import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorAvailability } from 'src/entities/doctor_availability.entity';
import { TimeSlot } from 'src/entities/timeslot.entity';
import { SetAvailabilityDto } from 'src/auth/dto/SetAvailabilityDto';
import { PaginationDto } from 'src/auth/dto/PaginationDto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,

    @InjectRepository(TimeSlot)
    private timeSlotRepo: Repository<TimeSlot>,
  ) {}

  getAllDoctors(name?: string, specialization?: string) {
    const qb = this.doctorRepository.createQueryBuilder('doctor');

    if (name) {
      qb.andWhere(
        "LOWER(doctor.first_name || ' ' || doctor.last_name) ILIKE :name",
        { name: `%${name.toLowerCase()}%` },
      );
    }

    if (specialization) {
      qb.andWhere('LOWER(doctor.specialization) ILIKE :specialization', {
        specialization: `%${specialization.toLowerCase()}%`,
      });
    }

    return qb.getMany();
  }

  getDoctorById(id: number) {
    return this.doctorRepository.findOne({
      where: { doctor_id: id },
      relations: ['user', 'appointments', 'timeSlots'],
    });
  }

  async setAvailability(doctorId: number, dto: SetAvailabilityDto) {
    try {
      console.log('📥 Incoming SetAvailabilityDto:', dto);

      const doctor = await this.doctorRepository.findOne({
        where: { doctor_id: doctorId },
      });
      console.log('👨‍⚕️ Doctor found:', doctor);

      if (!doctor) throw new NotFoundException('Doctor not found');

      const { date, start_time, end_time, session, weekdays, interval_minutes = 30 } = dto;

      const parsedDate = new Date(date);
      console.log('🗓 Parsed Date:', parsedDate);

      if (parsedDate < new Date()) {
        console.warn('⚠️ Date is in the past:', parsedDate);
        throw new BadRequestException('Date cannot be in the past');
      }

      const availability = this.availabilityRepo.create({
        doctor: { doctor_id: doctorId } as Doctor,
        date: parsedDate,
        start_time,
        end_time,
        session,
        weekdays,
      });

      console.log('📝 Availability object created:', availability);

      const savedAvailability = await this.availabilityRepo.save(availability);
      console.log('✅ Availability saved:', savedAvailability);

      const slots = this.generateTimeSlots(savedAvailability, interval_minutes);
      console.log('⏱ Generated time slots:', slots);

      await this.timeSlotRepo.save(slots);
      console.log('💾 Time slots saved successfully.');

      return { message: 'Availability and slots created', slots };
    } catch (error) {
      console.error('❌ Error in setAvailability:', error);
      throw new InternalServerErrorException('Something went wrong while setting availability.');
    }
  }

  async getDoctorAvailability(
  doctorId: number,
  { page = 1, limit = 10 }: PaginationDto
) {
  const skip = (page - 1) * limit;

  const qb = this.timeSlotRepo.createQueryBuilder('slot');
  qb.where('slot.doctor_id = :doctorId', { doctorId }) // 🔧 fixed: doctor_id
    .andWhere('slot.is_available = :isAvailable', { isAvailable: true })
    .andWhere('slot.date >= CURRENT_DATE')
    .orderBy('slot.date', 'ASC')
    .addOrderBy('slot.start_time', 'ASC')
    .skip(skip)
    .take(limit);

  const [slots, total] = await qb.getManyAndCount();

  return {
    total,
    page,
    limit,
    slots,
  };
}


private generateTimeSlots(availability: DoctorAvailability, interval: number): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Normalize availability.date to a string in YYYY-MM-DD format
  const dateObj = typeof availability.date === 'string'
    ? new Date(availability.date)
    : availability.date;

  const formattedDate = dateObj.toISOString().split('T')[0];

  const start = new Date(`${formattedDate}T${availability.start_time}`);
  const end = new Date(`${formattedDate}T${availability.end_time}`);

  console.log(`📍 Slot window: ${start.toISOString()} to ${end.toISOString()}`);

  while (start < end) {
    const slotEnd = new Date(start.getTime() + interval * 60000);
    if (slotEnd > end) break;

    const slot = this.timeSlotRepo.create({
      doctor: { doctor_id: availability.doctor?.doctor_id || 0 } as Doctor,
      availability: { id: availability.id } as DoctorAvailability,
      date: formattedDate,
      day_of_week: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      start_time: start.toTimeString().slice(0, 5),
      end_time: slotEnd.toTimeString().slice(0, 5),
      is_available: true,
    });

    slots.push(slot);
    start.setMinutes(start.getMinutes() + interval);
  }

  console.log('⏱ Generated time slots:', slots);

  return slots;
}

async updateScheduleType(doctorId: number, schedule_type: 'stream' | 'wave') {
  const doctor = await this.doctorRepository.findOne({ where: { doctor_id: doctorId } });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  doctor.schedule_type = schedule_type;
  await this.doctorRepository.save(doctor);

  return { message: `Schedule type updated to ${schedule_type}` };
}




}
