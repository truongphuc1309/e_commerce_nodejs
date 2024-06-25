'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../helpers/asyncHandler');
const { authenticate } = require('../auth/checkAuth');
const discountController = require('../controllers/discount.controller');

// For user
router.get('/amount', asyncHandler(discountController.getDiscountAmount));
router.patch('/', asyncHandler(discountController.cancelDiscount));

// For shop
router.use(asyncHandler(authenticate));
router.post('/', asyncHandler(discountController.createDiscountCode));
router.get(
    '/products',
    asyncHandler(discountController.getAllProductsByDiscountCode),
);
router.get('/shop', asyncHandler(discountController.getAllDiscountsByShop));
router.delete('/', asyncHandler(discountController.deleteDiscount));

module.exports = router;
