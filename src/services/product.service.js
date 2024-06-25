'use strict';

const {
    productModel,
    clothingModel,
    electricsModel,
} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const productRepo = require('../models/repositories/product.repo');
const inventRepo = require('../models/repositories/inventory.repo');
const { removeRubbishData } = require('../utils/dataControl');

class ProductFactory {
    static registerProductType(type, ref) {
        ProductFactory[type] = ref;
    }

    static async createProduct(payload) {
        const productType = ProductFactory[payload.productType];
        if (!productType) throw new BadRequestError('Invalid Type Product');

        return new productType(payload).createProduct();
    }

    static async updateProduct({ productId, payload }) {
        const productType = ProductFactory[payload.productType];
        if (!productType) throw new BadRequestError('Invalid Type Product');

        return new productType(payload).updateProduct(productId);
    }
}

class ProductService {
    static createProduct = ProductFactory.createProduct;

    static updateProduct = ProductFactory.updateProduct;

    static async getProductByUser({ productId }) {
        const unSelect = ['__v'];
        const filter = { _id: productId, isPublished: true };
        return await productRepo.getProduct({ filter, unSelect });
    }

    static async getAllProductsByUser({
        sortBy = 'ctime',
        page = 1,
        limit = 50,
    }) {
        const select = ['productName', 'productPrice', 'productThumb'];
        return await productRepo.getAllProducts({
            filter: { isPublished: true },
            sortBy,
            page,
            limit,
            select,
        });
    }

    static async getAllDraftsByShop({ productShop, limit = 50, skip = 0 }) {
        const condition = { productShop, isDraft: true };
        return await productRepo.getSomeProductsByShop({
            condition,
            limit,
            skip,
        });
    }

    static async getAllPublishedByShop({ productShop, limit = 50, skip = 0 }) {
        const condition = { productShop, isPublished: true };
        return await productRepo.getAllPublishedByShop({
            condition,
            limit,
            skip,
        });
    }

    static async publishProductByShop({ productShop, productId }) {
        const filter = { productShop, _id: productId };
        const updation = { isDraft: false, isPublished: true };

        let updatedProduct = null;

        try {
            updatedProduct = await productRepo.updateProduct({
                filter,
                updation,
            });
        } catch {
            throw new BadRequestError('Invalid UserId');
        }

        return updatedProduct ? true : false;
    }

    static async unPublishProductByShop({ productShop, productId }) {
        const filter = { productShop, _id: productId };
        const updation = { isDraft: true, isPublished: false };

        let updatedProduct = null;

        try {
            updatedProduct = await productRepo.updateProduct({
                filter,
                updation,
            });
        } catch {
            throw new BadRequestError('Invalid UserId');
        }

        return updatedProduct ? true : false;
    }

    static async searchProductByUser(keySearch) {
        return await productRepo.searchProductByUser(keySearch);
    }
}

class Product {
    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productShop,
        productAttribute,
    }) {
        this.productName = productName;
        this.productThumb = productThumb;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productShop = productShop;
        this.productAttribute = productAttribute;
    }

    async createProduct(id) {
        const newProduct = await productModel.create({
            ...this,
            _id: id,
        });

        const newInvent = await inventRepo.createInvent({
            inventShopId: this.productShop,
            inventProductId: id,
            inventStock: this.productQuantity,
        });

        return {
            product: newProduct,
            inventory: newInvent,
        };
    }

    async updateProduct(productId, updation) {
        return await productRepo.updateProductById({
            productId,
            updation,
            model: productModel,
        });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.productAttribute,
            productShop: this.productShop,
        });
        if (!newClothing) throw new BadRequestError('Fail create clothing');

        const newProduct = super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Fail create product');

        return newProduct;
    }

    async updateProduct(productId) {
        let updateParams = removeRubbishData(this);

        if (!Object.keys(updateParams).length)
            throw new BadRequestError('Invalid Updatetion');

        if (updateParams.productAttribute)
            productRepo.updateProductById({
                productId,
                model: clothingModel,
                updation: updateParams.productAttribute,
            });

        return await super.updateProduct(productId, updateParams);
    }
}

class Electrics extends Product {
    async createProduct() {
        const newElectrics = await electricsModel.create({
            ...this.productAttribute,
            productShop: this.productShop,
        });
        if (!newElectrics) throw new BadRequestError('Fail create electrics');

        const newProduct = super.createProduct(newElectrics._id);
        if (!newProduct) throw new BadRequestError('Fail create product');

        return newProduct;
    }

    async updateProduct(productId) {
        let updateParams = removeRubbishData(this);

        if (!Object.keys(updateParams).length)
            throw new BadRequestError('Invalid Updatetion');

        if (updateParams.productAttribute)
            productRepo.updateProductById({
                productId,
                model: electricsModel,
                updation: updateParams.productAttribute,
            });

        return await super.updateProduct(productId, updateParams);
    }
}

ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electrics', Electrics);

module.exports = ProductService;
