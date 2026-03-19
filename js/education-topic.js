const progressStore = window.EducationProgressStore;

const topicData = {
  math: {
    algebra: {
      title: "Algebra",
      overview: "Use variables, equations, and patterns to solve unknowns and explain reasoning.",
      goals: [
        "Solve one-step and two-step equations",
        "Translate word problems into expressions",
        "Check solutions by substitution"
      ],
      activities: [
        "Equation relay: solve 10 mixed equations",
        "Pattern challenge: write the nth-term rule",
        "Real-life math: create a budget equation"
      ],
      resources: [
        "Use graph paper to plot y = mx + b lines",
        "Practice balancing equations on both sides"
      ],
      challenge: "Create and solve three original word problems that each use a different operation."
    },
    geometry: {
      title: "Geometry",
      overview: "Study shapes, measurements, angles, and space using drawings and models.",
      goals: [
        "Classify polygons and triangles",
        "Find area and perimeter",
        "Apply angle rules to solve missing values"
      ],
      activities: [
        "Angle hunt: find parallel lines and transversal angles",
        "Design a room layout using scale",
        "Build 3D shapes and label faces, edges, vertices"
      ],
      resources: [
        "Draw with ruler and protractor for accuracy",
        "Compare formulas with real object measurements"
      ],
      challenge: "Design a mini park map and compute total fencing and grass area."
    },
    statistics: {
      title: "Statistics",
      overview: "Collect, organize, and interpret data to make evidence-based conclusions.",
      goals: [
        "Calculate mean, median, mode, and range",
        "Create tables and charts",
        "Interpret trends and outliers"
      ],
      activities: [
        "Survey classmates on favorite games",
        "Build a bar chart and pie chart from the same data",
        "Predict next-week results from current trends"
      ],
      resources: [
        "Use spreadsheet tools for quick graphing",
        "Check if sample size is large enough"
      ],
      challenge: "Run a 10-person survey and write a one-paragraph conclusion backed by your chart."
    }
  },
  science: {
    biology: {
      title: "Biology",
      overview: "Learn how living things are built, grow, and interact with ecosystems.",
      goals: [
        "Explain cell parts and their functions",
        "Describe food chains and ecosystems",
        "Understand adaptation and survival"
      ],
      activities: [
        "Cell label race with diagrams",
        "Build a food web from local animals",
        "Observe plant growth over 7 days"
      ],
      resources: [
        "Use microscope images to compare cells",
        "Track observations in a science journal"
      ],
      challenge: "Create a food web poster and explain what happens if one species disappears."
    },
    chemistry: {
      title: "Chemistry",
      overview: "Explore matter, atoms, and reactions to understand how substances change.",
      goals: [
        "Identify atoms, elements, and compounds",
        "Read simple chemical formulas",
        "Differentiate physical vs chemical changes"
      ],
      activities: [
        "Periodic table scavenger hunt",
        "Classify household changes as physical or chemical",
        "Model molecules with craft materials"
      ],
      resources: [
        "Revisit the periodic table puzzle on your site",
        "Practice naming compounds from formulas"
      ],
      challenge: "Pick five elements and explain one real-world use for each."
    },
    physics: {
      title: "Physics",
      overview: "Understand motion, force, energy, and waves through experiments and models.",
      goals: [
        "Describe Newton's laws in everyday life",
        "Calculate speed from distance and time",
        "Compare kinetic and potential energy"
      ],
      activities: [
        "Ramp test with toy cars",
        "Balloon rocket experiment",
        "Sound wave investigation with a tuning app"
      ],
      resources: [
        "Measure and repeat trials for reliable data",
        "Graph how force changes motion"
      ],
      challenge: "Design a simple experiment showing how friction affects speed."
    }
  },
  history: {
    "ancient-civilizations": {
      title: "Ancient Civilizations",
      overview: "Compare early societies and the inventions, beliefs, and systems they built.",
      goals: [
        "Locate major ancient civilizations on a map",
        "Compare government and social structures",
        "Identify lasting inventions and ideas"
      ],
      activities: [
        "Timeline build for Egypt, Greece, Rome, and Mesopotamia",
        "Artifact detective: infer culture from objects",
        "Write a day-in-the-life journal entry"
      ],
      resources: [
        "Use primary source images where possible",
        "Separate myth from historical evidence"
      ],
      challenge: "Create a comparison chart of two civilizations with at least six categories."
    },
    "us-history": {
      title: "US History",
      overview: "Study key events, movements, and documents that shaped the United States.",
      goals: [
        "Place major events in chronological order",
        "Analyze causes and effects of turning points",
        "Understand multiple perspectives"
      ],
      activities: [
        "Constitution vocabulary match",
        "Civil War causes and effects map",
        "Debate a historical decision using evidence"
      ],
      resources: [
        "Use timelines to connect events",
        "Practice citing sources in short responses"
      ],
      challenge: "Write a one-page argument about which event most changed US society and why."
    },
    "world-wars": {
      title: "World Wars",
      overview: "Investigate global conflicts, alliances, and their long-term impact.",
      goals: [
        "Explain major causes of each war",
        "Describe key battles and fronts",
        "Understand social and political aftermath"
      ],
      activities: [
        "Alliance map activity",
        "Compare wartime technologies",
        "Analyze propaganda posters"
      ],
      resources: [
        "Focus on factual, respectful analysis",
        "Use maps and dates to keep context clear"
      ],
      challenge: "Build a cause-and-effect chain from one trigger event to one global consequence."
    }
  },
  english: {
    "reading-comprehension": {
      title: "Reading Comprehension",
      overview: "Improve understanding of fiction and nonfiction through close reading strategies.",
      goals: [
        "Find main idea and supporting details",
        "Make evidence-based inferences",
        "Summarize accurately"
      ],
      activities: [
        "Annotate a short article",
        "Answer who/what/why/how question sets",
        "Retell a passage in 5 sentences"
      ],
      resources: [
        "Highlight claim and evidence pairs",
        "Use context clues before checking definitions"
      ],
      challenge: "Read one article and write a summary plus two supported inferences."
    },
    "grammar-writing": {
      title: "Grammar and Writing",
      overview: "Strengthen sentence structure, clarity, and style for stronger communication.",
      goals: [
        "Use punctuation correctly",
        "Write clear topic sentences",
        "Revise drafts for flow and precision"
      ],
      activities: [
        "Sentence combining practice",
        "Paragraph fix-up editing game",
        "Write and revise a persuasive paragraph"
      ],
      resources: [
        "Read writing out loud to catch errors",
        "Check for subject-verb agreement"
      ],
      challenge: "Write a two-paragraph response and complete one full revision pass."
    },
    vocabulary: {
      title: "Vocabulary",
      overview: "Expand word knowledge and use new terms accurately in context.",
      goals: [
        "Learn roots, prefixes, and suffixes",
        "Use context clues for unknown words",
        "Apply new words in original sentences"
      ],
      activities: [
        "Word family sorting",
        "Context clue detective",
        "Weekly vocabulary challenge cards"
      ],
      resources: [
        "Keep a personal vocabulary notebook",
        "Review words in spaced intervals"
      ],
      challenge: "Use 10 new words in a short story while keeping meaning clear."
    }
  },
  coding: {
    "web-development": {
      title: "Web Development",
      overview: "Build websites with HTML, CSS, and JavaScript while learning clean structure.",
      goals: [
        "Create semantic HTML layouts",
        "Style pages with reusable CSS classes",
        "Add interactivity with JavaScript events"
      ],
      activities: [
        "Build a profile card component",
        "Create a responsive navigation bar",
        "Add a form with validation"
      ],
      resources: [
        "Use browser dev tools to inspect styles",
        "Name classes clearly and consistently"
      ],
      challenge: "Create one mini page that includes a form, a card, and a working button interaction."
    },
    "computer-science-basics": {
      title: "Computer Science Basics",
      overview: "Practice algorithms, decomposition, and logical thinking used in software.",
      goals: [
        "Understand sequence, selection, and loops",
        "Trace simple algorithms",
        "Break large problems into steps"
      ],
      activities: [
        "Flowchart everyday tasks",
        "Pseudocode a sorting process",
        "Debug a small logic puzzle"
      ],
      resources: [
        "Dry-run code with sample inputs",
        "Explain each step in plain language"
      ],
      challenge: "Write pseudocode for a number guessing game and test it with three scenarios."
    },
    "cyber-safety": {
      title: "Cyber Safety",
      overview: "Learn practical online safety skills for privacy, security, and digital citizenship.",
      goals: [
        "Spot phishing attempts",
        "Create strong password strategies",
        "Protect personal information online"
      ],
      activities: [
        "Phishing email identification game",
        "Build a password checklist",
        "Review privacy settings on common apps"
      ],
      resources: [
        "Use multi-factor authentication when possible",
        "Think before sharing personal data"
      ],
      challenge: "Create a personal cyber safety guide with five rules and one example for each."
    }
  }
};

