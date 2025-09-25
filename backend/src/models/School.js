const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false,
  timestamps: true
});

const SchoolModel = mongoose.model("School", schoolSchema);
module.exports = { SchoolModel };
