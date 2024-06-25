'use strict';
const cartRepo = require('../models/repositories/cart.repo');
const productRepo = require('../models/repositories/product.repo');
const { NotFoundError } = require('../core/error.response');

class CartService {
    static async addToCart({ userId, products = {} }) {
        const foundCart = await cartRepo.findCartByUserId(userId);
        if (!foundCart) await cartRepo.createCart(userId);

        const foundProducts = await productRepo.getProduct({
            filter: {
                _id: products.productId,
            },
        });
        if (!foundProducts) throw new NotFoundError('Invalid Product');

        const doesIncludeProducts = await cartRepo.includeProducts({
            userId,
            productId: products.productId,
        });

        products.price = foundProducts.productPrice;

        if (!doesIncludeProducts)
            return await cartRepo.pushProducts({ userId, products });

        return await cartRepo.updateProductQuantity({ userId, products });
    }

    /*
        products: {
            productId,
            shopId,
            oldQuantity,
            quantity,
            version,
        } 
    */

    static async updateCart({ userId, products }) {
        const foundProduct = await productRepo.getProduct({
            filter: {
                _id: products.productId,
            },
        });
        if (!foundProduct) throw new NotFoundError('Invalid product');

        const cartIncludedProducts = await cartRepo.includeProducts({
            userId,
            productId: products.productId,
        });
        if (!cartIncludedProducts) throw new NotFoundError('Invalid Product');

        const foundCart = await cartRepo.findCartByUserId(userId);
        if (!foundCart) throw new NotFoundError('Invalid user');

        const productsDb = cartIncludedProducts.cartProducts.find(
            (product) => product.productId === products.productId,
        );
        products.oldQuantity = productsDb.quantity;

        if (products.quantity === 0) {
            return this.deleteProductsFromCart({ userId, products });
        }

        return await cartRepo.updateProductQuantity({ userId, products });
    }

    static async deleteProductsFromCart({ userId, products }) {
        const foundCart = await cartRepo.findCartByUserId(userId);
        if (!foundCart) throw new NotFoundError('Invalid user');

        const foundProduct = await productRepo.getProduct({
            filter: {
                _id: products.productId,
            },
        });
        if (!foundProduct) throw new NotFoundError('Invalid product');

        const cartIncludedProducts = await cartRepo.includeProducts({
            userId,
            productId: products.productId,
        });
        if (!cartIncludedProducts)
            throw new NotFoundError('Cart have not this products');

        const productsDb = cartIncludedProducts.cartProducts.find(
            (product) => product.productId === products.productId,
        );

        return await cartRepo.pullProductsFromCart({
            userId,
            products: productsDb,
        });
    }
}

module.exports = CartService;
