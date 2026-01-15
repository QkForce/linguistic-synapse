CREATE TABLE
  IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    source_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES sources (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    module_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    number INTEGER,
    next_review DATE DEFAULT (date ('now')),
    interval INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    reps INTEGER DEFAULT 0,
    lapses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS sentence_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sentence_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sentence_id, lang),
    FOREIGN KEY (lang) REFERENCES languages (code),
    FOREIGN KEY (sentence_id) REFERENCES sentences (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS lesson_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    native_lang TEXT,
    target_lang TEXT,
    total_time_ms INTEGER,
    ideal_time_ms INTEGER,
    accuracy REAL,
    confidence REAL,
    time_efficiency REAL,
    time_overuse_ms REAL,
    final_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons (id)
  );

CREATE TABLE
  IF NOT EXISTS sentence_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_log_id INTEGER,
    sentence_id INTEGER,
    native_text TEXT,
    target_text TEXT,
    response_text TEXT,
    accuracy REAL,
    confidence REAL,
    response_time_ms INTEGER,
    ideal_time_ms INTEGER,
    FOREIGN KEY (lesson_log_id) REFERENCES lesson_logs (id),
    FOREIGN KEY (sentence_id) REFERENCES sentences (id)
  );

CREATE INDEX IF NOT EXISTS idx_modules_source ON modules (source_id);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons (module_id);

CREATE INDEX IF NOT EXISTS idx_sentences_lesson ON sentences (lesson_id);

CREATE INDEX IF NOT EXISTS idx_sentences_srs_queue ON sentences (next_review, reps, ease_factor);

CREATE INDEX IF NOT EXISTS idx_translations_sentence ON sentence_translations (sentence_id);

CREATE INDEX IF NOT EXISTS idx_translations_lang ON sentence_translations (lang);

CREATE INDEX IF NOT EXISTS idx_lesson_logs_created_at ON lesson_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_sentence_logs_lesson_log ON sentence_logs (lesson_log_id);