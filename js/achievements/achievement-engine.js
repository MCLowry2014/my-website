function createDefaultAchievementState(userId = "guest") {
  return {
    version: 1,
    profile: {
      userId,
      totalAP: 0,
      unlockedCount: 0
    },
    unlocked: {},
    stats: {
      education: {
        topicsCompleted: 0,
        uniqueTopics: [],
        topicCompletionDay: {},
        subjectTopicCounts: {},
        uniqueLearningDays: 0,
        learningDays: [],
        quizScores80OrHigher: 0,
        quizPerfectCount: 0,
        currentQuiz80Streak: 0,
        bestQuiz80Streak: 0,
        topicBestScores: {},
        allTopicsCompletedDay: null
      },
      games: {
        memoryWins: 0,
        currentMemoryWinStreak: 0,
        bestMemoryWinStreak: 0,
        max2048Tile: 0,
        max2048ReachedDays: [],
        playedGames: []
      },
      watchlist: {
        addedCount: 0,
        importCount: 0,
        maxImportSize: 0,
        editedCount: 0,
        exportCount: 0,
        maxTotalEntries: 0
      },
      platform: {
        profileCompleted: false,
        bestLoginStreak: 0,
        eventsProcessed: 0
      }
    }
  };
}

function safeClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureArrayUniquePush(arr, value) {
  if (!arr.includes(value)) {
    arr.push(value);
  }
}

function toUtcDay(value) {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().slice(0, 10);
}

function getNestedStat(state, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), state.stats);
}

function buildInitialState(inputState, userId = "guest") {
  const base = createDefaultAchievementState(userId);
  if (!inputState || typeof inputState !== "object") return base;

  const merged = {
    ...base,
    ...inputState,
    profile: {
      ...base.profile,
      ...(inputState.profile || {})
    },
    unlocked: {
      ...(inputState.unlocked || {})
    },
    stats: {
      ...base.stats,
      ...(inputState.stats || {}),
      education: {
        ...base.stats.education,
        ...((inputState.stats && inputState.stats.education) || {})
      },
      games: {
        ...base.stats.games,
        ...((inputState.stats && inputState.stats.games) || {})
      },
      watchlist: {
        ...base.stats.watchlist,
        ...((inputState.stats && inputState.stats.watchlist) || {})
      },
      platform: {
        ...base.stats.platform,
        ...((inputState.stats && inputState.stats.platform) || {})
      }
    }
  };

  merged.stats.education.uniqueTopics = Array.isArray(merged.stats.education.uniqueTopics)
    ? merged.stats.education.uniqueTopics
    : [];
  merged.stats.education.learningDays = Array.isArray(merged.stats.education.learningDays)
    ? merged.stats.education.learningDays
    : [];
  merged.stats.games.playedGames = Array.isArray(merged.stats.games.playedGames)
    ? merged.stats.games.playedGames
    : [];
  merged.stats.games.max2048ReachedDays = Array.isArray(merged.stats.games.max2048ReachedDays)
    ? merged.stats.games.max2048ReachedDays
    : [];

  merged.stats.education.uniqueLearningDays = merged.stats.education.learningDays.length;
  merged.profile.totalAP = Number(merged.profile.totalAP) || 0;
  merged.profile.unlockedCount = Object.keys(merged.unlocked).length;

  return merged;
}

