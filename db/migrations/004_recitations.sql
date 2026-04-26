CREATE TABLE recitations (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  reciter     TEXT,
  audio_url   TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  license_note TEXT
);

CREATE TABLE recitation_timings (
  recitation_id INTEGER NOT NULL REFERENCES recitations(id) ON DELETE CASCADE,
  name_id       SMALLINT NOT NULL REFERENCES names(id),
  start_ms      INTEGER NOT NULL,
  end_ms        INTEGER NOT NULL,
  PRIMARY KEY (recitation_id, name_id)
);