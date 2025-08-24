import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create branch
  const branch = await prisma.branch.create({
    data: {
      name: 'Rosario Indoor Kart',
      address: 'Anchorena 2750, Rosario, Santa Fe, Argentina',
      phone: '+54 9 341 618 8143',
      openDays: JSON.stringify([2, 3, 4, 5, 6, 7]), // Tue-Sun
      openHours: JSON.stringify({ start: '17:00', end: '23:00' }),
      seats: 8,
      seatMap: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]),
    },
  });

  // Create karts
  for (let i = 1; i <= 8; i++) {
    await prisma.kart.create({
      data: {
        branchId: branch.id,
        number: i,
        status: 'ok',
      },
    });
  }

  // Create plans
  const plan10 = await prisma.plan.create({
    data: {
      name: 'Plan 10',
      qualyLaps: 2,
      raceLaps: 10,
      description: '2 vueltas de clasificación + 10 vueltas de carrera',
    },
  });

  const plan15 = await prisma.plan.create({
    data: {
      name: 'Plan 15',
      qualyLaps: 2,
      raceLaps: 15,
      description: '2 vueltas de clasificación + 15 vueltas de carrera',
    },
  });

  const planDoble = await prisma.plan.create({
    data: {
      name: 'Promo Doble Carrera',
      qualyLaps: 4,
      raceLaps: 22,
      description: 'Carrera A: 2 qualy + 10 carrera | Carrera B: 2 qualy + 12 carrera',
    },
  });

  // Create plan prices
  const validFrom = new Date();
  const validTo = new Date();
  validTo.setMonth(validTo.getMonth() + 6);

  // Plan 10 prices
  await prisma.planPrice.createMany({
    data: [
      { planId: plan10.id, method: 'cash', amount: 2200000, validFrom, validTo },
      { planId: plan10.id, method: 'transfer', amount: 2400000, validFrom, validTo },
      { planId: plan10.id, method: 'mp', amount: 2400000, surchargePct: 5, validFrom, validTo },
      { planId: plan10.id, method: 'card', amount: 2400000, surchargePct: 10, validFrom, validTo },
    ],
  });

  // Plan 15 prices
  await prisma.planPrice.createMany({
    data: [
      { planId: plan15.id, method: 'cash', amount: 2800000, validFrom, validTo },
      { planId: plan15.id, method: 'transfer', amount: 3000000, validFrom, validTo },
      { planId: plan15.id, method: 'mp', amount: 3000000, surchargePct: 5, validFrom, validTo },
      { planId: plan15.id, method: 'card', amount: 3000000, surchargePct: 10, validFrom, validTo },
    ],
  });

  // Promo Doble prices
  await prisma.planPrice.createMany({
    data: [
      { planId: planDoble.id, method: 'cash', amount: 4000000, validFrom, validTo },
      { planId: planDoble.id, method: 'transfer', amount: 4200000, validFrom, validTo },
      { planId: planDoble.id, method: 'mp', amount: 4200000, surchargePct: 5, validFrom, validTo },
      { planId: planDoble.id, method: 'card', amount: 4200000, surchargePct: 10, validFrom, validTo },
    ],
  });

  // Create valley hour promo (inactive by default)
  await prisma.promo.create({
    data: {
      type: 'valley',
      name: 'Horario Valle',
      rules: JSON.stringify({
        days: [2, 3, 4], // Tue, Wed, Thu
        hours: { start: '17:00', end: '18:00' },
        discountPct: 30,
      }),
      validFrom,
      validTo,
      active: false,
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@rosarioindoorkart.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    },
  });

  // Create staff users
  const staffPassword = await bcrypt.hash('staff123', 10);
  await prisma.user.createMany({
    data: [
      {
        email: 'staff1@rosarioindoorkart.com',
        password: staffPassword,
        name: 'Staff 1',
        role: 'staff',
      },
      {
        email: 'staff2@rosarioindoorkart.com',
        password: staffPassword,
        name: 'Staff 2',
        role: 'staff',
      },
    ],
  });

  // Create settings
  await prisma.settings.createMany({
    data: [
      { key: 'deposit_percentage', value: '50' },
      { key: 'cancellation_policy', value: 'Seña no reintegrable' },
      { key: 'reschedule_hours', value: '24' },
      { key: 'min_booking_hours', value: '0.5' },
      { key: 'circuit_renewal_days', value: '90' },
      { key: 'email_sender', value: 'reservas@rosarioindoorkart.com' },
      { key: 'whatsapp_number', value: '+5493416188143' },
    ],
  });

  // Generate time slots for the next 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Mondays (day 1)
    if (date.getDay() === 1) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate slots from 17:00 to 23:00 every 20 minutes
    for (let hour = 17; hour < 23; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        await prisma.timeSlot.create({
          data: {
            branchId: branch.id,
            date: dateStr,
            startTime: timeStr,
            durationMin: 12,
            bufferMin: 3,
            capacity: 8,
            available: 8,
          },
        });
      }
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });