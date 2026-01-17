export interface LessonLog {
  id: number;
  lesson_id: number;
  native_lang: string;
  target_lang: string;
  total_time_ms: number;
  ideal_time_ms: number;
  accuracy: number;
  confidence: number;
  time_efficiency: number;
  time_overuse_ms: number;
  final_score: number;
  created_at: string;
}

export interface SentenceLog {
  id: number;
  lesson_log_id: number;
  sentence_id: number;
  native_text: string;
  target_text: string;
  response_text: string;
  accuracy: number;
  confidence: number;
  response_time_ms: number;
  ideal_time_ms: number;
}

export interface LogDetails extends LessonLog {
  lesson_title: string;
  module_title: string;
  sentences: SentenceLog[];
}
