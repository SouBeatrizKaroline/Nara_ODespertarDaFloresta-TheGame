/**
 * Physics - Collision detection, platform resolution, and jump dynamics
 */

window.LumiGame = window.LumiGame || {};

class Physics {
  constructor() {
    this.gravity = 980; // px/s^2
  }

  static checkOverlap(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static resolveHorizontal(entity, platforms) {
    for (const p of platforms) {
      if (p.isOneWay) continue; // One-way platforms don't block horizontally
      if (this.checkOverlap(entity, p)) {
        if (entity.vx > 0) {
          entity.x = p.x - entity.width;
          entity.vx = 0;
        } else if (entity.vx < 0) {
          entity.x = p.x + p.width;
          entity.vx = 0;
        }
      }
    }
  }

  static resolveVertical(entity, platforms, dt, droppedOneWay = false) {
    entity.onGround = false;

    const previousBottom = entity.y - entity.vy * dt + entity.height;
    const currentBottom = entity.y + entity.height;

    for (const p of platforms) {
      const crossedTop = previousBottom <= p.y + 4 && currentBottom >= p.y;
      if (this.checkOverlap(entity, p) || (entity.vy >= 0 && crossedTop && entity.x + entity.width > p.x && entity.x < p.x + p.width)) {
        if (p.isOneWay) {
          // Only land if falling downward and player's feet were previously above or near the top
          const prevY = entity.y - entity.vy * dt;
          if (entity.vy >= 0 && (prevY + entity.height <= p.y + 12) && !droppedOneWay) {
            entity.y = p.y - entity.height;
            entity.vy = 0;
            entity.onGround = true;
            entity.currentPlatform = p;
          }
        } else {
          // Solid block
          if (entity.vy > 0) {
            entity.y = p.y - entity.height;
            entity.vy = 0;
            entity.onGround = true;
            entity.currentPlatform = p;
          } else if (entity.vy < 0) {
            entity.y = p.y + p.height;
            entity.vy = 0;
          }
        }
      }
    }
  }

  static checkMushroomBounce(entity, mushrooms) {
    for (const m of mushrooms) {
      if (this.checkOverlap(entity, m)) {
        // If coming from above
        if (entity.vy >= 0 && entity.y + entity.height <= m.y + m.height * 0.75 + entity.vy * 0.05) {
          entity.y = m.y - entity.height;
          entity.vy = -m.bounceForce || -620;
          m.squishTime = 0.35; // trigger bounce squish animation
          return m;
        }
      }
    }
    return null;
  }

  static checkHazard(entity, hazards) {
    for (const h of hazards) {
      if (this.checkOverlap(entity, h)) {
        return h;
      }
    }
    return null;
  }
}

window.LumiGame.Physics = Physics;
