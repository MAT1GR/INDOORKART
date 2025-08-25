import React from "react";
import { useApi } from "../../hooks/useApi";
import { Settings } from "../../types"; // Assuming Settings is defined in types
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import { Settings as SettingsIcon } from "lucide-react";

// This is a new interface that should be added to `src/types/index.ts`
interface Setting {
  id: string;
  key: string;
  value: string;
}

const AdminSettings: React.FC = () => {
  // NOTE: This endpoint doesn't exist yet in the provided backend code.
  const {
    data: settings,
    loading,
    error,
  } = useApi<Setting[]>("/admin/settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">
          Ajustá los parámetros generales del sistema.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-600">
          Error al cargar la configuración (endpoint no implementado).
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          {settings?.map((setting) => (
            <div key={setting.id}>
              <Input
                label={setting.key.replace(/_/g, " ")}
                value={setting.value}
                disabled // Make this editable in a real implementation
              />
            </div>
          ))}
          <Button>Guardar Cambios</Button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
