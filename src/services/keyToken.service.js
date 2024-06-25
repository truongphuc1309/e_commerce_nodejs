'use strict';

const crypto = require('crypto');

const keyTokenRepo = require('../models/repositories/keyToken.repo');
const { createTokenPair } = require('../auth/authUtils');
const shopRepo = require('../models/repositories/shop.repo');
const { getFieldDatas } = require('../utils/dataControl');

const {
    BadRequestError,
    UnauthorizedError,
} = require('../core/error.response');

class KeyTokenService {
    static handleRefreshToken = async (user, keyStore, refreshToken) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenRepo.deleteByUserId(userId);
            throw new BadRequestError('Something went wrong');
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new UnauthorizedError('Wrong Infor');

        const foundShop = await shopRepo.findByEmail(email);
        if (!foundShop) throw new UnauthorizedError('Wrong Infor');

        const newTokens = await createTokenPair({
            payload: { userId, email },
            privateKey: keyStore.privateKey,
            publicKey: keyStore.publicKey,
        });

        await keyTokenRepo.createKeyToken({
            userId,
            publicKey: keyStore.publicKey,
            privateKey: keyStore.privateKey,
            refreshToken: newTokens.refreshToken,
            refreshTokensUsed: refreshToken,
        });

        return {
            user: getFieldDatas({
                fields: ['_id', 'email'],
                object: foundShop,
            }),
            tokens: newTokens,
        };
    };

    static generateKeys = async ({ userId, email }) => {
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({
            payload: { userId, email },
            publicKey,
            privateKey,
        });

        if (!tokens) throw new BadRequestError('Create Token Pair Failed');

        const keyStore = await keyTokenRepo.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) throw new BadRequestError('Create Key Token Failed');

        return tokens;
    };
}

module.exports = KeyTokenService;
