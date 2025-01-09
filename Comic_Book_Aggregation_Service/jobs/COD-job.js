'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');

/**
 * Invoke COD API
 * @param image_file_name
 * @returns {Promise}
 */
exports.detectObjects = function (job_id, image_file_name) {
    return new Promise(function (resolve, reject) {
        logger.info('detectObjects @ story-creating-job begin');

        let uri = 'recognize/object/start',
            body = {image_file_name: image_file_name, job_id: job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('detectObjects @ story-creating-job end');
        });
    })
};