let activeTopicKey = "";
let activeQuiz = [];

function getProgressFallback() {
  return { version: 1, user: "guest", completed: {}, quizScores: {} };
}

async function loadEducationProgress() {
  if (!progressStore) return getProgressFallback();
  return progressStore.load();
}

async function persistEducationProgress(progress) {
  if (!progressStore) return;
  await progressStore.save(progress);
}

function readTopicFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const subject = (params.get("subject") || "").toLowerCase();
  const topic = (params.get("topic") || "").toLowerCase();
  return { subject, topic };
}

function getTopicKey(subject, topic) {
  return progressStore ? progressStore.getTopicKey(subject, topic) : `${subject}/${topic}`;
}

function pickUniqueChoices(correct, distractorPool, desiredTotal = 4) {
  const unique = [correct];
  const shuffled = [...new Set(distractorPool)].sort(() => Math.random() - 0.5);

  for (const choice of shuffled) {
    if (unique.includes(choice)) continue;
    unique.push(choice);
    if (unique.length >= desiredTotal) break;
  }

  return unique.sort(() => Math.random() - 0.5);
}

function buildQuizQuestions(subject, topic, content) {
  const allPhrases = [];
  Object.values(topicData).forEach((subjectGroup) => {
    Object.values(subjectGroup).forEach((topicContent) => {
      allPhrases.push(...topicContent.goals, ...topicContent.activities, ...topicContent.resources);
    });
  });

  const goalCorrect = content.goals[0];
  const activityCorrect = content.activities[0];
  const tipCorrect = content.resources[0];

  const goalOptions = pickUniqueChoices(
    goalCorrect,
    [...content.activities, ...content.resources, ...allPhrases.filter((item) => !content.goals.includes(item))],
    4
  );

  const activityOptions = pickUniqueChoices(
    activityCorrect,
    [...content.goals, ...content.resources, ...allPhrases.filter((item) => !content.activities.includes(item))],
    4
  );

  const tipOptions = pickUniqueChoices(
    tipCorrect,
    [...content.goals, ...content.activities, ...allPhrases.filter((item) => !content.resources.includes(item))],
    4
  );

  return [
    {
      id: "goal",
      text: `Which option is a learning goal for ${content.title}?`,
      correct: goalCorrect,
      options: goalOptions
    },
    {
      id: "activity",
      text: `Which activity belongs to ${content.title}?`,
      correct: activityCorrect,
      options: activityOptions
    },
    {
      id: "tip",
      text: `Which study tip appears in ${content.title}?`,
      correct: tipCorrect,
      options: tipOptions
    }
  ];
}

