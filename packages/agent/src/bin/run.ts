import dotenv from 'dotenv';
import path from 'path';

// Robust environment variable loading MUST happen before other imports
// 1. Try loading from package root (local dev override)
dotenv.config(); 
// 2. Try loading from monorepo root (../../.env)
const rootEnvPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: rootEnvPath });

// Import app logic dynamically AFTER env vars are loaded
const { createAgent, createAgentServer } = await import('../index.js');

console.log("Starting Agent Server...");

const PORT = parseInt(process.env.PORT || "3001");
const MODEL_NAME = process.env.MODEL_NAME || "gemini-3-flash-preview";

// Ensure keys are present (or handle gracefully)
if (!process.env.GOOGLE_API_KEY && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.warn("WARNING: No API keys found in environment. Agent may fail to respond.");
} else {
  console.log("API Keys found.");
}

try {
  const agent = createAgent({
    systemPrompt: "You are a helpful AI assistant called OpenAgent.",
    provider: process.env.AI_PROVIDER || "google",
    modelName: MODEL_NAME,
  });

  const app = createAgentServer(agent);

  // Listen on 0.0.0.0 to ensure accessibility
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent server running on http://0.0.0.0:${PORT}`);
    console.log(`- Provider: ${process.env.AI_PROVIDER || "google"}`);
    console.log(`- Model: ${MODEL_NAME}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
