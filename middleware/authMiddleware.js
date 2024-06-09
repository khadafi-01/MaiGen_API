// modul untuk melakukan otentikasi token JWT.

const jwt = require('jsonwebtoken');

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

module.exports = {
    authenticate,
};