function applyEventToStats(state, event, catalog) {
  const evt = event || {};
  const type = evt.type || "UNKNOWN";
  const day = toUtcDay(evt.occurredAt);

  state.stats.platform.eventsProcessed += 1;

  if (type === "EDUCATION_TOPIC_COMPLETED") {
    const subject = String(evt.subject || "").toLowerCase();
    const topic = String(evt.topic || "").toLowerCase();
    if (subject && topic) {
      const topicKey = `${subject}/${topic}`;
      ensureArrayUniquePush(state.stats.education.uniqueTopics, topicKey);
      state.stats.education.topicsCompleted = state.stats.education.uniqueTopics.length;
      state.stats.education.topicCompletionDay[topicKey] = day;
      ensureArrayUniquePush(state.stats.education.learningDays, day);
      state.stats.education.uniqueLearningDays = state.stats.education.learningDays.length;

      const grouped = {};
      state.stats.education.uniqueTopics.forEach((key) => {
        const sub = key.split("/")[0];
        grouped[sub] = (grouped[sub] || 0) + 1;
      });
      state.stats.education.subjectTopicCounts = grouped;

      if (
        !state.stats.education.allTopicsCompletedDay &&
        state.stats.education.topicsCompleted >= Number(catalog.targets?.totalTopics || 0)
      ) {
        state.stats.education.allTopicsCompletedDay = day;
      }
    }
    return;
  }

  if (type === "EDUCATION_QUIZ_SUBMITTED") {
    const subject = String(evt.subject || "").toLowerCase();
    const topic = String(evt.topic || "").toLowerCase();
    const topicKey = subject && topic ? `${subject}/${topic}` : "";
    const score = Math.max(0, Math.min(100, Number(evt.scorePercent) || 0));

    if (score >= 80) {
      state.stats.education.quizScores80OrHigher += 1;
      state.stats.education.currentQuiz80Streak += 1;
      state.stats.education.bestQuiz80Streak = Math.max(
        state.stats.education.bestQuiz80Streak,
        state.stats.education.currentQuiz80Streak
      );
    } else {
      state.stats.education.currentQuiz80Streak = 0;
    }

    if (score === 100) {
      state.stats.education.quizPerfectCount += 1;
    }

    if (topicKey) {
      const currentBest = Number(state.stats.education.topicBestScores[topicKey] || 0);
      state.stats.education.topicBestScores[topicKey] = Math.max(currentBest, score);
    }
    return;
  }

  if (type === "GAME_MEMORY_WON") {
    state.stats.games.memoryWins += 1;
    state.stats.games.currentMemoryWinStreak += 1;
    state.stats.games.bestMemoryWinStreak = Math.max(
      state.stats.games.bestMemoryWinStreak,
      state.stats.games.currentMemoryWinStreak
    );
    ensureArrayUniquePush(state.stats.games.playedGames, "memory");
    return;
  }

  if (type === "GAME_MEMORY_LOST") {
    state.stats.games.currentMemoryWinStreak = 0;
    ensureArrayUniquePush(state.stats.games.playedGames, "memory");
    return;
  }

  if (type === "GAME_2048_FINISHED") {
    const tile = Number(evt.maxTile) || 0;
    state.stats.games.max2048Tile = Math.max(state.stats.games.max2048Tile, tile);
    if (tile >= 2048) {
      ensureArrayUniquePush(state.stats.games.max2048ReachedDays, day);
    }
    ensureArrayUniquePush(state.stats.games.playedGames, "2048");
    return;
  }

  if (type === "GAME_PLAYED") {
    const gameId = String(evt.gameId || "").trim().toLowerCase();
    if (gameId) ensureArrayUniquePush(state.stats.games.playedGames, gameId);
    return;
  }

  if (type === "WATCHLIST_ITEM_ADDED") {
    state.stats.watchlist.addedCount += 1;
    const totalEntries = Number(evt.totalEntries) || 0;
    state.stats.watchlist.maxTotalEntries = Math.max(state.stats.watchlist.maxTotalEntries, totalEntries);
    return;
  }

  if (type === "WATCHLIST_IMPORT_COMPLETED") {
    state.stats.watchlist.importCount += 1;
    const inserted = Number(evt.insertedCount) || 0;
    state.stats.watchlist.maxImportSize = Math.max(state.stats.watchlist.maxImportSize, inserted);
    const totalEntries = Number(evt.totalEntries) || 0;
    state.stats.watchlist.maxTotalEntries = Math.max(state.stats.watchlist.maxTotalEntries, totalEntries);
    return;
  }

  if (type === "WATCHLIST_ITEM_EDITED") {
    state.stats.watchlist.editedCount += 1;
    return;
  }

  if (type === "WATCHLIST_EXPORTED") {
    state.stats.watchlist.exportCount += 1;
    return;
  }

  if (type === "PROFILE_COMPLETED") {
    state.stats.platform.profileCompleted = true;
    return;
  }

  if (type === "LOGIN") {
    const streak = Number(evt.currentStreak) || 0;
    state.stats.platform.bestLoginStreak = Math.max(state.stats.platform.bestLoginStreak, streak);
  }
}

