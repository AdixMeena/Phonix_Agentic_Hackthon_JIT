# Graph Report - mishra  (2026-05-03)

## Corpus Check
- 41 files · ~43,523 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 358 nodes · 409 edges · 73 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]

## God Nodes (most connected - your core abstractions)
1. `SquatAnalyzer` - 42 edges
2. `LungesAnalyzer` - 37 edges
3. `SLRExerciseAnalyzer` - 32 edges
4. `WarriorPoseAnalyzer` - 31 edges
5. `GeneralAnalyzer` - 21 edges
6. `VideoServer` - 18 edges
7. `LungesAnalyzer` - 12 edges
8. `Centralized frame processing loop with TTS error reporting.` - 6 edges
9. `Set the language for TTS playback.` - 6 edges
10. `Broadcast a message to all connected clients.` - 6 edges

## Surprising Connections (you probably didn't know these)
- `VideoServer` --uses--> `GeneralAnalyzer`  [INFERRED]
  Backend_Vision\main.py → Backend_Vision\general_analyzer.py
- `Centralized frame processing loop with TTS error reporting.` --uses--> `GeneralAnalyzer`  [INFERRED]
  Backend_Vision\main.py → Backend_Vision\general_analyzer.py
- `Set the language for TTS playback.` --uses--> `GeneralAnalyzer`  [INFERRED]
  Backend_Vision\main.py → Backend_Vision\general_analyzer.py
- `Broadcast a message to all connected clients.` --uses--> `GeneralAnalyzer`  [INFERRED]
  Backend_Vision\main.py → Backend_Vision\general_analyzer.py
- `Broadcast a message to all connected clients from any thread.` --uses--> `GeneralAnalyzer`  [INFERRED]
  Backend_Vision\main.py → Backend_Vision\general_analyzer.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): Reset counters and recording state., SLRExerciseAnalyzer, LungesAnalyzer, Reset counters and data storage., Process a single frame and return data to broadcast., Generate and return an exercise report., Clean up resources when the object is deleted., Centralized frame processing loop with TTS error reporting. (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (17): Convert MediaPipe landmarks to format compatible with preprocessing code, Convert keypoints dictionary to DataFrame, Extract biomechanically relevant angles from keypoints, Normalize a vector to unit length, Calculate the angle between two 3D vectors in degrees, Extract biomechanically relevant angles from keypoints, Add velocity features based on frame-to-frame changes, Process a single frame and extract features (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (11): LungesAnalyzer, Normalize left/right sides to treat them as the same movement pattern., Calculate important angles and distances for lunge form assessment., Reset counters and data storage., Process a single frame and return data to broadcast., Encode frame as base64., Generate and return an exercise report., Detect lunge form in a single frame with detailed feedback. (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (11): Normalize left/right sides to treat them as the same movement pattern., Calculate important angles and distances for lunge form assessment., Encode frame as base64., Detect lunge form in a single frame., Calculate the angle between three points in degrees., Check if landmarks are visible., Analyze lunges exercise and return errors., Improved rep counting logic with direction tracking. (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (11): AnalyzeRequest, angle_degrees(), FeedbackPayload, JointScore, midpoint(), save_session(), score_for_angle(), score_label() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (6): main(), play_speech_directly(), Generate speech and return audio data as base64 string.          Args:, Translate English text to Urdu, translate_to_urdu(), Input()

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (4): GeneralAnalyzer, Configure analyzer for specific exercise, Calculate angle between three points, Get the relevant angle for current exercise

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (4): Process a single frame and return data to broadcast., Encode frame as base64., Calculate the angle between three points in degrees., Analyze rehab straight leg raises and return top 3 errors.

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (3): Process a single frame and return data to broadcast., Encode frame as base64., Analyze Warrior II pose and return top 3 errors.

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (2): formatTime(), MessageBubble()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (2): Generate and print an exercise report., Run the analyzer with webcam input.

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Generate speech and return audio data as base64 string.          Args:

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Translate English text to Urdu

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): Calculate the angle between three points in degrees.

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): Analyze rehab straight leg raises and return top 3 errors.

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): Reset counters and recording state.

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Process a single frame and return data to broadcast.

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Encode frame as base64.

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): Generate and print an exercise report.

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Run the analyzer with webcam input.

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Extract hip, knee, and ankle keypoints from a single frame.

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (1): Normalize left/right sides to treat them as the same movement pattern.

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): Calculate important angles and distances for lunge form assessment.

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): Reset counters and data storage.

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): Encode frame as base64.

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): Detect lunge form in a single frame.

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (1): Calculate the angle between three points in degrees.

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): Check if landmarks are visible.

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (1): Analyze lunges exercise and return errors.

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Improved rep counting logic with direction tracking.

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Reset counters and recording state.

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Encode frame as base64.

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (1): Generate and return an exercise report.

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Clean up resources when the object is deleted.

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Initialize the squat analyzer with trained model and preprocessing tools

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Convert MediaPipe landmarks to format compatible with preprocessing code

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Convert keypoints dictionary to DataFrame

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): Calculate vector between two keypoints

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): Normalize a vector to unit length

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): Calculate the angle between two 3D vectors in degrees

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (1): Add velocity features based on frame-to-frame changes

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (1): Process a single frame and extract features

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (1): Make a prediction using the current feature buffer

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (1): Smooth predictions to avoid flickering

