class GetArticles {
    constructor({ articlesRepository }) {
        this.articlesRepository = articlesRepository;
    }

    async execute() {
        return this.articlesRepository.getAllArticles();
    }
}

module.exports = GetArticles;
