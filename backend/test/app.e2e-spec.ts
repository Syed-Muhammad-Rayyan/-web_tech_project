import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

// Mock bcrypt to make password checks pass instantly
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('Controllers E2E Tests (Coverage)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.email === 'resident@neighbourhub.com' || where.id === 'res-1') {
          return {
            id: 'res-1',
            name: 'Jane Resident',
            email: 'resident@neighbourhub.com',
            passwordHash: 'hashed_password',
            role: 'Resident',
            zone: 'Zone A (North)',
            avatar: 'JR',
          };
        }
        if (where.email === 'admin@neighbourhub.com' || where.id === 'admin-1') {
          return {
            id: 'admin-1',
            name: 'Alex Admin',
            email: 'admin@neighbourhub.com',
            passwordHash: 'hashed_password',
            role: 'Admin',
            zone: 'Zone B (Central)',
            avatar: 'AA',
          };
        }
        return null;
      }),
      create: jest.fn().mockImplementation(({ data }) => ({
        id: 'new-user-id',
        name: data.name,
        email: data.email,
        role: 'Resident',
        zone: data.zone,
        avatar: 'NU',
      })),
      findMany: jest.fn().mockReturnValue([]),
      update: jest.fn().mockImplementation(({ data }) => ({
        id: 'res-1',
        name: 'Jane Resident',
        email: 'resident@neighbourhub.com',
        role: 'Resident',
        zone: 'Zone A (North)',
        avatar: 'JR',
      })),
    },
    providerProfile: {
      findUnique: jest.fn().mockReturnValue({ id: 'prof-1', userId: 'prov-1', verificationStatus: 'Pending' }),
      upsert: jest.fn().mockReturnValue({ id: 'prof-1' }),
      findMany: jest.fn().mockReturnValue([]),
      update: jest.fn().mockReturnValue({ id: 'prof-1', verificationStatus: 'Verified' }),
    },
    booking: {
      findMany: jest.fn().mockReturnValue([]),
      create: jest.fn().mockReturnValue({ id: 'b-1', status: 'Sent' }),
      findUnique: jest.fn().mockReturnValue(null),
    },
    review: {
      findMany: jest.fn().mockReturnValue([]),
      create: jest.fn().mockReturnValue({ id: 'r-1' }),
    },
    zone: {
      findMany: jest.fn().mockReturnValue([]),
      create: jest.fn().mockReturnValue({ id: 'z-1', name: 'New Zone' }),
    },
    message: {
      findMany: jest.fn().mockReturnValue([]),
      create: jest.fn().mockReturnValue({ id: 'm-1', content: 'hello' }),
    },
    announcement: {
      findMany: jest.fn().mockReturnValue([]),
      create: jest.fn().mockReturnValue({ id: 'ann-1' }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  const getTestToken = (userId: string, email: string, role: string) => {
    return jwtService.sign({ sub: userId, email, role });
  };

  describe('1. Authentication Module', () => {
    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          passwordHash: 'password123',
          zone: 'Zone A (North)',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.accessToken).toBeDefined();
        });
    });

    it('/auth/login (POST) - Success', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'resident@neighbourhub.com',
          passwordHash: 'password123',
        })
        .expect(200);
    });

    it('/auth/login (POST) - Fail', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@neighbourhub.com',
          passwordHash: 'password123',
        })
        .expect(401);
    });
  });

  describe('2. Users Module', () => {
    it('/users/providers (GET)', () => {
      return request(app.getHttpServer())
        .get('/users/providers')
        .expect(200);
    });

    it('/users/profile (PATCH) - Authenticated', () => {
      const token = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '123456789' })
        .expect(200);
    });

    it('/users/profile (PATCH) - Unauthenticated', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({ phone: '123456789' })
        .expect(401);
    });

    it('/users/providers/:id/verify (POST) - Admin Only (Success)', () => {
      const adminToken = getTestToken('admin-1', 'admin@neighbourhub.com', 'Admin');
      return request(app.getHttpServer())
        .post('/users/providers/prov-1/verify')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    it('/users/providers/:id/verify (POST) - Resident (Forbidden)', () => {
      const residentToken = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .post('/users/providers/prov-1/verify')
        .set('Authorization', `Bearer ${residentToken}`)
        .expect(403);
    });
  });

  describe('3. Bookings Module', () => {
    it('/bookings/my (GET) - Authenticated', () => {
      const token = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .get('/bookings/my')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('4. AI Module Proxy', () => {
    it('/ai/enhance-listing (POST) - Authenticated', () => {
      const token = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .post('/ai/enhance-listing')
        .set('Authorization', `Bearer ${token}`)
        .send({
          rawBio: 'I fix leaks',
          category: 'Plumbing',
          usps: 'Available 24/7',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.summary).toBeDefined();
          expect(res.body.cta).toBeDefined();
        });
    });
  });

  describe('5. Noticeboard Module', () => {
    it('/noticeboard (GET) - Authenticated', () => {
      const token = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .get('/noticeboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('6. Zones Module', () => {
    it('/zones (GET)', () => {
      const token = getTestToken('res-1', 'resident@neighbourhub.com', 'Resident');
      return request(app.getHttpServer())
        .get('/zones')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
