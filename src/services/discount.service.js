'use strict';

const discountRepo = require('../models/repositories/discount.repo');
const productRepo = require('../models/repositories/product.repo');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class DiscountService {
    static async createDiscountCode({
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
    }) {
        const foundDiscount = await discountRepo.findDiscountByCodeAndShop({
            discountCode,
            discountShopId,
        });

        if (foundDiscount)
            throw new BadRequestError('This Discount Code Existed');

        return await discountRepo.createDiscount({
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
    }

    static async getAllProductsByDiscountCode({
        discountCode,
        discountShopId,
        sortBy = 'ctime',
        page = 1,
        limit = 50,
    }) {
        const foundDiscount = await discountRepo.findDiscountByCodeAndShop({
            discountShopId,
            discountCode,
        });

        if (!foundDiscount)
            throw new NotFoundError('This Discount Code Not Exist');

        const selection = [
            'productId',
            'productName',
            'productPrice',
            'productType',
            'productThumb',
            'productDescription',
        ];

        const filter =
            foundDiscount.discountAppliesTo === 'all'
                ? {
                      productShop: discountShopId,
                      isPublished: true,
                  }
                : {
                      _id: {
                          $in: foundDiscount.discountProductIds,
                      },
                      isPublished: true,
                  };

        console.log('::Filter::', filter);

        return await productRepo.getAllProducts({
            filter,
            select: selection,
            sortBy,
            page,
            limit,
        });
    }

    static async getAllDiscountsByShop({
        discountShopId,
        sortBy = 'ctime',
        page = 1,
        limit = 50,
    }) {
        const unSelect = ['_id'];

        return await discountRepo.getAllDiscountsByShop({
            discountShopId,
            sortBy,
            page,
            limit,
            unSelect,
        });
    }

    static async getDiscountAmount({
        discountCode,
        discountShopId,
        userId,
        products,
    }) {
        const foundDiscount = await discountRepo.findDiscountByCodeAndShop({
            discountShopId,
            discountCode,
        });

        if (!foundDiscount) throw new NotFoundError('Discount not exist');

        const {
            discountStartDate,
            discountEndDate,
            discountMinPrice,
            discountMaxUses,
            discountMaxUsesPerUser,
            discountUsedCount,
            discountUsedUsers,
            discountType,
            discountValue,
        } = foundDiscount;

        // Check discount expire
        const currentDate = new Date();
        const startDate = new Date(discountStartDate);
        const endDate = new Date(discountEndDate);

        if (
            currentDate < startDate ||
            currentDate > endDate ||
            discountMaxUses === discountUsedCount
        )
            throw new BadRequestError('Discount expired');

        const totalPrice = products.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);

        if (discountMinPrice > 0) {
            if (totalPrice < discountMinPrice)
                throw BadRequestError('Discount is not used for product');
        }

        let usedCount = discountUsedUsers.filter((user) => {
            return user.userId === userId;
        }).length;

        if (usedCount >= discountMaxUsesPerUser)
            throw new BadRequestError('Discount is out');

        const discountAmount =
            discountType === 'fixed'
                ? discountValue
                : totalPrice * (discountValue / 100);

        return {
            total: totalPrice,
            discount: discountAmount,
            price: totalPrice - discountAmount,
        };
    }

    static async deleteDiscount({ discountCode, discountShopId }) {
        const foundDiscount = discountRepo.findDiscountByCodeAndShop({
            discountShopId,
            discountCode,
        });

        if (!foundDiscount) throw new NotFoundError('Discount not exist');

        return await discountRepo.deleteDiscount({
            discountShopId,
            discountCode,
        });
    }

    static async cancelDiscount({ discountCode, discountShopId, userId }) {
        const foundDiscount = discountRepo.findDiscountByCodeAndShop({
            discountShopId,
            discountCode,
        });

        if (!foundDiscount) throw new NotFoundError('Discount not exist');

        const filter = { discountShopId, discountCode };
        const query = {
            $pull: {
                discountUsedUsers: { userId },
            },

            $inc: {
                discountUsedCount: -1,
            },
        };

        return await discountRepo.updateDiscount({ filter, query });
    }
}

module.exports = DiscountService;
