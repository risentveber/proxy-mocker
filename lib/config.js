function getDbFilepath() {
    return process.env.DB_FILEPATH || '';
}

function getPort() {
    return Number(process.env.PORT) || 8080;
}

module.exports = {
    getDbFilepath,
    getPort,
};
