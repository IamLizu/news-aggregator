const OpenAI = require("openai");
const config = require("config");

class NamedEntityExtractor {
    constructor({ logger }) {
        this.logger = logger;
        this.openai = new OpenAI({ apiKey: config.get("OPENAI_KEY") });
    }

    /**
     * Extract named entities from text using OpenAI.
     *
     * @param {string} text - The article content or description.
     * @returns {Object} - Extracted entities (people, locations, organizations).
     */
    async extractEntities(text) {
        try {
            const prompt = `
            Extract named entities (people, locations, organizations) from the following text.
            Return the result strictly as valid JSON with keys: "people", "locations", "organizations".

            Text: ${text}
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 200,
                temperature: 0,
            });

            const resultText = response.choices[0].message.content.trim();

            try {
                const entities = JSON.parse(resultText);
                this.logger.info("Named entities extracted successfully", {
                    entities,
                });
                return entities;
            } catch (parseError) {
                this.logger.error("Failed to parse JSON response", {
                    response: resultText,
                    error: parseError.message,
                });

                return { people: [], locations: [], organizations: [] };
            }
        } catch (error) {
            this.logger.error("Failed to extract named entities", {
                error: error.message,
            });

            return { people: [], locations: [], organizations: [] };
        }
    }
}

module.exports = NamedEntityExtractor;
