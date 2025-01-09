'use strict';

/************************************
 * Sub routes for                   *
 * /api/stories/*                     *
 * **********************************
 */

const express=require('express');
const router=express.Router();
const story = require('../jobs/main-job');
const storyModel = require('../models/story-jobs.model');
const uploadHelper = require('../helpers/upload.helper');
const path = require('path');

const reqPath = path.join(__dirname, '../../');

//Invoke story creating job
//Accept content as form-data
router.post('/create', uploadHelper.getUploadInstance('temp').single('image'), (req, res) => {

    let panel_flag = req.body.panel_extraction;
    let username = req.body.username;
    let storyName = req.body.story_name;
    let uploadedFileName = req.file.filename;
    let job_id = req.body.job_id; //This is strictly for testing purposes in API level

    story.initNewStory(panel_flag, uploadedFileName, username, job_id, storyName).then(data=>{
        res.status(200).json({status : "in_progress", job_id:data});
    }).catch(err=>{
        res.json(err);
    })
});

router.get('/jobs/:job_id/status',function (req, res) {

    storyModel.getJob(req.params.job_id).then(job_entry=>{
        res.json({
            job_id : job_entry[0].job_id,
            status : job_entry[0].status
        });
    }).catch(err => {
        res.json({
            status: 'failed',
            error: err
        })
    })
});

router.get('/jobs/users/:username',function (req, res) {

    storyModel.getAllJobsForUser(req.params.username).then(job_entries=>{
        res.send(job_entries);
    })
});

router.put('/jobs/:job_id/status/:status',function (req, res) {
    let job_id = req.params.job_id;
    let status = req.params.status;
    storyModel.updateStatus(job_id, status).then(()=>{
        res.json({
            job_id :job_id,
            transaction_status : 'successful'
        });
    }).catch(err=>{
        res.json({
            job_id :job_id,
            transaction_status : 'successful',
            error : err
        })
    })
});

router.put('/jobs/:job_id/save',function (req, res) {
    let job_id = req.params.job_id;
    storyModel.updateSaveStoryStatus(job_id, true).then(()=>{
        res.json({
            job_id :job_id,
            transaction_status : 'successful'
        });
    }).catch(err=>{
        res.json({
            job_id :job_id,
            transaction_status : 'failed',
            error : err
        })
    })
});

router.get('/last_saved/users/:username', function (req, res) {
    storyModel.getLastJobByUser(req.params.username).then(job_entries=>{
        res.send(job_entries[0]);
    })
});

// Get text story file content
router.get('/text/jobs/:job_id/text_outputs/:filename',function (req, res) {
   storyModel.getTextByStoryID(req.params.job_id, req.params.filename).then(data=>{
       res.json({
           status : 'success',
           text : data
       });
   }) .catch(err=>{
       res.json({
           status: 'failed',
           error: err
       })
   })
});

// Get audio file content
router.get('/audio/jobs/:job_id/audio_outputs/:filename',function (req, res) {
    res.sendFile(reqPath + 'Comic_Book_Image_Processing_Service/resources/'+ req.params.job_id +'/audio/' + req.params.filename);
});

// Get Character recognised image
router.get('/image/jobs/:job_id/CCR_image_output/:filename',function (req, res) {
    res.sendFile(reqPath + 'Comic_Book_Image_Processing_Service/resources/'+ req.params.job_id +'/images/processed/' + req.params.filename);
});

// Get Object recognised image
router.get('/image/jobs/:job_id/COD_image_output/:filename',function (req, res) {
    res.sendFile(reqPath + 'Comic_Book_Image_Processing_Service/resources/'+ req.params.job_id +'/images/processed/' + req.params.filename);
});

// Get Balloon Extracted image
router.get('/image/jobs/:job_id/balloon_output/:filename',function (req, res) {
    res.sendFile(reqPath + 'Comic_Book_Image_Processing_Service/resources/'+ req.params.job_id +'/images/processed/' + req.params.filename);
});

// Get Original images
router.get('/images/jobs/:job_id/original/:filename',function (req, res) {
    res.sendFile(reqPath + 'Comic_Book_Image_Processing_Service/resources/'+ req.params.job_id +'/images/original/' + req.params.filename);
});

// Get OCR output
router.get('/text/jobs/:job_id/ocr_output/:filename',function (req, res) {
    storyModel.getTextByStoryID(req.params.job_id, req.params.filename).then(data=>{
        res.json({
            status : 'success',
            text : data
        });
    }).catch(err=>{
        res.json({
            status: 'failed',
            error: err
        })
    })
});

router.get('/jobs/:job_id',function (req, res) {

    storyModel.getJob(req.params.job_id).then(job_entry=>{
        res.send(job_entry[0]);
    })
});

module.exports=router;
