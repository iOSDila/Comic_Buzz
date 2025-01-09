/************************************
 * Defines the configurations       *
 * for the application              *
 * **********************************
 */

getMongoHostname = function () {
        return 'ds155596.mlab.com';
};

getMongoDBName = function () {
        return 'snap_and_hear';
};

getMongoDBPort = function () {
        return '55596';
};

var dbConfig = {
        mongo: {}
};

//Setting mongodb configs
dbConfig.mongo.hostname = getMongoHostname();
dbConfig.mongo.dbname = getMongoDBName();
dbConfig.mongo.port = getMongoDBPort();
dbConfig.mongo.username = 'snap.hear';
dbConfig.mongo.password = 'snap8hear';

module.exports = dbConfig;
