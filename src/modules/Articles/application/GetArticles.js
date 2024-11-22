class GetArticles {
    constructor({ articlesRepository }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Fetch articles based on query parameters.
     *
     * @param {Object} [query] - Query parameters for filtering.
     * @param {string} [query.keyword] - Keyword to match topics or entities.
     * @param {Date} [query.fromDate] - Articles published after this date.
     * @param {Date} [query.toDate] - Articles published before this date.
     * @returns {Promise<Array>} - Filtered or all articles.
     */
    async execute(query = {}) {
        return this.articlesRepository.getAllArticles(query);
    }
}

module.exports = GetArticles;
