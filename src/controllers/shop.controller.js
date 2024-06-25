'use strict';

const accessService = require('../services/shop.access.service');
const {
    CreatedResponse,
    SuccessResponse,
} = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');
const tokenService = require('../services/keyToken.service');

class ShopController {
    handleRefreshToken = async (req, res) => {
        const { user, keyStore, refreshToken } = req;
        const result = await tokenService.handleRefreshToken(
            user,
            keyStore,
            refreshToken,
        );
        new SuccessResponse({
            message: 'Creat New Tokens Successfully',
            metadata: result,
        }).send(res);
    };

    logIn = async (req, res) => {
        const result = await accessService.logIn(req.body);
        new SuccessResponse({
            message: 'Success Login',
            metadata: result,
        }).send(res);
    };

    signUp = async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            throw new BadRequestError('Params are invalid');

        const result = await accessService.signUp(req.body);
        new CreatedResponse({
            message: 'Success Register',
            metadata: result,
        }).send(res);
    };

    logOut = async (req, res) => {
        new SuccessResponse({
            message: 'Success Logout',
            metadata: accessService.logOut(req.keyStore),
        }).send(res);
    };
}

module.exports = new ShopController();
