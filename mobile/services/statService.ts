import { LessonLog, LogDetails, SentenceLog } from "@/types/stat";
import { formatDate } from "@/utils/time";
import { db } from "./db";

export const statService = {
  getLogDetails: async (logId: number): Promise<LogDetails | null> => {
    try {
      const mainInfo = await db.getFirstAsync<any>(
        `
        SELECT 
          log.*, 
          l.title as lesson_title, 
          m.title as module_title
        FROM lesson_logs log
        JOIN lessons l ON log.lesson_id = l.id
        JOIN modules m ON l.module_id = m.id
        WHERE log.id = ?
      `,
        [logId],
      );

      if (!mainInfo) return null;

      const sentences = await db.getAllAsync<SentenceLog>(
        `
        SELECT * FROM sentence_logs 
        WHERE lesson_log_id = ?
        ORDER BY id ASC
      `,
        [logId],
      );

      return {
        ...mainInfo,
        sentences,
      };
    } catch (error) {
      console.error("Error fetching log details:", error);
      return null;
    }
  },
  getJournalLogs: async (
    year: number,
    month: number,
  ): Promise<LessonLog[] | null> => {
    try {
      const startDate = formatDate(new Date(year, month, 1));
      const endDate = formatDate(new Date(year, month + 1, 0, 23, 59, 59));
      const lesson_logs = await db.getAllAsync<LessonLog>(
        `
        SELECT
          ll.*,
          l.title AS lesson_title,
          (
            SELECT COUNT(*) FROM sentence_logs sl
            WHERE sl.lesson_log_id = ll.id
          ) as sentence_count
        FROM lesson_logs ll
        JOIN lessons l ON ll.lesson_id = l.id
        WHERE ll.created_at BETWEEN ? AND ?
        ORDER BY ll.created_at DESC
      `,
        [startDate, endDate],
      );

      return lesson_logs;
    } catch (error) {
      console.error("Error fetching log details:", error);
      return null;
    }
  },
};