### Community 74 - "Community 74"
Cohesion: 1.0
Nodes (1): Update squat state and count reps based on squat depth

### Community 75 - "Community 75"
Cohesion: 1.0
Nodes (1): Update the count of the current prediction/error

### Community 76 - "Community 76"
Cohesion: 1.0
Nodes (1): Process a single frame and return data to broadcast.

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (1): Generate a report summarizing reps and error occurrences

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (1): Reset rep count and error counts

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): Rescale the input frame to improve processing speed.                  Args:

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): Process a single frame and return data to broadcast.

### Community 81 - "Community 81"
Cohesion: 1.0
Nodes (1): Calculate the angle between three points in degrees.

### Community 82 - "Community 82"
Cohesion: 1.0
Nodes (1): Analyze Warrior II pose and return top 3 errors.

### Community 83 - "Community 83"
Cohesion: 1.0
Nodes (1): Reset frame counts and report metrics for a new session.

### Community 84 - "Community 84"
Cohesion: 1.0
Nodes (1): Generate and return an exercise report.

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (1): Process a single frame and return data to broadcast.

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (1): Encode frame as base64.

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (1): Called after a patient completes a camera session.     Persists the session sco

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (1): AI agent endpoint. Call this right after /session returns a session_id.     Fet

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (1): Returns aggregated session stats for a patient.

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (1): Returns recent session analyses for a patient.     Used by DoctorPatientDetail

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (1): Doctor sends feedback message to a patient.

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (1): Fetch all feedback messages for a patient.

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (1): Called after a patient completes a camera session.     Persists the session sco

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): AI agent endpoint. Call this right after /session returns a session_id.     Fet

### Community 95 - "Community 95"
Cohesion: 1.0
Nodes (1): Returns aggregated session stats for a patient.

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (1): Returns recent session analyses for a patient.     Used by DoctorPatientDetail

### Community 97 - "Community 97"
Cohesion: 1.0
Nodes (1): Doctor sends feedback message to a patient.

### Community 98 - "Community 98"
Cohesion: 1.0
Nodes (1): Fetch all feedback messages for a patient.

### Community 99 - "Community 99"
Cohesion: 1.0
Nodes (1): Called after a patient completes a camera session.     Persists the session sco

### Community 100 - "Community 100"
Cohesion: 1.0
Nodes (1): Returns aggregated session stats for a patient.

### Community 101 - "Community 101"
Cohesion: 1.0
Nodes (1): Doctor sends feedback message to a patient.

### Community 102 - "Community 102"
Cohesion: 1.0
Nodes (1): Fetch all feedback messages for a patient.

