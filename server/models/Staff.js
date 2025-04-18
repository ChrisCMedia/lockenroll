const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  specialties: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  image: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  workingDays: {
    type: [Number],
    default: [2, 3, 4, 5, 6] // Dienstag bis Samstag
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Vor dem Aktualisieren das updatedAt-Feld setzen
StaffSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Staff', StaffSchema); 