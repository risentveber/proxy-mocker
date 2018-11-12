const uuidv1 = require('uuid/v1');
const storage = require('./storage');
const { groupBy, prop } = require('ramda');

const request = require('./request');

function createSession(params, use) {
    console.log('createSession', params, use);
    const data = { use };
    data.sessionId = uuidv1();
    let resultPromise;
    if (use) {
        resultPromise = storage.getAll(params.mockId).then((responses) => {
            console.log('-------------', responses.length);
            if (!responses.length) {
                throw new Error('No such mockId');
            }
            data.mockId = params.mockId;
            return data;
        });
    } else {
        data.mockId = uuidv1();
        resultPromise = Promise.resolve(data);
    }
    return resultPromise.then((d) => {
        storage.setKey(d.sessionId, d);
        return d;
    });
}

function getSessionById(id) {
    console.log('getSessionById', id);
    return storage.getKey(id);
}

function getResponseByKey(sessionId, key) {
    console.log('getResponse', sessionId, key);
}

function addResponseByKey(sessionId, key) {
    console.log('addResponse', sessionId, key);
}

function getKey(method, params, query) {
    const { proto, host, url } = params;
    const keys = Object.keys(query);
    keys.sort();
    return `${method}_${proto}://${host}${url}?${keys.map(k => `${k}=${query[k]}`).join('&')}`;
}


function proxyRequest(method, params, query, headers, body) {
    return request(method, params, query, headers, body)
        .then(res => ({ body: res.text, headers: res.headers, statusCode: res.status }), (e) => {
            const res = e.response;
            console.error('-------', e.toString());
            return { body: res.text, headers: res.headers, statusCode: res.status };
        });
}

function getResponse(method, params, query, headers, body) {
    const sessionId = query.mock_session_id;
    const session = storage.getKey(query.mock_session_id);
    delete query.mock_session_id; // eslint-disable-line
    if (!session) {
        return Promise.resolve({
            body: 'mock session not found',
            headers: {},
            statusCode: 500,
        });
    }
    const key = getKey(method, params, query);
    if (!session.use) {
        return proxyRequest(method, params, query, headers, body).then((data) => {
            storage.append(session.mockId, key, data);
            return data;
        });
    }
    return storage.getAll(session.mockId).then((rawData) => {
        const items = groupBy(prop('key'), rawData)[key];
        const result = items[Math.min(items.length - 1, storage.getNextCounter(sessionId, key))].data;
        return typeof result === 'string' ? JSON.parse(result) : result;
    });
}

module.exports = {
    createSession,
    getSessionById,
    addResponseByKey,
    getResponseByKey,
    getResponse,
};
