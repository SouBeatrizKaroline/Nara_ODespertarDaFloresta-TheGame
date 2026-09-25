/**
 * ParticleSystem - High-performance multi-emitter for sparkles, ambient spores, fireflies & water drops
 */

window.LumiGame = window.LumiGame || {};

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 600;
  }

  emit(options) {
    if (this.particles.length >= this.maxParticles) return;

    this.particles.push({
      x: options.x || 0,
      y: options.y || 0,
      vx: options.vx || 0,
      vy: options.vy || 0,
      size: options.size || 3,
      startSize: options.size || 3,
      color: options.color || '#ffd152',
      glowColor: options.glowColor || null,
      alpha: options.alpha !== undefined ? options.alpha : 1.0,
      life: options.life || 1.0,
      maxLife: options.life || 1.0,
      shape: options.shape || 'circle', // 'circle', 'star', 'spark', 'ring', 'leaf'
      gravity: options.gravity || 0,
      drag: options.drag || 0.96,
      rotation: options.rotation || 0,
      vRot: options.vRot || (Math.random() - 0.5) * 4,
      waveFreq: options.waveFreq || 0,
      waveAmp: options.waveAmp || 0,
      age: 0
    });
  }

  emitStarBurst(x, y, isSecret = false) {
    const count = isSecret ? 35 : 24;
    const baseColor = isSecret ? '#f368e0' : '#ffe066';
    const glowColor = isSecret ? 'rgba(243, 104, 224, 0.6)' : 'rgba(255, 224, 102, 0.6)';

    // Expanding shockwave ring
    this.emit({
      x, y,
      shape: 'ring',
      size: 8,
      color: baseColor,
      life: 0.5,
      drag: 1.0
    });

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 100 + Math.random() * 220;
      this.emit({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.3 ? baseColor : '#ffffff',
        glowColor,
        shape: Math.random() > 0.5 ? 'star' : 'spark',
        life: 0.6 + Math.random() * 0.5,
        drag: 0.93,
        gravity: 40
      });
    }
  }

  emitFootstepDust(x, y, dir) {
    for (let i = 0; i < 3; i++) {
      this.emit({
        x: x + (Math.random() - 0.5) * 6,
        y: y - 2,
        vx: -dir * (20 + Math.random() * 30),
        vy: -(10 + Math.random() * 20),
        size: 2 + Math.random() * 2,
        color: 'rgba(150, 180, 220, 0.4)',
        life: 0.3 + Math.random() * 0.2,
        drag: 0.9,
        gravity: -10
      });
    }
  }

  emitWaterSplash(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 70 + Math.random() * 140;
      this.emit({
        x: x + (Math.random() - 0.5) * 16,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: '#a8d8ea',
        glowColor: 'rgba(168, 216, 234, 0.4)',
        life: 0.5 + Math.random() * 0.3,
        drag: 0.94,
        gravity: 360
      });
    }
  }

  emitRespawnDissolve(x, y) {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 100;
      this.emit({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.4 ? '#4a75e6' : '#ffeaa7',
        shape: 'spark',
        life: 0.7 + Math.random() * 0.4,
        drag: 0.92,
        gravity: -20
      });
    }
  }

  emitOrbitStar(sourceX, sourceY, targetX, targetY, progress) {
    // Spiral motion towards target
    const angle = progress * Math.PI * 8 + Math.random() * 0.5;
    const radius = (1 - progress) * 140;
    const curX = sourceX + (targetX - sourceX) * progress + Math.cos(angle) * radius;
    const curY = sourceY + (targetY - sourceY) * progress + Math.sin(angle) * (radius * 0.6);

    this.emit({
      x: curX,
      y: curY,
      size: 4 + Math.random() * 3,
      color: '#ffe57f',
      glowColor: 'rgba(255, 229, 127, 0.8)',
      shape: 'star',
      life: 0.4,
      drag: 0.9
    });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity * dt;

      if (p.waveAmp > 0) {
        p.x += (p.vx + Math.sin(p.age * p.waveFreq) * p.waveAmp) * dt;
      } else {
        p.x += p.vx * dt;
      }
      p.y += p.vy * dt;

      p.rotation += p.vRot * dt;

      // Alpha and size fade
      const progress = p.age / p.maxLife;
      if (p.shape === 'ring') {
        p.size = p.startSize + progress * 60;
        p.alpha = (1 - progress);
      } else {
        p.alpha = 1 - progress;
      }
    }
  }

  draw(ctx, camera) {
    ctx.save();
    for (const p of this.particles) {
      const screenX = p.x - camera.x;
      const screenY = p.y - camera.y;

      if (screenX < -50 || screenX > camera.viewportWidth + 50 ||
          screenY < -50 || screenY > camera.viewportHeight + 50) {
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.translate(screenX, screenY);
      ctx.rotate(p.rotation);

      if (p.glowColor) {
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10;
      }

      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        this.drawStar(ctx, 0, 0, 4, p.size * 1.5, p.size * 0.6);
      } else if (p.shape === 'spark') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'ring') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

window.LumiGame.ParticleSystem = ParticleSystem;