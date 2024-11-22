const fs = require("fs");
const path = require("path");

const server = require("./src/Server");
const container = require("./src/DIContainer");
const logger = container.resolve("logger");

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

        // Check for mode from command-line arguments or environment variable
        if (
            process.argv.includes("--run-program") ||
            process.env.RUN_PROGRAM === "true"
        ) {
            await runProgram();
        } else {
            server.start();
        }
    } catch (err) {
        logger.error("Failed to start application", {
            error: err.message,
        });
    } finally {
        // Disconnect from the database
        await disconnect();
        process.exit(1);
    }
})();
