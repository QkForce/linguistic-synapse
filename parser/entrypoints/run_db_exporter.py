import json
import utils.db as db
import config.config as config
from utils.exporters import transform_to_category_json


if __name__ == "__main__":
    with db.db_connection() as conn:
        rows = db.get_export_data(conn)
        json_data = transform_to_category_json(
            rows, "en", category_title=config.EXPORT_CATEGORY_TITLE
        )
    with open(config.EXPORT_CATEGORY_PATH, "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)
