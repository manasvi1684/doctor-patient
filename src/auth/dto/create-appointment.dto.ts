import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsDateString()
  date: string; // Format: YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  weekday: string;

  @IsNotEmpty()
  @IsString()
  session: string; // e.g., 'morning'

  @IsNotEmpty()
  @IsString()
  start_time: string; // e.g., '10:00'

  @IsNotEmpty()
  @IsString()
  end_time: string; // e.g., '12:00'
}
