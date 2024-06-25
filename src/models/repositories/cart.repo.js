'use strict';

const { constant } = require('lodash');
const cartModel = require('../cart.model');

const createCart = async (userId) => {
    return await cartModel.create({
        cartUserId: userId,
    });
};

const findCartByUserId = async (userId) => {
    return await cartModel
        .findOne({ cartUserId: userId, cartState: 'active' })
        .lean()
        .exec();
};

const includeProducts = async ({ userId, productId }) => {
    return await cartModel.findOne({
        cartUserId: userId,
        cartState: 'active',
        'cartProducts.productId': productId,
    });
};

const pushProducts = async ({ userId, products }) => {
    const query = {
        cartUserId: userId,
        cartState: 'active',
    };

    const updation = {
        $push: {
            cartProducts: products,
        },

        $inc: {
            cartProductsCount: products.quantity,
        },
    };

    const options = {
        new: true,
    };

    return await cartModel.findOneAndUpdate(query, updation, options);
};

const updateProductQuantity = async ({ userId, products }) => {
    const query = {
        cartUserId: userId,
        cartState: 'active',
        'cartProducts.productId': products.productId,
    };

    const quantity = products.oldQuantity
        ? products.quantity - products.oldQuantity
        : products.quantity;

    console.log('::After::');
    console.table(products);

    const updation = {
        $inc: {
            cartProductsCount: quantity,
            'cartProducts.$.quantity': quantity,
        },
    };

    const options = {
        new: true,
    };

    return await cartModel.findOneAndUpdate(query, updation, options);
};

const pullProductsFromCart = async ({ userId, products }) => {
    const query = {
        cartUserId: userId,
        cartState: 'active',
        'cartProducts.productId': products.productId,
    };

    const updation = {
        $pull: {
            cartProducts: { productId: products.productId },
        },
        $inc: {
            cartProductsCount: -products.quantity,
        },
    };

    const options = {
        new: true,
    };

    return await cartModel.findOneAndUpdate(query, updation, options);
};

module.exports = {
    createCart,
    findCartByUserId,
    includeProducts,
    pushProducts,
    updateProductQuantity,
    pullProductsFromCart,
};
