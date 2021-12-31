const {pool, Pool} = require('pg')

const dbPool  = new Pool({
    // database: 'personal_web',
    // port: 5432,
    // user: 'postgres',
    // password: 'root'

    connectionString : 'postgres://xgecjhiphxoxsg:345193fbbe90dee28124a6de54766e1fa8fa32bb69b202cc05bf2d7ddda4e257@ec2-34-230-133-163.compute-1.amazonaws.com:5432/dkjkj2tstd35g',
    ssl: {
        rejectUnauthorized: false,
    },
})

module.exports = dbPool