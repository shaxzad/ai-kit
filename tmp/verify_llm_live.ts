
import { callLocalLLM } from '../src/lib/local-ai';

async function verify() {
  console.log("🚀 Verifying Local Gemma 4 Integration...");
  
  // Set environment variables for the test
  process.env.LOCAL_LLM_ENABLED = "true";
  process.env.LOCAL_LLM_ENDPOINT = "http://localhost:11434/api/chat";
  process.env.LOCAL_LLM_MODEL = "gemma4:e4b";

  try {
    const prompt = "Please respond with 'Gemma 4 is online' and a brief summary of your capabilities in JSON format.";
    const systemPrompt = "You are a helpful assistant. Output must be valid JSON.";
    
    console.log(`Sending test prompt to ${process.env.LOCAL_LLM_MODEL}...`);
    const result = await callLocalLLM(prompt, systemPrompt, true);
    
    if (result.error) {
      console.error("❌ Verification Failed:", result.error);
      process.exit(1);
    }

    console.log("✅ Verification Successful!");
    console.log("Response Received:", result.content);
    
    // Try parsing the JSON to ensure Gemma 4 is behaving as expected
    try {
      const parsed = JSON.parse(result.content);
      console.log("📊 Parsed JSON Output:", JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.warn("⚠️ Response received but was not valid JSON. Check model performance.");
    }
  } catch (err) {
    console.error("💥 Unexpected exception during verification:", err);
    process.exit(1);
  }
}

verify();
