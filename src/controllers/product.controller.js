'use strict';

const productService = require('../services/product.service');
const {
    CreatedResponse,
    SuccessResponse,
} = require('../core/success.response');

class ProductController {
    static async getProductByUser(req, res) {
        const result = await productService.getProductByUser({
            productId: req.params.id,
        });
        new CreatedResponse({
            message: 'OK',
            metadata: result,
        }).send(res);
    }

    static async getAllProductsByUser(req, res) {
        const result = await productService.getAllProductsByUser(req.params);
        new CreatedResponse({
            message: 'OK',
            metadata: result,
        }).send(res);
    }

    static async createProduct(req, res) {
        const result = await productService.createProduct({
            ...req.body,
            productShop: req.user.userId,
        });
        new CreatedResponse({
            message: 'Success Create Product',
            metadata: result,
        }).send(res);
    }

    static async updateProduct(req, res) {
        const result = await productService.updateProduct({
            payload: {
                ...req.body,
                productShop: req.user.userId,
            },
            productId: req.params.productId,
        });

        new SuccessResponse({
            message: 'Success Update Product',
            metadata: result,
        }).send(res);
    }

    static async getAllDraftsByShop(req, res) {
        const result = await productService.getAllDraftsByShop({
            productShop: req.user.userId,
        });

        new SuccessResponse({
            message: 'Success Get Drafts',
            metadata: result,
        }).send(res);
    }

    static async getAllPublishedByShop(req, res) {
        const result = await productService.getAllPublishedByShop({
            productShop: req.user.userId,
        });

        new SuccessResponse({
            message: 'Success Get Published Products',
            metadata: result,
        }).send(res);
    }

    static async publishProductByShop(req, res) {
        const result = await productService.publishProductByShop({
            productShop: req.user.userId,
            productId: req.params.id,
        });

        new SuccessResponse({
            message: 'Success Published Products',
            metadata: result,
        }).send(res);
    }

    static async unPublishProductByShop(req, res) {
        const result = await productService.unPublishProductByShop({
            productShop: req.user.userId,
            productId: req.params.id,
        });

        new SuccessResponse({
            message: 'Success Unpublished Products',
            metadata: result,
        }).send(res);
    }

    static async searchProductByUser(req, res) {
        const result = await productService.searchProductByUser(req.params.key);

        new SuccessResponse({
            message: 'OK',
            metadata: result,
        }).send(res);
    }
}

module.exports = ProductController;
