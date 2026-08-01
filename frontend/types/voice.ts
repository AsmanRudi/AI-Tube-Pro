export interface VoiceoverResult {
  estimated_duration_seconds: number;
  word_count: number;
  voice_style: string;
  speaking_tips: string[];
  script_segments: { text: string; duration_seconds: number; tone: string }[];
}

export interface GenerateVoiceoverRequest {
  script: string;
  language: string;
  voice_style: string;
}
