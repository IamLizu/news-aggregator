class FetchAndSaveArticles {
    constructor({ rssParserAdapter, Article, articlesRepository, logger }) {
        this.rssParserAdapter = rssParserAdapter;
        this.Article = Article;
        this.articlesRepository = articlesRepository;
        this.logger = logger;
    }

    async execute(feedUrl) {
        try {
            // Parse the RSS feed
            const feed = await this.rssParserAdapter.parse(feedUrl);

            // Transform feed items into Article entities directly
            const articles = feed.items.map((item) => {
                return new this.Article({
                    title: item.title,
                    link: item.link,
                    publicationDate: item.pubDate || item.isoDate,
                    description: item.contentSnippet || item.description,
                    content: item.content || null,
                    topics: [], // Topics will be added later
                });
            });

            await this.articlesRepository.saveArticles(articles);

            this.logger.info(
                `Fetched and saved ${articles.length} articles from ${feedUrl}`,
            );
            return articles;
        } catch (error) {
            this.logger.error(
                `Failed to fetch and save articles: ${error.message}`,
            );
            throw error;
        }
    }
}

module.exports = FetchAndSaveArticles;
