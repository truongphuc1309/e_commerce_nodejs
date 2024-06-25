'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../helpers/asyncHandler');
const orderController = require('../controllers/order.controller');

router.get('/review', asyncHandler(orderController.checkoutReview));

module.exports = router;
