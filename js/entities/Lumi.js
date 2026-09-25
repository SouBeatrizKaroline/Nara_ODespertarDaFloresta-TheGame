window.LumiGame = window.LumiGame || {};
class Nara {
  constructor(x, y) { this.x=x; this.y=y; this.width=34; this.height=44; this.vx=0; this.vy=0; this.onGround=false; this.lastCheckpoint={x,y}; this.isRespawning=false; this.respawnTimer=0; this.state='IDLE'; this.expression='Curiosa'; this.droppedOneWay=false; }
  update(dt, input, sound, particles) {
    if (this.isRespawning) { this.respawnTimer += dt; if (this.respawnTimer > .45) { this.respawn(); } return; }
    const left=input.left; const right=input.right;
    this.vx += (right-left)*900*dt; this.vx *= Math.pow(.0008, dt); this.vx=Math.max(-260,Math.min(260,this.vx));
    if (input.jumpPressed && this.onGround) { this.vy=-560; this.onGround=false; if(sound)sound.playJump(); }
    this.droppedOneWay=input.down; this.vy=Math.min(900,this.vy+980*dt); this.x+=this.vx*dt; this.y+=this.vy*dt; this.state=Math.abs(this.vx)>20?'WALK':'IDLE';
  }
  respawn() { this.x=this.lastCheckpoint.x; this.y=this.lastCheckpoint.y; this.vx=0; this.vy=0; this.isRespawning=false; this.respawnTimer=0; }
  triggerCelebration(secret) { this.expression=secret?'Radiante':'Feliz'; }
  draw(ctx,camera) { const x=this.x-camera.x,y=this.y-camera.y; ctx.save(); ctx.translate(x+17,y+22); ctx.fillStyle='#161827'; ctx.beginPath(); ctx.ellipse(0,8,17,16,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-14,-2);ctx.lineTo(-13,-22);ctx.lineTo(-3,-14);ctx.moveTo(14,-2);ctx.lineTo(13,-22);ctx.lineTo(3,-14);ctx.fill(); ctx.fillStyle='#d9f7ff';ctx.beginPath();ctx.arc(-6,0,3,0,Math.PI*2);ctx.arc(6,0,3,0,Math.PI*2);ctx.fill();ctx.restore(); }
}
window.LumiGame.Lumi=Nara;
