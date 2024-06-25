const express = require('express');
const router = express.Router();

const ShopController = require('../controllers/shop.controller');
const asyncHandler = require('../helpers/asyncHandler');
const { authenticate } = require('../auth/checkAuth');

router.post('/signup', asyncHandler(ShopController.signUp));
router.post('/login', asyncHandler(ShopController.logIn));

router.use(asyncHandler(authenticate));

router.get('/logout', asyncHandler(ShopController.logOut));
router.post('/refreshtoken', asyncHandler(ShopController.handleRefreshToken));

module.exports = router;
