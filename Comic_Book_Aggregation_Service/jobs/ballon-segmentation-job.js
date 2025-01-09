'use strict';

const rest_client = require('../helpers/image-processing-service-client.helper');
const logger = require('../logs/logger');

/**
 * Invoke Balloon Segmentation API
 * Returns response status with black and white image name and text merged image name
 * @param image_file_name
 * @returns {Promise}
 */
exports.segmentBallons = function (job_id, image_file_name) {
    return new Promise(function (resolve, reject) {
        logger.info('segmentBallons @ balloon-segmentation-job begin');

        let uri = 'recognize/ballons/start',
            body = {input_binary_image: image_file_name, job_id:job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('segmentPanels @ panel-creating-job end');
        });
    })
};

/**
 * Invoke Character association API
 * Returns a Dialogue script
 * @param characters
 * @param balloon_binary_image
 * @param text
 * @returns {Promise}
 */
exports.createCharacterAssociation = function (job_id, balloon_binary_image, ratio_diff, characters, text) {
    return new Promise(function (resolve, reject) {
        logger.info('createCharacterAssociation @ balloon-segmentation-job begin');

        let uri = 'recognize/text/association',
            body = { balloon_binary_image: balloon_binary_image, ratio_diff: ratio_diff, characters: characters,text: text, job_id: job_id};

        rest_client.post(uri, body).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('createCharacterAssociation @ balloon-segmentation-job end');
        });
    })
};