/**
 * Main - Game entry point and window lifecycle
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  function resizeCanvas() {
    const container = document.getElementById('game-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Internal game coordinate resolution (fixed 16:9 virtual canvas)
    const targetAspect = 16 / 9;
    let renderW = 960;
    let renderH = 540;

    canvas.width = renderW;
    canvas.height = renderH;

    if (window.LumiGame.instance && window.LumiGame.instance.camera) {
      window.LumiGame.instance.camera.resize(renderW, renderH);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Initialize Game Instance
  const game = new window.LumiGame.Game(canvas);
  window.LumiGame.instance = game;

  // Sound Button Hook
  const btnSound = document.getElementById('btn-sound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      game.sound.resumeIfNeeded();
      const isMuted = game.sound.toggleMute();
      btnSound.textContent = isMuted ? '🔇' : '🎵';
      btnSound.title = isMuted ? 'Desmutar Som' : 'Mutar Som';
    });
  }

  // Audio Context unlock on first interaction
  const unlockAudio = () => {
    game.sound.resumeIfNeeded();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // Start the game!
  game.start();
});