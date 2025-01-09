'use strict';

/************************************
 * Sub routes for                   *
 * /api/CCR/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../logs/logger');
const CCRJob = require('../jobs/CCR-job');
const uploadHelper = require('../helpers/upload.helper');

//Invoke character individual character recognition job
//Accept content as form-data
router.post('/start', uploadHelper.getUploadInstance('sole-job').single('image'), function (req, res) {

    let job_id = 'static-job-id-for-sole-jobs',
        file_name = req.file.filename;

    CCRJob.detectCharacters(job_id, file_name).then(data=>{
        logger.info(JSON.stringify(data, null, 2));
        if (data.status === 'failed') {
            logger.error('Character detection failed!');
            res.send({
                status: 'failed',
                error: data.error
            });
        } else if (data.status === 'success') {
            logger.info('Character detection successful!');
            logger.info(JSON.stringify(data.result, null, 2));
            res.sendFile(path.resolve(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/images/processed/CCR_' + file_name));
        }
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;