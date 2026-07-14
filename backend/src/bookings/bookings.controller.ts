import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class CreateBookingDto {
  providerId: string;
  service: string;
  date: string;
  time: string;
  description: string;
}

class UpdateStatusDto {
  status: string;
}

class RaiseDisputeDto {
  complaint: string;
  evidence: string;
}

class ResolveDisputeDto {
  resolution: string;
}

@ApiTags('Bookings & Scheduling')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service booking request' })
  @ApiBody({ type: CreateBookingDto })
  async create(@Request() req: any, @Body() body: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, body);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get list of bookings involving current user' })
  async getMy(@Request() req: any) {
    return this.bookingsService.getMyBookings(req.user.id, req.user.role);
  }

  @Get('disputes')
  @UseGuards(RolesGuard)
  @Roles('Moderator', 'Admin')
  @ApiOperation({ summary: 'Get all active platform disputes (Moderator / Admin only)' })
  async getAllDisputes() {
    return this.bookingsService.getAllDisputes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific booking' })
  async getById(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.getBookingById(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiBody({ type: UpdateStatusDto })
  async updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.bookingsService.updateStatus(id, body.status, req.user.id, req.user.role);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Raise a dispute on a completed or in-progress booking' })
  @ApiBody({ type: RaiseDisputeDto })
  async raiseDispute(@Request() req: any, @Param('id') id: string, @Body() body: RaiseDisputeDto) {
    return this.bookingsService.raiseDispute(id, req.user.id, body);
  }

  @Post(':id/assign-moderator')
  @UseGuards(RolesGuard)
  @Roles('Moderator', 'Admin')
  @ApiOperation({ summary: 'Assign a moderator to oversee a dispute (Moderator only)' })
  async assignModerator(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.assignModerator(id, req.user.id);
  }

  @Post(':id/resolve-dispute')
  @UseGuards(RolesGuard)
  @Roles('Moderator', 'Admin')
  @ApiOperation({ summary: 'Submit final dispute resolution and close dispute (Moderator only)' })
  @ApiBody({ type: ResolveDisputeDto })
  async resolveDispute(@Request() req: any, @Param('id') id: string, @Body() body: ResolveDisputeDto) {
    return this.bookingsService.resolveDispute(id, body.resolution, req.user.id);
  }
}
