class RSSParserAdapter {
    constructor({ parser, logger }) {
        this.parser = parser;
        this.logger = logger;
    }

    //TODO: Think about multiple urls and how to handle them
    async parse(url) {
        try {
            this.logger.info(`Fetching RSS feed: ${url}`);

            const feed = await this.parser.parseURL(url);

            this.logger.info(`Successfully parsed RSS feed: ${url}`, {
                title: feed.title,
            });

            return feed;
        } catch (error) {
            this.logger.error(`Failed to fetch or parse RSS feed: ${url}`, {
                error: error.message,
            });

            //TODO: Can we throw this error in logger?
            throw new Error(
                `Failed to fetch or parse RSS feed: ${error.message}`,
            );
        }
    }
}

module.exports = RSSParserAdapter;
