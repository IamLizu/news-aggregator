const validator = require("validator");

class Validator {
    constructor() {
        this.validator = validator;
    }

    /**
     * Validate URL.
     *
     * @param {string} url - URL to validate.
     * @returns {boolean} - True if valid, false otherwise.
     */
    isValidURL(url) {
        return this.validator.isURL(url, {
            require_protocol: true,
            protocols: ["http", "https"],
        });
    }
}

module.exports = Validator;
