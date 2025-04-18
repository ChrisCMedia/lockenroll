const { getConfig, saveConfig } = require('../utils/appointments');

// Gesamte Konfiguration abrufen
exports.getConfig = (req, res) => {
  try {
    const config = getConfig();
    
    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Konfiguration:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Konfiguration',
      error: error.message
    });
  }
};

// Konfiguration aktualisieren (nur für Admin)
exports.updateConfig = (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Keine Konfigurationsdaten gefunden'
      });
    }
    
    // Konfiguration validieren und speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern der Konfiguration'
      });
    }
    
    res.json({
      success: true,
      message: 'Konfiguration erfolgreich aktualisiert',
      config
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Konfiguration:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Konfiguration',
      error: error.message
    });
  }
};

// Öffnungszeiten abrufen
exports.getBusinessHours = (req, res) => {
  try {
    const config = getConfig();
    const businessHours = config.businessHours || {};
    
    res.json({
      success: true,
      businessHours
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Öffnungszeiten:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Öffnungszeiten',
      error: error.message
    });
  }
};

// Öffnungszeiten aktualisieren
exports.updateBusinessHours = (req, res) => {
  try {
    const { businessHours } = req.body;
    
    if (!businessHours) {
      return res.status(400).json({
        success: false,
        message: 'Keine Öffnungszeiten gefunden'
      });
    }
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Öffnungszeiten aktualisieren
    config.businessHours = businessHours;
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern der Öffnungszeiten'
      });
    }
    
    res.json({
      success: true,
      message: 'Öffnungszeiten erfolgreich aktualisiert',
      businessHours
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Öffnungszeiten:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Öffnungszeiten',
      error: error.message
    });
  }
};

// Dienstleistungen abrufen
exports.getServices = (req, res) => {
  try {
    const config = getConfig();
    const services = config.services || [];
    
    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Dienstleistungen:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Dienstleistungen',
      error: error.message
    });
  }
};

// Dienstleistung hinzufügen
exports.addService = (req, res) => {
  try {
    const service = req.body;
    
    if (!service || !service.id || !service.name || !service.price) {
      return res.status(400).json({
        success: false,
        message: 'Unvollständige Dienstleistungsdaten'
      });
    }
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Prüfen, ob ID bereits existiert
    if (config.services.some(s => s.id === service.id)) {
      return res.status(400).json({
        success: false,
        message: 'Eine Dienstleistung mit dieser ID existiert bereits'
      });
    }
    
    // Dienstleistung hinzufügen
    config.services.push(service);
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern der Dienstleistung'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Dienstleistung erfolgreich hinzugefügt',
      service
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Dienstleistung:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hinzufügen der Dienstleistung',
      error: error.message
    });
  }
};

// Dienstleistung aktualisieren
exports.updateService = (req, res) => {
  try {
    const serviceId = req.params.id;
    const updatedService = req.body;
    
    if (!updatedService) {
      return res.status(400).json({
        success: false,
        message: 'Keine Dienstleistungsdaten gefunden'
      });
    }
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Dienstleistung suchen
    const serviceIndex = config.services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Dienstleistung nicht gefunden'
      });
    }
    
    // Dienstleistung aktualisieren (ID beibehalten)
    config.services[serviceIndex] = {
      ...updatedService,
      id: serviceId
    };
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern der Dienstleistung'
      });
    }
    
    res.json({
      success: true,
      message: 'Dienstleistung erfolgreich aktualisiert',
      service: config.services[serviceIndex]
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Dienstleistung:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Dienstleistung',
      error: error.message
    });
  }
};

// Dienstleistung löschen
exports.deleteService = (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Prüfen, ob Dienstleistung existiert
    const serviceIndex = config.services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Dienstleistung nicht gefunden'
      });
    }
    
    // Dienstleistung entfernen
    config.services.splice(serviceIndex, 1);
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Löschen der Dienstleistung'
      });
    }
    
    res.json({
      success: true,
      message: 'Dienstleistung erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Dienstleistung:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen der Dienstleistung',
      error: error.message
    });
  }
};

// Mitarbeiter abrufen
exports.getStaff = (req, res) => {
  try {
    const config = getConfig();
    const staff = config.staff || [];
    
    res.json({
      success: true,
      staff
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Mitarbeiter:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Mitarbeiter',
      error: error.message
    });
  }
};

// Mitarbeiter hinzufügen
exports.addStaffMember = (req, res) => {
  try {
    const staffMember = req.body;
    
    if (!staffMember || !staffMember.id || !staffMember.name) {
      return res.status(400).json({
        success: false,
        message: 'Unvollständige Mitarbeiterdaten'
      });
    }
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Prüfen, ob ID bereits existiert
    if (config.staff.some(s => s.id === staffMember.id)) {
      return res.status(400).json({
        success: false,
        message: 'Ein Mitarbeiter mit dieser ID existiert bereits'
      });
    }
    
    // Mitarbeiter hinzufügen
    config.staff.push(staffMember);
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern des Mitarbeiters'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Mitarbeiter erfolgreich hinzugefügt',
      staffMember
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hinzufügen des Mitarbeiters',
      error: error.message
    });
  }
};

// Mitarbeiter aktualisieren
exports.updateStaffMember = (req, res) => {
  try {
    const staffId = req.params.id;
    const updatedStaff = req.body;
    
    if (!updatedStaff) {
      return res.status(400).json({
        success: false,
        message: 'Keine Mitarbeiterdaten gefunden'
      });
    }
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Mitarbeiter suchen
    const staffIndex = config.staff.findIndex(s => s.id === staffId);
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Mitarbeiter nicht gefunden'
      });
    }
    
    // Mitarbeiter aktualisieren (ID beibehalten)
    config.staff[staffIndex] = {
      ...updatedStaff,
      id: staffId
    };
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern des Mitarbeiters'
      });
    }
    
    res.json({
      success: true,
      message: 'Mitarbeiter erfolgreich aktualisiert',
      staffMember: config.staff[staffIndex]
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Mitarbeiters:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Mitarbeiters',
      error: error.message
    });
  }
};

// Mitarbeiter löschen
exports.deleteStaffMember = (req, res) => {
  try {
    const staffId = req.params.id;
    
    // Aktuelle Konfiguration laden
    const config = getConfig();
    
    // Prüfen, ob Mitarbeiter existiert
    const staffIndex = config.staff.findIndex(s => s.id === staffId);
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Mitarbeiter nicht gefunden'
      });
    }
    
    // Mitarbeiter entfernen
    config.staff.splice(staffIndex, 1);
    
    // Konfiguration speichern
    const result = saveConfig(config);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Löschen des Mitarbeiters'
      });
    }
    
    res.json({
      success: true,
      message: 'Mitarbeiter erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Mitarbeiters:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Mitarbeiters',
      error: error.message
    });
  }
}; 