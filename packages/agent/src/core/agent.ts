import { Agent } from "@mariozechner/pi-agent-core";
import { getModel } from "@mariozechner/pi-ai";

/**
 * Configuration options for creating an agent.
 */
export interface AgentConfig {
  /**
   * The system prompt that defines the agent's persona and instructions.
   */
  systemPrompt: string;
  /**
   * The model provider to use (e.g., 'openai', 'anthropic', 'google').
   */
  provider: string;
  /**
   * The model name to use (e.g., 'gpt-4o', 'gemini-2.0-flash').
   */
  modelName: string;
  /**
   * Optional initial user message to start the conversation.
   */
  initialMessage?: string;
}

/**
 * Creates a new Agent instance with the specified configuration.
 * 
 * @param config - The configuration for the agent.
 * @returns A configured Agent instance.
 */
export function createAgent(config: AgentConfig): Agent {
  const { systemPrompt, provider, modelName } = config;

  const agent = new Agent({
    initialState: {
      systemPrompt,
      model: getModel(provider as any, modelName),
    },
    getApiKey: async (providerId) => {
      if (providerId === 'google') return process.env.GOOGLE_API_KEY || "";
      if (providerId === 'openai') return process.env.OPENAI_API_KEY || "";
      if (providerId === 'anthropic') return process.env.ANTHROPIC_API_KEY || "";
      return "";
    }
  });

  return agent;
}

// Re-export types from core for convenience
export { Agent };
