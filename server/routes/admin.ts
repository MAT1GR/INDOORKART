import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { requireRole } from "../middleware/auth";
import { format, startOfDay, endOfDay } from "date-fns";
import {
  generateBookingCode,
  sendConfirmationEmail,
} from "../services/booking";

const router = express.Router();
const prisma = new PrismaClient();

// ... (las otras rutas como /dashboard, /timeslots, etc. se mantienen igual)

// Bookings management
router.get("/bookings", async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, date, planId } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search as string } },
        { customerName: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (planId) {
      where.planId = planId;
    }

    if (date) {
      where.timeSlot = { date: date as string };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          branch: true,
          timeSlot: true,
          plan: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// NUEVO ENDPOINT: Crear una reserva desde el panel de admin
router.post("/bookings", requireRole(["admin", "staff"]), async (req, res) => {
  try {
    const {
      branchId,
      timeSlotId,
      planId,
      seats,
      customerName,
      email,
      phone,
      notes,
      status, // Admin puede setear el estado
      paymentStatus, // Admin puede setear el estado del pago
      total,
    } = req.body;

    // Validar campos requeridos
    if (
      !branchId ||
      !timeSlotId ||
      !planId ||
      !seats ||
      !customerName ||
      !email ||
      !phone ||
      !status ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const code = generateBookingCode();

    const booking = await prisma.$transaction(async (tx) => {
      // 1. Crear la reserva
      const newBooking = await tx.booking.create({
        data: {
          code,
          branchId,
          timeSlotId,
          planId,
          seats: JSON.stringify(seats),
          qty: seats.length,
          customerName,
          email,
          phone,
          notes: notes || "",
          status,
          paymentStatus,
          subtotal: total,
          total,
        },
        include: { branch: true, timeSlot: true, plan: true },
      });

      // 2. Actualizar la disponibilidad del horario
      const updatedTimeSlot = await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { available: { decrement: seats.length } },
      });

      // Validar que no quede disponibilidad negativa
      if (updatedTimeSlot.available < 0) {
        throw new Error(
          "No hay suficiente disponibilidad en el horario seleccionado."
        );
      }

      return newBooking;
    });

    // Enviar email de confirmación (fuera de la transacción)
    try {
      await sendConfirmationEmail(booking);
    } catch (emailError) {
      console.error(
        "Error al enviar email, pero la reserva fue creada:",
        emailError
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error al crear la reserva desde admin:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

// ... (el resto de las rutas de admin.ts se mantienen igual)
// ... (timeslots, karts, plans, users, settings, reports)
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Today's bookings
    const todayBookings = await prisma.booking.count({
      where: {
        timeSlot: { date: today },
        status: { in: ["confirmed", "pending"] },
      },
    });

    // Today's revenue
    const todayRevenue = await prisma.booking.aggregate({
      where: {
        timeSlot: { date: today },
        status: { in: ["confirmed", "pending"] },
      },
      _sum: { total: true },
    });

    // Occupancy rate
    const todaySlots = await prisma.timeSlot.count({
      where: { date: today, status: "ok" },
    });

    const totalCapacity = todaySlots * 8;
    const occupiedSeats = await prisma.booking.aggregate({
      where: {
        timeSlot: { date: today },
        status: { in: ["confirmed", "pending"] },
      },
      _sum: { qty: true },
    });

    const occupancyRate =
      totalCapacity > 0
        ? Math.round(((occupiedSeats._sum.qty || 0) / totalCapacity) * 100)
        : 0;

    // Upcoming bookings (next 2 hours)
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
    const currentTime = new Date().toTimeString().slice(0, 5);

    const upcomingBookings = await prisma.booking.findMany({
      where: {
        timeSlot: {
          date: today,
          startTime: { gte: currentTime },
        },
        status: { in: ["confirmed", "pending"] },
      },
      include: {
        timeSlot: true,
        plan: true,
      },
      take: 10,
      orderBy: { timeSlot: { startTime: "asc" } },
    });

    res.json({
      todayBookings,
      todayRevenue: (todayRevenue._sum.total || 0) / 100,
      occupancyRate,
      upcomingBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// Bookings management
router.get("/bookings", async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, date, planId } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search as string } },
        { customerName: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (planId) {
      where.planId = planId;
    }

    if (date) {
      where.timeSlot = { date: date as string };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          branch: true,
          timeSlot: true,
          plan: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Time slots management

router.get("/timeslots", async (req, res) => {
  try {
    const { date, branchId } = req.query;

    const where: any = {};
    if (date) where.date = date as string;
    if (branchId) where.branchId = branchId as string;

    const timeSlots = await prisma.timeSlot.findMany({
      where,
      include: {
        bookings: {
          where: { status: { in: ["pending", "confirmed"] } },
        },
        _count: { select: { bookings: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    res.json(timeSlots);
  } catch (error) {
    console.error("Get timeslots error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/timeslots/generate", requireRole(["admin"]), async (req, res) => {
  try {
    const {
      branchId,
      startDate,
      endDate,
      startTime = "17:00",
      endTime = "23:00",
      interval = 20,
      duration = 12,
      buffer = 3,
      excludeDays = [1],
    }: {
      branchId: string;
      startDate: string;
      endDate: string;
      startTime?: string;
      endTime?: string;
      interval?: number;
      duration?: number;
      buffer?: number;
      excludeDays?: number[];
    } = req.body;

    const slots: Prisma.TimeSlotCreateManyInput[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      if (excludeDays.includes(date.getDay())) continue;

      const dateStr = date.toISOString().split("T")[0];
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMin
          .toString()
          .padStart(2, "0")}`;

        slots.push({
          branchId,
          date: dateStr,
          startTime: timeStr,
          durationMin: duration,
          bufferMin: buffer,
          capacity: 8,
          available: 8,
          status: "ok",
        });

        currentMin += interval;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
    }

    const created = await prisma.timeSlot.createMany({
      data: slots,
    });

    res.json({
      message: `${created.count} horarios generados exitosamente`,
      count: created.count,
    });
  } catch (error) {
    console.error("Generate timeslots error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        prices: {
          where: { active: true },
          orderBy: { validFrom: "desc" },
        },
        _count: { select: { bookings: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json(plans);
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/plans", requireRole(["admin"]), async (req, res) => {
  try {
    const {
      id,
      name,
      qualyLaps,
      raceLaps,
      description,
      active = true,
    } = req.body;

    if (id) {
      const plan = await prisma.plan.update({
        where: { id },
        data: { name, qualyLaps, raceLaps, description, active },
      });
      res.json(plan);
    } else {
      const plan = await prisma.plan.create({
        data: { name, qualyLaps, raceLaps, description, active },
      });
      res.json(plan);
    }
  } catch (error) {
    console.error("Save plan error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post(
  "/plans/:planId/prices",
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { planId } = req.params;
      const { method, amount, surchargePct, validFrom, validTo } = req.body;

      await prisma.planPrice.updateMany({
        where: { planId, method, active: true },
        data: { active: false },
      });

      const price = await prisma.planPrice.create({
        data: {
          planId,
          method,
          amount: Math.round(amount * 100),
          surchargePct,
          validFrom: new Date(validFrom),
          validTo: validTo ? new Date(validTo) : null,
          active: true,
        },
      });

      res.json(price);
    } catch (error) {
      console.error("Save plan price error:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.get("/karts", async (req, res) => {
  try {
    const { branchId } = req.query;

    const karts = await prisma.kart.findMany({
      where: branchId ? { branchId: branchId as string } : {},
      orderBy: { number: "asc" },
    });

    res.json(karts);
  } catch (error) {
    console.error("Get karts error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.patch("/karts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, fromDate, toDate } = req.body;

    const kart = await prisma.kart.update({
      where: { id },
      data: { status, reason, fromDate, toDate },
    });

    res.json(kart);
  } catch (error) {
    console.error("Update kart error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/users", requireRole(["admin"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/settings", requireRole(["admin"]), async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/settings", requireRole(["admin"]), async (req, res) => {
  try {
    const settings: { key: string; value: string }[] = req.body;

    await Promise.all(
      settings.map((setting) =>
        prisma.settings.update({
          where: { key: setting.key },
          data: { value: setting.value },
        })
      )
    );

    res.json({ message: "Configuración guardada exitosamente" });
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/reports/revenue", async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "pending"] },
        timeSlot: {
          date: {
            gte: startDate as string,
            lte: endDate as string,
          },
        },
      },
      include: {
        timeSlot: true,
        plan: true,
        payments: true,
      },
    });

    const revenueByPeriod = bookings.reduce((acc, booking) => {
      const key = booking.timeSlot.date;

      if (!acc[key]) {
        acc[key] = {
          date: key,
          total: 0,
          bookings: 0,
          cash: 0,
          transfer: 0,
          mp: 0,
          card: 0,
        };
      }

      acc[key].total += booking.total;
      acc[key].bookings += 1;

      booking.payments.forEach((payment) => {
        if (payment.status === "completed") {
          acc[key][payment.method as keyof (typeof acc)[string]] +=
            payment.amount;
        }
      });

      return acc;
    }, {} as Record<string, any>);

    const report = Object.values(revenueByPeriod).map((period) => ({
      ...period,
      total: period.total / 100,
      cash: period.cash / 100,
      transfer: period.transfer / 100,
      mp: period.mp / 100,
      card: period.card / 100,
    }));

    res.json(report);
  } catch (error) {
    console.error("Revenue report error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
