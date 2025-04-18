import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // Während der Authentifizierungsprüfung einen Ladeindikator anzeigen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Bei fehlender Authentifizierung zum Login umleiten
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Bei Admin-only-Routen prüfen, ob der Benutzer Admin ist
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Authentifizierter Benutzer kann die Route sehen
  return children;
};

export default ProtectedRoute; 