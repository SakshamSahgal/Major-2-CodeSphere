// backend/webhook.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let lastOutput = null; // in-memory store

// webhook endpoint (backend saves outputs here)
app.post("/webhook/output", (req, res) => {
    const { runId, output, verdict } = req.body;

    lastOutput = { runId, output, verdict, timestamp: Date.now() };
    console.log("Webhook received:", lastOutput);

    res.json({ success: true, message: "Output stored" });
});

// endpoint frontend will listen to (poll)
app.get("/results/latest", (req, res) => {
    res.json(lastOutput || { message: "No output yet" });
});

app.listen(4000, () => {
    console.log("Webhook server listening on port 4000");
});
