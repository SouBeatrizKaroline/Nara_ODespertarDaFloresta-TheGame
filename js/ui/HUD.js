/**
 * HUD - Heads Up Display managing live counters, zone toasts, and sound/settings triggers
 */

window.LumiGame = window.LumiGame || {};

class HUD {
  constructor() {
    this.mainCounterEl = document.getElementById('hud-main-stars');
    this.secretCounterEl = document.getElementById('hud-secret-stars');
    this.zonePillEl = document.getElementById('hud-zone-pill');
    this.toastEl = document.getElementById('hud-toast');
    this.progressBarEl = document.getElementById('hud-progress-fill');
    
    this.mainPillEl = document.getElementById('hud-pill-main');
    this.secretPillEl = document.getElementById('hud-pill-secret');

    this.currentZone = '';
    this.toastTimeout = null;
    this.zoneTimeout = null;
  }

  updateCounters(mainCount, mainTotal, secretCount, secretTotal) {
    if (this.mainCounterEl) {
      this.mainCounterEl.textContent = `${mainCount}/${mainTotal}`;
    }
    if (this.secretCounterEl) {
      this.secretCounterEl.textContent = `${secretCount}/${secretTotal}`;
    }

    // Update progress bar
    if (this.progressBarEl) {
      const pct = Math.min(100, Math.round((mainCount / mainTotal) * 100));
      this.progressBarEl.style.width = `${pct}%`;
    }
  }

  bumpMainCounter() {
    if (!this.mainPillEl) return;
    this.mainPillEl.classList.remove('bump');
    void this.mainPillEl.offsetWidth; // trigger reflow
    this.mainPillEl.classList.add('bump');
    setTimeout(() => this.mainPillEl.classList.remove('bump'), 300);
  }

  bumpSecretCounter() {
    if (!this.secretPillEl) return;
    this.secretPillEl.classList.remove('bump');
    void this.secretPillEl.offsetWidth;
    this.secretPillEl.classList.add('bump');
    setTimeout(() => this.secretPillEl.classList.remove('bump'), 350);
  }

  setZone(zoneName) {
    if (this.currentZone === zoneName) return;
    this.currentZone = zoneName;

    if (!this.zonePillEl) return;
    this.zonePillEl.textContent = zoneName;
    this.zonePillEl.classList.add('visible');

    clearTimeout(this.zoneTimeout);
    this.zoneTimeout = setTimeout(() => {
      this.zonePillEl.classList.remove('visible');
    }, 3800);
  }

  showToast(message, duration = 3200) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('active');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('active');
    }, duration);
  }
}

window.LumiGame.HUD = HUD;