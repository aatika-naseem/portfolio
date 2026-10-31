const nodemailer = require("nodemailer");
const { connect, Message, json } = require("../lib/db");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

    let data;
    try {
        data = JSON.parse(event.body || "{}");
    } catch {
        return json(400, { error: "Invalid request" });
    }

    const { name, email, message } = data;
    if (!name || !email || !message) {
        return json(400, { error: "All fields are required" });
    }

    // 1. Save the message
    try {
        await connect();
        await Message.create({ name, email, message });
    } catch (err) {
        console.error("Save failed:", err.message);
        return json(500, { error: "Server error" });
    }

    // 2. Email alert (best effort: a failed email must not fail the form)
    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                replyTo: email,
                subject: `New portfolio message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            });
        }
    } catch (err) {
        console.error("Email failed:", err.message);
    }

    return json(201, { ok: true });
};