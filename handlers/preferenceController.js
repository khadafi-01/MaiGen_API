const firestore = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menyimpan preferensi pengguna
const submitPreference = async(req, res) => {
    try {
        const { userId, category } = req.body;

        if (!userId || !category) {
            return res.status(400).json({ status: 'Fail', message: 'User ID and category are required' });
        }

        // Validasi kategori
        const validCategories = [
            'Agrowisata', 'Belanja', 'Alam', 'Budaya', 'Cagar Alam', 'Pantai', 'Rekreasi', 'Religius'
        ];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ status: 'Fail', message: 'Invalid category' });
        }

        const newPreference = {
            id: uuidv4(),
            user_id: userId,
            category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Menyimpan preferensi ke Firestore
        await firestore.collection('preferences').doc(newPreference.id).set(newPreference);

        res.status(201).json({
            status: 'Success',
            data: newPreference
        });
    } catch (error) {
        console.error('Error submitting preference:', error);
        res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
};

// Fungsi untuk mendapatkan rekomendasi berdasarkan preferensi pengguna
const getRecommendations = async(req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ status: 'Fail', message: 'User ID is required' });
        }

        const preferenceSnapshot = await firestore.collection('preferences')
            .where('user_id', '==', userId).get();

        if (preferenceSnapshot.empty) {
            return res.status(404).json({ status: 'Fail', message: 'No preferences found for this user' });
        }

        const preferences = preferenceSnapshot.docs.map(doc => doc.data());
        const categories = preferences.map(preference => preference.category);

        // Load dataset
        const datasetPath = path.resolve(__dirname, '../utils/Dataset - tourismBali.csv');
        const destinations = [];

        fs.createReadStream(datasetPath)
            .pipe(csv())
            .on('data', (row) => {
                if (categories.includes(row.Category)) {
                    destinations.push(row);
                }
            })
            .on('end', () => {
                if (destinations.length === 0) {
                    return res.status(404).json({ status: 'Fail', message: 'No recommendations found for this category' });
                }

                res.status(200).json({
                    status: 'Success',
                    data: destinations
                });
            });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
};

module.exports = {
    submitPreference,
    getRecommendations
};