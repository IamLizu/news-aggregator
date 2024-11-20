class FetchAndSaveArticles {
    constructor({
        rssParserAdapter,
        Article,
        articlesRepository,
        topicExtractor,
        logger,
    }) {
        this.rssParserAdapter = rssParserAdapter;
        this.Article = Article;
        this.articlesRepository = articlesRepository;
        this.topicExtractor = topicExtractor;
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

            const enrichedArticles = articles.map((article) => {
                article.topics = this.topicExtractor.extractTopics(
                    article.content || article.description,
                );
                return article;
            });

            await this.articlesRepository.saveArticles(enrichedArticles);

            this.logger.info(
                `Fetched and saved ${enrichedArticles.length} articles from ${feedUrl}`,
            );
            return enrichedArticles;
        } catch (error) {
            this.logger.error(
                `Failed to fetch and save articles: ${error.message}`,
            );
            throw error;
        }
    }
}

module.exports = FetchAndSaveArticles;
