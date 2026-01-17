import { LogDetails, SentenceLog } from "@/types/stat";
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
        [logId]
      );

      if (!mainInfo) return null;

      const sentences = await db.getAllAsync<SentenceLog>(
        `
        SELECT * FROM sentence_logs 
        WHERE lesson_log_id = ?
        ORDER BY id ASC
      `,
        [logId]
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
};
