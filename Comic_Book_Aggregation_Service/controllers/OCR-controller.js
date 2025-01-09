'use strict';

/************************************
 * Sub routes for                   *
 * /api/OCR/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const logger = require('../logs/logger');
const OCRJob = require('../jobs/OCR-job');
const uploadHelper = require('../helpers/upload.helper');
const storyModel = require('../models/story-jobs.model');

//Invoke optical character recognition job
//Accept content as form-data
router.post('/start', uploadHelper.getUploadInstance('sole-job-processed').single('image'), function (req, res) {

    let job_id = 'static-job-id-for-sole-jobs',
        file_name = req.file.filename;

    OCRJob.extractText(job_id, file_name).then(data=>{
        logger.info(JSON.stringify(data, null, 2));
        if (data.status === 'failed') {
            logger.error('Text detection failed!');
            res.json({
                status: 'failed',
                error: data.error
            });
        } else if (data.status === 'success') {
            logger.info('Text detection successful!');

            storyModel.getTextByStoryID(job_id, 'OCR_' + file_name + '.txt').then( text =>{
                logger.info('Text extracted from file successfully');
                res.json({
                    status : 'success',
                    text: text
                });
            }).catch(err=>{
                logger.error(err);
                res.send(err);
            });
        }
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;