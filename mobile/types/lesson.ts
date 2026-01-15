export interface SentenceResult {
  sentence_id: number;
  native_text: string;
  target_text: string;
  response_text: string;
  accuracy: number;
  confidence: number;
  response_time_ms: number;
  ideal_time_ms: number;
}

export interface LessonFinalStats {
  total_time_ms: number;
  ideal_time_ms: number;
  accuracy: number;
  confidence: number;
  time_efficiency: number;
  time_overuse_ms: number;
  final_score: number;
}
