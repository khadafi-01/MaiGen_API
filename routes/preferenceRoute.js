const express = require('express');
const router = express.Router();
const { submitPreference, getRecommendations } = require('../handlers/preferenceController');
const { authenticate } = require('../middleware/authMiddleware');

// Endpoint untuk men-submit preferensi
router.post('/submit', authenticate, submitPreference);

// Endpoint untuk mendapatkan rekomendasi berdasarkan preferensi
router.get('/recommendations', authenticate, getRecommendations);

module.exports = router;