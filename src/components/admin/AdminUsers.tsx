import React, { useState } from "react";
import { useApi, apiCall } from "../../hooks/useApi";
import { User } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";
import { UserCog, PlusCircle } from "lucide-react";

const AdminUsers: React.FC = () => {
  const {
    data: users,
    loading,
    error,
    manualFetch,
  } = useApi<User[]>("/admin/users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    active: true,
  });

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiCall("/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      manualFetch();
      setIsModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "staff",
        active: true,
      });
    } catch (err) {
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
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
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
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
        title="Nuevo Usuario"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <Input
            label="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="user-active"
              checked={newUser.active}
              onChange={(e) =>
                setNewUser({ ...newUser, active: e.target.checked })
              }
              className="h-4 w-4 text-red-600 border-gray-300 rounded"
            />
            <label
              htmlFor="user-active"
              className="ml-2 block text-sm text-gray-900"
            >
              Activo
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Usuario</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
