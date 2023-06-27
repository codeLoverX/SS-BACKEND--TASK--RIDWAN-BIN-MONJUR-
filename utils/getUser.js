const jwt = require('jsonwebtoken');

exports.getUser = (req) => {
    // const token = req.headers.authorization || '';
    const JWT_SECRET = process.env.JWT_SECRET;
    // if (token) {
    if ('token' in req.cookies) {
        // const tokenValue = req.cookies.token.replace('Bearer ', '');
        const tokenValue = req.cookies.token;
        const user = jwt.verify(tokenValue, JWT_SECRET);
        return user;
    }

    return null;
};
