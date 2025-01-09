'use strict';

/************************************
 * Sub routes for                   *
 * /api/payment/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const payModel = require('../models/payment.model');
const userModel = require('../models/users.model');
const logger = require('../logs/logger');

//Add payment
router.post('/addPayment', function (req, res) {
    payModel.addPayment(req.body).then(result => {
        logger.info('Payment created successfully');
        return userModel.updateUserType(req.body);
    }).then(result => {
        res.status(201).send(result);
        logger.info('User Type updated successfully')
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;