function checkRule(achievement, state, catalog) {
  const rule = achievement.criteria?.rule;

  if (rule === "stat_at_least") {
    const current = Number(getNestedStat(state, achievement.criteria.stat) || 0);
    return current >= Number(achievement.criteria.value || 0);
  }

  if (rule === "stat_equals") {
    const current = getNestedStat(state, achievement.criteria.stat);
    return current === achievement.criteria.value;
  }

  if (rule === "subject_topics_completed") {
    const subject = achievement.criteria.subject;
    const required = Number(catalog.targets?.topicsPerSubject?.[subject] || 0);
    const current = Number(state.stats.education.subjectTopicCounts?.[subject] || 0);
    return current >= required && required > 0;
  }

  if (rule === "all_topics_completed") {
    return Number(state.stats.education.topicsCompleted) >= Number(catalog.targets?.totalTopics || 0);
  }

  if (rule === "all_games_played") {
    const required = catalog.targets?.requiredGames || [];
    return required.every((gameId) => state.stats.games.playedGames.includes(gameId));
  }

  if (rule === "ap_at_least") {
    return Number(state.profile.totalAP) >= Number(achievement.criteria.value || 0);
  }

  if (rule === "unlocked_count_at_least") {
    return Number(state.profile.unlockedCount) >= Number(achievement.criteria.value || 0);
  }

  if (rule === "mythic_perfect_all_topics") {
    const totalTopics = Number(catalog.targets?.totalTopics || 0);
    if (state.stats.education.topicsCompleted < totalTopics) return false;

    return state.stats.education.uniqueTopics.every((topicKey) => {
      const best = Number(state.stats.education.topicBestScores?.[topicKey] || 0);
      return best >= 100;
    });
  }

  if (rule === "mythic_all_topics_and_2048_same_day") {
    const completedDay = state.stats.education.allTopicsCompletedDay;
    if (!completedDay) return false;
    return state.stats.games.max2048ReachedDays.includes(completedDay);
  }

  return false;
}

function evaluateAchievements(event, currentState, catalog) {
  const safeCatalog = catalog || { achievements: [], targets: {} };
  const state = buildInitialState(safeClone(currentState || {}));

  applyEventToStats(state, event, safeCatalog);

  const unlocks = [];
  let changed = true;

  while (changed) {
    changed = false;

    for (const achievement of safeCatalog.achievements || []) {
      if (!achievement || !achievement.id) continue;
      if (state.unlocked[achievement.id]) continue;

      const shouldUnlock = checkRule(achievement, state, safeCatalog);
      if (!shouldUnlock) continue;

      const points = Math.max(0, Number(achievement.points) || 0);
      const unlockedAt = (event && event.occurredAt) || new Date().toISOString();

      state.unlocked[achievement.id] = {
        pointsAwarded: points,
        unlockedAt,
        sourceEventType: event?.type || "UNKNOWN"
      };

      state.profile.totalAP += points;
      state.profile.unlockedCount += 1;

      unlocks.push({
        id: achievement.id,
        name: achievement.name,
        difficulty: achievement.difficulty,
        pointsAwarded: points,
        unlockedAt
      });

      changed = true;
    }
  }

  return {
    state,
    unlocks,
    apDelta: unlocks.reduce((sum, item) => sum + item.pointsAwarded, 0),
    totalAP: state.profile.totalAP
  };
}

async function loadAchievementCatalog(url = "js/achievements/achievement-catalog.json") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load achievement catalog.");
  }
  return response.json();
}

window.AchievementEngine = {
  createDefaultAchievementState,
  evaluateAchievements,
  loadAchievementCatalog
};
