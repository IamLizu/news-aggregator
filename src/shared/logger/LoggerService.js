const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const config = require("config");

class LoggerService {
    constructor() {
        this.logger = winston.createLogger({
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6,
            },
            level: config.get("LOG_LEVEL"),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                this.createDailyRotateTransport("application-%DATE%.log"),
                this.createDailyRotateTransport("error-%DATE%.log", "error"),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(
                            ({
                                timestamp,
                                level,
                                message,
                                caller,
                                ...meta
                            }) => {
                                if (caller) {
                                    return `${timestamp} [${level}] [${caller}]: ${message} ${JSON.stringify(meta)}`;
                                } else {
                                    return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
                                }
                            },
                        ),
                    ),
                }),
            ],
        });
    }

    /**
     * Creates a DailyRotateFile transport for the logger.
     *
     * @param {string} filename - The name pattern for the log file.
     * @param {string} [level] - Optional log level (e.g., 'error').
     * @returns {DailyRotateFile} A configured DailyRotateFile transport.
     */
    createDailyRotateTransport(filename, level) {
        return new DailyRotateFile({
            filename: path.join(__dirname, "../../../logs", filename),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m", // Max size of each log file
            maxFiles: "14d", // Retain logs for 14 days
            level: level || "info",
        });
    }

    #getCallerFile() {
        const originalPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = new Error().stack;
        Error.prepareStackTrace = originalPrepareStackTrace;

        // Find the caller of the logger method (skip LoggerService calls)
        const callerStack = stack.find(
            (frame) => !frame.getFileName().includes(__filename),
        );

        if (callerStack) {
            return `${callerStack.getFileName()}:${callerStack.getLineNumber()}`;
        }
        return "unknown";
    }

    #skeleton(logFn, message, meta) {
        /**
         * Getting the caller introduces a performance overhead
         * because of stack trace generation on each log call.
         *
         * This is useful for debugging purposes but should not be
         * called in production environments.
         */
        if (process.env.NODE_ENV === "debug") {
            const caller = this.#getCallerFile();

            logFn(message, { ...meta, caller });
        } else {
            logFn(message, meta);
        }
    }

    /**
     * Logs an informational message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    info(message, meta) {
        this.#skeleton(this.logger.info, message, meta);
    }

    /**
     * Logs a warning message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    warn(message, meta) {
        this.#skeleton(this.logger.warn, message, meta);
    }

    /**
     * Logs an error message.
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    error(message, meta) {
        /**
         * not using the skeleton method
         * because we want to log the stack trace from the error
         */
        this.logger.error(message, meta);
    }

    /**
     * Logs a debug message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    debug(message, meta) {
        this.#skeleton(this.logger.debug, message, meta);
    }
}

module.exports = new LoggerService();
