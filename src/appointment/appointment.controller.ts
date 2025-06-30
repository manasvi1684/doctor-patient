import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from 'src/auth/dto/create-appointment.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/appointments')
@UseGuards(JwtGuard, RolesGuard)
@Roles('patient')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  book(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    const patientId = req.user.sub;
    return this.appointmentService.bookAppointment(patientId, dto);
  }
}
