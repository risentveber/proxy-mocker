function getDbFilepath() {
    return process.env.DB_FILEPATH || '';
}

function getPostgresDb() {
    return process.env.POSTGRES_DSN || '';
}

function getPort() {
    return Number(process.env.PORT) || 8080;
}

module.exports = {
    getDbFilepath,
    getPort,
    getPostgresDb,
};
