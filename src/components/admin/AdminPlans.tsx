import React, { useState, useEffect } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Plan, PlanPrice } from "../../types";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import Input from "../common/Input";
import { CreditCard, PlusCircle, Tag, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const AdminPlans: React.FC = () => {
  const {
    data: plans,
    loading,
    error,
    manualFetch,
  } = useApi<Plan[]>("/admin/plans");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
  const [editingPrice, setEditingPrice] = useState<Partial<PlanPrice> | null>(
    null
  );

  const openPlanModal = (plan: Partial<Plan> | null = null) => {
    setEditingPlan(plan || {});
    setIsPlanModalOpen(true);
  };

  const openPriceModal = (
    planId: string,
    price: Partial<PlanPrice> | null = null
  ) => {
    setEditingPrice(
      price
        ? { ...price, amount: price.amount! / 100 }
        : {
            planId,
            method: "cash",
            amount: 0,
            validFrom: new Date().toISOString().split("T")[0],
          }
    );
    setIsPriceModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await apiCall("/admin/plans", {
        method: "POST",
        body: JSON.stringify(editingPlan),
      });
      manualFetch();
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    } catch (error) {
      alert("Error al guardar el plan");
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice || !editingPrice.planId) return;

    const priceData = {
      ...editingPrice,
      amount: Math.round(Number(editingPrice.amount) * 100), // Convert to cents
    };

    try {
      await apiCall(`/admin/plans/${editingPrice.planId}/prices`, {
        method: "POST",
        body: JSON.stringify(priceData),
      });
      manualFetch();
      setIsPriceModalOpen(false);
      setEditingPrice(null);
    } catch (error) {
      alert("Error al guardar el precio");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes y Precios</h1>
          <p className="text-gray-600">
            Gestioná los diferentes planes de carrera y sus precios.
          </p>
        </div>
        <Button onClick={() => openPlanModal()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-12">
          Error al cargar los planes.
        </div>
      ) : (
        <div className="space-y-6">
          {plans?.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>Qualy: {plan.qualyLaps} vueltas</span> |{" "}
                    <span>Carrera: {plan.raceLaps} vueltas</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openPlanModal(plan)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar Plan
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Precios Activos:</h4>
                  <Button size="sm" onClick={() => openPriceModal(plan.id)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Nuevo Precio
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {plan.prices
                    ?.filter((p) => p.active)
                    .map((price) => (
                      <div
                        key={price.id}
                        className="bg-gray-50 p-3 rounded-lg border"
                      >
                        <div className="capitalize text-sm font-bold">
                          {price.method}
                        </div>
                        <div className="font-bold text-lg text-red-600">
                          {formatCurrency(price.amount / 100)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Desde:{" "}
                          {new Date(price.validFrom).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan?.id ? "Editar Plan" : "Nuevo Plan"}
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <Input
            label="Nombre del Plan"
            value={editingPlan?.name || ""}
            onChange={(e) =>
              setEditingPlan({ ...editingPlan, name: e.target.value })
            }
            required
          />
          <Input
            label="Descripción"
            value={editingPlan?.description || ""}
            onChange={(e) =>
              setEditingPlan({ ...editingPlan, description: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vueltas Qualy"
              type="number"
              value={editingPlan?.qualyLaps || 0}
              onChange={(e) =>
                setEditingPlan({
                  ...editingPlan,
                  qualyLaps: Number(e.target.value),
                })
              }
              required
            />
            <Input
              label="Vueltas Carrera"
              type="number"
              value={editingPlan?.raceLaps || 0}
              onChange={(e) =>
                setEditingPlan({
                  ...editingPlan,
                  raceLaps: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="plan-active"
              checked={editingPlan?.active ?? true}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, active: e.target.checked })
              }
              className="h-4 w-4 text-red-600 border-gray-300 rounded"
            />
            <label
              htmlFor="plan-active"
              className="ml-2 block text-sm text-gray-900"
            >
              Activo
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPlanModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Plan</Button>
          </div>
        </form>
      </Modal>

      {/* Price Modal */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Gestionar Precio"
      >
        <form onSubmit={handleSavePrice} className="space-y-4">
          <Input
            label="Monto (en pesos)"
            type="number"
            step="0.01"
            value={editingPrice?.amount || ""}
            onChange={(e) =>
              setEditingPrice({
                ...editingPrice,
                amount: Number(e.target.value),
              })
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={editingPrice?.method || ""}
              onChange={(e) =>
                setEditingPrice({
                  ...editingPrice,
                  method: e.target.value as any,
                })
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="mp">Mercado Pago</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <Input
            label="Recargo % (opcional)"
            type="number"
            value={editingPrice?.surchargePct || 0}
            onChange={(e) =>
              setEditingPrice({
                ...editingPrice,
                surchargePct: Number(e.target.value),
              })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Válido Desde"
              type="date"
              value={editingPrice?.validFrom?.toString().split("T")[0] || ""}
              onChange={(e) =>
                setEditingPrice({ ...editingPrice, validFrom: e.target.value })
              }
              required
            />
            <Input
              label="Válido Hasta (opcional)"
              type="date"
              value={editingPrice?.validTo?.toString().split("T")[0] || ""}
              onChange={(e) =>
                setEditingPrice({ ...editingPrice, validTo: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPriceModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Precio</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPlans;
