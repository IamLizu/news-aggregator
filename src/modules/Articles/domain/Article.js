class Article {
    constructor({
        title,
        link,
        publicationDate,
        description,
        content,
        topics,
    }) {
        this.title = title;
        this.link = link;
        this.publicationDate = publicationDate;
        this.description = description;
        this.content = content;
        this.topics = topics || [];
    }
}

module.exports = Article;
