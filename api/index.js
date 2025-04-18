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
      isConnected: cachedConnection ? true : false,
      connectionState: cachedClient ? cachedClient.connection.readyState : -1
    }
  });
});

// API-Routen
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/config', configRoutes);
app.use('/api/contact', contactRoutes);

// Demo-Route zum Testen
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funktioniert!',
    server: 'LockEnroll Server',
    version: '1.0.0'
  });
});

// MongoDB-Verbindung herstellen, wenn nicht übersprungen
const skipMongoDB = process.env.SKIP_MONGODB === 'true';

// Verbindungsoptionen für MongoDB mit höheren Timeouts
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,           // Erhöht auf 30 Sekunden
  serverSelectionTimeoutMS: 30000,   // Erhöht auf 30 Sekunden
  socketTimeoutMS: 45000,            // Erhöht auf 45 Sekunden
  heartbeatFrequencyMS: 10000,       // Regelmäßige Heartbeats
  family: 4,
  ssl: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
};

// Globalen MongoDB-Client-Cache erstellen
let cachedClient = null;
let cachedConnection = null;
let isConnecting = false;

// Optimierte MongoDB-Verbindungsfunktion für Serverless
async function connectToDatabase() {
  if (skipMongoDB) {
    console.log('MongoDB-Verbindung übersprungen (SKIP_MONGODB=true)');
    return null;
  }

  // Wenn bereits eine Verbindung besteht oder gerade aufgebaut wird
  if (cachedConnection) {
    console.log('Verwende bestehende MongoDB-Verbindung');
    return cachedConnection;
  }
  
  if (isConnecting) {
    console.log('Verbindung wird bereits hergestellt, warte...');
    // Warte bis zu 5 Sekunden auf bestehenden Verbindungsversuch
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (cachedConnection) {
        return cachedConnection;
      }
    }
  }
  
  isConnecting = true;

  // Prüfen der MONGODB_URI Umgebungsvariable
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lockenroll';
  
  // Debugging für die mongoURI
  console.log('MongoDB URI Präfix:', mongoURI.substring(0, 10) + '...');
  console.log('MongoDB URI gültiges Format:', 
    mongoURI.startsWith('mongodb://') || mongoURI.startsWith('mongodb+srv://'));
  
  // Manueller Fallback, wenn die Umgebungsvariable nicht im richtigen Format ist
  let finalMongoURI = mongoURI;
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.log('WARNUNG: MongoDB URI hat falsches Format, verwende hartcodierten Fallback');
    // Hartcodierter Fallback zur Sicherheit mit korrekter URI und ?-Parametern am Ende
    finalMongoURI = 'mongodb+srv://admin:admin@cluster0.dkltpao.mongodb.net/lockenroll?retryWrites=true&w=majority&appName=Cluster0';
  }

  // Wenn keine Verbindung vorhanden, erstelle eine neue
  if (!cachedClient) {
    cachedClient = new mongoose.Mongoose();
    
    // Event-Listeners für Verbindungsprobleme
    cachedClient.connection.on('error', (err) => {
      console.error('MongoDB-Verbindungsfehler:', err);
      // Detail-Infos für Netzwerk- und Authentifizierungsfehler
      if (err.name === 'MongoNetworkError') {
        console.error('Netzwerkfehler:', {
          code: err.code,
          syscall: err.syscall,
          address: err.address,
          port: err.port
        });
      }
    });
    
    cachedClient.connection.on('connected', () => {
      console.log('MongoDB-Verbindung erfolgreich hergestellt');
    });
    
    cachedClient.connection.on('disconnected', () => {
      console.log('MongoDB-Verbindung getrennt');
    });
    
    // Detaillierte Verbindungsdiagnose für Entwicklung
    if (process.env.NODE_ENV !== 'production') {
      cachedClient.set('debug', true);
    }
  }

  try {
    console.log('Versuche, Verbindung zur MongoDB herzustellen (URL-Prefix):', finalMongoURI.substring(0, 15) + '...');
    console.log('Verbindungsoptionen:', JSON.stringify(options));
    
    // Direkte Verbindung ohne Promise.race
    cachedConnection = await cachedClient.connect(finalMongoURI, options);
    
    console.log('Neue MongoDB-Verbindung hergestellt');
    
    // Initialen Admin-Benutzer erstellen
    await createInitialAdmin();
    
    isConnecting = false;
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB-Verbindungsfehler (detailliert):', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack.split('\n').slice(0, 3).join('\n')
    });
    
    // Versuche alternative Verbindung ohne SSL, falls SSL-Fehler
    if (err.message && err.message.includes('SSL')) {
      try {
        console.log('Versuche alternative Verbindung ohne SSL...');
        const altOptions = { ...options, ssl: false };
        cachedConnection = await cachedClient.connect(finalMongoURI, altOptions);
        console.log('Alternative MongoDB-Verbindung hergestellt');
        await createInitialAdmin();
        isConnecting = false;
        return cachedConnection;
      } catch (altErr) {
        console.error('Alternative Verbindung fehlgeschlagen:', altErr.message);
      }
    }
    
    // Versuche mit reduzierter URI ohne Parameter zu verbinden
    try {
      const simpleURI = finalMongoURI.split('?')[0]; // Entferne alle Parameter
      console.log('Versuche Verbindung mit vereinfachter URI:', simpleURI.substring(0, 15) + '...');
      cachedConnection = await cachedClient.connect(simpleURI, options);
      console.log('MongoDB-Verbindung mit vereinfachter URI hergestellt');
      await createInitialAdmin();
      isConnecting = false;
      return cachedConnection;
    } catch (simpleErr) {
      console.error('Verbindung mit vereinfachter URI fehlgeschlagen:', simpleErr.message);
    }
    
    isConnecting = false;
    console.log('Server wird trotzdem gestartet, aber ohne Datenbankverbindung');
    return null;
  }
}

// Lazy initialization - connect only when needed
app.use(async (req, res, next) => {
  if (!cachedConnection && !skipMongoDB && 
      (req.path.startsWith('/api/auth') || 
       req.path.startsWith('/api/appointments') || 
       req.path.startsWith('/api/config'))) {
    console.log('Lazy-Loading der MongoDB-Verbindung für Route:', req.path);
    await connectToDatabase();
  }
  next();
});

// For health check
app.get('/api/health', async (req, res) => {
  const dbStatus = cachedConnection ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    connectionState: cachedClient ? cachedClient.connection.readyState : -1,
    message: `API ist aktiv. Datenbank ist ${dbStatus}.`
  });
});

// Für Vercel Serverless Functions müssen wir die App exportieren
module.exports = app; 