function append(mockId, key, data) {
    console.log('append', mockId, key, data);
}

function getAll(mockId) {
    console.log(mockId);
}

const LRU = require('lru-cache');


const cache = LRU({
    maxAge: 1000 * 60 * 60,
});

function setKey(key, data) {
    cache.set(key, data);
}

function getKeyOr(key, defaultValue) {
    return cache.get(key) || defaultValue;
}

function getKey(key, defaultValue) {
    return cache.get(key);
}

function getNextCounter(sessionId, key) {
    const counter = (cache.get(sessionId + key) || 0);
    cache.get(sessionId + key, counter + 1);
    return counter;
}

module.exports = {
    append,
    getAll,
    getKey,
    getKeyOr,
    getNextCounter,
    setKey,
};
