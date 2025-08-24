import React, { useEffect, useState } from 'react';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { TimeSlot, Branch } from '../../types';
import { formatTime, formatDate } from '../../utils/formatters';
import Button from '../common/Button';

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  branch: Branch;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
  branch,
}) => {
  const { data: timeSlots, loading, error } = useApi<TimeSlot[]>(
    `/public/timeslots?date=${selectedDate}&branchId=${branch.id}`
  );

  const getSlotStatus = (slot: TimeSlot) => {
    if (slot.available === 0) return 'full';
    if (slot.available <= 2) return 'almost-full';
    return 'available';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'full':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Completo</span>;
      case 'almost-full':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">¡Casi lleno!</span>;
      default:
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Disponible</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Clock className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando horarios disponibles...</p>
        </div>
      </div>
    );
  }

  if (error || !timeSlots) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar horarios</h3>
          <p className="text-gray-600">Intentá de nuevo en unos minutos.</p>
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sin horarios disponibles</h3>
          <p className="text-gray-600">
            No hay horarios disponibles para {formatDate(selectedDate)}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Estos horarios están disponibles
        </h3>
        <p className="text-gray-600">
          Para el {formatDate(selectedDate)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {timeSlots.map((slot) => {
          const status = getSlotStatus(slot);
          const isDisabled = status === 'full';
          const isSelected = selectedTimeSlot?.id === slot.id;

          return (
            <button
              key={slot.id}
              onClick={() => !isDisabled && onTimeSlotSelect(slot)}
              disabled={isDisabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected
                  ? 'border-red-500 bg-red-50 shadow-md'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-red-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-lg">
                  {formatTime(slot.startTime)}
                </div>
                {getStatusBadge(status)}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <Users className="h-4 w-4" />
                <span>{slot.available}/8 disponibles</span>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Duración: {slot.durationMin} min
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">¡Importante!</p>
            <ul className="space-y-1 text-xs">
              <li>• Llegá 15 minutos antes del horario</li>
              <li>• Los horarios se reservan con 30 min de anticipación mínima</li>
              <li>• Cada tanda incluye briefing de seguridad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;