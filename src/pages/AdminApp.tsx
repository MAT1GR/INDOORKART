// mat1gr/indoorkart/INDOORKART-develop/src/pages/AdminApp.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Importa los nuevos componentes que crearemos
import AdminBookings from "../components/admin/AdminBookings";
import AdminBookingDetail from "../components/admin/AdminBookingDetail";
import AdminTimeslots from "../components/admin/AdminTimeslots";
import AdminKarts from "../components/admin/AdminKarts";
import AdminPlans from "../components/admin/AdminPlans";
import AdminUsers from "../components/admin/AdminUsers";
import AdminSettings from "../components/admin/AdminSettings";

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

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="bookings/:code" element={<AdminBookingDetail />} />
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
