const {
    createContainer,
    asValue,
    asClass,
    Lifetime,
    InjectionMode,
    asFunction,
} = require("awilix");
const LoggerService = require("./shared/logger/LoggerService");
const RSSParser = require("rss-parser");
const Validator = require("./shared/utils/Validator");
const Scheduler = require("./shared/utils/Scheduler");

const container = createContainer();

container.register({
    logger: asValue(LoggerService),
    parser: asValue(new RSSParser()),
    validator: asClass(Validator).singleton(),
    scheduler: asClass(Scheduler).singleton(),
});

container.loadModules(
    [
        "src/modules/**/application/**/*.js",
        /**
         * We cannot register domain objects implicitly
         * because they are created in the application layer
         * to create a new instance of the domain object
         *
         * i.e. new Article({ ... })
         */
        "src/modules/**/domain/**/!(Article).js",
        "src/modules/**/infrastructure/**/*.js",
    ],
    {
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
            injectionMode: InjectionMode.PROXY,
        },
        formatName: "camelCase",
    },
);

// Explicit registrations of domain objects
container.register({
    Article: asFunction(() =>
        require("./modules/Articles/domain/Article"),
    ).singleton(),
});

module.exports = container;
