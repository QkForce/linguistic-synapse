CREATE TABLE
  IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    number INTEGER,
    next_review DATE DEFAULT (date ('now')),
    interval INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    reps INTEGER DEFAULT 0,
    lapses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
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
    -- UNIQUE (sentence_id, lang),
    FOREIGN KEY (lang) REFERENCES languages (code),
    FOREIGN KEY (sentence_id) REFERENCES sentences (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS session_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
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
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

CREATE TABLE
  IF NOT EXISTS sentence_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_log_id INTEGER,
    sentence_id INTEGER,
    native_text TEXT,
    target_text TEXT,
    response_text TEXT,
    accuracy REAL,
    confidence REAL,
    response_time_ms INTEGER,
    ideal_time_ms INTEGER,
    FOREIGN KEY (session_log_id) REFERENCES session_logs (id) ON DELETE CASCADE,
    FOREIGN KEY (sentence_id) REFERENCES sentences (id)
  );

CREATE INDEX IF NOT EXISTS idx_sentences_category ON sentences (category_id);

CREATE INDEX IF NOT EXISTS idx_sentences_srs_queue ON sentences (next_review, reps, ease_factor);

CREATE INDEX IF NOT EXISTS idx_translations_sentence ON sentence_translations (sentence_id);

CREATE INDEX IF NOT EXISTS idx_translations_lang ON sentence_translations (lang);

CREATE INDEX IF NOT EXISTS idx_session_logs_created_at ON session_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_sentence_logs_session_log ON sentence_logs (session_log_id);