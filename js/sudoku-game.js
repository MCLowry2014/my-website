(function () {
  const SUDOKU_PUZZLES = [
    {
      puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      puzzle: "100920000524010000000000070050008102000000000402700090060000000000030945000071006",
      solution: "176923584524817639893654271957348162638192457412765398265489713781236945349571826"
    },
    {
      puzzle: "005300000800000020070010500400005300010070006003200080060500009004000030000009700",
      solution: "145327698839654127672918543486195372219873456753246981367582914594761238128439765"
    }
  ];

  function initSudoku(containerId) {
    const container = document.getElementById(containerId || "sudoku-game");
    if (!container) return;

    const selected = SUDOKU_PUZZLES[Math.floor(Math.random() * SUDOKU_PUZZLES.length)];
    const puzzle = selected.puzzle.split("");
    const solution = selected.solution.split("");

    container.innerHTML = `
      <div class="sudoku-wrap">
        <div id="sudoku-grid" class="sudoku-grid" aria-label="Sudoku board"></div>
        <div class="sudoku-controls">
          <button class="restart-btn" id="sudoku-check" type="button">Check</button>
          <button class="restart-btn" id="sudoku-clear" type="button">Clear Mistakes</button>
        </div>
        <p id="sudoku-message" class="sudoku-message" aria-live="polite"></p>
      </div>
    `;

    const grid = container.querySelector("#sudoku-grid");
    const message = container.querySelector("#sudoku-message");

    for (let i = 0; i < 81; i++) {
      const cell = document.createElement("input");
      cell.className = "sudoku-cell";
      cell.type = "text";
      cell.maxLength = 1;
      cell.inputMode = "numeric";
      cell.dataset.index = String(i);

      if (puzzle[i] !== "0") {
        cell.value = puzzle[i];
        cell.readOnly = true;
        cell.classList.add("sudoku-fixed");
      }

      // Add 3x3 separators.
      const col = i % 9;
      const row = Math.floor(i / 9);
      if (col === 2 || col === 5) cell.classList.add("sudoku-right-border");
      if (row === 2 || row === 5) cell.classList.add("sudoku-bottom-border");

      cell.addEventListener("input", function () {
        const value = cell.value.replace(/[^1-9]/g, "");
        cell.value = value;
        cell.classList.remove("sudoku-error");
      });

      grid.appendChild(cell);
    }

    const checkBtn = container.querySelector("#sudoku-check");
    const clearBtn = container.querySelector("#sudoku-clear");

    checkBtn.addEventListener("click", function () {
      const cells = grid.querySelectorAll(".sudoku-cell");
      let hasEmpty = false;
      let hasError = false;

      cells.forEach((cell) => {
        const index = Number(cell.dataset.index);
        if (cell.readOnly) return;

        if (!cell.value) {
          hasEmpty = true;
          cell.classList.remove("sudoku-error");
          return;
        }

        if (cell.value !== solution[index]) {
          hasError = true;
          cell.classList.add("sudoku-error");
        } else {
          cell.classList.remove("sudoku-error");
        }
      });

      if (!hasEmpty && !hasError) {
        message.textContent = "Solved! Great job.";
      } else if (hasError) {
        message.textContent = "Some cells are incorrect. Try again.";
      } else {
        message.textContent = "Keep going. You still have empty cells.";
      }
    });

    clearBtn.addEventListener("click", function () {
      const cells = grid.querySelectorAll(".sudoku-cell");
      cells.forEach((cell) => {
        if (cell.readOnly) return;
        const index = Number(cell.dataset.index);
        if (cell.value && cell.value !== solution[index]) {
          cell.value = "";
          cell.classList.remove("sudoku-error");
        }
      });
      message.textContent = "Cleared incorrect cells.";
    });
  }

  window.initSudoku = initSudoku;
})();
