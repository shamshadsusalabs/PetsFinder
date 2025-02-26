const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  contactNumber: { type: String, required: true, unique: true }, // Indexed for quick lookup
  profilePic: { type: String, default: '' },
  password: { type: String, required: true },
 type: { type: String, enum: ['Admin', 'Volunteer'], default: 'Volunteer', required: true },
  refreshToken: { type: String }, // ✅ Store refresh token securely
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model('User', userSchema);
