'use strict';

const request_promise = require('request-promise');
const logger = require('../logs/logger');

exports.post = function (uri, body, headers, remarks) {
    return new Promise(function (resolve, reject) {
        logger.info('post @ image-processing-service-client.helper start');

        var request_options = {
            method: 'POST',
            uri: 'http://localhost:3001/image_processing_service/' + uri,
            body: body,
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            json: true
        };

        request_promise(request_options).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('Remarks : ' + remarks );
            logger.info('post @ image-processing-service-client.helper end');
        });
    });
};

exports.get = function (uri, headers, remarks) {
    return new Promise(function (resolve, reject) {
        logger.info('get @ image-processing-service-client.helper start');

        var request_options = {
            method: 'GET',
            uri: 'http://localhost:3001/image_processing_service/' + uri,
            headers: headers,
            json: true
        };

        request_promise(request_options).then(res => {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        }).finally(() => {
            logger.info('Remarks : ' + remarks );
            logger.info('get @ image-processing-service-client.helper end');
        });
    });
};