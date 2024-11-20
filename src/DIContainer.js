const { createContainer, asValue, Lifetime, InjectionMode } = require("awilix");
const LoggerService = require("./shared/logger/LoggerService");

const container = createContainer();

container.register({
    logger: asValue(LoggerService),
});

container.loadModules(
    [
        "src/modules/**/application/**/*.js",
        "src/modules/**/domain/**/*.js",
        "src/modules/**/infrastructure/**/*.js",
        "src/modules/**/interface/**/*.js",
    ],
    {
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
            injectionMode: InjectionMode.PROXY,
        },
        formatName: "camelCase",
    },
);

module.exports = container;
