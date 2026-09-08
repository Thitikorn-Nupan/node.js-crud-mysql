const {createLogger, format, transports} = require('winston')
const path = require('path')
class Logging {
    get logger() { // this function return Logger class
        return createLogger({
            level: 'silly',
            format: format.combine(
                format.label({
                    label: path.basename(require.main?.filename || __filename),
                }),
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.printf(info => `${info.timestamp} ${info.level} [${info.label}] : ${info.message}`)
            ),
            transports: [
                new transports.Console
            ]
            // this is order logger { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
        })
    }
}

module.exports = new Logging()



