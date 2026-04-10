
export interface LocalLLMResponse {
  content: string;
  error?: string;
}

const LOCAL_LLM_ENDPOINT = process.env.LOCAL_LLM_ENDPOINT || "http://localhost:11434/api/chat";
const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL || "gemma4:e4b";

/**
 * Calls a local LLM (e.g., Ollama running Gemma 4) for structured tasks.
 * Optimized for Gemma 4's native JSON output and function calling capabilities.
 */
export async function callLocalLLM(
  prompt: string, 
  systemPrompt: string = "You are a helpful assistant.",
  jsonMode: boolean = true
): Promise<LocalLLMResponse> {
  if (process.env.LOCAL_LLM_ENABLED !== "true") {
    return { content: "", error: "Local LLM is disabled" };
  }

  try {
    const response = await fetch(LOCAL_LLM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LOCAL_LLM_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: false,
        format: jsonMode ? "json" : undefined,
        options: {
          temperature: 0.1, // Low temperature for consistent scoring
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { 
      content: data.message?.content || data.response || "",
    };
  } catch (error) {
    console.error("Local LLM Error:", error);
    return { 
      content: "", 
      error: error instanceof Error ? error.message : "Unknown error connecting to local LLM" 
    };
  }
}
