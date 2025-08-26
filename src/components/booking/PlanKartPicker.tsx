import React, { useState, useEffect } from "react";
import { Trophy, Users, Check } from "lucide-react";
import { useApi, apiCall } from "../../hooks/useApi";
import { TimeSlot, Plan, KartStatus } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import Button from "../common/Button";

// Icono de Go-Kart
const KartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.71 11.29l-2.43-2.43a1 1 0 00-.71-.29H13V7a1 1 0 00-2 0v2H7.41a1 1 0 00-.71.29L4.29 11.29a1 1 0 000 1.41l2.43 2.43a1 1 0 00.71.29H11v2a1 1 0 002 0v-2h3.59a1 1 0 00.71-.29l2.43-2.43a1 1 0 000-1.41zM8.83 13L7 11.17 8.17 10h2.66v3H8.83zM14 13v-3h2.66L15.17 11.17 14 12.34V13z" />
    <circle cx="6.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
  </svg>
);

interface PlanKartPickerProps {
  timeSlot: TimeSlot;
  selectedPlan: Plan | null;
  selectedKarts: number[];
  onPlanSelect: (plan: Plan) => void;
  onKartsSelect: (karts: number[]) => void;
  sessionId: string;
}

const PlanKartPicker: React.FC<PlanKartPickerProps> = ({
  timeSlot,
  selectedPlan,
  selectedKarts,
  onPlanSelect,
  onKartsSelect,
  sessionId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "transfer" | "mp" | "card"
  >("cash");
  const [karts, setKarts] = useState<KartStatus[]>([]);
  const [holdExpiration, setHoldExpiration] = useState<Date | null>(null);

  useApi<Plan[]>(
    `/public/plans?method=${paymentMethod}`
  );

  useEffect(() => {
    if (timeSlot) {
      loadKartAvailability();
    }
  }, [timeSlot]);

  useEffect(() => {
    if (selectedKarts.length > 0) {
      createHold();
    }
  }, [selectedKarts]);

  const loadKartAvailability = async () => {
    try {
      const response = await apiCall(`/public/karts/${timeSlot.id}`);
      setKarts(response.karts);
    } catch (error) {
      console.error("Error loading karts:", error);
    }
  };

  const createHold = async () => {
    try {
      const response = await apiCall("/booking/hold", {
        method: "POST",
        body: JSON.stringify({
          timeSlotId: timeSlot.id,
          seats: selectedKarts,
          sessionId,
        }),
      });

      setHoldExpiration(new Date(response.expiresAt));
    } catch (error) {
      console.error("Error creating hold:", error);
      loadKartAvailability();
    }
  };

  const toggleKart = (kartNumber: number) => {
    if (selectedKarts.includes(kartNumber)) {
      onKartsSelect(selectedKarts.filter((k) => k !== kartNumber));
    } else {
      onKartsSelect([...selectedKarts, kartNumber]);
    }
  };

  const getKartButtonClass = (kart: KartStatus) => {
    const isSelected = selectedKarts.includes(kart.number);
    if (isSelected) return "bg-blue-600 text-white ring-2 ring-blue-300";
    if (kart.status === "oos")
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    if (kart.status === "booked")
      return "bg-red-200 text-red-700 cursor-not-allowed";
    if (kart.status === "held")
      return "bg-yellow-200 text-yellow-800 cursor-not-allowed";
    return "bg-green-100 text-green-800 hover:bg-green-200";
  };

  return (
    <div className="space-y-6">
      {/* ... (Plan selection remains the same) ... */}
      {selectedPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Elegí tus karts:</h4>
            <div className="text-sm text-gray-600">
              {selectedKarts.length}/8 seleccionados
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {karts.map((kart) => (
              <button
                key={kart.number}
                onClick={() => toggleKart(kart.number)}
                disabled={
                  kart.status !== "available" &&
                  !selectedKarts.includes(kart.number)
                }
                className={`p-4 rounded-lg border-2 transition-all duration-200 relative ${getKartButtonClass(
                  kart
                )}`}
                title={kart.reason || ""}
              >
                <div className="text-center">
                  <KartIcon className="h-8 w-8 mx-auto mb-1" />
                  <div className="font-bold">Kart {kart.number}</div>
                  {selectedKarts.includes(kart.number) && (
                    <Check className="h-4 w-4 absolute top-1 right-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {/* ... (Legend remains the same) ... */}
        </div>
      )}
    </div>
  );
};
export default PlanKartPicker;
