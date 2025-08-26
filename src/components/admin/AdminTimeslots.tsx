import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApi, apiCall } from "../../hooks/useApi";
import { TimeSlot, Booking, Branch, Plan } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import AdminNewBooking from "./AdminNewBooking";
import {
  Calendar,
  Clock,
  PlusCircle,
  Users,
  Lock,
  AlertTriangle,
  User,
  Car,
  DollarSign,
} from "lucide-react";
import {
  getPaymentStatusText,
  parseDateAsLocal,
  formatCurrency,
} from "../../utils/formatters";

interface TimeSlotWithBookings extends TimeSlot {
  bookings: Booking[];
}

const AdminTimeslots: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const { data: branch } = useApi<Branch>("/public/branch");
  const {
    data: timeSlots,
    loading,
    error,
    mutate,
  } = useApi<TimeSlotWithBookings[]>(
    branch
      ? `/admin/timeslots?date=${selectedDate}&branchId=${branch.id}`
      : null
  );

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

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

  const handleOpenNewBooking = (slot: TimeSlotWithBookings) => {
    setSelectedTimeSlot(slot);
    setIsNewBookingModalOpen(true);
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
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Generar Nuevos Horarios
        </Button>
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
                    disabled={slot.available === 0 || slot.status !== "ok"}
                    onClick={() => handleOpenNewBooking(slot)}
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
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generar Nuevos Horarios"
      >
        <GenerateSlotsForm onSubmit={handleGenerateSlots} />
      </Modal>

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Reservas para las ${selectedTimeSlot?.startTime}`}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {selectedTimeSlot && selectedTimeSlot.bookings.length > 0 ? (
            selectedTimeSlot.bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-gray-500">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Car className="h-5 w-5 text-gray-500" />
                      <div>
                        <p>{booking.plan?.name}</p>
                        <p className="text-xs">
                          Karts: {JSON.parse(booking.seats).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-lg text-red-600">
                      {formatCurrency(booking.total / 100)}
                    </p>
                    <span
                      className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                        booking.paymentStatus === "paid" ||
                        booking.paymentStatus === "deposit"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                    <Link
                      to={`/admin/bookings/${booking.code}`}
                      className="mt-2"
                    >
                      <Button size="sm" variant="secondary">
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                No hay reservas para este horario.
              </p>
            </div>
          )}
        </div>
      </Modal>

      <AdminNewBooking
        isOpen={isNewBookingModalOpen}
        onClose={() => {
          setIsNewBookingModalOpen(false);
          mutate();
        }}
        preselectedTimeSlot={selectedTimeSlot}
      />
    </div>
  );
};

const GenerateSlotsForm: React.FC<{
  onSubmit: (data: any) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "17:00",
    endTime: "23:00",
    interval: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Fecha de Inicio"
        type="date"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
      />
      <Input
        label="Fecha de Fin"
        type="date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
      />
      <Input
        label="Hora de Inicio"
        type="time"
        value={formData.startTime}
        onChange={(e) =>
          setFormData({ ...formData, startTime: e.target.value })
        }
      />
      <Input
        label="Hora de Fin"
        type="time"
        value={formData.endTime}
        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
      />
      <Input
        label="Intervalo (minutos)"
        type="number"
        value={formData.interval}
        onChange={(e) =>
          setFormData({ ...formData, interval: parseInt(e.target.value) })
        }
      />
      <Button type="submit">Generar</Button>
    </form>
  );
};

export default AdminTimeslots;
