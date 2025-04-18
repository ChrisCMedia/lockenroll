const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../utils/auth');

// Login
router.post('/login', authController.login);

// Aktuellen Benutzer abrufen
router.get('/me', authenticate, authController.getCurrentUser);

// Benutzer registrieren (nur für Admin)
router.post('/register', authenticate, isAdmin, authController.register);

// Alle Benutzer abrufen (nur für Admin)
router.get('/users', authenticate, isAdmin, authController.getAllUsers);

// Benutzer aktualisieren
router.put('/users/:id', authenticate, authController.updateUser);

// Benutzer löschen (nur für Admin)
router.delete('/users/:id', authenticate, isAdmin, authController.deleteUser);

module.exports = router; 