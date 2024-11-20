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
                            ({ timestamp, level, message, ...meta }) => {
                                return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
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

    /**
     * Logs an informational message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    /**
     * Logs a warning message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    /**
     * Logs an error message.
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    error(message, meta = {}) {
        this.logger.error(message, meta);
    }

    /**
     * Logs a debug message.
     *
     * @param {string} message - The log message.
     * @param {object} [meta] - Additional metadata.
     */
    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
}

module.exports = new LoggerService();
