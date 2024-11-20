# news-aggregator

<!-- A Node.js REST API that _____  -->

> [!NOTE]  
> Built with [Domain Driven Design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design) principles in mind.  
> Dependencies are injected using [awilix](https://www.npmjs.com/package/awilix).

## Table of Contents
- [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
- [Lint Code](#lint-code)
- [Run Application](#run-application)
- [Logging](#logging)

<!-- ## Features -->

## Setup
Please follow the instructions below to setup the application on your local machine.

### Prerequisites
- Node.js (v20.10.0)

### Installation

```bash
yarn install
```

### Environment Variables

[config](https://www.npmjs.com/package/config) package is used to manage configuration settings for the application. It allows setting different configuration settings for different environments easily.

Please create  `development.json` / `production.json` file in `config` directory following the `default.json` file as a template. This file will be used to store all the configuration settings for the application.

## Lint Code

[ESLint](https://eslint.org/) is used to lint the code. To lint the code, run the following command:

```bash
yarn lint
```

In order to fix the linting issues automatically, run the following command:

```bash
yarn lint:fix
```

> [!NOTE]
> Unused variables are only allowed with a `_` prefix. This is to prevent the `no-unused-vars` rule from throwing an error when using the `_` variable in the code.  
> Useful for cases like the `next` function in Express.js error handling middleware.

## Run Application
In development mode, the application uses [nodemon](https://www.npmjs.com/package/nodemon) to automatically restart the server when changes are made to the code.

```bash
yarn dev
```

To run the application in production mode, run the following command:

```bash
yarn start
```
## Logging
Once you run the application, you may see the logs in the console.

The application uses [winston](https://www.npmjs.com/package/winston) for logging. The logs are stored in the `logs` directory. The logs are rotated daily (20mb max size) and stored in the `logs` directory with the format `application-YYYY-MM-DD.log` and `error-YYYY-MM-DD.log`.


<!-- ## API Endpoints -->