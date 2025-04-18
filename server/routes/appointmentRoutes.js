const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate, isAdmin } = require('../utils/auth');

// Termine erstellen (öffentlich)
router.post('/', appointmentController.createAppointment);

// Verfügbare Zeitfenster abrufen (öffentlich)
router.get('/available-slots', appointmentController.getAvailableSlots);

// Alle Termine abrufen (für Admin/Staff)
router.get('/', authenticate, appointmentController.getAppointments);

// Termin nach ID abrufen (für Admin/Staff)
router.get('/:id', authenticate, appointmentController.getAppointmentById);

// Termin aktualisieren (für Admin/Staff)
router.put('/:id', authenticate, appointmentController.updateAppointment);

// Termin löschen (für Admin/Staff)
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

module.exports = router; 