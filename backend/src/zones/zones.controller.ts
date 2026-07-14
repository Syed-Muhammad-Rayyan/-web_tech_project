import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class CreateZoneDto {
  name: string;
}

@ApiTags('Housing Zones Configuration')
@Controller('zones')
export class ZonesController {
  constructor(private zonesService: ZonesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of configured housing zones' })
  async getZones() {
    return this.zonesService.getZones();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @ApiOperation({ summary: 'Configure a new housing zone (Admin only)' })
  @ApiBody({ type: CreateZoneDto })
  async addZone(@Body() body: CreateZoneDto) {
    return this.zonesService.addZone(body.name);
  }

  @Delete(':name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @ApiOperation({ summary: 'Remove a housing zone (Admin only)' })
  async removeZone(@Param('name') name: string) {
    return this.zonesService.removeZone(name);
  }
}
