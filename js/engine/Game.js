/**
 * Game - Master Game loop, physics orchestration, and state machine
 */

window.LumiGame = window.LumiGame || {};

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Core systems
    this.sound = new window.LumiGame.SoundManager();
    this.input = new window.LumiGame.Input();
    this.camera = new window.LumiGame.Camera(canvas.width, canvas.height);
    this.particleSystem = new window.LumiGame.ParticleSystem();
    this.level = new window.LumiGame.LevelData();
    this.player = new window.LumiGame.Lumi(100, 420);
    this.transformSys = new window.LumiGame.TransformationSystem();
    this.environmentFX = new window.LumiGame.EnvironmentFX(this.level.worldWidth);
    this.worldRenderer = new window.LumiGame.WorldRenderer(canvas);

    // UI
    this.hud = new window.LumiGame.HUD();
    this.settingsModal = new window.LumiGame.SettingsModal(this);
    this.endingScreen = new window.LumiGame.EndingScreen(this);
    this.touchControls = new window.LumiGame.TouchControls(this.input);

    // Screen Fade Element
    this.fadeEl = document.getElementById('screen-fade');

    // State
    this.isRunning = false;
    this.lastTime = 0;
    this.time = 0;
    this.isFreeRoam = false;
    this.endSequenceTriggered = false;

    // Grass baseline alignment
    this.alignGrassToLevel();

    // Initial HUD counter update
    this.updateCounters();
  }

  alignGrassToLevel() {
    for (const g of this.environmentFX.grassBlades) {
      for (const p of this.level.platforms) {
        if (g.x >= p.x && g.x <= p.x + p.width) {
          g.baseY = p.y;
          break;
        }
      }
    }
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));

    // Initial Welcome Toast
    setTimeout(() => {
      this.hud.showToast("A floresta perdeu sua luz. Encontre os fragmentos de estrelas!");
    }, 800);
  }

  updateCounters() {
    const mainFound = this.level.mainStars.filter(s => s.collected).length;
    const secretFound = this.level.secretStars.filter(s => s.collected).length;
    this.hud.updateCounters(mainFound, 20, secretFound, 3);
    this.transformSys.updateProgress(mainFound, 20);
  }

  triggerHazardRespawn() {
    if (this.player.isRespawning) return;
    this.player.isRespawning = true;
    this.player.respawnTimer = 0;

    // Visual fade & Audio
    if (this.fadeEl) {
      this.fadeEl.classList.add('active');
      setTimeout(() => {
        this.fadeEl.classList.remove('active');
      }, 450);
    }

    if (this.sound) {
      this.sound.playRespawn();
    }

    this.particleSystem.emitRespawnDissolve(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2
    );

    this.hud.showToast("Nara retornou em segurança ao santuário.");
  }

  checkStarCollections() {
    // Main Stars
    for (const s of this.level.mainStars) {
      if (!s.collected && !s.isDisappearing && window.LumiGame.Physics.checkOverlap(this.player, s)) {
        s.collect(this.particleSystem, this.sound);
        this.player.triggerCelebration(false);
        this.camera.shake(3);
        this.hud.bumpMainCounter();
        this.updateCounters();
      }
    }

    // Secret Stars
    for (const s of this.level.secretStars) {
      if (!s.collected && !s.isDisappearing && window.LumiGame.Physics.checkOverlap(this.player, s)) {
        s.collect(this.particleSystem, this.sound);
        this.player.triggerCelebration(true);
        this.camera.shake(6);
        this.hud.bumpSecretCounter();
        this.hud.showToast("✦ Estrela Secreta encontrada!");
        this.updateCounters();
      }
    }
  }

  checkAncestralTreeClimax() {
    if (this.endSequenceTriggered || this.isFreeRoam) return;

    const tree = this.level.ancestralTree;
    const distToTree = Math.abs((this.player.x + this.player.width / 2) - tree.shrineX);

    if (distToTree < 75) {
      const mainFound = this.level.mainStars.filter(s => s.collected).length;
      if (mainFound >= 20) {
        this.endSequenceTriggered = true;
        this.endingScreen.startSequence();
      } else {
        // Helpful hint
        if (Math.sin(this.time * 2) > 0.98) {
          this.hud.showToast(`A Árvore Ancestral precisa de 20 estrelas (${mainFound}/20).`);
        }
      }
    }
  }

  restartGame() {
    // Reset stars
    for (const s of this.level.mainStars) {
      s.collected = false;
      s.isDisappearing = false;
      s.scale = 1.0;
      s.alpha = 1.0;
    }
    for (const s of this.level.secretStars) {
      s.collected = false;
      s.isDisappearing = false;
      s.scale = 1.0;
      s.alpha = 1.0;
    }

    // Reset checkpoints
    for (let i = 0; i < this.level.checkpoints.length; i++) {
      this.level.checkpoints[i].active = (i === 0);
    }

    // Reset tree & progression
    this.level.ancestralTree.isAwakened = false;
    this.endSequenceTriggered = false;
    this.isFreeRoam = false;

    // Reset player position
    this.player.lastCheckpoint = { x: 100, y: 420 };
    this.player.respawn();

    this.camera.releaseCinematic();
    this.updateCounters();
    this.hud.showToast("Uma nova jornada começa na floresta!");
  }

  resumeFreeRoam() {
    this.isFreeRoam = true;
    this.camera.releaseCinematic();
    this.player.state = 'IDLE';
    this.player.expression = 'Feliz';
    this.hud.showToast("A floresta está salva! Aproveite para explorar.");
  }

  update(dt) {
    this.time += dt;

    // Update input
    this.input.update();

    // Ending sequence update
    if (this.endingScreen.isPlayingSequence) {
      this.endingScreen.update(dt);
      this.particleSystem.update(dt);
      this.environmentFX.update(dt, this.player, this.transformSys);
      this.camera.update(null, dt);
      return;
    }

    // Player update
    this.player.update(dt, this.input, this.sound, this.particleSystem);

    // Physics Collisions
    window.LumiGame.Physics.resolveHorizontal(this.player, this.level.platforms);
    window.LumiGame.Physics.resolveVertical(this.player, this.level.platforms, dt, this.player.droppedOneWay);

    // Bouncy Mushroom Checks
    const bounced = window.LumiGame.Physics.checkMushroomBounce(this.player, this.level.mushrooms);
    if (bounced) {
      if (this.sound) this.sound.playMushroomBounce();
      this.camera.shake(4);
      this.particleSystem.emit({
        x: bounced.x + bounced.width / 2,
        y: bounced.y,
        shape: 'ring',
        color: bounced.color,
        size: 6,
        life: 0.35
      });
    }

    // Hazard checks (Abyss or Water stream)
    const hazard = window.LumiGame.Physics.checkHazard(this.player, this.level.hazards);
    if (hazard) {
      if (hazard.type === 'water') {
        this.particleSystem.emitWaterSplash(this.player.x + this.player.width / 2, hazard.y);
      }
      this.triggerHazardRespawn();
    }

    // Safety net for any missed collision or custom level gap.
    if (this.player.y > 620) {
      this.triggerHazardRespawn();
    }

    // Checkpoint Shrines
    for (const cp of this.level.checkpoints) {
      cp.update(dt, this.player, this.sound, this.particleSystem);
    }

    // Star pickups
    this.checkStarCollections();

    // Stars floating animation
    for (const s of this.level.mainStars) s.update(dt, this.time);
    for (const s of this.level.secretStars) s.update(dt, this.time);

    // Check Climax Area
    this.checkAncestralTreeClimax();

    // Environmental & Particle updates
    this.transformSys.update(dt, this.hud, this.sound, this.particleSystem);
    this.environmentFX.update(dt, this.player, this.transformSys);
    this.particleSystem.update(dt);

    // Zone Title Notification
    const zoneName = this.level.getZoneAt(this.player.x);
    this.hud.setZone(zoneName);

    // Camera follow player
    this.camera.update(this.player, dt);
  }

  draw() {
    this.worldRenderer.render(
      this.level,
      this.player,
      this.camera,
      this.environmentFX,
      this.transformSys,
      this.particleSystem
    );
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Prevent spiral of death on tab switch
    if (dt > 0.1) dt = 0.1;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.LumiGame.Game = Game;
