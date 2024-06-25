'use strict';

const discountService = require('../services/discount.service');
const {
    SuccessResponse,
    CreatedResponse,
} = require('../core/success.response');

class DiscountController {
    static async createDiscountCode(req, res) {
        const result = await discountService.createDiscountCode({
            ...req.body,
            discountShopId: req.user.userId,
        });

        new CreatedResponse({
            message: 'Success created discount',
            metadata: result,
        }).send(res);
    }

    static async getAllProductsByDiscountCode(req, res) {
        const result = await discountService.getAllProductsByDiscountCode({
            ...req.body,
            discountShopId: req.user.userId,
        });

        new SuccessResponse({
            message: 'Success get products',
            metadata: result,
        }).send(res);
    }

    static async getAllDiscountsByShop(req, res) {
        const result = await discountService.getAllDiscountsByShop({
            ...req.body,
            discountShopId: req.user.userId,
        });

        new SuccessResponse({
            message: 'Success get discounts',
            metadata: result,
        }).send(res);
    }

    static async getDiscountAmount(req, res) {
        const result = await discountService.getDiscountAmount(req.body);

        new SuccessResponse({
            message: 'Success get discount amount',
            metadata: result,
        }).send(res);
    }

    static async deleteDiscount(req, res) {
        const result = await discountService.deleteDiscount({
            ...req.body,
            discountShopId: req.user.userId,
        });

        new SuccessResponse({
            message: 'Success delete discounts',
            metadata: result,
        }).send(res);
    }

    static async cancelDiscount(req, res) {
        const result = await discountService.cancelDiscount(req.body);

        new SuccessResponse({
            message: 'Success cancel discount',
            metadata: result,
        }).send(res);
    }
}

module.exports = DiscountController;
