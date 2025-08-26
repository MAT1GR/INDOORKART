import React, { useState, useEffect } from "react";
import { X, Calendar, Car, CreditCard, Check } from "lucide-react";
import Button from "../common/Button";
import { apiCall } from "../../hooks/useApi";
import { TimeSlot, Plan, Branch, Participant } from "../../types";
import { formatDate, formatTime, formatCurrency } from "../../utils/formatters";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import PlanKartPicker from "./PlanKartPicker";
import BookingForm from "./BookingForm";

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
}

interface WizardStep {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  { id: 1, title: "Fecha y Hora", icon: <Calendar className="h-5 w-5" /> },
  { id: 2, title: "Plan y Karts", icon: <Car className="h-5 w-5" /> },
  {
    id: 3,
    title: "Datos de Pilotos",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  branch,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedKarts, setSelectedKarts] = useState<number[]>([]);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedDate("");
        setSelectedTimeSlot(null);
        setSelectedPlan(null);
        setSelectedKarts([]);
        setBookingComplete(false);
        setCreatedBooking(null);
      }, 300);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!selectedTimeSlot;
      case 3:
        return !!selectedPlan && selectedKarts.length > 0;
      default:
        return true;
    }
  };

  const handleBookingSubmit = async (formData: {
    participants: Participant[];
    notes?: string;
    paymentMethod: any;
  }) => {
    if (!selectedTimeSlot || !selectedPlan) return;

    setIsSubmitting(true);
    try {
      const { participants, notes, paymentMethod } = formData;
      const response = await apiCall("/booking", {
        method: "POST",
        body: JSON.stringify({
          branchId: branch.id,
          timeSlotId: selectedTimeSlot.id,
          planId: selectedPlan.id,
          participants,
          notes,
          paymentMethod,
          sessionId,
        }),
      });

      setCreatedBooking(response.booking);
      setBookingComplete(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error al crear la reserva. Por favor, intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">🏎️ Reservar tu carrera</h2>
                <p className="text-red-100 mt-1">¡La adrenalina te espera!</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            {!bookingComplete && (
              <div className="flex items-center justify-center mt-6 space-x-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        currentStep === step.id
                          ? "bg-white text-red-600"
                          : currentStep > step.id
                          ? "bg-green-500 text-white"
                          : "bg-red-700 text-red-200"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium hidden md:block ${
                        currentStep >= step.id ? "text-white" : "text-red-200"
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.id < steps.length && (
                      <div
                        className={`hidden md:block w-8 h-0.5 ${
                          currentStep > step.id ? "bg-green-400" : "bg-red-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-grow">
            {bookingComplete && createdBooking ? (
              <div className="text-center space-y-6">
                <div className="text-green-600">
                  <Check className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">¡Reserva Confirmada!</h3>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">
                    Detalles de tu reserva:
                  </h4>
                  <div className="space-y-2 text-left">
                    <p>
                      <strong>Código:</strong> {createdBooking.code}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {formatDate(createdBooking.timeSlot.date)}
                    </p>
                    <p>
                      <strong>Horario:</strong>{" "}
                      {formatTime(createdBooking.timeSlot.startTime)}
                    </p>
                    <p>
                      <strong>Plan:</strong> {createdBooking.plan.name}
                    </p>
                    <p>
                      <strong>Karts:</strong>{" "}
                      {JSON.parse(createdBooking.seats).join(", ")}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      {formatCurrency(createdBooking.total / 100)}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>📧 Te enviamos los detalles y QR por email</p>
                  <p>⚠️ Recordá llegar 15 minutos antes</p>
                  <p>
                    📱 Podés gestionar tu reserva con el código:{" "}
                    <strong>{createdBooking.code}</strong>
                  </p>
                </div>

                <Button onClick={onClose} size="lg">
                  ¡Perfecto!
                </Button>
              </div>
            ) : (
              <div>
                {currentStep === 1 && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <DatePicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      branch={branch}
                    />
                    {selectedDate && (
                      <TimeSlotPicker
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        onTimeSlotSelect={setSelectedTimeSlot}
                        branch={branch}
                      />
                    )}
                  </div>
                )}
                {currentStep === 2 && selectedTimeSlot && (
                  <PlanKartPicker
                    timeSlot={selectedTimeSlot}
                    selectedPlan={selectedPlan}
                    selectedKarts={selectedKarts}
                    onPlanSelect={setSelectedPlan}
                    onKartsSelect={setSelectedKarts}
                    sessionId={sessionId}
                  />
                )}
                {currentStep === 3 &&
                  selectedPlan &&
                  selectedKarts.length > 0 && (
                    <BookingForm
                      plan={selectedPlan}
                      karts={selectedKarts}
                      timeSlot={selectedTimeSlot!}
                      onSubmit={handleBookingSubmit}
                      isLoading={isSubmitting}
                    />
                  )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!bookingComplete && (
            <div className="border-t p-6 flex justify-between bg-gray-50">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                ← Atrás
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceedToStep(currentStep + 1)}
              >
                {currentStep === steps.length
                  ? "Confirmar Reserva"
                  : "Siguiente →"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
