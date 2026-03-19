const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "watchlist.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS watchlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      year INTEGER,
      status TEXT DEFAULT 'Watched',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_watchlist_item
    ON watchlist_items (LOWER(title), LOWER(type), IFNULL(year, -1))
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS education_progress (
      user_id TEXT NOT NULL,
      topic_key TEXT NOT NULL,
      completed_at TEXT,
      best_score INTEGER,
      last_score INTEGER,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, topic_key)
    )
  `);
});

function normalizeUserId(value) {
  if (typeof value !== "string") return "guest";
  const trimmed = value.trim();
  return trimmed || "guest";
}

function normalizeScore(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

app.use(express.json());
app.use((req, res, next) => {
  const allowed = ["http://localhost:3000", "https://mclowry.com", "https://www.mclowry.com"];
  const origin = req.headers.origin;
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.static(__dirname));

app.get("/api/watchlist", (req, res) => {
  db.all(
    `SELECT id, title, type, year, status, created_at
     FROM watchlist_items
     ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to load watchlist." });
      }
      return res.json(rows);
    }
  );
});

app.post("/api/watchlist", (req, res) => {
  const { title, type, year, status } = req.body || {};

  if (!title || !type) {
    return res.status(400).json({ error: "Title and type are required." });
  }

  const yearValue = year === "" || year === undefined || year === null ? null : Number(year);
  if (yearValue !== null && Number.isNaN(yearValue)) {
    return res.status(400).json({ error: "Year must be a number." });
  }

  db.run(
    `INSERT OR IGNORE INTO watchlist_items (title, type, year, status)
     VALUES (?, ?, ?, ?)`,
    [title.trim(), type.trim(), yearValue, (status || "Watched").trim()],
    function onInsert(err) {
      if (err) {
        return res.status(500).json({ error: "Failed to save watchlist item." });
      }

      if (this.changes === 0) {
        return res.status(409).json({ error: "Duplicate item already exists." });
      }

      db.get(
        `SELECT id, title, type, year, status, created_at
         FROM watchlist_items
         WHERE id = ?`,
        [this.lastID],
        (getErr, row) => {
          if (getErr) {
            return res.status(500).json({ error: "Saved item but failed to read it back." });
          }
          return res.status(201).json(row);
        }
      );
    }
  );
});

app.post("/api/watchlist/import", (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Body must include an items array." });
  }

  if (items.length === 0) {
    return res.json({ processed: 0, inserted: 0, duplicates: 0, invalid: 0 });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const insertStmt = db.prepare(
      `INSERT OR IGNORE INTO watchlist_items (title, type, year, status)
       VALUES (?, ?, ?, ?)`
    );

    let inserted = 0;
    let duplicates = 0;
    let invalid = 0;
    let hadError = false;
    let index = 0;

    function finish() {
      insertStmt.finalize((finalizeErr) => {
        if (finalizeErr && !hadError) {
          hadError = true;
          db.run("ROLLBACK", () => {
            res.status(500).json({ error: "Failed to finalize import." });
          });
          return;
        }

        if (hadError) return;

        db.run("COMMIT", (commitErr) => {
          if (commitErr) {
            return res.status(500).json({ error: "Failed to commit import." });
          }
          return res.json({
            processed: items.length,
            inserted,
            duplicates,
            invalid
          });
        });
      });
    }

    function processNext() {
      if (index >= items.length) {
        finish();
        return;
      }

      const item = items[index] || {};
      index += 1;

      const title = typeof item.title === "string" ? item.title.trim() : "";
      const type = typeof item.type === "string" ? item.type.trim() : "";
      const status =
        typeof item.status === "string" && item.status.trim().length > 0
          ? item.status.trim()
          : "Watched";
      const rawYear = item.year;

      const year =
        rawYear === "" || rawYear === null || rawYear === undefined
          ? null
          : Number(rawYear);

      if (!title || !type || (year !== null && Number.isNaN(year))) {
        invalid += 1;
        processNext();
        return;
      }

      insertStmt.run([title, type, year, status], function onRun(runErr) {
        if (runErr) {
          if (!hadError) {
            hadError = true;
            db.run("ROLLBACK", () => {
              res.status(500).json({ error: "Failed during import." });
            });
          }
          return;
        }

        if (this.changes === 1) {
          inserted += 1;
        } else {
          duplicates += 1;
        }
        processNext();
      });
    }

    processNext();
  });
});

