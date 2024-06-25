const _ = require('lodash');

const getFieldDatas = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const convertSelectData = ({ keys, value }) => {
    const results = Object.fromEntries(keys.map((el) => [el, value]));

    return results;
};

const removeRubbishData = (obj, key = undefined, parent = undefined) => {
    for (let key in obj) {
        if (obj[key] === null) delete obj[key];
        else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]))
            removeRubbishData(obj[key], key, obj);
    }

    if (!Object.keys(obj).length && key && parent) delete parent[key];

    return obj;
};

module.exports = {
    convertSelectData,
    getFieldDatas,
    removeRubbishData,
};
