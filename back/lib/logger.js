const bunyanMongoDbLogger = require('bunyan-mongodb-logger');
require('dotenv').config();

const err = bunyanMongoDbLogger({
    name: 'Errors ',
    streams: ['stdout', 'mongodb'],
    url: process.env.MONGO_DB,
    level: "error"
});

const info = bunyanMongoDbLogger({
    name: 'Dev info',
    streams: ['stdout'],
    level: "info"
});

exports.info = (e) => { info.info(e) };
exports.error = (e) => { err.error(e) };
