const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    breed: String,
    age: String,
    price: Number,
    location: String,
    // Store an array of Base64 strings
    images: [{ type: String }], 
    sellerPhone: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);