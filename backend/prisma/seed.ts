import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neighbourhub?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.comment.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.providerProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.zone.deleteMany({});

  console.log('Cleaned old records.');

  // 2. Hash default password
  const passwordHash = await bcrypt.hash('password123', 10);

  // 3. Seed Zones
  const zones = [
    { name: 'Zone A (North)' },
    { name: 'Zone B (Central)' },
    { name: 'Zone C (South)' },
    { name: 'Zone D (East)' },
    { name: 'Zone E (West)' },
  ];
  for (const z of zones) {
    await prisma.zone.create({ data: z });
  }
  console.log('Zones seeded.');

  // 4. Seed Users & Provider Profiles
  // Admin
  const admin = await prisma.user.create({
    data: {
      id: 'admin-1',
      name: 'Alex Johnson',
      email: 'admin@neighbourhub.com',
      passwordHash,
      role: 'Admin',
      zone: 'Zone A (North)',
      avatar: 'AJ',
    },
  });

  // Moderator
  const mod = await prisma.user.create({
    data: {
      id: 'mod-1',
      name: 'Clara Vance',
      email: 'mod@neighbourhub.com',
      passwordHash,
      role: 'Moderator',
      zone: 'Zone B (Central)',
      avatar: 'CV',
    },
  });

  // Resident
  const resident = await prisma.user.create({
    data: {
      id: 'res-1',
      name: 'Jane Doe',
      email: 'res@neighbourhub.com',
      passwordHash,
      role: 'Resident',
      zone: 'Zone A (North)',
      avatar: 'JD',
      phone: '+92 333 1112223',
      address: 'St 5, House 10, Zone A',
    },
  });

  // Providers
  const prov1 = await prisma.user.create({
    data: {
      id: 'prov-1',
      name: 'Hassan Syed',
      email: 'hassan@neighbourhub.com',
      passwordHash,
      role: 'Provider',
      zone: 'Zone A (North)',
      avatar: 'HS',
      phone: '+92 300 9876543',
      address: 'House 24, St 3, Zone A',
      providerProfile: {
        create: {
          bio: 'Experienced electrician and handyman. Specialized in kitchen rewiring, plumbing fixes, and domestic appliance repairs. Punctual and professional.',
          categories: ['Home Repair', 'Cleaning'],
          availability: 'Saturdays, Weekdays 5pm-9pm',
          coverageRadius: 5,
          verificationStatus: 'Verified',
          portfolioPhotos: [
            'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300',
          ],
          responseRate: 98,
          avgResponseTime: '10 mins',
        },
      },
    },
  });

  const prov2 = await prisma.user.create({
    data: {
      id: 'prov-2',
      name: 'Maria Ortiz',
      email: 'maria@neighbourhub.com',
      passwordHash,
      role: 'Provider',
      zone: 'Zone C (South)',
      avatar: 'MO',
      phone: '+92 321 4455667',
      address: 'Appt 4B, Central Towers, Zone C',
      providerProfile: {
        create: {
          bio: 'Passionate pet sitter and dog walker. I love animals and have 5 years of experience looking after dogs, cats, and birds. Flexible schedules.',
          categories: ['Pet Care'],
          availability: 'Everyday 8am-6pm',
          coverageRadius: 8,
          verificationStatus: 'Verified',
          portfolioPhotos: [
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300',
          ],
          responseRate: 95,
          avgResponseTime: '15 mins',
        },
      },
    },
  });

  const prov3 = await prisma.user.create({
    data: {
      id: 'prov-3',
      name: 'Kenji Sato',
      email: 'kenji@neighbourhub.com',
      passwordHash,
      role: 'Provider',
      zone: 'Zone B (Central)',
      avatar: 'KS',
      phone: '+92 315 1122334',
      address: 'Block 5, Green Meadows, Zone B',
      providerProfile: {
        create: {
          bio: 'Math and Physics tutor for high school students. I make complex subjects easy and fun. Standard rates, group discounts available.',
          categories: ['Healthcare'], // Map to Healthcare in mockup
          availability: 'Weekends all day',
          coverageRadius: 10,
          verificationStatus: 'Verified',
          responseRate: 85,
          avgResponseTime: '40 mins',
        },
      },
    },
  });

  const prov4 = await prisma.user.create({
    data: {
      id: 'prov-4',
      name: 'David Miller',
      email: 'david@neighbourhub.com',
      passwordHash,
      role: 'Provider',
      zone: 'Zone B (Central)',
      avatar: 'DM',
      phone: '+92 312 9998887',
      address: 'Apt 12, Greenway Residency, Zone B',
      providerProfile: {
        create: {
          bio: 'Prompt and reliable local delivery and courier service. I handle groceries, packages, documents, and retail pickups with care. Safe driving and timely deliveries.',
          categories: ['Delivery'],
          availability: 'Daily 7am - 10pm',
          coverageRadius: 12,
          verificationStatus: 'Verified',
          responseRate: 99,
          avgResponseTime: '8 mins',
        },
      },
    },
  });

  const prov5 = await prisma.user.create({
    data: {
      id: 'prov-5',
      name: 'Carlos Mendez',
      email: 'carlos@neighbourhub.com',
      passwordHash,
      role: 'Provider',
      zone: 'Zone C (South)',
      avatar: 'CM',
      phone: '+92 322 8887776',
      address: 'House 55, Street 9, Zone C',
      providerProfile: {
        create: {
          bio: 'Professional mobile car detailing and washing at your doorstep. We bring our own water and power. Eco-friendly products, interior deep cleaning, and exterior wax shine.',
          categories: ['Car Wash'],
          availability: 'Weekends 8am - 6pm',
          coverageRadius: 6,
          verificationStatus: 'Verified',
          responseRate: 92,
          avgResponseTime: '20 mins',
        },
      },
    },
  });

  console.log('Users and Profiles seeded.');

  // 5. Seed Bookings & Reviews
  const booking1 = await prisma.booking.create({
    data: {
      id: 'b-1',
      residentId: resident.id,
      providerId: prov1.id,
      service: 'Plumbing Fix',
      date: '2026-07-12',
      time: '14:00',
      description: 'Kitchen sink is leaking water heavily.',
      status: 'Completed',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      id: 'b-2',
      residentId: resident.id,
      providerId: prov2.id,
      service: 'Dog Sitting',
      date: '2026-07-14',
      time: '09:00',
      description: 'Need dog walking and feeding for my golden retriever on Saturday.',
      status: 'Sent',
    },
  });

  await prisma.review.create({
    data: {
      id: 'r-1',
      bookingId: booking1.id,
      authorId: resident.id,
      targetId: prov1.id,
      rating: 5,
      text: 'Hassan was extremely punctual, professional, and solved the leak in 20 minutes! Highly recommended.',
      date: '2026-07-12',
    },
  });

  console.log('Bookings and Reviews seeded.');

  // 6. Seed Noticeboard & Comments
  const ann1 = await prisma.announcement.create({
    data: {
      id: 'ann-1',
      title: 'Annual Greenway Summer Festival 2026',
      content: 'We are excited to announce our Greenway Summer Festival on July 25th in the Central Park Zone B. There will be food stalls, live games, and opportunities to meet your local service providers in person. Pinned for reference!',
      authorName: 'Clara Vance (Moderator)',
      date: '2026-07-10',
      pinned: true,
    },
  });

  await prisma.comment.create({
    data: {
      announcementId: ann1.id,
      authorName: 'Hassan Syed',
      content: "Awesome! I'll set up a booth representing local handymen.",
      date: '2026-07-10',
    },
  });

  await prisma.comment.create({
    data: {
      announcementId: ann1.id,
      authorName: 'Jane Doe',
      content: 'Looking forward to bringing my family!',
      date: '2026-07-11',
    },
  });

  await prisma.announcement.create({
    data: {
      id: 'ann-2',
      title: 'Security Update: Street Light Repair Scheduled',
      content: 'Residential Zone A will undergo street light replacement and repair on July 14th evening. Please expect minor disruptions.',
      authorName: 'Clara Vance (Moderator)',
      date: '2026-07-11',
      pinned: false,
    },
  });

  console.log('Noticeboard announcements seeded.');

  // 7. Close connections
  await prisma.$disconnect();
  await pool.end();
  console.log('Seeding complete!');
}

main().catch(err => {
  console.error('Error during database seed:', err);
  process.exit(1);
});
