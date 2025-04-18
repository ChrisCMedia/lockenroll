import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

// Auth-Kontext erstellen
const AuthContext = createContext();

// Auth-Provider-Komponente
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beim ersten Rendern und Tokenänderung prüfen
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        setCurrentUser(response.data.user);
        setError(null);
      } catch (err) {
        // Bei ungültigem Token: Löschen und User zurücksetzen
        console.error('Token-Verifizierungsfehler:', err);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setError('Sitzung abgelaufen. Bitte erneut anmelden.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login-Funktion
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Anmeldung fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.'
      );
      return { 
        success: false, 
        message: err.response?.data?.message || 'Anmeldung fehlgeschlagen'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout-Funktion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Context-Werte
  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom-Hook für einfacheren Zugriff auf den Auth-Kontext
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 