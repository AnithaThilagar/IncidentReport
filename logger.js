const winston = require('winston'),
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