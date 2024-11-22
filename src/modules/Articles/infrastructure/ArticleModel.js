const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        link: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        publicationDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            trim: true,
        },
        topics: {
            type: [String],
            default: [],
        },
        entities: {
            people: [String],
            locations: [String],
            organizations: [String],
        },
        source: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Article", articleSchema);
