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
     * Get all articles from the database.
     *
     * @returns {Array<Object>} - Array of article objects.
     */
    async getAllArticles() {
        try {
            const articles = await this.articleModel
                .find()
                .sort({ publicationDate: -1 }); // Sort by most recent
            this.logger.info(`Fetched ${articles.length} articles`);
            return articles;
        } catch (error) {
            this.logger.error("Failed to fetch articles", {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Find articles by topic.
     *
     * @param {string} topic - The topic to search for.
     * @returns {Array<Object>} - Array of articles matching the topic.
     */
    async findArticlesByTopic(topic) {
        try {
            const articles = await this.articleModel.find({ topics: topic });
            this.logger.info(
                `Found ${articles.length} articles for topic: ${topic}`,
            );
            return articles;
        } catch (error) {
            this.logger.error(`Failed to find articles by topic: ${topic}`, {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Delete articles by their IDs.
     *
     * @param {Array<string>} ids - Array of article IDs to delete.
     */
    async deleteArticlesByIds(ids) {
        try {
            const result = await this.articleModel.deleteMany({
                _id: { $in: ids },
            });
            this.logger.info(`Deleted ${result.deletedCount} articles`);
            return result;
        } catch (error) {
            this.logger.error("Failed to delete articles", {
                error: error.message,
            });
            throw error;
        }
    }
}

module.exports = ArticlesRepository;
