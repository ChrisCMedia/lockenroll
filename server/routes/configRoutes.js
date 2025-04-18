const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authenticate, isAdmin } = require('../utils/auth');

// Öffentliche Routen (nur Lesen)
router.get('/services', configController.getServices);
router.get('/staff', configController.getStaff);
router.get('/business-hours', configController.getBusinessHours);

// Geschützte Routen (nur Admin)
router.get('/', authenticate, isAdmin, configController.getConfig);
router.put('/', authenticate, isAdmin, configController.updateConfig);

// Dienstleistungen verwalten (nur Admin)
router.post('/services', authenticate, isAdmin, configController.addService);
router.put('/services/:id', authenticate, isAdmin, configController.updateService);
router.delete('/services/:id', authenticate, isAdmin, configController.deleteService);

// Mitarbeiter verwalten (nur Admin)
router.post('/staff', authenticate, isAdmin, configController.addStaffMember);
router.put('/staff/:id', authenticate, isAdmin, configController.updateStaffMember);
router.delete('/staff/:id', authenticate, isAdmin, configController.deleteStaffMember);

// Öffnungszeiten verwalten (nur Admin)
router.put('/business-hours', authenticate, isAdmin, configController.updateBusinessHours);

module.exports = router; 