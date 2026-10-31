const { connect, Project, json } = require("../lib/db");

exports.handler = async (event) => {
    try {
        await connect();

        // Anyone can read the projects
        if (event.httpMethod === "GET") {
            return json(200, await Project.find().sort({ createdAt: 1 }));
        }

        // Adding or deleting needs your secret key in the x-admin-key header
        const key = event.headers["x-admin-key"];
        if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
            return json(401, { error: "Unauthorized" });
        }

        if (event.httpMethod === "POST") {
            return json(201, await Project.create(JSON.parse(event.body || "{}")));
        }

        if (event.httpMethod === "DELETE") {
            const id = event.queryStringParameters && event.queryStringParameters.id;
            if (!id) return json(400, { error: "Missing id" });
            await Project.findByIdAndDelete(id);
            return json(200, { ok: true });
        }

        return json(405, { error: "Method not allowed" });
    } catch (err) {
        console.error(err.message);
        return json(500, { error: "Server error" });
    }
};