import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoticeboardService {
  constructor(private prisma: PrismaService) {}

  async getAnnouncements() {
    return this.prisma.announcement.findMany({
      include: {
        comments: true,
      },
      orderBy: [
        { pinned: 'desc' },
        { date: 'desc' },
      ],
    });
  }

  async postAnnouncement(authorName: string, data: { title: string; content: string; pinned: boolean }) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        authorName,
        date: new Date().toISOString().split('T')[0],
        pinned: data.pinned,
      },
    });
  }

  async addComment(announcementId: string, authorName: string, content: string) {
    const ann = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!ann) {
      throw new NotFoundException('Announcement not found');
    }

    return this.prisma.comment.create({
      data: {
        announcementId,
        authorName,
        content,
        date: new Date().toISOString().split('T')[0],
      },
    });
  }
}
