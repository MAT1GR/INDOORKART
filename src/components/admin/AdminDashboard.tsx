import React from 'react';
import { BarChart3, Calendar, DollarSign, Users, Clock, TrendingUp, AlertCircle, Car } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { formatCurrency, formatTime, getBookingStatusText } from '../../utils/formatters';

interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  occupancyRate: number;
  upcomingBookings: any[];
}

const AdminDashboard: React.FC = () => {
  const { data: stats, loading } = useApi<DashboardStats>('/admin/dashboard');

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('es-AR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600 bg-red-100';
    if (rate >= 60) return 'text-orange-600 bg-orange-100';
    if (rate >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 capitalize">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservas hoy</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.todayBookings || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.todayRevenue || 0)}
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
              <p className="text-sm font-medium text-gray-600">Ocupación</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.occupancyRate || 0}%</p>
            </div>
            <div className={`p-3 rounded-lg ${getOccupancyColor(stats?.occupancyRate || 0)}`}>
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (stats?.occupancyRate || 0) >= 80 ? 'bg-red-500' :
                  (stats?.occupancyRate || 0) >= 60 ? 'bg-orange-500' :
                  (stats?.occupancyRate || 0) >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(stats?.occupancyRate || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximas 2h</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.upcomingBookings?.length || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-2">🏎️ Nueva Reserva</h3>
          <p className="text-red-100 text-sm mb-4">Crear reserva manual desde el panel</p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Crear Reserva
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-2">⚙️ Estado Karts</h3>
          <p className="text-blue-100 text-sm mb-4">Gestionar disponibilidad de karts</p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Ver Karts
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-2">📊 Reportes</h3>
          <p className="text-green-100 text-sm mb-4">Exportar datos y estadísticas</p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Ver Reportes
          </button>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Próximas reservas (siguientes 2 horas)
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {stats?.upcomingBookings?.length ? (
            stats.upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Car className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.code} - {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.timeSlot.startTime)} • {booking.plan.name} • 
                        Karts: {JSON.parse(booking.seats).join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getBookingStatusText(booking.status)}
                    </span>
                    
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(booking.total / 100)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No hay reservas próximas</p>
              <p className="text-sm">Las próximas reservas aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
            Alertas del Sistema
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800">Todos los karts operativos</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">Pagos funcionando correctamente</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">Circuito renovado hace 45 días</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Resumen Semanal
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reservas esta semana</span>
              <span className="font-medium">42</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos semanales</span>
              <span className="font-medium">{formatCurrency(125600)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ocupación promedio</span>
              <span className="font-medium">67%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plan más popular</span>
              <span className="font-medium">Plan 15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;