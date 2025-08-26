import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Plan } from "../../types";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import Input from "../common/Input";
import { CreditCard, PlusCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { mutate } from "swr";

const PlanForm: React.FC<{
  plan?: Plan | null;
  onClose: () => void;
}> = ({ plan, onClose }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    qualyLaps: plan?.qualyLaps || 2,
    raceLaps: plan?.raceLaps || 10,
    active: plan?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiCall(plan?.id ? `/admin/plans/${plan.id}` : "/admin/plans", {
        method: plan?.id ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });
      mutate("/admin/plans");
      onClose();
    } catch (error) {
      alert("Error al guardar el plan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Plan"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        label="Descripción"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <Input
        label="Vueltas de Clasificación"
        type="number"
        value={formData.qualyLaps}
        onChange={(e) =>
          setFormData({ ...formData, qualyLaps: parseInt(e.target.value) })
        }
      />
      <Input
        label="Vueltas de Carrera"
        type="number"
        value={formData.raceLaps}
        onChange={(e) =>
          setFormData({ ...formData, raceLaps: parseInt(e.target.value) })
        }
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) =>
            setFormData({ ...formData, active: e.target.checked })
          }
        />
        <span>Activo</span>
      </label>
      <Button type="submit">Guardar Plan</Button>
    </form>
  );
};

const AdminPlans: React.FC = () => {
  const { data: plans, loading, error } = useApi<Plan[]>("/admin/plans");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleOpenModal = (plan?: Plan) => {
    setSelectedPlan(plan || null);
    setIsModalOpen(true);
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
        <Button onClick={() => handleOpenModal()}>
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
        <div className="space-y-4">
          {plans?.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <Button size="sm" onClick={() => handleOpenModal(plan)}>
                  Editar
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Precios:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {plan.prices?.map((price) => (
                    <div key={price.id} className="bg-gray-50 p-2 rounded">
                      <div className="capitalize text-sm">{price.method}</div>
                      <div className="font-bold">
                        {formatCurrency(price.amount / 100)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? "Editar Plan" : "Nuevo Plan"}
      >
        <PlanForm plan={selectedPlan} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminPlans;
