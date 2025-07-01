import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { SetAvailabilityDto } from 'src/auth/dto/SetAvailabilityDto';
import { PaginationDto } from 'src/auth/dto/PaginationDto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateScheduleTypeDto } from 'src/auth/dto/update-schedule-type.dto';

@Controller('api/v1/doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // ✅ 1. Search all doctors
  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('specialization') specialization?: string,
  ) {
    return this.doctorService.getAllDoctors(name, specialization);
  }

  // ✅ 2. Get doctor by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorService.getDoctorById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  // ✅ 3. Doctor sets availability
  // ✅ 3. Doctor sets availability
// ✅ More secure version using doctorId + UUID sub check
@Post(':id/availability')
@UseGuards(JwtGuard, RolesGuard)
@Roles('doctor')
async setAvailability(
  @Param('id', ParseIntPipe) doctorId: number,
  @Body() dto: SetAvailabilityDto,
  @Req() req: any,
) {
  // ✅ Fetch the doctor by ID
  const doctor = await this.doctorService.getDoctorById(doctorId);

  // 🔐 Check if the logged-in user (req.user.sub) matches the doctor.user.id (UUID)
  if (!doctor || doctor.user?.id !== req.user?.sub) {
    throw new NotFoundException('Unauthorized access to availability');
  }

  return this.doctorService.setAvailability(doctorId, dto);
}


  // ✅ 4. Patient views doctor availability
@UseGuards(JwtGuard, RolesGuard)
@Roles('patient') // ✅ patient role required
@Get(':id/availability')
  async getAvailability(
    @Param('id', ParseIntPipe) doctorId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.doctorService.getDoctorAvailability(doctorId, pagination);
  }

@Patch(':id/schedule-type')
@Roles('doctor')
@UseGuards(JwtGuard, RolesGuard)
async updateScheduleType(
  @Param('id', ParseIntPipe) doctorId: number,
  @Body() dto: UpdateScheduleTypeDto,
) {
  return this.doctorService.updateScheduleType(doctorId, dto.schedule_type);
}
// PASTE THIS METHOD AT THE END OF THE DoctorController CLASS

@Get('debug/db-check')
async debugDbCheck() {
  console.log('--- TRIGGERING DB CHECK ENDPOINT ---');
  return this.doctorService.performDbCheck();
}
}
