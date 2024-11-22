const config = require("config");
const mongoose = require("mongoose");

const logger = require("../../DIContainer").resolve("logger");

const connect = async () => {
    const dbUri = config.get("DATABASE_URL");

    try {
        await mongoose.connect(dbUri);

        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("Failed to connect to MongoDB", {
            error: error.message,
        });

        throw error;
    }
};

const disconnect = async () => {
    try {
        await mongoose.disconnect();

        logger.info("Disconnected from MongoDB");
    } catch (error) {
        logger.error("Failed to disconnect from MongoDB", {
            error: error.message,
        });

        throw error;
    }
};

module.exports = {
    connect,
    disconnect,
};
