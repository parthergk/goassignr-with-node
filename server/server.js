const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");
const WebSocket = require("ws");
const http = require("http");
const cors = require("cors");
const { GoogleAuth } = require('google-auth-library');

const app = express();
const server = http.createServer(app);
const router = express.Router();

async function authenticate() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  return await auth.getClient();
}

async function initializeVertexAI() {
  const client = await authenticate();
  return new VertexAI({ auth: client });
}

async function initializeGenerativeModel() {
  const vertex_ai = await initializeVertexAI();

  const model = "gemini-1.0-pro-001";

  return vertex_ai.preview.getGenerativeModel({
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
}

let generativeModel;

initializeGenerativeModel().then(model => {
  generativeModel = model;
});

const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', function connection(ws) {
  console.log('Client connected to WebSocket.');

  ws.on('close', function () {
    console.log('Client disconnected from WebSocket.');
  });
});

app.use(express.json());

const allowedOrigins = [
  'https://goassignr-9iawjk39x-gaurav5xys-projects.vercel.app',
  'https://goassignr.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

router.post("/data", async (req, res) => {
  try {
    const { content } = req.body;

    const reqData = {
      contents: [{ role: "user", parts: [{ text: `Write an assignment on this topic: ${content}` }] }],
    };

    if (!generativeModel) {
      return res.status(500).json({ error: "Generative model not initialized yet" });
    }

    const streamingResp = await generativeModel.generateContentStream(reqData);

    for await (const item of streamingResp.stream) {
      wsServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(item.candidates[0].content.parts));
        }
      });
    }

    res.send("Success");
    
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(router);

// Initialize and start the server
const PORT = 8080;
server.listen(PORT, async () => {
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    console.log(`Server running on port ${PORT}`);
    console.log(`Project ID: ${projectId}`);
  } catch (error) {
    console.error("Error getting project ID:", error);
    process.exit(1); // Exit the process with an error
  }
});
