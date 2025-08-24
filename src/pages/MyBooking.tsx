import React, { useState } from 'react';
import { Search, Calendar, Clock, Car, CreditCard, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../hooks/useApi';
import { Booking } from '../types';
import { formatDate, formatTime, formatCurrency, getBookingStatusText, getPaymentStatusText } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const MyBooking: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooking = async () => {
    if (!searchCode.trim()) {
      setError('Por favor ingresá tu código de reserva');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiCall(`/booking/${searchCode.trim().toUpperCase()}`);
      setBooking(response.booking);
    } catch (error) {
      setError('Reserva no encontrada. Verificá el código e intentá de nuevo.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!booking || !window.confirm('¿Estás seguro que querés cancelar tu reserva? La seña no se reintegra.')) {
      return;
    }

    try {
      setLoading(true);
      await apiCall(`/booking/${booking.code}/cancel`, { method: 'POST' });
      alert('Reserva cancelada exitosamente');
      setBooking({ ...booking, status: 'cancelled' });
    } catch (error) {
      alert('Error al cancelar la reserva. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mi <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Reserva</span>
          </h1>
          <p className="text-xl text-gray-600">
            Consultá el estado de tu reserva y gestionala online
          </p>
        </div>

        {!booking ? (
          /* Search Form */
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Buscá tu reserva
              </h2>
              <p className="text-gray-600">
                Ingresá tu código de reserva para ver los detalles
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); searchBooking(); }} className="space-y-6">
              <Input
                label="Código de reserva *"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="RIK-AB12CD"
                error={error}
                className="text-center font-mono text-lg"
              />

              <Input
                label="Email de confirmación (opcional)"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="tu@email.com"
                helperText="Para mayor seguridad en la búsqueda"
              />

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Buscando...' : 'Buscar mi reserva'}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">¿No encontrás tu código?</h3>
              <p className="text-blue-800 text-sm mb-3">
                El código de reserva fue enviado por email al confirmar tu reserva. 
                Tiene el formato RIK-XXXXXX.
              </p>
              <a
                href="https://wa.me/5493416188143?text=¡Hola! No encuentro mi código de reserva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>💬</span>
                <span>Contactanos por WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          /* Booking Details */
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getBookingStatusText(booking.status)}
              </div>
            </div>

            {/* Main Details */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reserva {booking.code}
                </h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(booking.total / 100)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getPaymentStatusText(booking.paymentStatus)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Fecha y horario</h3>
                      <p className="text-gray-600">
                        {booking.timeSlot && formatDate(booking.timeSlot.date)}
                      </p>
                      <p className="text-gray-600">
                        {booking.timeSlot && formatTime(booking.timeSlot.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Car className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Plan y karts</h3>
                      <p className="text-gray-600">{booking.plan?.name}</p>
                      <p className="text-gray-600">
                        Karts: {JSON.parse(booking.seats).join(', ')} ({booking.qty} piloto{booking.qty !== 1 ? 's' : ''})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Piloto principal</h3>
                      <p className="text-gray-600">{booking.customerName}</p>
                      <p className="text-gray-600">{booking.email}</p>
                      <p className="text-gray-600">{booking.phone}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <CreditCard className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Notas</h3>
                        <p className="text-gray-600">{booking.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                Te esperamos aquí
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-2"><strong>📍 Dirección:</strong></p>
                  <p className="text-red-100">Anchorena 2751, Rosario, Santa Fe</p>
                </div>
                <div>
                  <p className="mb-2"><strong>🕒 Llegá 15 minutos antes:</strong></p>
                  <p className="text-red-100">Para el briefing de seguridad obligatorio</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {booking.status === 'confirmed' || booking.status === 'pending' ? (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={cancelBooking}
                  variant="danger"
                  loading={loading}
                  className="flex-1"
                >
                  Cancelar reserva
                </Button>
                
                <a
                  href={`https://wa.me/5493416188143?text=Hola, quiero reprogramar mi reserva ${booking.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
                >
                  Reprogramar por WhatsApp
                </a>
              </div>
            ) : null}

            <div className="text-center">
              <button
                onClick={() => setBooking(null)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Buscar otra reserva
              </button>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
          <h3 className="font-bold text-yellow-800 mb-3">📋 Recordá:</h3>
          <ul className="space-y-2 text-yellow-700 text-sm">
            <li>• Llegá 15 minutos antes para el briefing de seguridad</li>
            <li>• Traé documento de identidad para verificar edad (mín. 15 años)</li>
            <li>• Las cancelaciones pierden la seña del 50%</li>
            <li>• Las reprogramaciones se pueden hacer hasta 24h antes</li>
            <li>• Consultanos por WhatsApp para cualquier duda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;