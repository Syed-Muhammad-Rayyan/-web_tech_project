import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketGateway,
  ) {}

  validateAvailability(availabilityStr: string, dateStr: string): boolean {
    if (!availabilityStr) return true;
    const lowerAvail = availabilityStr.toLowerCase();

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return true;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. monday

    if (lowerAvail.includes(dayName)) {
      return true;
    }
    if (lowerAvail.includes('weekday') && !['saturday', 'sunday'].includes(dayName)) {
      return true;
    }
    if (lowerAvail.includes('weekend') && ['saturday', 'sunday'].includes(dayName)) {
      return true;
    }
    if (lowerAvail.includes('everyday') || lowerAvail.includes('any day')) {
      return true;
    }

    return false;
  }

  async createBooking(residentId: string, data: { providerId: string; service: string; date: string; time: string; description: string }) {
    const provider = await this.prisma.user.findFirst({
      where: { id: data.providerId, role: 'Provider' },
      include: { providerProfile: true },
    });

    if (!provider || !provider.providerProfile) {
      throw new NotFoundException('Service Provider not found');
    }

    // Auto-check availability calendar
    const isAvailable = this.validateAvailability(provider.providerProfile.availability, data.date);
    if (!isAvailable) {
      throw new BadRequestException(
        `Provider is not available on this day. Calendar says: "${provider.providerProfile.availability}"`
      );
    }

    const resident = await this.prisma.user.findUnique({ where: { id: residentId } });

    const booking = await this.prisma.booking.create({
      data: {
        residentId,
        providerId: data.providerId,
        service: data.service,
        date: data.date,
        time: data.time,
        description: data.description,
        status: 'Sent',
      },
    });

    // Notify provider via WebSockets
    this.websocket.sendToUser(
      data.providerId,
      'new_booking',
      `New booking request for '${data.service}' from neighbour ${resident?.name || 'Resident'}`
    );

    return booking;
  }

  async getMyBookings(userId: string, role: string) {
    if (role === 'Provider') {
      return this.prisma.booking.findMany({
        where: { providerId: userId },
        include: { resident: true, dispute: true },
        orderBy: { date: 'desc' },
      });
    } else {
      return this.prisma.booking.findMany({
        where: { residentId: userId },
        include: { provider: true, dispute: true },
        orderBy: { date: 'desc' },
      });
    }
  }

  async getBookingById(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { resident: true, provider: true, dispute: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify participant
    if (role !== 'Moderator' && role !== 'Admin' && booking.residentId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async updateStatus(id: string, status: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Permission checks
    if (booking.residentId !== userId && booking.providerId !== userId && role !== 'Moderator') {
      throw new ForbiddenException('You are not a participant in this booking');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status },
    });

    // Notify other party via WebSockets
    const otherPartyId = userId === booking.residentId ? booking.providerId : booking.residentId;
    this.websocket.sendToUser(
      otherPartyId,
      'booking_update',
      `Booking for '${booking.service}' status updated to: ${status}`
    );

    return updated;
  }

  async raiseDispute(id: string, userId: string, data: { complaint: string; evidence: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.residentId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('Only booking participants can raise disputes');
    }

    if (booking.status !== 'Completed' && booking.status !== 'In Progress') {
      throw new BadRequestException('Disputes can only be raised from In Progress or Completed bookings');
    }

    // Suggest a resolution based on platform policies (Local Fallback rule engine)
    let recommendation = 'Partial Refund (50%)';
    let rationale = 'A general dispute resolution. Adjust 50% payout to both parties to align with community standard.';
    
    const complaintLower = data.complaint.toLowerCase();
    if (complaintLower.includes('leak') || complaintLower.includes('damage') || complaintLower.includes('destroy')) {
      recommendation = 'Full Refund (100%)';
      rationale = 'Client claimed property damage. Platform policy mandates full refund suggestion when evidence shows physical damage.';
    } else if (complaintLower.includes('late') || complaintLower.includes('delay') || complaintLower.includes('schedule')) {
      recommendation = 'No Action (Payout Provider)';
      rationale = 'Dispute centers around scheduling delay rather than service failure. Suggested resolution is to payout provider fully.';
    }

    // Check if we should update booking status to Disputed
    await this.prisma.booking.update({
      where: { id },
      data: { status: 'Disputed' },
    });

    const dispute = await this.prisma.dispute.upsert({
      where: { bookingId: id },
      update: {
        raisedBy: userId === booking.residentId ? 'Resident' : 'Provider',
        complaint: data.complaint,
        evidence: data.evidence,
        aiSuggestedResolution: `AI SUGGESTED OPTION: ${recommendation}. Rationale: ${rationale}`,
      },
      create: {
        bookingId: id,
        raisedBy: userId === booking.residentId ? 'Resident' : 'Provider',
        complaint: data.complaint,
        evidence: data.evidence,
        aiSuggestedResolution: `AI SUGGESTED OPTION: ${recommendation}. Rationale: ${rationale}`,
      },
    });

    // Notify all moderators via WebSockets
    this.websocket.sendToRole(
      'Moderator',
      'new_dispute',
      'A new dispute has been opened and requires mediation.'
    );

    return dispute;
  }

  async assignModerator(id: string, moderatorId: string) {
    const dispute = await this.prisma.dispute.findUnique({ where: { bookingId: id } });
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return this.prisma.dispute.update({
      where: { bookingId: id },
      data: { moderatorId },
    });
  }

  async resolveDispute(id: string, resolution: string, moderatorId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { bookingId: id },
      include: { booking: true },
    });
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Update booking status back to completed (resolved)
    await this.prisma.booking.update({
      where: { id },
      data: { status: 'Completed' },
    });

    const resolved = await this.prisma.dispute.update({
      where: { bookingId: id },
      data: {
        resolution,
        resolvedAt: new Date().toISOString().split('T')[0],
      },
    });

    // Notify resident and provider
    this.websocket.sendToUser(dispute.booking.residentId, 'dispute_resolved', `Dispute resolved: ${resolution}`);
    this.websocket.sendToUser(dispute.booking.providerId, 'dispute_resolved', `Dispute resolved: ${resolution}`);

    return resolved;
  }

  async getAllDisputes() {
    return this.prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            resident: true,
            provider: true,
          },
        },
      },
    });
  }
}
