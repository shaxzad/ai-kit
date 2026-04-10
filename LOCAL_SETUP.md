# Local Setup Guide for Google Gemma 4

This guide explains how to set up and run the Google Gemma 4 model locally using Ollama for use with the AI-kit platform.

## 1. Install Ollama
Download and install Ollama for your operating system:
- **macOS/Windows/Linux**: [https://ollama.com/download](https://ollama.com/download)

## 2. Pull Gemma 4 Model
Open your terminal and run the following command to download the Gemma 4 E4B model (recommended for most users):

```bash
ollama pull gemma4:e4b
```

If you have a high-end GPU, you might want to try the larger dense model:
```bash
ollama pull gemma4:31b
```

## 3. Configure Environment Variables
Ensure your `.env` file in the project root has the following settings:

```env
LOCAL_LLM_ENABLED=true
LOCAL_LLM_MODEL=gemma4:e4b
LOCAL_LLM_ENDPOINT=http://localhost:11434/api/chat
```

## 4. Run Ollama
Make sure the Ollama application is running. You can verify it's working by visiting `http://localhost:11434` in your browser.

## 6. Set up Local Whisper (Optional for STT)
If you want fully local speech-to-text, you can use the included Whisper server script.

### 1. Install Python Dependencies
```bash
pip install fastapi uvicorn faster-whisper python-multipart
```

### 2. Configure Whisper
Ensure your `.env` has:
```env
LOCAL_WHISPER_ENABLED=true
LOCAL_WHISPER_URL=http://localhost:8000/v1
WHISPER_MODEL=base
```

### 3. Run the Whisper Server
```bash
python local_whisper.py
```
This will start a high-performance Whisper API on port 8000. It will automatically download the model on the first run.
