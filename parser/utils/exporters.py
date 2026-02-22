def group_by_sentence_id(rows):
    result = {}
    for row in rows:
        sentence_id = row[2]
        lang = row[3]
        text = row[4]
        if sentence_id not in result:
            result[sentence_id] = {}
        result[sentence_id][lang] = text
    return result


def union_by_text(rows, target_lang):
    sentence_groups = group_by_sentence_id(rows)
    result = {}
    for text_lang_dict in sentence_groups.values():
        target_lang_text = text_lang_dict[target_lang]
        if target_lang_text not in result:
            result[target_lang_text] = {}
        for lang, text in text_lang_dict.items():
            if lang not in result[target_lang_text]:
                result[target_lang_text][lang] = set()
            text = text.replace(".", "")
            text = text.strip()
            result[target_lang_text][lang].add(text)
    return list(result.values())


def transform_to_category_json(
    rows, target_lang="en", category_title="default_category"
):
    export_data = {}
    sentences = []
    grouped_list = union_by_text(rows, target_lang=target_lang)
    for lang_text_dict in grouped_list:
        sentence_dict = {}
        for lang, text_set in lang_text_dict.items():
            sentence_dict[lang] = ";".join(text_set)
        sentences.append(sentence_dict)
    if len(grouped_list) > 0:
        export_data["title"] = category_title
        export_data["sentences"] = sentences
    return export_data
