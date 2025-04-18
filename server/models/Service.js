const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Woman', 'Gentleman', 'Kinder', 'Kosmetik']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 30
  },
  active: {
    type: Boolean,
    default: true
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
ServiceSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Service', ServiceSchema); 