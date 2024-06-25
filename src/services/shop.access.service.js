'use strict';

const bcrypt = require('bcrypt');

const shopModel = require('../models/shop.model');
const { getFieldDatas } = require('../utils/dataControl');
const {
    BadRequestError,
    UnauthorizedError,
} = require('../core/error.response');
const shopRepo = require('../models/repositories/shop.repo');
const keyTokenService = require('./keyToken.service');

const SHOP_ROLES = {
    SHOP: 'r001',
    WRITTER: 'r002',
    ADMIN: 'r003',
};

class AccessService {
    static logIn = async ({ email, password }) => {
        const foundShop = await shopRepo.findByEmail(email);

        if (!foundShop) throw new UnauthorizedError('Wrong information');

        const isCorrectPassWord = await bcrypt.compare(
            password,
            foundShop.password,
        );

        if (!isCorrectPassWord)
            throw new UnauthorizedError('Wrong information');

        const tokens = await keyTokenService.generateKeys({
            userId: foundShop._id,
            email,
        });

        return {
            shop: foundShop,
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        const shopHolder = await shopRepo.findByEmail(email);

        if (shopHolder) throw new BadRequestError('Shop already used');

        const hashedPassword = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name,
            email,
            password: hashedPassword,
            roles: SHOP_ROLES.SHOP,
        });

        if (newShop) {
            const tokens = await keyTokenService.generateKeys({
                userId: newShop._id,
                email,
            });

            return {
                shop: getFieldDatas({
                    fields: ['_id', 'name', 'email'],
                    object: newShop,
                }),
                tokens,
            };
        }

        throw new BadRequestError('Create New Shop Failed');
    };

    static logOut = async (keyStore) => {
        const deletedKey = await keyTokenService.deleteById(keyStore._id);

        if (!deletedKey) throw new BadRequestError('Failed Logout');

        return deletedKey;
    };
}

module.exports = AccessService;
