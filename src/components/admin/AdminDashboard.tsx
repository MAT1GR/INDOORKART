import React from "react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Car,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import {
  formatCurrency,
  formatTime,
  getBookingStatusText,
} from "../../utils/formatters";
import { Link } from "react-router-dom";

interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  occupancyRate: number;
  upcomingBookings: any[];
}

const AdminDashboard: React.FC = () => {
  const { data: stats, loading } = useApi<DashboardStats>("/admin/dashboard");

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "text-red-600 bg-red-100";
    if (rate >= 60) return "text-orange-600 bg-orange-100";
    if (rate >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 capitalize">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Reservas (Hoy)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.todayBookings || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ingresos (Hoy)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency((stats?.todayRevenue || 0) / 100)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ocupación (Hoy)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.occupancyRate || 0}%
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${getOccupancyColor(
                stats?.occupancyRate || 0
              )}`}
            >
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  (stats?.occupancyRate || 0) >= 80
                    ? "bg-red-500"
                    : (stats?.occupancyRate || 0) >= 60
                    ? "bg-orange-500"
                    : (stats?.occupancyRate || 0) >= 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(stats?.occupancyRate || 0, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximas 2hs</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.upcomingBookings?.length || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-3 text-gray-600" />
            Próximas Reservas (Siguientes 2 horas)
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {stats?.upcomingBookings?.length ? (
            stats.upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Car className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {booking.code} - {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.timeSlot.startTime)} •{" "}
                        {booking.plan.name} • Karts:{" "}
                        {JSON.parse(booking.seats).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getBookingStatusText(booking.status)}
                    </span>

                    <div className="text-sm font-bold text-gray-900 w-24 text-right">
                      {formatCurrency(booking.total / 100)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                No hay reservas próximas
              </p>
              <p className="text-sm">Las próximas reservas aparecerán aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
