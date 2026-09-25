/**
 * TouchControls - Binds on-screen D-Pad and Jump button for mobile / tablet devices
 */

window.LumiGame = window.LumiGame || {};

class TouchControls {
  constructor(input) {
    this.input = input;
    this.btnLeft = document.getElementById('touch-left');
    this.btnRight = document.getElementById('touch-right');
    this.btnJump = document.getElementById('touch-jump');

    if (this.input && this.btnLeft && this.btnRight && this.btnJump) {
      this.input.bindTouchButtons(this.btnLeft, this.btnRight, this.btnJump);
    }
  }
}

window.LumiGame.TouchControls = TouchControls;