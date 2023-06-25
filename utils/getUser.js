const jwt = require('jsonwebtoken');

exports.getUser = (req) => {
    const token = req.headers.authorization || '';
    const JWT_SECRET = process.env.JWT_SECRET;
    if (token) {
        const tokenValue = token.replace('Bearer ', '');
        const user = jwt.verify(tokenValue, JWT_SECRET);
        return user;
    }

    return null;
};
