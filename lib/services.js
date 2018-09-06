const uuidv1 = require('uuid/v1');
const storage = require('./storage');

function createSession(a, use) {
    console.log('createSession', a, use);
    return uuidv1();
}

function getSessionById(id) {
    console.log('getSessionById', id);
}

function getResponse(sessionId, key) {
    console.log('getResponse', sessionId, key);
}

function addResponse(sessionId, key) {
    console.log('addResponse', sessionId, key);
}


module.exports = {
    createSession,
    getSessionById,
    addResponse,
    getResponse,
};
