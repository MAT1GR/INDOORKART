import React, { useState, useEffect } from 'react';
import { Car, Trophy, Users, Check } from 'lucide-react';
import { useApi, apiCall } from '../../hooks/useApi';
import { TimeSlot, Plan, KartStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

interface PlanKartPickerProps {
  timeSlot: TimeSlot;
  selectedPlan: Plan | null;
  selectedSeats: number[];
  onPlanSelect: (plan: Plan) => void;
  onSeatsSelect: (seats: number[]) => void;
  sessionId: string;
}

const PlanKartPicker: React.FC<PlanKartPickerProps> = ({
  timeSlot,
  selectedPlan,
  selectedSeats,
  onPlanSelect,
  onSeatsSelect,
  sessionId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mp' | 'card'>('cash');
  const [karts, setKarts] = useState<KartStatus[]>([]);
  const [holdExpiration, setHoldExpiration] = useState<Date | null>(null);

  const { data: plans, loading: plansLoading } = useApi<Plan[]>(
    `/public/plans?method=${paymentMethod}`
  );

  // Load kart availability
  useEffect(() => {
    if (timeSlot) {
      loadKartAvailability();
    }
  }, [timeSlot]);

  // Create hold when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0) {
      createHold();
    }
  }, [selectedSeats]);

  const loadKartAvailability = async () => {
    try {
      const response = await apiCall(`/public/karts/${timeSlot.id}`);
      setKarts(response.karts);
    } catch (error) {
      console.error('Error loading karts:', error);
    }
  };

  const createHold = async () => {
    try {
      const response = await apiCall('/booking/hold', {
        method: 'POST',
        body: JSON.stringify({
          timeSlotId: timeSlot.id,
          seats: selectedSeats,
          sessionId,
        }),
      });
      
      setHoldExpiration(new Date(response.expiresAt));
    } catch (error) {
      console.error('Error creating hold:', error);
      // Reload kart availability in case of conflicts
      loadKartAvailability();
    }
  };

  const toggleSeat = (kartNumber: number) => {
    if (selectedSeats.includes(kartNumber)) {
      onSeatsSelect(selectedSeats.filter(seat => seat !== kartNumber));
    } else {
      if (selectedSeats.length < 8) {
        onSeatsSelect([...selectedSeats, kartNumber]);
      }
    }
  };

  const getKartButtonClass = (kart: KartStatus) => {
    if (kart.status === 'oos') {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    if (kart.status === 'booked') {
      return 'bg-red-200 text-red-700 cursor-not-allowed';
    }
    if (selectedSeats.includes(kart.number)) {
      return 'bg-blue-600 text-white ring-2 ring-blue-300';
    }
    if (kart.status === 'held') {
      return 'bg-yellow-200 text-yellow-800';
    }
    return 'bg-green-100 text-green-800 hover:bg-green-200';
  };

  if (plansLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Car className="h-12 w-12 text-red-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600">Cargando planes y karts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Car className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Elegí tu plan y tus karts
        </h3>
        <p className="text-gray-600">
          Seleccioná hasta 8 karts para tu grupo
        </p>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Método de pago:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: 'cash', label: 'Efectivo' },
            { value: 'transfer', label: 'Transferencia' },
            { value: 'mp', label: 'Mercado Pago' },
            { value: 'card', label: 'Tarjeta' },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => setPaymentMethod(method.value as any)}
              className={`p-2 text-sm rounded border transition-colors ${
                paymentMethod === method.value
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      {plans && (
        <div className="space-y-4">
          <h4 className="font-medium">Planes disponibles:</h4>
          <div className="grid gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onPlanSelect(plan)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-lg flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                      {plan.name}
                    </h5>
                    <p className="text-gray-600 text-sm mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {plan.currentPrice && formatCurrency(plan.currentPrice.amount / 100)}
                    </div>
                    <div className="text-xs text-gray-500">por kart</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kart Selection */}
      {selectedPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Elegí tus karts:</h4>
            <div className="text-sm text-gray-600">
              {selectedSeats.length}/8 seleccionados
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {karts.map((kart) => (
              <button
                key={kart.number}
                onClick={() => toggleSeat(kart.number)}
                disabled={kart.status === 'booked' || kart.status === 'oos'}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 relative
                  ${getKartButtonClass(kart)}
                `}
                title={kart.reason || ''}
              >
                <div className="text-center">
                  <Car className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-bold">Kart {kart.number}</div>
                  {selectedSeats.includes(kart.number) && (
                    <Check className="h-4 w-4 absolute top-1 right-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Fuera de servicio</span>
            </div>
          </div>
        </div>
      )}

      {/* Hold Timer */}
      {holdExpiration && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Karts reservados por 5 minutos. Completá tu reserva antes de que expire.
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      {selectedPlan && selectedSeats.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Total a pagar:</div>
              <div className="text-sm text-gray-600">
                {selectedSeats.length} kart(s) × {formatCurrency((selectedPlan.currentPrice?.amount || 0) / 100)}
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency((selectedPlan.currentPrice?.amount || 0) * selectedSeats.length / 100)}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            *Se requiere seña del 50% para confirmar la reserva
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanKartPicker;