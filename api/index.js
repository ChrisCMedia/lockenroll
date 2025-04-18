// Serverless function für Vercel
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Pfade anpassen für die neue Verzeichnisstruktur
const authRoutes = require('../server/routes/authRoutes');
const appointmentRoutes = require('../server/routes/appointmentRoutes');
const configRoutes = require('../server/routes/configRoutes');
const contactRoutes = require('../server/routes/contactRoutes');

// Auth-Hilfsfunktionen importieren
const { createInitialAdmin } = require('../server/utils/auth');

// Umgebungsvariablen laden
dotenv.config();

// Express-App initialisieren
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-Memory Datenbank für einfache Authentifizierung
// Diese wird verwendet, wenn die MongoDB-Verbindung fehlschlägt
const inMemoryAuth = {
  users: [
    {
      _id: 'admin-id-123456',
      username: process.env.ADMIN_USERNAME || 'admin',
      // Das Passwort sollte eigentlich gehasht sein, aber für den Notfall verwenden wir es direkt
      password: process.env.ADMIN_PASSWORD || 'admin',
      name: 'Administrator',
      email: 'admin@lockenroll.de',
      role: 'admin'
    }
  ],
  comparePassword: (username, password) => {
    const user = inMemoryAuth.users.find(u => u.username === username);
    return user && user.password === password;
  },
  findUserByUsername: (username) => {
    return inMemoryAuth.users.find(u => u.username === username);
  }
};

// Debug-Route, um Umgebungsvariablen zu prüfen
app.get('/api/debug', (req, res) => {
  // Umgebungsvariablen maskieren für Sicherheit
  const maskedMongoURI = process.env.MONGODB_URI 
    ? process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') 
    : 'nicht definiert';
  
  res.json({
    success: true,
    env: {
      nodeEnv: process.env.NODE_ENV,
      mongoURIPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 10) + '...' : 'nicht definiert',
      mongoURIValid: process.env.MONGODB_URI ? (
        process.env.MONGODB_URI.startsWith('mongodb://') || 
        process.env.MONGODB_URI.startsWith('mongodb+srv://')
      ) : false,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      adminUsernameSet: Boolean(process.env.ADMIN_USERNAME),
      adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD)
    },
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    },
    dbStatus: {
      isConnected: mongoose.connection && mongoose.connection.readyState === 1,
      connectionState: mongoose.connection ? mongoose.connection.readyState : -1,
      usingFallback: !mongoose.connection || mongoose.connection.readyState !== 1
    }
  });
});

// API-Routen
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/config', configRoutes);
app.use('/api/contact', contactRoutes);

// Debug: Direkter Login-Endpunkt für Tests ohne MongoDB
app.post('/api/direct-login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In-Memory Authentifizierung
    if (inMemoryAuth.comparePassword(username, password)) {
      const user = inMemoryAuth.findUserByUsername(username);
      
      // Verwende das JWT-Secret aus der Umgebungsvariable
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'lockenroll_secure_jwt_secret_2023',
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        message: 'Anmeldung erfolgreich (Notfall-Modus)',
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Benutzername oder Passwort ist falsch'
    });
  } catch (error) {
    console.error('Direkter Login-Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Anmeldung',
      error: error.message
    });
  }
});

// Demo-Route zum Testen
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funktioniert!',
    server: 'LockEnroll Server',
    version: '1.0.0'
  });
});

// MongoDB-Verbindung nur initialisieren, wenn wir nicht in Vercel Edge Runtime sind
let hasInitializedMongoDB = false;

// Einfache MongoDB-Verbindung für den Start
function initMongoDB() {
  if (hasInitializedMongoDB) return;
  
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lockenroll';
  
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.log('WARNUNG: MongoDB URI hat falsches Format, verwende Fallback');
    return;
  }
  
  try {
    // Asynchrone Verbindung, wir warten nicht darauf
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    }).then(() => {
      console.log('MongoDB-Verbindung hergestellt');
      createInitialAdmin().catch(err => console.error('Admin-Erstellungsfehler:', err));
    }).catch(err => {
      console.error('MongoDB-Verbindungsfehler:', err.message);
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB-Verbindungsfehler:', err.message);
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB-Verbindung erfolgreich hergestellt');
    });
    
    hasInitializedMongoDB = true;
  } catch (err) {
    console.error('MongoDB-Initialisierungsfehler:', err.message);
  }
}

// Fallback-Authentifizierungsmiddleware für auth.js
// Mach dies global verfügbar, damit auth.js darauf zugreifen kann
global.fallbackAuth = {
  inMemoryAuth
};

// Initialisiere MongoDB, ohne auf die Verbindung zu warten
initMongoDB();

// For health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    connectionState: mongoose.connection ? mongoose.connection.readyState : -1,
    usingFallback: dbStatus !== 'connected',
    message: `API ist aktiv. Datenbank ist ${dbStatus}.`
  });
});

// Für Vercel Serverless Functions müssen wir die App exportieren
module.exports = app; 