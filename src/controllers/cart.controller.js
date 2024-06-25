'use strict';

'use strict';

const cartService = require('../services/cart.service');
const {
    SuccessResponse,
    CreatedResponse,
} = require('../core/success.response');

class CartController {
    static async addToCart(req, res) {
        const result = await cartService.addToCart(req.body);

        new SuccessResponse({
            message: 'Success Add products to cart',
            metadata: result,
        }).send(res);
    }

    static async updateCart(req, res) {
        const result = await cartService.updateCart(req.body);

        new SuccessResponse({
            message: 'Success update',
            metadata: result,
        }).send(res);
    }

    static async deleteProductsFromCart(req, res) {
        const result = await cartService.deleteProductsFromCart(req.body);

        new SuccessResponse({
            message: 'Success delete',
            metadata: result,
        }).send(res);
    }
}

module.exports = CartController;
