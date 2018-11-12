const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

function append(mockId, key, data) {
    this.db.get('responses')
        .push({
            mockId, key, data, time: (new Date()).getTime(),
        })
        .write();
}

function getAll(mockId) {
    return this.db.get('responses')
        .filter({ mockId })
        .sortBy('time')
        .value();
}

function Create(PATH) {
    const adapter = new FileSync(PATH);
    const db = low(adapter);
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ responses: [], mocks: [] })
        .write();
    return { db, append, getAll };
}

module.exports = Create;
