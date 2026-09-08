/**
 //  got error is i use jest as name SyntaxError: Identifier 'jest' has already been declared
 // The error occurs because Jest injects a local wrapper variable named jest into your CommonJS module scope
 How to Fix It
 Rename your variable: Change any local declaration or import named jest to something else (e.g., const { jest: myJest } = require('@jest/globals')).
 Disable injected globals: Configure Jest to turn off global injections via injectGlobals: false in your Jest Documentation configuration if you prefer importing explicit globals.
*/
const {
    describe,
    expect,
    jest: commonJest,
    test,
} = require('@jest/globals');
const directSqlServiceObj = require('../services/direct-sql-service');
const directSqlService = new directSqlServiceObj();

// jest.fn() creates a mock function. It records how the function is called
// and lets each test provide a fake database callback without using MySQL.
const mockQuery = commonJest.fn();

// Replace DatabaseConfig before endpoint-control.js is imported.
// This prevents the unit test from opening a real database connection.
commonJest.mock('../configuration/database-config', () => {
    return class DatabaseConfig {
        // These getters provide the same SQL values used by the real config.
        get selectAll() {
            return directSqlService.selectAll;
        }
        get selectById() {
            return directSqlService.selectById;
        }

        get selectByPrice() {
            return directSqlService.selectByPrice;
        }

        get insert() {
            return directSqlService.insert;
        }

        get update() {
            return directSqlService.update;
        }

        get delete() {
            return directSqlService.delete;
        }

        connectDatabase() {
            return {
                query: mockQuery,
            };
        }
    };
});

// Import the functions after mocking their database dependency.
const {reads, readsById, readsByPrice, create, update, deleteById} = require('../controller/endpoint-control');

// describe() groups related tests. Each test() checks one expected behavior.
describe('test endpoint-control.js', () => {

    test('reads returns an accepted response', () => {
        const books = [
            {bid: 1, name: 'Clean Code', price: 1, sale: 5},
            {bid: 2, name: 'Refactoring', price: 1, sale: 5},
        ];
        const request = {};
        const response = {
            // mockReturnThis() makes response.status(202) return response,
            // allowing the controller to call response.status(...).json(...).
            status: commonJest.fn().mockReturnThis(),
            json: commonJest.fn(),
        };

        // Simulate a successful database query:
        // null means no error, books is the query result, and [] represents fields.
        mockQuery.mockImplementationOnce((query, callback) => {
            callback(null, books, []); // work for => function (err, result, fields) {}
        });

        // Execute the controller function with fake request and response objects.
        reads(request, response);

        // expect() verifies that the mock and response were used as expected.
        expect(mockQuery).toHaveBeenCalledWith(directSqlService.selectAll, expect.any(Function));
        /*
        *** expect(mockQuery) tells Jest which mock function to inspect.
        *** expect.any(Function) means the second argument can be any function In the controller, this is the database callback
        connect.query(DatabaseConfigInstead.selectAll, function (err, result, fields) {
        });
        * */

        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            message: 'accepted reads',
            books,
        });
    });

    test('readById returns an accepted response', () => {
        const books = [
            {bid: 1, name: 'Clean Code', price: 1, sale: 5},
        ];
        const request = {
            params: {
                id: 1,
            },
        };
        const response = {
            status: commonJest.fn().mockReturnThis(),
            json: commonJest.fn(),
        };

        mockQuery.mockImplementationOnce((query, values, callback) => {
            callback(null, books, []);
        });

        readsById(request, response);

        expect(mockQuery).toHaveBeenCalledWith(
            directSqlService.selectById,
            [request.params.id], // ***
            expect.any(Function),
        );
        /*
           *** expect(mockQuery) tells Jest which mock function to inspect.
           *** expect.any(Function) means the second argument can be any function In the controller, this is the database callback
           connect.query(DatabaseConfigInstead.selectById, [id], function (err, result, fields) {
           })
        */
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            message: 'accepted read',
            books,
        });
    });

    test('readByPrice returns an accepted response', () => {
        const books = [
            {bid: 1, name: 'Clean Code', price: 1, sale: 5},
            {bid: 2, name: 'Refactoring', price: 1, sale: 5},
        ];
        const request = {
            params: {
                price: 300,
            },
        };
        const response = {
            status: commonJest.fn().mockReturnThis(),
            json: commonJest.fn(),
        };

        mockQuery.mockImplementationOnce((query, values, callback) => {
            callback(null, books, []);
        });

        readsByPrice(request, response);

        expect(mockQuery).toHaveBeenCalledWith(
            directSqlService.selectByPrice,
            [request.params.price],
            expect.any(Function),
        );
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            message: 'accepted reads by price books condition',
            books,
        });
    });

    test('create returns a created response', () => {
        const request = {
            body: {
                title: 'Clean Code',
                price: 35,
                sale: 5,
            },
        };
        const result = {
            insertId: 1,
            affectedRows: 1,
        };
        const response = {
            status: commonJest.fn().mockReturnThis(),
            send: commonJest.fn(),
        };

        mockQuery.mockImplementationOnce((query, values, callback) => {
            callback(null, result, []);
        });

        create(request, response);

        expect(mockQuery).toHaveBeenCalledWith(
            directSqlService.insert,
            [request.body.title, request.body.price, request.body.sale],
            expect.any(Function),
        );
        /*
         *** expect(mockQuery) tells Jest which mock function to inspect.
         *** expect.any(Function) means the second argument can be any function In the controller, this is the database callback
         connect.query(DatabaseConfigInstead.insert, [title, price, sale], function (err, result, fields) {
         })
        */
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.send).toHaveBeenCalledWith({
            message: 'created',
            title: request.body.title,
            price: request.body.price,
            sale: request.body.sale,
            status: result,
        });
    });

    test('update returns a accepted response', () => {
        const request = {
            body: {
                title: 'Clean Code',
                price: 35,
                sale: 5,
            },
            params : {
                id: 1,
            }
        };
        const result = {
            insertId: 1,
            affectedRows: 1,
        };
        const response = {
            status: commonJest.fn().mockReturnThis(),
            send: commonJest.fn(),
        };

        mockQuery.mockImplementationOnce((query, values, callback) => {
            callback(null, result, []);
        });

        update(request, response);

        expect(mockQuery).toHaveBeenCalledWith(
            directSqlService.update,
            [request.body.title, request.body.price, request.body.sale , request.params.id],
            expect.any(Function),
        );
        /*
         *** expect(mockQuery) tells Jest which mock function to inspect.
         *** expect.any(Function) means the second argument can be any function In the controller, this is the database callback
         connect.query(DatabaseConfigInstead.update, [title, price, sale, id], function (err, result, fields) {
         })
        */
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.send).toHaveBeenCalledWith({
            message: 'updated',
            title: request.body.title,
            price: request.body.price,
            sale: request.body.sale,
            status: result,
        });
    });

    test('delete returns a ok response', () => {
        const request = {
            params : {
                id: 1,
            }
        };
        const result = {
            insertId: 1,
            affectedRows: 1,
        };
        const response = {
            status: commonJest.fn().mockReturnThis(),
            json: commonJest.fn(),
        };

        mockQuery.mockImplementationOnce((query, values, callback) => {
            callback(null, result, []);
        });

        deleteById(request, response);

        expect(mockQuery).toHaveBeenCalledWith(
            directSqlService.delete,
            [request.params.id],
            expect.any(Function),
        );
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({
            message: 'deleted',
        });
    });

});
