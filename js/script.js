console.log("Your website is running!");

const periodicElements = [
  { number: 1, symbol: "H", name: "Hydrogen" },
  { number: 2, symbol: "He", name: "Helium" },
  { number: 3, symbol: "Li", name: "Lithium" },
  { number: 4, symbol: "Be", name: "Beryllium" },
  { number: 5, symbol: "B", name: "Boron" },
  { number: 6, symbol: "C", name: "Carbon" },
  { number: 7, symbol: "N", name: "Nitrogen" },
  { number: 8, symbol: "O", name: "Oxygen" },
  { number: 9, symbol: "F", name: "Fluorine" },
  { number: 10, symbol: "Ne", name: "Neon" },
  { number: 11, symbol: "Na", name: "Sodium" },
  { number: 12, symbol: "Mg", name: "Magnesium" },
  { number: 13, symbol: "Al", name: "Aluminum" },
  { number: 14, symbol: "Si", name: "Silicon" },
  { number: 15, symbol: "P", name: "Phosphorus" },
  { number: 16, symbol: "S", name: "Sulfur" },
  { number: 17, symbol: "Cl", name: "Chlorine" },
  { number: 18, symbol: "Ar", name: "Argon" },
  { number: 19, symbol: "K", name: "Potassium" },
  { number: 20, symbol: "Ca", name: "Calcium" },
  { number: 21, symbol: "Sc", name: "Scandium" },
  { number: 22, symbol: "Ti", name: "Titanium" },
  { number: 23, symbol: "V", name: "Vanadium" },
  { number: 24, symbol: "Cr", name: "Chromium" },
  { number: 25, symbol: "Mn", name: "Manganese" },
  { number: 26, symbol: "Fe", name: "Iron" },
  { number: 27, symbol: "Co", name: "Cobalt" },
  { number: 28, symbol: "Ni", name: "Nickel" },
  { number: 29, symbol: "Cu", name: "Copper" },
  { number: 30, symbol: "Zn", name: "Zinc" },
  { number: 31, symbol: "Ga", name: "Gallium" },
  { number: 32, symbol: "Ge", name: "Germanium" },
  { number: 33, symbol: "As", name: "Arsenic" },
  { number: 34, symbol: "Se", name: "Selenium" },
  { number: 35, symbol: "Br", name: "Bromine" },
  { number: 36, symbol: "Kr", name: "Krypton" },
  { number: 37, symbol: "Rb", name: "Rubidium" },
  { number: 38, symbol: "Sr", name: "Strontium" },
  { number: 39, symbol: "Y", name: "Yttrium" },
  { number: 40, symbol: "Zr", name: "Zirconium" },
  { number: 41, symbol: "Nb", name: "Niobium" },
  { number: 42, symbol: "Mo", name: "Molybdenum" },
  { number: 43, symbol: "Tc", name: "Technetium" },
  { number: 44, symbol: "Ru", name: "Ruthenium" },
  { number: 45, symbol: "Rh", name: "Rhodium" },
  { number: 46, symbol: "Pd", name: "Palladium" },
  { number: 47, symbol: "Ag", name: "Silver" },
  { number: 48, symbol: "Cd", name: "Cadmium" },
  { number: 49, symbol: "In", name: "Indium" },
  { number: 50, symbol: "Sn", name: "Tin" },
  { number: 51, symbol: "Sb", name: "Antimony" },
  { number: 52, symbol: "Te", name: "Tellurium" },
  { number: 53, symbol: "I", name: "Iodine" },
  { number: 54, symbol: "Xe", name: "Xenon" },
  { number: 55, symbol: "Cs", name: "Cesium" },
  { number: 56, symbol: "Ba", name: "Barium" },
  { number: 57, symbol: "La", name: "Lanthanum" },
  { number: 58, symbol: "Ce", name: "Cerium" },
  { number: 59, symbol: "Pr", name: "Praseodymium" },
  { number: 60, symbol: "Nd", name: "Neodymium" },
  { number: 61, symbol: "Pm", name: "Promethium" },
  { number: 62, symbol: "Sm", name: "Samarium" },
  { number: 63, symbol: "Eu", name: "Europium" },
  { number: 64, symbol: "Gd", name: "Gadolinium" },
  { number: 65, symbol: "Tb", name: "Terbium" },
  { number: 66, symbol: "Dy", name: "Dysprosium" },
  { number: 67, symbol: "Ho", name: "Holmium" },
  { number: 68, symbol: "Er", name: "Erbium" },
  { number: 69, symbol: "Tm", name: "Thulium" },
  { number: 70, symbol: "Yb", name: "Ytterbium" },
  { number: 71, symbol: "Lu", name: "Lutetium" },
  { number: 72, symbol: "Hf", name: "Hafnium" },
  { number: 73, symbol: "Ta", name: "Tantalum" },
  { number: 74, symbol: "W", name: "Tungsten" },
  { number: 75, symbol: "Re", name: "Rhenium" },
  { number: 76, symbol: "Os", name: "Osmium" },
  { number: 77, symbol: "Ir", name: "Iridium" },
  { number: 78, symbol: "Pt", name: "Platinum" },
  { number: 79, symbol: "Au", name: "Gold" },
  { number: 80, symbol: "Hg", name: "Mercury" },
  { number: 81, symbol: "Tl", name: "Thallium" },
  { number: 82, symbol: "Pb", name: "Lead" },
  { number: 83, symbol: "Bi", name: "Bismuth" },
  { number: 84, symbol: "Po", name: "Polonium" },
  { number: 85, symbol: "At", name: "Astatine" },
  { number: 86, symbol: "Rn", name: "Radon" },
  { number: 87, symbol: "Fr", name: "Francium" },
  { number: 88, symbol: "Ra", name: "Radium" },
  { number: 89, symbol: "Ac", name: "Actinium" },
  { number: 90, symbol: "Th", name: "Thorium" },
  { number: 91, symbol: "Pa", name: "Protactinium" },
  { number: 92, symbol: "U", name: "Uranium" },
  { number: 93, symbol: "Np", name: "Neptunium" },
  { number: 94, symbol: "Pu", name: "Plutonium" },
  { number: 95, symbol: "Am", name: "Americium" },
  { number: 96, symbol: "Cm", name: "Curium" },
  { number: 97, symbol: "Bk", name: "Berkelium" },
  { number: 98, symbol: "Cf", name: "Californium" },
  { number: 99, symbol: "Es", name: "Einsteinium" },
  { number: 100, symbol: "Fm", name: "Fermium" },
  { number: 101, symbol: "Md", name: "Mendelevium" },
  { number: 102, symbol: "No", name: "Nobelium" },
  { number: 103, symbol: "Lr", name: "Lawrencium" },
  { number: 104, symbol: "Rf", name: "Rutherfordium" },
  { number: 105, symbol: "Db", name: "Dubnium" },
  { number: 106, symbol: "Sg", name: "Seaborgium" },
  { number: 107, symbol: "Bh", name: "Bohrium" },
  { number: 108, symbol: "Hs", name: "Hassium" },
  { number: 109, symbol: "Mt", name: "Meitnerium" },
  { number: 110, symbol: "Ds", name: "Darmstadtium" },
  { number: 111, symbol: "Rg", name: "Roentgenium" },
  { number: 112, symbol: "Cn", name: "Copernicium" },
  { number: 113, symbol: "Nh", name: "Nihonium" },
  { number: 114, symbol: "Fl", name: "Flerovium" },
  { number: 115, symbol: "Mc", name: "Moscovium" },
  { number: 116, symbol: "Lv", name: "Livermorium" },
  { number: 117, symbol: "Ts", name: "Tennessine" },
  { number: 118, symbol: "Og", name: "Oganesson" }
];

