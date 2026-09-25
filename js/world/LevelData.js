window.LumiGame=window.LumiGame||{};
class LevelData {
  constructor(){ this.worldWidth=4200; this.platforms=[{x:0,y:500,width:4200,height:80,isOneWay:false},{x:420,y:390,width:260,height:18,isOneWay:true},{x:980,y:350,width:260,height:18,isOneWay:true},{x:1600,y:420,width:280,height:18,isOneWay:true},{x:2350,y:330,width:260,height:18,isOneWay:true},{x:3100,y:400,width:280,height:18,isOneWay:true}]; this.mushrooms=[]; this.hazards=[{x:0,y:580,width:4200,height:100,type:'abyss'}]; this.mainStars=[]; this.secretStars=[]; for(let i=0;i<20;i++)this.mainStars.push(new window.LumiGame.Star(180+i*190, i%2?430:460,false)); for(let i=0;i<3;i++)this.secretStars.push(new window.LumiGame.Star(680+i*1100,300,true)); this.checkpoints=[new window.LumiGame.Checkpoint(80,430,0,'Início'),new window.LumiGame.Checkpoint(1500,350,1,'Riacho'),new window.LumiGame.Checkpoint(2850,430,2,'Clareira')]; this.checkpoints[0].active=true; this.ancestralTree={shrineX:3900,isAwakened:false}; }
  getZoneAt(x){return x<800?'Início da Floresta':x<1600?'Cogumelos Luminosos':x<2500?'Riacho Encantado':x<3300?'Clareira das Flores':'Árvore Ancestral';}
}
window.LumiGame.LevelData=LevelData;
