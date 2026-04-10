import asyncio
import websockets
import json

async def test_streaming():
    uri = "ws://localhost:8000/v1/audio/stream"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            # Send some dummy binary data to see if server responds
            # Since we don't have a real audio chunk here, we'll just send a small burst
            # Note: The server expects WebM data, so a random bytearray might cause an error
            # but we can check if it stays connected and handles the data.
            dummy_data = bytearray([0] * 50000) # 50KB of zeros
            await websocket.send(dummy_data)
            print("Sent 50KB dummy data")
            
            try:
                # Wait for a response (timeout after 5s)
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                print(f"Received response: {response}")
            except asyncio.TimeoutError:
                print("No response from server (Timeout)")
            
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_streaming())
