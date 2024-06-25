'use strict';

const { Schema, model, default: mongoose } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
    {
        discountName: {
            type: String,
            required: true,
        },
        discountDescription: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percentage'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        discountCode: {
            type: String,
            required: true,
        },
        discountStartDate: {
            type: Date,
            required: true,
        },
        discountEndDate: {
            type: Date,
            required: true,
        },
        discountMaxUses: {
            type: Number,
            required: true,
        },
        discountUsedCount: {
            type: Number,
            required: true,
            default: 0,
        },
        discountUsedUsers: {
            type: Array,
            required: true,
            default: [],
        },
        discountMaxUsesPerUser: {
            type: Number,
            required: true,
        },
        discountMinPrice: {
            type: Number,
            required: true,
        },
        discountShopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        discountActived: {
            type: Boolean,
            required: true,
            default: true,
        },
        discountAppliesTo: {
            type: String,
            enum: ['all', 'specific'],
            required: true,
        },
        discountProductIds: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, discountSchema);
