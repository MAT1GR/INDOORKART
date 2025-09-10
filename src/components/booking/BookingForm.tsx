import React, { useState, useEffect } from "react";
import { CreditCard, User, Mail, Phone, AlertTriangle } from "lucide-react";
import { Plan, TimeSlot, PaymentMethod, BookingFormData } from "../../types";
import { formatCurrency, formatDate, formatTime } from "../../utils/formatters";
import Input from "../common/Input";
import Button from "../common/Button";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface BookingFormProps {
  plan: Plan;
  seats: number[];
  timeSlot: TimeSlot;
  onSubmit: (
    formData: Omit<
      BookingFormData,
      "branchId" | "timeSlotId" | "planId" | "seats" | "sessionId"
    >
  ) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  plan,
  seats,
  timeSlot,
  onSubmit,
  isLoading,
}) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "mp" as PaymentMethod,
    ageWeightConfirmed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitPrice = plan.currentPrice?.amount || 0;
  const baseAmount = unitPrice * seats.length;
  const surcharge = ((plan.currentPrice?.surchargePct || 0) * baseAmount) / 100;
  const total = baseAmount + surcharge;
  const deposit = Math.round(total * 0.5); // 50% depósito

  // Inicializa MercadoPago solo una vez

  initMercadoPago("TEST-dd338728-e041-46f7-963f-82a61e21594d", {
    locale: "es-AR",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim())
      newErrors.customerName = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "El email no es válido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!formData.ageWeightConfirmed)
      newErrors.ageWeightConfirmed =
        "Debes confirmar los requisitos de edad y peso";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // 1️⃣ Crear la reserva primero
      const resReservation = await fetch(
        "http://localhost:5034/api/Reservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: 1,
            circuitId: 2,
            reservationDate: new Date(), // ya viene con fecha y hora
          }),
        }
      );

      if (!resReservation.ok) throw new Error("Error creando la reserva");

      const createdReservation = await resReservation.json();
      const reservationId = createdReservation.id; // usar el campo correcto

      // Una vez creada la reserva, agregar participantes, el pago va despues. No va todo en un handleSubmit.

      // 2️⃣ Crear la preferencia asociada a esa reserva
      const resPreference = await fetch(
        "http://localhost:5034/api/MercadoPago/create-preference/advance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: deposit / 100,
            title: plan.description,
            reservationId: reservationId, // ← ya es real, no hardcodeado
          }),
        }
      );

      if (!resPreference.ok) throw new Error("Error creando la preferencia");
      const data = await resPreference.json();

      // 3️⃣ Setear el preferenceId real
      setPreferenceId(data.preferenceId);
    } catch (err) {
      console.error("Error en handleSubmit:", err);
    }
  };

  console.log("aaa", preferenceId, deposit / 100, plan.description);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Tus datos y pago de seña
        </h3>
        <p className="text-gray-600">
          Solo falta un paso para confirmar tu reserva
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Resumen de tu reserva:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Fecha:</span>
            <span className="font-medium">{formatDate(timeSlot.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Horario:</span>
            <span className="font-medium">
              {formatTime(timeSlot.startTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Karts:</span>
            <span className="font-medium">{seats.join(", ")}</span>
          </div>
          <div className="border-t pt-2 mt-3">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="text-lg">{formatCurrency(total / 100)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Seña (50%):</span>
              <span className="font-bold">{formatCurrency(deposit / 100)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo *"
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            error={errors.customerName}
            placeholder="Tu nombre y apellido"
            icon={<User className="h-4 w-4" />}
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            placeholder="tu@email.com"
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <Input
          label="Teléfono *"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          error={errors.phone}
          placeholder="11 1234 5678"
          icon={<Phone className="h-4 w-4" />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            placeholder="¿Alguna pregunta o pedido especial? (Opcional)"
          />
        </div>

        {/* Age/Weight Confirmation */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ageWeightConfirmed}
                  onChange={(e) =>
                    handleInputChange("ageWeightConfirmed", e.target.checked)
                  }
                  className="mt-1 rounded border-yellow-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-yellow-800">
                  Confirmo que todos los pilotos tienen{" "}
                  <strong>15 años o más</strong> y pesan{" "}
                  <strong>110 kg o menos</strong>. Entiendo que estos requisitos
                  son obligatorios por seguridad.
                </span>
              </label>
              {errors.ageWeightConfirmed && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.ageWeightConfirmed}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      {/* Submit / Checkout Button */}
      {preferenceId ? (
        <div className="mt-6">
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: "modal",
            }}
            locale="es-AR"
          />
        </div>
      ) : (
        <Button
          onClick={handleSubmit}
          type="submit"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          {`Confirmar Reserva - ${formatCurrency(deposit / 100)}`}
        </Button>
      )}
    </div>
  );
};

export default BookingForm;
