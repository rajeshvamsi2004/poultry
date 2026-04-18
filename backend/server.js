require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to PoultryDB"))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/ai', aiRoutes); // <--- MUST BE HERE
app.use('/api/shastra', require('./routes/shastra'));
app.use(express.json({ limit: '50mb' })); // Increase to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
