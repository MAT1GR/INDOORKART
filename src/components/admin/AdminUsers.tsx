import React from "react";
import { useApi } from "../../hooks/useApi";
import { User } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import { UserCog } from "lucide-react";

const AdminUsers: React.FC = () => {
  const { data: users, loading, error } = useApi<User[]>("/admin/users");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Visualizá los usuarios con acceso al panel.
        </p>
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
                    {user.active ? "Activo" : "Inactivo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
