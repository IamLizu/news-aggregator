const OpenAI = require("openai");
const config = require("config");

class NamedEntityExtractor {
    constructor({ logger }) {
        this.logger = logger;
        this.openai = new OpenAI({ apiKey: config.get("OPENAI_KEY") });
    }

    /**
     * Extract named entities from text.
     * @param {string} text - The article content or description.
     * @returns {Object} - Extracted entities (people, locations, organizations).
     */
    async extractEntities(text) {
        try {
            const prompt = `
            Extract named entities (people, locations, organizations) from the following text.
            Return the result in JSON format with keys: "people", "locations", "organizations".

            Text: ${text}
            `;

            const response = await this.openai.completions.create({
                model: "gpt-3.5-turbo-instruct",
                prompt,
                max_tokens: 150,
                temperature: 0.7,
            });

            const entities = JSON.parse(response.choices[0].text.trim());

            this.logger.info("Named entities extracted successfully", {
                entities,
            });
            return entities;
        } catch (error) {
            this.logger.error("Failed to extract named entities", {
                error: error.message,
            });
            return { people: [], locations: [], organizations: [] };
        }
    }
}

module.exports = NamedEntityExtractor;
