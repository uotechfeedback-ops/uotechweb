const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxL3i2RthG2fHMAzf9IjEp_gf9SltFPcAG1I-OpjotXiQ_XEas-XmAIgmps3fKWlkfI/exec";
const STORAGE_KEY = "uotech_fifa_poll_entries";
const LIVE_REFRESH_MS = 6000;

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

const searchState = {
  semi: "",
  final: "",
  winner: "",
  fan: ""
};

const chartSearchState = {};
let liveRefreshTimer = null;
let lastResultsSignature = "";
let chartResizeTimer = null;

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
  bindTeamSearch();

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

  const query = searchState[type].trim().toLowerCase();
  const visibleTeams = teams.filter((team) => {
    return !query
      || team.name.toLowerCase().includes(query)
      || team.code.toLowerCase().includes(query)
      || team.region.toLowerCase().includes(query);
  });

  if (!visibleTeams.length) {
    grid.innerHTML = `<p class="empty-state">No matching teams found.</p>`;
    return;
  }

  visibleTeams.forEach((team) => {
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

function bindTeamSearch() {
  document.querySelectorAll("[data-search-type]").forEach((input) => {
    input.addEventListener("input", () => {
      searchState[input.dataset.searchType] = input.value;
      renderAllGrids();
    });
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

    if (GOOGLE_SHEET_WEB_APP_URL) {
      clearSavedEntries();
    } else {
      saveEntry(entry);
    }
    notifyPollChanged();
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
  bindChartSearch();
  refreshResults(true);

  liveRefreshTimer = window.setInterval(() => refreshResults(false), LIVE_REFRESH_MS);

  window.addEventListener("resize", () => {
    window.clearTimeout(chartResizeTimer);
    chartResizeTimer = window.setTimeout(() => renderResultsFromCurrentData(), 160);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) refreshResults(true);
  });

  window.addEventListener("uotechPollChanged", () => refreshResults(true));
}

async function loadEntries() {
  const localEntries = getSavedEntries();

  if (!GOOGLE_SHEET_WEB_APP_URL) {
    return localEntries;
  }

  try {
    const sheetEntries = await loadSheetJsonp(GOOGLE_SHEET_WEB_APP_URL);
    const rows = extractRows(sheetEntries);
    clearSavedEntries();
    return rows;
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

async function refreshResults(forceRender = false) {
  const entries = await loadEntries();
  const normalized = entries.map(normalizeEntry).filter(hasPollData);
  const signature = JSON.stringify(normalized);

  if (!forceRender && signature === lastResultsSignature) return;

  lastResultsSignature = signature;
  renderResults(normalized);
  updateDataNote(normalized.length);
}

function renderResults(normalized) {
  window.currentPollResults = normalized;
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

  const query = (chartSearchState[id] || "").trim().toLowerCase();
  const rows = Object.entries(counts)
    .filter(([team]) => !query || team.toLowerCase().includes(query))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(1, ...rows.map((row) => row[1]));

  if (!rows.length) {
    chart.innerHTML = `<p class="empty-state">${query ? "No matching teams found." : "No poll data available yet."}</p>`;
    return;
  }

  chart.innerHTML = `
    <div class="chart-canvases">
      <canvas class="poll-canvas bar-canvas" aria-label="Bar chart"></canvas>
      <canvas class="poll-canvas pie-canvas" aria-label="Pie chart"></canvas>
    </div>
    <div class="chart-table" aria-label="Poll result values"></div>
  `;

  drawBarChart(chart.querySelector(".bar-canvas"), rows);
  drawPieChart(chart.querySelector(".pie-canvas"), rows);

  chart.querySelector(".chart-table").innerHTML = rows.map(([team, value]) => {
    const width = Math.max(6, Math.round((value / max) * 100));
    return `
      <div class="bar-row">
        <span class="bar-label">${escapeHtml(team)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
        <span class="bar-value">${value}</span>
      </div>
    `;
  }).join("");
}

function renderResultsFromCurrentData() {
  if (Array.isArray(window.currentPollResults)) {
    renderResults(window.currentPollResults);
  }
}

function drawBarChart(canvas, rows) {
  const ctx = prepareCanvas(canvas, 560, 300);
  if (!ctx) return;

  const width = canvas.renderWidth || canvas.width;
  const height = canvas.renderHeight || canvas.height;
  const padding = { top: 24, right: 22, bottom: 58, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const max = Math.max(1, ...rows.map((row) => row[1]));
  const barGap = rows.length > 8 ? 7 : 10;
  const barWidth = Math.max(14, (chartWidth - barGap * (rows.length - 1)) / rows.length);

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + chartHeight - (chartHeight * i / 4);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  rows.forEach(([team, value], index) => {
    const x = padding.left + index * (barWidth + barGap);
    const barHeight = Math.max(5, (value / max) * chartHeight);
    const y = padding.top + chartHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, padding.top + chartHeight);

    gradient.addColorStop(0, "#f8c846");
    gradient.addColorStop(0.52, "#b9f346");
    gradient.addColorStop(1, "#14b86a");

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, barWidth, barHeight, 8);
    ctx.fill();

    ctx.fillStyle = "#f8c846";
    ctx.font = "700 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value, x + barWidth / 2, y - 8);

    ctx.save();
    ctx.translate(x + barWidth / 2, height - 45);
    ctx.rotate(-Math.PI / 5);
    ctx.fillStyle = "#dce9e2";
    ctx.font = "700 13px Arial";
    ctx.textAlign = "right";
    ctx.fillText(fitCanvasText(ctx, team, 96), 0, 0);
    ctx.restore();
  });
}

function drawPieChart(canvas, rows) {
  const ctx = prepareCanvas(canvas, 360, 300);
  if (!ctx) return;

  const width = canvas.renderWidth || canvas.width;
  const height = canvas.renderHeight || canvas.height;
  const total = rows.reduce((sum, row) => sum + row[1], 0);
  const colors = ["#f8c846", "#14b86a", "#4fc3f7", "#ff7369", "#b9f346", "#b388ff", "#ff9f43", "#60e6c5"];
  const radius = Math.min(width, height) * 0.31;
  const cx = width * 0.34;
  const cy = height * 0.48;
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, width, height);

  rows.forEach(([, value], index) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    start += angle;
  });

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.56, 0, Math.PI * 2);
  ctx.fillStyle = "#07120f";
  ctx.fill();

  ctx.fillStyle = "#f6fff9";
  ctx.font = "900 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText(total, cx, cy + 8);

  rows.slice(0, 6).forEach(([team, value], index) => {
    const y = 54 + index * 31;
    const percent = Math.round((value / total) * 100);

    ctx.fillStyle = colors[index % colors.length];
    roundRect(ctx, width * 0.66, y - 13, 18, 18, 5);
    ctx.fill();

    ctx.fillStyle = "#dce9e2";
    ctx.font = "700 13px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`${fitCanvasText(ctx, team, width * 0.3)} ${percent}%`, width * 0.66 + 28, y + 1);
  });
}

function fitCanvasText(ctx, text, maxWidth) {
  const value = String(text || "");
  if (ctx.measureText(value).width <= maxWidth) return value;

  let trimmed = value;
  while (trimmed.length > 1 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }

  return `${trimmed.trim()}...`;
}

function prepareCanvas(canvas, defaultWidth, defaultHeight) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(230, Math.round(rect.width || defaultWidth));
  const height = Math.max(240, Math.round(rect.height || defaultHeight));

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.renderWidth = width;
  canvas.renderHeight = height;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function bindChartSearch() {
  document.querySelectorAll("[data-chart-search]").forEach((input) => {
    chartSearchState[input.dataset.chartSearch] = "";
    input.addEventListener("input", () => {
      chartSearchState[input.dataset.chartSearch] = input.value;
      refreshResults(true);
    });
  });
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

function clearSavedEntries() {
  localStorage.removeItem(STORAGE_KEY);
}

function normalizeEntry(entry) {
  const row = normalizeKeys(entry || {});

  return {
    timestamp: pickValue(row, ["timestamp", "time", "date"]),
    student_name: pickValue(row, ["student_name", "studentname", "name"]),
    mobile_number: pickValue(row, ["mobile_number", "mobilenumber", "mobile", "phone"]),
    semi_final_teams: toArray(pickValue(row, ["semi_final_teams", "semifinalteams", "semi_final", "semifinal", "semi"])),
    final_teams: toArray(pickValue(row, ["final_teams", "finalteams", "final"])),
    winner_team: firstValue(pickValue(row, ["winner_team", "winnerteam", "winner", "champion"])),
    fan_team: firstValue(pickValue(row, ["fan_team", "fanteam", "fan", "support_team", "supportteam"]))
  };
}

function toArray(value) {
  if (Array.isArray(value)) return value.map(cleanTeamName).filter(Boolean);
  if (!value) return [];

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(cleanTeamName).filter(Boolean);
  } catch (error) {
    // Sheet data may be plain comma text, so JSON parsing is only a convenience.
  }

  return text.split(/[,;|]/).map(cleanTeamName).filter(Boolean);
}

function countList(list) {
  return list.reduce((acc, item) => {
    const key = cleanTeamName(item);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
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

function extractRows(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.rows)) return data.rows;
  if (Array.isArray(data.entries)) return data.entries;
  if (Array.isArray(data.values)) return sheetValuesToObjects(data.values);

  return [];
}

function sheetValuesToObjects(values) {
  if (!Array.isArray(values) || values.length < 2) return [];

  const headers = values[0].map((header) => String(header || ""));
  return values.slice(1).map((row) => {
    return headers.reduce((entry, header, index) => {
      entry[header] = row[index];
      return entry;
    }, {});
  });
}

function normalizeKeys(entry) {
  return Object.entries(entry).reduce((acc, [key, value]) => {
    const normalizedKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
    acc[normalizedKey] = value;
    return acc;
  }, {});
}

function pickValue(entry, keys) {
  for (const key of keys) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (entry[normalizedKey] !== undefined && entry[normalizedKey] !== "") {
      return entry[normalizedKey];
    }
  }

  return "";
}

function firstValue(value) {
  return cleanTeamName(Array.isArray(value) ? value[0] : value);
}

function hasPollData(entry) {
  return entry.semi_final_teams.length
    || entry.final_teams.length
    || entry.winner_team
    || entry.fan_team;
}

function cleanTeamName(value) {
  return String(value || "")
    .trim()
    .replace(/^["'\[\]]+|["'\[\]]+$/g, "")
    .replace(/\s+/g, " ");
}

function mergeEntries(localEntries, sheetEntries) {
  const merged = [];
  const seen = new Set();

  [...sheetEntries, ...localEntries].forEach((entry) => {
    const normalized = normalizeEntry(entry);
    const signature = [
      normalized.timestamp,
      normalized.student_name,
      normalized.mobile_number,
      normalized.semi_final_teams.join("|"),
      normalized.final_teams.join("|"),
      normalized.winner_team,
      normalized.fan_team
    ].join("::");

    if (!seen.has(signature)) {
      seen.add(signature);
      merged.push(entry);
    }
  });

  return merged;
}



function notifyPollChanged() {
  window.dispatchEvent(new CustomEvent("uotechPollChanged"));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
