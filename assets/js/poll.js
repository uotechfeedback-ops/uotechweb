const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxL3i2RthG2fHMAzf9IjEp_gf9SltFPcAG1I-OpjotXiQ_XEas-XmAIgmps3fKWlkfI/exec";
const STORAGE_KEY = "uotech_fifa_poll_entries";

const teams = [
  { name: "Argentina", code: "ARG", region: "South America", gradient: "linear-gradient(145deg, rgba(117, 190, 255, .56), rgba(255, 255, 255, .08))" },
  { name: "Brazil", code: "BRA", region: "South America", gradient: "linear-gradient(145deg, rgba(255, 220, 42, .6), rgba(14, 138, 61, .2))" },
  { name: "France", code: "FRA", region: "Europe", gradient: "linear-gradient(145deg, rgba(36, 90, 210, .58), rgba(240, 55, 65, .18))" },
  { name: "England", code: "ENG", region: "Europe", gradient: "linear-gradient(145deg, rgba(255, 255, 255, .42), rgba(205, 35, 55, .24))" },
  { name: "Portugal", code: "POR", region: "Europe", gradient: "linear-gradient(145deg, rgba(218, 36, 45, .58), rgba(28, 145, 77, .2))" },
  { name: "Spain", code: "ESP", region: "Europe", gradient: "linear-gradient(145deg, rgba(218, 38, 44, .56), rgba(255, 200, 44, .2))" },
  { name: "Germany", code: "GER", region: "Europe", gradient: "linear-gradient(145deg, rgba(255, 255, 255, .42), rgba(245, 196, 44, .2))" },
  { name: "Netherlands", code: "NED", region: "Europe", gradient: "linear-gradient(145deg, rgba(255, 115, 32, .58), rgba(255, 255, 255, .08))" },
  { name: "Italy", code: "ITA", region: "Europe", gradient: "linear-gradient(145deg, rgba(31, 160, 80, .48), rgba(36, 98, 210, .22))" },
  { name: "Belgium", code: "BEL", region: "Europe", gradient: "linear-gradient(145deg, rgba(238, 36, 54, .54), rgba(250, 210, 48, .18))" },
  { name: "Croatia", code: "CRO", region: "Europe", gradient: "linear-gradient(145deg, rgba(224, 42, 54, .5), rgba(255, 255, 255, .1))" },
  { name: "Morocco", code: "MAR", region: "Africa", gradient: "linear-gradient(145deg, rgba(212, 36, 54, .55), rgba(18, 145, 78, .2))" },
  { name: "Uruguay", code: "URU", region: "South America", gradient: "linear-gradient(145deg, rgba(101, 187, 255, .48), rgba(255, 255, 255, .08))" },
  { name: "Colombia", code: "COL", region: "South America", gradient: "linear-gradient(145deg, rgba(255, 212, 42, .58), rgba(33, 82, 180, .18))" },
  { name: "Japan", code: "JPN", region: "Asia", gradient: "linear-gradient(145deg, rgba(255, 255, 255, .42), rgba(205, 40, 64, .24))" },
  { name: "USA", code: "USA", region: "North America", gradient: "linear-gradient(145deg, rgba(35, 88, 200, .54), rgba(210, 36, 55, .22))" }
];

const selection = {
  semi: [],
  final: [],
  winner: [],
  fan: []
};

const limits = {
  semi: 4,
  final: 2,
  winner: 1,
  fan: 1
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("predictionForm")) {
    initPollForm();
  }

  if (document.getElementById("semiChart")) {
    initResultsPage();
  }
});

function initPollForm() {
  renderAllGrids();
  bindInputs();

  document.getElementById("predictionForm").addEventListener("submit", submitPoll);
}

function bindInputs() {
  const nameInput = document.getElementById("studentName");
  const mobileInput = document.getElementById("mobileNumber");

  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");
  });

  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
  });
}

function renderAllGrids() {
  renderGrid("semi", "semiGrid");
  renderGrid("final", "finalGrid");
  renderGrid("winner", "winnerGrid");
  renderGrid("fan", "fanGrid");
  updateCounts();
}

function renderGrid(type, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";

  teams.forEach((team) => {
    const card = document.createElement("button");
    const isSelected = selection[type].includes(team.name);
    const disabled = isTeamDisabled(type, team.name);

    card.type = "button";
    card.className = "team-card";
    card.dataset.team = team.name;
    card.style.setProperty("--team-gradient", team.gradient);

    if (isSelected) card.classList.add("selected");
    if (disabled) card.classList.add("disabled");

    card.innerHTML = `
      <span class="crest">${team.code}</span>
      <span class="team-name">${team.name}</span>
      <span class="team-region">${team.region}</span>
    `;

    card.addEventListener("click", () => handleTeamClick(type, team.name));
    grid.appendChild(card);
  });
}

function isTeamDisabled(type, teamName) {
  if (type === "final") {
    return !selection.semi.includes(teamName);
  }

  if (type === "winner") {
    return !selection.final.includes(teamName);
  }

  return false;
}

function handleTeamClick(type, teamName) {
  if (isTeamDisabled(type, teamName)) {
    showMessage(type === "final"
      ? "Please choose this team in your semi-final list first."
      : "Please choose this team in your final list first.", true);
    return;
  }

  const list = selection[type];
  const index = list.indexOf(teamName);

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    if (list.length >= limits[type]) {
      showMessage(`Only ${limits[type]} team${limits[type] > 1 ? "s" : ""} allowed in this section.`, true);
      return;
    }

    list.push(teamName);
  }

  if (type === "semi") {
    selection.final = selection.final.filter((team) => selection.semi.includes(team));
    selection.winner = selection.winner.filter((team) => selection.final.includes(team));
  }

  if (type === "final") {
    selection.winner = selection.winner.filter((team) => selection.final.includes(team));
  }

  showMessage("");
  syncHiddenFields();
  renderAllGrids();
}

