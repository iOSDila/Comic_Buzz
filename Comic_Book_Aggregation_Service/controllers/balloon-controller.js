'use strict';

/************************************
 * Sub routes for                   *
 * /api/balloon_segmentation/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../logs/logger');
const BSJob = require('../jobs/ballon-segmentation-job.js');
const uploadHelper = require('../helpers/upload.helper');

//Invoke balloon segmentation for individual job
//Accept content as form-data
router.post('/start', uploadHelper.getUploadInstance('sole-job').single('image'), function (req, res) {

    let job_id = 'static-job-id-for-sole-jobs',
        file_name = req.file.filename;

    BSJob.segmentBallons(job_id, file_name).then(data=>{
        logger.info(JSON.stringify(data, null, 2));
        if (data.status === 'failed') {
            logger.error('Balloon segmentation failed!');
            res.send({
                status: 'failed',
                error: data.error
            });
        } else if (data.status === 'success') {
            logger.info('Balloon segmentation successful!');
            res.sendFile(path.resolve(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/images/processed/' + data.output_filename.output_org_content));
        }
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;