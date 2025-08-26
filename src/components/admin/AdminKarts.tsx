import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Kart, Branch } from "../../types";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import { Car, Wrench, PlusCircle, Trash2 } from "lucide-react";

const AdminKarts: React.FC = () => {
  const { data: branch } = useApi<Branch>("/public/branch");
  const {
    data: karts,
    loading,
    error,
    mutate,
  } = useApi<Kart[]>(branch ? `/admin/karts?branchId=${branch.id}` : null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKartNumber, setNewKartNumber] = useState<number | undefined>();

  const handleStatusChange = async (kart: Kart, status: "ok" | "oos") => {
    try {
      await apiCall(`/admin/karts/${kart.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      mutate();
    } catch (error) {
      alert("Error al actualizar el estado del kart.");
    }
  };

  const handleAddKart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKartNumber || !branch) return;
    try {
      await apiCall("/admin/karts", {
        method: "POST",
        body: JSON.stringify({
          branchId: branch.id,
          number: newKartNumber,
        }),
      });
      mutate();
      setIsModalOpen(false);
      setNewKartNumber(undefined);
    } catch (error) {
      alert("Error al añadir el kart. Puede que el número ya exista.");
    }
  };

  const handleDeleteKart = async (kartId: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que querés eliminar este kart? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await apiCall(`/admin/karts/${kartId}`, {
          method: "DELETE",
        });
        alert("Kart eliminado exitosamente.");
        mutate();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el kart.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Karts</h1>
          <p className="text-gray-600">
            Administrá el estado y la disponibilidad de cada kart.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Agregar Kart
        </Button>
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
              className={`p-6 rounded-lg border relative ${
                kart.status === "ok"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <button
                onClick={() => handleDeleteKart(kart.id)}
                className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Nuevo Kart"
      >
        <form onSubmit={handleAddKart} className="space-y-4">
          <Input
            label="Número del Kart"
            type="number"
            value={newKartNumber || ""}
            onChange={(e) => setNewKartNumber(parseInt(e.target.value))}
            required
            placeholder="Ej: 9"
          />
          <Button type="submit">Agregar Kart</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminKarts;
