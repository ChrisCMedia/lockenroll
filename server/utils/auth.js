const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// JWT Token generieren - Optimiert für Vercel Serverless
const generateToken = (userId) => {
  // Kürzere Gültigkeitsdauer für schnellere Erstellung
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'lockenroll_secure_jwt_secret_2023',
    { expiresIn: '24h', algorithm: 'HS256' }
  );
};

// Middleware für Authentifizierung
const authenticate = async (req, res, next) => {
  try {
    // Token aus dem Header extrahieren
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Keine Authentifizierung gefunden'
      });
    }
    
    // Token überprüfen
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lockenroll_secure_jwt_secret_2023');
    
    // MongoDB-Verbindung prüfen
    const isMongoConnected = User.db && User.db.readyState === 1;
    
    // Benutzer finden - Entweder über MongoDB oder Fallback
    let user = null;
    
    if (isMongoConnected) {
      // Normaler Pfad - MongoDB Verbindung ist aktiv
      user = await User.findById(decoded.id);
    } else if (global.fallbackAuth) {
      // Fallback für direkten Zugriff ohne MongoDB
      const fallbackUser = global.fallbackAuth.inMemoryAuth.users.find(u => u._id === decoded.id);
      if (fallbackUser) {
        user = { ...fallbackUser }; // Kopieren, um Modifikationen zu vermeiden
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }
    
    // Benutzer zum Request hinzufügen
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentifizierung fehlgeschlagen',
      error: error.message
    });
  }
};

// Middleware für Admin-Rechte
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Zugriff verweigert. Admin-Rechte erforderlich.'
    });
  }
};

// Admin-Passwort-Hash vorab generieren, um Zeit in createInitialAdmin zu sparen
let adminPasswordHash = null;

// Initialen Admin-Benutzer erstellen - Optimiert für Vercel Serverless
const createInitialAdmin = async () => {
  try {
    // Prüfen ob MongoDB verbunden ist
    if (!User.db || User.db.readyState !== 1) {
      console.log('Überspringe Admin-Erstellung: Keine MongoDB-Verbindung');
      return;
    }
    
    // Prüfen ob Admin existiert mit effizienter Abfrage (nur ID zurückgeben)
    const adminExists = await User.findOne({ role: 'admin' }, { _id: 1 }).lean();
    
    if (!adminExists) {
      console.log('Erstelle Admin-Benutzer...');
      
      // Passwort nur einmal hashen, wenn möglich
      if (!adminPasswordHash) {
        const salt = await bcrypt.genSalt(8); // Reduziert von 10 auf 8 für schnellere Verarbeitung
        adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', salt);
      }
      
      // Admin-Benutzer mit bereits gehashtem Passwort erstellen
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: adminPasswordHash,
        name: 'Administrator',
        email: 'admin@lockenroll.de',
        role: 'admin'
      });
      
      console.log('Admin-Benutzer erstellt');
    } else {
      console.log('Admin-Benutzer existiert bereits');
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Benutzers:', error);
  }
};

module.exports = {
  generateToken,
  authenticate,
  isAdmin,
  createInitialAdmin
}; 