import { saveAndShareJson } from "@/utils/fileUtils";
import { db } from "./db";

export const dataService = {
  exportCategory: async (categoryId: number, fileName: string) => {
    const categoryRow = db.getFirstSync<{ title: string }>(
      `SELECT title FROM categories WHERE id = ?`,
      [categoryId],
    );
    const rows = db.getAllSync<{ str_translations: string }>(
      `
      SELECT 
        GROUP_CONCAT(st.lang || '||' || st.text, '@@') as str_translations
      FROM sentences s
      JOIN sentence_translations st ON s.id = st.sentence_id
      WHERE s.category_id = ?
      GROUP BY s.id
      ORDER BY s.number ASC;
      `,
      [categoryId],
    );
    const sentences = rows.map((row) => {
      const translations: Record<string, string[]> = {};
      row.str_translations.split("@@").forEach((t) => {
        const [lang, text] = t.split("||");
        if (!translations[lang]) {
          translations[lang] = [];
        }
        translations[lang].push(text);
      });
      return translations;
    });
    const jsonData = {
      title: categoryRow?.title ?? "Untitled",
      sentences,
    };
    await saveAndShareJson(jsonData, fileName);
  },
  importCategory: () => {},
};
