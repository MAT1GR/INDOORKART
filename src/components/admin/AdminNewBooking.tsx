import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import { useApi, apiCall } from "../../hooks/useApi";
import { Branch, Plan, TimeSlot, KartStatus } from "../../types";
import { format } from "date-fns";
import { formatCurrency, formatTime } from "../../utils/formatters";
import {
  Calendar,
  Clock,
  Car,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface AdminNewBookingProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTimeSlot?: TimeSlot | null;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex items-center justify-center mb-6">
    {Array.from({ length: totalSteps }).map((_, index) => {
      const step = index + 1;
      const isCompleted = step < currentStep;
      const isActive = step === currentStep;
      return (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              isCompleted
                ? "bg-green-500 text-white"
                : isActive
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {isCompleted ? <CheckCircle size={16} /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`flex-1 h-1 transition-all duration-300 mx-2 ${
                isCompleted ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const AdminNewBooking: React.FC<AdminNewBookingProps> = ({
  isOpen,
  onClose,
  preselectedTimeSlot = null,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingStatus, setBookingStatus] = useState("confirmed");
  const [paymentStatus, setPaymentStatus] = useState("deposit");

  const { data: branch } = useApi<Branch>(isOpen ? "/public/branch" : null);
  const { data: timeSlots, loading: timeSlotsLoading } = useApi<TimeSlot[]>(
    isOpen && step === 1 && !preselectedTimeSlot
      ? `/public/timeslots?date=${selectedDate}&branchId=${branch?.id}`
      : null
  );
  const { data: plans } = useApi<Plan[]>(
    isOpen && step === 2 ? "/public/plans" : null
  );
  const { data: kartsData, loading: kartsLoading } = useApi<any>(
    selectedTimeSlot ? `/public/karts/${selectedTimeSlot.id}` : null
  );

  useEffect(() => {
    if (isOpen) {
      if (preselectedTimeSlot) {
        setSelectedDate(preselectedTimeSlot.date);
        setSelectedTimeSlot(preselectedTimeSlot);
        setStep(2);
      } else {
        resetState();
      }
    }
  }, [preselectedTimeSlot, isOpen]);

  const resetState = () => {
    setStep(1);
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedTimeSlot(null);
    setSelectedPlan(null);
    setSelectedSeats([]);
    setCustomerData({ name: "", email: "", phone: "" });
    setBookingStatus("confirmed");
    setPaymentStatus("deposit");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const price = plans
        ?.find((p) => p.id === selectedPlan?.id)
        ?.prices?.find((pr) => pr.method === "cash");
      const total = (price?.amount || 0) * selectedSeats.length;

      await apiCall("/admin/bookings", {
        method: "POST",
        body: JSON.stringify({
          branchId: branch?.id,
          timeSlotId: selectedTimeSlot?.id,
          planId: selectedPlan?.id,
          seats: selectedSeats,
          customerName: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          status: bookingStatus,
          paymentStatus: paymentStatus,
          total,
        }),
      });
      alert("Reserva creada exitosamente.");
      handleClose();
    } catch (error) {
      alert("Error al crear la reserva.");
    }
  };

  const totalAmount =
    (selectedPlan?.prices?.find((p) => p.method === "cash")?.amount || 0) *
    selectedSeats.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Reserva Manual"
      size="xl"
    >
      <div className="space-y-6">
        <StepIndicator currentStep={step} totalSteps={3} />

        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Paso 1: Seleccionar Fecha y Hora
            </h3>
            <Input
              label="Fecha"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTimeSlot(null);
              }}
            />
            {timeSlotsLoading && (
              <div className="flex justify-center mt-4">
                <LoadingSpinner />
              </div>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded">
              {timeSlots?.map((slot) => (
                <Button
                  key={slot.id}
                  variant={
                    selectedTimeSlot?.id === slot.id ? "primary" : "ghost"
                  }
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={slot.available === 0}
                  className="flex flex-col h-auto"
                >
                  <span className="font-bold text-lg">{slot.startTime}</span>
                  <span className="text-xs">{slot.available} disp.</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(2)} disabled={!selectedTimeSlot}>
                Siguiente <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Paso 2: Seleccionar Plan y Karts
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {plans?.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${
                    selectedPlan?.id === plan.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <h4 className="font-bold">{plan.name}</h4>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <p className="font-semibold mt-2">
                    {formatCurrency(
                      (plan.prices?.find((p) => p.method === "cash")?.amount ||
                        0) / 100
                    )}
                  </p>
                </div>
              ))}
            </div>

            <h4 className="font-medium mb-2">Karts Disponibles</h4>
            {kartsLoading && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-2 bg-gray-50 rounded">
              {kartsData?.karts.map((kart: KartStatus) => (
                <Button
                  key={kart.number}
                  variant={
                    selectedSeats.includes(kart.number)
                      ? "primary"
                      : "secondary"
                  }
                  disabled={kart.status !== "available"}
                  onClick={() =>
                    setSelectedSeats((prev) =>
                      prev.includes(kart.number)
                        ? prev.filter((s) => s !== kart.number)
                        : [...prev, kart.number]
                    )
                  }
                >
                  {kart.number}
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedPlan || selectedSeats.length === 0}
              >
                Siguiente <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Paso 3: Datos del Cliente y Confirmación
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <Input
                  label="Nombre del Cliente"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, email: e.target.value })
                  }
                  required
                />
                <Input
                  label="Teléfono"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, phone: e.target.value })
                  }
                  required
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado Reserva
                    </label>
                    <select
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="confirmed">Confirmada</option>
                      <option value="pending">Pendiente</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado Pago
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="deposit">Seña Pagada</option>
                      <option value="paid">Pagada</option>
                      <option value="unpaid">Sin Pagar</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-4">Resumen de la Reserva</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Fecha:</strong> {selectedDate}
                  </p>
                  <p>
                    <strong>Hora:</strong> {selectedTimeSlot?.startTime}
                  </p>
                  <p>
                    <strong>Plan:</strong> {selectedPlan?.name}
                  </p>
                  <p>
                    <strong>Karts:</strong> {selectedSeats.join(", ")} (
                    {selectedSeats.length})
                  </p>
                  <hr className="my-2" />
                  <p className="text-lg font-bold">
                    Total: {formatCurrency(totalAmount / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !customerData.name ||
                  !customerData.email ||
                  !customerData.phone
                }
              >
                Confirmar y Crear Reserva
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdminNewBooking;
