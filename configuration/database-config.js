const ModulesService = require('../services/modules-service')
const log = require('../log/logging').logger
const path = require('path');
const mysql = require('mysql2')

require('dotenv').config({path: path.resolve(__dirname, '../.env'), debug: true});

class DatabaseConfig extends ModulesService {
    #infoDatabase = {
        host: process.env['host'],
        username: process.env['m_username'],
        password: process.env['password'],
        port: process.env['port'],
        database: process.env['database']
    }
    connectDatabase() {
        // log.debug(JSON.stringify(this.#infoDatabase))
        return mysql.createConnection({
            host: this.#infoDatabase.host,
            user: this.#infoDatabase.username,
            password: this.#infoDatabase.password,
            port: this.#infoDatabase.port,
            database: this.#infoDatabase.database,
        })
    }
}

module.exports = DatabaseConfig


/**new DatabaseConfig().connectDatabase(function (errors) {
    if (errors) log.debug(errors.message)
    else log.debug('connected')
})*/

