// Import firestore dari firebaseConfig.js
const firestore = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');

// Mendapatkan profil pengguna
const getProfile = async(req, res) => {
    try {
        // Ambil id pengguna dari req.user
        const userId = req.user.id;

        //lakukan query untuk mendapatkan profil pengguna dari firestore
        const userDoc = await firestore.collection('users').doc(userId).get();

        // memeriksa apakah pengguna ditemukan
        if (!userDoc.exists) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // ambil data user dari dokumen firestore
        const userData = userDoc.data();

        return res.status(200).json({
            status: 'Success',
            data: userData
        })
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        });
    }
};

// Memperbarui profil pengguna
const updateProfile = async(req, res) => {
    try {
        const userId = req.user.id;
        const { new_username, new_email, new_password } = req.body;

        // Lakukan query untuk mendapatkan dokumen pengguna dari Firestore
        const userRef = firestore.collection('users').doc(userId);
        const userDoc = await userRef.get();

        // periksa apakah pengguna ditemukan
        if (!userDoc.exists) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Persiapkan data yang akan diupdate
        const updatedData = {};

        if (new_username !== undefined && new_username !== userDoc.data().username) {
            updatedData.username = new_username;
        }

        if (new_email !== undefined && new_email !== userDoc.data().email) {
            updatedData.email = new_email;
        }

        if (new_password !== undefined) {
            updatedData.password = await bcrypt.hash(new_password, 10);
        }

        // Periksa apakah ada data yang perlu diupdate
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                status: 'Fail',
                message: 'No data provided for update'
            });
        }

        // Lakukan operasi update pada dokumen pengguna
        await userRef.update(updatedData);

        return res.status(200).json({
            status: 'Success',
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        });
    }
};

// Menghapus profil pengguna
const deleteProfile = async(req, res) => {
    try {
        // Ambil id user dari req.user
        const userId = req.user.id;

        // Lakukan query untuk menghapus dokumen user dari firestore
        await firestore.collection('users').doc(userId).delete();

        return res.status(200).json({
            status: 'Success',
            message: 'Profile deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user profile:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
};