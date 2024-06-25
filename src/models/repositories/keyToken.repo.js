'use strict'

const  keyTokenModel = require ('../../models/keyToken.model')

const createKeyToken = async ({userId, privateKey, publicKey, refreshToken, refreshTokensUsed = undefined}) => {
    const filter = {user: userId} 
    const updations = {
        privateKey,
        publicKey,
        refreshToken,
        $push: {
            refreshTokensUsed,
        },
    } 
    const options = {
        upsert: true,
        new: true,
    }

    const keys = await keyTokenModel.findOneAndUpdate(filter, updations, options)

    return keys ? keys.publicKey : null
}


const getByUserId = async (userId) => {
    const keyStore = await keyTokenModel.findOne({user: userId}).lean()

    return keyStore ? keyStore : null
}
    
const deleteById = async (id) => {
    const deletedKey = await keyTokenModel.deleteOne({_id: id})

    return deletedKey ? deletedKey : null
}

const deleteByUserId = async (id) => {
    const deletedKey = await keyTokenModel.deleteOne({user: id})

    return deletedKey ? deletedKey : null
}

const findRefreshToken = async (refreshToken) => {
    const foundToken = await keyTokenModel.findOne({refreshToken}).lean()

    return foundToken ? foundToken : null
}

const findRefreshTokenUsed = async (refreshToken) => {
    const foundToken = await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()

    return foundToken ? foundToken : null
}

module.exports = {
    createKeyToken,
    getByUserId,
    deleteById,
    deleteByUserId,
    findRefreshToken,
    findRefreshTokenUsed,
}
