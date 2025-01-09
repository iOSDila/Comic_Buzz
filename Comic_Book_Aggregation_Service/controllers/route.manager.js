'use strict';

/************************************
 * This is where all the routes are *
 * recognized and distributed in to *
 * relevant route files             *
 * **********************************
 */


const express = require('express');
const router = express.Router();

router.use('/users',require('./users.controller'));
router.use('/payments',require('./payment.controller'));
router.use('/stories',require('./stories.controller'));
router.use('/balloon_segmentation',require('./balloon-controller'));
router.use('/CCR',require('./CCR-controller'));
router.use('/COD',require('./COD-controller'));
router.use('/OCR',require('./OCR-controller'));
router.use('/TTS',require('./TTS-controller'));
router.use('/panel_segmentation',require('./panel-controller'));

module.exports = router;