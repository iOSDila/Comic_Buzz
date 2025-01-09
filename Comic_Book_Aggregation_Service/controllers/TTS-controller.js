'use strict';

/************************************
 * Sub routes for                   *
 * /api/TTS/*                     *
 * **********************************
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../logs/logger');
const storyJob = require('../jobs/story-building-job');
const audioJob = require('../jobs/create-audio-job');

//Invoke TTS individual character recognition job
//Accept content as form-data
router.post('/start', function (req, res) {

    let job_id = 'static-job-id-for-sole-jobs',
        text_file_name = 'text-to-speech.txt',
        text_content = req.body.text;

    storyJob.saveTextStory(job_id, text_content, text_file_name).then(()=>{
        logger.info('Story saved as text file successfully : ' + text_content);
        return audioJob.createAndSaveAudioStory(job_id,text_file_name);
    }).then(()=>{
        logger.info('Audio story generated successfully');
        let AUDIOFILE = (__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/audio/' + text_file_name + '.mp3');
        res.sendFile(path.resolve(AUDIOFILE));
    }).catch(err => {
        logger.error(err);
        res.send(err);
    })
});

module.exports = router;