function renderQuizSection(container, quizQuestions) {
  const questionHtml = quizQuestions
    .map((question, index) => {
      const optionHtml = question.options
        .map((option, optionIndex) => {
          const inputName = `quiz-q-${index}`;
          const optionId = `${inputName}-${optionIndex}`;
          return `
            <label for="${optionId}">
              <input id="${optionId}" type="radio" name="${inputName}" value="${option}">
              <span>${option}</span>
            </label>
          `;
        })
        .join("");

      return `
        <div class="quiz-question" data-question-id="${question.id}">
          <p><strong>${index + 1}.</strong> ${question.text}</p>
          <div class="quiz-options">${optionHtml}</div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <section class="topic-quiz" id="topic-quiz">
      <h3>Quick Quiz</h3>
      ${questionHtml}
      <div class="quiz-actions">
        <button id="quiz-check-btn" class="quiz-btn" type="button">Check Quiz</button>
        <button id="quiz-reset-btn" class="quiz-btn quiz-reset-btn" type="button">New Questions</button>
      </div>
      <p id="quiz-result" class="quiz-result" aria-live="polite"></p>
    </section>
  `;
}

function renderProgressPanel(container, progress, key, title) {
  const completed = Boolean(progress.completed[key]);
  const bestScore = Number(progress.quizScores[key]?.best || 0);

  container.innerHTML = `
    <section class="topic-progress">
      <h3>Your Progress</h3>
      <p id="topic-progress-meta" class="topic-progress-meta">
        ${completed ? `${title} marked complete.` : "Not marked complete yet."}
        Best quiz score: ${bestScore}%.
      </p>
      <button id="topic-complete-btn" class="topic-complete-btn" type="button">
        ${completed ? "Mark As In Progress" : "Mark Topic Complete"}
      </button>
    </section>
  `;
}

function updateTopicProgressMeta(progress) {
  const meta = document.getElementById("topic-progress-meta");
  const button = document.getElementById("topic-complete-btn");
  if (!meta || !button || !activeTopicKey) return;

  const completed = Boolean(progress.completed[activeTopicKey]);
  const bestScore = Number(progress.quizScores[activeTopicKey]?.best || 0);

  meta.textContent = `${completed ? "Topic marked complete." : "Not marked complete yet."} Best quiz score: ${bestScore}%.`;
  button.textContent = completed ? "Mark As In Progress" : "Mark Topic Complete";
}

function attachTopicInteractions(subject, topic, content) {
  const quizResult = document.getElementById("quiz-result");
  const checkBtn = document.getElementById("quiz-check-btn");
  const resetBtn = document.getElementById("quiz-reset-btn");
  const completeBtn = document.getElementById("topic-complete-btn");

  if (checkBtn) {
    checkBtn.addEventListener("click", async () => {
      let correctCount = 0;

      activeQuiz.forEach((question, index) => {
        const selected = document.querySelector(`input[name="quiz-q-${index}"]:checked`);
        if (selected && selected.value === question.correct) {
          correctCount += 1;
        }
      });

      const percent = Math.round((correctCount / activeQuiz.length) * 100);
      if (quizResult) {
        quizResult.textContent = `Score: ${correctCount}/${activeQuiz.length} (${percent}%).`;
        quizResult.style.color = percent >= 80 ? "#0b7a3c" : "#c0392b";
      }

      const progress = await loadEducationProgress();
      const existingBest = Number(progress.quizScores[activeTopicKey]?.best || 0);
      progress.quizScores[activeTopicKey] = {
        best: Math.max(existingBest, percent),
        last: percent,
        updatedAt: new Date().toISOString()
      };

      if (percent === 100) {
        progress.completed[activeTopicKey] = new Date().toISOString();
      }

      await persistEducationProgress(progress);
      updateTopicProgressMeta(progress);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const newQuizHost = document.getElementById("topic-quiz-host");
      if (!newQuizHost) return;

      activeQuiz = buildQuizQuestions(subject, topic, content);
      renderQuizSection(newQuizHost, activeQuiz);
      attachTopicInteractions(subject, topic, content);
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener("click", async () => {
      const progress = await loadEducationProgress();
      const completed = Boolean(progress.completed[activeTopicKey]);

      if (completed) {
        delete progress.completed[activeTopicKey];
      } else {
        progress.completed[activeTopicKey] = new Date().toISOString();
      }

      await persistEducationProgress(progress);
      updateTopicProgressMeta(progress);
    });
  }
}

async function renderTopicPage() {
  const page = document.getElementById("topic-page");
  if (!page) return;

  const { subject, topic } = readTopicFromUrl();
  const content = topicData[subject]?.[topic];

  if (!content) {
    page.innerHTML = `
      <p class="topic-meta">Education</p>
      <h2>Topic Not Found</h2>
      <p class="topic-overview">This topic link may be outdated. Return to Education and choose a subject again.</p>
      <div class="topic-links">
        <a class="topic-pill" href="education.html">Back To Education</a>
      </div>
    `;
    return;
  }

  const prettySubject = subject.charAt(0).toUpperCase() + subject.slice(1);
  activeTopicKey = getTopicKey(subject, topic);

  page.innerHTML = `
    <p class="topic-meta">${prettySubject} / ${content.title}</p>
    <h2>${content.title}</h2>
    <p class="topic-overview">${content.overview}</p>

    <div class="topic-grid">
      <section class="topic-card">
        <h3>Learning Goals</h3>
        <ul>${content.goals.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>

      <section class="topic-card">
        <h3>Activities</h3>
        <ul>${content.activities.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>

      <section class="topic-card">
        <h3>Study Tips</h3>
        <ul>${content.resources.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
    </div>

    <section class="topic-challenge">
      <h3>Challenge Task</h3>
      <p>${content.challenge}</p>
    </section>

    <div id="topic-progress-host"></div>
    <div id="topic-quiz-host"></div>

    <div class="topic-links">
      <a class="topic-pill" href="education.html">Back To Education</a>
    </div>
  `;

  const progress = await loadEducationProgress();
  const progressHost = document.getElementById("topic-progress-host");
  const quizHost = document.getElementById("topic-quiz-host");

  if (progressHost) {
    renderProgressPanel(progressHost, progress, activeTopicKey, content.title);
  }

  if (quizHost) {
    activeQuiz = buildQuizQuestions(subject, topic, content);
    renderQuizSection(quizHost, activeQuiz);
  }

  attachTopicInteractions(subject, topic, content);
}

document.addEventListener("DOMContentLoaded", renderTopicPage);
