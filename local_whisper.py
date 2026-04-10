import os
import shutil
import tempfile
import asyncio
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, WebSocket, WebSocketDisconnect
from faster_whisper import WhisperModel
import uvicorn
from starlette.concurrency import run_in_threadpool
import io

app = FastAPI(title="Local Whisper API Server with Streaming")

# Load the model once at startup
MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")
print(f"Loading Whisper model: {MODEL_SIZE}...")
model = WhisperModel(MODEL_SIZE, device="auto", compute_type="int8")
print("Model loaded successfully.")

@app.post("/v1/audio/transcriptions")
async def transcribe(
    file: UploadFile = File(...),
    model_name: str = Form("whisper-1")
):
    try:
        suffix = os.path.splitext(file.filename)[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
            shutil.copyfileobj(file.file, temp_audio)
            temp_audio_path = temp_audio.name

        print(f"Processing translation request for: {file.filename}")
        segments, info = model.transcribe(temp_audio_path, beam_size=5)
        full_text = " ".join([segment.text for segment in segments]).strip()
        os.remove(temp_audio_path)
        return {"text": full_text}
    except Exception as e:
        if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        print(f"Transcribe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/v1/audio/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(">>> WebSocket: Client connected for live streaming.")
    
    audio_buffer = bytearray()
    
    try:
        while True:
            # Receive audio chunk (binary)
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)
            
            # Print feedback to server terminal
            # print(f"Received {len(data)} bytes. (Buffer: {len(audio_buffer)} bytes)")
            
            # Use smaller threshold (e.g., 20KB) to catch data faster in Opus WebM format
            if len(audio_buffer) > 20480: 
                # WebM format is preferred for browser recording
                with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
                    tmp.write(audio_buffer)
                    tmp_path = tmp.name
                
                try:
                    # Run in threadpool to avoid blocking event loop
                    segments, info = await run_in_threadpool(model.transcribe, tmp_path, beam_size=1)
                    text = " ".join([segment.text for segment in segments]).strip()
                    
                    if text:
                        print(f"Live Transcript: {text}")
                        await websocket.send_json({"text": text, "is_final": False})
                except Exception as e:
                    print(f"Streaming model error: {e}")
                finally:
                    if os.path.exists(tmp_path):
                        os.remove(tmp_path)
                
    except WebSocketDisconnect:
        print("<<< WebSocket: Client disconnected.")
    except Exception as e:
        print(f"WebSocket Error: {e}")
        try:
            await websocket.send_json({"error": str(e)})
        except:
            pass

@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL_SIZE, "streaming": True}

if __name__ == "__main__":
    port = int(os.getenv("WHISPER_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
