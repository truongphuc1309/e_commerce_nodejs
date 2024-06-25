'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
    {
        productName: { type: String, require: true },
        productSlug: { type: String, require: true },
        productThumb: { type: String, require: true },
        productDescription: { type: String },
        productPrice: { type: Number, require: true },
        productQuantity: { type: Number, require: true },
        productType: {
            type: String,
            require: true,
            enum: ['Electrics', 'Clothing', 'Furniture'],
        },
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        productRatingsAverage: {
            type: Number,
            default: 0,
            min: [0, 'It must better or equal 0'],
            max: [5, 'It must lower or equal 5'],
            set: (val) => Math.round(val * 10) / 10,
        },
        productVariations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    },
);

// create index
productSchema.index({ productName: 'text', productDescription: 'text' });

// middleware to generate slug for product
productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, { lower: true });
    next();
});

const clothingSchema = new Schema(
    {
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        brand: { type: String, require: true },
        size: { type: String },
        material: { type: String },
    },
    {
        collection: 'Clothes',
        timestamps: true,
    },
);

const electricsSchema = new Schema(
    {
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        manufacturer: { type: String, require: true },
        color: { type: String },
        model: { type: String },
    },
    {
        collection: 'Electrics',
        timestamps: true,
    },
);

module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothingModel: model('Clothing', clothingSchema),
    electricsModel: model('Electrics', electricsSchema),
};
