import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Car,
  User,
  Check,
  ArrowLeft,
  CreditCard,
  X,
  ArrowRight,
} from "lucide-react";
import { Branch, TimeSlot, Plan } from "../types";
import { useApi, apiCall } from "../hooks/useApi";
import DatePicker from "../components/booking/DatePicker";
import TimeSlotPicker from "../components/booking/TimeSlotPicker";
import PlanKartPicker from "../components/booking/PlanKartPicker";
import BookingForm from "../components/booking/BookingForm";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatCurrency, formatDate, formatTime } from "../utils/formatters";
import logo from "../components/public/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../components/common/Input";

const BookingStep = ({
  icon,
  title,
  isComplete,
  isActive,
}: {
  icon: React.ReactNode;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}) => (
  <div
    className={`flex items-center p-4 rounded-lg transition-colors ${
      isActive ? "bg-red-50" : ""
    }`}
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
        isComplete
          ? "bg-green-500 text-white"
          : isActive
          ? "bg-red-600 text-white"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {isComplete ? <Check size={16} /> : icon}
    </div>
    <span
      className={`ml-4 font-medium ${
        isActive || isComplete ? "text-gray-800" : "text-gray-500"
      }`}
    >
      {title}
    </span>
  </div>
);

const BookingPage: React.FC = () => {
  const { data: branch, loading: branchLoading } =
    useApi<Branch>("/public/branch");
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

  const handleBookingSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await apiCall("/booking", {
        method: "POST",
        body: JSON.stringify({
          branchId: branch!.id,
          timeSlotId: selectedTimeSlot!.id,
          planId: selectedPlan!.id,
          seats: selectedKarts,
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          participants: participants.map((p, i) => p || `Piloto ${i + 1}`),
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

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl font-bold mb-6">¿Cuándo querés correr?</h2>
            <div className="space-y-6">
              <DatePicker
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                branch={branch!}
              />
              {selectedDate && (
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={setSelectedTimeSlot}
                  branch={branch!}
                />
              )}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key={2}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              Elegí tu plan y tus karts
            </h2>
            <div className="space-y-6">
              {selectedTimeSlot && (
                <PlanKartPicker
                  timeSlot={selectedTimeSlot}
                  selectedPlan={selectedPlan}
                  onPlanSelect={setSelectedPlan}
                  selectedSeats={selectedKarts}
                  onSeatsSelect={setSelectedKarts}
                  sessionId={sessionId}
                />
              )}
              {selectedKarts.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 mt-4">
                    ¿Quiénes van a correr?
                  </h4>
                  {Array.from({ length: selectedKarts.length }).map(
                    (_, index) => (
                      <Input
                        key={index}
                        placeholder={
                          index === 0
                            ? "Tu Nombre (Piloto Principal) *"
                            : `Nombre Piloto ${index + 1}`
                        }
                        value={participants[index] || ""}
                        onChange={(e) => {
                          const newP = [...participants];
                          newP[index] = e.target.value;
                          setParticipants(newP);
                        }}
                        className="mb-2"
                        required={index === 0}
                        icon={<User className="h-4 w-4 text-gray-400" />}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key={3}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl font-bold mb-6">Último paso: Tus datos</h2>
            {selectedPlan && (
              <BookingForm
                plan={selectedPlan}
                seats={selectedKarts}
                timeSlot={selectedTimeSlot!}
                onSubmit={handleBookingSubmit}
                isLoading={isSubmitting}
              />
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (branchLoading || !branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <Check className="h-16 w-16 mx-auto text-green-500 bg-green-100 rounded-full p-3 mb-6" />
          <h2 className="text-3xl font-bold mb-4">¡Reserva Confirmada!</h2>
          <p className="text-gray-600 mb-6">
            Tu código es{" "}
            <strong className="font-mono bg-gray-200 px-2 py-1 rounded">
              {createdBooking.code}
            </strong>
            . Hemos enviado todos los detalles a tu correo electrónico.
          </p>
          <Link to="/">
            <Button size="lg" className="w-full">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white p-4 border-b w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-red-600 flex items-center"
          >
            <X size={20} className="mr-2" /> Salir
          </Link>
          <div className="w-1/3">
            <div className="bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-grow lg:w-2/3 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 sm:p-8 lg:p-12">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </div>
        </main>

        <aside className="lg:w-1/3 bg-white border-l p-6 sm:p-8 flex-shrink-0">
          <div className="sticky top-8">
            <h3 className="text-xl font-bold mb-4">Tu Reserva</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Fecha:</span>{" "}
                <span className="font-medium text-gray-900">
                  {selectedDate ? formatDate(selectedDate) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>{" "}
                <span className="font-medium text-gray-900">
                  {selectedTimeSlot
                    ? formatTime(selectedTimeSlot.startTime)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>{" "}
                <span className="font-medium text-gray-900">
                  {selectedPlan ? selectedPlan.name : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Karts:</span>{" "}
                <span className="font-medium text-gray-900">
                  {selectedKarts.length > 0
                    ? `${selectedKarts.length} karts`
                    : "-"}
                </span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>{" "}
                  <span>
                    {formatCurrency(
                      ((selectedPlan?.currentPrice?.amount || 0) *
                        selectedKarts.length) /
                        100
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Seña (50%):</span>{" "}
                  <span className="font-bold">
                    {formatCurrency(
                      ((selectedPlan?.currentPrice?.amount || 0) *
                        selectedKarts.length *
                        0.5) /
                        100
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8 pt-4">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className={`${step === 1 ? "invisible" : ""}`}
              >
                <ArrowLeft size={16} className="mr-2" /> Atrás
              </Button>
              {step < 3 && (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={
                    step === 1
                      ? !selectedTimeSlot
                      : !selectedPlan ||
                        selectedKarts.length === 0 ||
                        !(participants[0] || "").trim()
                  }
                >
                  Siguiente <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
