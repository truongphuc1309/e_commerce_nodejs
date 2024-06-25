'use strict';

const { Schema, model, default: mongoose } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
    {
        cartUserId: {
            type: String,
            required: true,
        },
        cartState: {
            type: String,
            required: true,
            enum: ['active', 'peding', 'failed', 'complete'],
            default: 'active',
        },
        cartProducts: {
            type: Array,
            required: true,
            default: [],
        },
        /*[{productId,shopId, name, quantity, price}]*/

        cartProductsCount: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, cartSchema);
