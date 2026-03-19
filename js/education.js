const EDU_TOPICS_TOTAL = 15;
const progressStore = window.EducationProgressStore;

function getTopicKey(subject, topic) {
  return progressStore ? progressStore.getTopicKey(subject, topic) : `${subject}/${topic}`;
}

function updateProgressView(progress) {
  const summary = document.getElementById("education-progress-summary");
  if (!summary) return;

  const completedCount = Object.keys(progress.completed).length;
  const masteredCount = Object.values(progress.quizScores).filter((score) => Number(score?.best) >= 80).length;

  summary.textContent = `Progress: ${completedCount}/${EDU_TOPICS_TOTAL} completed topics, ${masteredCount} quiz mastery badges (80%+).`;
}

function decorateTopicLinks(progress) {
  const links = document.querySelectorAll(".topic-link");

  links.forEach((link) => {
    const subject = link.getAttribute("data-subject") || "";
    const topic = link.getAttribute("data-topic") || "";
    const key = getTopicKey(subject, topic);

    const completed = Boolean(progress.completed[key]);
    const best = Number(progress.quizScores[key]?.best || 0);

    link.classList.toggle("topic-link-complete", completed);

    const existingBadge = link.parentElement?.querySelector(".topic-status");
    if (existingBadge) {
      existingBadge.remove();
    }

    const badge = document.createElement("span");
    badge.className = "topic-status";

    if (completed && best >= 80) {
      badge.textContent = `Done, Quiz ${best}%`;
      badge.classList.add("topic-status-mastered");
    } else if (completed) {
      badge.textContent = "Done";
      badge.classList.add("topic-status-done");
    } else if (best > 0) {
      badge.textContent = `Quiz ${best}%`;
      badge.classList.add("topic-status-started");
    } else {
      badge.textContent = "Not started";
      badge.classList.add("topic-status-empty");
    }

    link.parentElement?.appendChild(badge);
  });
}

function applyEducationFilters() {
  const searchInput = document.getElementById("education-search");
  const filterSelect = document.getElementById("education-filter-subject");
  const cards = document.querySelectorAll(".education-subject");
  const emptyState = document.getElementById("education-no-results");

  if (!cards.length) return;

  const search = (searchInput?.value || "").trim().toLowerCase();
  const filter = filterSelect?.value || "all";

  let visibleCount = 0;

  cards.forEach((card) => {
    const subject = card.getAttribute("data-subject") || "";
    const topicLinks = card.querySelectorAll(".topic-link");
    let anyTopicVisible = false;

    topicLinks.forEach((link) => {
      const text = link.textContent?.toLowerCase() || "";
      const matchesSearch = !search || text.includes(search);
      const parentLi = link.closest("li");
      if (parentLi) {
        parentLi.hidden = !matchesSearch;
      }
      if (matchesSearch) {
        anyTopicVisible = true;
      }
    });

    const cardText = card.textContent?.toLowerCase() || "";
    const subjectMatches = filter === "all" || filter === subject;
    const searchMatches = !search || cardText.includes(search) || anyTopicVisible;

    const visible = subjectMatches && searchMatches;
    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const progress = progressStore ? await progressStore.load() : { completed: {}, quizScores: {} };

  updateProgressView(progress);
  decorateTopicLinks(progress);
  applyEducationFilters();

  const searchInput = document.getElementById("education-search");
  const filterSelect = document.getElementById("education-filter-subject");

  if (searchInput) {
    searchInput.addEventListener("input", applyEducationFilters);
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", applyEducationFilters);
  }
});
