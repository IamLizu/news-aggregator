import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        files: ["**/*.js"],
        languageOptions: { sourceType: "commonjs" },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "warn",
            "prettier/prettier": "error",
        },
    },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    {
        plugins: {
            prettier: prettier,
        },
    },
];
