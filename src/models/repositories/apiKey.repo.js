'use strict';

const apiKeyModel = require('../apiKey.model');

const findByKey = async (key) => {
    try {
        const objKey = await apiKeyModel.findOne({ key }).lean();
        return objKey ? objKey : null;
    } catch (error) {
        return null;
    }
};

module.exports = {
    findByKey,
};
