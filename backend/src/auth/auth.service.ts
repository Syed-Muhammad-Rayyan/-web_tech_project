import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateTokenPair(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    // Access token valid for 15 minutes, refresh token for 7 days
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'default-neighbourhub-secret-key-very-secure',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'default-neighbourhub-refresh-secret-key-very-secure',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(data: { name: string; email: string; passwordHash: string; zone: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(data.passwordHash); // client sends plain password as 'passwordHash' or we hash it here
    
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: 'Resident', // Default role
        zone: data.zone,
        avatar: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      },
    });

    const tokens = await this.generateTokenPair(user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async login(credentials: { email: string; passwordHash: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.comparePassword(credentials.passwordHash, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokenPair(user.id, user.email, user.role);

    // Fetch provider profile if it exists
    let providerProfile: any = null;
    if (user.role === 'Provider') {
      providerProfile = await this.prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        providerProfile,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'default-neighbourhub-refresh-secret-key-very-secure',
      });
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      
      if (!user) {
        throw new UnauthorizedException();
      }

      return this.generateTokenPair(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
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
}
