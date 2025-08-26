// mat1gr/indoorkart/INDOORKART-develop/src/components/admin/AdminBookings.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApi, apiCall } from "../../hooks/useApi";
import { Booking } from "../../types";
import {
  formatCurrency,
  formatDateTime,
  getBookingStatusText,
  getPaymentStatusText,
} from "../../utils/formatters";
import Input from "../common/Input";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import AdminNewBooking from "./AdminNewBooking";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  PlusCircle,
  Trash2,
} from "lucide-react";

const AdminBookings: React.FC = () => {
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const query = new URLSearchParams({
    page: page.toString(),
    limit: "15",
    ...filters,
  }).toString();

  const { data, loading, error, mutate } = useApi<{
    bookings: Booking[];
    pagination: any;
  }>(`/admin/bookings?${query}`);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleDelete = async (bookingId: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que querés eliminar esta reserva? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await apiCall(`/admin/bookings/${bookingId}`, {
          method: "DELETE",
        });
        alert("Reserva eliminada exitosamente.");
        mutate(); // Recarga los datos
      } catch (err) {
        alert("Error al eliminar la reserva.");
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Reservas
            </h1>
            <p className="text-gray-600">
              Buscá, filtrá y administrá todas las reservas.
            </p>
          </div>
          <Button onClick={() => setIsBookingModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
          <Input
            name="search"
            placeholder="Buscar por código, nombre..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <Input
            name="date"
            type="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="noShow">No se presentó</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              Error al cargar las reservas.
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Fecha y Hora
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.bookings?.map((booking) => (
                  <tr
                    key={booking.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-mono font-bold">
                      {booking.code}
                    </td>
                    <td className="px-6 py-4">{booking.customerName}</td>
                    <td className="px-6 py-4">
                      {booking.timeSlot &&
                        formatDateTime(
                          booking.timeSlot.date,
                          booking.timeSlot.startTime
                        )}
                    </td>
                    <td className="px-6 py-4">{booking.plan?.name}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(booking.total / 100)}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <Link to={`/admin/bookings/${booking.code}`}>
                        <Button size="sm" variant="secondary">
                          Ver
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="flex justify-between items-center">
            <Button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              Anterior
            </Button>
            <span>
              Página {page} de {data.pagination.pages}
            </span>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.pagination.pages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <AdminNewBooking
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          mutate();
        }}
      />
    </>
  );
};

export default AdminBookings;
