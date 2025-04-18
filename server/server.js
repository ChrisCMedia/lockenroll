const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routen importieren
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const configRoutes = require('./routes/configRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Auth-Hilfsfunktionen importieren
const { createInitialAdmin } = require('./utils/auth');

// Umgebungsvariablen laden
dotenv.config();

// Express-App initialisieren
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien im Produktionsmodus (Frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

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

if (!skipMongoDB) {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lockenroll';
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout nach 5 Sekunden
  })
    .then(() => {
      console.log('MongoDB-Verbindung hergestellt');
      // Initialen Admin-Benutzer erstellen
      createInitialAdmin();
    })
    .catch(err => {
      console.error('MongoDB-Verbindungsfehler:', err);
      console.log('Server wird trotzdem gestartet, aber ohne Datenbankverbindung');
    });
} else {
  console.log('MongoDB-Verbindung übersprungen (SKIP_MONGODB=true)');
}

// Alle anderen GET-Anfragen im Produktionsmodus an die Frontend-App weiterleiten
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Server starten
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 