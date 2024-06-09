const Users = require('../database/models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

// Middleware untuk melakukan autentikasi token
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            status: 'Fail',
            message: 'No token provided or malformed token'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'Fail',
            message: 'Invalid token'
        });
    }
};

// Mendapatkan profil pengguna
const getProfile = async(req, res) => {
    try {
        const user = await Users.findByPk(req.user.id, {
            attributes: ['username', 'email']
        });

        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        const result = user.toJSON();
        return res.status(200).json({
            status: 'Success',
            data: result
        });
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
        const { username, email, password } = req.body;

        const user = await Users.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

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
        const user = await Users.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            })
        }
        await user.destroy();

        return res.status(200).json({
            status: 'Success',
            message: 'Profile deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    authenticate,
    getProfile,
    updateProfile,
    deleteProfile
};