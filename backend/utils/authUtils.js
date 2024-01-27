const jwt = require('jsonwebtoken');

const validateToken = (token) => {
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
};

const getUserInfoFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        console.log(error);
        throw new Error('Invalid token');
    }
};



module.exports = { validateToken, getUserInfoFromToken };
