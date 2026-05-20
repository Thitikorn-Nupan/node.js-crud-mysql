const ModulesService = require('../services/modules-service')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') ,debug : true });

class DatabaseConfig extends ModulesService {
    #infoDatabase = {
        h : process.env.h ,
        u : process.env.u ,
        p : process.env.p ,
        port : process.env.pt ,
        d : process.env.d
    }
    #mysql = require('mysql2');
    connectDatabase () {
       return this.#mysql.createConnection({
            host : this.#infoDatabase.h,
            user : this.#infoDatabase.u,
            password : this.#infoDatabase.p ,
            port : this.#infoDatabase.port ,
            database : this.#infoDatabase.d
       })
    }
}

module.exports = DatabaseConfig

/*let c = new DatabaseConfig()
c.connectDatabase().connect(function (errors) {
    if (errors) console.log(errors.message)
    else console.log('connected')
})*/

