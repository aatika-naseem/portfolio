require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err.message));

/* ---------- Models ---------- */
const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
    })
);

const Project = mongoose.model(
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

/* ---------- Simple admin check ---------- */
function requireAdmin(req, res, next) {
    const key = req.headers["x-admin-key"];
    if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

/* ---------- Contact form ---------- */
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        await Message.create({ name, email, message });
        res.status(201).json({ ok: true });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

/* ---------- Projects ---------- */
app.get("/api/projects", async (req, res) => {
    try {
        res.json(await Project.find().sort({ createdAt: 1 }));
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
        res.status(201).json(await Project.create(req.body));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));