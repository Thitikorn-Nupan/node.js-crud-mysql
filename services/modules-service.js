const DirectSqlService = require('./direct-sql-service')

class ModulesService extends DirectSqlService {
    #express = require('express')
    #bodyParser = require('body-parser')
    get express() {
        return this.#express;
    }
    get bodyParser() {
        return this.#bodyParser;
    }
}

module.exports = ModulesService