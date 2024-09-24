import express from "express";  
import cors from "cors";
import { CopilotRuntime, GroqAdapter, copilotRuntimeNodeHttpEndpoint } from "@copilotkit/runtime";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});

const copilotKit = new CopilotRuntime();

// Use cors middleware
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

app.use("/copilotkit", (req, res, next) => {
  const serviceAdapter = new GroqAdapter({ groq, model: "llama3-8b-8192" });
  
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: "/copilotkit",
    runtime: copilotKit,
    serviceAdapter,
  });

  return handler(req, res, next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(4000, () => {
  console.log("Listening at http://localhost:4000/copilotkit");
});
 