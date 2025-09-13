// State management
let formData = {
  clientName: "",
  clientAddress: "",
  projectLocation: "",
  projectCoordinator: "",
  contractorName: "",
  contractorAddress: "",
  drillingLicense: "",
  drillingPermit: "",
  wrmaPermit: "",
  wrmaLicense: "",
  environmentalImpact: "",
  waterAllocation: "",
  wrmaCompliance: "",
  projectBackground: "",
  projectObjectives: "",
  methodology: "",
  boreholeCoordinates: "",
  groundElevation: "",
  totalDepth: "",
  drillingMethod: "",
  drillingStart: "",
  drillingEnd: "",
  drillingFluid: "",
  drillingRate: "",
  formationType: "",
  aquiferDepth: "",
  aquiferThickness: "",
  screenLength: "",
  geologicalLog: "",
  staticWaterLevel: "",
  dynamicWaterLevel: "",
  drawdown: "",
  yield: "",
  specificCapacity: "",
  pumpingTestDuration: "",
  ph: "",
  tds: "",
  ec: "",
  turbidity: "",
  chloride: "",
  fluoride: "",
  waterQualityRemarks: "",
  recommendations: "",
  conclusions: "",
  preparedBy: "",
  reportDate: "",
};

let casings = [];
let pumpingTestData = [];
let recoveryData = [];
let reportGenerated = false;
let pumpingTestChart = null;
let recoveryDataChart = null;
let reportPumpingTestChart = null;
let reportRecoveryDataChart = null;

// DOM elements
let activeTab = "client";

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  addInitialCasingRow();
  addInitialPumpingTestRow();
  addInitialRecoveryDataRow();

  // Set default report date to today
  document.getElementById("report-date").value = new Date()
    .toISOString()
    .split("T")[0];

  // Current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("show"));

    // Close mobile menu after clicking a link (optional)
    [...menu.querySelectorAll("a")].forEach((a) =>
      a.addEventListener("click", () => {
        if (menu.classList.contains("show")) menu.classList.remove("show");
      })
    );
  }
});

// Initialize event listeners
function initializeEventListeners() {
  // Tab navigation
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  // Form inputs
  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.name && formData.hasOwnProperty(this.name)) {
        formData[this.name] = this.value;
      }
    });
  });
}

