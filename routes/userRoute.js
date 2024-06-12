// route untuk otentikasi dan profil pengguna dalam aplikasi.

const { signup, login, logout } = require("../handlers/authController");
const {
    getProfile,
    updateProfile,
    deleteProfile,
} = require("../handlers/profileController");
const { authenticate } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


module.exports = router;