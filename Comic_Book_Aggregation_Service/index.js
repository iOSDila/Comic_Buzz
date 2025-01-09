'use strict';

/*****************************************
 * Initialize the Aggregation Service for*
 * Comic Book App - Snap&Hear            *
 * ***************************************
 */

const express = require('express');
const cors = require('cors');
const logger = require('./logs/logger');

// Initializing ExpressJS
const app = express();
app.use(cors());
app.use(express.json());

//Initializing routes
const route_manager = require('./controllers/route.manager');
app.use('/aggregation-service/api',route_manager);

// Server Startup
let PORT = process.env.PORT || 3000;
module.exports = app.listen(PORT, function(error) {
    if (error) {
        logger.error("error");
    }
    logger.info('Service is Running on port ' + PORT);
});