function updateCounts() {
  setText("semiCount", `${selection.semi.length}/4 selected`);
  setText("finalCount", `${selection.final.length}/2 selected`);
  setText("winnerCount", `${selection.winner.length}/1 selected`);
  setText("fanCount", `${selection.fan.length}/1 selected`);
}

function syncHiddenFields() {
  setValue("semiFinalTeams", selection.semi.join(", "));
  setValue("finalTeams", selection.final.join(", "));
  setValue("winnerTeam", selection.winner[0] || "");
  setValue("fanTeam", selection.fan[0] || "");
}

async function submitPoll(event) {
  event.preventDefault();
  syncHiddenFields();

  if (!isFormValid()) return;

  const submitButton = document.getElementById("submitPoll");
  const entry = {
    timestamp: new Date().toISOString(),
    student_name: document.getElementById("studentName").value.trim(),
    mobile_number: document.getElementById("mobileNumber").value.trim(),
    semi_final_teams: [...selection.semi],
    final_teams: [...selection.final],
    winner_team: selection.winner[0],
    fan_team: selection.fan[0]
  };

  submitButton.disabled = true;
  showMessage("Submitting prediction...");

  try {
    if (GOOGLE_SHEET_WEB_APP_URL) {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      });
    }

    saveEntry(entry);
    showMessage("Prediction submitted successfully.", false, true);
    setTimeout(() => {
      window.location.href = "poll-results.html";
    }, 700);
  } catch (error) {
    console.error(error);
    showMessage("Could not submit now. Please check the Google Sheet URL.", true);
  } finally {
    submitButton.disabled = false;
  }
}

function isFormValid() {
  const name = document.getElementById("studentName").value.trim();
  const mobile = document.getElementById("mobileNumber").value.trim();

  if (!name) {
    showMessage("Please enter student name.", true);
    return false;
  }

  if (!/^\d{10}$/.test(mobile)) {
    showMessage("Please enter a valid 10 digit mobile number.", true);
    return false;
  }

  if (selection.semi.length !== 4) {
    showMessage("Please select exactly 4 semi-final teams.", true);
    return false;
  }

  if (selection.final.length !== 2) {
    showMessage("Please select exactly 2 final teams.", true);
    return false;
  }

  if (selection.winner.length !== 1) {
    showMessage("Please select 1 FIFA final winner.", true);
    return false;
  }

  if (selection.fan.length !== 1) {
    showMessage("Please select your fan team.", true);
    return false;
  }

  return true;
}

function initResultsPage() {
  loadEntries().then((entries) => {
    renderResults(entries);
  });
}

async function loadEntries() {
  const localEntries = getSavedEntries();

  if (!GOOGLE_SHEET_WEB_APP_URL) {
    return localEntries;
  }

  try {
    const sheetEntries = await loadSheetJsonp(GOOGLE_SHEET_WEB_APP_URL);
    return Array.isArray(sheetEntries) ? sheetEntries : localEntries;
  } catch (error) {
    console.error(error);
    return localEntries;
  }
}

function loadSheetJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `uotechFifaPoll_${Date.now()}`;
    const separator = url.includes("?") ? "&" : "?";
    const script = document.createElement("script");

    window[callbackName] = (data) => {
      resolve(data);
      delete window[callbackName];
      script.remove();
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Could not load sheet data."));
    };

    script.src = `${url}${separator}callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

function renderResults(entries) {
  const normalized = entries.map(normalizeEntry);

  const semiCounts = countList(normalized.flatMap((entry) => entry.semi_final_teams));
  const finalCounts = countList(normalized.flatMap((entry) => entry.final_teams));
  const winnerCounts = countList(normalized.map((entry) => entry.winner_team).filter(Boolean));
  const fanCounts = countList(normalized.map((entry) => entry.fan_team).filter(Boolean));

  setText("totalEntries", normalized.length.toString());
  setText("topWinner", getTopLabel(winnerCounts));
  setText("topFan", getTopLabel(fanCounts));

  renderChart("semiChart", semiCounts);
  renderChart("finalChart", finalCounts);
  renderChart("winnerChart", winnerCounts);
  renderChart("fanChart", fanCounts);
}

function renderChart(id, counts) {
  const chart = document.getElementById(id);
  if (!chart) return;

  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(1, ...rows.map((row) => row[1]));

  if (!rows.length) {
    chart.innerHTML = `<p class="empty-state">No poll data available yet.</p>`;
    return;
  }

  chart.innerHTML = rows.map(([team, value]) => {
    const width = Math.max(6, Math.round((value / max) * 100));
    return `
      <div class="bar-row">
        <span class="bar-label">${team}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
        <span class="bar-value">${value}</span>
      </div>
    `;
  }).join("");
}

function saveEntry(entry) {
  const entries = getSavedEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getSavedEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function normalizeEntry(entry) {
  return {
    semi_final_teams: toArray(entry.semi_final_teams),
    final_teams: toArray(entry.final_teams),
    winner_team: Array.isArray(entry.winner_team) ? entry.winner_team[0] : entry.winner_team,
    fan_team: Array.isArray(entry.fan_team) ? entry.fan_team[0] : entry.fan_team
  };
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function countList(list) {
  return list.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function getTopLabel(counts) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return rows.length ? rows[0][0] : "No data";
}

function showMessage(message, isError = false, isSuccess = false) {
  const element = document.getElementById("formMessage");
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("error", isError);
  element.classList.toggle("success", isSuccess);
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}