const symbols = periodicElements.map((e) => e.symbol);

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

  const selectedQuestions = shuffleArray(periodicElements).slice(0, 12);
  container.innerHTML = "";

  selectedQuestions.forEach((q, idx) => {
    const select = document.createElement("select");
    select.id = `element-${idx}`;
    select.className = "puzzle-select";
    select.setAttribute("data-correct", q.symbol);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choose symbol";
    select.appendChild(defaultOption);

    const wrongChoices = shuffleArray(symbols.filter((s) => s !== q.symbol)).slice(0, 5);
    const options = shuffleArray([q.symbol, ...wrongChoices]);

    options.forEach((sym) => {
      const opt = document.createElement("option");
      opt.value = sym;
      opt.textContent = sym;
      select.appendChild(opt);
    });

    const row = document.createElement("div");
    row.className = "puzzle-row";
    row.innerHTML = `<span class='puzzle-element'>${q.number}. ${q.name}</span>`;
    row.appendChild(select);
    container.appendChild(row);
  });
}

let currentFactCard = null;

function showRandomFactCard() {
  const factQuestion = document.getElementById("fact-question");
  const factResult = document.getElementById("fact-result");
  const answerInput = document.getElementById("fact-answer");
  if (!factQuestion || !answerInput) return;

  const random = periodicElements[Math.floor(Math.random() * periodicElements.length)];
  currentFactCard = random;
  factQuestion.textContent = `What is the element symbol for ${random.name} (atomic number ${random.number})?`;
  if (factResult) {
    factResult.textContent = "";
  }
  answerInput.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  renderPeriodicPuzzle();
  showRandomFactCard();

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
  const factCheckBtn = document.getElementById("fact-check");
  const factNextBtn = document.getElementById("fact-next");
  const factAnswer = document.getElementById("fact-answer");
  const factResult = document.getElementById("fact-result");

  if (factCheckBtn && factAnswer) {
    factCheckBtn.addEventListener("click", () => {
      if (!currentFactCard) return;
      const guess = factAnswer.value.trim();
      if (guess.toLowerCase() === currentFactCard.symbol.toLowerCase()) {
        if (factResult) {
          factResult.textContent = `✅ Correct! ${currentFactCard.name} is ${currentFactCard.symbol}.`;
          factResult.style.color = "#0b7a3c";
        }
      } else {
        if (factResult) {
          factResult.textContent = `❌ Try again. The correct symbol is ${currentFactCard.symbol}.`;
          factResult.style.color = "#c0392b";
        }
      }
    });
  }

  if (factNextBtn) {
    factNextBtn.addEventListener("click", showRandomFactCard);
  }

  const watchlistSection = document.getElementById("watchlist-section");
  if (!watchlistSection) {
    return;
  }

  const watchlistForm = document.getElementById("watchlist-form");
  const watchlistMessage = document.getElementById("watchlist-message");
  const watchlistTableBody = document.querySelector("#watchlist-table tbody");
  const watchlistCsvFile = document.getElementById("watchlist-csv-file");
  const watchlistImportBtn = document.getElementById("watchlist-import-btn");
  const watchlistSearch = document.getElementById("watchlist-search");
  const watchlistFilterType = document.getElementById("watchlist-filter-type");
  const watchlistSort = document.getElementById("watchlist-sort");
  const watchlistExportBtn = document.getElementById("watchlist-export-btn");
  const watchlistCancelEdit = document.getElementById("watchlist-cancel-edit");
  const watchTitleInput = document.getElementById("watch-title");
  const watchTypeInput = document.getElementById("watch-type");
  const watchYearInput = document.getElementById("watch-year");
  const watchStatusInput = document.getElementById("watch-status");
  const watchSubmitButton = watchlistForm?.querySelector("button[type='submit']");

  let watchlistItems = [];
  let editingItemId = null;

  function setWatchlistMessage(text, isError = false) {
    if (!watchlistMessage) return;
    watchlistMessage.textContent = text;
    watchlistMessage.style.color = isError ? "#c0392b" : "#3944BC";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseCsvLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      const next = line[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }

    values.push(current.trim());
    return values;
  }

  function csvTextToItems(csvText) {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error("CSV needs a header row and at least one data row.");
    }

    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const idxTitle = header.indexOf("title");
    const idxType = header.indexOf("type");
    const idxYear = header.indexOf("year");
    const idxStatus = header.indexOf("status");

    if (idxTitle < 0 || idxType < 0) {
      throw new Error("CSV must include Title and Type columns.");
    }

    return lines.slice(1).map((line) => {
      const cells = parseCsvLine(line);
      return {
        title: cells[idxTitle] || "",
        type: cells[idxType] || "",
        year: idxYear >= 0 ? cells[idxYear] || "" : "",
        status: idxStatus >= 0 ? cells[idxStatus] || "" : ""
      };
    });
  }

  function getFilteredAndSortedItems() {
    const searchTerm = watchlistSearch?.value?.trim().toLowerCase() || "";
    const selectedType = watchlistFilterType?.value || "all";
    const sortValue = watchlistSort?.value || "newest";

    const filtered = watchlistItems.filter((item) => {
      const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm);
      const matchesType = selectedType === "all" || item.type === selectedType;
      return matchesSearch && matchesType;
    });

    filtered.sort((left, right) => {
      if (sortValue === "oldest") {
        return left.id - right.id;
      }
      if (sortValue === "title-asc") {
        return left.title.localeCompare(right.title);
      }
      if (sortValue === "title-desc") {
        return right.title.localeCompare(left.title);
      }
      if (sortValue === "year-asc") {
        return (Number(left.year) || 0) - (Number(right.year) || 0);
      }
      if (sortValue === "year-desc") {
        return (Number(right.year) || 0) - (Number(left.year) || 0);
      }
      return right.id - left.id;
    });

    return filtered;
  }

  function renderWatchlist() {
    if (!watchlistTableBody) return;

    const visibleItems = getFilteredAndSortedItems();

    if (!visibleItems.length) {
      watchlistTableBody.innerHTML = "<tr><td colspan='5'>No matching entries.</td></tr>";
      return;
    }

    watchlistTableBody.innerHTML = visibleItems
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.title)}</td>
            <td>${escapeHtml(item.type)}</td>
            <td>${escapeHtml(item.year ?? "")}</td>
            <td>${escapeHtml(item.status ?? "")}</td>
            <td>
              <button class="watchlist-edit-btn" data-id="${item.id}">Edit</button>
              <button class="watchlist-delete-btn" data-id="${item.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function resetWatchlistForm() {
    editingItemId = null;
    watchlistForm?.reset();
    if (watchSubmitButton) {
      watchSubmitButton.textContent = "Save";
    }
    if (watchlistCancelEdit) {
      watchlistCancelEdit.hidden = true;
    }
  }

  function fillWatchlistForm(item) {
    editingItemId = item.id;
    if (watchTitleInput) watchTitleInput.value = item.title || "";
    if (watchTypeInput) watchTypeInput.value = item.type || "";
    if (watchYearInput) watchYearInput.value = item.year ?? "";
    if (watchStatusInput) watchStatusInput.value = item.status || "";
    if (watchSubmitButton) {
      watchSubmitButton.textContent = "Update";
    }
    if (watchlistCancelEdit) {
      watchlistCancelEdit.hidden = false;
    }
  }

  function downloadCsv(items) {
    const rows = [
      ["Title", "Type", "Year", "Status"],
      ...items.map((item) => [item.title || "", item.type || "", item.year ?? "", item.status || ""])
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "watchlist-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function loadWatchlist(successMessage) {
    try {
      const response = await fetch("/api/watchlist");
      if (!response.ok) throw new Error("Unable to fetch watchlist");
      watchlistItems = await response.json();
      renderWatchlist();
      setWatchlistMessage(successMessage || `Loaded ${watchlistItems.length} items from SQLite.`);
    } catch (error) {
      watchlistItems = [];
      renderWatchlist();
      setWatchlistMessage("Could not load watchlist. Start backend with npm start.", true);
    }
  }

  if (watchlistForm) {
    watchlistForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = watchTitleInput?.value?.trim() || "";
      const type = watchTypeInput?.value?.trim() || "";
      const year = watchYearInput?.value?.trim() || "";
      const status = watchStatusInput?.value?.trim() || "";

      if (!title || !type) {
        setWatchlistMessage("Title and type are required.", true);
        return;
      }

      try {
        const url = editingItemId ? `/api/watchlist/${editingItemId}` : "/api/watchlist";
        const method = editingItemId ? "PUT" : "POST";
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, type, year, status })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Could not save item");
        }

        const successMessage = editingItemId
          ? `Updated "${payload.title}".`
          : `Saved "${payload.title}" to SQLite.`;
        resetWatchlistForm();
        await loadWatchlist(successMessage);
      } catch (error) {
        setWatchlistMessage(error.message || "Could not save item.", true);
      }
    });
  }

  if (watchlistCancelEdit) {
    watchlistCancelEdit.addEventListener("click", () => {
      resetWatchlistForm();
      setWatchlistMessage("Edit cancelled.");
    });
  }

  if (watchlistTableBody) {
    watchlistTableBody.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      const id = Number(target.getAttribute("data-id"));
      if (Number.isNaN(id)) return;

      if (target.classList.contains("watchlist-edit-btn")) {
        const item = watchlistItems.find((entry) => entry.id === id);
        if (!item) return;
        fillWatchlistForm(item);
        setWatchlistMessage(`Editing "${item.title}".`);
        return;
      }

      if (!target.classList.contains("watchlist-delete-btn")) return;

      try {
        const response = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Could not delete item");
        }
        if (editingItemId === id) {
          resetWatchlistForm();
        }
        await loadWatchlist("Item deleted.");
      } catch (error) {
        setWatchlistMessage(error.message || "Could not delete item.", true);
      }
    });
  }

  if (watchlistImportBtn) {
    watchlistImportBtn.addEventListener("click", async () => {
      const file = watchlistCsvFile?.files?.[0];
      if (!file) {
        setWatchlistMessage("Select a CSV file before importing.", true);
        return;
      }

      try {
        const csvText = await file.text();
        const items = csvTextToItems(csvText);

        const response = await fetch("/api/watchlist/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Import failed.");
        }

        await loadWatchlist(
          `Import complete: ${payload.inserted} new, ${payload.duplicates} duplicates, ${payload.invalid} invalid.`
        );
      } catch (error) {
        setWatchlistMessage(error.message || "Could not import CSV.", true);
      }
    });
  }

  if (watchlistSearch) {
    watchlistSearch.addEventListener("input", renderWatchlist);
  }

  if (watchlistFilterType) {
    watchlistFilterType.addEventListener("change", renderWatchlist);
  }

  if (watchlistSort) {
    watchlistSort.addEventListener("change", renderWatchlist);
  }

  if (watchlistExportBtn) {
    watchlistExportBtn.addEventListener("click", () => {
      const visibleItems = getFilteredAndSortedItems();
      if (!visibleItems.length) {
        setWatchlistMessage("Nothing to export with the current filters.", true);
        return;
      }
      downloadCsv(visibleItems);
      setWatchlistMessage(`Exported ${visibleItems.length} items to CSV.`);
    });
  }

  loadWatchlist();
});