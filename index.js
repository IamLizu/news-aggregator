const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const container = require("./src/DIContainer");
const logger = container.resolve("logger");
const scheduler = container.resolve("scheduler");
const { connect, disconnect } = require("./src/shared/infrastructure/Database");

const fetchFeeds = async (feedsPath) => {
    try {
        const fetchAndSaveArticles = container.resolve("fetchAndSaveArticles");

        // Load feed URLs from configuration
        const feeds = JSON.parse(fs.readFileSync(feedsPath, "utf-8")).feeds;

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
        logger.error("Failed during feed fetching", {
            error: err.message,
        });
        throw err;
    }
};

const scheduleFeeds = (feedsPath) => {
    scheduler.scheduleTask("runProgram", "* * * * *", async () => {
        await fetchFeeds(feedsPath);
    });

    logger.info("Feed fetching scheduled every minute");
};

const filterArticles = async (query) => {
    try {
        const getArticles = container.resolve("getArticles");

        logger.info("Fetching and filtering articles with query", { query });
        const articles = await getArticles.execute(query);

        logger.info("Filtered articles fetched successfully.", {
            count: articles.length,
        });

        logger.info("Filtered Articles:", articles);

        return articles;
    } catch (error) {
        logger.error("Failed to fetch and filter articles", {
            error: error.message,
        });
        throw error;
    }
};

(async () => {
    yargs(hideBin(process.argv))
        .command(
            "fetch",
            "Fetch articles from RSS feeds",
            (yargs) => {
                yargs
                    .option("json", {
                        alias: "j",
                        type: "string",
                        description: "Path to JSON file containing feeds",
                        demandOption: true,
                    })
                    .option("schedule", {
                        alias: "s",
                        type: "boolean",
                        description: "Schedule the feed fetching process",
                    });
            },
            async (args) => {
                try {
                    await connect();

                    if (args.schedule) {
                        scheduleFeeds(args.json);
                    } else {
                        await fetchFeeds(args.json);
                    }
                } catch (err) {
                    logger.error("Error in fetch command", {
                        error: err.message,
                    });
                } finally {
                    await disconnect();
                }
            },
        )
        .command(
            "filter",
            "Filter articles based on query",
            (yargs) => {
                yargs
                    .option("keyword", {
                        alias: "k",
                        type: "array",
                        description:
                            "Keywords to filter articles (supports multiple keywords)",
                    })
                    .option("fromDate", {
                        alias: "f",
                        type: "string",
                        description: "Start date for filtering articles",
                    })
                    .option("toDate", {
                        alias: "t",
                        type: "string",
                        description: "End date for filtering articles",
                    });
            },
            async (args) => {
                try {
                    await connect();

                    const query = {
                        keyword: args.keyword,
                        fromDate: args.fromDate,
                        toDate: args.toDate,
                    };

                    await filterArticles(query);
                } catch (err) {
                    logger.error("Error in filter command", {
                        error: err.message,
                    });
                } finally {
                    await disconnect();
                }
            },
        )
        .demandCommand(1, "You must specify a command")
        .help().argv;

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
