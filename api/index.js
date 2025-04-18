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
  connectTimeoutMS: 60000,
  serverSelectionTimeoutMS: 60000,
  maxIdleTimeMS: 10000 // Sync mit Vercel-Plan: 10s für Hobby, 300s für Pro, 900s für Enterprise
};

// Globalen MongoDB-Client-Cache erstellen
let cachedClient = null;

if (!skipMongoDB) {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lockenroll';
  
  // MongoDB-Client nur erstellen, wenn er noch nicht existiert
  if (!cachedClient) {
    cachedClient = new mongoose.Mongoose();
    
    // Event-Listeners für Verbindungsprobleme
    cachedClient.connection.on('error', (err) => {
      console.error('MongoDB-Verbindungsfehler:', err);
    });
    
    cachedClient.connection.on('disconnected', () => {
      console.log('MongoDB-Verbindung getrennt');
    });
    
    // Verbindung herstellen
    cachedClient.connect(mongoURI, options)
      .then(() => {
        console.log('MongoDB-Verbindung hergestellt');
        // Initialen Admin-Benutzer erstellen
        createInitialAdmin();
      })
      .catch(err => {
        console.error('MongoDB-Verbindungsfehler:', err);
        console.log('Server wird trotzdem gestartet, aber ohne Datenbankverbindung');
      });
  }
} else {
  console.log('MongoDB-Verbindung übersprungen (SKIP_MONGODB=true)');
}

// Für Vercel Serverless Functions müssen wir die App exportieren
module.exports = app; 