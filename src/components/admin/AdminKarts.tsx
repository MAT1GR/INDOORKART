import React, { useState, useEffect } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Kart } from "../../types";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import { Car, Wrench, Tag } from "lucide-react";

const AdminKarts: React.FC = () => {
  const {
    data: karts,
    loading,
    error,
    manualFetch,
  } = useApi<Kart[]>("/admin/karts");
  const [editingKart, setEditingKart] = useState<Kart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (editingKart) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [editingKart]);

  const handleUpdateKart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKart) return;

    try {
      await apiCall(`/admin/karts/${editingKart.id}`, {
        method: "PATCH",
        body: JSON.stringify(editingKart),
      });
      manualFetch(); // Refrescar datos
      setEditingKart(null);
    } catch (error) {
      alert("Error al actualizar el kart.");
    }
  };

  const handleStatusChange = (field: keyof Kart, value: any) => {
    if (editingKart) {
      setEditingKart((prev) => (prev ? { ...prev, [field]: value } : null));
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
              className={`p-6 rounded-lg border flex flex-col justify-between ${
                kart.status === "ok"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">Kart {kart.number}</h3>
                  <Car
                    className={`h-8 w-8 ${
                      kart.status === "ok" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
                <p
                  className={`capitalize font-medium mb-2 ${
                    kart.status === "ok" ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {kart.status === "ok" ? "Operativo" : "Fuera de servicio"}
                </p>
                {kart.status === "oos" && kart.reason && (
                  <p className="text-xs text-red-700 bg-red-100 p-2 rounded-md">
                    <strong>Motivo:</strong> {kart.reason}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingKart(kart)}
                  className="w-full"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Editar Estado
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Kart Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setEditingKart(null)}
        title={`Editar Kart ${editingKart?.number}`}
      >
        {editingKart && (
          <form onSubmit={handleUpdateKart} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={editingKart.status}
                onChange={(e) => handleStatusChange("status", e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="ok">Operativo</option>
                <option value="oos">Fuera de servicio</option>
              </select>
            </div>

            {editingKart.status === "oos" && (
              <>
                <Input
                  label="Motivo"
                  value={editingKart.reason || ""}
                  onChange={(e) => handleStatusChange("reason", e.target.value)}
                  placeholder="Ej: Problema de motor"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Desde"
                    type="date"
                    value={editingKart.fromDate || ""}
                    onChange={(e) =>
                      handleStatusChange("fromDate", e.target.value)
                    }
                  />
                  <Input
                    label="Hasta"
                    type="date"
                    value={editingKart.toDate || ""}
                    onChange={(e) =>
                      handleStatusChange("toDate", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingKart(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminKarts;
