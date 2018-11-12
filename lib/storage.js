const LRU = require('lru-cache');
const config = require('./config');
const CreateFileStorage = require('./db_adapters/file');
const CreatePostgresStorage = require('./db_adapters/postgres');

// session level runtime storage
const cacheIface = LRU({ maxAge: 1000 * 60 * 60 }); // set key

function setKey(key, data) {
    cacheIface.set(key, data);
}

function getKeyOr(key, defaultValue) {
    return cacheIface.get(key) || defaultValue;
}

function getKey(key) {
    return cacheIface.get(key);
}

function getNextCounter(sessionId, key) {
    const counter = (cacheIface.get(sessionId + key) || 0);
    cacheIface.get(sessionId + key, counter + 1);
    return counter;
}

// persistent storage
let storageIface; // TODO add factory here
if (process.env.POSTGRES_DATABASE) {
    storageIface = CreatePostgresStorage({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
    });
} else {
    storageIface = CreateFileStorage(config.getDbFilepath());
}

function append(mockId, key, data) {
    return storageIface.append(mockId, key, data);
}

function getAll(mockId) {
    return storageIface.getAll(mockId);
}

module.exports = {
    append,
    getAll,
    getKey,
    getKeyOr,
    getNextCounter,
    setKey,
};
