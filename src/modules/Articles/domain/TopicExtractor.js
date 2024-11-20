class TopicExtractor {
    extractTopics(content) {
        // Simple keyword extraction logic (example)
        return content ? content.split(" ").slice(0, 5) : [];
    }
}

module.exports = TopicExtractor;
