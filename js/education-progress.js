const EDU_PROGRESS_KEY = "eduProgressV1";
const EDU_PROGRESS_USER = "guest";
const EDU_API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? ""
    : "https://my-website-1owa.onrender.com";

function getProgressFallback() {
  return {
    version: 1,
    user: EDU_PROGRESS_USER,
    completed: {},
    quizScores: {}
  };
}

function normalizeProgress(input) {
  const fallback = getProgressFallback();

  if (!input || typeof input !== "object") return fallback;

  const output = {
    version: Number(input.version) || 1,
    user: typeof input.user === "string" && input.user.trim() ? input.user.trim() : EDU_PROGRESS_USER,
    completed: {},
    quizScores: {}
  };

  if (input.completed && typeof input.completed === "object") {
    Object.keys(input.completed).forEach((key) => {
      if (typeof input.completed[key] === "string") {
        output.completed[key] = input.completed[key];
      }
    });
  }

  if (input.quizScores && typeof input.quizScores === "object") {
    Object.keys(input.quizScores).forEach((key) => {
      const score = input.quizScores[key] || {};
      output.quizScores[key] = {
        best: Number.isFinite(Number(score.best)) ? Number(score.best) : 0,
        last: Number.isFinite(Number(score.last)) ? Number(score.last) : 0,
        updatedAt:
          typeof score.updatedAt === "string" && score.updatedAt.trim().length > 0
            ? score.updatedAt
            : new Date().toISOString()
      };
    });
  }

  return output;
}

function readLocalProgress() {
  try {
    const raw = localStorage.getItem(EDU_PROGRESS_KEY);
    if (!raw) return getProgressFallback();
    return normalizeProgress(JSON.parse(raw));
  } catch (_error) {
    return getProgressFallback();
  }
}

function writeLocalProgress(progress) {
  const normalized = normalizeProgress(progress);
  localStorage.setItem(EDU_PROGRESS_KEY, JSON.stringify(normalized));
  return normalized;
}

async function loadRemoteProgress() {
  const response = await fetch(
    `${EDU_API_BASE}/api/education/progress?userId=${encodeURIComponent(EDU_PROGRESS_USER)}`
  );

  if (!response.ok) {
    throw new Error("Could not load remote education progress.");
  }

  const payload = await response.json();
  return normalizeProgress(payload);
}

async function saveRemoteProgress(progress) {
  const response = await fetch(`${EDU_API_BASE}/api/education/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: EDU_PROGRESS_USER, progress })
  });

  if (!response.ok) {
    throw new Error("Could not save remote education progress.");
  }

  return response.json();
}

function getTopicKey(subject, topic) {
  return `${subject}/${topic}`;
}

const EducationProgressStore = {
  getTopicKey,

  async load() {
    const local = readLocalProgress();

    try {
      const remote = await loadRemoteProgress();
      writeLocalProgress(remote);
      return remote;
    } catch (_error) {
      return local;
    }
  },

  async save(progress) {
    const normalized = writeLocalProgress(progress);

    try {
      await saveRemoteProgress(normalized);
      return { ok: true, remote: true, progress: normalized };
    } catch (_error) {
      return { ok: true, remote: false, progress: normalized };
    }
  },

  readLocal() {
    return readLocalProgress();
  }
};

window.EducationProgressStore = EducationProgressStore;
