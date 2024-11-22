const fs = require("fs");
const path = require("path");

const container = require("./src/DIContainer");
const logger = container.resolve("logger");
const scheduler = container.resolve("scheduler");

const { connect, disconnect } = require("./src/shared/infrastructure/Database");

const runProgram = async () => {
    try {
        const fetchAndSaveArticles = container.resolve("fetchAndSaveArticles");

        // Load feed URLs from configuration
        const feedsPath = path.resolve(__dirname, "feeds.json");
        const { feeds } = JSON.parse(fs.readFileSync(feedsPath, "utf-8"));

        logger.info("Starting RSS feed processing...");

        // Process each feed URL
        for (const feedUrl of feeds) {
            try {
                logger.info(`Fetching articles from: ${feedUrl}`);

                await fetchAndSaveArticles.execute(feedUrl);
            } catch (error) {
                logger.error(`Failed to fetch articles from ${feedUrl}`, {
                    error: error.message,
                });
            }
        }

        logger.info("RSS feed processing complete.");
    } catch (err) {
        logger.error("Failed during program execution", {
            error: err.message,
        });
    }
};

(async () => {
    try {
        // Connect to the database
        await connect();

        // Schedule the 'runProgram' task to run every minute
        scheduler.scheduleTask("runProgram", "* * * * *", runProgram);

        logger.info("Scheduler initialized and tasks scheduled");

        // List all scheduled tasks
        const tasks = scheduler.listTasks();
        logger.info("Currently scheduled tasks:", { tasks });

        // Handle graceful shutdown
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
    } catch (err) {
        logger.error("Failed to start application", {
            error: err.message,
        });

        await disconnect();
        process.exit(1);
    }
})();
