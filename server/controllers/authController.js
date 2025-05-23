const User = require('../models/User');
const { generateToken } = require('../utils/auth');

// Benutzer-Login - Optimiert für Vercel Serverless mit Fallback
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Überprüfen, ob MongoDB verbunden ist
    const isMongoConnected = User.db && User.db.readyState === 1;
    
    let user = null;
    let isMatch = false;
    
    if (isMongoConnected) {
      // MongoDB ist verfügbar - normale Anmeldung
      console.log('Login: Verwende MongoDB-Authentifizierung');
      
      // Performance-Optimierung: Nur benötigte Felder abfragen 
      user = await User.findOne(
        { username }, 
        { username: 1, password: 1, name: 1, role: 1, email: 1 }
      );
      
      if (user) {
        // Passwort prüfen
        isMatch = await user.comparePassword(password);
      }
    } else if (global.fallbackAuth && global.fallbackAuth.inMemoryAuth) {
      // Fallback auf In-Memory-Authentifizierung
      console.log('Login: Verwende Fallback-Authentifizierung (keine MongoDB-Verbindung)');
      
      const fallbackUser = global.fallbackAuth.inMemoryAuth.findUserByUsername(username);
      if (fallbackUser) {
        user = fallbackUser;
        isMatch = global.fallbackAuth.inMemoryAuth.comparePassword(username, password);
      }
    } else {
      // Keine Authentifizierungsmöglichkeit
      console.error('Login: Keine Authentifizierungsmethode verfügbar');
      return res.status(500).json({
        success: false,
        message: 'Serverfehler bei der Anmeldung: Keine Authentifizierungsmethode verfügbar'
      });
    }
    
    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Benutzername oder Passwort ist falsch'
      });
    }
    
    // Token generieren
    const token = generateToken(user._id);
    
    // Erfolgreiche Anmeldung
    res.json({
      success: true,
      message: isMongoConnected ? 'Anmeldung erfolgreich' : 'Anmeldung erfolgreich (Fallback-Modus)',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Anmeldung',
      error: error.message
    });
  }
};

// Benutzer registrieren (nur für Admin)
exports.register = async (req, res) => {
  try {
    // Überprüfen, ob MongoDB verbunden ist
    if (!User.db || User.db.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Funktion nicht verfügbar: Keine Datenbankverbindung'
      });
    }
    
    const { username, password, name, email, role } = req.body;
    
    // Prüfen, ob Benutzer bereits existiert
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Benutzername oder E-Mail ist bereits vergeben'
      });
    }
    
    // Neuen Benutzer erstellen
    const user = new User({
      username,
      password,
      name,
      email,
      role: role || 'staff'
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Benutzer erfolgreich erstellt',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Benutzerregistrierung',
      error: error.message
    });
  }
};

// Aktuellen Benutzer abrufen
exports.getCurrentUser = async (req, res) => {
  try {
    // User ist bereits in req.user durch die authenticate-Middleware
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Benutzers',
      error: error.message
    });
  }
};

// Benutzerliste abrufen (nur für Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Benutzer',
      error: error.message
    });
  }
};

// Benutzer aktualisieren
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const userId = req.params.id;
    
    // Benutzer finden
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }
    
    // Daten aktualisieren
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === 'admin') user.role = role;
    if (password) user.password = password;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Benutzer erfolgreich aktualisiert',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Benutzers',
      error: error.message
    });
  }
};

// Benutzer löschen (nur für Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Benutzer erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Benutzers',
      error: error.message
    });
  }
}; 