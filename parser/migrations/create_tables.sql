CREATE TABLE
    IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        title TEXT,
        number INTEGER,
        duration INTEGER,
        parse_start DATETIME,
        parse_end DATETIME,
        correct_start DATETIME,
        correct_end DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS sentences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id TEXT NOT NULL,
        number INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id)
    );

CREATE TABLE
    IF NOT EXISTS sentence_translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sentence_id INTEGER NOT NULL,
        lang TEXT NOT NULL, -- 'ru', 'en', 'kk', 'ar', etc.
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (sentence_id, lang),
        FOREIGN KEY (sentence_id) REFERENCES sentences (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS lesson_tags (
        lesson_id TEXT NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (lesson_id, tag_id),
        FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    );

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_lesson_tags_lesson ON lesson_tags (lesson_id);

CREATE INDEX IF NOT EXISTS idx_lesson_tags_tag ON lesson_tags (tag_id);

CREATE INDEX IF NOT EXISTS idx_sentences_lesson ON sentences (lesson_id);

CREATE INDEX IF NOT EXISTS idx_translations_sentence ON sentence_translations (sentence_id);

CREATE INDEX IF NOT EXISTS idx_translations_lang ON sentence_translations (lang);