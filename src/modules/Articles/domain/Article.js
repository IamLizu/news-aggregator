class Article {
    constructor({
        title,
        link,
        publicationDate,
        description,
        content,
        topics,
        entities,
        source,
    }) {
        this.title = title;
        this.link = link;
        this.publicationDate = publicationDate;
        this.description = description;
        this.content = content;
        this.topics = topics || [];
        this.entities = entities || {
            people: [],
            locations: [],
            organizations: [],
        };
        this.source = source;
    }
}

module.exports = Article;
