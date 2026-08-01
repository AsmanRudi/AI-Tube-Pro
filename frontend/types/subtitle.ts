export interface SubtitleSegment {
  index: number;
  start_time: string;
  end_time: string;
  text: string;
}

export interface SubtitleResult {
  segments: SubtitleSegment[];
  total_segments: number;
  format: string;
  language: string;
}

export interface GenerateSubtitleRequest {
  script: string;
  language: string;
  format: string;
}