app.put("/api/watchlist/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, type, year, status } = req.body || {};

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid item id." });
  }

  if (!title || !type) {
    return res.status(400).json({ error: "Title and type are required." });
  }

  const yearValue = year === "" || year === undefined || year === null ? null : Number(year);
  if (yearValue !== null && Number.isNaN(yearValue)) {
    return res.status(400).json({ error: "Year must be a number." });
  }

  db.run(
    `UPDATE watchlist_items
     SET title = ?, type = ?, year = ?, status = ?
     WHERE id = ?`,
    [title.trim(), type.trim(), yearValue, (status || "Watched").trim(), id],
    function onUpdate(err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(409).json({ error: "Another matching item already exists." });
        }
        return res.status(500).json({ error: "Failed to update watchlist item." });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Item not found." });
      }

      db.get(
        `SELECT id, title, type, year, status, created_at
         FROM watchlist_items
         WHERE id = ?`,
        [id],
        (getErr, row) => {
          if (getErr) {
            return res.status(500).json({ error: "Updated item but failed to read it back." });
          }
          return res.json(row);
        }
      );
    }
  );
});

app.delete("/api/watchlist/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid item id." });
  }

  db.run("DELETE FROM watchlist_items WHERE id = ?", [id], function onDelete(err) {
    if (err) {
      return res.status(500).json({ error: "Failed to delete watchlist item." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
    return res.status(204).send();
  });
});

app.get("/api/education/progress", (req, res) => {
  const userId = normalizeUserId(req.query.userId);

  db.all(
    `SELECT topic_key, completed_at, best_score, last_score, updated_at
     FROM education_progress
     WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to load education progress." });
      }

      const completed = {};
      const quizScores = {};

      rows.forEach((row) => {
        if (row.completed_at) {
          completed[row.topic_key] = row.completed_at;
        }

        if (row.best_score !== null || row.last_score !== null) {
          quizScores[row.topic_key] = {
            best: normalizeScore(row.best_score),
            last: normalizeScore(row.last_score),
            updatedAt: row.updated_at || null
          };
        }
      });

      return res.json({
        version: 1,
        user: userId,
        completed,
        quizScores
      });
    }
  );
});

app.post("/api/education/progress", (req, res) => {
  const userId = normalizeUserId(req.body?.userId || req.query.userId);
  const progress = req.body?.progress;

  if (!progress || typeof progress !== "object") {
    return res.status(400).json({ error: "Body must include a progress object." });
  }

  const completed = progress.completed && typeof progress.completed === "object" ? progress.completed : {};
  const quizScores = progress.quizScores && typeof progress.quizScores === "object" ? progress.quizScores : {};

  const topicKeys = new Set([...Object.keys(completed), ...Object.keys(quizScores)]);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run("DELETE FROM education_progress WHERE user_id = ?", [userId], (deleteErr) => {
      if (deleteErr) {
        return db.run("ROLLBACK", () => {
          res.status(500).json({ error: "Failed to save education progress." });
        });
      }

      if (topicKeys.size === 0) {
        return db.run("COMMIT", (commitErr) => {
          if (commitErr) {
            return res.status(500).json({ error: "Failed to save education progress." });
          }
          return res.json({ ok: true, user: userId, saved: 0 });
        });
      }

      const stmt = db.prepare(
        `INSERT INTO education_progress (user_id, topic_key, completed_at, best_score, last_score, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      let index = 0;
      const keys = Array.from(topicKeys);
      let hadError = false;

      function finalizeAndCommit() {
        stmt.finalize((finalizeErr) => {
          if (finalizeErr && !hadError) {
            hadError = true;
            return db.run("ROLLBACK", () => {
              res.status(500).json({ error: "Failed to save education progress." });
            });
          }

          if (hadError) return;

          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              return res.status(500).json({ error: "Failed to save education progress." });
            }
            return res.json({ ok: true, user: userId, saved: keys.length });
          });
        });
      }

      function insertNext() {
        if (index >= keys.length) {
          finalizeAndCommit();
          return;
        }

        const topicKey = keys[index];
        index += 1;

        const quiz = quizScores[topicKey] || {};
        const completedAt = typeof completed[topicKey] === "string" ? completed[topicKey] : null;
        const bestScore = normalizeScore(quiz.best || 0);
        const lastScore = normalizeScore(quiz.last || 0);
        const updatedAt =
          typeof quiz.updatedAt === "string" && quiz.updatedAt.trim().length > 0
            ? quiz.updatedAt
            : new Date().toISOString();

        stmt.run(
          [userId, topicKey, completedAt, bestScore, lastScore, updatedAt],
          (insertErr) => {
            if (insertErr) {
              if (!hadError) {
                hadError = true;
                db.run("ROLLBACK", () => {
                  res.status(500).json({ error: "Failed to save education progress." });
                });
              }
              return;
            }

            insertNext();
          }
        );
      }

      insertNext();
    });
  });
});

app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
