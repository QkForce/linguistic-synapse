CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    title TEXT,
    number INTEGER,
    processed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    number INTEGER,
    next_review DATE DEFAULT (date('now')),
    interval INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    reps INTEGER DEFAULT 0,
    lapses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE IF NOT EXISTS sentence_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sentence_id INTEGER NOT NULL,
    lang TEXT NOT NULL,              -- 'ru', 'en', 'kk', 'ar', etc.
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sentence_id, lang),
    FOREIGN KEY (sentence_id) REFERENCES sentences(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lesson_tags (
    lesson_id TEXT NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (lesson_id, tag_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    accuracy REAL,
    confidence REAL,
    time_efficiency REAL,
    final_score REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE IF NOT EXISTS sentence_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_log_id INTEGER,
    sentence_id INTEGER,
    correct BOOLEAN,
    response_time REAL,
    confidence REAL,
    FOREIGN KEY (lesson_log_id) REFERENCES lesson_logs(id),
    FOREIGN KEY (sentence_id) REFERENCES sentences(id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_lesson_tags_lesson ON lesson_tags(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_tags_tag ON lesson_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_sentences_next_review ON sentences(next_review);
CREATE INDEX IF NOT EXISTS idx_sentences_lesson ON sentences(lesson_id);
CREATE INDEX IF NOT EXISTS idx_translations_sentence ON sentence_translations(sentence_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON sentence_translations(lang);