import { readJsonFile, saveAndShareJson } from "@/utils/fileUtils";
import { db } from "./db";

interface DataTransferCategory {
  title: string;
  sentences: Record<string, string[]>[];
}

export const dataTransferService = {
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
  importCategory: async (fileUri: string) => {
    const data: DataTransferCategory = await readJsonFile(fileUri);
    if (!data.title || !Array.isArray(data.sentences)) {
      throw new Error("Файл құрылымы қате!");
    }
    try {
      const categoryResult = db.runSync(
        `INSERT INTO categories (title) VALUES (?)`,
        [data.title.trim() + " (imported)"],
      );
      const categoryId = categoryResult.lastInsertRowId;

      let orderNumber = 0;
      for (const sentence of data.sentences) {
        orderNumber++;
        const sentenceResult = db.runSync(
          `INSERT INTO sentences (category_id, number) VALUES (?, ?)`,
          [categoryId, orderNumber],
        );
        const sentenceId = sentenceResult.lastInsertRowId;
        Object.entries(sentence).forEach(([lang, texts]) => {
          if (Array.isArray(texts)) {
            texts.forEach((text) => {
              db.runSync(
                `INSERT INTO sentence_translations (sentence_id, lang, text) VALUES (?, ?, ?)`,
                [sentenceId, lang, text],
              );
            });
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Database Import Error:", error);
      throw error;
    }
  },
};
