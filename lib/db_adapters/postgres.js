const { Client } = require('pg');

function append(mockId, key, data) {
    const query = {
        // give the query a unique name
        name: 'append-mock',
        text: 'INSERT INTO responses(mock_id, key, data, time) VALUES($1, $2, $3, $4) RETURNING *',
        values: [mockId, key, data, (new Date()).getTime()],
    };
    return this.client.query(query)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack));
}

function getAll(mockId) {
    const query = {
        name: 'get-mocks-by-id',
        text: 'SELECT * FROM responses WHERE mock_id = $1',
        values: [mockId],
    };
    return this.client.query(query)
        .then(res => Array.from(res.rows))
        .catch(e => console.error(e.stack));
}

function Create({
    host, database, user, password, port = 5432,
}) {
    const result = { getAll, append };
    function connect() {
        const client = new Client({
            user,
            host,
            database,
            password,
            port,
        });
        client.connect().then(() => {
            console.log('connection established');
            result.client = client;
        }, (e) => {
            console.error(e.stack);
            setTimeout(connect, 3000);
        });
    }

    connect();

    return result;
}

module.exports = Create;
