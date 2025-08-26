import express from 'express';
import { PrismaClient } from '@prisma/client';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const router = express.Router();
const prisma = new PrismaClient();

// Get branch info
router.get('/branch', async (req, res) => {
  try {
    const branch = await prisma.branch.findFirst({
      include: {
        karts: true,
      },
    });

    if (!branch) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }

    // Check if circuit is new (< 90 days)
    const circuitAge = Math.floor((Date.now() - branch.circuitLastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    const isNewCircuit = circuitAge < 90;

    res.json({
      ...branch,
      isNewCircuit,
      circuitAge,
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get available time slots for a date
router.get('/timeslots', async (req, res) => {
  try {
    const { date, branchId } = req.query;

    if (!date || !branchId) {
      return res.status(400).json({ error: 'Fecha y sucursal requeridas' });
    }

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        branchId: branchId as string,
        date: date as string,
        status: 'ok',
        available: { gt: 0 },
      },
      orderBy: { startTime: 'asc' },
    });

    // Get holds for each slot
    const slotsWithHolds = await Promise.all(
      timeSlots.map(async (slot) => {
        const holds = await prisma.hold.findMany({
          where: {
            timeSlotId: slot.id,
            expiresAt: { gt: new Date() },
          },
        });

        const heldSeats = holds.reduce((acc, hold) => {
          const seats = JSON.parse(hold.seats) as number[];
          return acc + seats.length;
        }, 0);

        return {
          ...slot,
          available: slot.available - heldSeats,
          heldSeats,
        };
      })
    );

    res.json(slotsWithHolds);
  } catch (error) {
    console.error('Get timeslots error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get plans with current prices
router.get('/plans', async (req, res) => {
  try {
    const { method = 'cash' } = req.query;
    const now = new Date();

    const plans = await prisma.plan.findMany({
      where: { active: true },
      include: {
        prices: {
          where: {
            method: method as string,
            active: true,
            validFrom: { lte: now },
            OR: [
              { validTo: null },
              { validTo: { gte: now } },
            ],
          },
          orderBy: { validFrom: 'desc' },
          take: 1,
        },
      },
    });

    const plansWithPrices = plans.map(plan => ({
      ...plan,
      currentPrice: plan.prices[0] || null,
    }));

    res.json(plansWithPrices);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get kart availability for a time slot
router.get('/karts/:timeSlotId', async (req, res) => {
  try {
    const { timeSlotId } = req.params;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: { branch: { include: { karts: true } } },
    });

    if (!timeSlot) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    // Get booked seats
    const bookings = await prisma.booking.findMany({
      where: {
        timeSlotId,
        status: { in: ['pending', 'confirmed'] },
      },
    });

    const bookedSeats = bookings.reduce((acc, booking) => {
      const seats = JSON.parse(booking.seats) as number[];
      return [...acc, ...seats];
    }, [] as number[]);

    // Get held seats
    const holds = await prisma.hold.findMany({
      where: {
        timeSlotId,
        expiresAt: { gt: new Date() },
      },
    });

    const heldSeats = holds.reduce((acc, hold) => {
      const seats = JSON.parse(hold.seats) as number[];
      return [...acc, ...seats];
    }, [] as number[]);

    // Build kart status map
    const kartStatus = timeSlot.branch.karts.map(kart => ({
      number: kart.number,
      status: kart.status === 'oos' ? 'oos' :
              bookedSeats.includes(kart.number) ? 'booked' :
              heldSeats.includes(kart.number) ? 'held' : 'available',
      reason: kart.reason,
    }));

    res.json({
      timeSlot,
      karts: kartStatus,
      availableCount: kartStatus.filter(k => k.status === 'available').length,
    });
  } catch (error) {
    console.error('Get karts error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get settings
router.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.settings.findUnique({
      where: { key },
    });

    res.json(setting ? { value: setting.value } : { value: null });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;