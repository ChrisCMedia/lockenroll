const Appointment = require('../models/Appointment');
const fs = require('fs');
const path = require('path');

// Konfiguration laden
const getConfig = () => {
  try {
    const configPath = path.join(__dirname, '../config/appointments.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Fehler beim Laden der Terminplaner-Konfiguration:', error);
    return {
      businessHours: {},
      appointmentDuration: 30,
      breakTime: 15,
      services: [],
      staff: []
    };
  }
};

// Konfiguration speichern
const saveConfig = (config) => {
  try {
    const configPath = path.join(__dirname, '../config/appointments.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern der Terminplaner-Konfiguration:', error);
    return false;
  }
};

// Verfügbare Zeitfenster berechnen
const getAvailableTimeSlots = async (date, staffId = null) => {
  const config = getConfig();
  const dayOfWeek = new Date(date).getDay(); // 0 = Sonntag, 1 = Montag, usw.
  
  // Prüfen, ob der Salon an diesem Tag geöffnet ist
  const businessHours = config.businessHours[dayOfWeek.toString()];
  if (!businessHours || !businessHours.open) {
    return [];
  }
  
  // Öffnungszeiten in Minuten umrechnen (seit Mitternacht)
  const openTime = timeToMinutes(businessHours.start);
  const closeTime = timeToMinutes(businessHours.end);
  
  // Zeitfenster generieren (z.B. alle 30 Minuten)
  const slotDuration = config.appointmentDuration;
  const slots = [];
  
  for (let time = openTime; time < closeTime; time += slotDuration) {
    slots.push(minutesToTime(time));
  }
  
  // Bereits gebuchte Termine abrufen
  const appointments = await Appointment.find({
    date: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999)
    },
    ...(staffId && { 'staff.id': staffId }),
    status: 'confirmed'
  });
  
  // Zeiten filtern, die bereits belegt sind
  const availableSlots = slots.filter(slot => {
    const slotMinutes = timeToMinutes(slot);
    
    // Prüfen, ob der Zeitslot bereits belegt ist
    return !appointments.some(appointment => {
      const appointmentStart = timeToMinutes(appointment.startTime);
      const appointmentEnd = timeToMinutes(appointment.endTime);
      
      // Zeitslot überschneidet sich mit einem bestehenden Termin
      return (
        (slotMinutes >= appointmentStart && slotMinutes < appointmentEnd) ||
        (slotMinutes + slotDuration > appointmentStart && slotMinutes < appointmentEnd)
      );
    });
  });
  
  return availableSlots;
};

// Hilfsfunktion: Zeit in Minuten (seit Mitternacht) umrechnen
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Hilfsfunktion: Minuten (seit Mitternacht) in Zeit umrechnen
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Endzeit eines Termins berechnen
const calculateEndTime = (startTime, duration) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration;
  return minutesToTime(endMinutes);
};

// Nächste verfügbare Termine für einen Service
const getNextAvailableAppointments = async (serviceId, limit = 5) => {
  const config = getConfig();
  const service = config.services.find(s => s.id === serviceId);
  
  if (!service) {
    throw new Error('Dienstleistung nicht gefunden');
  }
  
  const result = [];
  let currentDate = new Date();
  
  // Bis zu 30 Tage in die Zukunft suchen
  for (let i = 0; i < 30 && result.length < limit; i++) {
    currentDate.setDate(currentDate.getDate() + (i === 0 ? 0 : 1));
    
    // Nach freien Zeitfenstern suchen
    const availableSlots = await getAvailableTimeSlots(currentDate);
    
    if (availableSlots.length > 0) {
      result.push({
        date: new Date(currentDate),
        slots: availableSlots
      });
    }
  }
  
  return result;
};

module.exports = {
  getConfig,
  saveConfig,
  getAvailableTimeSlots,
  calculateEndTime,
  getNextAvailableAppointments
}; 