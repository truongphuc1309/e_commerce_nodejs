'use strict';

const { SuccessResponse } = require('../core/success.response');
const orderService = require('../services/order.service');

class OrderController {
    static async checkoutReview(req, res) {
        const result = await orderService.checkoutReview(req.body);

        new SuccessResponse({
            message: 'Success',
            metadata: result,
        }).send(res);
    }
}

module.exports = OrderController;
