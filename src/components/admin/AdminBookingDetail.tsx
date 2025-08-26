import React from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { Booking } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  User,
  Mail,
  Phone,
  DollarSign,
  Users,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  getBookingStatusText,
  getPaymentStatusText,
} from "../../utils/formatters";

const AdminBookingDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { data, loading, error } = useApi<{ booking: Booking }>(
    `/booking/${code}`
  );
  const booking = data?.booking;

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-12 text-center text-red-600">
        Error al cargar la reserva.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/bookings"
        className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver a Reservas</span>
      </Link>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reserva {booking.code}
            </h1>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {getBookingStatusText(booking.status)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatCurrency(booking.total / 100)}
            </p>
            <p className="text-sm text-gray-500">
              {getPaymentStatusText(booking.paymentStatus)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Detalles del Evento</h3>
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />{" "}
              {formatDateTime(
                booking.timeSlot!.date,
                booking.timeSlot!.startTime
              )}
            </p>
            <p className="flex items-center">
              <Car className="h-4 w-4 mr-2" /> {booking.plan?.name}
            </p>
            <p className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> {booking.qty} participantes
            </p>
            <p className="flex items-center">
              <Car className="h-4 w-4 mr-2" /> Karts:{" "}
              {JSON.parse(booking.seats).join(", ")}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Información del Cliente</h3>
            <p className="flex items-center">
              <User className="h-4 w-4 mr-2" /> {booking.customerName}
            </p>
            <p className="flex items-center">
              <Mail className="h-4 w-4 mr-2" /> {booking.email}
            </p>
            <p className="flex items-center">
              <Phone className="h-4 w-4 mr-2" /> {booking.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
