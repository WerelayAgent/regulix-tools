// Regulix Tools Core Engine & Interactive UI

const CONTRACT_ADDRESS = "live now on pump.fun";

// Toast notification helper
function showToast(message, icon = "✓") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color: var(--cyan);">${icon}</span> ${message}`;
  toast.classList.add("show");
  
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// Copy CA Function
function copyCA() {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      showToast("Contract address copied: live now on pump.fun");
    }).catch(() => {
      fallbackCopy(CONTRACT_ADDRESS);
    });
  } else {
    fallbackCopy(CONTRACT_ADDRESS);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("Contract address copied: live now on pump.fun");
  } catch (err) {
    showToast("Press Ctrl+C to copy");
  }
  document.body.removeChild(textArea);
}

// Interactive Live Candlestick Canvas
function initCandleChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let width = canvas.parentElement.clientWidth;
  let height = canvas.parentElement.clientHeight - 40;
  canvas.width = width;
  canvas.height = height;

  let candles = [];
  let basePrice = 0.00042;
  
  // Generate initial candle history
  for (let i = 0; i < 40; i++) {
    let change = (Math.random() - 0.46) * 0.00004;
    let open = basePrice;
    let close = Math.max(0.0001, open + change);
    let high = Math.max(open, close) + Math.random() * 0.00002;
    let low = Math.min(open, close) - Math.random() * 0.00002;
    candles.push({ open, close, high, low });
    basePrice = close;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw horizontal grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Min and Max price bounds
    let prices = candles.flatMap(c => [c.high, c.low]);
    let minP = Math.min(...prices) * 0.98;
    let maxP = Math.max(...prices) * 1.02;
    let pRange = maxP - minP;

    let candleWidth = Math.max(4, (width / candles.length) - 5);

    candles.forEach((c, idx) => {
      let x = idx * (candleWidth + 5) + 10;
      let yOpen = height - ((c.open - minP) / pRange) * height;
      let yClose = height - ((c.close - minP) / pRange) * height;
      let yHigh = height - ((c.high - minP) / pRange) * height;
      let yLow = height - ((c.low - minP) / pRange) * height;

      let isBull = c.close >= c.open;
      ctx.strokeStyle = isBull ? "#00E676" : "#FF3366";
      ctx.fillStyle = isBull ? "#00E676" : "#FF3366";

      // Wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();

      // Body
      let bodyTop = Math.min(yOpen, yClose);
      let bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
    });
  }

  draw();

  // Animate latest price ticks
  setInterval(() => {
    let last = candles[candles.length - 1];
    let tick = (Math.random() - 0.47) * 0.000015;
    last.close = Math.max(0.0001, last.close + tick);
    if (last.close > last.high) last.high = last.close;
    if (last.close < last.low) last.low = last.close;
    
    // Update live price display
    const priceDisplay = document.getElementById("livePriceVal");
    if (priceDisplay) {
      priceDisplay.textContent = `$${last.close.toFixed(7)}`;
      priceDisplay.style.color = tick >= 0 ? "#00E676" : "#FF3366";
    }
    draw();
  }, 900);

  window.addEventListener("resize", () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight - 40;
    canvas.width = width;
    canvas.height = height;
    draw();
  });
}

