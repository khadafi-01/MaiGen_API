// definisi route untuk mengelola destinasi (destinations) dalam aplikasi.
const express = require('express');
const {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
} = require('../controllers/destinationsController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Route untuk membuat destinasi baru, hanya bisa diakses jika pengguna terautentikasi
router.post('/', authenticate, createDestination);

// Route untuk mendapatkan semua destinasi
router.get('/', getAllDestinations);

// Route untuk mendapatkan destinasi berdasarkan ID
router.get('/:id', getDestinationById);

// Route untuk mengupdate destinasi berdasarkan ID, hanya bisa diakses jika pengguna terautentikasi
router.put('/:id', authenticate, updateDestination);

// Route untuk menghapus destinasi berdasarkan ID, hanya bisa diakses jika pengguna terautentikasi
router.delete('/:id', authenticate, deleteDestination);

module.exports = router;