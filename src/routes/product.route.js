const express = require('express');

const asyncHandler = require('../helpers/asyncHandler');
const productController = require('../controllers/product.controller');
const { authenticate } = require('../auth/checkAuth');

const router = express.Router();

// For user
router.get('/:id', asyncHandler(productController.getProductByUser));
router.get('/all', asyncHandler(productController.getAllProductsByUser));
router.get('/search/:key', asyncHandler(productController.searchProductByUser));

// For shop
router.use(asyncHandler(authenticate));
router.post('/', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.get('/drafts', asyncHandler(productController.getAllDraftsByShop));
router.get('/publish', asyncHandler(productController.getAllPublishedByShop));
router.patch(
    '/publish/:id',
    asyncHandler(productController.publishProductByShop),
);
router.patch(
    '/unpublish/:id',
    asyncHandler(productController.unPublishProductByShop),
);

module.exports = router;
