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

// Verbindungsoptionen für MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  family: 4
};

// Globalen MongoDB-Client-Cache erstellen
let cachedClient = null;
let cachedConnection = null;

// Optimierte MongoDB-Verbindungsfunktion für Serverless
async function connectToDatabase() {
  if (skipMongoDB) {
    console.log('MongoDB-Verbindung übersprungen (SKIP_MONGODB=true)');
    return null;
  }

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
    // Hartcodierter Fallback zur Sicherheit (sollte durch Umgebungsvariable ersetzt werden)
    finalMongoURI = 'mongodb+srv://admin:admin@cluster0.dkltpao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  }

  if (cachedConnection) {
    console.log('Verwende bestehende MongoDB-Verbindung');
    return cachedConnection;
  }

  // Wenn keine Verbindung vorhanden, erstelle eine neue
  if (!cachedClient) {
    cachedClient = new mongoose.Mongoose();
    
    // Event-Listeners für Verbindungsprobleme
    cachedClient.connection.on('error', (err) => {
      console.error('MongoDB-Verbindungsfehler:', err);
    });
    
    cachedClient.connection.on('disconnected', () => {
      console.log('MongoDB-Verbindung getrennt');
    });
  }

  try {
    cachedConnection = await cachedClient.connect(finalMongoURI, options);
    console.log('Neue MongoDB-Verbindung hergestellt');
    
    // Initialen Admin-Benutzer erstellen
    await createInitialAdmin();
    
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB-Verbindungsfehler:', err);
    console.log('Server wird trotzdem gestartet, aber ohne Datenbankverbindung');
    return null;
  }
}

// Verbindung herstellen wenn die Serverless Function startet
connectToDatabase();

// Für Vercel Serverless Functions müssen wir die App exportieren
module.exports = app; 