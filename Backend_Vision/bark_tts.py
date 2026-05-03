import asyncio
import os
import tempfile
import base64

try:
    import edge_tts
    EDGE_TTS_AVAILABLE = True
except ImportError:
    edge_tts = None
    EDGE_TTS_AVAILABLE = False

try:
    from googletrans import Translator  # 3.1.0a0
    TRANSLATOR_AVAILABLE = True
except (ImportError, AttributeError) as e:
    print(f"googletrans import failed: {e}")
    Translator = None
    TRANSLATOR_AVAILABLE = False

async def play_speech_directly(text, lang='en'):
    """
    Generate speech and return audio data as base64 string.
    
    Args:
        text (str): English text to convert to speech
        lang (str): Output language code ('en' or 'ur')
    
    Returns:
        dict: Contains 'audio_data' (base64-encoded MP3) and 'error' (if any)
    """
    try:
        if not EDGE_TTS_AVAILABLE:
            return {"audio_data": None, "error": "edge_tts is not installed. Text-to-speech is disabled."}

        # Translate if needed
        voice = "en-US-JennyNeural"
        if lang == 'ur':
            text = translate_to_urdu(text)
            voice = "ur-PK-UzmaNeural"
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
            tmp_path = tmp_file.name

        # Generate and save to temp file
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(tmp_path)

        # Read the audio file as binary and encode to base64
        print("Converting Audio")
        with open(tmp_path, 'rb') as audio_file:
            audio_data = base64.b64encode(audio_file.read()).decode('utf-8')
        print("Converting Complete")

        # Clean up
        os.unlink(tmp_path)

        return {"audio_data": audio_data, "error": None}

    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        return {"audio_data": None, "error": f"Error generating speech: {str(e)}"}





def translate_to_urdu(text):
    """Translate English text to Urdu"""
    if not TRANSLATOR_AVAILABLE:
        return text

    translator = Translator()
    try:
        print("Translating Text")
        translation = translator.translate(text, src='en', dest='ur')
        print("Translation Complete")
        return translation.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Return original text if translation fails

async def main():
    print("Edge TTS Audio Bot with Translation")
    print("----------------------------------")
    
    while True:
        print("\nOptions:")
        print("1. Speak English text (direct)")
        print("2. Speak English text (translate to Urdu)")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ")
        
        if choice == '1':
            text = input("Enter English text to speak: ")
            await play_speech_directly(text)
            
        elif choice == '2':
            english_text = input("Enter English text to translate and speak in Urdu: ")
            await play_speech_directly(english_text)
                
        elif choice == '3':
            print("Exiting the audio bot...")
            break
            
        else:
            print("Invalid choice. Please try again.")