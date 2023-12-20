require('dotenv').config();
const Pool = require('pg').Pool;
const { types } = require('pg');
types.setTypeParser(1700, (val) => parseFloat(val)); // NUMERIC in postgres CONVVERTS TO JavaScript 64 BIT FLOAT VALUES
types.setTypeParser(700,(val) => parseFloat(val));  // FLOAT4 in postgres CONVVERTS TO JavaScript 64 BIT FLOAT VALUES
types.setTypeParser(701,(val)=>parseFloat(val)); // FLOAT8 in postgres CONVVERTS TO JavaScript 64 BIT FLOAT VALUES
const pool = new Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'users_crud'
});


module.exports = pool;