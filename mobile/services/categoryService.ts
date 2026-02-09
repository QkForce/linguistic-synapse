import { db } from "./db";

export interface Category {
  id: number;
  title: string;
  totalSentences: number;
}

export const categoryService = {
  getAllCategories: (): Category[] => {
    return db.getAllSync<Category>(`
      SELECT 
          c.id,
          c.title,
          COUNT(DISTINCT l.id) AS totalSentences
      FROM categories c
      LEFT JOIN sentences l ON c.id = l.category_id
      GROUP BY c.id
      ORDER BY c.title ASC;`);
  },
};
