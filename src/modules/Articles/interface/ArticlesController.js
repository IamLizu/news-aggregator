class ArticlesController {
    constructor({ fetchAndSaveArticles, getArticles }) {
        this.fetchAndSaveArticles = fetchAndSaveArticles;
        this.getArticles = getArticles;
    }

    async fetchAndSave(req, res, next) {
        try {
            const { feedUrl } = req.query;
            if (!feedUrl) {
                return res
                    .status(400)
                    .json({ error: "Missing feedUrl parameter" });
            }

            const articles = await this.fetchAndSaveArticles.execute(feedUrl);
            res.status(200).json({ articles });
        } catch (error) {
            next(error);
        }
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
