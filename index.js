const container = require("./src/DIContainer");

const server = container.resolve("server");
const logger = container.resolve("logger");

(async () => {
    try {
        server.start();
    } catch (err) {
        logger.error("Failed to start the server", {
            error: err.message,
        });

        process.exit(1);
    }
})();
