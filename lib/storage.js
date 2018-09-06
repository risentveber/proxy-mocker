function append(mockId, key, data) {
    console.log('append', mockId, key, data);
}

function getAll(mockId) {
    console.log(mockId);
}

const tmpCache = {};

function setKey(key, data) {
    tmpCache[key] = data;
}

function getKeyOr(key, defaultValue) {
    return tmpCache[key] || defaultValue;
}

module.exports = {
    append,
    setKey,
    getKeyOr,
    getAll,
};
