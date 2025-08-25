// mat1gr/indoorkart/INDOORKART-develop/src/pages/AdminApp.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Importa los nuevos componentes que crearemos
// import AdminBookings from '../components/admin/AdminBookings';
// import AdminTimeslots from '../components/admin/AdminTimeslots';
// import AdminKarts from '../components/admin/AdminKarts';
// import AdminPlans from '../components/admin/AdminPlans';
// import AdminUsers from '../components/admin/AdminUsers';
// import AdminSettings from '../components/admin/AdminSettings';

const AdminApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  // Placeholder para los componentes que aún no existen.
  const AdminBookings = () => <div>Gestión de Reservas (próximamente)</div>;
  const AdminTimeslots = () => <div>Gestión de Horarios (próximamente)</div>;
  const AdminKarts = () => <div>Gestión de Karts (próximamente)</div>;
  const AdminPlans = () => <div>Gestión de Planes (próximamente)</div>;
  const AdminUsers = () => <div>Gestión de Usuarios (próximamente)</div>;
  const AdminSettings = () => (
    <div>Gestión de Configuración (próximamente)</div>
  );

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="timeslots" element={<AdminTimeslots />} />
        <Route path="karts" element={<AdminKarts />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