## Knowledge Gaps
- **120 isolated node(s):** `Generate speech and return audio data as base64 string.          Args:`, `Translate English text to Urdu`, `Configure analyzer for specific exercise`, `Calculate angle between three points`, `Get the relevant angle for current exercise` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 12`** (6 nodes): `PatientHealthChat.jsx`, `formatTime()`, `MessageBubble()`, `PatientHealthChat()`, `PhoenixLogo()`, `TypingDots()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `Generate and print an exercise report.`, `Run the analyzer with webcam input.`, `.generate_report()`, `.run()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `Generate speech and return audio data as base64 string.          Args:`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `Translate English text to Urdu`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `Calculate the angle between three points in degrees.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `Analyze rehab straight leg raises and return top 3 errors.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `Reset counters and recording state.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Process a single frame and return data to broadcast.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Encode frame as base64.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `Generate and print an exercise report.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Run the analyzer with webcam input.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Extract hip, knee, and ankle keypoints from a single frame.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `Normalize left/right sides to treat them as the same movement pattern.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Calculate important angles and distances for lunge form assessment.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `Reset counters and data storage.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `Encode frame as base64.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Detect lunge form in a single frame.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `Calculate the angle between three points in degrees.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `Check if landmarks are visible.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `Analyze lunges exercise and return errors.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Improved rep counting logic with direction tracking.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Reset counters and recording state.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Encode frame as base64.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `Generate and return an exercise report.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Clean up resources when the object is deleted.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Initialize the squat analyzer with trained model and preprocessing tools`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Convert MediaPipe landmarks to format compatible with preprocessing code`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Convert keypoints dictionary to DataFrame`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `Calculate vector between two keypoints`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `Normalize a vector to unit length`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `Calculate the angle between two 3D vectors in degrees`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `Add velocity features based on frame-to-frame changes`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (1 nodes): `Process a single frame and extract features`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `Make a prediction using the current feature buffer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `Smooth predictions to avoid flickering`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (1 nodes): `Update squat state and count reps based on squat depth`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `Update the count of the current prediction/error`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `Process a single frame and return data to broadcast.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (1 nodes): `Generate a report summarizing reps and error occurrences`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (1 nodes): `Reset rep count and error counts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (1 nodes): `Rescale the input frame to improve processing speed.                  Args:`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (1 nodes): `Process a single frame and return data to broadcast.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (1 nodes): `Calculate the angle between three points in degrees.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (1 nodes): `Analyze Warrior II pose and return top 3 errors.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (1 nodes): `Reset frame counts and report metrics for a new session.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (1 nodes): `Generate and return an exercise report.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (1 nodes): `Process a single frame and return data to broadcast.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (1 nodes): `Encode frame as base64.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (1 nodes): `Called after a patient completes a camera session.     Persists the session sco`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (1 nodes): `AI agent endpoint. Call this right after /session returns a session_id.     Fet`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `Returns aggregated session stats for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `Returns recent session analyses for a patient.     Used by DoctorPatientDetail`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `Doctor sends feedback message to a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `Fetch all feedback messages for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `Called after a patient completes a camera session.     Persists the session sco`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `AI agent endpoint. Call this right after /session returns a session_id.     Fet`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `Returns aggregated session stats for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `Returns recent session analyses for a patient.     Used by DoctorPatientDetail`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `Doctor sends feedback message to a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `Fetch all feedback messages for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `Called after a patient completes a camera session.     Persists the session sco`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (1 nodes): `Returns aggregated session stats for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (1 nodes): `Doctor sends feedback message to a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `Fetch all feedback messages for a patient.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SquatAnalyzer` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `LungesAnalyzer` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `VideoServer` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `SquatAnalyzer` (e.g. with `VideoServer` and `Centralized frame processing loop with TTS error reporting.`) actually correct?**
  _`SquatAnalyzer` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 21 inferred relationships involving `LungesAnalyzer` (e.g. with `VideoServer` and `Centralized frame processing loop with TTS error reporting.`) actually correct?**
  _`LungesAnalyzer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 22 inferred relationships involving `SLRExerciseAnalyzer` (e.g. with `VideoServer` and `Centralized frame processing loop with TTS error reporting.`) actually correct?**
  _`SLRExerciseAnalyzer` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 22 inferred relationships involving `WarriorPoseAnalyzer` (e.g. with `VideoServer` and `Centralized frame processing loop with TTS error reporting.`) actually correct?**
  _`WarriorPoseAnalyzer` has 22 INFERRED edges - model-reasoned connections that need verification._