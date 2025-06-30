import { IsIn } from 'class-validator';

export class UpdateScheduleTypeDto {
  @IsIn(['stream', 'wave'], { message: 'schedule_type must be either "stream" or "wave"' })
  schedule_type: 'stream' | 'wave';
}
