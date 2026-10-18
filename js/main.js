'use strict';
/* ============ Loop ============ */
let last=performance.now(),titleCam=0,navPrev=0,acc=0;
const STEP=1/60;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(mode==='play'||mode==='continue'){acc+=dt;let n=0;while(acc>=STEP&&n<4){update(STEP);acc-=STEP;n++;}if(n>=4)acc=0;}
  else if(mode==='title'||mode==='intro'){const inp=readInput(dt),kb=((keys.ArrowDown||keys.KeyS)?1:0)-((keys.ArrowUp||keys.KeyW)?1:0),py=inp.y-kb,ny=py>.5?1:py<-.5?-1:0;
    if(mode==='title'){if(ny&&ny!==navPrev)titleNav(ny);if(inp.atk||inp.jump||inp.shoot||inp.magic)titleConfirm();}
    else{introT+=dt;updIntro(dt);if(inp.atk||inp.jump)advanceIntro();}
    navPrev=ny;}
  else if(mode==='vs')vsFrame(dt);
  else if(['story','select','controls','vssel','vsover'].includes(mode)){titleCam+=dt*18;cam.x=(Math.sin(titleCam/500)*.5+.5)*(STAGE_W-SW);}
  render();
  requestAnimationFrame(frame);
}
applyStaticLang();layers=getLayers(1);layout();titleScreen();
(document.fonts&&document.fonts.load?document.fonts.load('8px "Press Start 2P"'):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(frame));
