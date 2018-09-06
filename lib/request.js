const superagent = require('superagent');

module.exports = (method, { host, proto, url = '' }, query, headers) => {
    console.log(method, `${proto}://${host}${url}`, headers);

    return superagent(method, `${proto}://${host}${url}`).query(query).set(Object.assign(headers, { host }));
};
