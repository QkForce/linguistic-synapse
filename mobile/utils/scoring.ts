import { LessonFinalStats, SentenceResult } from "@/types/lesson";
import { LessonLog } from "@/types/stat";

const TIME_TO_WORD_RATIO = 2000;
const BASE_TIME = 3000;
const WEIGHT_ACCURACY = 0.5;
const WEIGHT_CONFIDENCE = 0.3;
const WEIGHT_TIME = 0.2;

type TimeEfficiencyScore = "slow" | "normal" | "fast" | "cheating";

const calculateWordsCount = (sentence: string, target_lang: string): number => {
  const words = sentence.trim().split(/\s+/);
  return words.filter((word) => word.length > 0).length;
};

const calculateIdealTime = (sentence: string, target_lang: string): number => {
  const words = calculateWordsCount(sentence, target_lang);
  return words * TIME_TO_WORD_RATIO + BASE_TIME;
};

const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] =
          Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) +
          1;
    }
  }
  return matrix[b.length][a.length];
};

const calculateSentenceAccuracy = (
  responseText: string,
  targetText: string,
): number => {
  const response = responseText.trim().toLowerCase();
  const target = targetText.trim().toLowerCase();

  if (response === target) return 1.0;

  const distance = getLevenshteinDistance(response, target);
  const maxLength = Math.max(response.length, target.length);

  // Егер қате саны мәтін ұзындығының 20%-ынан аспаса - 0.5 балл
  if (distance <= maxLength * 0.2) return 0.5;

  return 0;
};

export const getScoreForTimeEfficiency = (
  timeEfficiency: number,
): TimeEfficiencyScore => {
  let status: TimeEfficiencyScore = "normal";
  if (timeEfficiency < 70) status = "slow";
  else if (timeEfficiency > 250) status = "cheating";
  else if (timeEfficiency > 120) status = "fast";
  return status;
};

export const prepareSentenceResult = (
  sentence_id: number,
  native_text: string,
  target_text: string,
  response_text: string,
  confidence: number,
  response_time_ms: number,
  target_lang: string,
): SentenceResult => {
  const accuracy = calculateSentenceAccuracy(response_text, target_text);
  const ideal_time_ms = calculateIdealTime(target_text, target_lang);
  return {
    sentence_id,
    native_text,
    target_text,
    response_text,
    accuracy,
    confidence,
    response_time_ms,
    ideal_time_ms,
  };
};

export const calculateLessonStats = (
  results: SentenceResult[],
): LessonFinalStats => {
  const total = results.length;
  if (total === 0)
    return {
      total_time_ms: 0,
      ideal_time_ms: 0,
      accuracy: 0,
      confidence: 0,
      time_efficiency: 0,
      time_overuse_ms: 0,
      final_score: 0,
    };

  let accuracyAvg = 0;
  let confidenceAvg = 0;
  let idealTimeTotal = 0;
  let responseTimeTotal = 0;
  let timeEfficiencyAvg = 0;

  results.forEach((res) => {
    accuracyAvg += res.accuracy;
    confidenceAvg += res.confidence;
    idealTimeTotal += res.ideal_time_ms;
    responseTimeTotal += res.response_time_ms;
    timeEfficiencyAvg +=
      res.response_time_ms > 0 ? res.ideal_time_ms / res.response_time_ms : 0;
  });

  accuracyAvg = (accuracyAvg / total) * 100;
  confidenceAvg = (confidenceAvg / total) * 100;
  timeEfficiencyAvg = (timeEfficiencyAvg / total) * 100;
  const timeEfficiency = Math.min(100, Math.max(0, timeEfficiencyAvg));
  const timeOveruseMs = responseTimeTotal - idealTimeTotal;

  const finalScore =
    accuracyAvg * WEIGHT_ACCURACY +
    confidenceAvg * WEIGHT_CONFIDENCE +
    timeEfficiency * WEIGHT_TIME;

  return {
    total_time_ms: responseTimeTotal,
    ideal_time_ms: idealTimeTotal,
    accuracy: parseFloat(accuracyAvg.toFixed(2)),
    confidence: parseFloat(confidenceAvg.toFixed(2)),
    time_efficiency: parseFloat(timeEfficiencyAvg.toFixed(2)),
    time_overuse_ms: timeOveruseMs,
    final_score: parseFloat(finalScore.toFixed(2)),
  };
};

export const calculateMonthlyStats = (
  logs: LessonLog[],
): { monthlyAccuracy: number } => {
  const total = logs.length;
  if (total === 0) return { monthlyAccuracy: 0 };

  let accuracyAvg = 0;
  logs.forEach((log) => {
    accuracyAvg += log.accuracy;
  });
  accuracyAvg = accuracyAvg / total;

  return {
    monthlyAccuracy: parseFloat(accuracyAvg.toFixed(2)),
  };
};
