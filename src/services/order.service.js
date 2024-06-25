'use strict';

const discountService = require('../services/discount.service');
const cartRepo = require('../models/repositories/cart.repo');
const { NotFoundError } = require('../core/error.response');

/*
{
    userId,
    products: [
        {
            productId,
            shopId,
            price,
            quantity,
            discountCodes : [],
        }
    ]
}
*/

class OrderService {
    static async checkoutReview({ userId, products }) {
        const foundCart = await cartRepo.findCartByUserId(userId);
        if (!foundCart) throw NotFoundError('Invalid Cart');

        for (let i = 0; i < products.length; i++) {
            const isInCart = cartRepo.includeProducts({
                userId,
                productId: products[i].productId,
            });

            if (!isInCart) throw NotFoundError('Invalid Product');
        }
        const productIds = products.map((product) => product.productId);
        const { cartProducts } = foundCart;
        const checkedProducts = cartProducts.filter((product) =>
            productIds.includes(product.productId),
        );

        products = products.map((product) => {
            const checkedProduct = checkedProducts.find(
                (e) => e.productId === product.productId,
            );
            product.quantity = checkedProduct.quantity;
            product.price = checkedProduct.price;

            return product;
        });

        const firstPrice = products.reduce(
            (acc, product) => acc + product.quantity * product.price,
            0,
        );

        const totalDiscount = await products.reduce(
            async (previousPromise, currentProduct) => {
                let acc = await previousPromise;
                if (currentProduct.discountCodes?.length > 0) {
                    const discount = await currentProduct.discountCodes.reduce(
                        async (previousPromise, currentDiscount) => {
                            const acc = await previousPromise;
                            const { discount: discountAmount } =
                                await discountService.getDiscountAmount({
                                    discountCode: currentDiscount,
                                    discountShopId: currentProduct.shopId,
                                    userId,
                                    products: [currentProduct],
                                });

                            return acc + discountAmount;
                        },
                        Promise.resolve(0),
                    );

                    acc += discount;
                }
                return acc;
            },
            Promise.resolve(0),
        );

        return {
            products,
            ship: 0,
            firstPrice,
            totalDiscount,
            totalPrice: firstPrice - totalDiscount,
        };
    }
}

module.exports = OrderService;
