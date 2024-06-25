'use strict'

const {Schema, model} = require('mongoose')


const COLLECTION_NAME = 'Shops'
const DOCUMENT_NAME = 'Shop'

const shopSchema  = new Schema ({
    name: {
        type: String,
        trim: true,
        require: true,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: [],
    }
}, {
        timestamps: true,
        collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, shopSchema)
