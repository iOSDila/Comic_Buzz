'use strict';

/************************************
 * Sub routes for                   *
 * /api/users/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const userModel = require('../models/users.model');
const logger = require('../logs/logger');

//Authenticate a user by received payload
router.post('/authenticate', function (req, res) {
    userModel.authenticateUser(req.body).then(result => {
        res.status(200).send(result);
        logger.info('User validate function executed successfully');
    }).catch(err => {
        res.send(err);
        logger.error(err);
    });
});

//Add user by username
router.post('/addUser', function (req, res) {
    req.body.role = 'General User'
    userModel.addUser(req.body).then(result => {
        res.status(201).send(result);
        logger.info('User created successfully')
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

//Retrieve user by username
router.get('/usernames/:username', function (req, res) {
    userModel.getUserByUsername(req.params.username).then(result => {
        res.status(200).send(result);
        logger.info('User retrieved by username successfully');
    }).catch(err => {
        res.send(err);
        logger.error(err);
    });
});

//Retrieve user by phone number
router.get('/phone_numbers/:phone_number', function (req, res) {
    userModel.getUserByPhoneNum(req.params.phone_number).then(result => {
        res.status(200).send(result);
        logger.info('User retrieved by phone_number successfully');
    }).catch(err => {
        res.send(err);
        logger.error(err);
    });
});

//Retrieve all the users
router.get('/', function (req, res) {
    userModel.getUsers().then(result => {
        res.status(200).send(result);
        logger.info('All Users successfully');
    }).catch(err => {
        res.send(err);
        logger.error(err);
    });
});

//Update user profile
router.put('/updateUser', function (req, res) {
    userModel.updateUser(req.body).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
});

//reset password
router.put('/updatePassword', function (req, res) {
    userModel.updatePassword(req.body).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
});

router.delete('/deleteUser/:username', function (req, res) {
    userModel.deleteUser(req.params.username).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
});

module.exports = router;
