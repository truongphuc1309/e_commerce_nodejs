'use strict';

const jwt = require('jsonwebtoken');

const apiKeyRepo = require('../models/repositories/apiKey.repo');
const keyTokenRepo = require('../models/repositories/keyToken.repo');
const {
    BadRequestError,
    UnauthorizedError,
} = require('../core/error.response');

const HEADER = {
    APIKEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    USERID: 'x-client-id',
    REFRESH_TOKEN: 'x-rt-id',
};

const checkApiKey = async (req, res, next) => {
    const key = req.headers[HEADER.APIKEY]?.toString();

    if (!key) throw new UnauthorizedError('Fail Authen');

    const objKey = await apiKeyRepo.findByKey(key);

    if (!objKey) throw new BadRequestError('Forbidden Error');

    req.objKey = objKey;

    return next();
};

const checkPermissions = (permissions) => {
    return (req, res, next) => {
        if (!req.objKey.permissions)
            return {
                status: 'error',
                code: 401,
                message: 'Fail Authen',
            };
        const validPermission = req.objKey.permissions.includes(permissions);

        if (!validPermission)
            return {
                status: 'error',
                code: 401,
                message: 'Fail Authen',
            };
        return next();
    };
};

const authenticate = async (req, res, next) => {
    const userId = req.headers[HEADER.USERID];
    if (!userId) throw new UnauthorizedError('Authentication Error');

    const keyStore = await keyTokenRepo.getByUserId(userId);
    if (!keyStore) throw new BadRequestError('Invalid UserId');

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (refreshToken) {
        const decodedData = verifyKey(
            { key: 'userId', value: userId },
            refreshToken,
            keyStore.privateKey,
        );
        console.log('::decodedData::', decodedData);
        if (!decodedData) throw new BadRequestError('Fail to verify key');

        req.refreshToken = refreshToken;
        req.user = decodedData;
        req.keyStore = keyStore;

        return next();
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError('Authentication Error');

    const decodedData = verifyKey(
        { key: 'userId', value: userId },
        accessToken,
        keyStore.publicKey,
    );
    if (!decodedData) throw new BadRequestError('Fail to verify key');

    req.user = decodedData;
    req.keyStore = keyStore;

    return next();
};

const verifyKey = (condition, token, key) => {
    try {
        const decodedData = jwt.verify(token, key);
        if (!decodedData || decodedData[condition.key] !== condition.value)
            return null;
        return decodedData;
    } catch (err) {
        return null;
    }
};

module.exports = {
    checkApiKey,
    checkPermissions,
    authenticate,
};
