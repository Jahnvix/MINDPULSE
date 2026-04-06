
const SCALE = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const QUESTIONS = [
  {
    id: "interest",
    text: "Little interest or pleasure in doing things.",
    short: "Low interest",
    domain: "Mood",
    weight: 1.2,
    direction: 1,
  },
  {
    id: "hopeless",
    text: "Feeling down, depressed, or hopeless.",
    short: "Low mood",
    domain: "Mood",
    weight: 1.4,
    direction: 1,
  },
  {
    id: "anxious",
    text: "Feeling nervous, anxious, or on edge.",
    short: "Anxiety",
    domain: "Anxiety",
    weight: 1.3,
    direction: 1,
  },
  {
    id: "worry",
    text: "Not being able to stop or control worrying.",
    short: "Uncontrolled worry",
    domain: "Anxiety",
    weight: 1.2,
    direction: 1,
  },
  {
    id: "sleep",
    text: "Trouble falling or staying asleep.",
    short: "Sleep disruption",
    domain: "Sleep",
    weight: 1.1,
    direction: 1,
  },
  {
    id: "energy",
    text: "Feeling tired or having little energy.",
    short: "Low energy",
    domain: "Energy",
    weight: 1.0,
    direction: 1,
  },
  {
    id: "focus",
    text: "Difficulty concentrating on tasks.",
    short: "Low focus",
    domain: "Cognition",
    weight: 1.0,
    direction: 1,
  },
  {
    id: "stress",
    text: "Feeling overwhelmed by responsibilities or stress.",
    short: "High stress",
    domain: "Stress",
    weight: 1.2,
    direction: 1,
  },
  {
    id: "support",
    text: "I felt supported by people around me.",
    short: "Support network",
    domain: "Support",
    weight: 1.1,
    direction: -1,
  },
  {
    id: "restore",
    text: "I made time for restorative activities (movement, rest, nature).",
    short: "Restorative activity",
    domain: "Protective",
    weight: 1.0,
    direction: -1,
  },
  {
    id: "substance",
    text: "I used alcohol or substances to cope with feelings.",
    short: "Substance coping",
    domain: "Coping",
    weight: 1.2,
    direction: 1,
  },
  {
    id: "selfharm",
    text: "Thoughts of self-harm or being better off gone.",
    short: "Self-harm thoughts",
    domain: "Safety",
    weight: 2.4,
    direction: 1,
  },
];

const SAMPLE_RESPONSES = {
  interest: 2,
  hopeless: 2,
  anxious: 3,
  worry: 2,
  sleep: 2,
  energy: 2,
  focus: 1,
  stress: 2,
  support: 1,
  restore: 1,
  substance: 1,
  selfharm: 0,
};

const SAMPLE_BATCH = [
  {
    respondent_id: "A-001",
    interest: 1,
    hopeless: 1,
    anxious: 1,
    worry: 1,
    sleep: 0,
    energy: 1,
    focus: 0,
    stress: 1,
    support: 2,
    restore: 2,
    substance: 0,
    selfharm: 0,
  },
  {
    respondent_id: "A-002",
    interest: 2,
    hopeless: 2,
    anxious: 2,
    worry: 2,
    sleep: 2,
    energy: 2,
    focus: 2,
    stress: 2,
    support: 1,
    restore: 1,
    substance: 1,
    selfharm: 0,
  },
  {
    respondent_id: "A-003",
    interest: 3,
    hopeless: 3,
    anxious: 3,
    worry: 3,
    sleep: 3,
    energy: 2,
    focus: 2,
    stress: 3,
    support: 0,
    restore: 0,
    substance: 2,
    selfharm: 2,
  },
  {
    respondent_id: "B-110",
    interest: 0,
    hopeless: 0,
    anxious: 1,
    worry: 0,
    sleep: 1,
    energy: 0,
    focus: 1,
    stress: 1,
    support: 3,
    restore: 2,
    substance: 0,
    selfharm: 0,
  },
  {
    respondent_id: "B-111",
    interest: 2,
    hopeless: 1,
    anxious: 2,
    worry: 2,
    sleep: 2,
    energy: 1,
    focus: 2,
    stress: 2,
    support: 1,
    restore: 1,
    substance: 2,
    selfharm: 1,
  },
];

const BASELINE = -1.1;
const MIN_RESPONSES = 6;
const SCALE_LABEL_MAP = new Map(
  SCALE.map((option) => [option.label.toLowerCase(), option.value])
);

const responses = new Map();
let batchRows = [];
let batchResults = [];
let scoringToken = 0;

const apiState = {
  enabled: false,
  endpoint: "",
  batchEndpoint: "",
  apiKey: "",
};

