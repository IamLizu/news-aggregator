const articleModel = require("./ArticleModel");
class ArticlesRepository {
    constructor({ logger }) {
        this.logger = logger;
        this.articleModel = articleModel;
    }

    /**
     * Save multiple articles to the database.
     *
     * @param {Array<Object>} articles - Array of article objects to save.
     */
    async saveArticles(articles) {
        try {
            const savedArticles = await this.articleModel.insertMany(articles, {
                ordered: false, // Continues saving even if one fails
            });

            this.logger.info(`Saved ${savedArticles.length} articles`);
            return savedArticles;
        } catch (error) {
            this.logger.error("Failed to save articles", {
                error: error.message,
            });

            throw error;
        }
    }

    /**
     * Fetch all articles or filter them based on provided query parameters.
     *
     * @param {Object} [query] - Query parameters for filtering.
     * @param {string} [query.keyword] - Keyword to match topics or entities.
     * @param {Date} [query.fromDate] - Articles published after this date.
     * @param {Date} [query.toDate] - Articles published before this date.
     * @returns {Promise<Array>} - Filtered or all articles.
     */
    async getAllArticles(query = {}) {
        const { keyword, fromDate, toDate } = query;

        const mongoQuery = {};

        if (fromDate || toDate) {
            mongoQuery.publicationDate = {};
            if (fromDate) {
                const parsedFromDate = new Date(fromDate);

                if (isNaN(parsedFromDate)) {
                    throw new Error(`Invalid fromDate: ${fromDate}`);
                }

                mongoQuery.publicationDate.$gte = parsedFromDate;
            }
            if (toDate) {
                const parsedToDate = new Date(toDate);

                if (isNaN(parsedToDate)) {
                    throw new Error(`Invalid toDate: ${toDate}`);
                }

                mongoQuery.publicationDate.$lte = parsedToDate;
            }
        }

        if (keyword) {
            mongoQuery.$or = [
                { topics: { $regex: keyword, $options: "i" } },
                { "entities.people": { $regex: keyword, $options: "i" } },
                { "entities.locations": { $regex: keyword, $options: "i" } },
                {
                    "entities.organizations": {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ];
        }

        return await this.articleModel.find(mongoQuery);
    }
}

module.exports = ArticlesRepository;
