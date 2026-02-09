import { LogDetails, SentenceLog, SessionLog } from "@/types/stat";
import { formatDate } from "@/utils/time";
import { db } from "./db";

export const statService = {
  getLogDetails: async (logId: number): Promise<LogDetails | null> => {
    try {
      const mainInfo = await db.getFirstAsync<any>(
        `
        SELECT 
          log.*, 
          c.title as cat_title
        FROM session_logs log
        JOIN categories c ON log.category_id = c.id
        WHERE log.id = ?
      `,
        [logId],
      );

      if (!mainInfo) return null;

      const sentences = await db.getAllAsync<SentenceLog>(
        `
        SELECT * FROM sentence_logs 
        WHERE session_log_id = ?
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
  ): Promise<SessionLog[] | null> => {
    try {
      const startDate = formatDate(new Date(year, month, 1));
      const endDate = formatDate(new Date(year, month + 1, 0, 23, 59, 59));
      const session_logs = await db.getAllAsync<SessionLog>(
        `
        SELECT
          ll.*,
          c.title AS cat_title,
          (
            SELECT COUNT(*) FROM sentence_logs sl
            WHERE sl.session_log_id = ll.id
          ) as sentence_count
        FROM session_logs ll
        JOIN categories c ON ll.category_id = c.id
        WHERE ll.created_at BETWEEN ? AND ?
        ORDER BY ll.created_at DESC
      `,
        [startDate, endDate],
      );

      return session_logs;
    } catch (error) {
      console.error("Error fetching log details:", error);
      return null;
    }
  },
};
