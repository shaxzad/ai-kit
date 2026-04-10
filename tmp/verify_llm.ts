
import { callLocalLLM } from './src/lib/local-ai';

async function test() {
  console.log("Testing callLocalLLM with server down...");
  // Set environment variables for the test
  process.env.LOCAL_LLM_ENABLED = "true";
  process.env.LOCAL_LLM_ENDPOINT = "http://localhost:11434/api/chat";
  process.env.LOCAL_LLM_MODEL = "gemma4:e4b";

  try {
    const result = await callLocalLLM("Hello", "System Test", false);
    console.log("Result:", JSON.stringify(result, null, 2));
    if (result.error) {
      console.log("Successfully caught error as expected (server should be down).");
    } else {
      console.log("Unexpected success! Is an Ollama server running?");
    }
  } catch (err) {
    console.error("Test failed with exception:", err);
  }
}

test();
