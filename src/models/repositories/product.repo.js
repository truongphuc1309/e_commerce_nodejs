'use strict';
const { productModel } = require('../product.model');
const { convertSelectData } = require('../../utils/dataControl');

const getProductByCondition = async (condition) => {
    return await productModel.findOne(condition).exec();
};

const searchProductByUser = async (keySearch) => {
    const regexSearch = new RegExp(keySearch);
    return await productModel
        .find(
            { $text: { $search: regexSearch }, isPublished: true },
            { score: { $meta: 'textScore' } },
        )
        .sort()
        .lean()
        .exec();
};

const getProduct = async ({ filter, unSelect = [] }) => {
    unSelect = convertSelectData({ keys: unSelect, value: 0 });

    return await productModel.findOne(filter).select(unSelect);
};

const getAllProducts = async ({ filter, sortBy, page, limit, select }) => {
    const skip = (page - 1) * limit;
    const sort = sortBy === 'ctime' ? { _id: -1 } : { _id: 1 };
    select = convertSelectData({ keys: select, value: 1 });

    return await productModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean()
        .exec();
};
const updateProduct = async ({ filter, updation }) => {
    return await productModel.findOneAndUpdate(filter, updation, { new: true });
};

const getSomeProductsByShop = async ({ condition, limit, skip }) => {
    return await productModel
        .find(condition)
        .populate('productShop', 'name email -_id')
        .sort({ updateAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
};

const updateProductById = async ({
    productId,
    model,
    updation,
    isNew = true,
}) => {
    return await model.findByIdAndUpdate(productId, updation, { new: isNew });
};

module.exports = {
    getProduct,
    getAllProducts,
    getProductByCondition,
    searchProductByUser,
    getSomeProductsByShop,
    updateProduct,
    updateProductById,
};
