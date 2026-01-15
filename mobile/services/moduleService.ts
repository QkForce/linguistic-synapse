import { db } from "./db";

export interface Module {
  id: number;
  title: string;
  description?: string;
  totalLessons: number;
  completedLessons: number;
}

export const moduleService = {
  getAllModules: (): Module[] => {
    return db.getAllSync<Module>(`
      SELECT 
          m.id,
          m.title,
          m.description,
          COUNT(DISTINCT l.id) AS totalLessons,
          COUNT(DISTINCT ll.lesson_id) AS completedLessons
      FROM modules m
      LEFT JOIN lessons l ON m.id = l.module_id
      LEFT JOIN lesson_logs ll ON l.id = ll.lesson_id
      GROUP BY m.id
      ORDER BY m.title ASC;`);
  },
  getModuleById: (id: number): Module | null => {
    return db.getFirstSync<Module>("SELECT * FROM modules WHERE id = ?", [id]);
  },
};
