#!/usr/bin/env python3
import sys
sys.path.append('.')

try:
    from general_analyzer import GeneralAnalyzer
    print("GeneralAnalyzer import OK")
except Exception as e:
    print(f"GeneralAnalyzer import failed: {e}")

try:
    from bark_tts import play_speech_directly
    print("bark_tts import OK")
except Exception as e:
    print(f"bark_tts import failed: {e}")

try:
    from squats import SquatAnalyzer
    print("SquatAnalyzer import OK")
except Exception as e:
    print(f"SquatAnalyzer import failed: {e}")

try:
    from WarriorPose import WarriorPoseAnalyzer
    print("WarriorPoseAnalyzer import OK")
except Exception as e:
    print(f"WarriorPoseAnalyzer import failed: {e}")

try:
    from lunges_vision import LungesAnalyzer
    print("LungesAnalyzer import OK")
except Exception as e:
    print(f"LungesAnalyzer import failed: {e}")

try:
    from legRaises import SLRExerciseAnalyzer
    print("SLRExerciseAnalyzer import OK")
except Exception as e:
    print(f"SLRExerciseAnalyzer import failed: {e}")

print("Import test complete")