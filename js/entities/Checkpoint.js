/**
 * Checkpoint - Sacred ancient stone shrines that save Lumi's safe position
 */

window.LumiGame = window.LumiGame || {};

class Checkpoint {
  constructor(x, y, id = 0, name = 'Santuário') {
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 70;
    this.id = id;
    this.name = name;
    this.active = false;
    this.glowIntensity = 0.2;
    this.pulseTime = 0;
  }

  update(dt, player, soundManager, particleSystem) {
    this.pulseTime += dt;

    if (!this.active) {
      // Check player overlap
      if (
        player.x + player.width > this.x &&
        player.x < this.x + this.width &&
        player.y + player.height > this.y &&
        player.y < this.y + this.height
      ) {
        this.activate(soundManager, particleSystem);
        player.lastCheckpoint = {
          x: this.x + (this.width - player.width) / 2,
          y: this.y + this.height - player.height
        };
      }
    } else {
      // Smoothly ramp up glow
      this.glowIntensity += (1.0 - this.glowIntensity) * 0.08;
    }
  }

  activate(soundManager, particleSystem) {
    if (this.active) return;
    this.active = true;

    if (soundManager) soundManager.playCheckpoint();
    if (particleSystem) {
      // Upward floating blessing particles
      for (let i = 0; i < 16; i++) {
        particleSystem.emit({
          x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
          y: this.y + this.height - 10,
          vx: (Math.random() - 0.5) * 24,
          vy: -30 - Math.random() * 50,
          size: 3 + Math.random() * 2,
          color: '#64ffda',
          glowColor: 'rgba(100, 255, 218, 0.7)',
          shape: 'spark',
          life: 0.8 + Math.random() * 0.4
        });
      }
    }
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    if (screenX < -60 || screenX > camera.viewportWidth + 60 ||
        screenY < -80 || screenY > camera.viewportHeight + 80) {
      return;
    }

    ctx.save();
    ctx.translate(screenX, screenY);

    // Stone Arch Shrine
    ctx.fillStyle = '#22293d';
    ctx.beginPath();
    ctx.moveTo(4, this.height);
    ctx.lineTo(4, 24);
    ctx.arcTo(4, 4, 22, 4, 18);
    ctx.arcTo(this.width - 4, 4, this.width - 4, 24, 18);
    ctx.lineTo(this.width - 4, this.height);
    ctx.closePath();
    ctx.fill();

    // Stone border highlight
    ctx.strokeStyle = '#3e4a6a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Portal / Rune niche
    const pulse = Math.sin(this.pulseTime * 2.5) * 0.15;
    const currentGlow = this.active ? (0.75 + pulse) : 0.2;

    ctx.fillStyle = this.active ? `rgba(100, 255, 218, ${currentGlow * 0.4})` : 'rgba(20, 25, 45, 0.7)';
    ctx.beginPath();
    ctx.moveTo(12, this.height - 4);
    ctx.lineTo(12, 28);
    ctx.arcTo(12, 14, 22, 14, 10);
    ctx.arcTo(this.width - 12, 14, this.width - 12, 28, 10);
    ctx.lineTo(this.width - 12, this.height - 4);
    ctx.closePath();
    ctx.fill();

    // Central Star Rune Glyph
    ctx.save();
    ctx.translate(this.width / 2, 34);
    ctx.fillStyle = this.active ? '#64ffda' : '#5a6682';
    if (this.active) {
      ctx.shadowColor = '#64ffda';
      ctx.shadowBlur = 12;
    }
    // Draw 4-point star rune
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(3, -3);
    ctx.lineTo(10, 0);
    ctx.lineTo(3, 3);
    ctx.lineTo(0, 10);
    ctx.lineTo(-3, 3);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-3, -3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Little mushrooms & moss at base
    ctx.fillStyle = this.active ? '#ffaa5e' : '#5c677d';
    ctx.beginPath();
    ctx.arc(8, this.height - 2, 4, Math.PI, 0);
    ctx.arc(this.width - 6, this.height - 2, 5, Math.PI, 0);
    ctx.fill();

    ctx.restore();
  }
}

window.LumiGame.Checkpoint = Checkpoint;