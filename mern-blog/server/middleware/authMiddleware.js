const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if (err) {
                return next(new HttpError("Unauthorized. Invalid token", 403));
            }

            req.user = info;
            next();
        });
    } else {
        return next(new HttpError("Unauthorized. No token", 403));
    }
};

module.exports = authMiddleware;
