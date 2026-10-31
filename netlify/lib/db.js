const mongoose = require("mongoose");

// Reuse the connection between calls so each request doesn't reconnect
async function connect() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
}

const Message =
    mongoose.models.Message ||
    mongoose.model(
        "Message",
        new mongoose.Schema({
            name: { type: String, required: true, trim: true },
            email: { type: String, required: true, trim: true },
            message: { type: String, required: true, trim: true },
            createdAt: { type: Date, default: Date.now },
        })
    );

const Project =
    mongoose.models.Project ||
    mongoose.model(
        "Project",
        new mongoose.Schema({
            title: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true },
            tech: [String],
            image: { type: String, default: "" },
            live: { type: String, default: "#" },
            code: { type: String, default: "#" },
            createdAt: { type: Date, default: Date.now },
        })
    );

const json = (statusCode, body) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});

module.exports = { connect, Message, Project, json };