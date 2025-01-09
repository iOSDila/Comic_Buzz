const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

let transports =[];

transports.push(
    new winston.transports.DailyRotateFile({
        name: 'info_on_file',
        filename: path.join(__dirname, '/aggregation_service_info-%DATE%.log'),
        datePattern: 'YYYY-MM',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        )
    })
);

transports.push(
    new winston.transports.DailyRotateFile({
        name: 'error_on_file',
        filename: path.join(__dirname, '/aggregation_service_error-%DATE%.log'),
        datePattern: 'YYYY-MM',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        )
    })
);

transports.push(
    new(winston.transports.Console)({
        name: 'info_on_console',
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        )

    })
);

//creating the logger using transport array which includes the log types
let logger = new winston.createLogger({
    transports: transports
});

exports.info=function (msg) {
    return logger.info(msg);
};

exports.error=function (msg) {
    return logger.error(msg);
};