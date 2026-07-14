import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class MessagingService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketGateway,
  ) {}

  private prohibitedPatterns = [
    /pay\s+outside/i,
    /direct\s+cash/i,
    /offsite/i,
    /fuck/i,
    /bitch/i,
    /scam/i,
    /zelle/i,
    /venmo/i,
    /paypal/i,
  ];

  async sendMessage(senderId: string, data: { recipientId: string; content: string }) {
    const recipient = await this.prisma.user.findUnique({
      where: { id: data.recipientId },
    });
    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });

    // Prohibited content scanner
    let isFlagged = false;
    for (const pattern of this.prohibitedPatterns) {
      if (pattern.test(data.content)) {
        isFlagged = true;
        break;
      }
    }

    const message = await this.prisma.message.create({
      data: {
        senderId,
        recipientId: data.recipientId,
        content: data.content,
        flagged: isFlagged,
      },
    });

    // Deliver via WebSocket
    this.websocket.sendToUser(
      data.recipientId,
      'chat_msg',
      {
        id: message.id,
        senderId: message.senderId,
        senderName: sender?.name || 'Neighbour',
        recipientId: message.recipientId,
        content: message.content,
        timestamp: message.timestamp,
        flagged: message.flagged,
      }
    );

    return message;
  }

  async getThread(userId: string, partnerId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: partnerId },
          { senderId: partnerId, recipientId: userId },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async getChatPartners(userId: string) {
    // Return all users the current user has exchanged messages with, or just all residents/providers in the zone
    const sentTo = await this.prisma.message.findMany({
      where: { senderId: userId },
      select: { recipientId: true },
      distinct: ['recipientId'],
    });

    const receivedFrom = await this.prisma.message.findMany({
      where: { recipientId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const ids = Array.from(
      new Set([
        ...sentTo.map((m) => m.recipientId),
        ...receivedFrom.map((m) => m.senderId),
      ])
    );

    return this.prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        zone: true,
      },
    });
  }
}
