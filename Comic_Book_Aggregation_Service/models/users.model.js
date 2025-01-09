'use strict';

/************************************
 * All the functions related to     *
 * user data model is included      *
 * **********************************
 */

const mongoose = require('mongoose');
require('../helpers/db.helper');

let userSchema = mongoose.Schema({ //creating a schema
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone_num: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
    },
    user_created_date: {
        type: Date,
        default: Date.now
    }
});

var userModel = mongoose.model('users', userSchema); //creating a model from the schema

//authenticate user
exports.authenticateUser = function (body) {
    return new Promise(function (resolve, reject) {
        userModel.find({ username: body.username, password: body.password }).exec().then(data => {
            if (data.length == 0) {
                resolve({
                    authenticated: false
                });
            } else {
                resolve({
                    phone_num: data[0].phone_num,
                    username: data[0].username,
                    email: data[0].email,
                    role: data[0].role,
                    birth_date: data[0].birth_date,
                    authenticated: true
                });
            }
        }).catch(err => {
            reject(err);
        });
    })
};

//add user
exports.addUser = function (body) {
    return new Promise(function (resolve, reject) {
        let newUser = new userModel(body);
        newUser.save().then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};

//retrieve users by username
exports.getUserByUsername = function (username) {
    return new Promise(function (resolve, reject) {
        userModel.find({ username: username }).exec().then(data => {
            resolve({
                phone_num: data[0].phone_num,
                name: data[0].name,
                username: data[0].username,
                email: data[0].email,
                role: data[0].role,
                birth_date: data[0].birth_date,
                user_created_date: data[0].user_created_date
            });
        }).catch(err => {
            reject(err);
        });
    });
};

//retrieve users by phone number
exports.getUserByPhoneNum = function (phone_num) {
    return new Promise(function (resolve, reject) {
        userModel.find({ phone_num: phone_num }).exec().then(data => {
            resolve({
                phone_num: data[0].phone_num,
                name: data[0].name,
                username: data[0].username,
                email: data[0].email,
                role: data[0].role,
                birth_date: data[0].birth_date,
                user_created_date: data[0].user_created_date
            });
        }).catch(err => {
            reject(err);
        });
    });
};

//retrieve all the users
exports.getUsers = function () {
    return new Promise(function (resolve, reject) {
        userModel.find({}, { password: 0 }).exec().then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};

exports.updateUser = function (updateBody) {
    return new Promise(function (resolve, reject) {
        var newUserBody = {
            phone_num: updateBody.phone_num,
            name: updateBody.name,
            username: updateBody.username,
            email: updateBody.email,
            birth_date: updateBody.birth_date
        };
        if(updateBody.role){
            newUserBody.role = updateBody.role
        }
        userModel.update({ username: updateBody.username }, newUserBody).exec().then(function (value) {
            resolve({ status: 200, "data": value });
        }).catch(function (reason) {
            reject({ status: 500, message: "Cannot update Details, Error : " + reason });
        })
    });
};

//update password
exports.updatePassword = function (updateBody) {
    return new Promise(function (resolve, reject) {
        var newUserBody = {
            password: updateBody.password
        };
        userModel.update({ username: updateBody.username }, newUserBody).exec().then(function (value) {
            resolve({ status: 200, "data": value });
        }).catch(function (reason) {
            reject({ status: 500, message: "Cannot update Details, Error : " + reason });
        })
    });
};

//update usertype
exports.updateUserType = function (updateBody) {
    return new Promise(function (resolve, reject) {
        module.exports.getUserByUsername(updateBody.username).then(result => {
            if (result.role == "General User") {
                var newUserBody = {
                    role: 'Premium User'
                };
                userModel.update({ username: updateBody.username }, newUserBody).exec().then(function (value) {
                    resolve({ status: 200, "data": value });
                }).catch(function (reason) {
                    reject({ status: 500, message: "Cannot update Details, Error : " + reason });
                })
            }
            else {
                resolve({ status: 200, "data": "Already a premium user" })
            }
        });
    });
};

exports.deleteUser = function (username) {
    return new Promise(function (resolve, reject) {
        userModel.deleteOne({username: username}).exec().then(function (value) {
            resolve({ status: 200, "data": value });
        }).catch(function (reason) {
            reject({ status: 500, message: "Cannot Delete User, Error : " + reason });
        })
    });
};
