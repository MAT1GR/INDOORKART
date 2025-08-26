import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { requireRole } from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard stats
router.get("/dashboard", requireRole(["admin", "staff"]), async (req, res) => {
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
        participants: true,
      },
      take: 10,
      orderBy: { timeSlot: { startTime: "asc" } },
    });

    res.json({
      todayBookings,
      todayRevenue: todayRevenue._sum.total || 0,
      occupancyRate,
      upcomingBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Bookings management
router.get("/bookings", requireRole(["admin", "staff"]), async (req, res) => {
  try {
    const { page = 1, limit = 15, search, status, date, planId } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search as string, mode: "insensitive" } },
        { customerName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { phone: { contains: search as string, mode: "insensitive" } },
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

// GET a single booking by ID
router.get(
  "/bookings/:id",
  requireRole(["admin", "staff"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          branch: true,
          timeSlot: true,
          plan: true,
          payments: true,
          participants: {
            include: {
              kart: true,
            },
          },
        },
      });
      if (!booking) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Time slots management
router.get("/timeslots", requireRole(["admin", "staff"]), async (req, res) => {
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

// Generate time slots
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
      excludeDays = [1], // Monday
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
      skipDuplicates: true,
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

// Plans management
router.get("/plans", requireRole(["admin"]), async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        prices: {
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

// Create/update plan
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

// Plan prices management
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
          amount,
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

// Karts management
router.get("/karts", requireRole(["admin", "staff"]), async (req, res) => {
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

// Update kart status
router.patch(
  "/karts/:id",
  requireRole(["admin", "staff"]),
  async (req, res) => {
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
  }
);

// Users Management
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

router.post("/users", requireRole(["admin"]), async (req, res) => {
  try {
    const { name, email, password, role, active } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        active,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// Settings Management
router.get("/settings", requireRole(["admin"]), async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.patch("/settings", requireRole(["admin"]), async (req, res) => {
  try {
    const settingsToUpdate: { key: string; value: string }[] = req.body;

    const updatePromises = settingsToUpdate.map((setting) =>
      prisma.settings.update({
        where: { key: setting.key },
        data: { value: setting.value },
      })
    );

    await Promise.all(updatePromises);

    res.json({ message: "Configuración actualizada exitosamente" });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Error al actualizar la configuración" });
  }
});

export default router;
