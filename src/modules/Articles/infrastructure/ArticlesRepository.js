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

    async getAllArticles() {
        return this.articles;
    }
}

module.exports = ArticlesRepository;
