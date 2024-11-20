const express = require("express");
const logger = require("./src/shared/logger/LoggerService");
const config = require("config");

const app = express();
const PORT = config.get("PORT");

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    logger.info("Server is running on http://localhost:" + PORT);
});
