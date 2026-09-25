/**
 * SettingsModal - Manages accessibility options and audio volume controls
 */

window.LumiGame = window.LumiGame || {};

class SettingsModal {
  constructor(game) {
    this.game = game;
    this.modalEl = document.getElementById('settings-modal');
    this.openBtn = document.getElementById('btn-settings');
    this.closeBtn = document.getElementById('btn-close-settings');

    // Controls
    this.reduceMotionToggle = document.getElementById('toggle-reduce-motion');
    this.screenShakeToggle = document.getElementById('toggle-screen-shake');
    this.highContrastToggle = document.getElementById('toggle-high-contrast');
    this.musicVolumeSlider = document.getElementById('slider-music-volume');
    this.sfxVolumeSlider = document.getElementById('slider-sfx-volume');

    this.isOpen = false;
    this.initEvents();
  }

  initEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    // Reduce Motion
    if (this.reduceMotionToggle) {
      this.reduceMotionToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('reduce-motion');
        } else {
          document.body.classList.remove('reduce-motion');
        }
      });
    }

    // Screen Shake
    if (this.screenShakeToggle) {
      this.screenShakeToggle.addEventListener('change', (e) => {
        if (this.game && this.game.camera) {
          this.game.camera.enableShake = e.target.checked;
        }
      });
    }

    // High Contrast
    if (this.highContrastToggle) {
      this.highContrastToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      });
    }

    // Music Volume
    if (this.musicVolumeSlider) {
      this.musicVolumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.game && this.game.sound) {
          this.game.sound.setMusicVolume(val);
        }
      });
    }

    // SFX Volume
    if (this.sfxVolumeSlider) {
      this.sfxVolumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.game && this.game.sound) {
          this.game.sound.setSfxVolume(val);
        }
      });
    }

    // Keyboard shortcut (Escape to toggle)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.isOpen) this.close();
        else this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    if (this.modalEl) this.modalEl.classList.add('open');
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) this.modalEl.classList.remove('open');
  }
}

window.LumiGame.SettingsModal = SettingsModal;