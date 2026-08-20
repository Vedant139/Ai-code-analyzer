require("dotenv").config();

const express = require("express");
const path = require("node:path");
const { generateInterviewTurn, generateFinalInterviewReport } = require("./services/interviewBackend");

const port = process.env.PORT || 3000;
const publicRoot = process.cwd();
const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicRoot, { extensions: ["html"] }));

app.post("/api/interview/turn", async (request, response) => {
  try {
    const { conversation = [], config = {} } = request.body || {};
    response.json(await generateInterviewTurn(conversation, config));
  } catch (error) {
    response.status(500).json({ error: error.message || "Unable to generate interview turn." });
  }
});

app.post("/api/interview/report", async (request, response) => {
  try {
    const { conversation = [], config = {} } = request.body || {};
    response.json(await generateFinalInterviewReport(conversation, config));
  } catch (error) {
    response.status(500).json({ error: error.message || "Unable to generate interview report." });
  }
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

const contactSubmissions = [];

app.post("/api/contact", (request, response) => {
  try {
    const { fullName, email, phone, subject, message } = request.body || {};
    if (!fullName || !email || !phone || !subject || !message) {
      return response.status(400).json({ error: "All fields are required." });
    }
    const referenceId = `IVX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submission = { referenceId, fullName, email, phone, subject, message, createdAt: new Date().toISOString() };
    contactSubmissions.push(submission);
    response.json({ ok: true, referenceId, message: "Contact inquiry received successfully." });
  } catch (error) {
    response.status(500).json({ error: "Unable to process contact inquiry." });
  }
});

app.get("/api/contact", (_request, response) => {
  response.json({ count: contactSubmissions.length, submissions: contactSubmissions });
});

app.use((_request, response) => {
  response.status(404).sendFile(path.join(publicRoot, "index.html"));
});

app.listen(port, () => {
  console.log(`Intervoxa landing page running at http://localhost:${port}`);
});
