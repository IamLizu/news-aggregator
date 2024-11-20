const express = require("express");
const logger = require("./src/shared/logger/LoggerService");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    logger.info("Server is running on http://localhost:3000", {
        file: "entry",
        port: 3000,
    });
});
