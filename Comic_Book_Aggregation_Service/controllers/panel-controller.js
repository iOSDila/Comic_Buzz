'use strict';

/************************************
 * Sub routes for                   *
 * /api/panel_segmentation/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../logs/logger');
const PSJob = require('../jobs/panel-segmentation-job');
const uploadHelper = require('../helpers/upload.helper');

//Invoke panel segmentation for individual job
//Accept content as form-data
router.post('/start', uploadHelper.getUploadInstance('sole-job').single('image'), function (req, res) {

    let job_id = 'static-job-id-for-sole-jobs',
        file_name = req.file.filename;

    PSJob.segmentPanels(job_id, file_name).then(data=>{
        logger.info(JSON.stringify(data, null, 2));
        if (data.status === 'failed') {
            logger.error('Panel segmentation failed!');
            res.json({
                status: 'failed',
                error: data.error
            });
        } else if (data.status === 'success') {
            logger.info('Panel segmentation successful!');

            //Creating callback URLs
            let urls = [];
            data.segmented_file_names.forEach(function (filename) {
                urls.push('http://localhost:3000/aggregation-service/api/stories/images/jobs/'+job_id+'/original/' + filename)
            });

            //res.sendFile(path.resolve(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/images/processed/' + data.output_filename.output_org_content));
            res.json({
                status:'success',
                callback_image_urls:urls
            })
        }
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;