import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import AppointmentBooking from './pages/AppointmentBooking';
import Location from './pages/Location';
import Imprint from './pages/Imprint';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminServices from './pages/admin/AdminServices';
import AdminStaff from './pages/admin/AdminStaff';
import AdminSettings from './pages/admin/AdminSettings';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Öffentliche Routen */}
              <Route path="/" element={<Home />} />
              <Route path="/leistungen" element={<Services />} />
              <Route path="/termin" element={<AppointmentBooking />} />
              <Route path="/anfahrt" element={<Location />} />
              <Route path="/impressum" element={<Imprint />} />
              <Route path="/datenschutz" element={<PrivacyPolicy />} />
              
              {/* Admin-Routen */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/termine" element={
                <ProtectedRoute>
                  <AdminAppointments />
                </ProtectedRoute>
              } />
              <Route path="/admin/leistungen" element={
                <ProtectedRoute>
                  <AdminServices />
                </ProtectedRoute>
              } />
              <Route path="/admin/mitarbeiter" element={
                <ProtectedRoute>
                  <AdminStaff />
                </ProtectedRoute>
              } />
              <Route path="/admin/einstellungen" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* 404-Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 