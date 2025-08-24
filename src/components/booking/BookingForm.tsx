import React, { useState } from 'react';
import { CreditCard, User, Mail, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { Plan, TimeSlot, PaymentMethod, BookingFormData } from '../../types';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import Input from '../common/Input';
import Button from '../common/Button';

interface BookingFormProps {
  plan: Plan;
  seats: number[];
  timeSlot: TimeSlot;
  onSubmit: (formData: Omit<BookingFormData, 'branchId' | 'timeSlotId' | 'planId' | 'seats' | 'sessionId'>) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  plan,
  seats,
  timeSlot,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'cash' as PaymentMethod,
    ageWeightConfirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.ageWeightConfirmed) {
      newErrors.ageWeightConfirmed = 'Debes confirmar los requisitos de edad y peso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const unitPrice = plan.currentPrice?.amount || 0;
  const baseAmount = unitPrice * seats.length;
  const surcharge = (plan.currentPrice?.surchargePct || 0) * baseAmount / 100;
  const total = baseAmount + surcharge;
  const deposit = Math.round(total * 0.5); // 50% deposit

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Tus datos y pago de seña
        </h3>
        <p className="text-gray-600">
          Solo falta un paso para confirmar tu reserva
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Resumen de tu reserva:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Fecha:</span>
            <span className="font-medium">{formatDate(timeSlot.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Horario:</span>
            <span className="font-medium">{formatTime(timeSlot.startTime)}</span>
          </div>
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Karts:</span>
            <span className="font-medium">{seats.join(', ')}</span>
          </div>
          <div className="border-t pt-2 mt-3">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="text-lg">{formatCurrency(total / 100)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Seña (50%):</span>
              <span className="font-bold">{formatCurrency(deposit / 100)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo *"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            error={errors.customerName}
            placeholder="Tu nombre y apellido"
            icon={<User className="h-4 w-4" />}
          />

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="tu@email.com"
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <Input
          label="Teléfono *"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="11 1234 5678"
          icon={<Phone className="h-4 w-4" />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            placeholder="¿Alguna pregunta o pedido especial? (Opcional)"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de pago *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'cash', label: 'Efectivo', desc: 'Pagar en local' },
              { value: 'transfer', label: 'Transferencia', desc: 'Banco' },
              { value: 'mp', label: 'Mercado Pago', desc: 'Online' },
              { value: 'card', label: 'Tarjeta', desc: 'Débito/Crédito' },
            ].map((method) => (
              <label
                key={method.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.paymentMethod === method.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={formData.paymentMethod === method.value}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="sr-only"
                />
                <div className="text-sm font-medium">{method.label}</div>
                <div className="text-xs text-gray-500">{method.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Age/Weight Confirmation */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 mb-2">
                Requisitos obligatorios
              </h4>
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ageWeightConfirmed}
                  onChange={(e) => handleInputChange('ageWeightConfirmed', e.target.checked)}
                  className="mt-1 rounded border-yellow-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-yellow-800">
                  Confirmo que todos los pilotos tienen <strong>15 años o más</strong> y 
                  pesan <strong>110 kg o menos</strong>. Entiendo que estos requisitos 
                  son obligatorios por seguridad.
                </span>
              </label>
              {errors.ageWeightConfirmed && (
                <p className="text-sm text-red-600 mt-1">{errors.ageWeightConfirmed}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Warning */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Política de seña:</p>
              <p>
                La seña del 50% es <strong>obligatoria</strong> para confirmar tu reserva y 
                <strong> no se reintegra</strong> en caso de cancelación. 
                Podés reprogramar hasta 24 horas antes sin cargo adicional.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Procesando...' : `Confirmar Reserva - ${formatCurrency(deposit / 100)}`}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;