const Appointment = require('../models/Appointment');
const { getAvailableTimeSlots, calculateEndTime, getConfig } = require('../utils/appointments');
const { sendEmail, templates } = require('../utils/email');

// Neuen Termin erstellen
exports.createAppointment = async (req, res) => {
  try {
    const { 
      customer, 
      serviceId, 
      staffId, 
      date, 
      startTime, 
      notes 
    } = req.body;
    
    // Konfiguration laden
    const config = getConfig();
    
    // Service finden
    const service = config.services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Dienstleistung nicht gefunden'
      });
    }
    
    // Mitarbeiter finden
    const staff = config.staff.find(s => s.id === staffId);
    if (!staff) {
      return res.status(400).json({
        success: false,
        message: 'Mitarbeiter nicht gefunden'
      });
    }
    
    // Endzeit berechnen
    const endTime = calculateEndTime(startTime, service.duration);
    
    // Verfügbare Zeiten prüfen
    const availableSlots = await getAvailableTimeSlots(date, staffId);
    if (!availableSlots.includes(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Der gewählte Zeitpunkt ist nicht verfügbar'
      });
    }
    
    // Neuen Termin erstellen
    const appointment = new Appointment({
      customer,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration
      },
      staff: {
        id: staff.id,
        name: staff.name
      },
      date: new Date(date),
      startTime,
      endTime,
      notes,
      status: 'confirmed'
    });
    
    await appointment.save();
    
    // E-Mail-Bestätigung senden
    const emailTemplate = templates.appointmentConfirmation(appointment);
    await sendEmail({
      to: customer.email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html
    });
    
    res.status(201).json({
      success: true,
      message: 'Termin erfolgreich erstellt',
      appointment
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Termins:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Erstellen des Termins',
      error: error.message
    });
  }
};

// Alle Termine abrufen (für Admin/Staff)
exports.getAppointments = async (req, res) => {
  try {
    const { date, status, staffId } = req.query;
    
    // Filter aufbauen
    const filter = {};
    
    if (date) {
      const queryDate = new Date(date);
      filter.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (staffId) {
      filter['staff.id'] = staffId;
    }
    
    // Termine abrufen
    const appointments = await Appointment.find(filter).sort({ date: 1, startTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Termine:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Termine',
      error: error.message
    });
  }
};

// Termin Details abrufen
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Termins:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Termins',
      error: error.message
    });
  }
};

// Termin aktualisieren
exports.updateAppointment = async (req, res) => {
  try {
    const { 
      customer, 
      serviceId, 
      staffId, 
      date, 
      startTime, 
      notes,
      status 
    } = req.body;
    
    // Termin finden
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    // Konfiguration laden
    const config = getConfig();
    
    // Daten aktualisieren
    if (customer) {
      appointment.customer = {
        ...appointment.customer,
        ...customer
      };
    }
    
    if (serviceId) {
      const service = config.services.find(s => s.id === serviceId);
      if (!service) {
        return res.status(400).json({
          success: false,
          message: 'Dienstleistung nicht gefunden'
        });
      }
      
      appointment.service = {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration
      };
    }
    
    if (staffId) {
      const staff = config.staff.find(s => s.id === staffId);
      if (!staff) {
        return res.status(400).json({
          success: false,
          message: 'Mitarbeiter nicht gefunden'
        });
      }
      
      appointment.staff = {
        id: staff.id,
        name: staff.name
      };
    }
    
    if (date) appointment.date = new Date(date);
    if (startTime) {
      appointment.startTime = startTime;
      appointment.endTime = calculateEndTime(
        startTime, 
        appointment.service.duration
      );
    }
    
    if (notes) appointment.notes = notes;
    if (status) appointment.status = status;
    
    appointment.updatedAt = Date.now();
    
    await appointment.save();
    
    res.json({
      success: true,
      message: 'Termin erfolgreich aktualisiert',
      appointment
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Termins:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Termins',
      error: error.message
    });
  }
};

// Termin löschen
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Termin erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Termins:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Termins',
      error: error.message
    });
  }
};

// Verfügbare Zeitfenster abrufen
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, staffId } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Datum ist erforderlich'
      });
    }
    
    const availableSlots = await getAvailableTimeSlots(date, staffId);
    
    res.json({
      success: true,
      date,
      availableSlots
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der verfügbaren Zeitfenster:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der verfügbaren Zeitfenster',
      error: error.message
    });
  }
}; 