// 200-Wallet Generator Simulation
function generateSubWallets(count = 10) {
  const container = document.getElementById("walletListTable");
  if (!container) return;

  const prefixes = ["7x", "4q", "9k", "2b", "Fw", "Jp", "Mn", "Vk", "8z", "3t"];
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  let html = "";
  for (let i = 1; i <= count; i++) {
    let addr = prefixes[(i - 1) % prefixes.length];
    for (let j = 0; j < 36; j++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    let shortAddr = addr.substring(0, 4) + "..." + addr.substring(addr.length - 4);
    let solBal = (Math.random() * 2.5 + 0.1).toFixed(3);
    let tokenPct = ((Math.random() * 0.4 + 0.1)).toFixed(2);

    html += `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-family: var(--font-mono); font-size: 0.85rem;">
        <td style="padding: 10px 14px; color: var(--cyan);">#${i.toString().padStart(3, '0')}</td>
        <td style="padding: 10px 14px; color: #fff;">${shortAddr}</td>
        <td style="padding: 10px 14px; color: var(--green);">${solBal} SOL</td>
        <td style="padding: 10px 14px; color: #fff;">${tokenPct}%</td>
        <td style="padding: 10px 14px;">
          <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(0, 230, 118, 0.15); color: #00E676; font-size: 0.72rem; font-weight: 700;">READY</span>
        </td>
      </tr>
    `;
  }
  container.innerHTML = html;
  showToast(`Loaded ${count} active sub-wallets for Block-0 bundling`);
}

// Mass Action Simulators
function executeMassAction(actionType) {
  const btn = event?.currentTarget;
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="ca-pulse"></span> Executing Jito bundle...`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      showToast(`Block-0 bundle broadcasted: ${actionType} across all wallets!`, "🚀");
    }, 1200);
  }
}

// AI Studio Prompt Generator Mock
function runStudioPrompt() {
  const input = document.getElementById("studioInput");
  const output = document.getElementById("studioOutput");
  if (!input || !output) return;

  const val = input.value.trim();
  if (!val) {
    showToast("Please enter a concept or token description", "⚠️");
    return;
  }

  output.style.display = "block";
  output.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div class="ca-pulse" style="width: 14px; height: 14px; margin: 0 auto 16px;"></div>
      <p style="color: var(--cyan); font-family: var(--font-mono);">Synthesizing Claude Compute pipeline...</p>
      <p style="color: var(--text-muted); font-size: 0.85rem;">Generating custom site, tokenomics, logo, X banner, and launch pitch</p>
    </div>
  `;

  setTimeout(() => {
    output.innerHTML = `
      <div style="background: rgba(10, 13, 20, 0.95); border: 1px solid var(--border-card); border-radius: 14px; padding: 24px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 12px;">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--cyan); font-weight: 700;">AI STUDIO GENERATION COMPLETE</span>
            <h4 style="font-size: 1.2rem; color: #fff; margin-top: 4px;">Project: ${val.split(' ')[0].toUpperCase()} PROTOCOL</h4>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Assets bundle downloaded (.zip)', '📦')">Export All (.ZIP)</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
          <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: var(--cyan); font-weight: 700; margin-bottom: 6px;">SITE & DAPP CODE</div>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Fully responsive single-page launch app with live pump.fun widget & tokenomics.</p>
            <button class="btn btn-outline btn-sm" style="margin-top: 10px; width: 100%;" onclick="showToast('HTML/CSS Code Copied to Clipboard!')">Copy Code</button>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: var(--cyan); font-weight: 700; margin-bottom: 6px;">BRANDING ASSETS</div>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Vector SVG Logo, 1500x500 X Banner, and 512x512 token avatar rendered.</p>
            <button class="btn btn-outline btn-sm" style="margin-top: 10px; width: 100%;" onclick="showToast('Branding assets generated!')">Download Media</button>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: var(--cyan); font-weight: 700; margin-bottom: 6px;">VIRAL LAUNCH PITCH</div>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Thread of 4 high-converting X posts with viral hooks and community roadmap.</p>
            <button class="btn btn-outline btn-sm" style="margin-top: 10px; width: 100%;" onclick="showToast('Launch pitch copied!')">Copy Thread</button>
          </div>
        </div>

        <div style="background: rgba(0, 0, 0, 0.6); padding: 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.82rem; color: #8D99AE; border-left: 3px solid var(--cyan);">
          <strong style="color: #fff;">Viral Tweet Sample:</strong><br>
          "Introducing $${val.split(' ')[0].toUpperCase()} on Solana — the community-driven memecoin powered by autonomous bundling & verified liquidity. Live now on pump.fun! 🚀🔥"
        </div>
      </div>
    `;
    showToast("Project assets successfully synthesized!", "✨");
  }, 1400);
}

// Workspace Tab Switching
function switchWorkspaceTab(tabName) {
  const tabs = document.querySelectorAll(".workspace-tab");
  const contents = document.querySelectorAll(".workspace-content");

  tabs.forEach(t => t.classList.remove("active"));
  contents.forEach(c => c.style.display = "none");

  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(tabName);

  if (activeTab) activeTab.classList.add("active");
  if (activeContent) activeContent.style.display = "block";
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Init charts if present
  initCandleChart("liveChartCanvas");

  // Init wallet preview table
  generateSubWallets(6);

  // Attach global copy listener to all ca buttons
  document.querySelectorAll(".ca-copy-btn").forEach(btn => {
    btn.addEventListener("click", copyCA);
  });
});
