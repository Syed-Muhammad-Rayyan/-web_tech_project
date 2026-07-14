import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: { name?: string; phone?: string; address?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zone: true,
        phone: true,
        address: true,
        avatar: true,
      },
    });
  }

  async upgradeToProvider(userId: string, data: {
    bio: string;
    categories: string[];
    availability: string;
    coverageRadius: number;
    idProofUrl?: string;
    portfolioPhotos?: string[];
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Upsert provider profile
    const profile = await this.prisma.providerProfile.upsert({
      where: { userId },
      update: {
        bio: data.bio,
        categories: data.categories,
        availability: data.availability,
        coverageRadius: data.coverageRadius,
        idProofUrl: data.idProofUrl,
        portfolioPhotos: data.portfolioPhotos || [],
        verificationStatus: 'Pending',
      },
      create: {
        userId,
        bio: data.bio,
        categories: data.categories,
        availability: data.availability,
        coverageRadius: data.coverageRadius,
        idProofUrl: data.idProofUrl,
        portfolioPhotos: data.portfolioPhotos || [],
        verificationStatus: 'Pending',
      },
    });

    // Update user role to Provider
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'Provider' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zone: true,
        phone: true,
        address: true,
        avatar: true,
      },
    });

    return {
      user: updatedUser,
      profile,
    };
  }

  async getProviders() {
    return this.prisma.user.findMany({
      where: {
        role: 'Provider',
        providerProfile: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zone: true,
        avatar: true,
        providerProfile: true,
      },
    });
  }

  async getProviderById(id: string) {
    const provider = await this.prisma.user.findFirst({
      where: {
        id,
        role: 'Provider',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zone: true,
        avatar: true,
        phone: true,
        address: true,
        providerProfile: true,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider;
  }

  async verifyProvider(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Provider profile not found for user');
    }

    return this.prisma.providerProfile.update({
      where: { userId },
      data: { verificationStatus: 'Verified' },
    });
  }

  async updateProviderProfile(userId: string, data: {
    bio?: string;
    categories?: string[];
    availability?: string;
    coverageRadius?: number;
    portfolioPhotos?: string[];
  }) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { userId },
      data,
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zone: true,
        phone: true,
        address: true,
        avatar: true,
        providerProfile: true,
      },
    });
  }
}
