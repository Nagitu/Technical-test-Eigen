// knex.js
const knex = require('knex');
const knexConfig = require('../../db/knexfile');

const config = knexConfig['development'];

const db = knex(config);

module.exports = db;
