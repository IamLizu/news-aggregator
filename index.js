const container = require("./src/DIContainer");
const logger = container.resolve("logger");
const { connect, disconnect } = require("./src/shared/infrastructure/Database");
const cli = require("./src/modules/Articles/interface/cli");

(async () => {
    try {
        await connect();
        logger.info("Database connected");

        await cli();
    } catch (err) {
        logger.error("Failed to start application", { error: err.message });
    } finally {
        await disconnect();
    }

    process.on("SIGINT", async () => {
        logger.info("Received SIGINT. Shutting down...");
        await disconnect();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        logger.info("Received SIGTERM. Shutting down...");
        await disconnect();
        process.exit(0);
    });
})();
