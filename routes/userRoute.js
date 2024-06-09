// route untuk otentikasi dan profil pengguna dalam aplikasi.
const { signup, login, logout } = require('../controllers/authController');
const { authenticate, getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');

const router = require('express').Router();

router.route('/signup').post(signup)
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/profile').get(authenticate, getProfile);
router.route('/profile').put(authenticate, updateProfile)
router.route('/profile').delete(authenticate, deleteProfile);

module.exports = router;