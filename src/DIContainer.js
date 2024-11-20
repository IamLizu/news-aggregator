const { createContainer, asValue, asFunction } = require("awilix");
const LoggerService = require("./shared/logger/LoggerService");
const Server = require("./Server");

const container = createContainer();

container.register({
    logger: asValue(LoggerService),

    /**
     * Instead of directly registering the Server class,
     * we use a factory (asFunction) to create it,
     * passing resolved dependencies (logger) explicitly.
     * This delays instantiation until the server is resolved,
     * preventing cyclic references.
     */
    server: asFunction(({ logger }) => new Server({ logger })).singleton(),
});

module.exports = container;
