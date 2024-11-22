class FetchAndSaveArticles {
    constructor({
        rssParserAdapter,
        Article,
        articlesRepository,
        topicExtractor,
        logger,
        validator,
    }) {
        this.rssParserAdapter = rssParserAdapter;
        this.Article = Article;
        this.articlesRepository = articlesRepository;
        this.topicExtractor = topicExtractor;
        this.logger = logger;
        this.validator = validator;
    }

    async execute(feedUrl) {
        try {
            if (!this.validator.isValidURL(feedUrl)) {
                throw new Error(`Invalid URL: ${feedUrl}`);
            }

            // Parse the RSS feed
            const feed = await this.rssParserAdapter.parse(feedUrl);

            if (!feed || !feed.items || feed.items.length === 0) {
                this.logger.warn(`No articles found in feed: ${feedUrl}`);
                return [];
            }

            // Transform feed items into Article entities directly
            const articles = feed.items.map((item) => {
                return new this.Article({
                    title: item.title,
                    link: item.link,
                    publicationDate: item.pubDate || item.isoDate,
                    description: item.contentSnippet || item.description,
                    content: item.content || null,
                    topics: [],
                    source: feedUrl,
                });
            });

            // Extract topics and enrich articles
            const enrichedArticles = await Promise.all(
                articles.map(async (article) => {
                    article.topics = await this.topicExtractor.extractTopics(
                        article.content || article.description,
                    );
                    return article;
                }),
            );

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
