'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');

/**
 * Invoke CCR API
 * @param image_file_name
 * @returns {Promise}
 */
exports.detectCharacters = function (job_id, image_file_name) {
    return new Promise(function (resolve, reject) {
        logger.info('detectCharacters @ CCR-job begin');

        let uri = 'recognize/character/start',
            body = {image_file_name: image_file_name, job_id: job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('detectCharacters @ CCR-job end');
        });
    })
};