// Tab management
function switchTab(tabName) {
  // Update active tab
  activeTab = tabName;

  // Update tab buttons
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

// Casing management
function addInitialCasingRow() {
  const initialCasing = {
    from: "",
    to: "",
    material: "",
    type: "",
    remarks: "",
  };
  casings.push(initialCasing);
  renderCasingTable();
}

function addCasingRow() {
  const newCasing = {
    from: "",
    to: "",
    material: "",
    type: "",
    remarks: "",
  };
  casings.push(newCasing);
  renderCasingTable();
}

function removeCasingRow(index) {
  if (casings.length > 1) {
    casings.splice(index, 1);
    renderCasingTable();
  }
}

function updateCasing(index, field, value) {
  if (casings[index]) {
    casings[index][field] = value;
  }
}

function renderCasingTable() {
  const tbody = document.getElementById("casing-tbody");
  tbody.innerHTML = "";

  casings.forEach((casing, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${casing.from}" 
                          onchange="updateCasing(${index}, 'from', this.value)"
                          placeholder="From depth"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${casing.to}" 
                          onchange="updateCasing(${index}, 'to', this.value)"
                          placeholder="To depth"
                      >
                  </td>
                  <td>
                      <input 
                          type="text" 
                          value="${casing.material}" 
                          onchange="updateCasing(${index}, 'material', this.value)"
                          placeholder="Material"
                      >
                  </td>
                  <td>
                      <input 
                          type="text" 
                          value="${casing.type}" 
                          onchange="updateCasing(${index}, 'type', this.value)"
                          placeholder="Type"
                      >
                  </td>
                  <td>
                      <input 
                          type="text" 
                          value="${casing.remarks}" 
                          onchange="updateCasing(${index}, 'remarks', this.value)"
                          placeholder="Remarks"
                      >
                  </td>
                  <td>
                      <button 
                          type="button" 
                          class="btn-remove" 
                          onclick="removeCasingRow(${index})"
                          ${casings.length <= 1 ? "disabled" : ""}
                      >
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </td>
              `;
    tbody.appendChild(row);
  });
}

// Pumping test data management
function addInitialPumpingTestRow() {
  const initialData = {
    time: "",
    waterLevel: "",
    drawdown: "",
    flowRate: "",
  };
  pumpingTestData.push(initialData);
  renderPumpingTestTable();
}

function addPumpingTestRow() {
  const newData = {
    time: "",
    waterLevel: "",
    drawdown: "",
    flowRate: "",
  };
  pumpingTestData.push(newData);
  renderPumpingTestTable();
}

function removePumpingTestRow(index) {
  if (pumpingTestData.length > 1) {
    pumpingTestData.splice(index, 1);
    renderPumpingTestTable();
    updatePumpingTestChart();
  }
}

function updatePumpingTestData(index, field, value) {
  if (pumpingTestData[index]) {
    pumpingTestData[index][field] = value;
    updatePumpingTestChart();
  }
}

function renderPumpingTestTable() {
  const tbody = document.getElementById("pumping-test-tbody");
  tbody.innerHTML = "";

  pumpingTestData.forEach((data, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                  <td>
                      <input 
                          type="number" 
                          step="0.1" 
                          value="${data.time}" 
                          onchange="updatePumpingTestData(${index}, 'time', this.value)"
                          placeholder="Time"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${data.waterLevel}" 
                          onchange="updatePumpingTestData(${index}, 'waterLevel', this.value)"
                          placeholder="Water Level"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${data.drawdown}" 
                          onchange="updatePumpingTestData(${index}, 'drawdown', this.value)"
                          placeholder="Drawdown"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${data.flowRate}" 
                          onchange="updatePumpingTestData(${index}, 'flowRate', this.value)"
                          placeholder="Flow Rate"
                      >
                  </td>
                  <td>
                      <button 
                          type="button" 
                          class="btn-remove" 
                          onclick="removePumpingTestRow(${index})"
                          ${pumpingTestData.length <= 1 ? "disabled" : ""}
                      >
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </td>
              `;
    tbody.appendChild(row);
  });
}

// Recovery data management
function addInitialRecoveryDataRow() {
  const initialData = {
    time: "",
    waterLevel: "",
    recovery: "",
  };
  recoveryData.push(initialData);
  renderRecoveryDataTable();
}

function addRecoveryDataRow() {
  const newData = {
    time: "",
    waterLevel: "",
    recovery: "",
  };
  recoveryData.push(newData);
  renderRecoveryDataTable();
}

function removeRecoveryDataRow(index) {
  if (recoveryData.length > 1) {
    recoveryData.splice(index, 1);
    renderRecoveryDataTable();
    updateRecoveryDataChart();
  }
}

function updateRecoveryData(index, field, value) {
  if (recoveryData[index]) {
    recoveryData[index][field] = value;
    updateRecoveryDataChart();
  }
}

function renderRecoveryDataTable() {
  const tbody = document.getElementById("recovery-data-tbody");
  tbody.innerHTML = "";

  recoveryData.forEach((data, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                  <td>
                      <input 
                          type="number" 
                          step="0.1" 
                          value="${data.time}" 
                          onchange="updateRecoveryData(${index}, 'time', this.value)"
                          placeholder="Time"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${data.waterLevel}" 
                          onchange="updateRecoveryData(${index}, 'waterLevel', this.value)"
                          placeholder="Water Level"
                      >
                  </td>
                  <td>
                      <input 
                          type="number" 
                          step="0.01" 
                          value="${data.recovery}" 
                          onchange="updateRecoveryData(${index}, 'recovery', this.value)"
                          placeholder="Recovery"
                      >
                  </td>
                  <td>
                      <button 
                          type="button" 
                          class="btn-remove" 
                          onclick="removeRecoveryDataRow(${index})"
                          ${recoveryData.length <= 1 ? "disabled" : ""}
                      >
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </td>
              `;
    tbody.appendChild(row);
  });
}

// Chart functions
function updatePumpingTestChart() {
  const ctx = document.getElementById("pumping-test-chart");
  if (!ctx) return;

  const validData = pumpingTestData.filter((d) => d.time && d.drawdown);

  if (pumpingTestChart) {
    pumpingTestChart.destroy();
  }

  pumpingTestChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: validData.map((d) => d.time),
      datasets: [
        {
          label: "Drawdown (m)",
          data: validData.map((d) => d.drawdown),
          borderColor: "#47B2E4",
          backgroundColor: "rgba(71, 178, 228, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (minutes)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Drawdown (m)",
          },
        },
      },
    },
  });
}

function updateRecoveryDataChart() {
  const ctx = document.getElementById("recovery-data-chart");
  if (!ctx) return;

  const validData = recoveryData.filter((d) => d.time && d.recovery);

  if (recoveryDataChart) {
    recoveryDataChart.destroy();
  }

  recoveryDataChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: validData.map((d) => d.time),
      datasets: [
        {
          label: "Recovery (m)",
          data: validData.map((d) => d.recovery),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (minutes)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Recovery (m)",
          },
        },
      },
    },
  });
}

// Create charts for report preview
function createReportCharts() {
  // Create pumping test chart in report
  const reportPumpingCtx = document.getElementById("report-pumping-test-chart");
  if (reportPumpingCtx) {
    const validPumpingData = pumpingTestData.filter(
      (d) => d.time && d.drawdown
    );

    if (reportPumpingTestChart) {
      reportPumpingTestChart.destroy();
    }

    reportPumpingTestChart = new Chart(reportPumpingCtx, {
      type: "line",
      data: {
        labels: validPumpingData.map((d) => d.time),
        datasets: [
          {
            label: "Drawdown (m)",
            data: validPumpingData.map((d) => d.drawdown),
            borderColor: "#47B2E4",
            backgroundColor: "rgba(71, 178, 228, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (minutes)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Drawdown (m)",
            },
          },
        },
      },
    });
  }

  // Create recovery data chart in report
  const reportRecoveryCtx = document.getElementById(
    "report-recovery-data-chart"
  );
  if (reportRecoveryCtx) {
    const validRecoveryData = recoveryData.filter((d) => d.time && d.recovery);

    if (reportRecoveryDataChart) {
      reportRecoveryDataChart.destroy();
    }

    reportRecoveryDataChart = new Chart(reportRecoveryCtx, {
      type: "line",
      data: {
        labels: validRecoveryData.map((d) => d.time),
        datasets: [
          {
            label: "Recovery (m)",
            data: validRecoveryData.map((d) => d.recovery),
            borderColor: "#16a34a",
            backgroundColor: "rgba(22, 163, 74, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (minutes)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Recovery (m)",
            },
          },
        },
      },
    });
  }
}

// Report generation
function generateReport() {
  // Update form data with current values
  updateFormDataFromInputs();

  // Generate report HTML
  const reportHTML = generateReportHTML();

  // Update preview
  const previewContent = document.getElementById("preview-content");
  previewContent.innerHTML = reportHTML;

  // Enable buttons
  document.getElementById("print-btn").disabled = false;
  document.getElementById("download-btn").disabled = false;

  // Initialize charts after a short delay to ensure DOM is ready
  setTimeout(() => {
    updatePumpingTestChart();
    updateRecoveryDataChart();
    createReportCharts();
  }, 100);

  reportGenerated = true;
}

function updateFormDataFromInputs() {
  document.querySelectorAll("input, textarea").forEach((input) => {
    if (input.name && formData.hasOwnProperty(input.name)) {
      formData[input.name] = input.value;
    }
  });
}

function generateReportHTML() {
  const casingTableRows = casings
    .map(
      (casing) =>
        `<tr>
                  <td>${casing.from || "-"}</td>
                  <td>${casing.to || "-"}</td>
                  <td>${casing.material || "-"}</td>
                  <td>${casing.type || "-"}</td>
                  <td>${casing.remarks || "-"}</td>
              </tr>`
    )
    .join("");

  const pumpingTestTableRows = pumpingTestData
    .map(
      (data) =>
        `<tr>
                  <td>${data.time || "-"}</td>
                  <td>${data.waterLevel || "-"}</td>
                  <td>${data.drawdown || "-"}</td>
                  <td>${data.flowRate || "-"}</td>
              </tr>`
    )
    .join("");

  const recoveryDataTableRows = recoveryData
    .map(
      (data) =>
        `<tr>
                  <td>${data.time || "-"}</td>
                  <td>${data.waterLevel || "-"}</td>
                  <td>${data.recovery || "-"}</td>
              </tr>`
    )
    .join("");

  // Check if there's valid data for charts
  const hasPumpingTestData = pumpingTestData.some((d) => d.time && d.drawdown);
  const hasRecoveryData = recoveryData.some((d) => d.time && d.recovery);

  return `
              <div class="report-document">
                  <div class="report-header-doc">
                      <h1 class="report-title-doc">BOREHOLE COMPLETION REPORT</h1>
                      <p><strong>Booker Investment Group Ltd</strong></p>
                      <p>Professional Water Well Drilling Services</p>
                  </div>
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">1. CLIENT INFORMATION</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">Client Name:</span>
                              <span>${formData.clientName || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Project Coordinator:</span>
                              <span>${
                                formData.projectCoordinator || "N/A"
                              }</span>
                          </div>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Client Address:</span>
                          <span>${formData.clientAddress || "N/A"}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Project Location:</span>
                          <span>${formData.projectLocation || "N/A"}</span>
                      </div>
                  </div>
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">2. CONTRACTOR INFORMATION</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">Contractor:</span>
                              <span>${formData.contractorName || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">License No:</span>
                              <span>${formData.drillingLicense || "N/A"}</span>
                          </div>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Address:</span>
                          <span>${formData.contractorAddress || "N/A"}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Permit No:</span>
                          <span>${formData.drillingPermit || "N/A"}</span>
                      </div>
                  </div>

                  <div class="report-section">
                      <h2 class="section-title-doc">3. WRMA COMPLIANCE</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">WRMA Permit:</span>
                              <span>${formData.wrmaPermit || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">WRMA License:</span>
                              <span>${formData.wrmaLicense || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Environmental Impact:</span>
                              <span>${
                                formData.environmentalImpact || "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Water Allocation:</span>
                              <span>${formData.waterAllocation || "N/A"}</span>
                          </div>
                      </div>
                      ${
                        formData.wrmaCompliance
                          ? `
                      <div class="mt-4">
                          <h3><strong>Compliance Notes:</strong></h3>
                          <p>${formData.wrmaCompliance}</p>
                      </div>`
                          : ""
                      }
                  </div>
                  
                  ${
                    formData.projectBackground ||
                    formData.projectObjectives ||
                    formData.methodology
                      ? `
                  <div class="report-section">
                      <h2 class="section-title-doc">4. PROJECT INTRODUCTION</h2>
                      ${
                        formData.projectBackground
                          ? `
                      <div class="mb-4">
                          <h3><strong>Background:</strong></h3>
                          <p>${formData.projectBackground}</p>
                      </div>`
                          : ""
                      }
                      ${
                        formData.projectObjectives
                          ? `
                      <div class="mb-4">
                          <h3><strong>Objectives:</strong></h3>
                          <p>${formData.projectObjectives}</p>
                      </div>`
                          : ""
                      }
                      ${
                        formData.methodology
                          ? `
                      <div class="mb-4">
                          <h3><strong>Methodology:</strong></h3>
                          <p>${formData.methodology}</p>
                      </div>`
                          : ""
                      }
                  </div>`
                      : ""
                  }
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">5. BOREHOLE DETAILS</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">GPS Coordinates:</span>
                              <span>${
                                formData.boreholeCoordinates || "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Ground Elevation:</span>
                              <span>${
                                formData.groundElevation
                                  ? formData.groundElevation + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Total Depth:</span>
                              <span>${
                                formData.totalDepth
                                  ? formData.totalDepth + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Drilling Method:</span>
                              <span>${formData.drillingMethod || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Start Date:</span>
                              <span>${
                                formData.drillingStart
                                  ? new Date(
                                      formData.drillingStart
                                    ).toLocaleDateString()
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">End Date:</span>
                              <span>${
                                formData.drillingEnd
                                  ? new Date(
                                      formData.drillingEnd
                                    ).toLocaleDateString()
                                  : "N/A"
                              }</span>
                          </div>
                      </div>
                      
                      ${
                        casings.length > 0 &&
                        casings.some(
                          (c) => c.from || c.to || c.material || c.type
                        )
                          ? `
                      <div class="mt-4">
                          <h3><strong>Casing Details:</strong></h3>
                          <table class="casing-table-doc">
                              <thead>
                                  <tr>
                                      <th>From (m)</th>
                                      <th>To (m)</th>
                                      <th>Material</th>
                                      <th>Type</th>
                                      <th>Remarks</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  ${casingTableRows}
                              </tbody>
                              </table>
                      </div>`
                          : ""
                      }
                  </div>

                  <div class="report-section">
                      <h2 class="section-title-doc">6. BOREHOLE PARAMETERS</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">Drilling Fluid:</span>
                              <span>${formData.drillingFluid || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Drilling Rate:</span>
                              <span>${
                                formData.drillingRate
                                  ? formData.drillingRate + " m/hr"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Formation Type:</span>
                              <span>${formData.formationType || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Aquifer Depth:</span>
                              <span>${
                                formData.aquiferDepth
                                  ? formData.aquiferDepth + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Aquifer Thickness:</span>
                              <span>${
                                formData.aquiferThickness
                                  ? formData.aquiferThickness + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Screen Length:</span>
                              <span>${
                                formData.screenLength
                                  ? formData.screenLength + " m"
                                  : "N/A"
                              }</span>
                          </div>
                      </div>
                      ${
                        formData.geologicalLog
                          ? `
                      <div class="mt-4">
                          <h3><strong>Geological Log:</strong></h3>
                          <p>${formData.geologicalLog}</p>
                      </div>`
                          : ""
                      }
                  </div>
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">7. HYDRAULIC PARAMETERS</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">Static Water Level:</span>
                              <span>${
                                formData.staticWaterLevel
                                  ? formData.staticWaterLevel + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Dynamic Water Level:</span>
                              <span>${
                                formData.dynamicWaterLevel
                                  ? formData.dynamicWaterLevel + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Drawdown:</span>
                              <span>${
                                formData.drawdown
                                  ? formData.drawdown + " m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Yield:</span>
                              <span>${
                                formData.yield
                                  ? formData.yield + " m³/hr"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Specific Capacity:</span>
                              <span>${
                                formData.specificCapacity
                                  ? formData.specificCapacity + " m³/hr/m"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Test Duration:</span>
                              <span>${
                                formData.pumpingTestDuration
                                  ? formData.pumpingTestDuration + " hrs"
                                  : "N/A"
                              }</span>
                          </div>
                      </div>
                  </div>

                  ${
                    pumpingTestData.length > 0 &&
                    pumpingTestData.some(
                      (d) => d.time || d.waterLevel || d.drawdown || d.flowRate
                    )
                      ? `
                  <div class="report-section">
                      <h2 class="section-title-doc">8. PUMPING TEST DATA</h2>
                      <table class="casing-table-doc">
                          <thead>
                              <tr>
                                  <th>Time (min)</th>
                                  <th>Water Level (m)</th>
                                  <th>Drawdown (m)</th>
                                  <th>Flow Rate (m³/hr)</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${pumpingTestTableRows}
                          </tbody>
                      </table>
                      ${
                        hasPumpingTestData
                          ? `
                      <div class="report-chart-container">
                          <h4>Pumping Test Graph</h4>
                          <canvas id="report-pumping-test-chart" width="400" height="300"></canvas>
                      </div>`
                          : ""
                      }
                  </div>`
                      : ""
                  }

                  ${
                    recoveryData.length > 0 &&
                    recoveryData.some(
                      (d) => d.time || d.waterLevel || d.recovery
                    )
                      ? `
                  <div class="report-section">
                      <h2 class="section-title-doc">9. RECOVERY TEST DATA</h2>
                      <table class="casing-table-doc">
                          <thead>
                              <tr>
                                  <th>Time (min)</th>
                                  <th>Water Level (m)</th>
                                  <th>Recovery (m)</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${recoveryDataTableRows}
                          </tbody>
                      </table>
                      ${
                        hasRecoveryData
                          ? `
                      <div class="report-chart-container">
                          <h4>Recovery Test Graph</h4>
                          <canvas id="report-recovery-data-chart" width="400" height="300"></canvas>
                      </div>`
                          : ""
                      }
                  </div>`
                      : ""
                  }
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">10. WATER QUALITY ANALYSIS</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">pH:</span>
                              <span>${formData.ph || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">TDS:</span>
                              <span>${
                                formData.tds ? formData.tds + " mg/l" : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">EC:</span>
                              <span>${
                                formData.ec ? formData.ec + " µS/cm" : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Turbidity:</span>
                              <span>${
                                formData.turbidity
                                  ? formData.turbidity + " NTU"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Chloride:</span>
                              <span>${
                                formData.chloride
                                  ? formData.chloride + " mg/l"
                                  : "N/A"
                              }</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Fluoride:</span>
                              <span>${
                                formData.fluoride
                                  ? formData.fluoride + " mg/l"
                                  : "N/A"
                              }</span>
                          </div>
                      </div>
                      ${
                        formData.waterQualityRemarks
                          ? `
                      <div class="mt-4">
                          <h3><strong>Additional Remarks:</strong></h3>
                          <p>${formData.waterQualityRemarks}</p>
                      </div>`
                          : ""
                      }
                  </div>
                  
                  ${
                    formData.recommendations || formData.conclusions
                      ? `
                  <div class="report-section">
                      <h2 class="section-title-doc">11. RECOMMENDATIONS & CONCLUSIONS</h2>
                      ${
                        formData.recommendations
                          ? `
                      <div class="mb-4">
                          <h3><strong>Recommendations:</strong></h3>
                          <p>${formData.recommendations}</p>
                      </div>`
                          : ""
                      }
                      ${
                        formData.conclusions
                          ? `
                      <div class="mb-4">
                          <h3><strong>Conclusions:</strong></h3>
                          <p>${formData.conclusions}</p>
                      </div>`
                          : ""
                      }
                  </div>`
                      : ""
                  }
                  
                  <div class="report-section">
                      <h2 class="section-title-doc">12. REPORT DETAILS</h2>
                      <div class="info-grid">
                          <div class="info-item">
                              <span class="info-label">Prepared By:</span>
                              <span>${formData.preparedBy || "N/A"}</span>
                          </div>
                          <div class="info-item">
                              <span class="info-label">Report Date:</span>
                              <span>${
                                formData.reportDate
                                  ? new Date(
                                      formData.reportDate
                                    ).toLocaleDateString()
                                  : "N/A"
                              }</span>
                          </div>
                      </div>
                  </div>
                  
                  <div class="report-section text-center">
                      <p><strong>This report is generated by Booker Investment Group Ltd</strong></p>
                      <p>Professional Water Well Drilling Services</p>
                      <p>Contact: bookerinvestmentgroupltd@gmail.com | +254 722 536 867</p>
                  </div>
              </div>
          `;
}

// Print and download functions
function printReport() {
  if (!reportGenerated) {
    alert("Please generate the report first.");
    return;
  }
  window.print();
}

function downloadPDF() {
  if (!reportGenerated) {
    alert("Please generate the report first.");
    return;
  }

  // For now, we'll use the print function
  // In a real implementation, you might want to use a library like jsPDF
  window.print();
}
