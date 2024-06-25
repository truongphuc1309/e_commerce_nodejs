const inventoryModel = require('../inventoryModel');

const createInvent = async ({
    inventProductId,
    inventShopId,
    inventStock,
    inventLocation = 'unknown',
}) => {
    return await inventoryModel.create({
        inventProductId,
        inventShopId,
        inventLocation,
        inventStock,
    });
};

module.exports = {
    createInvent,
};
