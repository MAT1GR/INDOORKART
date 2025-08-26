import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { UserCog, PlusCircle, Trash2 } from "lucide-react";

const UserForm: React.FC<{
  onClose: () => void;
  onSave: () => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiCall("/admin/users", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      alert("Usuario creado exitosamente.");
      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message || "Error al crear el usuario.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre Completo"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button type="submit">Crear Usuario</Button>
    </form>
  );
};

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const {
    data: users,
    loading,
    error,
    mutate,
  } = useApi<User[]>("/admin/users");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este usuario?")) {
      try {
        await apiCall(`/admin/users/${userId}`, { method: "DELETE" });
        alert("Usuario eliminado.");
        mutate();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el usuario.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">
            Creá, editá y eliminá usuarios del sistema.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        {loading ? (
          <div className="p-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            Error al cargar usuarios.
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === currentUser?.id}
                      title={
                        user.id === currentUser?.id
                          ? "No te podés eliminar a vos mismo"
                          : "Eliminar usuario"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Usuario"
      >
        <UserForm onClose={() => setIsModalOpen(false)} onSave={mutate} />
      </Modal>
    </div>
  );
};

export default AdminUsers;
