import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApi, apiCall } from "../../hooks/useApi";
import { TimeSlot, Booking } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import {
  Calendar,
  Clock,
  PlusCircle,
  Users,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { getPaymentStatusText, parseDateAsLocal } from "../../utils/formatters";

interface TimeSlotWithBookings extends TimeSlot {
  bookings: Booking[];
}

const AdminTimeslots: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const { data: branch } = useApi<any>("/public/branch");
  const {
    data: timeSlots,
    loading,
    error,
    mutate,
  } = useApi<TimeSlotWithBookings[]>(
    `/admin/timeslots?date=${selectedDate}&branchId=${branch?.id}`
  );
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<TimeSlotWithBookings | null>(null);

  const handleGenerateSlots = async (formData: any) => {
    if (branch?.id) {
      try {
        const response = await apiCall("/admin/timeslots/generate", {
          method: "POST",
          body: JSON.stringify({
            branchId: branch.id,
            ...formData,
          }),
        });
        alert(response.message);
        mutate();
        setIsGenerateModalOpen(false);
      } catch (error) {
        alert("Error al generar los horarios.");
      }
    }
  };

  const getOccupancyVariant = (available: number, capacity: number) => {
    const occupancy = ((capacity - available) / capacity) * 100;
    if (occupancy >= 80) return "bg-red-500";
    if (occupancy >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusInfo = (slot: TimeSlot) => {
    if (slot.status !== "ok")
      return {
        text: "Cerrado",
        icon: <Lock className="h-4 w-4" />,
        color: "bg-gray-200 text-gray-800",
      };
    if (slot.available === 0)
      return {
        text: "Completo",
        icon: <Lock className="h-4 w-4" />,
        color: "bg-red-100 text-red-800",
      };
    if (slot.available <= 2)
      return {
        text: "Casi lleno",
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "bg-yellow-100 text-yellow-800",
      };
    return {
      text: "Abierto",
      icon: null,
      color: "bg-green-100 text-green-800",
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Horarios
          </h1>
          <p className="text-gray-600">
            Visualizá y administra los horarios para el día:{" "}
            <span className="font-semibold text-red-600">
              {format(
                parseDateAsLocal(selectedDate),
                "EEEE, d 'de' MMMM 'de' yyyy",
                { locale: es }
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border flex items-center space-x-4">
        <Calendar className="h-5 w-5 text-gray-500" />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-12">
          Error al cargar los horarios.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {timeSlots?.map((slot) => {
            const status = getStatusInfo(slot);
            return (
              <div
                key={slot.id}
                className="bg-white p-4 rounded-lg border flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-xl flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {slot.startTime}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${status.color}`}
                    >
                      {status.icon}
                      {status.text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Disponibles: {slot.available}/{slot.capacity}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className={`h-2.5 rounded-full ${getOccupancyVariant(
                        slot.available,
                        slot.capacity
                      )}`}
                      style={{
                        width: `${
                          ((slot.capacity - slot.available) / slot.capacity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      setIsBookingModalOpen(true);
                    }}
                    disabled={slot.bookings.length === 0}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Ver Reservas ({slot.bookings.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    disabled={slot.available === 0}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nueva Reserva
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Reservas para las ${selectedTimeSlot?.startTime}`}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedTimeSlot && selectedTimeSlot.bookings.length > 0 ? (
            selectedTimeSlot.bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">
                      Karts: {JSON.parse(booking.seats).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {getPaymentStatusText(booking.paymentStatus)}
                    </p>
                    <Link
                      to={`/admin/bookings/${booking.code}`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No hay reservas para este horario.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminTimeslots;
