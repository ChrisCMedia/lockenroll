import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminSettings() {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    salonName: 'Lockenroll',
    address: 'Musterstraße 123, 10115 Berlin',
    phone: '030 12345678',
    email: 'info@lockenroll.de',
    openingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '20:00', isOpen: true },
      friday: { open: '09:00', close: '20:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    },
    maxAppointmentsPerDay: 20,
    appointmentTimeSlot: 30,
    notificationEmail: 'benachrichtigungen@lockenroll.de'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Simulierte Daten laden
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleOpeningHoursChange = (day, field, value) => {
    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day],
          [field]: field === 'isOpen' ? !settings.openingHours[day].isOpen : value
        }
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulierte API-Anfrage
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Erfolgsbenachrichtigung nach 3 Sekunden ausblenden
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>
        <div className="text-center py-8">
          <p>Daten werden geladen...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Einstellungen wurden erfolgreich gespeichert.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Allgemeine Einstellungen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="salonName">Salonname</label>
              <input
                type="text"
                id="salonName"
                name="salonName"
                value={settings.salonName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="address">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="phone">Telefon</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">E-Mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Öffnungszeiten</h2>
          
          <div className="grid gap-4 mb-6">
            {Object.entries(settings.openingHours).map(([day, hours]) => {
              // Umwandlung der englischen Wochentage in deutsche
              let dayLabel;
              switch (day) {
                case 'monday': dayLabel = 'Montag'; break;
                case 'tuesday': dayLabel = 'Dienstag'; break;
                case 'wednesday': dayLabel = 'Mittwoch'; break;
                case 'thursday': dayLabel = 'Donnerstag'; break;
                case 'friday': dayLabel = 'Freitag'; break;
                case 'saturday': dayLabel = 'Samstag'; break;
                case 'sunday': dayLabel = 'Sonntag'; break;
                default: dayLabel = day;
              }
              
              return (
                <div key={day} className="flex flex-wrap items-center">
                  <div className="w-full sm:w-32 mb-2 sm:mb-0">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={() => handleOpeningHoursChange(day, 'isOpen')}
                        className="mr-2"
                      />
                      <span className="font-medium">{dayLabel}</span>
                    </label>
                  </div>
                  
                  {hours.isOpen ? (
                    <div className="flex items-center space-x-2 ml-0 sm:ml-4">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                        className="px-2 py-1 border rounded-md"
                      />
                      <span>bis</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                        className="px-2 py-1 border rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-500 ml-0 sm:ml-4">Geschlossen</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Terminbuchung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="maxAppointmentsPerDay">
                Maximale Termine pro Tag
              </label>
              <input
                type="number"
                id="maxAppointmentsPerDay"
                name="maxAppointmentsPerDay"
                value={settings.maxAppointmentsPerDay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="appointmentTimeSlot">
                Zeitslot pro Termin (Min.)
              </label>
              <select
                id="appointmentTimeSlot"
                name="appointmentTimeSlot"
                value={settings.appointmentTimeSlot}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="15">15 Minuten</option>
                <option value="30">30 Minuten</option>
                <option value="45">45 Minuten</option>
                <option value="60">60 Minuten</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="notificationEmail">
                E-Mail für Benachrichtigungen
              </label>
              <input
                type="email"
                id="notificationEmail"
                name="notificationEmail"
                value={settings.notificationEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200"
            disabled={isSaving}
          >
            {isSaving ? 'Wird gespeichert...' : 'Einstellungen speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettings; 