const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String},
  type: { type: String, required: true, default: 'chatbot' },
  isActive: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: false },
  virtualRoles: { type: [String], default: [] },
  cover: { type: String },
  logo: { type: String },
  prompt: {type: String, default: ''}
}, { timestamps: true });

schema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Application', schema);