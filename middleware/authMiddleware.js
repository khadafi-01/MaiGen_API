const jwt = require('jsonwebtoken');
const db = require('../config/firebaseConfig');

const authenticate = async(req, res, next) => {
    let token = req.header('Authorization');
    if (token) {
        token = token.replace('Bearer ', '');
    }

    if (!token) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        req.user = { id: userId, ...doc.data() };
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = {
    authenticate,
};