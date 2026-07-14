import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class CreateReviewDto {
  bookingId: string;
  rating: number;
  text: string;
}

@ApiTags('Reviews & Feedback')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Submit a feedback review for a completed booking' })
  @ApiBody({ type: CreateReviewDto })
  async create(@Request() req: any, @Body() body: CreateReviewDto) {
    return this.reviewsService.submitReview(req.user.id, body);
  }

  @Get('target/:id')
  @ApiOperation({ summary: 'Get all reviews submitted for a user (Resident or Provider)' })
  async getByTarget(@Param('id') id: string) {
    return this.reviewsService.getReviewsForTarget(id);
  }
}
