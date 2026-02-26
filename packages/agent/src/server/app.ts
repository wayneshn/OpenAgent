import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Agent } from '@mariozechner/pi-agent-core';

export function createAgentServer(agent: Agent): Express {
  const app = express();
  
  // Debug logging
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // Secure CORS configuration
  app.use(cors({
    origin: ['http://localhost:5173'], // Restrict to known frontend origin
    methods: ['POST', 'OPTIONS'], // Allow OPTIONS for preflight
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }));

  app.use(express.json());

  app.post('/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const unsubscribe = agent.subscribe((event) => {
        if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
            const text = event.assistantMessageEvent.delta;
            // Send data as SSE event
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      });

      await agent.prompt(message);
      
      // Cleanup
      unsubscribe();
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      console.error("Agent execution error:", err);
      res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
    }
  });

  return app;
}
