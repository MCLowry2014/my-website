console.log("Your website is running!");

const periodicQuestions = [
  { element: "Hydrogen", correct: "H" },
  { element: "Carbon", correct: "C" },
  { element: "Oxygen", correct: "O" },
  { element: "Sodium", correct: "Na" },
  { element: "Iron", correct: "Fe" },
  { element: "Gold", correct: "Au" },
  { element: "Helium", correct: "He" },
  { element: "Calcium", correct: "Ca" }
];

const symbols = ["H", "He", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "Ca", "Fe", "Au", "Ag"];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderPeriodicPuzzle() {
  const container = document.getElementById("puzzle-questions");
  if (!container) return;
  const shuffled = shuffleArray(periodicQuestions);
  container.innerHTML = "";

  shuffled.forEach((q, idx) => {
    const select = document.createElement("select");
    select.id = `element-${idx}`;
    select.className = "puzzle-select";
    select.setAttribute("data-correct", q.correct);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choose symbol";
    select.appendChild(defaultOption);

    const choices = shuffleArray([...symbols]);
    for (let i = 0; i < 6; i++) {
      const opt = document.createElement("option");
      opt.value = choices[i];
      opt.textContent = choices[i];
      select.appendChild(opt);
    }

    const row = document.createElement("div");
    row.className = "puzzle-row";
    row.innerHTML = `<span class='puzzle-element'>${q.element}</span>`;
    row.appendChild(select);
    container.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPeriodicPuzzle();

  const checkBtn = document.getElementById("puzzle-check");
  const resetBtn = document.getElementById("puzzle-reset");
  const result = document.getElementById("puzzle-result");

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      const selects = document.querySelectorAll(".puzzle-select");
      let correctCount = 0;
      selects.forEach((select) => {
        const user = select.value;
        const correct = select.getAttribute("data-correct");
        if (user === correct) {
          correctCount += 1;
          select.style.borderColor = "#28a745";
        } else {
          select.style.borderColor = "#dc3545";
        }
      });
      result.textContent = `You got ${correctCount} / ${selects.length} correct.`;
      result.style.color = correctCount === selects.length ? "#0b7a3c" : "#c0392b";
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      renderPeriodicPuzzle();
      if (result) {
        result.textContent = "";
      }
    });
  }
});