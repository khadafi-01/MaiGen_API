// Import model pengguna, jwt, dan bcrypt, serta middleware otentikasi
const users = require("../database/models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticate } = require('../middleware/authMiddleware');

// membuat token JWT berdasarkan payload
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// mendaftarkan pengguna baru
const signup = async(req, res, next) => {
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Harap berikan username, email, dan password'
        });
    }

    try {
        // Cek apakah email telah terdaftar
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'Gagal',
                message: 'Email sudah digunakan'
            });
        }

        // Meng-hash password sebelum disimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Menambahkan user baru ke tabel users
        const newUser = await users.create({
            username,
            email,
            password: hashedPassword
        });

        const result = newUser.toJSON();

        // Hapus password dari hasil yang dikembalikan sebelum mengirim respons
        delete result.password;
        delete result.deleted_at;

        // Generate token untuk pengguna baru
        const token = generateToken({ id: result.user_id });

        // Kirim respons sukses dengan data pengguna baru
        return res.status(201).json({
            status: 'Sukses',
            data: {...result, token }
        });
    } catch (error) {
        console.error('Error saat mendaftarkan pengguna:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Server internal bermasalah'
        });
    }
};

// menangani proses login pengguna
const login = async(req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Harap berikan email dan password'
        });
    }

    try {
        // Temukan pengguna berdasarkan email
        const user = await users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: 'Gagal',
                message: 'Email atau password salah'
            });
        }

        // Bandingkan hash password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'Gagal',
                message: 'Email atau password salah'
            });
        }

        // Generate token saat login berhasil
        const token = generateToken({ id: user.user_id });
        return res.status(200).json({
            status: 'Sukses',
            token
        });
    } catch (error) {
        console.error('Error saat login:', error);
        // Tangani kesalahan khusus (mis., kesalahan database) dan berikan pesan yang lebih informatif
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan saat login. Harap coba lagi nanti.'
        });
    }
};

// menangani proses logout pengguna
const logout = (req, res, next) => {
    return res.status(200).json({
        status: 'Sukses',
        message: 'Berhasil keluar'
    });
};

module.exports = {
    signup,
    login,
    logout
};