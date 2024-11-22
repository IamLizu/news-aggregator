class RSSParserAdapter {
    constructor({ parser, logger }) {
        this.parser = parser;
        this.logger = logger;
    }

    async parse(url) {
        try {
            this.logger.info(`Fetching RSS feed: ${url}`);

            const feed = await this.parser.parseURL(url);

            this.logger.info(`Successfully parsed RSS feed: ${url}`, {
                title: feed.title,
            });

            return feed;
        } catch (error) {
            this.logger.error(
                `Failed to fetch or parse RSS feed: ${url}`,
                error,
            );

            return null;
        }
    }
}

module.exports = RSSParserAdapter;
