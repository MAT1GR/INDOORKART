import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateBookingCode,
  sendConfirmationEmail,
} from "../services/booking";

const router = express.Router();
const prisma = new PrismaClient();

// Create a hold on seats
router.post("/hold", async (req, res) => {
  try {
    const { timeSlotId, seats, sessionId } = req.body;

    // Clear expired holds
    await prisma.hold.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    // Check if seats are available
    const existingHolds = await prisma.hold.findMany({
      where: {
        timeSlotId,
        expiresAt: { gt: new Date() },
      },
    });

    const heldSeats = existingHolds.reduce((acc, hold) => {
      const heldSeatNumbers = JSON.parse(hold.seats) as number[];
      return [...acc, ...heldSeatNumbers];
    }, [] as number[]);

    const conflictingSeats = seats.filter((seat: number) =>
      heldSeats.includes(seat)
    );
    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        error: "Algunos asientos ya están reservados",
        conflictingSeats,
      });
    }

    // Create hold
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes hold

    const hold = await prisma.hold.create({
      data: {
        timeSlotId,
        seats: JSON.stringify(seats),
        sessionId,
        expiresAt,
      },
    });

    res.json({ hold, expiresAt });
  } catch (error) {
    console.error("Create hold error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Create booking
router.post("/", async (req, res) => {
  try {
    const {
      branchId,
      timeSlotId,
      planId,
      participants,
      notes,
      paymentMethod,
      sessionId,
    } = req.body;

    const mainParticipant = participants.find((p: any) => p.isHolder);
    if (!mainParticipant) {
      return res
        .status(400)
        .json({ error: "Faltan datos del piloto principal" });
    }

    const { name: customerName, email, phone } = mainParticipant;
    const seats = participants.map((p: any) => p.kartNumber);

    // Check if seats are still available
    const existingBookings = await prisma.booking.findMany({
      where: {
        timeSlotId,
        status: { in: ["pending", "confirmed"] },
      },
    });

    const bookedSeats = existingBookings.reduce((acc, booking) => {
      const bookedSeatNumbers = JSON.parse(booking.seats) as number[];
      return [...acc, ...bookedSeatNumbers];
    }, [] as number[]);

    const conflictingSeats = seats.filter((seat: number) =>
      bookedSeats.includes(seat)
    );
    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        error: "Algunos asientos ya están reservados",
        conflictingSeats,
      });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        prices: {
          where: {
            method: paymentMethod,
            active: true,
            validFrom: { lte: new Date() },
            OR: [{ validTo: null }, { validTo: { gte: new Date() } }],
          },
          orderBy: { validFrom: "desc" },
          take: 1,
        },
      },
    });

    if (!plan || !plan.prices[0]) {
      return res.status(404).json({ error: "Plan o precio no encontrado" });
    }

    const price = plan.prices[0];
    const unitPrice =
      price.amount + (price.amount * (price.surchargePct || 0)) / 100;
    const total = Math.round(unitPrice * seats.length);
    const code = generateBookingCode();

    const booking = await prisma.$transaction(async (tx) => {
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
          status: paymentMethod === "cash" ? "confirmed" : "pending",
          paymentStatus: paymentMethod === "cash" ? "deposit" : "unpaid",
          subtotal: total,
          total,
        },
        include: {
          branch: true,
          timeSlot: true,
          plan: true,
        },
      });

      const karts = await tx.kart.findMany({
        where: {
          branchId,
          number: { in: seats },
        },
      });

      const participantData = participants.map((p: any) => {
        const kart = karts.find((k) => k.number === p.kartNumber);
        if (!kart) throw new Error(`Kart ${p.kartNumber} not found`);
        return {
          bookingId: newBooking.id,
          kartId: kart.id,
          name: p.name,
          dni: p.dni,
          isHolder: p.isHolder,
        };
      });

      await tx.participant.createMany({
        data: participantData,
      });

      return newBooking;
    });

    await prisma.hold.deleteMany({
      where: { sessionId },
    });

    await prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: { available: { decrement: seats.length } },
    });

    if (paymentMethod !== "cash") {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          method: paymentMethod,
          amount: Math.round(total * 0.5), // 50% deposit
          status: "pending",
        },
      });
    }

    try {
      await sendConfirmationEmail(booking);
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    res.status(201).json({ booking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Get booking by code
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { code: code.toUpperCase() },
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

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Cancel booking
router.post("/:code/cancel", async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { code: code.toUpperCase() },
      include: { timeSlot: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "La reserva ya está cancelada" });
    }

    // Check if can cancel (24h policy)
    const slotDateTime = new Date(
      `${booking.timeSlot.date}T${booking.timeSlot.startTime}`
    );
    const hoursUntil = (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil < 24) {
      return res.status(400).json({
        error: "No se puede cancelar con menos de 24 horas de anticipación",
      });
    }

    // Cancel booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "cancelled" },
    });

    // Restore time slot availability
    await prisma.timeSlot.update({
      where: { id: booking.timeSlotId },
      data: { available: { increment: booking.qty } },
    });

    res.json({ message: "Reserva cancelada exitosamente" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Reschedule booking
router.post("/:code/reschedule", async (req, res) => {
  try {
    const { code } = req.params;
    const { newTimeSlotId, newSeats } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { code: code.toUpperCase() },
      include: { timeSlot: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (booking.status !== "confirmed" && booking.status !== "pending") {
      return res
        .status(400)
        .json({ error: "No se puede reprogramar esta reserva" });
    }

    // Check if can reschedule (24h policy)
    const slotDateTime = new Date(
      `${booking.timeSlot.date}T${booking.timeSlot.startTime}`
    );
    const hoursUntil = (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil < 24) {
      return res.status(400).json({
        error: "No se puede reprogramar con menos de 24 horas de anticipación",
      });
    }

    // Check new slot availability
    const newTimeSlot = await prisma.timeSlot.findUnique({
      where: { id: newTimeSlotId },
    });

    if (!newTimeSlot || newTimeSlot.available < newSeats.length) {
      return res
        .status(400)
        .json({ error: "El nuevo horario no tiene suficiente disponibilidad" });
    }

    // Update booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        timeSlotId: newTimeSlotId,
        seats: JSON.stringify(newSeats),
        qty: newSeats.length,
      },
    });

    // Restore old slot availability
    await prisma.timeSlot.update({
      where: { id: booking.timeSlotId },
      data: { available: { increment: booking.qty } },
    });

    // Reduce new slot availability
    await prisma.timeSlot.update({
      where: { id: newTimeSlotId },
      data: { available: { decrement: newSeats.length } },
    });

    res.json({ message: "Reserva reprogramada exitosamente" });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
