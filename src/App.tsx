import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import PublicApp from "./pages/PublicApp";
import AdminApp from "./pages/AdminApp";
import MyBooking from "./pages/MyBooking";
import FloatingWhatsApp from "./components/common/FloatingWhatsApp";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<PublicApp />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/mi-reserva" element={<MyBooking />} />
            </Routes>
            <FloatingWhatsApp />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
