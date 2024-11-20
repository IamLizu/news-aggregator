const { Router } = require("express");

class ArticleRoutes {
    constructor({ articlesController }) {
        this.router = Router();
        this.articlesController = articlesController;

        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            "/",
            this.articlesController.getAll.bind(this.articlesController),
        );

        this.router.get(
            "/fetch",
            this.articlesController.fetchAndSave.bind(this.articlesController),
        );
    }

    getRoutes() {
        return this.router;
    }
}

module.exports = ArticleRoutes;
