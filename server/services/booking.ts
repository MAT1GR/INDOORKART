import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function generateBookingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RIK-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function sendConfirmationEmail(booking: any) {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const seats = JSON.parse(booking.seats) as number[];
  const seatsList = seats.join(", ");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #E3362C, #F47600); color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 20px; border: 1px solid #ddd; }
        .booking-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏎️ ROSARIO INDOOR KART</h1>
          <h2>¡Confirmación de Reserva!</h2>
        </div>
        
        <div class="content">
          <p>¡Hola <strong>${booking.customerName}</strong>!</p>
          
          <p>Tu reserva ha sido confirmada exitosamente. Aquí tienes todos los detalles:</p>
          
          <div class="booking-details">
            <h3>📋 Detalles de la Reserva</h3>
            <p><strong>Código:</strong> ${booking.code}</p>
            <p><strong>Fecha:</strong> ${booking.timeSlot.date}</p>
            <p><strong>Horario:</strong> ${booking.timeSlot.startTime}</p>
            <p><strong>Plan:</strong> ${booking.plan.name}</p>
            <p><strong>Karts:</strong> ${seatsList}</p>
            <p><strong>Cantidad:</strong> ${booking.qty} piloto(s)</p>
            <p><strong>Total:</strong> $${(booking.total / 100).toLocaleString(
              "es-AR"
            )}</p>
          </div>

          <div class="qr-code">
            <p><strong>Tu código QR:</strong></p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 24px; font-weight: bold;">
              ${booking.code}
            </div>
          </div>

          <div class="warning">
            <h3>⚠️ Requisitos Importantes:</h3>
            <ul>
              <li>Edad mínima: 15 años</li>
              <li>Peso máximo: 110 kg</li>
              <li>Llegar 15 minutos antes del horario</li>
              <li>Traer documento de identidad</li>
            </ul>
          </div>

          <div class="booking-details">
            <h3>📍 Ubicación</h3>
            <p><strong>Dirección:</strong> ${booking.branch.address}</p>
            <p><strong>Teléfono:</strong> ${booking.branch.phone}</p>
            <p><strong>Horarios:</strong> Martes a Domingo 17:00-23:00</p>
          </div>

          <p>Si necesitás cancelar o reprogramar tu reserva, podés hacerlo hasta 24 horas antes desde nuestra web con el código: <strong>${
            booking.code
          }</strong></p>
          
          <p><strong>¡Recordá que la seña del 50% no se reintegra en caso de cancelación!</strong></p>
        </div>
        
        <div class="footer">
          <p>¡Te esperamos para una experiencia increíble! 🏁</p>
          <p>ROSARIO INDOOR KART - La adrenalina que buscás</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER || "reservas@rosarioindoorkart.com",
    to: booking.email,
    subject: `🏎️ Confirmación de Reserva ${booking.code} - Rosario Indoor Kart`,
    html,
  });
}
