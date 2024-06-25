'use strict';

const discountModel = require('../discount.model');
const { convertSelectData } = require('../../utils/dataControl');

const findDiscountByCodeAndShop = async ({ discountCode, discountShopId }) => {
    return await discountModel
        .findOne({ discountCode, discountShopId })
        .lean()
        .exec();
};

const createDiscount = async ({
    discountCode,
    discountName,
    discountType,
    discountDescription,
    discountValue,
    discountStartDate,
    discountEndDate,
    discountMaxUses,
    discountMaxUsesPerUser,
    discountMinPrice,
    discountShopId,
    discountActived,
    discountAppliesTo,
    discountProductIds,
}) => {
    return await discountModel.create({
        discountCode,
        discountName,
        discountType,
        discountDescription,
        discountValue,
        discountStartDate,
        discountEndDate,
        discountMaxUses,
        discountMaxUsesPerUser,
        discountMinPrice,
        discountShopId,
        discountActived,
        discountAppliesTo,
        discountProductIds,
    });
};

const getAllDiscountsByShop = async ({
    discountShopId,
    sortBy,
    page,
    limit,
    unSelect,
}) => {
    const skip = (page - 1) * limit;
    const sort = sortBy === 'ctime' ? { _id: -1 } : { _id: 1 };
    unSelect = convertSelectData({ keys: unSelect, value: 0 });

    return await discountModel
        .find({ discountShopId, discountActived: true })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(unSelect)
        .lean()
        .exec();
};

const deleteDiscount = async ({ discountCode, discountShopId }) => {
    return await discountModel.findOneAndDelete({
        discountCode,
        discountShopId,
    });
};

const updateDiscount = async ({ filter, query }) => {
    return await discountModel.findOneAndUpdate(filter, query, {
        new: true,
    });
};

module.exports = {
    findDiscountByCodeAndShop,
    createDiscount,
    getAllDiscountsByShop,
    deleteDiscount,
    updateDiscount,
};
