import { Exercise, SentenceResult } from "@/types/exercise";
import { db } from "./db";

export const exerciseService = {
  getExercisesByCategoryId: (
    categoryId: number,
    nativeLang: string = "kk",
    targetLang: string = "en",
    limit: number = 10,
  ): Exercise[] => {
    const rows = db.getAllSync<any>(
      `SELECT 
        s.id,
        c.title as cat_title,
        s.number,
        GROUP_CONCAT(st_native.text, ';') as all_native,
        GROUP_CONCAT(st_target.text, ';') as all_target
      FROM sentences s
      JOIN categories c ON s.category_id = c.id
      JOIN sentence_translations st_native ON s.id = st_native.sentence_id AND st_native.lang = ?
      JOIN sentence_translations st_target ON s.id = st_target.sentence_id AND st_target.lang = ?
      WHERE s.category_id = ?
      GROUP BY s.id
      ORDER BY s.number ASC
      LIMIT ?`,
      [nativeLang, targetLang, categoryId, limit],
    );

    return rows.map((row) => ({
      id: row.id,
      cat_title: row.cat_title,
      number: row.number,
      native_texts: row.all_native.split(";"),
      target_texts: row.all_target.split(";"),
      native_text: row.all_native.split(";")[0],
      target_text: row.all_target.split(";")[0],
    }));
  },
  saveExerciseResults: (
    categoryId: number,
    totalStats: {
      native_lang: string;
      target_lang: string;
      total_time_ms: number;
      ideal_time_ms: number;
      accuracy: number;
      confidence: number;
      time_efficiency: number;
      time_overuse_ms: number;
      final_score: number;
    },
    sentenceResults: SentenceResult[],
  ): number | null => {
    let sessionLogId: number | null = null;
    db.withTransactionSync(() => {
      const result = db.runSync(
        `INSERT INTO
          session_logs (
            category_id,
            native_lang,
            target_lang,
            total_time_ms,
            ideal_time_ms,
            accuracy,
            confidence,
            time_efficiency,
            time_overuse_ms,
            final_score
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          totalStats.native_lang,
          totalStats.target_lang,
          totalStats.total_time_ms,
          totalStats.ideal_time_ms,
          totalStats.accuracy,
          totalStats.confidence,
          totalStats.time_efficiency,
          totalStats.time_overuse_ms,
          totalStats.final_score,
        ],
      );
      sessionLogId = result.lastInsertRowId;
      for (const res of sentenceResults) {
        db.runSync(
          `INSERT INTO
            sentence_logs (
              session_log_id,
              sentence_id,
              native_text,
              target_text,
              response_text,
              accuracy,
              confidence,
              response_time_ms,
              ideal_time_ms
            )
          VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sessionLogId,
            res.sentence_id,
            res.native_text,
            res.target_text,
            res.response_text,
            res.accuracy,
            res.confidence,
            res.response_time_ms,
            res.ideal_time_ms,
          ],
        );
      }
    });
    return sessionLogId;
  },
};
