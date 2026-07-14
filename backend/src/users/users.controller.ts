import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

class UpgradeProviderDto {
  bio: string;
  categories: string[];
  availability: string;
  coverageRadius: number;
  idProofUrl?: string;
  portfolioPhotos?: string[];
}

class UpdateProviderProfileDto {
  bio?: string;
  categories?: string[];
  availability?: string;
  coverageRadius?: number;
  portfolioPhotos?: string[];
}

@ApiTags('Users & Service Providers')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get list of all registered service providers' })
  @ApiResponse({ status: 200, description: 'Providers list retrieved.' })
  async getProviders() {
    return this.usersService.getProviders();
  }

  @Get('providers/:id')
  @ApiOperation({ summary: 'Get details of a specific service provider' })
  @ApiResponse({ status: 200, description: 'Provider details retrieved.' })
  @ApiResponse({ status: 404, description: 'Provider not found.' })
  async getProviderById(@Param('id') id: string) {
    return this.usersService.getProviderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Update personal profile details' })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(@Request() req: any, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade account to Service Provider' })
  @ApiBody({ type: UpgradeProviderDto })
  async upgrade(@Request() req: any, @Body() body: UpgradeProviderDto) {
    return this.usersService.upgradeToProvider(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('provider-profile')
  @ApiOperation({ summary: 'Update provider profile specific details' })
  @ApiBody({ type: UpdateProviderProfileDto })
  async updateProviderProfile(@Request() req: any, @Body() body: UpdateProviderProfileDto) {
    return this.usersService.updateProviderProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @Post('providers/:id/verify')
  @ApiOperation({ summary: 'Verify service provider ID & credentials (Admin only)' })
  @ApiResponse({ status: 200, description: 'Provider verified successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not Admin).' })
  async verifyProvider(@Param('id') id: string) {
    return this.usersService.verifyProvider(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Get list of all users' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
