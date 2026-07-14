import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class EnhanceListingDto {
  rawBio: string;
  category: string;
  usps: string;
}

class MatchProvidersDto {
  needText: string;
  zone: string;
  timePreference: string;
}

@ApiTags('AI Integrations Proxy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('enhance-listing')
  @ApiOperation({ summary: 'Enhance a raw service description bio' })
  @ApiBody({ type: EnhanceListingDto })
  async enhanceListing(@Body() body: EnhanceListingDto) {
    return this.aiService.enhanceListing(body.rawBio, body.category, body.usps);
  }

  @Post('match-providers')
  @ApiOperation({ summary: 'Match resident needs text against list of providers' })
  @ApiBody({ type: MatchProvidersDto })
  async matchProviders(@Body() body: MatchProvidersDto) {
    return this.aiService.matchProviders(body.needText, body.zone, body.timePreference);
  }

  @Get('sentiment-profile/:providerId')
  @ApiOperation({ summary: 'Analyze and aggregate sentiment themes from provider reviews' })
  async getSentimentProfile(@Param('providerId') providerId: string) {
    return this.aiService.getSentimentProfile(providerId);
  }

  @Post('dispute-resolution/:bookingId')
  @ApiOperation({ summary: 'Generate dispute resolution suggestion (Moderator assistant)' })
  async suggestDisputeResolution(@Param('bookingId') bookingId: string) {
    return this.aiService.suggestDisputeResolution(bookingId);
  }
}
