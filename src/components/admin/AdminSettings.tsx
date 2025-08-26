import React, { useState, useEffect } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import { Settings as SettingsIcon } from "lucide-react";
import { mutate } from "swr";

interface Setting {
  id: string;
  key: string;
  value: string;
}

const AdminSettings: React.FC = () => {
  const {
    data: settings,
    loading,
    error,
  } = useApi<Setting[]>("/admin/settings");
  const [localSettings, setLocalSettings] = useState<Setting[]>([]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSaveChanges = async () => {
    try {
      await apiCall("/admin/settings", {
        method: "POST",
        body: JSON.stringify(localSettings),
      });
      alert("Configuración guardada exitosamente");
      mutate("/admin/settings");
    } catch (error) {
      alert("Error al guardar la configuración.");
    }
  };

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
          Error al cargar la configuración.
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          {localSettings?.map((setting) => (
            <div key={setting.id}>
              <Input
                label={setting.key.replace(/_/g, " ")}
                value={setting.value}
                onChange={(e) =>
                  handleSettingChange(setting.key, e.target.value)
                }
              />
            </div>
          ))}
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
