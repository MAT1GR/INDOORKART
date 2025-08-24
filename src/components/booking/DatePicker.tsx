import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Branch } from '../../types';

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  branch: Branch;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  branch,
}) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if day is in the past or Monday (closed)
      const isDisabled = date < today || date.getDay() === 1;
      
      days.push({
        day,
        date: dateStr,
        isDisabled,
        isSelected: dateStr === selectedDate,
        isToday: dateStr === today.toISOString().split('T')[0],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Elegí el día de tu carrera
        </h3>
        <p className="text-gray-600">
          Abierto Martes a Domingo, 17:00 a 23:00
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h4 className="font-semibold text-lg">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <button
                    onClick={() => !day.isDisabled && onDateSelect(day.date)}
                    disabled={day.isDisabled}
                    className={`
                      w-full h-full p-2 text-sm rounded-lg transition-colors
                      ${day.isDisabled 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-900 hover:bg-red-50 hover:text-red-600'
                      }
                      ${day.isSelected 
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                        : ''
                      }
                      ${day.isToday && !day.isSelected 
                        ? 'bg-blue-100 text-blue-700' 
                        : ''
                      }
                    `}
                  >
                    {day.day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>❌ Cerrado los Lunes</p>
        <p>⏰ Horarios: Martes a Domingo 17:00 - 23:00</p>
      </div>
    </div>
  );
};

export default DatePicker;