require('dotenv').config();
const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");
const WebSocket = require("ws");

const router = express.Router();

const vertex_ai = new VertexAI({
  project: "galvanic-ward-422415-a0",
  location: 'us-central1',
  keyFilename: './galvanic-ward-422415-a0-0413cc19aceb.json' // Correct path to your service account key file
});

const model = "gemini-1.0-pro-001";

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.9,
    topP: 1,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

// Create a WebSocket server inside data.js
const wss = new WebSocket.Server({ port: 8080 });

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('Client connected to WebSocket.');

  ws.on('close', function () {
    console.log('Client disconnected from WebSocket.');
  });
});

router.post("/data", async (req, res) => {
  try {
    const { content } = req.body;

    const reqData = {
      contents: [{ role: "user", parts: [{ text: `Write a assignment on this topic : ${content}` }] }],
    };

    const streamingResp = await generativeModel.generateContentStream(reqData);

    // Assuming streamingResp.stream is an async iterable
    for await (const item of streamingResp.stream) {
      // Send each chunk as it comes in to WebSocket clients
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(item.candidates[0].content.parts));
        }
      });
    }

    res.send("Success"); // End the response
    
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
