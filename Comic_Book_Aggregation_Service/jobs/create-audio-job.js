'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');

/**
 * Invoke createAudioGenerate API
 * @param job_id
 * @param text_filename
 * @returns {Promise}
 */
exports.createAndSaveAudioStory = function (job_id, text_filename) {
    return new Promise(function (resolve, reject) {
        logger.info('createAndSaveAudioStory @ create-audio-job begin');

        let uri = 'recognize/audio/start',
            body = {text_filename: text_filename, job_id: job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('createAndSaveAudioStory @ create-audio-job end');
        });
    })
};