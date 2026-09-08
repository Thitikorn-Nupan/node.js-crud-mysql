const DirectSqlService = require('./direct-sql-service')
const express = require('express');
const bodyParser = require('body-parser');

class ModulesService extends DirectSqlService {
    // can do
    // #express = require('express')
    // #bodyParser = require('body-parser')
    get express() {
        return express;
    }
    get bodyParser() {
        return bodyParser;
    }
}

module.exports = ModulesService