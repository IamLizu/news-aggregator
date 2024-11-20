const path = require("path");
const fs = require("fs");
const { Router } = require("express");
const pluralize = require("pluralize");
const logger = require("./shared/logger/LoggerService");

const MODULES_PATH = path.join(__dirname, "./modules");

const routes = () => {
    logger.info("Initializing routes...");

    const router = new Router();

    router.get("/", (req, res) => {
        res.json({
            application: "news-aggregator",
            author: "S M Mahmudul Hasan <he@smmahmudulhasan.com>",
            message: "Welcome to the API!",
        });
    });

    fs.readdirSync(MODULES_PATH).forEach((file) => {
        const routePath = path.join(MODULES_PATH, file, "interface");
        const routeFile = path.join(routePath, `${file}Routes.js`);

        logger.debug("Loading", {
            route: routeFile,
        });

        if (fs.existsSync(routeFile)) {
            router.use(`/${pluralize(file)}`, require(routeFile)());
        }
    });

    return router;
};

module.exports = routes;
