import asyncio
import websockets

async def handler(websocket):
    print("Client connected!")
    await websocket.send("Hello from test server")
    await asyncio.Future()

async def main():
    print("Starting test server on port 8766...")
    async with websockets.serve(handler, "localhost", 8766):
        print("Server is listening!")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
