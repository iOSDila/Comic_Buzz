'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');
const fs = require('fs');

/**
 * Invoke build story API
 * @param dialogue_script
 * @param objects
 * @returns {Promise}
 */
exports.buildStory = function (job_id, dialogue_script, objects) {
    return new Promise(function (resolve, reject) {
        logger.info('buildStory @ story-building-job begin');

        let uri = 'recognize/text/story',
            body = {story_script: dialogue_script, objects: objects, job_id:job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('buildStory @ story-building-job end');
        });
    })
};

exports.saveTextStory = function (job_id, text_story, text_filename) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/'+ job_id +'/text/' + text_filename, text_story, function(err) {
            if(err) {
                reject(err);
            }
            resolve();
        });
    })
};