import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("synapse.db");

export const checkDbConnection = () => {
  try {
    const result = db.getFirstSync(
      'SELECT name FROM sqlite_master WHERE type="table"'
    );
    return !!result;
  } catch (e) {
    return false;
  }
};
