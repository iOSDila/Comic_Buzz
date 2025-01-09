'use strict';

/************************************
 * All the functions related to     *
 * story-jobs data model is included*
 * **********************************
 */

const mongoose = require('mongoose');
const fs = require('fs');
require('../helpers/db.helper');

let storyJobScheme = mongoose.Schema({ //creating a schema
    job_id: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        default: 'in_progress'
    },
    username: {
        type: String,
        required: true,
    },
    saveStory: {
        type: Boolean,
        default: false
    },
    output: {
        type: Object,
        required: false
    },
    job_created_date: {
        type: Date,
        default: Date.now
    },
    storyName: {
        type: String,
        required: true,
    }
});

let storyJobModel = mongoose.model('storyJobs', storyJobScheme,'storyJobs');

/**
 * Save new story-job entry in DB
 * @param body
 * @returns {Promise}
 */
exports.addJob = function (body) {
    return new Promise(function (resolve, reject) {
        let newStoryJob = new storyJobModel(body);
        newStoryJob.save().then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};

exports.checkForPendingJobs = function (username) {
    return new Promise(function (resolve, reject) {
        storyJobModel.find({ username: username, status:'in_progress' }).exec().then(data => {
            if(data.length > 0){
                resolve(true);
            }else {
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        });
    });
};

exports.updateStatus = function (job_id,status) {
    return new Promise(function (resolve, reject) {
        storyJobModel.updateOne({job_id:job_id},{status:status}).exec().then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.updateSaveStoryStatus = function (job_id,status) {
    return new Promise(function (resolve, reject) {
        storyJobModel.updateOne({job_id:job_id},{saveStory:status}).exec().then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.updateStoryJob = function (job_id,entity) {
    return new Promise(function (resolve, reject) {
        storyJobModel.updateOne({job_id:job_id},entity).exec().then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.getJob = function (job_id) {
    return new Promise(function (resolve, reject) {
        storyJobModel.find({job_id:job_id}).then(function (data) {
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.getAllJobsForUser = function (username) {
    return new Promise(function (resolve, reject) {
        storyJobModel.find({username:username}).then(function (data) {
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.getLastJobByUser = function (username) {
    return new Promise(function (resolve, reject) {
        storyJobModel.find({username:username}).sort({job_created_date: -1}).limit(1).then(function (data) {
            resolve(data);
        }).catch(err=>{
            reject(err);
        })
    });
};

exports.getTextByStoryID = function (job_id, text_filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/text/' + text_filename, 'utf8', function(err, data) {
            if (err){
                reject(err)
            }else{
                resolve(data)
            }
        });
    });
};