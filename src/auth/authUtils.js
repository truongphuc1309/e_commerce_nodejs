'use strict'

const jwt = require('jsonwebtoken')


const createTokenPair = async ({payload, privateKey, publicKey}) => {
    const accessToken = jwt.sign(payload, publicKey, {
        expiresIn: '2 days'
    })
    const refreshToken = jwt.sign(payload, privateKey, {
        expiresIn: '7 days'
    })

    return {accessToken, refreshToken}
}


module.exports = {
   createTokenPair,
}
