const config = require('../config/config');
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_AUTH_SECRET, (err, userObject) => {
            if(err) {
                return reject(err)
            }
            return resolve(userObject)
        })
    })
}

const getDetailsFromToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_AUTH_SECRET, { ignoreExpiration: true }, (err, userObject) => {
            if(err) {
                return reject(err)
            }
            return resolve(userObject)
        })
    })
}

module.exports = {
    verifyToken: verifyToken,
    getDetailsFromToken: getDetailsFromToken
}