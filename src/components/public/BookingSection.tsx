import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Car, User, Check, CreditCard } from "lucide-react";
import { Branch, TimeSlot, Plan } from "../../types";
import DatePicker from "../booking/DatePicker";
import TimeSlotPicker from "../booking/TimeSlotPicker";
import PlanKartPicker from "../booking/PlanKartPicker";
import BookingForm from "../booking/BookingForm";
import Button from "../common/Button";
import { apiCall } from "../../hooks/useApi";
import { formatDate, formatTime, formatCurrency } from "../../utils/formatters";

interface BookingSectionProps {
  branch: Branch;
}

const BookingSection: React.FC<BookingSectionProps> = ({ branch }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedKarts, setSelectedKarts] = useState<number[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setSelectedPlan(null);
    setSelectedKarts([]);
    setParticipants([]);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setStep(2);
  };

  const handlePlanAndKartsSelect = (plan: Plan, karts: number[]) => {
    setSelectedPlan(plan);
    setSelectedKarts(karts);
    setParticipants(
      Array(karts.length)
        .fill("")
        .map((_, i) => (i === 0 ? "" : `Piloto ${i + 1}`))
    );
    setStep(3);
  };

  const handleBookingSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await apiCall("/booking", {
        method: "POST",
        body: JSON.stringify({
          branchId: branch.id,
          timeSlotId: selectedTimeSlot!.id,
          planId: selectedPlan!.id,
          seats: selectedKarts,
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          participants: participants,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          sessionId,
        }),
      });
      setCreatedBooking(response.booking);
      setBookingComplete(true);
    } catch (error) {
      alert("Error al crear la reserva. Por favor, intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepContent = () => {
    if (bookingComplete) {
      return (
        <div className="text-center space-y-6 py-12">
          <Check className="h-16 w-16 mx-auto text-green-500 bg-green-100 rounded-full p-3" />
          <h3 className="text-3xl font-bold">¡Reserva Confirmada!</h3>
          <p className="text-gray-600">
            Tu código de reserva es{" "}
            <strong className="font-mono bg-gray-200 px-2 py-1 rounded">
              {createdBooking.code}
            </strong>
            . Te hemos enviado todos los detalles a tu email.
          </p>
          <Button onClick={() => window.scrollTo(0, 0)}>
            Volver al Inicio
          </Button>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna Izquierda: Calendario y Horarios */}
        <div
          className={`space-y-6 transition-opacity duration-500 ${
            step > 1 ? "opacity-50 md:opacity-100" : "opacity-100"
          }`}
        >
          <div>
            <h3 className="text-xl font-bold flex items-center mb-4">
              <Calendar className="h-6 w-6 mr-2 text-red-600" />
              1. Elegí Fecha y Hora
            </h3>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              branch={branch}
            />
          </div>
          {selectedDate && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              branch={branch}
            />
          )}
        </div>

        {/* Columna Derecha: Plan, Karts y Datos */}
        <div
          className={`space-y-6 transition-opacity duration-500 ${
            step < 2 ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <div>
            <h3 className="text-xl font-bold flex items-center mb-4">
              <Car className="h-6 w-6 mr-2 text-red-600" />
              2. Elegí Plan y Karts
            </h3>
            {selectedTimeSlot && (
              <PlanKartPicker
                timeSlot={selectedTimeSlot}
                selectedPlan={selectedPlan}
                selectedKarts={selectedKarts}
                onPlanSelect={setSelectedPlan}
                onKartsSelect={setSelectedKarts}
                sessionId={sessionId}
              />
            )}
          </div>

          <div
            className={`transition-opacity duration-500 ${
              step < 3 ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <h3 className="text-xl font-bold flex items-center mb-4">
              <User className="h-6 w-6 mr-2 text-red-600" />
              3. Datos de la Reserva
            </h3>
            {selectedPlan && selectedKarts.length > 0 && (
              <BookingForm
                plan={selectedPlan}
                seats={selectedKarts}
                participants={participants}
                onParticipantsChange={setParticipants}
                onSubmit={handleBookingSubmit}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Reservá tu{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Carrera
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seguí estos simples pasos para asegurar tu lugar en la pista.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
          <StepContent />
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
