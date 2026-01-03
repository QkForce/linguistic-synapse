import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";

// Тұрақты файл аты. Бағдарлама тек осы файлмен жұмыс істейді.
const DB_NAME = "synapse.db";
const SQLITE_DIR_PATH = `${Paths.document.uri}/SQLite`;

/**
 * SQLite папкасының бар-жоғын тексереді, жоқ болса құрады.
 */
async function ensureSQLiteDirectory() {
  const dir = new Directory(SQLITE_DIR_PATH);
  const dirInfo = dir.info();
  if (!dirInfo.exists) {
    dir.create();
    console.log("📁 SQLite папкасы құрылды");
  }
}

/**
 * Сыртқы SQLite файлын таңдап, оны 'synapse.db' ретінде ішкі жадқа көшіреді.
 */
export async function importSQLiteFile(): Promise<boolean> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      // Тек .db немесе .sqlite файлдарын таңдауға шектеу қоюға болады
      type: ["application/x-sqlite3", "application/octet-stream", "*/*"],
      copyToCacheDirectory: true, // Бастапқы оқу үшін кэш қажет
    });

    if (result.canceled || !result.assets.length) {
      console.log("🚫 Файл таңдаудан бас тартылды");
      return false;
    }

    const pickedFile = result.assets[0];
    await ensureSQLiteDirectory();

    // 1. Таңдалған файлды оқу
    const sourceFile = new File(pickedFile.uri);
    const fileData = await sourceFile.bytes(); // Uint8Array түрінде оқу

    // 2. Нысана файлды (synapse.db) анықтау
    // Егер бұрын бұл файл болса, ол жай ғана жаңа деректермен алмастырылады (overwrite)
    const destinationFile = new File(SQLITE_DIR_PATH, DB_NAME);

    // 3. Деректерді жазу
    // write() функциясы файл болса үстінен жазады, болмаса жаңасын құрады
    destinationFile.write(fileData);

    console.log("✅ Деректер қоры сәтті жаңартылды:", destinationFile.uri);

    // Кэштегі уақытша файлды тазалау (опционалды)
    sourceFile.delete();

    return true;
  } catch (error) {
    console.error("❌ Деректер қорын импорттау қатесі:", error);
    return false;
  }
}
