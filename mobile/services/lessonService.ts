import { Exercise, Lesson } from "@/types/lesson";
import { db } from "./db";

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
  getExercisesByLessonId: (
    lessonId: number,
    nativeLang: string = "kk",
    targetLang: string = "en"
  ): Exercise[] => {
    return db.getAllSync<Exercise>(
      `SELECT 
        s.id,
        l.title as lesson_title,
        s.number,
        st_native.text as native_text,
        st_target.text as target_text
      FROM sentences s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN sentence_translations st_native ON s.id = st_native.sentence_id AND st_native.lang = ?
      JOIN sentence_translations st_target ON s.id = st_target.sentence_id AND st_target.lang = ?
      WHERE s.lesson_id = ?
      ORDER BY s.number ASC`,
      [nativeLang, targetLang, lessonId]
    );
  },
};
