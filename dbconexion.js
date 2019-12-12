const pgp = require('pg-promise')();
const host = '127.0.0.1',
    port = 5432,
    database = 'test_crud_students',
    user = 'postgres',
    password = '123456';
const db = pgp(`postgres://${user}:${password}@${host}:${port}/${database}`);

module.exports = db;