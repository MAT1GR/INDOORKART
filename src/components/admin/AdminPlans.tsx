import React from "react";
import { useApi } from "../../hooks/useApi";
import { Plan } from "../../types";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import { CreditCard, PlusCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const AdminPlans: React.FC = () => {
  const { data: plans, loading, error } = useApi<Plan[]>("/admin/plans");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes y Precios</h1>
          <p className="text-gray-600">
            Gestioná los diferentes planes de carrera y sus precios.
          </p>
        </div>
        <Button>
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
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-600">{plan.description}</p>
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
    </div>
  );
};

export default AdminPlans;
