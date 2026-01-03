import { db } from "./db";

export interface Lesson {
  id: number;
  title: string;
  completed: number;
}

export const lessonService = {
  getAllLessons: (moduleId: number): Lesson[] => {
    return db.getAllSync<Lesson>(
      `SELECT 
          l.*, 
          CASE WHEN log.lesson_id IS NOT NULL THEN 1 ELSE 0 END as completed
      FROM lessons l
      LEFT JOIN lesson_logs log ON l.id = log.lesson_id
      WHERE l.module_id = ?`,
      [moduleId]
    );
  },
  getLessonById: (id: number): Lesson | null => {
    return db.getFirstSync<Lesson>("SELECT * FROM lessons WHERE id = ?", [id]);
  },
};
