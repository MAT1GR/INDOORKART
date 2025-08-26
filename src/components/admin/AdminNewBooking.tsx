import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import { useApi, apiCall } from "../../hooks/useApi";
import { Branch, Plan, TimeSlot, KartStatus } from "../../types";
import { format } from "date-fns";
import {
  formatCurrency,
  formatTime,
  getBookingStatusText,
  getPaymentStatusText,
} from "../../utils/formatters";

const AdminNewBooking: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
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

  const { data: branch } = useApi<Branch>("/public/branch");
  const { data: timeSlots, loading: timeSlotsLoading } = useApi<TimeSlot[]>(
    `/public/timeslots?date=${selectedDate}&branchId=${branch?.id}`
  );
  const { data: plans } = useApi<Plan[]>("/public/plans");
  const { data: kartsData } = useApi<any>(
    selectedTimeSlot ? `/public/karts/${selectedTimeSlot.id}` : null
  );

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Reserva"
      size="xl"
    >
      <div className="space-y-4">
        {step === 1 && (
          <div>
            <Input
              label="Fecha"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {timeSlotsLoading && <LoadingSpinner />}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {timeSlots?.map((slot) => (
                <Button
                  key={slot.id}
                  variant={
                    selectedTimeSlot?.id === slot.id ? "primary" : "secondary"
                  }
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={slot.available === 0}
                >
                  {slot.startTime} ({slot.available})
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedTimeSlot}
              className="mt-4"
            >
              Siguiente
            </Button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {plans?.map((plan) => (
                <Button
                  key={plan.id}
                  variant={
                    selectedPlan?.id === plan.id ? "primary" : "secondary"
                  }
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.name}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
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
                  Kart {kart.number}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedPlan || selectedSeats.length === 0}
              className="mt-4"
            >
              Siguiente
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Input
              label="Nombre del Cliente"
              value={customerData.name}
              onChange={(e) =>
                setCustomerData({ ...customerData, name: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={customerData.email}
              onChange={(e) =>
                setCustomerData({ ...customerData, email: e.target.value })
              }
            />
            <Input
              label="Teléfono"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({ ...customerData, phone: e.target.value })
              }
            />
            <div className="flex gap-4">
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
              </select>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="deposit">Seña Pagada</option>
                <option value="paid">Pagada</option>
                <option value="unpaid">Sin Pagar</option>
              </select>
            </div>

            <Button onClick={handleSubmit} className="mt-4">
              Crear Reserva
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdminNewBooking;
