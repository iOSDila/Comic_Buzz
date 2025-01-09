'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');

/**
 * Invoke OCR API
 * Returns Recognized text
 * @param image_file_name
 * @returns {Promise}
 */
exports.extractText = function (job_id, image_file_name) {
    return new Promise(function (resolve, reject) {
        logger.info('extractText @ OCR-job begin');

        let uri = 'recognize/text/ocr',
            body = {image_file_name: image_file_name, job_id: job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('extractText @ OCR-job end');
        });
    })
};