import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async submitReview(authorId: string, data: { bookingId: string; rating: number; text: string }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify verified review constraint: completed booking + participant
    if (booking.status !== 'Completed') {
      throw new BadRequestException('Reviews can only be submitted for completed bookings');
    }

    if (booking.residentId !== authorId && booking.providerId !== authorId) {
      throw new BadRequestException('Only booking participants can review each other');
    }

    // Check if review already exists
    const existing = await this.prisma.review.findFirst({
      where: {
        bookingId: data.bookingId,
        authorId,
      },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this booking');
    }

    // Determine target ID (if resident reviews provider, target is provider; and vice versa)
    const targetId = authorId === booking.residentId ? booking.providerId : booking.residentId;

    const review = await this.prisma.review.create({
      data: {
        bookingId: data.bookingId,
        authorId,
        targetId,
        rating: data.rating,
        text: data.text,
        date: new Date().toISOString().split('T')[0],
      },
    });

    // Recalculate provider response rate / average response time if needed,
    // or let it update profile metrics in a real database.
    // For simplicity, we just save the review.

    return review;
  }

  async getReviewsForTarget(targetId: string) {
    return this.prisma.review.findMany({
      where: { targetId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }
}
