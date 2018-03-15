//Log using winston
/*const winston = require('winston'),
    fs = require('fs'),
    timeFormat = () => (new Date()).toLocaleTimeString(),
    logPath = __dirname + '/log';

if (!fs.existsSync(logPath)) {
    console.log("Inside create log Path " + logPath);
    fs.mkdirSync(logPath);
}

winston.emitErrs = true;

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: `${logPath}/sample.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;

*/



//Log using log4js
/*const log4js = require('log4js'),
    fs = require('fs'),
    logPath = __dirname + '/log';

if (!fs.existsSync(logPath)) {
    console.log("Inside create log Path " + logPath);
    fs.mkdirSync(logPath);
}

log4js.configure({
    appenders: { sample: { type: 'file', filename: `${logPath}/sample.log` } },
    categories: { default: { appenders: ['sample'], level: 'debug'}}
});

module.exports.addName = function (appendName) {
    return log4js.getLogger(appendName);
};*/

require('dotenv').config();

try {
    const winston = require('winston'),
        config = require('./config'),
        S3StreamLogger = require('s3-streamlogger').S3StreamLogger,
        s3_stream = new S3StreamLogger({
            //signatureVersion: 'v4',
            bucket: process.env.AWS_BUCKET_NAME,
            access_key_id: process.env.AWS_ACCESS_KEY,
            secret_access_key: process.env.AWS_SECRET_KEY,
            name_format: "%Y-%m-%d-%H-%M-%S-%L-chatlogs-reportIncident.log"
            //compress: true                       //To compress to log.gz format
        });

    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                stream: s3_stream,
                json: false
            })
        ]
    });
} catch (e) {
    console.log(e);
}

module.exports = logger;