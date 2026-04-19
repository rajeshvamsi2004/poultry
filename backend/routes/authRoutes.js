const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Nodemailer Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// STEP 1: Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 600000; // 10 mins

    try {
        await User.findOneAndUpdate({ email }, { otp, otpExpires: expires }, { upsert: true });
        await transporter.sendMail({
            from: `"CockBazar" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code',
            html: `<div style="padding:20px; text-align:center;"><h1>${otp}</h1><p>Use this code to login to CockBazar.</p></div>`
        });
        res.status(200).json({ message: "OTP Sent" });
    } catch (err) {
    console.log("MAIL ERROR:", err);
    res.status(500).json({ error: err.message });
}
});

// STEP 2: Verify OTP (Fix: Sends token for existing users)
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp });

        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        await user.save();

        // If user already has a password, they are an existing user
        if (user.password) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ 
                isNewUser: false, 
                token, 
                user: { id: user._id, email: user.email, firstName: user.firstName } 
            });
        }

        // Otherwise, they are a new user
        res.status(200).json({ isNewUser: true });
    } catch (err) { res.status(500).json({ error: "Verification failed" }); }
});

// STEP 3: Complete Profile
router.post('/complete-signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword, firstName, lastName, otp: undefined, otpExpires: undefined },
            { new: true }
        );

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName } });
    } catch (err) { res.status(500).json({ error: "Signup failed" }); }
});

module.exports = router;
