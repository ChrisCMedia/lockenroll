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

// Admin-Zugangsdaten - WICHTIG: Für Vercel müssen die Umgebungsvariablen korrekt gesetzt sein
// Hier verwenden wir feste Werte als letzten Fallback
const adminUsername = 'admin';
const adminPassword = 'admin';

console.log('ADMIN CREDENTIALS: ' + adminUsername + ':' + adminPassword);

// In-Memory Datenbank für einfache Authentifizierung
// Diese wird verwendet, wenn die MongoDB-Verbindung fehlschlägt
const inMemoryAuth = {
  users: [
    {
      _id: 'admin-id-123456',
      username: adminUsername,
      // Das Passwort sollte eigentlich gehasht sein, aber für den Notfall verwenden wir es direkt
      password: adminPassword,
      name: 'Administrator',
      email: 'admin@lockenroll.de',
      role: 'admin'
    }
  ],
  comparePassword: (username, password) => {
    console.log(`FALLBACK AUTH: Vergleiche ${username}:${password} mit in-memory Daten`);
    const user = inMemoryAuth.users.find(u => u.username === username);
    
    if (!user) {
      console.log(`FALLBACK AUTH: Benutzer ${username} nicht gefunden`);
      return false;
    }
    
    const isMatch = user.password === password;
    console.log(`FALLBACK AUTH: Passwort für ${username} ist ${isMatch ? 'korrekt' : 'falsch'}`);
    return isMatch;
  },
  findUserByUsername: (username) => {
    console.log(`FALLBACK AUTH: Suche Benutzer ${username}`);
    const user = inMemoryAuth.users.find(u => u.username === username);
    console.log(`FALLBACK AUTH: Benutzer ${username} ${user ? 'gefunden' : 'nicht gefunden'}`);
    return user;
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
      adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD),
      adminUsername: adminUsername, // OK für Debug anzeigen
      adminPasswordMasked: adminPassword ? '*'.repeat(adminPassword.length) : 'nicht definiert'
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
    },
    fallbackAuth: {
      enabled: true,
      usersCount: inMemoryAuth.users.length,
      adminUserExists: inMemoryAuth.users.some(u => u.role === 'admin'),
      adminUsername: inMemoryAuth.users.find(u => u.role === 'admin')?.username
    },
    vercelEnv: {
      region: process.env.VERCEL_REGION,
      url: process.env.VERCEL_URL,
      environment: process.env.VERCEL_ENV
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
    
    console.log(`DIRECT LOGIN: Versuch für ${username}`);
    
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
  
  // Hartcodierte MongoDB-Verbindung für den Fall, dass die Umgebungsvariable falsch ist
  // Dies ist die korrekte Verbindungszeichenfolge, die du uns angegeben hast
  const fallbackMongoURI = 'mongodb+srv://admin:admin@cluster0.dkltpao.mongodb.net/lockenroll?retryWrites=true&w=majority&appName=Cluster0';
  
  // Verwende die Umgebungsvariable oder den Fallback
  let mongoURI = process.env.MONGODB_URI || fallbackMongoURI;
  
  // Überprüfe die URI auf das richtige Format
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.log('WARNUNG: MongoDB URI hat falsches Format, verwende Fallback-URI');
    mongoURI = fallbackMongoURI;
  }
  
  console.log('Versuche Verbindung mit MongoDB URI (Präfix):', mongoURI.substring(0, 20) + '...');
  
  try {
    // Verbindungsoptionen für MongoDB
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    };
    
    // Asynchrone Verbindung, wir warten nicht darauf
    mongoose.connect(mongoURI, mongooseOptions)
      .then(() => {
        console.log('MongoDB-Verbindung hergestellt');
        createInitialAdmin()
          .then(() => console.log('Admin-Benutzer wurde geprüft/erstellt'))
          .catch(err => console.error('Admin-Erstellungsfehler:', err));
      })
      .catch(err => {
        console.error('MongoDB-Verbindungsfehler:', err.message);
        
        // Bei Fehler versuche es mit dem Fallback
        if (mongoURI !== fallbackMongoURI) {
          console.log('Versuche es mit Fallback-URI...');
          mongoose.connect(fallbackMongoURI, mongooseOptions)
            .then(() => {
              console.log('MongoDB-Verbindung mit Fallback-URI hergestellt');
              createInitialAdmin().catch(err => console.error('Admin-Erstellungsfehler:', err));
            })
            .catch(fallbackErr => {
              console.error('Auch Fallback-Verbindung fehlgeschlagen:', fallbackErr.message);
            });
        }
      });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB-Verbindungsfehler:', err.message);
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB-Verbindung erfolgreich hergestellt');
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB-Verbindung getrennt');
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