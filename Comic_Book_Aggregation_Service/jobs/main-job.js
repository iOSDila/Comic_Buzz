'use strict';

const fs = require('fs');
const uuidv1 = require('uuid/v1');
const logger = require('../logs/logger');
const storyModel = require('../models/story-jobs.model');

const CCRJob = require('./CCR-job'),
      CODJob = require('./COD-job'),
      OCRJob = require('./OCR-job'),
      panelSegmentJob = require('./panel-segmentation-job'),
      balloonSegmentJob = require('./ballon-segmentation-job'),
      createAudioJob = require('./create-audio-job'),
      buildStoryJob = require('./story-building-job');

/**
 * Initialize a new story job
 * @param panel_flag
 * @param image_file_name
 * @returns {Promise}
 */
exports.initNewStory = function (panel_flag, image_file_name, username, job_id, storyName) {
    return new Promise(function (resolve, reject) {

        //Explicitly setting job_id and executing for testing purposes
        if(job_id){
            logger.info('Executing with existing job_id for testing purposes!');
            createNewStory(job_id, JSON.parse(panel_flag), image_file_name);
            return resolve(job_id);
        }

        //Validating for null username
        if(!username){
            logger.error('No user details received. Job initialization failed!');
            return reject({
                status : 'rejected',
                error : 'No user details received'
            });
        }

        //validate the request; Any pending job processing?
        storyModel.checkForPendingJobs(username).then(function (isPending) {

            if(isPending){
                logger.error('System is already processing a job for this user. Job initialization failed!');
                return reject({
                    status : 'rejected',
                    error : 'System is already processing a job for this user'
                });
            }else{
                //create a unique job ID
                let job_id = uuidv1();

                try{
                    //Create directory structure for the job id
                    fs.promises.mkdir(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/' + job_id + '/audio', { recursive: true }).then(()=>{
                        return fs.promises.mkdir(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/' + job_id + '/images/original', { recursive: true });
                    }).then(()=>{
                        return fs.promises.mkdir(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/' + job_id + '/images/processed', { recursive: true });
                    }).then(()=>{
                        return fs.promises.mkdir(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/' + job_id + '/text', { recursive: true });
                    }).then(()=>{
                        logger.info('Directory structure successfully created for job id ' + job_id);
                        return fs.promises.copyFile(__dirname + '/../../Comic_Book_Image_Processing_Service/resources/temp/uploaded/' + image_file_name, __dirname + '/../../Comic_Book_Image_Processing_Service/resources/' + job_id + '/images/original/' + image_file_name);
                    }).then(()=>{
                        logger.info('Uploaded file successfully placed in the created file structure');
                        return storyModel.addJob({
                            job_id: job_id,
                            username: username,
                            storyName: storyName
                        });
                    }).then(()=>{
                        logger.info('Job entry created in DB successfully');
                        createNewStory(job_id, JSON.parse(panel_flag), image_file_name);
                        resolve(job_id);
                    }).catch(err=>{
                        logger.error('Job initialization failed!');
                        logger.error(err);
                        return reject({
                            status : 'rejected',
                            error : err
                        });
                    });
                }catch (e) {
                    logger.error('Job initialization failed!');
                    logger.error('Exception : '+e);
                    reject({
                        status : 'rejected',
                        error : e
                    });
                }
            }
        }).catch(err=>{
            logger.error('Error caught while checking for pending jobs. Job initialization failed!');
            logger.error(err);
            return reject({
                status: 'rejected',
                error: err
            })
        });
    })
};

/**
 * Creates a new story by invoking createStoryForPanel or createStoryForPanelArray accordingly
 * @param panel_flag
 * @param original_image_name
 */
let createNewStory = function (job_id, panel_flag, original_image_name) {

    logger.info('createNewStory @ story-creating-job begin for ' + job_id);

    let panel_array = [];

    if (panel_flag && panel_flag === true) {

        logger.info('Panel extraction details received');

        panelSegmentJob.segmentPanels(job_id, original_image_name, ).then(data=>{
            logger.info(JSON.stringify(data,null,2))
            if (data.status === 'failed') {
                handleJobFailure(job_id,'Panel extraction', data.error);
                return;
            } else if (data.status === 'success') {
                logger.info('Panel extraction successful!');
                panel_array = data.segmented_file_names;

                logger.info('Panel names received : ' + JSON.stringify(panel_array));

                createStoryForPanelArray(job_id, panel_array,0)
            }
        })

    } else {
        createStoryForPanel(job_id, original_image_name).then(data => {
            logger.info('Story created for one panel successfully');
            continueStoryCreation(job_id, data);
        }).catch(err => {
            handleJobFailure(job_id, 'create story for a panel', err);
        });
    }
};

/**
 *
 * @param panel_array
 * @param panel_index
 * @param previous_result
 * @returns {Array}
 */
let createStoryForPanelArray = function (job_id, panel_array, panel_index, previous_result) {

    logger.info('createStoryForPanelArray starts for panel_index ' + panel_index);

    let result = [];

    if(previous_result){
        result = previous_result;
    }

    if(panel_index < panel_array.length){
      createStoryForPanel(job_id, panel_array[panel_index]).then(function (data) {
          result.push(data);
          logger.info('Story creation completed for panel_index ' + panel_index);
          createStoryForPanelArray(job_id, panel_array, ++panel_index, result);
      }).catch(err=>{

          if(panel_index == panel_array.length - 1){
              handleJobFailure(job_id,'story creation for panel_index ' + panel_index, err);
              return;
          }else {
              logger.info('Caught error while creating story for panel ' + panel_index);
              logger.info('Continuing to create story for next panel');
              createStoryForPanelArray(job_id, panel_array, ++panel_index, result);
          }
      })
    }else{
        logger.info('createStoryForPanelArray end successfully!');
        continueStoryCreation(job_id, result);
    }
};

/**
 *
 * @param original_image_name
 * @returns {Promise}
 */
let createStoryForPanel = function (job_id, original_image_name) {
    return new Promise(function (resolve, reject) {

        let result = {
            original_image_name: original_image_name
        };

        CCRJob.detectCharacters(job_id, original_image_name).then(data => {

            if (data.status === 'failed') {
                logger.error('Character detection failed!');
                reject(data.error);
            } else if (data.status === 'success') {
                logger.info('Character detection successful!');
                result.characters = data.result;
                logger.info(JSON.stringify(result.characters, null, 2));
            }

            return CODJob.detectObjects(job_id, original_image_name);

        }).then(data => {

            if (data.status === 'failed') {
                logger.error('Object detection failed!');
                reject(error);
            } else if (data.status === 'success') {
                logger.info('Object detection successful!');
                result.objects = data.result;
                logger.info(JSON.stringify(result.objects, null, 2));
            }
            return balloonSegmentJob.segmentBallons(job_id, original_image_name);

        }).then(data => {

            if (data.status === 'failed') {
                logger.error('Balloon segmentation failed!');
                reject(error);
            } else if (data.status === 'success') {
                logger.info('Balloon segmentation successful!');
                result.balloons = data;
                logger.info('Segmented image name : ' + result.balloons['output_filename'].output_org_content);
            }

            return OCRJob.extractText(job_id, result.balloons['output_filename'].output_org_content);

        }).then(data => {

            if (data.status === 'failed') {
                logger.error('Text extraction failed!');
                reject(error);
            } else if (data.status === 'success') {
                logger.info('Text extraction successful!');
                result.text = data;
                logger.info(JSON.stringify(result.text, null, 2));
            }

            // create association input structure
            var speakers = {};
            var characters = [];
            speakers.characters = characters;

            result.characters.forEach(char => {

                let bottom, top, left, right;
                let center_X, center_Y;

                var speaker = char['Character'].split(':')[0];

                bottom = char['bottom'];
                top = char['top'];
                left = char['left'];
                right = char['right'];

                center_X = (parseInt(left) + parseInt(right)) / 2;
                center_Y = (parseInt(bottom) + parseInt(top)) / 2;

                var position = [];
                position.push({
                    x: center_X,
                    y: center_Y
                });

                speakers.characters.push({
                    character: speaker,
                    position: position
                });
            });

            let xdiff = result.balloons['output_filename'].xdiff;
            let ydiff = result.balloons['output_filename'].ydiff;

            let diff = {
                xdiff: xdiff,
                ydiff: ydiff
            };

            return balloonSegmentJob.createCharacterAssociation(job_id, result.balloons['output_filename'].output_binary_content, diff, speakers.characters, result.text.output_filename);

        }).then(data => {

            if (data.status === 'failed') {
                logger.error('Character association failed!');
                return reject('CHAR_ASSOCIATION_FAILED');
            } else if (data.status === 'success') {
                logger.info('Character association  successful!');
                result.association = data;
                logger.info(JSON.stringify(result.association, null, 2));
            }else if(data.status === 'done with errors'){
                logger.error('Character association  failed - ' + data.error);
                return reject('CHAR_ASSOCIATION_PARTIALLY_FAILED');
            }

            var things = {};
            var counted = [];
            var objects = [];
            things.objects = objects;
            var objArray = []

            result.objects.forEach(object => {
                var obj = object['Object'].split(':')[0];
                objArray.push(obj);
            });

            for (var i = 0; i < objArray.length; i++) {
                if (counted.includes(objArray[i])) {
                    continue;
                }
                else {
                    things.objects.push({
                        object: objArray[i],
                        count: countElements(objArray, objArray[i])
                    });
                    counted.push(objArray[i])
                }
            }

            return buildStoryJob.buildStory(job_id, result.association, things);

        }).then(data => {

            if (data.status === 'failed') {
                logger.error('Story building failed!');
                reject(error);
            } else if (data.status === 'success') {
                logger.info('Story building successful!');
                result.story = data.text_story;
                logger.info(JSON.stringify(result.story, null, 2));
                resolve(result);
            } else if (data.status === 'done with errors') {
                logger.error('Story building failed - ' + data.error);
                result.story = '';
                return resolve(result);
            }
        }).catch(err => {

            logger.error("[story-creating-job] : " + 'createStoryForPanel failed ');
            reject(err);
        })
    })
};

let countElements = function (array, countie) {

    var count = 0;
    for (var i = 0; i < array.length; ++i) {
        if (array[i] == countie)
            count++;
    }

    return count
};

let continueStoryCreation = function (job_id, previous_result) {

    logger.info(JSON.stringify(previous_result));

    //Saving input to an array since input can be both array or variable
    let story_arr = [];

    if(Array.isArray(previous_result)){
        story_arr = previous_result;
    }else {
        story_arr.push(previous_result);
    }

    let text_story = '';

    let text_file_name = 'Text.txt';

    logger.info(JSON.stringify(story_arr));

    let count = 0;

    //Extracting the text story from objects in object array
    story_arr.forEach(function (obj) {
        if (story_arr.length > 1) {
            if (count == 0) {
                text_story = text_story + "In the first Panel, " + obj.story;
                count = count + 1;
            }
            else {
                text_story = text_story + " In the next panel, " + obj.story;
            }
        }
        else {
            text_story = text_story + obj.story;
        }
    });
    logger.info('Story extracted successfully!');
    logger.info(JSON.stringify(text_story));

    buildStoryJob.saveTextStory(job_id, text_story, text_file_name).then(function () {
        logger.info('Story saved in the text file successfully!');
        return createAudioJob.createAndSaveAudioStory(job_id, text_file_name);
    }).then(function (data) {
        if (data.status === 'failed') {
            handleJobFailure(job_id, 'Audio story generation/saving', data.error);
        } else if (data.status === 'success') {
            logger.info('Audio story generation and saving successful!');
        }
        let result = {
            status : 'done',
            output : {
                audio_path : text_file_name + '.mp3',
                text_path : text_file_name
            }
        };

        if(!Array.isArray(previous_result)){
            result.output.ccr_image_path = 'CCR_' + previous_result.original_image_name;
            result.output.cod_image_path = 'COD_' + previous_result.original_image_name;
            result.output.balloon_image_path = previous_result.balloons['output_filename'].output_binary_content;
            result.output.ocr_file_path = previous_result.text['output_filename'];
        }
        return storyModel.updateStoryJob(job_id,result);
    }).then(()=>{
        logger.info('Job entry updated successfully for job id ' + job_id);
    }).catch(err=>{
        logger.error('Failed to complete the promise chain for job id ' + job_id);
        logger.error(err);
    })
};

/**
 * Use to handle the possible job failures in create job process
 * @param job_id
 * @param task
 * @param error
 */
let handleJobFailure =function (job_id, task, error) {
    
    logger.error(task + ' failed!');
    logger.error(error);

    //Updating job id in the DB
    storyModel.updateStatus(job_id,'failed').then(()=>{
        logger.info('Job failure updated in DB successfully');
    }).catch(err=>{
        logger.error('Failed to update the job failure in DB');
        logger.error(err);
    })

};