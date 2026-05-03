import cv2
import mediapipe as mp
import base64
import json
import logging
import math

logger = logging.getLogger(__name__)

class GeneralAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.35,
            min_tracking_confidence=0.35
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.reps = 0
        self.frame_count = 0
        self.start_time = None
        
        # Exercise-specific state
        self.current_exercise = None
        self.target_min_angle = 0
        self.target_max_angle = 180
        self.rep_state = 'waiting'  # 'waiting', 'in_range', 'completed'
        self.last_angle = None

    def reset_counters(self):
        self.reps = 0
        self.frame_count = 0
        self.start_time = None
        self.rep_state = 'waiting'
        self.last_angle = None

    def set_exercise_config(self, exercise_name, target_min=0, target_max=180):
        """Configure analyzer for specific exercise"""
        self.current_exercise = exercise_name.lower().replace(' ', '_')
        self.target_min_angle = target_min
        self.target_max_angle = target_max
        self.reset_counters()
        logger.info(f"Configured for exercise: {exercise_name}, target: {target_min}-{target_max}°")

    def _calculate_angle(self, point1, point2, point3):
        """Calculate angle between three points"""
        # Convert to numpy arrays
        p1 = [point1.x, point1.y]
        p2 = [point2.x, point2.y] 
        p3 = [point3.x, point3.y]
        
        # Vectors
        v1 = [p1[0] - p2[0], p1[1] - p2[1]]
        v2 = [p3[0] - p2[0], p3[1] - p2[1]]
        
        # Dot product
        dot = v1[0] * v2[0] + v1[1] * v2[1]
        
        # Magnitudes
        mag1 = math.sqrt(v1[0]**2 + v1[1]**2)
        mag2 = math.sqrt(v2[0]**2 + v2[1]**2)
        
        if mag1 == 0 or mag2 == 0:
            return 0
            
        # Cosine of angle
        cos_angle = dot / (mag1 * mag2)
        cos_angle = max(-1, min(1, cos_angle))  # Clamp to avoid domain errors
        
        # Angle in degrees
        angle = math.degrees(math.acos(cos_angle))
        return angle

    def _get_exercise_angle(self, landmarks):
        """Get the relevant angle for current exercise"""
        if not self.current_exercise:
            return None
            
        pose = self.mp_pose.PoseLandmark
        
        if 'knee_flexion' in self.current_exercise or 'knee' in self.current_exercise:
            # Knee flexion: hip-knee-ankle angle
            left_hip = landmarks[pose.LEFT_HIP]
            left_knee = landmarks[pose.LEFT_KNEE]
            left_ankle = landmarks[pose.LEFT_ANKLE]
            return self._calculate_angle(left_hip, left_knee, left_ankle)
            
        elif 'leg_raise' in self.current_exercise or 'straight_leg' in self.current_exercise:
            # Straight leg raise: hip-knee-ankle angle (should be ~180° when straight)
            left_hip = landmarks[pose.LEFT_HIP]
            left_knee = landmarks[pose.LEFT_KNEE]
            left_ankle = landmarks[pose.LEFT_ANKLE]
            return self._calculate_angle(left_hip, left_knee, left_ankle)
            
        elif 'terminal_knee' in self.current_exercise:
            # Terminal knee extension: hip-knee-ankle angle
            left_hip = landmarks[pose.LEFT_HIP]
            left_knee = landmarks[pose.LEFT_KNEE]
            left_ankle = landmarks[pose.LEFT_ANKLE]
            return self._calculate_angle(left_hip, left_knee, left_ankle)
            
        elif 'shoulder_pendulum' in self.current_exercise:
            # Shoulder pendulum: shoulder-elbow-wrist angle (elbow should be extended)
            left_shoulder = landmarks[pose.LEFT_SHOULDER]
            left_elbow = landmarks[pose.LEFT_ELBOW]
            left_wrist = landmarks[pose.LEFT_WRIST]
            return self._calculate_angle(left_shoulder, left_elbow, left_wrist)
            
        elif 'shoulder_blade' in self.current_exercise or 'squeeze' in self.current_exercise:
            # Shoulder blade squeeze: measure shoulder retraction (distance between shoulders)
            left_shoulder = landmarks[pose.LEFT_SHOULDER]
            right_shoulder = landmarks[pose.RIGHT_SHOULDER]
            # Return distance as a proxy for retraction (smaller distance = more retracted)
            distance = math.sqrt((left_shoulder.x - right_shoulder.x)**2 + (left_shoulder.y - right_shoulder.y)**2)
            return distance * 100  # Scale for readability
            
        elif 'pelvic_tilt' in self.current_exercise:
            # Pelvic tilt: angle between hip-shoulder line and vertical
            left_hip = landmarks[pose.LEFT_HIP]
            left_shoulder = landmarks[pose.LEFT_SHOULDER]
            # Calculate angle from vertical
            dx = left_shoulder.x - left_hip.x
            dy = left_shoulder.y - left_hip.y
            angle = math.degrees(math.atan2(dx, dy))
            return abs(angle)
            
        elif 'cat_camel' in self.current_exercise:
            # Cat-camel: spinal curvature (angle at mid-spine)
            left_shoulder = landmarks[pose.LEFT_SHOULDER]
            left_hip = landmarks[pose.LEFT_HIP]
            nose = landmarks[pose.NOSE]
            return self._calculate_angle(left_shoulder, nose, left_hip)
            
        elif 'wrist' in self.current_exercise:
            # Wrist flexion/extension: elbow-wrist-hand angle
            left_elbow = landmarks[pose.LEFT_ELBOW]
            left_wrist = landmarks[pose.LEFT_WRIST]
            left_index = landmarks[pose.LEFT_INDEX]
            return self._calculate_angle(left_elbow, left_wrist, left_index)
            
        return None  # Unknown exercise

    def _encode_frame(self, frame):
        _, buffer = cv2.imencode('.jpg', frame)
        return base64.b64encode(buffer).decode('utf-8')

    async def process_video(self, frame):
        try:
            self.frame_count += 1
            # Convert to RGB for MediaPipe
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(frame_rgb)
            
            annotated_frame = frame.copy()
            feedback = ""
            error_text = ""
            current_angle = None
            
            # Simple rep counting based on vertical movement of the nose
            if results.pose_landmarks:
                # Get current angle for exercise
                current_angle = self._get_exercise_angle(results.pose_landmarks.landmark)
                
                # Exercise-specific rep counting and feedback
                if current_angle is not None:
                    angle_in_range = self.target_min_angle <= current_angle <= self.target_max_angle
                    
                    if self.rep_state == 'waiting' and angle_in_range:
                        self.rep_state = 'in_range'
                        feedback = f"Good! Angle: {current_angle:.1f}°"
                    elif self.rep_state == 'in_range' and not angle_in_range:
                        self.rep_state = 'completed'
                        self.reps += 1
                        feedback = f"Rep {self.reps} completed!"
                        # Reset for next rep
                        self.rep_state = 'waiting'
                    elif self.rep_state == 'in_range':
                        feedback = f"Hold position! Angle: {current_angle:.1f}°"
                    else:
                        if current_angle < self.target_min_angle:
                            feedback = f"Increase angle to {self.target_min_angle}° (current: {current_angle:.1f}°)"
                            error_text = f"Angle too small: {current_angle:.1f}° < {self.target_min_angle}°"
                        elif current_angle > self.target_max_angle:
                            feedback = f"Decrease angle to {self.target_max_angle}° (current: {current_angle:.1f}°)"
                            error_text = f"Angle too large: {current_angle:.1f}° > {self.target_max_angle}°"
                else:
                    feedback = "Tracking body..."
                    error_text = "Unable to calculate angle"

            # Draw skeleton with better visibility
            is_detected = results.pose_landmarks is not None
            color = (0, 255, 0) if is_detected else (0, 0, 255) # Green if detected, red if not
            
            if is_detected:
                # Custom style for thicker lines and brighter markers
                landmark_style = self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1, circle_radius=1)
                connection_style = self.mp_drawing.DrawingSpec(color=color, thickness=2)
                
                self.mp_drawing.draw_landmarks(
                    annotated_frame, 
                    results.pose_landmarks, 
                    self.mp_pose.POSE_CONNECTIONS,
                    landmark_style,
                    connection_style
                )
                
                # Display angle if available
                if current_angle is not None:
                    cv2.putText(
                        annotated_frame,
                        f"Angle: {current_angle:.1f}°",
                        (20, 70),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (255, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )
                
                cv2.putText(
                    annotated_frame,
                    feedback,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0),
                    2,
                    cv2.LINE_AA,
                )
            else:
                feedback = "Person not detected"
                error_text = "Please move into view"
                cv2.putText(
                    annotated_frame,
                    "Move fully into the frame",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    (0, 0, 255),
                    2,
                    cv2.LINE_AA,
                )
                cv2.rectangle(annotated_frame, (0, 0), (annotated_frame.shape[1], annotated_frame.shape[0]), (0, 0, 255), 10)

            frame_base64 = self._encode_frame(annotated_frame)
            
            return {
                "type": "frame",
                "frame": frame_base64,
                "data": frame_base64, # for compatibility
                "reps": self.reps,
                "rep_count": self.reps, # for compatibility
                "feedback": feedback,
                "confidence": 0.85 if is_detected else 0.0,
                "error_text": error_text,
                "current_angle": current_angle
            }
        except Exception as e:
            logger.error(f"GeneralAnalyzer error: {e}")
            return None

    def generate_report(self):
        return f"General session completed. Total frames: {self.frame_count}"