const questionListEl = document.getElementById("questionList");
const progressFillEl = document.getElementById("progressFill");
const progressTextEl = document.getElementById("progressText");
const progressCaptionEl = document.getElementById("progressCaption");
const answeredMetricEl = document.getElementById("answeredMetric");
const dataQualityEl = document.getElementById("dataQuality");
const confidenceMetricEl = document.getElementById("confidenceMetric");
const riskLevelEl = document.getElementById("riskLevel");
const riskBadgeEl = document.getElementById("riskBadge");
const riskScoreEl = document.getElementById("riskScore");
const confidenceScoreEl = document.getElementById("confidenceScore");
const riskGaugeEl = document.getElementById("riskGauge");
const riskInsightEl = document.getElementById("riskInsight");
const safetyAlertEl = document.getElementById("safetyAlert");
const riskDriversEl = document.getElementById("riskDrivers");
const protectiveFactorsEl = document.getElementById("protectiveFactors");
const dataTableEl = document.getElementById("dataTable");
const modelFactorsEl = document.getElementById("modelFactors");
const lastUpdatedEl = document.getElementById("lastUpdated");
const resultCardEl = document.getElementById("resultCard");

const assessBtn = document.getElementById("assessBtn");
const sampleBtn = document.getElementById("sampleBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const importCsvBtn = document.getElementById("importCsvBtn");
const importCsvInput = document.getElementById("importCsvInput");
const sampleBatchBtn = document.getElementById("sampleBatchBtn");
const importBatchBtn = document.getElementById("importBatchBtn");
const exportBatchBtn = document.getElementById("exportBatchBtn");
const batchSummaryEl = document.getElementById("batchSummary");
const batchTableEl = document.getElementById("batchTable");
const batchTotalEl = document.getElementById("batchTotal");
const batchAverageEl = document.getElementById("batchAverage");
const batchHighEl = document.getElementById("batchHigh");
const batchFlagsEl = document.getElementById("batchFlags");

const apiToggleEl = document.getElementById("apiToggle");
const apiEndpointEl = document.getElementById("apiEndpoint");
const batchEndpointEl = document.getElementById("batchEndpoint");
const apiKeyEl = document.getElementById("apiKey");
const apiStatusEl = document.getElementById("apiStatus");
const weightEditorEl = document.getElementById("weightEditor");
const recalcBatchBtn = document.getElementById("recalcBatchBtn");
assessBtn.addEventListener("click", () => {
  updateAssessment();
  resultCardEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

sampleBtn.addEventListener("click", () => {
  Object.entries(SAMPLE_RESPONSES).forEach(([id, value]) => {
    responses.set(id, value);
  });
  syncSelections();
  updateAssessment();
  resultCardEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

resetBtn.addEventListener("click", () => {
  responses.clear();
  syncSelections();
  updateAssessment();
});

downloadBtn.addEventListener("click", () => {
  const report = buildReport();
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mindpulse-risk-assessment.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

exportCsvBtn.addEventListener("click", () => {
  const header = ["respondent_id", ...QUESTIONS.map((q) => q.id)];
  const row = ["current", ...QUESTIONS.map((q) => responses.get(q.id) ?? "")];
  downloadCsv("mindpulse-current-response.csv", [header, row]);
});

exportPdfBtn.addEventListener("click", async () => {
  if (responses.size === 0) {
    riskInsightEl.textContent =
      "Add responses before exporting a clinician report.";
    return;
  }
  exportPdfBtn.disabled = true;
  const previousText = exportPdfBtn.textContent;
  exportPdfBtn.textContent = "Preparing...";
  const assessment = await scoreAssessmentForMap(responses, "current");
  openPrintWindow(buildPrintableReport(assessment));
  exportPdfBtn.textContent = previousText;
  exportPdfBtn.disabled = false;
});

const triggerCsvImport = () => importCsvInput.click();
importCsvBtn.addEventListener("click", triggerCsvImport);
importBatchBtn.addEventListener("click", triggerCsvImport);

importCsvInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    const rows = buildBatchRowsFromCsv(text);
    runBatchScoring(rows);
  };
  reader.readAsText(file);
  event.target.value = "";
});

sampleBatchBtn.addEventListener("click", () => {
  const rows = SAMPLE_BATCH.map((row) => ({
    id: row.respondent_id,
    responses: buildResponseMap(row),
  }));
  runBatchScoring(rows);
});

exportBatchBtn.addEventListener("click", () => {
  if (batchResults.length === 0) return;
  const header = [
    "respondent_id",
    "completion",
    "probability",
    "level",
    "confidence",
    "selfharm_flag",
    "source",
  ];
  const rows = batchResults.map((item) => [
    item.respondentId,
    item.completion.toFixed(2),
    item.probability === null ? "" : item.probability.toFixed(4),
    item.level ?? "",
    item.confidence ?? "",
    item.selfHarmValue >= 1 ? "yes" : "no",
    item.source,
  ]);
  downloadCsv("mindpulse-batch-results.csv", [header, ...rows]);
});

apiToggleEl.addEventListener("change", () => {
  apiState.enabled = apiToggleEl.checked;
  updateApiStatus();
  updateAssessment();
});

apiEndpointEl.addEventListener("input", () => {
  apiState.endpoint = apiEndpointEl.value.trim();
  updateApiStatus();
});

batchEndpointEl.addEventListener("input", () => {
  apiState.batchEndpoint = batchEndpointEl.value.trim();
  updateApiStatus();
});

apiKeyEl.addEventListener("input", () => {
  apiState.apiKey = apiKeyEl.value.trim();
  updateApiStatus();
});

recalcBatchBtn.addEventListener("click", () => {
  if (batchRows.length === 0) {
    batchSummaryEl.textContent = "No batch loaded yet.";
    return;
  }
  runBatchScoring(batchRows, { preserveRows: true });
});

function renderQuestions() {
  questionListEl.innerHTML = "";
  QUESTIONS.forEach((question, index) => {
    const card = document.createElement("div");
    card.className = "question";
    card.dataset.id = question.id;

    const head = document.createElement("div");
    head.className = "question-head";

    const meta = document.createElement("div");

    const indexEl = document.createElement("div");
    indexEl.className = "question-index";
    indexEl.textContent = `Question ${index + 1}`;

    const textEl = document.createElement("div");
    textEl.className = "question-text";
    textEl.textContent = question.text;

    meta.appendChild(indexEl);
    meta.appendChild(textEl);

    const domain = document.createElement("div");
    domain.className = "question-domain";
    domain.textContent = question.domain;

    head.appendChild(meta);
    head.appendChild(domain);

    const scale = document.createElement("div");
    scale.className = "scale";

    SCALE.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.dataset.value = option.value;
      button.textContent = option.label;
      button.setAttribute("aria-pressed", "false");
      scale.appendChild(button);
    });

    card.appendChild(head);
    card.appendChild(scale);
    questionListEl.appendChild(card);
  });
}

function renderWeightEditor() {
  weightEditorEl.innerHTML = "";
  QUESTIONS.forEach((question) => {
    const row = document.createElement("div");
    row.className = "weight-row";
    row.dataset.id = question.id;

    const label = document.createElement("div");
    label.innerHTML = `
      <div class="weight-title">${question.short}</div>
      <div class="weight-sub">${question.text}</div>
    `;

    const domainInput = document.createElement("input");
    domainInput.type = "text";
    domainInput.value = question.domain;

    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.step = "0.1";
    weightInput.value = question.weight.toFixed(1);

    const directionSelect = document.createElement("select");
    directionSelect.innerHTML = `
      <option value="1">Risk</option>
      <option value="-1">Protective</option>
    `;
    directionSelect.value = String(question.direction);

    domainInput.addEventListener("input", () => {
      const next = domainInput.value.trim();
      question.domain = next || "Other";
      refreshQuestionnaire();
      renderModelFactors();
    });

    weightInput.addEventListener("input", () => {
      const next = Number(weightInput.value);
      question.weight = Number.isNaN(next) ? question.weight : Math.max(0, next);
      renderModelFactors();
      updateAssessment();
    });

    directionSelect.addEventListener("change", () => {
      question.direction = Number(directionSelect.value) === -1 ? -1 : 1;
      renderModelFactors();
      updateAssessment();
    });

    row.appendChild(label);
    row.appendChild(domainInput);
    row.appendChild(weightInput);
    row.appendChild(directionSelect);
    weightEditorEl.appendChild(row);
  });
}

function refreshQuestionnaire() {
  renderQuestions();
  syncSelections();
}

function syncSelections() {
  document.querySelectorAll(".question").forEach((card) => {
    const id = card.dataset.id;
    const value = responses.get(id);
    card.querySelectorAll(".option").forEach((button) => {
      const isSelected =
        value !== undefined && Number(button.dataset.value) === value;
      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  });
}

questionListEl.addEventListener("click", (event) => {
  const button = event.target.closest(".option");
  if (!button) return;
  const questionCard = button.closest(".question");
  if (!questionCard) return;

  const id = questionCard.dataset.id;
  const value = Number(button.dataset.value);
  responses.set(id, value);
  syncSelections();
  updateAssessment();
});
function computeConfidence(completion, values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    values.length;
  const diversity = Math.min(1, variance / 1.5);
  let confidence = 50 + completion * 35 + diversity * 15;
  if (completion < 0.5) {
    confidence -= 8;
  }
  return Math.max(30, Math.min(95, Math.round(confidence)));
}

function calculateAssessmentLocalFor(responseMap) {
  const answered = responseMap.size;
  const completion = answered / QUESTIONS.length;
  if (answered === 0) {
    return { status: "empty", completion };
  }

  let score = BASELINE;
  const contributions = [];
  const values = [];

  QUESTIONS.forEach((question) => {
    const value = responseMap.get(question.id);
    if (value === undefined) return;
    const normalized = value / 3;
    const contribution = question.weight * question.direction * normalized;
    score += contribution;
    values.push(value);
    contributions.push({
      id: question.id,
      label: question.short,
      value,
      contribution,
      direction: question.direction,
      domain: question.domain,
    });
  });

  const adjustedScore = score * (0.65 + completion * 0.35);
  const probability = 1 / (1 + Math.exp(-adjustedScore));
  let level =
    probability < 0.33 ? "Low" : probability < 0.66 ? "Moderate" : "High";

  const selfHarmValue = responseMap.get("selfharm");
  if (selfHarmValue >= 2) {
    level = "High";
  } else if (selfHarmValue === 1 && level === "Low") {
    level = "Moderate";
  }

  const confidence = computeConfidence(completion, values);

  return {
    status: "ready",
    completion,
    probability,
    level,
    confidence,
    contributions,
    values,
    selfHarmValue: selfHarmValue ?? 0,
    source: "local",
  };
}

async function scoreAssessmentForMap(responseMap, respondentId) {
  const local = calculateAssessmentLocalFor(responseMap);
  if (!apiState.enabled || !apiState.endpoint || local.status === "empty") {
    return { ...local, respondentId, source: "local" };
  }

  try {
    updateApiStatus("Scoring via API...");
    const payload = buildApiPayload(responseMap, respondentId);
    const apiResult = await callApi(apiState.endpoint, payload);
    const merged = mergeApiAssessment(local, apiResult);
    merged.respondentId = respondentId;
    updateApiStatus("API scoring active.");
    return merged;
  } catch (error) {
    updateApiStatus("API unavailable, using local scoring.");
    return { ...local, respondentId, source: "local" };
  }
}

async function updateAssessment() {
  const token = (scoringToken += 1);
  const local = calculateAssessmentLocalFor(responses);
  updateProgress(local.completion || 0);

  if (local.status === "empty") {
    riskLevelEl.textContent = "Complete the questionnaire";
    riskBadgeEl.textContent = "Awaiting data";
    riskBadgeEl.className = "risk-badge neutral";
    riskScoreEl.textContent = "--";
    confidenceScoreEl.textContent = "--";
    confidenceMetricEl.textContent = "--";
    riskGaugeEl.style.width = "0%";
    riskInsightEl.textContent = "Answer a few questions to see your assessment.";
    safetyAlertEl.classList.add("hidden");
    lastUpdatedEl.textContent = "Not updated yet.";
    renderFactors([], [], true);
    renderDataTable();
    return;
  }

  renderAssessment(local, { provisional: apiState.enabled && !!apiState.endpoint });

  if (apiState.enabled && apiState.endpoint) {
    const assessment = await scoreAssessmentForMap(responses, "current");
    if (token !== scoringToken) return;
    renderAssessment(assessment, { provisional: false });
  } else {
    updateApiStatus();
  }
}

function renderAssessment(assessment, options = {}) {
  const percent = Math.round((assessment.probability || 0) * 100);
  riskScoreEl.textContent = `${percent}%`;
  confidenceScoreEl.textContent = `${assessment.confidence || 0}%`;
  confidenceMetricEl.textContent = `${assessment.confidence || 0}%`;
  riskGaugeEl.style.width = `${percent}%`;

  riskLevelEl.textContent = `${assessment.level} risk signal`;
  riskBadgeEl.textContent = `${assessment.level} risk`;
  riskBadgeEl.className = `risk-badge ${assessment.level.toLowerCase()}`;

  let insight = buildInsight(assessment);
  if (options.provisional) {
    insight += " Local estimate shown while API scoring runs.";
  }
  if (assessment.notes) {
    insight += ` Note: ${assessment.notes}`;
  }

  riskInsightEl.textContent = insight;
  lastUpdatedEl.textContent = `Last updated ${new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} (${assessment.source} scoring)`;

  const driverData =
    assessment.driverTags || splitDrivers(assessment.contributions).drivers;
  const protectorData =
    assessment.protectorTags || splitDrivers(assessment.contributions).protectors;
  renderFactors(driverData, protectorData, false);
  renderDataTable();
  handleSafetyAlert(assessment);
}

function buildInsight(assessment) {
  if (assessment.completion < 0.5) {
    return "Add more answers to strengthen the estimate.";
  }
  if (assessment.level === "Low") {
    return "Current responses suggest a lower risk signal. Maintain routines and keep checking in.";
  }
  if (assessment.level === "Moderate") {
    return "Moderate risk signal. Consider reaching out to a trusted person and tracking changes.";
  }
  return "High risk signal. Consider professional support and prioritize safety planning.";
}

function splitDrivers(contributions) {
  const drivers = contributions
    .filter((item) => item.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 4);
  const protectors = contributions
    .filter((item) => item.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 4);
  return { drivers, protectors };
}

function renderFactors(drivers, protectors, isEmpty) {
  riskDriversEl.innerHTML = "";
  protectiveFactorsEl.innerHTML = "";

  if (isEmpty || drivers.length === 0) {
    const tag = document.createElement("div");
    tag.className = "tag muted";
    tag.textContent = "No contributing factors yet.";
    riskDriversEl.appendChild(tag);
  } else {
    drivers.forEach((item) => {
      const tag = document.createElement("div");
      tag.className = "tag";
      const label =
        item.value === undefined
          ? item.label
          : `${item.label} (${SCALE[item.value].label})`;
      tag.textContent = label;
      riskDriversEl.appendChild(tag);
    });
  }

  if (isEmpty || protectors.length === 0) {
    const tag = document.createElement("div");
    tag.className = "tag muted";
    tag.textContent = "No protective factors yet.";
    protectiveFactorsEl.appendChild(tag);
  } else {
    protectors.forEach((item) => {
      const tag = document.createElement("div");
      tag.className = "tag";
      const label =
        item.value === undefined
          ? item.label
          : `${item.label} (${SCALE[item.value].label})`;
      tag.textContent = label;
      protectiveFactorsEl.appendChild(tag);
    });
  }
}

function handleSafetyAlert(assessment) {
  if (assessment.selfHarmValue >= 1 || assessment.level === "High") {
    safetyAlertEl.textContent =
      "If you are in immediate danger or thinking about self-harm, contact local emergency services. In the US, call or text 988.";
    safetyAlertEl.classList.remove("hidden");
  } else {
    safetyAlertEl.classList.add("hidden");
  }
}

function renderDataTable() {
  dataTableEl.innerHTML = "";
  QUESTIONS.forEach((question) => {
    const value = responses.get(question.id);
    const row = document.createElement("tr");

    const signalCell = document.createElement("td");
    signalCell.textContent = question.short;

    const responseCell = document.createElement("td");
    responseCell.textContent =
      value === undefined ? "No response" : SCALE[value].label;

    const impactCell = document.createElement("td");
    if (value === undefined) {
      impactCell.textContent = "-";
    } else {
      const impact = question.weight * question.direction * (value / 3);
      const magnitude = Math.abs(impact).toFixed(2);
      impactCell.textContent =
        impact >= 0 ? `+${magnitude} risk` : `-${magnitude} protective`;
    }

    row.appendChild(signalCell);
    row.appendChild(responseCell);
    row.appendChild(impactCell);
    dataTableEl.appendChild(row);
  });
}

function buildReport() {
  const assessment = calculateAssessmentLocalFor(responses);
  const responsePayload = buildResponsePayload(responses);

  return {
    generatedAt: new Date().toISOString(),
    completion: assessment.completion ?? 0,
    risk: {
      probability: assessment.probability ?? null,
      level: assessment.level ?? null,
      confidence: assessment.confidence ?? null,
      source: assessment.source,
    },
    responses: responsePayload,
  };
}

function buildResponsePayload(responseMap) {
  const responsePayload = {};
  QUESTIONS.forEach((question) => {
    responsePayload[question.id] = responseMap.get(question.id) ?? null;
  });
  return responsePayload;
}

function updateProgress(completion) {
  const percent = Math.round(completion * 100);
  progressFillEl.style.width = `${percent}%`;
  progressTextEl.textContent = `${percent}% complete`;
  answeredMetricEl.textContent = `${responses.size}/${QUESTIONS.length}`;
  dataQualityEl.textContent = `${percent}%`;
  if (completion < 0.5) {
    progressCaptionEl.textContent =
      "Answer at least 6 questions to generate a signal.";
  } else {
    progressCaptionEl.textContent =
      "Signal stabilizes as more responses are added.";
  }
}

function renderModelFactors() {
  const domainWeights = new Map();
  QUESTIONS.forEach((question) => {
    const current = domainWeights.get(question.domain) || 0;
    domainWeights.set(question.domain, current + question.weight);
  });

  const maxWeight = Math.max(...domainWeights.values());
  modelFactorsEl.innerHTML = "";

  [...domainWeights.entries()].forEach(([domain, weight]) => {
    const row = document.createElement("div");
    row.className = "factor-row";

    const label = document.createElement("div");
    label.className = "factor-label";
    label.innerHTML = `<span>${domain}</span><span>${weight.toFixed(1)}</span>`;

    const bar = document.createElement("div");
    bar.className = "factor-bar";

    const fill = document.createElement("span");
    fill.style.width = `${(weight / maxWeight) * 100}%`;

    bar.appendChild(fill);
    row.appendChild(label);
    row.appendChild(bar);
    modelFactorsEl.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPercent(value) {
  if (value === null || value === undefined) return "--";
  return `${Math.round(value * 100)}%`;
}

function buildClinicianSummary(assessment) {
  const items = [];
  const completion = Math.round((assessment.completion || 0) * 100);
  items.push(
    `Risk signal: ${assessment.level} (${formatPercent(
      assessment.probability
    )}), confidence ${assessment.confidence || 0}%.`
  );
  if (completion < 50) {
    items.push(
      `Data completeness is ${completion}%. Consider collecting additional responses.`
    );
  } else {
    items.push(`Data completeness is ${completion}%.`);
  }
  if (assessment.selfHarmValue >= 1) {
    items.push(
      "Safety flag present: self-harm thoughts reported. Consider immediate safety planning."
    );
  }
  return items;
}

function buildPrintableReport(assessment) {
  const completion = Math.round((assessment.completion || 0) * 100);
  const driverData =
    assessment.driverTags || splitDrivers(assessment.contributions).drivers;
  const protectorData =
    assessment.protectorTags || splitDrivers(assessment.contributions).protectors;

  const driversHtml =
    driverData.length === 0
      ? "<li>None observed.</li>"
      : driverData
          .map((item) => `<li>${escapeHtml(item.label)}</li>`)
          .join("");

  const protectorsHtml =
    protectorData.length === 0
      ? "<li>None observed.</li>"
      : protectorData
          .map((item) => `<li>${escapeHtml(item.label)}</li>`)
          .join("");

  const responseRows = QUESTIONS.map((question) => {
    const value = responses.get(question.id);
    const responseLabel =
      value === undefined ? "No response" : SCALE[value].label;
    const impact =
      value === undefined
        ? "-"
        : question.weight * question.direction * (value / 3);
    const impactLabel =
      impact === "-"
        ? "-"
        : impact >= 0
        ? `+${Math.abs(impact).toFixed(2)} risk`
        : `-${Math.abs(impact).toFixed(2)} protective`;

    return `<tr>
      <td>${escapeHtml(question.short)}</td>
      <td>${escapeHtml(question.domain)}</td>
      <td>${escapeHtml(responseLabel)}</td>
      <td>${escapeHtml(impactLabel)}</td>
    </tr>`;
  }).join("");

  const summaryItems = buildClinicianSummary(assessment)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const safetyNote =
    assessment.selfHarmValue >= 1 || assessment.level === "High"
      ? "<div class=\"alert\">Safety note: If the respondent is in immediate danger or thinking about self-harm, contact local emergency services. In the US, call or text 988.</div>"
      : "";

  return `<!doctype html>
  <html lang=\"en\">
    <head>
      <meta charset=\"utf-8\" />
      <title>MindPulse Clinician Report</title>
      <style>
        :root {
          --ink: #1a2533;
          --muted: #5b6775;
          --border: #d7dde4;
          --accent: #f08a5d;
          --soft: #f4f6f8;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: \"Manrope\", Arial, sans-serif;
          color: var(--ink);
          background: #fff;
        }
        header {
          padding: 32px 40px 20px;
          border-bottom: 2px solid var(--border);
        }
        h1 {
          margin: 0 0 6px;
          font-family: \"Fraunces\", Georgia, serif;
          font-size: 28px;
        }
        .meta {
          color: var(--muted);
          font-size: 13px;
        }
        main {
          padding: 24px 40px 40px;
          display: grid;
          gap: 18px;
        }
        .card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          background: #fff;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .metric {
          display: grid;
          gap: 6px;
        }
        .metric strong {
          font-size: 20px;
        }
        ul {
          padding-left: 18px;
          margin: 8px 0 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th, td {
          border-bottom: 1px solid var(--border);
          text-align: left;
          padding: 8px 6px;
        }
        th {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
          color: var(--muted);
        }
        .pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--soft);
          font-size: 12px;
          font-weight: 600;
        }
        .alert {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #fdecee;
          color: #b33a45;
          font-weight: 600;
        }
        .disclaimer {
          font-size: 12px;
          color: var(--muted);
        }
        @media print {
          body { margin: 0; }
          header, main { padding-left: 24px; padding-right: 24px; }
          .card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <header>
        <h1>MindPulse Clinician Report</h1>
        <div class=\"meta\">Generated ${escapeHtml(
          new Date().toLocaleString()
        )} • Respondent: current</div>
      </header>
      <main>
        <section class=\"card\">
          <div class=\"grid\">
            <div class=\"metric\">
              <span class=\"pill\">Risk signal</span>
              <strong>${escapeHtml(assessment.level)} (${formatPercent(
    assessment.probability
  )})</strong>
              <div class=\"meta\">Confidence: ${assessment.confidence || 0}%</div>
            </div>
            <div class=\"metric\">
              <span class=\"pill\">Data completeness</span>
              <strong>${completion}%</strong>
              <div class=\"meta\">Answered ${responses.size} of ${
    QUESTIONS.length
  } questions</div>
            </div>
          </div>
          ${safetyNote}
        </section>
        <section class=\"card\">
          <h2>Clinician Summary</h2>
          <ul>${summaryItems}</ul>
        </section>
        <section class=\"card grid\">
          <div>
            <h2>Contributing factors</h2>
            <ul>${driversHtml}</ul>
          </div>
          <div>
            <h2>Protective factors</h2>
            <ul>${protectorsHtml}</ul>
          </div>
        </section>
        <section class=\"card\">
          <h2>Questionnaire Responses</h2>
          <table>
            <thead>
              <tr>
                <th>Signal</th>
                <th>Domain</th>
                <th>Response</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              ${responseRows}
            </tbody>
          </table>
        </section>
        <section class=\"card disclaimer\">
          This report is an educational screening summary and not a clinical diagnosis.
          Use clinical judgment and corroborating information when interpreting results.
        </section>
      </main>
    </body>
  </html>`;
}

function openPrintWindow(html) {
  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) {
    riskInsightEl.textContent =
      "Popup blocked. Allow popups to export a PDF report.";
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
  };
  setTimeout(() => {
    try {
      printWindow.print();
    } catch (error) {
      // Ignore printing errors.
    }
  }, 600);
}

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeResponseValue(raw) {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === "number") {
    if (Number.isNaN(raw)) return undefined;
    return Math.max(0, Math.min(3, Math.round(raw)));
  }

  const trimmed = String(raw).trim();
  if (!trimmed) return undefined;
  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric)) {
    return Math.max(0, Math.min(3, Math.round(numeric)));
  }
  const match = SCALE_LABEL_MAP.get(trimmed.toLowerCase());
  return match === undefined ? undefined : match;
}

function buildResponseMap(row) {
  const map = new Map();
  QUESTIONS.forEach((question) => {
    const raw = row[question.id];
    const value = normalizeResponseValue(raw);
    if (value !== undefined) {
      map.set(question.id, value);
    }
  });
  return map;
}
function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        value += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(value);
        value = "";
      } else if (char === "\n") {
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else if (char === "\r") {
        // Ignore carriage returns.
      } else {
        value += char;
      }
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((cells) =>
    cells.some((cell) => String(cell || "").trim() !== "")
  );
}

function buildBatchRowsFromCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    batchSummaryEl.textContent = "CSV file did not include any data rows.";
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  const normalizedHeaders = headers.map(normalizeHeader);
  const respondentIndex = normalizedHeaders.findIndex((header) =>
    ["respondentid", "respondent", "participantid", "id"].includes(header)
  );

  const questionIndexes = new Map();
  QUESTIONS.forEach((question) => {
    const normalized = normalizeHeader(question.id);
    const alternative = `q${normalized}`;
    const index = normalizedHeaders.findIndex(
      (header) => header === normalized || header === alternative
    );
    if (index !== -1) {
      questionIndexes.set(question.id, index);
    }
  });

  const batch = [];
  rows.slice(1).forEach((cells, rowIndex) => {
    const row = {};
    questionIndexes.forEach((index, id) => {
      row[id] = cells[index];
    });

    const responseMap = buildResponseMap(row);
    if (responseMap.size === 0) return;

    const respondentId =
      respondentIndex !== -1
        ? String(cells[respondentIndex] || "").trim() || `Row ${rowIndex + 1}`
        : `Row ${rowIndex + 1}`;

    batch.push({ id: respondentId, responses: responseMap });
  });

  if (batch.length === 0) {
    batchSummaryEl.textContent =
      "No usable responses found. Check that headers match question ids.";
  }

  return batch;
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function updateApiStatus(forced) {
  if (forced) {
    apiStatusEl.textContent = forced;
    return;
  }
  if (!apiState.enabled) {
    apiStatusEl.textContent = "Local scoring only.";
    return;
  }
  if (!apiState.endpoint) {
    apiStatusEl.textContent = "Add an endpoint to enable API scoring.";
    return;
  }
  apiStatusEl.textContent = "API scoring enabled.";
}

async function callApi(url, payload) {
  const headers = { "Content-Type": "application/json" };
  if (apiState.apiKey) {
    headers.Authorization = `Bearer ${apiState.apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("API scoring failed.");
  }

  return response.json();
}

function normalizeProbability(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  if (value > 1) {
    return Math.max(0, Math.min(1, value / 100));
  }
  return Math.max(0, Math.min(1, value));
}

function normalizeLevel(value, fallback) {
  if (!value) return fallback;
  const text = String(value).toLowerCase();
  if (text.startsWith("low")) return "Low";
  if (text.startsWith("mod")) return "Moderate";
  if (text.startsWith("high")) return "High";
  return fallback;
}

function normalizeConfidence(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value <= 1) {
    return Math.round(value * 100);
  }
  return Math.round(Math.max(0, Math.min(100, value)));
}

function normalizeTagList(list) {
  if (!Array.isArray(list)) return null;
  return list
    .map((item) => {
      if (typeof item === "string") {
        return { label: item };
      }
      if (item && typeof item === "object") {
        return {
          label: item.label || item.id || item.name || "Signal",
          value: item.value,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function mergeApiAssessment(local, apiResult) {
  if (!apiResult || typeof apiResult !== "object") {
    return { ...local, source: "local" };
  }

  const merged = { ...local, source: "api" };
  const probability = normalizeProbability(apiResult.probability);
  const confidence = normalizeConfidence(apiResult.confidence, merged.confidence);

  if (probability !== null) {
    merged.probability = probability;
  }
  merged.level = normalizeLevel(apiResult.level, merged.level);
  merged.confidence = confidence;

  if (apiResult.drivers) {
    merged.driverTags = normalizeTagList(apiResult.drivers);
  }
  if (apiResult.protectors) {
    merged.protectorTags = normalizeTagList(apiResult.protectors);
  }
  if (apiResult.notes) {
    merged.notes = apiResult.notes;
  }

  return merged;
}

function buildApiPayload(responseMap, respondentId) {
  return {
    respondentId,
    responses: buildResponsePayload(responseMap),
    questionnaire: QUESTIONS.map((question) => ({
      id: question.id,
      domain: question.domain,
      weight: question.weight,
      direction: question.direction,
    })),
    scale: SCALE,
  };
}

function buildBatchPayload(rows) {
  return {
    respondents: rows.map((row) => ({
      respondentId: row.id,
      responses: buildResponsePayload(row.responses),
    })),
    questionnaire: QUESTIONS.map((question) => ({
      id: question.id,
      domain: question.domain,
      weight: question.weight,
      direction: question.direction,
    })),
    scale: SCALE,
  };
}

async function runBatchScoring(rows, options = {}) {
  const preserveRows = options.preserveRows || false;
  if (!preserveRows) {
    batchRows = rows;
  }
  batchResults = [];

  if (!batchRows || batchRows.length === 0) {
    batchSummaryEl.textContent = "No batch loaded yet.";
    renderBatchResults([]);
    return;
  }

  batchSummaryEl.textContent = "Scoring batch...";
  exportBatchBtn.disabled = true;

  let results = [];

  if (apiState.enabled && apiState.batchEndpoint) {
    try {
      const payload = buildBatchPayload(batchRows);
      const apiResponse = await callApi(apiState.batchEndpoint, payload);
      results = mergeBatchApiResults(apiResponse);
    } catch (error) {
      updateApiStatus("Batch API failed, using local scoring.");
      results = await scoreBatchLocally();
    }
  } else if (apiState.enabled && apiState.endpoint) {
    results = [];
    for (const row of batchRows) {
      // Sequential to avoid overwhelming external APIs.
      // eslint-disable-next-line no-await-in-loop
      const scored = await scoreAssessmentForMap(row.responses, row.id);
      results.push(scored);
    }
  } else {
    results = await scoreBatchLocally();
  }

  batchResults = results;
  renderBatchResults(results);
  exportBatchBtn.disabled = batchResults.length === 0;
}

async function scoreBatchLocally() {
  return batchRows.map((row) => ({
    ...calculateAssessmentLocalFor(row.responses),
    respondentId: row.id,
    source: "local",
  }));
}

function mergeBatchApiResults(apiResponse) {
  const apiList = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse.results || [];

  const apiMap = new Map();
  apiList.forEach((item) => {
    if (!item) return;
    const id =
      item.respondentId || item.respondent_id || item.id || item.respondent;
    if (!id) return;
    apiMap.set(String(id), item);
  });

  return batchRows.map((row) => {
    const local = calculateAssessmentLocalFor(row.responses);
    const apiItem = apiMap.get(String(row.id));
    if (!apiItem) {
      return { ...local, respondentId: row.id, source: "local" };
    }
    const merged = mergeApiAssessment(local, apiItem);
    merged.respondentId = row.id;
    return merged;
  });
}

function renderBatchResults(results) {
  batchTableEl.innerHTML = "";

  if (!results || results.length === 0) {
    batchTotalEl.textContent = "0";
    batchAverageEl.textContent = "--";
    batchHighEl.textContent = "0";
    batchFlagsEl.textContent = "0";
    batchSummaryEl.textContent = "No batch loaded yet.";
    return;
  }

  const total = results.length;
  const avgProbability =
    results.reduce((sum, item) => sum + (item.probability || 0), 0) / total;
  const highCount = results.filter((item) => item.level === "High").length;
  const selfHarmCount = results.filter((item) => item.selfHarmValue >= 1).length;
  const incompleteCount = results.filter(
    (item) => item.completion < MIN_RESPONSES / QUESTIONS.length
  ).length;

  batchTotalEl.textContent = String(total);
  batchAverageEl.textContent = `${Math.round(avgProbability * 100)}%`;
  batchHighEl.textContent = String(highCount);
  batchFlagsEl.textContent = String(selfHarmCount);

  batchSummaryEl.textContent =
    incompleteCount > 0
      ? "Batch scored. Some responses are incomplete, review carefully."
      : "Batch scored successfully.";

  results.forEach((item) => {
    const row = document.createElement("tr");
    const completionCell = document.createElement("td");
    completionCell.textContent = `${Math.round(item.completion * 100)}%`;

    const riskCell = document.createElement("td");
    riskCell.textContent = `${Math.round((item.probability || 0) * 100)}%`;

    const levelCell = document.createElement("td");
    levelCell.textContent = item.level || "";

    const confidenceCell = document.createElement("td");
    confidenceCell.textContent = item.confidence ? `${item.confidence}%` : "";

    const sourceCell = document.createElement("td");
    sourceCell.textContent = item.source || "local";

    row.innerHTML = `<td>${item.respondentId}</td>`;
    row.appendChild(completionCell);
    row.appendChild(riskCell);
    row.appendChild(levelCell);
    row.appendChild(confidenceCell);
    row.appendChild(sourceCell);
    batchTableEl.appendChild(row);
  });
}

renderQuestions();
renderWeightEditor();
renderModelFactors();
updateAssessment();
updateApiStatus();
