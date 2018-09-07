const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./data/db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ responses: [], mocks: [] })
    .write();

function append(mockId, key, data) {
    db.get('responses')
        .push({
            mockId, key, data, time: (new Date()).getTime(),
        })
        .write();
}

function getAll(mockId) {
    return db.get('responses')
        .filter({ mockId })
        .sortBy('time')
        .value();
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
