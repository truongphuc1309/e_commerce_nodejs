const express = require('express');

const router = express.Router();
const shopRouter = require('./shop.route');
const productRouter = require('./product.route');
const discountRouter = require('./discount.route');
const cartRouter = require('./cart.route');
const orderRouter = require('./order.route');
const { checkApiKey, checkPermissions } = require('../auth/checkAuth');
const asyncHandler = require('../helpers/asyncHandler');

router.use(asyncHandler(checkApiKey));
router.use(checkPermissions('0000'));
router.use('/api/shop', shopRouter);
router.use('/api/product', productRouter);
router.use('/api/discount', discountRouter);
router.use('/api/cart', cartRouter);
router.use('/api/order', orderRouter);

module.exports = router;
