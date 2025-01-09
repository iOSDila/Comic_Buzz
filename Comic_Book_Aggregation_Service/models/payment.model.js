'use strict';

/************************************
 * All the functions related to     *
 * payment data model is included      *
 * **********************************
 */

const mongoose = require('mongoose');
require('../helpers/db.helper');

let paySchema = mongoose.Schema({ //creating a schema
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    card_num: {
        type: String,
        required: true,
        unique: true
    },
    expiry: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    payment_created_date: {
        type: Date,
        default: Date.now
    }
});

var payModel = mongoose.model('payments', paySchema);

//add payment
exports.addPayment = function (body) {
    return new Promise(function (resolve, reject) {
        let newPay = new payModel(body);
        newPay.save().then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};