const OpenAI = require("openai");
const config = require("config");

class TopicExtractor {
    constructor({ logger }) {
        this.logger = logger;

        this.openai = new OpenAI({
            apiKey: config.get("OPENAI_KEY"),
        });
    }

    /**
     * Extracts key topics from text using OpenAI.
     * @param {string} text - The article content or description.
     * @param {number} maxTopics - The maximum number of topics to extract.
     * @returns {Promise<Array<string>>} - List of extracted topics.
     */
    async extractTopics(text, maxTopics = 5) {
        try {
            this.logger.info("Extracting topics using OpenAI", {
                textLength: text.length,
                maxTopics,
            });

            const prompt = `Extract ${maxTopics} key topics from the following text. Provide the topics as a comma-separated list of concise keywords. Avoid long phrases or sentences:\n\n${text}`;

            const response = await this.openai.completions.create({
                model: "gpt-3.5-turbo-instruct",
                prompt,
                max_tokens: 100,
                temperature: 0.7,
            });

            const topicsText = response.choices[0]?.text?.trim();
            if (!topicsText) {
                this.logger.warn("No topics extracted from the response");
                return [];
            }

            const topics = topicsText.split(",").map((topic) => topic.trim());

            this.logger.info("Topics extracted successfully", { topics });
            return topics;
        } catch (error) {
            const openAiError = error.response?.data?.error || error.message;
            this.logger.error("Failed to extract topics using OpenAI", {
                error: openAiError,
            });
            throw new Error(`Topic extraction failed: ${openAiError}`);
        }
    }
}

module.exports = TopicExtractor;
