'use strict'

const {Schema, model, default: mongoose} = require('mongoose')

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keySchema  = new Schema ({
    user: {
        type: mongoose.Types.ObjectId,
        require:true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true
    },
    privateKey: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        require: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: [],
    }
}, {
        timestamps: true,
        collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keySchema)
