import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Kart } from "../../types";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import { Car, Wrench } from "lucide-react";

const AdminKarts: React.FC = () => {
  const { data: karts, loading, error } = useApi<Kart[]>("/admin/karts");
  const [editingKart, setEditingKart] = useState<Kart | null>(null);

  const handleStatusChange = async (kart: Kart, status: "ok" | "oos") => {
    try {
      await apiCall(`/admin/karts/${kart.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      // Ideally, refetch karts
    } catch (error) {
      alert("Error al actualizar el estado del kart.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Karts</h1>
        <p className="text-gray-600">
          Administrá el estado y la disponibilidad de cada kart.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-12">
          Error al cargar los karts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {karts?.map((kart) => (
            <div
              key={kart.id}
              className={`p-6 rounded-lg border ${
                kart.status === "ok"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Kart {kart.number}</h3>
                <Car
                  className={`h-8 w-8 ${
                    kart.status === "ok" ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
              <p
                className={`capitalize font-medium ${
                  kart.status === "ok" ? "text-green-800" : "text-red-800"
                }`}
              >
                {kart.status === "ok" ? "Operativo" : "Fuera de servicio"}
              </p>
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(kart, "ok")}
                  disabled={kart.status === "ok"}
                >
                  Operativo
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleStatusChange(kart, "oos")}
                  disabled={kart.status === "oos"}
                >
                  Fuera de Servicio
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminKarts;
