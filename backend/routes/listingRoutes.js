const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// GET all listings with search/filter
router.get('/', async (req, res) => {
    try {
        const { search, breed, location } = req.query;
        let query = {};

        // Fix: Sanitize search input to prevent Regex errors
        if (search && search.trim() !== "") {
            const safeSearch = escapeRegex(search);
            query.name = { $regex: safeSearch, $options: 'i' };
        }

        if (breed && breed !== 'All Breeds') {
            query.breed = breed;
        }

        if (location) {
            query.location = { $regex: escapeRegex(location), $options: 'i' };
        }

        const listings = await Listing.find(query).sort({ createdAt: -1 });
        res.json(listings);
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

// POST new listing
router.post('/create', async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ error: "Failed to create listing" });
    }
});

// GET single listing details
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('seller', 'firstName lastName');
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/my-ads', authMiddleware, async (req, res) => {
    try {
        const myAds = await Listing.find({ seller: req.user.id });
        res.json(myAds);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) return res.status(404).json({ error: "Ad not found" });

        // Ensure only the owner can delete
        if (listing.seller.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await listing.deleteOne();
        res.json({ message: "Ad deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});
module.exports = router;