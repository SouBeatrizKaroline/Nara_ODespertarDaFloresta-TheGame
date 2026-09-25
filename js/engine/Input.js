/**
 * Input - Keyboard and Touch controller with multi-touch support
 */

window.LumiGame = window.LumiGame || {};

class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.jump = false;
    this.jumpPressed = false;
    this.interactPressed = false;
    
    // Internal key states
    this.keys = {};
    this.prevKeys = {};
    
    // Touch state
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.touchJumpPressed = false;
    
    this.initKeyboard();
    this.checkTouchSupport();
  }

  checkTouchSupport() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) {
      document.body.classList.add('touch-enabled');
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Audio autoplay unlock
      if (window.LumiGame.instance && window.LumiGame.instance.sound) {
        window.LumiGame.instance.sound.resumeIfNeeded();
      }

      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }

      this.keys[code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Clear keys if window loses focus
    window.addEventListener('blur', () => {
      this.keys = {};
      this.touchLeft = false;
      this.touchRight = false;
      this.touchJump = false;
    });
  }

  bindTouchButtons(btnLeft, btnRight, btnJump) {
    if (!btnLeft || !btnRight || !btnJump) return;

    const setupBtn = (btn, onDown, onUp) => {
      const handleStart = (e) => {
        e.preventDefault();
        if (window.LumiGame.instance && window.LumiGame.instance.sound) {
          window.LumiGame.instance.sound.resumeIfNeeded();
        }
        btn.classList.add('active');
        onDown();
      };
      const handleEnd = (e) => {
        e.preventDefault();
        btn.classList.remove('active');
        onUp();
      };

      btn.addEventListener('touchstart', handleStart, { passive: false });
      btn.addEventListener('touchend', handleEnd, { passive: false });
      btn.addEventListener('touchcancel', handleEnd, { passive: false });
      btn.addEventListener('mousedown', handleStart);
      btn.addEventListener('mouseup', handleEnd);
      btn.addEventListener('mouseleave', handleEnd);
    };

    setupBtn(
      btnLeft,
      () => { this.touchLeft = true; },
      () => { this.touchLeft = false; }
    );

    setupBtn(
      btnRight,
      () => { this.touchRight = true; },
      () => { this.touchRight = false; }
    );

    setupBtn(
      btnJump,
      () => {
        this.touchJump = true;
        this.touchJumpPressed = true;
      },
      () => {
        this.touchJump = false;
      }
    );
  }

  update() {
    // Resolve left/right
    const kLeft = !!(this.keys['ArrowLeft'] || this.keys['KeyA']);
    const kRight = !!(this.keys['ArrowRight'] || this.keys['KeyD']);
    const kUp = !!(this.keys['ArrowUp'] || this.keys['KeyW']);
    const kDown = !!(this.keys['ArrowDown'] || this.keys['KeyS']);
    const kJump = !!(this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']);

    this.left = kLeft || this.touchLeft;
    this.right = kRight || this.touchRight;
    this.up = kUp;
    this.down = kDown;
    this.jump = kJump || this.touchJump;

    // Single frame press triggers
    const prevJump = !!(this.prevKeys['Space'] || this.prevKeys['ArrowUp'] || this.prevKeys['KeyW']);
    this.jumpPressed = (kJump && !prevJump) || this.touchJumpPressed;
    this.touchJumpPressed = false;

    const kInteract = !!(this.keys['KeyE'] || this.keys['Enter']);
    const prevInteract = !!(this.prevKeys['KeyE'] || this.prevKeys['Enter']);
    this.interactPressed = (kInteract && !prevInteract);

    // Save previous
    this.prevKeys = { ...this.keys };
  }
}

window.LumiGame.Input = Input;