const { Router } = require("express");
const pluralize = require("pluralize");
const container = require("./DIContainer");

const logger = container.resolve("logger");

const routes = () => {
    logger.info("Initializing routes...");

    const router = Router();

    router.get("/", (req, res) => {
        res.json({
            application: "news-aggregator",
            author: "S M Mahmudul Hasan <he@smmahmudulhasan.com>",
            message: "Welcome to the news-aggregator API!",
        });
    });

    logger.debug(JSON.stringify(container.registrations));

    // Iterate over all container registrations to find `Routes`
    Object.entries(container.registrations).forEach(([key]) => {
        if (key.endsWith("Routes")) {
            logger.debug("Mounting routes for:", { key });

            try {
                const routeInstance = container.resolve(key);

                // Check for `getRoutes` method and mount
                if (typeof routeInstance.getRoutes === "function") {
                    const basePath = `/${pluralize(key.replace("Routes", "").toLowerCase())}`;
                    router.use(basePath, routeInstance.getRoutes());

                    logger.info(`Mounted routes at ${basePath}`);
                } else {
                    logger.error(
                        "Route instance does not have getRoutes method",
                        { key },
                    );
                }
            } catch (error) {
                logger.error("Error mounting routes", { key, error });
            }
        }
    });

    return router;
};

module.exports = routes;
