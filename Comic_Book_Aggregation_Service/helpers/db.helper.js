'use strict';

/********************************************
 * Establish the connection the database    *
 * ******************************************
 */

const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');
const logger = require('../logs/logger');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Establish the connection with mongodb
mongoose.connect('mongodb://' + dbConfig.mongo.username + ':' + dbConfig.mongo.password + '@' + dbConfig.mongo.hostname + ':' + dbConfig.mongo.port + '/' + dbConfig.mongo.dbname).then(function () {
    logger.info('Connected to MongoDB');
}).catch(err => {
    logger.error(err);
});
