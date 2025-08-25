import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { TimeSlot } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import { Calendar, Clock, PlusCircle } from "lucide-react";

const AdminTimeslots: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const {
    data: timeSlots,
    loading,
    error,
  } = useApi<TimeSlot[]>(`/admin/timeslots?date=${selectedDate}`);

  const handleGenerateSlots = async () => {
    const startDate = prompt(
      "Ingresá la fecha de inicio (YYYY-MM-DD):",
      selectedDate
    );
    const endDate = prompt(
      "Ingresá la fecha de fin (YYYY-MM-DD):",
      startDate || selectedDate
    );

    if (startDate && endDate) {
      try {
        const response = await apiCall("/admin/timeslots/generate", {
          method: "POST",
          body: JSON.stringify({
            branchId: "clxk6w5h20000v55gt9f8ae3g", // Hardcoded branchId for simplicity
            startDate,
            endDate,
          }),
        });
        alert(response.message);
        // Ideally, we would refetch the timeslots here.
      } catch (error) {
        alert("Error al generar los horarios.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Horarios
          </h1>
          <p className="text-gray-600">
            Visualizá y generá nuevos horarios de carrera.
          </p>
        </div>
        <Button onClick={handleGenerateSlots}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Generar Horarios
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg border">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {timeSlots?.map((slot) => (
            <div key={slot.id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="font-bold text-lg">{slot.startTime}</div>
              <div className="text-sm text-gray-600">
                Disponibles: {slot.available}/{slot.capacity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTimeslots;
