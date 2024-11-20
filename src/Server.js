const express = require("express");
const config = require("config");
const routes = require("./routes");
const container = require("./DIContainer");

const logger = container.resolve("logger");

class Server {
    constructor() {
        this.app = express();
        this.logger = logger;
        this.port = config.get("PORT") || 3000;
        this.server = null; // To store the server instance for shutdown handling

        this.initializeMiddleware();

        //TODO: handle versioning
        this.app.use("/", routes());

        this.initializeErrorHandling();
    }

    /**
     * Initialize middleware for the server.
     */
    initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        if (process.env.NODE_ENV === "development") {
            this.app.use((req, res, next) => {
                this.logger.info(`Incoming request: ${req.method} ${req.url}`);
                next();
            });
        }
    }

    /**
     * Initialize global error handling middleware.
     */
    initializeErrorHandling() {
        // Catch 404 errors
        this.app.use((req, res, next) => {
            const error = new Error(`Route ${req.originalUrl} not found`);
            error.status = 404;
            next(error);
        });

        // Global error handler
        this.app.use((err, req, res, _next) => {
            const status = err.status || 500;

            // Log the full error details for internal debugging
            this.logger.error(`Error: ${err.message}`, {
                status,
                stack: err.stack,
            });

            // Respond with a generic message in production
            const response = {
                error: {
                    message:
                        process.env.NODE_ENV === "production"
                            ? "An unexpected error occurred."
                            : err.message,
                    status,
                },
            };

            res.status(status).json(response);
        });
    }

    /**
     * Start the server.
     */
    start() {
        this.server = this.app.listen(this.port, () => {
            this.logger.info(`Server running on port ${this.port}`);
        });

        // Handle graceful shutdown
        process.on("SIGINT", this.shutdown.bind(this));
        process.on("SIGTERM", this.shutdown.bind(this));
    }

    /**
     * Gracefully shutdown the server.
     */
    shutdown() {
        this.logger.info("Shutting down server...");

        if (this.server) {
            this.server.close(() => {
                this.logger.info("Server closed gracefully");

                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    }
}

module.exports = new Server();
