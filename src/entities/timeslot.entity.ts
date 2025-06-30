import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { DoctorAvailability } from './doctor_availability.entity';

@Entity('doctor_time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => DoctorAvailability, (availability) => availability.timeSlots, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'availability_id' })
  availability: DoctorAvailability;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  day_of_week: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ default: true })
  is_available: boolean;

  // 🔸 NEW: Keep track of how many patients booked this slot
  @Column({ type: 'int', default: 0 })
  booked_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
