const DatabaseConfig = require('../configuration/database-config') // store class it is not already to use
const DatabaseConfigInstead = new DatabaseConfig() // create object class , it is already to use use
const connect = DatabaseConfigInstead.connectDatabase() // called function/method inside object classlass

const reads = (request, response) => {
    connect.query(DatabaseConfigInstead.selectAll, function (err, result, fields) {
        // when select table result arg it'll store value of table
        if (!err) {
            response.status(202).json({
                message: "accepted reads",
                books: result
            })
        } else {
            throw err.message;
        }
    })
}

const readsByPrice = (request, response) => {
    const priceForCondition = request.params["price"]
    connect.query(DatabaseConfigInstead.selectByPrice, [priceForCondition], function (err, result, fields) {
        if (!err) {
            response.status(202).json({
                message: "accepted reads by price books condition",
                books: result
            })
        } else {
            throw err.message;
        }
    })
}

const readById = (request, response) => {
    let id = request.params["id"]
    connect.query(DatabaseConfigInstead.selectById, [id], function (err, result, fields) {
        if (!err) {
            // .json({...})
            // Always forced to application/json.
            response.status(202).json({
                message: "accepted read",
                books: result
            })
        } else {
            throw err.message;
        }
    })
}

const create = (request, response) => {
    const {title, price, sale} = request.body // name variable should be same name request from post man
    connect.query(DatabaseConfigInstead.insert, [title, price, sale], function (err, result, fields) {
        if (!err) {
            // response.status(201).send({...})
            // Automatically inferred based on data type.
            response.status(201).send({
                message: "created",
                title: title,
                price: price,
                sale: sale,
                status: result
            })
        } else {
            throw err.message;
        }
    })
}

const update = (request, response) => {
    const id = request.params["id"]
    const {title, price, sale} = request.body
    connect.query(DatabaseConfigInstead.update, [title, price, sale, id], function (err, result, fields) {
        if (!err) {
            response.status(202).send({
                message: "updated",
                title: title,
                price: price,
                sale: sale,
                status: result
            })
        } else {
            throw err.message;
        }
    })
}

const deleteById = (request, response) => {
    const id = request.params["id"]
    connect.query(DatabaseConfigInstead.delete, [id], function (err, result, fields) {
        if (!err) {
            response.status(200).json({
                message: "deleted"
            })
        } else {
            throw err.message;
        }
    })
}

module.exports = {
    reads,
    readsByPrice,
    readsById: readById,
    create,
    update,
    deleteById
}