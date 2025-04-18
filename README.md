# Locken'Roll - Friseursalon Webseite mit Terminbuchungssystem

Dieses Projekt ist eine moderne, responsive Webseite für den Friseursalon "Locken'Roll", die ein Terminbuchungssystem als Hauptfunktion bietet.

## Technologienn

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB
- **Authentifizierung**: JWT für Admin-Bereich

## Projektstruktur

```
lockenroll/
├── client/              # React-Frontend
│   ├── public/          # Öffentliche Dateien
│   └── src/             # Quellcode
│       ├── components/  # Wiederverwendbare Komponenten
│       ├── pages/       # Seitenkomponenten
│       ├── context/     # React Context
│       ├── utils/       # Hilfsfunktionen
│       └── assets/      # Bilder, Icons, etc.
└── server/              # Node.js/Express-Backend
    ├── config/          # Konfigurationsdateien
    ├── controllers/     # Request-Handler
    ├── models/          # Mongoose-Modelle
    ├── routes/          # API-Routen
    └── utils/           # Hilfsfunktionen
```

## Installation

### Voraussetzungen
- Node.js (v14 oder höher)
- MongoDB

### Schritte

1. Repository klonen:
```bash
git clone https://github.com/yourusername/lockenroll.git
cd lockenroll
```

2. Abhängigkeiten installieren:
```bash
# Backend-Abhängigkeiten
cd server
npm install

# Frontend-Abhängigkeiten
cd ../client
npm install
```

3. Umgebungsvariablen konfigurieren:
   - Erstelle eine `.env`-Datei im `server`-Verzeichnis:
   ```
   MONGODB_URI=mongodb://localhost:27017/lockenroll
   JWT_SECRET=dein_geheimer_schlüssel
   PORT=5000
   ```

4. Server starten:
```bash
# Im server-Verzeichnis
npm run dev
```

5. Client starten:
```bash
# Im client-Verzeichnis
npm start
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## Admin-Bereich

Der Admin-Bereich ist unter `/admin` erreichbar. Standardzugangsdaten:
- Benutzername: admin
- Passwort: admin

**Wichtig**: Ändere diese Zugangsdaten nach der ersten Anmeldung!

## Konfiguration des Terminplaners

Der Terminplaner kann über den Admin-Bereich konfiguriert werden:

1. **Dienstleistungen**: Hinzufügen, Bearbeiten oder Löschen von Dienstleistungen und deren Preisen.
2. **Mitarbeiter**: Verwaltung der Friseure und deren Verfügbarkeit.
3. **Öffnungszeiten**: Festlegen der Salon-Öffnungszeiten.
4. **Terminintervalle**: Konfiguration der Zeitfenster (Standard: 30 Minuten).

Alternativ kann die Konfiguration direkt in der Datei `server/config/appointments.json` vorgenommen werden.

## Backup und Wiederherstellung

Die MongoDB-Datenbank sollte regelmäßig gesichert werden:

```bash
mongodump --db lockenroll --out /backup/path
```

Wiederherstellung:

```bash
mongorestore --db lockenroll /backup/path/lockenroll
``` 