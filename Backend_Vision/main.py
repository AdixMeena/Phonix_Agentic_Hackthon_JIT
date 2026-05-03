import cv2
import asyncio
import json
import logging
import threading
import time
import websockets
from functools import partial
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load GeneralAnalyzer FIRST to initialize mediapipe DLL cleanly
from general_analyzer import GeneralAnalyzer
from bark_tts import play_speech_directly
from asyncio import Queue, create_task

# Try-except imports to handle TensorFlow/Dependency issues gracefully
try:
    from squats import SquatAnalyzer
except Exception as e:
    if 'logger' in globals():
        logger.error(f"Failed to load SquatAnalyzer: {e}")
    SquatAnalyzer = None

try:
    from WarriorPose import WarriorPoseAnalyzer
except Exception as e:
    logger.error(f"Failed to load WarriorPoseAnalyzer: {e}")
    WarriorPoseAnalyzer = None

try:
    from lunges_vision import LungesAnalyzer
except Exception as e:
    logger.error(f"Failed to load LungesAnalyzer: {e}")
    LungesAnalyzer = None

try:
    from legRaises import SLRExerciseAnalyzer 
except Exception as e:
    logger.error(f"Failed to load SLRExerciseAnalyzer: {e}")
    SLRExerciseAnalyzer = None



