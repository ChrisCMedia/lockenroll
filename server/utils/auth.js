const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// JWT Token generieren
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Benutzer finden
    const user = await User.findById(decoded.id);
    
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

// Initialen Admin-Benutzer erstellen
const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin',
        name: 'Administrator',
        email: 'admin@lockenroll.de',
        role: 'admin'
      });
      console.log('Admin-Benutzer erstellt');
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