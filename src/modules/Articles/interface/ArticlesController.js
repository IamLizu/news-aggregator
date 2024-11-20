class ArticlesController {
    constructor({ getArticles }) {
        this.getArticles = getArticles;
    }

    async getAll(req, res, next) {
        try {
            const articles = await this.getArticles.execute();
            res.status(200).json({ articles });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ArticlesController;