class VideoServer:
    def __init__(self):
        self.cap = None
        self.clients = set()
        self.event_loop = None
        self.server = None
        self.running = False
        self.current_analyzer = None
        self.frame_processing_task = None

        self.tts_queue = Queue()
        self.tts_worker_task = None

        self.language=""
        self.audiobot = ""
        self.last_ws_frame_time = 0

        # Initialize analyzers safely - GeneralAnalyzer MUST be initialized LAST
        # because it eagerly inits mediapipe at module level, and we need
        # the other analyzers' lazy imports to run first to get the right DLL context.
        self.analyzers = {}
        if SquatAnalyzer:
            try:
                self.analyzers["Squats"] = SquatAnalyzer()
                self.analyzers["squats"] = self.analyzers["Squats"]
                logger.info("SquatAnalyzer loaded")
            except Exception as e:
                logger.error(f"SquatAnalyzer instantiation failed: {e}")
        if WarriorPoseAnalyzer:
            try:
                self.analyzers["Warrior"] = WarriorPoseAnalyzer()
                self.analyzers["warrior_pose"] = self.analyzers["Warrior"]
                logger.info("WarriorPoseAnalyzer loaded")
            except Exception as e:
                logger.error(f"WarriorPoseAnalyzer instantiation failed: {e}")
        if LungesAnalyzer:
            try:
                self.analyzers["Lunges"] = LungesAnalyzer()
                self.analyzers["lunges"] = self.analyzers["Lunges"]
                logger.info("LungesAnalyzer loaded")
            except Exception as e:
                logger.error(f"LungesAnalyzer instantiation failed: {e}")
        if SLRExerciseAnalyzer:
            try:
                self.analyzers["LegRaises"] = SLRExerciseAnalyzer()
                self.analyzers["leg_raises"] = self.analyzers["LegRaises"]
                logger.info("SLRExerciseAnalyzer loaded")
            except Exception as e:
                logger.error(f"SLRExerciseAnalyzer instantiation failed: {e}")
        # GeneralAnalyzer initialized last
        self.analyzers["general"] = GeneralAnalyzer()
        logger.info(f"Loaded analyzers: {list(self.analyzers.keys())}")

    async def process_frames(self, input_source=0):
        """Centralized frame processing loop with TTS error reporting."""
        try:
            self.cap = cv2.VideoCapture(input_source)
            if not self.cap.isOpened():
                logger.error(f"Error: Could not open video source {input_source}")
                await self._broadcast({"error": "Could not open video source"})
                return

            # TTS-related state variables
            self.last_error_text = None
            self.error_hold_start_time = None
            self.last_tts_time = 0
            self.tts_repeat_interval = 5.0
            self.error_tts_cooldown = 0.0

            self.tts_worker_task = create_task(self._tts_worker())

            logger.info("Started processing frames")
            while self.running and self.cap.isOpened():
                start_time = time.time()

                success, frame = self.cap.read()
                if not success:
                    logger.info("End of video or camera disconnected")
                    await self._broadcast({"error": "Video source disconnected"})
                    break

                if self.current_analyzer:
                    # Skip local camera capture if we recently received a frame from the browser
                    if time.time() - self.last_ws_frame_time < 2.0:
                        await asyncio.sleep(0.1)
                        continue

                    try:
                        processed_data = await self.current_analyzer.process_video(frame)

                        if processed_data:
                            # --- TTS Error Monitoring Logic ---
                            error_text = processed_data.get("error_text", "") or ""
                            if error_text:
                                error_text = error_text.strip()
                            current_time = time.time()

                            if error_text:
                                if error_text != self.last_error_text:
                                    self.last_error_text = error_text
                                    self.error_hold_start_time = current_time
                                    self.last_tts_time = 0
                                
                                time_held = current_time - self.error_hold_start_time
                                time_since_last_tts = current_time - self.last_tts_time
                                
                                if (time_held >= self.error_tts_cooldown and 
                                    (self.last_tts_time == 0 or 
                                    time_since_last_tts >= self.tts_repeat_interval)):
                                    
                                    if self.audiobot != "off":
                                        while not self.tts_queue.empty():
                                            try:
                                                self.tts_queue.get_nowait()
                                                self.tts_queue.task_done()
                                            except asyncio.QueueEmpty:
                                                break

                                        await self.tts_queue.put(error_text)
                                        self.last_tts_time = current_time


                            else:
                                self.last_error_text = None
                                self.error_hold_start_time = None
                                self.last_tts_time = 0

                            await self._broadcast(processed_data)

                    except Exception as e:
                        logger.error(f"Error processing frame: {e}")
                        await self._broadcast({"error": f"Frame processing error: {str(e)}"})

                processing_time = time.time() - start_time
                await asyncio.sleep(max(0, 0.033 - processing_time))

        except Exception as e:
            logger.error(f"Error during frame processing: {e}")
            await self._broadcast({"error": f"Frame processing error: {str(e)}"})
        finally:
            if self.cap:
                self.cap.release()
                self.cap = None

            if self.tts_worker_task:
                self.tts_worker_task.cancel()
                try:
                    await self.tts_worker_task
                except asyncio.CancelledError:
                    pass


            if self.current_analyzer:
                try:
                    report = self.current_analyzer.generate_report()
                    if report is not None:
                        print("\n" + report)
                        with open('report.txt', 'w') as f:
                            f.write(report)
                        await self._broadcast({"type": "report", "data": report})
                    else:
                        logger.warning("No report was generated (returned None)")
                except Exception as e:
                    logger.error(f"Error generating report: {e}")

            logger.info("Video processing stopped")
            await self._broadcast({"status": "stopped"})

    def set_language(self, language_code: str):
        """Set the language for TTS playback."""
        supported_languages = ["en", "ur"]
        if language_code in supported_languages:
            self.language = language_code
            logger.info(f"TTS language set to {language_code}")
        else:
            logger.warning(f"Unsupported language: {language_code}")

    async def _tts_worker(self):
        while True:
            error_text = await self.tts_queue.get()
            try:
                tts_result = await play_speech_directly(error_text, self.language)
                if tts_result["audio_data"]:
                    await self._broadcast({
                        "type": "audio",
                        "audio_data": tts_result["audio_data"]
                    })
                if tts_result["error"]:
                    logger.error(tts_result["error"])
            except Exception as e:
                logger.error(f"TTS worker error: {e}")
            finally:
                self.tts_queue.task_done()

    # async def process_frames(self, input_source=0):
    #     """Centralized frame processing loop."""
    #     try:
    #         self.cap = cv2.VideoCapture(input_source)
    #         if not self.cap.isOpened():
    #             logger.error(f"Error: Could not open video source {input_source}")
    #             await self._broadcast({"error": "Could not open video source"})
    #             return

    #         logger.info("Started processing frames")
    #         while self.running and self.cap.isOpened():
    #             start_time = time.time()

    #             success, frame = self.cap.read()
    #             if not success:
    #                 logger.info("End of video or camera disconnected")
    #                 await self._broadcast({"error": "Video source disconnected"})
    #                 break

    #             # Process frame with the current analyzer if selected
    #             if self.current_analyzer:
    #                 try:
    #                     processed_data = await self.current_analyzer.process_video(frame)
    #                     if processed_data:
    #                         await self._broadcast(processed_data)
    #                 except Exception as e:
    #                     logger.error(f"Error processing frame: {e}")
    #                     await self._broadcast({"error": f"Frame processing error: {str(e)}"})

    #             # Maintain ~30 FPS
    #             processing_time = time.time() - start_time
    #             await asyncio.sleep(max(0, 0.033 - processing_time))  # Target ~30fps

    #     except Exception as e:
    #         logger.error(f"Error during frame processing: {e}")
    #         await self._broadcast({"error": f"Frame processing error: {str(e)}"})
    #     finally:
    #         if self.cap:
    #             self.cap.release()
    #             self.cap = None
            
    #         # Generate report if analyzer exists
    #         if self.current_analyzer:
    #             try:
    #                 report = self.current_analyzer.generate_report()
    #                 if report is not None:
    #                     print("\n" + report)
    #                     with open('report.txt', 'w') as f:
    #                         f.write(report)
    #                     # Send report to clients
    #                     await self._broadcast({"type": "report", "data": report})
    #                 else:
    #                     logger.warning("No report was generated (returned None)")
    #             except Exception as e:
    #                 logger.error(f"Error generating report: {e}")
            
    #         logger.info("Video processing stopped")
    #         # Notify clients that processing has stopped
    #         await self._broadcast({"status": "stopped"})
            
    async def _broadcast(self, message):
        """Broadcast a message to all connected clients."""
        if not self.clients:
            return
            
        dead_clients = set()
        message_json = json.dumps(message)
        
        # Iterate over a copy to avoid 'set changed size during iteration' error
        for client in list(self.clients):
            try:
                await client.send(message_json)
            except websockets.exceptions.ConnectionClosed:
                dead_clients.add(client)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                dead_clients.add(client)
                
        # Remove dead clients
        self.clients -= dead_clients
        if dead_clients:
            logger.info(f"Removed {len(dead_clients)} dead clients")

    def broadcast_message(self, message):
        """Broadcast a message to all connected clients from any thread."""
        if self.event_loop and self.clients:
            asyncio.run_coroutine_threadsafe(self._broadcast(message), self.event_loop)

    async def websocket_handler(self, websocket):
        """Handle incoming WebSocket connections."""
        self.clients.add(websocket)
        client_info = f"{websocket.remote_address[0]}:{websocket.remote_address[1]}"
        logger.info(f"New client connected: {client_info}")
        
        # Send initial connection status
        await websocket.send(json.dumps({"status": "connected"}))
        
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    action = data.get('action')
                    exercise = data.get('exercise')
                    self.language = data.get("language")
                    print(self.language, "This is language value")
                    self.audiobot = data.get("audiobot")
                    print(self.audiobot, "This is audiobot value")
                    logger.info(f"Received action: {action}, exercise: {exercise}")

                    if action == 'connect':
                        await websocket.send(json.dumps({"status": "connected"}))
                    elif action == 'language':
                        if data.get('language'):
                            self.set_language(data.get('language'))
                            await websocket.send(json.dumps({"status": "language_updated", "language": data.get('language')}))
                        else:
                            await websocket.send(json.dumps({"error": "Missing language"}))
                    elif action == 'start':
                        # Use specified analyzer or fallback to general
                        selected_exercise = exercise if exercise in self.analyzers else "general"
                        await self.start_exercise(selected_exercise, websocket)
                    elif 'frame' in data:
                        # Process frame sent from frontend
                        await self.process_websocket_frame(data['frame'], websocket)
                    elif action == 'stop':
                        await self.stop_exercise(websocket)
                    elif action == 'disconnect':
                        logger.info(f"Client requested disconnect: {client_info}")
                        await websocket.send(json.dumps({"status": "disconnected"}))
                        # Client will be removed in the finally block
                        break
                    else:
                        logger.warning(f"Unknown action: {action}")
                        await websocket.send(json.dumps({"error": "Unknown action"}))
                except json.JSONDecodeError:
                    logger.error("Invalid JSON received")
                    await websocket.send(json.dumps({"error": "Invalid request format"}))
                except Exception as e:
                    logger.error(f"Error handling message: {e}")
                    await websocket.send(json.dumps({"error": f"Server error: {str(e)}"}))
        except websockets.ConnectionClosed:
            logger.info(f"Client disconnected: {client_info}")
        except Exception as e:
            logger.error(f"Unexpected error in websocket handler: {e}")
        finally:
            self.clients.discard(websocket)  # Use discard to avoid KeyError
            logger.info(f"Client removed: {client_info}")

    async def process_websocket_frame(self, frame_base64, websocket):
        """Decode and process a frame sent via WebSocket."""
        if not self.current_analyzer:
            return
        
        self.last_ws_frame_time = time.time()
        
        try:
            import base64
            import numpy as np
            # Decode base64
            img_data = base64.b64decode(frame_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Use the current analyzer to process the frame
                processed_data = await self.current_analyzer.process_video(frame)
                if processed_data:
                    # Send back to the specific client
                    await websocket.send(json.dumps(processed_data))
                    
                    # Also handle TTS logic for these frames
                    error_text = processed_data.get("error_text", "")
                    if error_text and self.audiobot != "off":
                        current_time = time.time()
                        if error_text != getattr(self, 'last_error_text', None):
                            self.last_error_text = error_text
                            self.error_hold_start_time = current_time
                        
                        time_held = current_time - getattr(self, 'error_hold_start_time', 0)
                        if time_held >= getattr(self, 'error_tts_cooldown', 0):
                            await self.tts_queue.put(error_text)
                            self.last_tts_time = current_time
            else:
                await websocket.send(json.dumps({
                    "feedback": "Received invalid frame",
                    "error_text": "Could not decode camera frame",
                    "confidence": 0,
                }))
        except Exception as e:
            logger.error(f"Error processing websocket frame: {e}")
            try:
                await websocket.send(json.dumps({
                    "feedback": "Vision server error",
                    "error_text": str(e),
                    "confidence": 0,
                }))
            except Exception:
                pass

    async def start_exercise(self, exercise, websocket):
        """Start processing frames for the specified exercise."""
        if self.running:
            await websocket.send(json.dumps({"status": "already_running"}))
            return

        try:
            # Map exercise names to analyzers
            analyzer_key = exercise
            if exercise not in self.analyzers:
                analyzer_key = "general"
            
            self.current_analyzer = self.analyzers[analyzer_key]
            self.current_analyzer.reset_counters()  # Reset counters for new exercise
            
            # Configure analyzer for specific exercise if it's the general analyzer
            if analyzer_key == "general" and hasattr(self.current_analyzer, 'set_exercise_config'):
                # Exercise-specific angle targets (would ideally come from database)
                exercise_configs = {
                    'Knee flexion stretch': {'min': 90, 'max': 120},
                    'Straight leg raise': {'min': 40, 'max': 50},
                    'Terminal knee extension': {'min': 0, 'max': 15},
                    'Shoulder pendulum': {'min': 0, 'max': 360},  # Free range
                    'Shoulder blade squeeze': {'min': 20, 'max': 40},
                    'Pelvic tilt': {'min': 0, 'max': 15},
                    'Cat-camel stretch': {'min': 10, 'max': 40},
                    'Wrist flexion and extension': {'min': 60, 'max': 70},
                    'Grip strengthening': {'min': 0, 'max': 100},
                }
                
                config = exercise_configs.get(exercise, {'min': 0, 'max': 180})
                self.current_analyzer.set_exercise_config(exercise, config['min'], config['max'])
            
            self.running = True
            
            # Cancel any existing task
            if self.frame_processing_task and not self.frame_processing_task.done():
                self.frame_processing_task.cancel()
                
            # Start new task
            self.frame_processing_task = asyncio.create_task(self.process_frames())
            await websocket.send(json.dumps({"status": "started", "exercise": exercise}))
            logger.info(f"Started exercise: {exercise}")
        except Exception as e:
            logger.error(f"Error starting exercise: {e}")
            await websocket.send(json.dumps({"error": f"Failed to start {exercise}: {str(e)}"}))

    async def stop_exercise(self, websocket):
        """Stop processing frames."""
        if not self.running:
            await websocket.send(json.dumps({"status": "not_running"}))
            return

        self.running = False
        await websocket.send(json.dumps({"status": "stopping"}))
        
        # Wait for frame processing to complete
        if self.frame_processing_task and not self.frame_processing_task.done():
            try:
                # Give it some time to clean up
                await asyncio.wait_for(asyncio.shield(self.frame_processing_task), timeout=2.0)
            except asyncio.TimeoutError:
                # If it takes too long, cancel it
                self.frame_processing_task.cancel()
                logger.warning("Frame processing task took too long to stop, cancelled it")
                
        logger.info("Exercise stopped")

    async def run_server_async(self, host='0.0.0.0', port=8766):
        """Start the WebSocket server asynchronously and keep it running."""
        print(f"Attempting to start WebSocket server on ws://{host}:{port}...")
        try:
            self.server = await websockets.serve(
                self.websocket_handler,
                host,
                port,
                ping_interval=30,
                ping_timeout=10
            )
            print(f"WebSocket server SUCCESS: Started on ws://{host}:{port}")
            logger.info(f"WebSocket server started on ws://{host}:{port}")
            print("Server is now running... Press Ctrl+C to stop")
            try:
                # Keep the server running
                await asyncio.Future()  # run forever
            except KeyboardInterrupt:
                print("Server stopped by user")
            except Exception as e:
                print(f"Server error: {e}")
                logger.error(f"Server error: {e}")
        except Exception as e:
            logger.error(f"Failed to start WebSocket server: {e}")
        finally:
            if self.server:
                self.server.close()
                await self.server.wait_closed()

    def start_server(self, host='0.0.0.0', port=8766):
        """Main entry point to start the server."""
        print(f"Starting server on {host}:{port}")
        try:
            asyncio.run(self.run_server_async(host, port))
        except KeyboardInterrupt:
            print("Server stopped by user")
            logger.info("Server stopped by user")
        except Exception as e:
            print(f"Server error: {e}")
            logger.error(f"Server error: {e}")

if __name__ == "__main__":
    server = VideoServer()
    server.start_server(host='localhost', port=8765)
