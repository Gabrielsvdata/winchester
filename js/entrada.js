'use strict';
/* ============ Entrada ============ */
const keys={},edge={atk:0,jump:0,shoot:0,magic:0};
let touchMode=false;
const stick={id:null,x:0,y:0,full:0};
let lastTap={dir:0,t:0},runKeyDir=0;
const KMAP={Enter:'atk',KeyJ:'atk',KeyZ:'atk',KeyK:'jump',KeyX:'jump',Space:'jump',KeyL:'shoot',KeyC:'shoot',KeyI:'magic',KeyV:'magic'};
addEventListener('keydown',e=>{
  audioOn();
  if(['play','title','intro'].includes(mode)&&(e.code.startsWith('Arrow')||e.code==='Space'))e.preventDefault();
  if(mode==='intro'&&e.code==='Escape'){endIntro();return;}
  if(mode==='title'&&!e.repeat){if(e.code==='ArrowUp'||e.code==='KeyW'){titleNav(-1);return;}if(e.code==='ArrowDown'||e.code==='KeyS'){titleNav(1);return;}}
  if(e.code==='Escape'||e.code==='KeyP'){if(mode==='play')pause();else if(mode==='pause')resume();return;}
  if(e.repeat)return;
  keys[e.code]=true;
  if(touchMode){touchMode=false;showPad();}
  const a=KMAP[e.code];if(a)edge[a]=1;
  if(mode==='continue'&&a){doContinue();return;}
  const dir=(e.code==='ArrowRight'||e.code==='KeyD')?1:(e.code==='ArrowLeft'||e.code==='KeyA')?-1:0;
  if(dir){const now=performance.now();if(lastTap.dir===dir&&now-lastTap.t<260)runKeyDir=dir;lastTap={dir,t:now};}
});
addEventListener('keyup',e=>{keys[e.code]=false;const dir=(e.code==='ArrowRight'||e.code==='KeyD')?1:(e.code==='ArrowLeft'||e.code==='KeyA')?-1:0;if(dir&&dir===runKeyDir)runKeyDir=0;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
let gpPrev={};
function readInput(dt){
  let x=0,y=0;
  if(keys.ArrowLeft||keys.KeyA)x--;if(keys.ArrowRight||keys.KeyD)x++;if(keys.ArrowUp||keys.KeyW)y--;if(keys.ArrowDown||keys.KeyS)y++;
  let run=runKeyDir!==0&&runKeyDir===Math.sign(x);
  if(stick.id!==null){x+=stick.x;y+=stick.y;if(Math.abs(stick.x)>.9){stick.full+=dt;if(stick.full>.28)run=true;}else stick.full=0;}
  const gps=navigator.getGamepads?navigator.getGamepads():[];
  for(const gp of gps){if(!gp)continue;
    const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(Math.abs(ax)>.25)x+=ax;if(Math.abs(ay)>.25)y+=ay;
    if(gp.buttons[14]&&gp.buttons[14].pressed)x--;if(gp.buttons[15]&&gp.buttons[15].pressed)x++;if(gp.buttons[12]&&gp.buttons[12].pressed)y--;if(gp.buttons[13]&&gp.buttons[13].pressed)y++;
    if(Math.abs(ax)>.95)run=true;
    const map={2:'atk',0:'jump',1:'shoot',3:'magic'};
    for(const b in map){const p=gp.buttons[b]&&gp.buttons[b].pressed;if(p&&!gpPrev[b]){edge[map[b]]=1;audioOn();if(mode==='continue')doContinue();}gpPrev[b]=p;}
    const st=gp.buttons[9]&&gp.buttons[9].pressed;if(st&&!gpPrev.st){mode==='play'?pause():mode==='pause'&&resume();}gpPrev.st=st;
    break;}
  x=clamp(x,-1,1);y=clamp(y,-1,1);if(invertT>0&&mode==='play'){x=-x;y=-y;}
  const r={x,y,run,atk:!!edge.atk,jump:!!edge.jump,shoot:!!edge.shoot,magic:!!edge.magic};
  edge.atk=edge.jump=edge.shoot=edge.magic=0;
  return r;
}
// toque
const stickEl=$('#stick'),knob=$('#knob');
stickEl.addEventListener('pointerdown',e=>{e.preventDefault();audioOn();stick.id=e.pointerId;try{stickEl.setPointerCapture(e.pointerId);}catch(_){}moveStick(e);});
stickEl.addEventListener('pointermove',e=>{if(e.pointerId===stick.id)moveStick(e);});
const endStick=e=>{if(e.pointerId===stick.id){stick.id=null;stick.x=stick.y=0;stick.full=0;knob.style.transform='';}};
stickEl.addEventListener('pointerup',endStick);stickEl.addEventListener('pointercancel',endStick);
function moveStick(e){const r=stickEl.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy),m=r.width/2-14;if(d>m){dx=dx/d*m;dy=dy/d*m;}stick.x=Math.abs(dx/m)<.2?0:dx/m;stick.y=Math.abs(dy/m)<.3?0:dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`;}
for(const[id,a]of[['bAtk','atk'],['bJmp','jump'],['bSht','shoot'],['bMag','magic']]){
  const b=document.getElementById(id);
  b.addEventListener('pointerdown',e=>{e.preventDefault();audioOn();edge[a]=1;b.classList.add('on');if(mode==='continue')doContinue();});
  for(const t of['pointerup','pointercancel','pointerleave'])b.addEventListener(t,()=>b.classList.remove('on'));
}
addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!touchMode){touchMode=true;showPad();layout();}},true);
$('#app').addEventListener('pointerdown',e=>{
  if(e.target.closest('button'))return;
  if(mode==='title'){
    if(!titleMenu){titleConfirm();return;}
    const r=cv.getBoundingClientRect(),y=(e.clientY-r.top)/r.height*SH;
    for(let i=0;i<MENU.length;i++)if(y>=menuY()+i*14-5&&y<menuY()+i*14+9){titleSel=i;titleConfirm();return;}
  }else if(mode==='intro'){audioOn();advanceIntro();}
});
$('#capSkip').addEventListener('click',()=>{if(mode==='intro')endIntro();});
$('#skipTut').addEventListener('click',()=>{if(tut)endTut();});
$('#pauseBtn').addEventListener('click',()=>{mode==='play'?pause():mode==='pause'&&resume();});
$('#sndBtn').addEventListener('click',()=>{audioOn();muted=!muted;$('#sndBtn').textContent=muted?'SOM OFF':'SOM ON';if(titleTrack){if(muted)titleTrack.pause();else if(TITLE_MODES.includes(mode)){titleTrack.currentTime=0;playTrack();}}});

