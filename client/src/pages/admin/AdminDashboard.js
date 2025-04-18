import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalServices: 0,
    totalStaff: 0
  });

  // Simulierte Daten laden
  useEffect(() => {
    // In einer echten App würden diese Daten von einer API geladen
    setStats({
      totalAppointments: 125,
      upcomingAppointments: 18,
      totalServices: 12,
      totalStaff: 5
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Willkommen zurück, {user?.name || 'Administrator'}!</h2>
        <p className="text-gray-600">
          Hier finden Sie einen Überblick über Ihren Friseursalon und können alle Einstellungen verwalten.
        </p>
      </div>
      
      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 font-medium mb-2">Termine gesamt</h3>
          <p className="text-3xl font-bold">{stats.totalAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 font-medium mb-2">Anstehende Termine</h3>
          <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 font-medium mb-2">Angebotene Leistungen</h3>
          <p className="text-3xl font-bold">{stats.totalServices}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 font-medium mb-2">Mitarbeiter</h3>
          <p className="text-3xl font-bold">{stats.totalStaff}</p>
        </div>
      </div>
      
      {/* Schnellzugriff-Karten */}
      <h2 className="text-2xl font-semibold mb-4">Schnellzugriff</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Termine verwalten</h3>
          <p className="text-gray-600 mb-4">
            Sehen und bearbeiten Sie alle Termine, bestätigen oder stornieren Sie Buchungen.
          </p>
          <Link 
            to="/admin/termine" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Zu den Terminen
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Leistungen verwalten</h3>
          <p className="text-gray-600 mb-4">
            Fügen Sie neue Leistungen hinzu, bearbeiten oder entfernen Sie vorhandene Angebote.
          </p>
          <Link 
            to="/admin/leistungen" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Zu den Leistungen
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Mitarbeiter verwalten</h3>
          <p className="text-gray-600 mb-4">
            Verwalten Sie Ihre Mitarbeiter, deren Arbeitszeiten und Spezialisierungen.
          </p>
          <Link 
            to="/admin/mitarbeiter" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Zu den Mitarbeitern
          </Link>
        </div>
      </div>
      
      {/* Letzte Aktivitäten - Beispieldaten */}
      <h2 className="text-2xl font-semibold mb-4">Letzte Aktivitäten</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Datum</th>
              <th className="px-4 py-2 text-left">Aktivität</th>
              <th className="px-4 py-2 text-left">Benutzer</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">16.05.2023, 15:30</td>
              <td className="px-4 py-2">Neuer Termin erstellt</td>
              <td className="px-4 py-2">Maria Schmidt</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">16.05.2023, 14:45</td>
              <td className="px-4 py-2">Leistung bearbeitet</td>
              <td className="px-4 py-2">Admin</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">16.05.2023, 12:30</td>
              <td className="px-4 py-2">Termin bestätigt</td>
              <td className="px-4 py-2">Thomas Weber</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">16.05.2023, 10:15</td>
              <td className="px-4 py-2">Neuer Mitarbeiter angelegt</td>
              <td className="px-4 py-2">Admin</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">15.05.2023, 18:20</td>
              <td className="px-4 py-2">Termin storniert</td>
              <td className="px-4 py-2">Julia Meyer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard; 