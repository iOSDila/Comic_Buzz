'use strict';

const multer = require('multer');

exports.getUploadInstance=function (location) {

    let path = '';

    if(location === 'sole-job'){
        path = '../Comic_Book_Image_Processing_Service/resources/static-job-id-for-sole-jobs/images/original';
    }else if (location === 'temp'){
        path = '../Comic_Book_Image_Processing_Service/resources/temp/uploaded';
    }else if (location === 'sole-job-processed'){
        path = '../Comic_Book_Image_Processing_Service/resources/static-job-id-for-sole-jobs/images/processed';
    }

    //creating storage object with destination and filename
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path);
        },
        filename: function (req, file, callback) {
            callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        }
    });

    return multer({ storage : storage});
};