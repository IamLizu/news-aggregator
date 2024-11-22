const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const container = require("../../../DIContainer");

const logger = container.resolve("logger");
const scheduler = container.resolve("scheduler");

const fetchFeeds = async (feedsPath) => {
    const fetchAndSaveArticles = container.resolve("fetchAndSaveArticles");

    // Load feed URLs from configuration
    const feeds = JSON.parse(fs.readFileSync(feedsPath, "utf-8")).feeds;

    logger.info("Starting RSS feed processing...");

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
};

const scheduleFeeds = (feedsPath) => {
    scheduler.scheduleTask("runProgram", "*/10 * * * *", async () => {
        await fetchFeeds(feedsPath);
    });

    logger.info("Feed fetching scheduled every 10 minutes");
};

const filterArticles = async (query) => {
    const getArticles = container.resolve("getArticles");

    logger.info("Fetching and filtering articles with query", { query });
    const articles = await getArticles.execute(query);

    logger.info("Filtered articles fetched successfully.", {
        count: articles.length,
    });
    logger.info("Filtered Articles:", articles);

    return articles;
};

const cli = async () => {
    return yargs(hideBin(process.argv))
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
                if (args.schedule) {
                    scheduleFeeds(args.json);
                } else {
                    await fetchFeeds(args.json);
                }
            },
        )
        .command(
            "view",
            "View and filter articles based on query",
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
                const query = {
                    keywords: args.keyword,
                    fromDate: args.fromDate,
                    toDate: args.toDate,
                };
                await filterArticles(query);
            },
        )
        .demandCommand(1, "You must specify a command")
        .help().argv;
};

module.exports = cli;
