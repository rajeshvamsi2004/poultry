const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstName: String,
    lastName: String,
    password: { type: String }, // Hashed
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);