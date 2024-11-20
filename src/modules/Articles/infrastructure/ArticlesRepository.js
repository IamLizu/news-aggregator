class ArticlesRepository {
    constructor({ logger }) {
        this.logger = logger;
        this.articles = [
            {
                title: "Article 1",
                content: "This is the content of article 1",
            },
        ];
    }

    async saveArticles(articles) {
        this.articles.push(...articles);
        this.logger.info(`Saved ${articles.length} articles`);
    }

    async getAllArticles() {
        return this.articles;
    }
}

module.exports = ArticlesRepository;
