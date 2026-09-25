/**
 * EndingScreen - Cinematic climax & finale sequence
 * Handles star spiral from Lumi's pendant, tree ignition, sky constellations,
 * and the conclusion card with [Jogar novamente] and [Explorar a floresta].
 */

window.LumiGame = window.LumiGame || {};

class EndingScreen {
  constructor(game) {
    this.game = game;
    this.screenEl = document.getElementById('ending-screen');
    this.quoteEl = document.getElementById('ending-quote');
    this.statsMainEl = document.getElementById('ending-stat-main');
    this.statsSecretEl = document.getElementById('ending-stat-secret');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnExplore = document.getElementById('btn-explore');

    this.isPlayingSequence = false;
    this.sequenceTimer = 0;
    this.sequenceStep = 0;
    this.initEvents();
  }

  initEvents() {
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        this.hide();
        this.game.restartGame();
      });
    }

    if (this.btnExplore) {
      this.btnExplore.addEventListener('click', () => {
        this.hide();
        this.game.resumeFreeRoam();
      });
    }
  }

  startSequence() {
    if (this.isPlayingSequence) return;
    this.isPlayingSequence = true;
    this.sequenceTimer = 0;
    this.sequenceStep = 0;

    // Lock player kinematics
    this.game.player.vx = 0;
    this.game.player.state = 'CELEBRATE';
    this.game.player.expression = 'Feliz';
    this.game.player.facing = 1;

    // Camera smoothly pans towards the upper boughs of the Ancestral Tree
    const tree = this.game.level.ancestralTree;
    this.game.camera.setCinematicTarget(tree.x + 30, tree.y - 120, 0.02);

    // Audio crescendo
    if (this.game.sound) {
      this.game.sound.playTreeAwakening();
    }
  }

  update(dt) {
    if (!this.isPlayingSequence) return;

    this.sequenceTimer += dt;
    const tree = this.game.level.ancestralTree;
    const player = this.game.player;
    const ps = this.game.particleSystem;

    // Step 1 (0 to 3.5s): Stars spiral out from Lumi's pendant towards the tree
    if (this.sequenceTimer < 3.5) {
      const p = this.sequenceTimer / 3.5;
      if (ps && Math.random() > 0.15) {
        ps.emitOrbitStar(
          player.x + 6,
          player.y + 12,
          tree.x,
          tree.y - 180,
          p
        );
      }
    }

    // Step 2 (3.5s): Tree ignites and plants bloom!
    if (this.sequenceTimer >= 3.5 && this.sequenceStep === 0) {
      this.sequenceStep = 1;
      tree.isAwakened = true;
      this.game.camera.shake(8);

      // Massive starlight burst
      if (ps) {
        ps.emitStarBurst(tree.x, tree.y - 180, false);
        ps.emitStarBurst(tree.x, tree.y - 280, true);
      }

      // Camera pans further up into the starlit sky
      this.game.camera.setCinematicTarget(tree.x, tree.y - 240, 0.015);
    }

    // Step 3 (6.0s): Show ending card
    if (this.sequenceTimer >= 6.0 && this.sequenceStep === 1) {
      this.sequenceStep = 2;
      this.showCard();
    }
  }

  showCard() {
    const mainFound = this.game.level.mainStars.filter(s => s.collected).length;
    const secretFound = this.game.level.secretStars.filter(s => s.collected).length;

    if (this.statsMainEl) {
      this.statsMainEl.textContent = `Estrelas encontradas: ${mainFound}/20`;
    }
    if (this.statsSecretEl) {
      this.statsSecretEl.textContent = `✦ Estrelas secretas: ${secretFound}/3`;
    }

    if (this.screenEl) {
      this.screenEl.classList.add('active');
    }
  }

  hide() {
    this.isPlayingSequence = false;
    if (this.screenEl) {
      this.screenEl.classList.remove('active');
    }
  }
}

window.LumiGame.EndingScreen = EndingScreen;