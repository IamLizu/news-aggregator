class Article {
    constructor({
        title,
        link,
        publicationDate,
        description,
        content,
        topics,
        source,
    }) {
        this.title = title;
        this.link = link;
        this.publicationDate = publicationDate;
        this.description = description;
        this.content = content;
        this.topics = topics || [];
        this.source = source;
    }
}

module.exports = Article;
