const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'login-page',
    user: 'prabh',
    password: 'Asdfghjkl@6387',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

module.exports = {
    connect: () => sql.connect(config),
    sql,
}