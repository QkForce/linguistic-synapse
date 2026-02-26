import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export const saveAndShareJson = async (
  data: unknown,
  fileName: string = "synapse-category.json",
) => {
  try {
    // JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Where do we save it (documents folder)
    const dir = new Directory(Paths.document);
    const file = new File(dir, fileName);

    // If the file exists — overwrite
    if (file.exists) {
      file.delete();
    }

    // Write JSON to file
    file.write(jsonString);

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    } else {
      console.warn("Sharing is not available on this device");
    }

    return file.uri;
  } catch (error) {
    console.error("Error saving/sharing JSON:", error);
    throw error;
  }
};
