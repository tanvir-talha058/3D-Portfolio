/* ==========================================================================
   Interactive AI Playground Demo Engine
   Interactive simulation for RAG, NLP Dialects, and Fraud Scoring
   ========================================================================== */

(function () {
  const modeBtns = document.querySelectorAll('.mode-btn');
  const queryInput = document.getElementById('playground-input');
  const runBtn = document.getElementById('playground-run-btn');
  const terminalLogs = document.getElementById('terminal-logs');
  const confidenceFill = document.getElementById('confidence-fill');
  const confidenceScore = document.getElementById('confidence-score');
  const presetContainer = document.getElementById('preset-pills');

  if (!queryInput || !runBtn) return;

  let currentMode = 'rag';

  const presets = {
    rag: [
      { label: "Banglish Balance Check", text: "Amar account e balance koto ache ar last 3 transaction dekhaw?" },
      { label: "Bangla Card Block", text: "আমার ডেবিট কার্ড হারিয়ে গেছে, তাৎক্ষণিক ব্লক করতে কি করতে হবে?" },
      { label: "English Loan Query", text: "What is the interest rate and eligibility criteria for home loans?" }
    ],
    dialect: [
      { label: "Chittagong Dialect", text: "তুঁই খঁদে য্দ্দ্যে? আঁর লগে কতা কনা ক্যান?" },
      { label: "Sylhet Dialect", text: "কিতা খবর তুমার? অখন কইন যাইতায় নি বাজারে?" },
      { label: "Noakhali Dialect", text: "আন্নের বাড়ি কই? হেতে কি কতা কয় বুইঝতাম পারিনা!" }
    ],
    fraud: [
      { label: "High Risk Velocity Burst", text: "User UID_9842: 5 international transfers in 90 seconds exceeding daily cap by 450% from new IP subnet." },
      { label: "Normal Merchant QR", text: "User UID_1029: 250 BDT payment at UCSI University Cafeteria via verified device token." },
      { label: "Suspicious Off-Hour Withdrawal", text: "User UID_5512: 50,000 BDT cashout at 3:45 AM after consecutive failed PIN attempts." }
    ]
  };

  function updatePresets() {
    presetContainer.innerHTML = '';
    const currentPresets = presets[currentMode] || [];
    currentPresets.forEach(preset => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'preset-pill';
      pill.textContent = preset.label;
      pill.addEventListener('click', () => {
        queryInput.value = preset.text;
      });
      presetContainer.appendChild(pill);
    });
    // Set initial text from first preset
    if (currentPresets.length > 0) {
      queryInput.value = currentPresets[0].text;
    }
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      updatePresets();
      resetTerminal();
    });
  });

  function resetTerminal() {
    terminalLogs.innerHTML = `
      <div class="log-entry log-dim">[System Ready] Selected Model: <span class="log-cyan">${currentMode.toUpperCase()} Pipeline</span></div>
      <div class="log-entry">Awaiting user input sequence...</div>
    `;
    confidenceFill.style.width = '0%';
    confidenceScore.textContent = '0%';
  }

  function simulateExecution() {
    const text = queryInput.value.trim();
    if (!text) {
      terminalLogs.innerHTML = `<div class="log-entry" style="color: #ef4444;">[Error] Input buffer empty. Please enter or select a test sample.</div>`;
      return;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

    terminalLogs.innerHTML = `
      <div class="log-entry log-cyan">[0.00ms] Initializing inference pipeline: ${currentMode.toUpperCase()}</div>
      <div class="log-entry log-dim">[12.4ms] Tokenizing input string (${text.length} characters)...</div>
    `;

    setTimeout(() => {
      if (currentMode === 'rag') {
        const lang = /[\u0980-\u09FF]/.test(text) ? "Bangla" : (text.toLowerCase().includes("amar") || text.toLowerCase().includes("koto") ? "Banglish" : "English");
        terminalLogs.innerHTML += `
          <div class="log-entry log-violet">[28.1ms] Detected Input Language: <span class="log-cyan">${lang}</span></div>
          <div class="log-entry log-dim">[45.2ms] Running Hybrid Dense Retrieval (Qdrant) + BM25 Lexical Reranker...</div>
          <div class="log-entry log-emerald">[68.5ms] Top 3 Relevant Context Passages Retrieved & Reranked</div>
          <div class="log-entry log-cyan">[82.0ms] Context Filter Applied: Hallucination Risk Score = 0.012</div>
          <div class="log-entry" style="color: #f8fafc; margin-top: 6px;"><strong>[RAG Response Output]</strong> Generated high-accuracy localized response in ${lang} with citations verified.</div>
        `;
        confidenceFill.style.width = '98.4%';
        confidenceScore.textContent = '98.4% (RAG Match)';
      } else if (currentMode === 'dialect') {
        let predictedDialect = "Chittagong Dialect (Chatgaiya)";
        let conf = "94.8%";
        if (text.includes("কিতা") || text.includes("অখন") || text.includes("খবর")) {
          predictedDialect = "Sylhet Dialect (Sylheti)";
          conf = "96.2%";
        } else if (text.includes("আন্নের") || text.includes("হেতে") || text.includes("বুইঝতাম")) {
          predictedDialect = "Noakhali Dialect";
          conf = "93.7%";
        }
        terminalLogs.innerHTML += `
          <div class="log-entry log-violet">[32.0ms] Transformer Embedding Extraction (m-BERT / BanglaBERT)...</div>
          <div class="log-entry log-dim">[54.8ms] Regional Feature Cross-Attention Layer Activated...</div>
          <div class="log-entry log-emerald">[76.3ms] Predicted Regional Dialect: <strong class="log-cyan">${predictedDialect}</strong></div>
          <div class="log-entry log-dim">[88.1ms] Low-Resource Translation Alignment: Ready for Standard Bengali Normalization</div>
        `;
        confidenceFill.style.width = conf;
        confidenceScore.textContent = `${conf} Confidence`;
      } else if (currentMode === 'fraud') {
        const isHighRisk = text.toLowerCase().includes("burst") || text.toLowerCase().includes("450%") || text.toLowerCase().includes("failed pin");
        const riskLevel = isHighRisk ? "CRITICAL RISK (94.2/100)" : "LOW RISK (4.8/100)";
        const action = isHighRisk ? "FLAGGED: Immediate OTP Challenge + Step-up Auth" : "APPROVED: Instant Transaction Clearance";
        const colorClass = isHighRisk ? "log-violet" : "log-emerald";
        
        terminalLogs.innerHTML += `
          <div class="log-entry log-dim">[14.2ms] Parsing Transaction Velocity & Geolocation Signals...</div>
          <div class="log-entry ${colorClass}">[38.5ms] Anomaly Scoring Engine Result: <strong>${riskLevel}</strong></div>
          <div class="log-entry log-cyan">[52.1ms] Policy Engine Decision: <strong>${action}</strong></div>
        `;
        confidenceFill.style.width = isHighRisk ? '94.2%' : '95.2%';
        confidenceScore.textContent = isHighRisk ? 'High Anomaly Detected' : 'Verified Legitimate';
      }

      runBtn.disabled = false;
      runBtn.innerHTML = `<i class="fas fa-bolt"></i> Run Live Pipeline`;
    }, 450);
  }

  runBtn.addEventListener('click', simulateExecution);

  // Initialize
  updatePresets();
  resetTerminal();
})();
