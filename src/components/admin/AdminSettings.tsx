import React, { useState, useEffect } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { Setting } from "../../types";
import Button from "../common/Button";
import Input from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import { Settings as SettingsIcon } from "lucide-react";

const AdminSettings: React.FC = () => {
  const { data, loading, error } = useApi<Setting[]>("/admin/settings");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  const handleInputChange = (key: string, value: string) => {
    setSettings((currentSettings) =>
      currentSettings.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await apiCall("/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      alert("Configuración guardada exitosamente");
    } catch (err) {
      alert("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingLabel = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
        <div className="bg-white p-8 rounded-lg border space-y-6">
          {settings.map((setting) => (
            <div key={setting.id}>
              <Input
                label={getSettingLabel(setting.key)}
                value={setting.value}
                onChange={(e) => handleInputChange(setting.key, e.target.value)}
              />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} loading={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
