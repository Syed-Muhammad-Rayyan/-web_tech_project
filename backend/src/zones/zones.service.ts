import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async getZones() {
    return this.prisma.zone.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async addZone(name: string) {
    const existing = await this.prisma.zone.findUnique({
      where: { name },
    });
    if (existing) {
      throw new ConflictException('Zone already exists');
    }

    return this.prisma.zone.create({
      data: { name },
    });
  }

  async removeZone(name: string) {
    const zone = await this.prisma.zone.findUnique({
      where: { name },
    });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    return this.prisma.zone.delete({
      where: { name },
    });
  }
}
