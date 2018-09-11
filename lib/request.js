const superagent = require('superagent');

module.exports = (method, { host, proto, url = '' }, query, headers, body) => {
    console.log(method, `${proto}://${host}${url}`, headers);

    return superagent(method, `${proto}://${host}${url}`).query(query).send(body).set(Object.assign(headers, { host }));
};
