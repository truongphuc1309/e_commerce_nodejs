'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../helpers/asyncHandler');
const cartController = require('../controllers/cart.controller');

router.patch('/', asyncHandler(cartController.addToCart));
router.patch('/products', asyncHandler(cartController.updateCart));
router.delete('/products', asyncHandler(cartController.deleteProductsFromCart));

module.exports = router;
