'use strict';
/* ============ Update ============ */
function update(dt){
  const inp=readInput(dt);
  if(mode==='continue'){contT-=dt;if(contT<=0){gameOverScreen();}return;}
  if(mode!=='play')return;
  if(hitstop>0){hitstop-=dt;return;}
  updPlayer(dt,inp);
  updTut(dt,inp);
  engageTokens();updTraps(dt);
  for(const e of ents){if(e.dead)continue;if(e.isBoss)updBoss(e,dt);else updEnemy(e,dt);}
  // projéteis
  for(const q of projs){
    q.x+=q.vx*dt;q.life-=dt;
    if(q.kind==='flask'){q.z+=q.vz*dt;q.vz-=GRAV*dt;if(q.z<=0){q.z=0;explodeFlask(q);q.dead=true;continue;}}
    if(q.life<=0||q.x<cam.x-20||q.x>cam.x+SW+20){q.dead=true;continue;}
    if(q.owner==='e'){
      const p=P;if(p.inv<=0&&!['down','air'].includes(p.st)&&Math.abs(p.y-q.y)<(q.big?9:7)&&Math.abs(p.x-q.x)<10&&p.z<14){q.dead=true;damage(p,q.dmg,q.big,sgn(q.vx),{super:true});}
    }else{
      playerProj(q);
    }
  }
  projs=projs.filter(q=>!q.dead);
  // itens
  for(const it of items){it.t+=dt;if(it.z>0||it.vz>0){it.z+=it.vz*dt;it.vz-=GRAV*dt;if(it.z<0){it.z=0;it.vz=0;}}
    if(Math.abs(it.x-P.x)<12&&Math.abs(it.y-P.y)<9&&P.z<10&&it.t>.3){it.dead=true;sfx('pick');
      if(it.type==='mem'){memGot++;const M=MEMS[memGot-1]||MEMS[0];banner={l1:M.l1,l2:M.l2,t:2.6,small:true};flash=.3;}
      else if(it.type==='salt'){P.magic=Math.min(4,P.magic+1);floatMsg('+SAL',it.x,it.y);}
      else if(isSpirit()){floatMsg('ESPÍRITO NÃO COME',it.x,it.y);}
      else{const h=it.type==='pie'?40:20;P.hp=Math.min(P.maxHp,P.hp+h);floatMsg(it.type==='pie'?'TORTA!':'+VIDA',it.x,it.y);}
      score+=50;}}
  items=items.filter(i=>!i.dead&&(i.t<25||i.type==='mem'));
  if(invertT>0)invertT-=dt;
  for(const f of fxs)f.t+=dt;updFx2(dt);fxs=fxs.filter(f=>f.t<f.dur);
  updBubbles(dt);if(P.quipT>0){P.quipT-=dt;if(P.quipT<=0)quip('start');}if(P.quipWin>0){P.quipWin-=dt;if(P.quipWin<=0)quip('win');}
  for(const d of decals)d.life-=dt;decals=decals.filter(d=>d.life>0);
  ents=ents.filter(e=>!e.dead);props=props.filter(p=>!p.dead);
  // partículas
  for(const q of parts){q.life-=dt;if(q.ring){q.r+=q.vr*dt;continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;if(q.grav){q.vz-=GRAV*dt;if(q.z<0){q.z=0;q.vz=0;q.vx*=.5;}}}
  parts=parts.filter(q=>q.life>0);if(parts.length>500)parts.splice(0,parts.length-500);
  for(const r of saltRings)if(r.r>=r.max)r.life-=dt;saltRings=saltRings.filter(r=>r.life>0);
  if(saltRain>0){saltRain-=dt;for(let i=0;i<6;i++)parts.push({screen:true,x:rand(0,SW),y:rand(-10,30),vx:rand(-10,10),vy:rand(180,260),z:0,vz:0,life:1,max:1,col:Math.random()<.5?'#ffffff':'#d8d8e0',size:2,grav:0});}
  for(const q of parts)if(q.screen){q.y+=q.vy*dt;}
  updateZones(dt);updateCam(dt);
  updAmb(dt);
  for(const m of msgs){m.life-=dt;m.y-=24*dt;}for(let i=msgs.length-1;i>=0;i--)if(msgs[i].life<=0)msgs.splice(i,1);
  if(lastFoe){lastFoe.t-=dt;if(lastFoe.t<=0||lastFoe.e.dead)lastFoe=null;}
  if(chainT>0){chainT-=dt;if(chainT<=0){if(chain>=5){score+=chain*20;floatMsg(chain+' GOLPES +'+chain*20,P.x,P.y-12);}chain=0;}}
  if(P.hp>0&&P.hp<30&&!['down','air'].includes(P.st)){beatT-=dt;if(beatT<=0){beatT=.9;sfx('beat');}}else beatT=0;
  if(banner){banner.t-=dt;if(banner.t<=0)banner=null;}
  if(goT>0)goT-=dt;
  shake=Math.max(0,shake-dt*25);flash=Math.max(0,flash-dt*2);if(dimT>0)dimT-=dt;
  if(endT>0){endT-=dt;if(endT<=0)endingScreen();}
  const sl=tr(coltReady()?'COLT':'TIRO'),sb=$('#bSht');if(sb.textContent!==sl)sb.textContent=sl;
}
const msgs=[];
let fxs=[];
function addFx(o){fxs.push(Object.assign({t:0},o));}
// cada chefe tem o seu poder de área: cor do aviso e efeito na hora do golpe
const PINSTYLE={azazel:['#ffd400','tk'],lilith:['#ffffff','light'],lilith2:['#ffffff','light'],lucifer:['#ff5a1a','hell'],lucicas:['#ff3a2a','bolt'],amara:['#8a5aaa','dark'],chuck:['#2a2018','ink']};
function pinFx(e,pn){const s=(PINSTYLE[e.type]||PINSTYLE.azazel)[1],x=pn.x,y=pn.y;
  if(s==='tk'){addFx({k:'ring',x,y,dur:.4,col:'#ffd400'});for(let i=0;i<14;i++)parts.push({x:x+rand(-20,20),y:y+rand(-4,4),z:0,vx:rand(-20,20),vy:0,vz:rand(60,140),life:.7,max:.7,col:i%3?'#5a5048':'#ffd400',size:i%3?3:2,grav:1});}
  else if(s==='light'){addFx({k:'pillar',x,y,dur:.6,col:'#ffffff',w:26});flash=Math.max(flash,.3);}
  else if(s==='hell'){addFx({k:'pillar',x,y,dur:.5,col:'#ff6a1a',w:20});for(let i=0;i<26;i++)parts.push({x:x+rand(-16,16),y:y+rand(-4,4),z:rand(0,10),vx:rand(-20,20),vy:0,vz:rand(60,170),life:.7,max:.7,col:FIRE[(Math.random()*4)|0],size:2,grav:0});}
  else if(s==='bolt'){addFx({k:'bolt',x,y,dur:.35,col:'#ff4a3a'});flash=Math.max(flash,.4);}
  else if(s==='dark')addFx({k:'tendrils',x,y,dur:.8});
  else if(s==='ink')addFx({k:'ink',x,y,dur:.7});
}
function drawFx(cx){
  for(const f of fxs){const k=f.t/f.dur,a=Math.max(0,1-k),x=Math.round((f.follow?P.x:f.x)-cx),y=Math.round(f.follow?P.y:f.y);
    if(f.k==='pillar'){const w=Math.round(f.w*(k<.2?k/.2:1));c.globalAlpha=a*.55;c.fillStyle=f.col;c.fillRect(x-w/2|0,0,w,y);c.globalAlpha=a;c.fillStyle='#ffffff';c.fillRect(x-(w/6|0),0,Math.max(2,w/3|0),y);
      c.globalAlpha=a*.6;c.fillStyle=f.col;c.beginPath();c.ellipse(x,y,f.w*1.1,f.w*.38,0,0,Math.PI*2);c.fill();}
    else if(f.k==='ring'){c.globalAlpha=a;c.strokeStyle=f.col;c.lineWidth=2;c.beginPath();c.ellipse(x,y,10+k*40,(10+k*40)/3,0,0,Math.PI*2);c.stroke();}
    else if(f.k==='bolt'){c.globalAlpha=a;for(const [col,wd] of[[f.col,3],['#ffffff',1]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();let bx=x+rand(-10,10),by=0;c.moveTo(bx,by);while(by<y-40){by+=rand(8,16);bx+=rand(-9,9);c.lineTo(bx,by);if(Math.random()<.2){c.moveTo(bx,by);c.lineTo(bx+rand(-18,18),by+rand(6,16));c.moveTo(bx,by);}}c.lineTo(x,y-36);c.stroke();}
      c.globalAlpha=a*.5;c.fillStyle=f.col;c.beginPath();c.ellipse(x,y,26,9,0,0,Math.PI*2);c.fill();}
    else if(f.k==='tendrils'){c.globalAlpha=Math.min(1,a*1.5);c.fillStyle='#050308';for(let i=0;i<7;i++){const bx=x-24+i*8,h=Math.round(Math.sin(Math.min(1,k*3)*Math.PI/2)*(30+(i*13)%20));for(let j=0;j<h;j+=2)c.fillRect(Math.round(bx+Math.sin(j*.25+i+f.t*8)*3),y-j,3,2);}
      c.globalAlpha=a*.6;c.beginPath();c.ellipse(x,y,30,10,0,0,Math.PI*2);c.fill();}
    else if(f.k==='ink'){c.globalAlpha=a;c.strokeStyle='#1a1410';c.lineWidth=4;const r=Math.min(1,k*4)*24;c.beginPath();c.moveTo(x-r,y-40-r/2);c.lineTo(x+r,y-r/2+r);c.moveTo(x+r,y-40-r/2);c.lineTo(x-r,y-r/2+r);c.stroke();
      c.fillStyle='#f2eee2';for(let i=0;i<6;i++)c.fillRect(x+Math.round(Math.cos(i*1.1+f.t*3)*k*40),y-20+Math.round(Math.sin(i*1.7)*k*30),4,3);}
    else if(f.k==='tornado'){for(let i=0;i<8;i++){const yy=y-4-i*7,r=8+i*2.6,ph=f.t*22+i;c.globalAlpha=a*.7;c.strokeStyle=i%2?f.col:'#ffffff';c.lineWidth=1;c.beginPath();c.ellipse(x,yy,r,r*.3,0,ph%(Math.PI*2),ph%(Math.PI*2)+Math.PI*1.3);c.stroke();}}
  }
  c.globalAlpha=1;
}
// clima de cada capítulo (partículas na tela)
const AMBT={1:'rain',2:'fly',3:'ash',4:'dust',5:'ember',6:'dust',7:'ember',8:'ash',9:'ember',10:'ash',11:'storm',12:'ember',13:'dark',14:'dark',15:'page'};
function updAmb(dt){
  const k=AMBT[chapter],rate={rain:40,storm:60,fly:6,ash:10,dust:12,ember:14,dark:14,page:8}[k]||0;
  const add=()=>{
    if(k==='rain'||k==='storm')amb.push({x:rand(0,SW+40),y:-6,vx:k==='storm'?-90:-40,vy:rand(230,280),l:2,c:'rgba(160,190,230,.45)',w:1,h:5});
    else if(k==='fly')amb.push({x:rand(0,SW),y:rand(60,SH),vx:rand(-6,6),vy:rand(-10,-4),l:4,c:'#d8a040',w:1,h:1,blink:1});
    else if(k==='ash')amb.push({x:rand(0,SW+30),y:-4,vx:rand(-14,-4),vy:rand(14,24),l:9,c:'#8a8690',w:1,h:1,sway:rand(0,6)});
    else if(k==='dust')amb.push({x:SW+4,y:rand(40,SH),vx:rand(-60,-30),vy:rand(-4,4),l:9,c:'rgba(190,175,150,.45)',w:2,h:1,sway:rand(0,6)});
    else if(k==='dark')amb.push({x:rand(0,SW),y:SH+4,vx:rand(-6,6),vy:rand(-26,-12),l:7,c:'rgba(0,0,0,.6)',w:3,h:3,sway:rand(0,6)});
    else if(k==='page')amb.push({x:rand(0,SW),y:-6,vx:rand(-14,14),vy:rand(16,30),l:9,c:'#f2eee2',w:3,h:2,sway:rand(0,6)});
    else amb.push({x:rand(0,SW),y:SH+4,vx:rand(-8,8),vy:rand(-34,-18),l:6,c:Math.random()<.5?'#ff8a1a':'#ffd23a',w:1,h:1,sway:rand(0,6)});};
  if(amb.length<90){if(Math.random()<rate*dt)add();if(k==='rain'||k==='storm')for(let i=0;i<Math.floor(rate*dt+Math.random());i++)add();}
  if(k==='storm'&&Math.random()<dt*.15)flash=Math.max(flash,.35);
  for(const a of amb){a.l-=dt;a.x+=(a.vx+(a.sway?Math.sin(a.l*2+a.sway)*8:0))*dt;a.y+=a.vy*dt;}
  amb=amb.filter(a=>a.l>0&&a.y<SH+8&&a.y>-10&&a.x>-10);
}
function drawAmb(){for(const a of amb){c.globalAlpha=a.blink?(.4+.6*Math.abs(Math.sin(a.l*3))):a.l<1?a.l:1;c.fillStyle=a.c;c.fillRect(Math.round(a.x),Math.round(a.y),a.w,a.h);}c.globalAlpha=1;}
function floatMsg(t,x,y){msgs.push({t,x,y,life:1});}

/* ============ Render ============ */
function render(){
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
  if((mode==='vs'||mode==='vsover')&&vs&&vs.a){renderVS();return;}
  const sx=Math.round(rand(-shake,shake)),sy=Math.round(rand(-shake,shake)*.6);
  const cx=Math.round(cam.x);
  c.drawImage(layers.sky,0,0);
  c.drawImage(layers.far,-Math.round(cx*.2),0);
  c.drawImage(layers.mid,-Math.round(cx*.5),0);
  c.translate(sx,sy);
  c.drawImage(layers.ground,-cx,layers.G0);
  if(mode==='title'||mode==='controls'){renderTitle();return;}
  if(mode==='intro'){renderIntro();return;}
  if(['story','select'].includes(mode)||!P){c.setTransform(1,0,0,1,0,0);vignette();return;}
  // sombras
  const all=[...props,...items.map(i=>Object.assign(i,{kind:'item'})),...ents,P];
  for(const e of all){if(e.kind==='item'||e.dead)continue;const w=Math.max(6,(e.isBoss?20:16)-e.z*.15);c.globalAlpha=e.kind==='enemy'?.35*(e.alpha??1):.45;c.fillStyle='#000';c.fillRect(Math.round(e.x-cx-w/2),Math.round(e.y-1),Math.round(w),3);c.fillRect(Math.round(e.x-cx-w/2+2),Math.round(e.y-2),Math.round(w-4),5);}
  for(const d of decals){c.globalAlpha=Math.min(.7,d.life/2);c.fillStyle='#0a0808';const dx=Math.round(d.x-cx),dy=Math.round(d.y);for(const s of[-1,1])for(let i=0;i<26;i++){c.fillRect(dx+s*(4+i),dy-Math.round(Math.sin(i/26*3)*4),2,1+(i%3===0?1:0));}}
  c.globalAlpha=1;
  for(const r of saltRings){const n=Math.max(12,Math.round(r.r*1.6));c.globalAlpha=Math.min(1,r.life/.8);
    for(let i=0;i<n;i++){const a=i/n*Math.PI*2,j=((i*37)%5-2)*.6;const x=Math.round(r.x-cx+Math.cos(a)*(r.r+j)),y=Math.round(r.y+Math.sin(a)*(r.r+j)/3);c.fillStyle=i%3?'#f4f2ec':'#c8d0d8';c.fillRect(x,y,2,1);}
    if(r.r<r.max){c.globalAlpha=.35;c.strokeStyle='#9fe8ff';c.lineWidth=2;c.beginPath();c.ellipse(Math.round(r.x-cx),Math.round(r.y),r.r,r.r/3,0,0,Math.PI*2);c.stroke();}}
  for(const t of traps){const a=Math.max(0,Math.min(1,t.life/.6,(t.max-t.life)/.3));c.globalAlpha=a;c.strokeStyle='#d0301c';c.lineWidth=1;const tx=Math.round(t.x-cx),ty=Math.round(t.y);
    c.beginPath();c.ellipse(tx,ty,t.r,t.r/3,0,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(tx,ty,t.r*.82,t.r*.82/3,0,0,Math.PI*2);c.stroke();
    c.beginPath();for(let i=0;i<=5;i++){const ang=-Math.PI/2+i*Math.PI*4/5,qx=tx+Math.cos(ang)*t.r*.8,qy=ty+Math.sin(ang)*t.r*.8/3;i?c.lineTo(qx,qy):c.moveTo(qx,qy);}c.stroke();}
  if(boss&&boss.pin&&boss.st==='pinw'){const k=boss.stT/.9,[pc,ps]=PINSTYLE[boss.type]||PINSTYLE.azazel,px0=Math.round(boss.pin.x-cx),py0=Math.round(boss.pin.y);
    c.globalAlpha=Math.floor(boss.stT*14)%2?.9:.4;c.strokeStyle=pc;c.lineWidth=1;c.beginPath();c.ellipse(px0,py0,24,8,0,0,Math.PI*2);c.stroke();
    c.globalAlpha=.25;c.fillStyle=pc;c.beginPath();c.ellipse(px0,py0,24*k,8*k,0,0,Math.PI*2);c.fill();
    if(ps==='light'){c.globalAlpha=.12+k*.2;c.fillStyle='#ffffff';c.fillRect(px0-2-k*6|0,0,4+k*12|0,py0);}
    else if(ps==='hell'&&Math.random()<.5)parts.push({x:boss.pin.x+rand(-20,20),y:boss.pin.y,z:0,vx:0,vy:0,vz:rand(10,40),life:.4,max:.4,col:FIRE[(Math.random()*4)|0],size:1,grav:0});
    else if(ps==='dark'&&Math.random()<.5)parts.push({x:boss.pin.x+rand(-20,20),y:boss.pin.y,z:0,vx:0,vy:0,vz:rand(10,30),life:.5,max:.5,col:'#050308',size:3,grav:0});
    else if(ps==='tk'&&Math.random()<.4)parts.push({x:boss.pin.x+rand(-20,20),y:boss.pin.y,z:0,vx:0,vy:0,vz:rand(20,50),life:.4,max:.4,col:'#7a7060',size:2,grav:0});
    c.globalAlpha=1;}
  c.globalAlpha=1;
  all.sort((a,b)=>a.y-b.y);
  drawFx2(cx,true);
  for(const e of all){
    if(e.dead)continue;
    const x=e.x-cx,y=e.y-e.z;
    if(e.kind==='item'){const ic=ICONS[e.type];const b=Math.sin(e.t*5)>0?1:0;if(e.t>20&&Math.floor(e.t*8)%2)continue;icon(c,ic.map,ic.pal,Math.round(x-ic.map[0].length/2),Math.round(y-ic.map.length-2-b));continue;}
    if(e.kind==='prop'){if(e.letter)drawLetter(e,x,y);else drawBarrel(x,y);continue;}
    if(e.hound){drawHound(e,x,y);continue;}
    if(e.kind==='player'&&e.inv>0&&e.st!=='magic'&&Math.floor(e.t*16)%2&&!['down','air'].includes(e.st))continue;
    const L=e.kind==='player'?lookFor(hero):e.look;
    if(e.type==='azazel'&&e.st==='held'&&!isSpirit()){drawPuppet(bg,L_JOHN,Object.assign(poseFor({st:'idle',stT:0,t:e.t,kind:'npc',ph:0}),{fa:[1.5,.3],ba:[1.3,.4]}));blit(x-e.face*12,y+1,e.face,{outline:'#9fd8ff',alpha:.55,glitch:.25});}
    if(e.type==='azazel'&&e.st==='held'&&isSpirit()){const sd=e.deanSide||1;drawPuppet(bg,LOOKS.dean,poseFor({st:'shoot',stT:.1,t:e.t,kind:'npc',ph:0,colt:true}));blit(x-sd*84,y+2,sd,{});}
    drawPuppet(bg,L,poseFor(e));
    if(e.kind==='player'&&(e.st==='runatk'||e.st==='esc'||(e.st==='jump'&&e.jatk)||e.st==='run')&&e.hist.length>6){
      silhouette(sg,isSpirit()?'#9fd8ff':e.st==='run'?'#5a5070':'#f2b632');
      for(const[i,a]of[[6,.18],[3,.3]]){const h=e.hist[i];c.save();c.globalAlpha=e.st==='run'?a*.6:a;c.translate(Math.round(h.x-cx),Math.round(h.y));if(e.face<0)c.scale(-1,1);c.drawImage(sil,-OX,-OY);c.restore();}}
    let rot=0,yo=0;
    if(e.st==='air')rot=-.6;else if(['down','dead','dying'].includes(e.st)&&!(e.ghost&&e.isBoss&&e.st==='dying')){rot=-Math.PI/2;yo=-2;}else if(e.st==='getup'&&e.stT<.15)rot=-.8;
    const ghost=!!e.ghost;
    let glitch=0;if(ghost){glitch=['vanish','appear','bout','bin'].includes(e.st)?.7:e.st==='dying'?.9:Math.random()<.04?.5:0;}
    const spirit=e.kind==='player'&&hero==='john'&&chapter===5;
    blit(x,y+yo,e.face,spirit?{outline:'#9fd8ff',alpha:.88,rot,glitch:Math.random()<.05?.4:0,flash:e.flash}:{outline:ghost?(e.isBoss?'#ffffff':'#7fd8f0'):(e.outline||'#07060d'),alpha:ghost?(e.alpha??1)*(e.isBoss?.95:.86):(e.alpha??1),rot,glitch,flash:e.flash,flashCol:e.flashCol});
    if(!rot)eyeGlow(e,L,x,y+yo);
    if(['windup','cwind','swind','bwind','lwind','pinw','jwind','summon','cast'].includes(e.st)||(e.st==='throw'&&e.stT<.5)||(e.st==='scream'&&e.stT<.55)){if(Math.floor(e.t*12)%2)px(c,x-1,y-58,3,6,'#ff4a3a');}
  }
  drawFx(cx);drawFx2(cx,false);drawBubbles(cx);
  // projéteis
  for(const q of projs){const x=Math.round(q.x-cx),y=Math.round(q.y-q.z);
    if(q.kind==='bullet'){px(c,x-3,y,6,1,'#ffe08a');px(c,x+(q.vx>0?2:-3),y,2,1,'#fff');}
    else if(q.kind==='rifle'){px(c,x-6,y,12,1,'#fff4c8');px(c,x+(q.vx>0?4:-6),y-1,3,3,'#ffffff');}
    else if(q.kind==='tk'){px(c,x-3,y-3,6,6,'#5a6a7a');px(c,x-2,y-2,4,2,'#8a9aaa');c.globalAlpha=.5;px(c,x-sgn(q.vx)*8,y-1,6,2,'#9fd8ff');c.globalAlpha=1;}
    else if(q.kind==='colt'){c.globalAlpha=.6;px(c,x-14,y-1,28,3,'#ffd84a');c.globalAlpha=1;px(c,x-10,y,20,1,'#ffffff');}
    else if(q.kind==='flask'){px(c,x-2,y-3,4,6,'#7ab8f0');px(c,x-1,y-5,2,2,'#d8d0c0');px(c,x-3,Math.round(q.y),6,1,'rgba(0,0,0,.4)');}
    else if(q.kind==='smoke'){for(let i=0;i<4;i++){c.globalAlpha=.9-i*.2;disc(c,x-sgn(q.vx)*i*3,y,4-i,i%2?'#2a1838':'#0a060c');}c.globalAlpha=1;px(c,x-5,Math.round(q.y),10,1,'rgba(0,0,0,.35)');}
    else if(q.kind==='knife'){px(c,x-4,y,8,1,'#d8dce4');px(c,x+(q.vx>0?-6:4),y-1,2,3,'#3a2418');}
    else if(q.kind==='hound'){const f=sgn(q.vx);c.globalAlpha=.8;px(c,x-8,y-8,16,6,'#120806');px(c,x+f*6,y-11,6,5,'#120806');for(const lx of[-6,-2,3,6])px(c,x+lx,y-3,2,4,'#120806');c.globalAlpha=1;px(c,x+f*9,y-10,2,1,'#ff3020');}
    else if(q.kind==='light'){c.globalAlpha=.9;for(let i=0;i<4;i++)px(c,x-sgn(q.vx)*i*6,y-8+i,4,16-i*2,i?'#e8f4ff':'#ffffff');c.globalAlpha=.35;px(c,x-14,y-10,28,20,'#ffffff');c.globalAlpha=1;px(c,x-6,Math.round(q.y),12,1,'rgba(255,255,255,.4)');}
    else if(q.kind==='blade'){px(c,x-5,y,10,1,'#e8e8f0');px(c,x-5,y+1,3,1,'#5a4a3a');}
    else if(q.kind==='redfire'){for(let i=0;i<4;i++)disc(c,x-sgn(q.vx)*i*3,y,5-i,['#ffd060','#ff6020','#c81a10','#5a0808'][i]);px(c,x-5,Math.round(q.y),10,1,'rgba(255,60,20,.35)');}
    else if(q.kind==='dark'){for(let i=0;i<4;i++){c.globalAlpha=.95-i*.2;disc(c,x-sgn(q.vx)*i*4,y,(q.big?7:5)-i,i%2?'#1a1420':'#000000');}c.globalAlpha=1;px(c,x-6,Math.round(q.y),12,1,'rgba(0,0,0,.4)');}
    else if(q.kind==='page'){px(c,x-4,y-5,8,10,'#f2eee2');for(let i=0;i<3;i++)px(c,x-3,y-3+i*3,6,1,'#6a6458');px(c,x-4,Math.round(q.y),8,1,'rgba(0,0,0,.3)');}
    else if(q.kind==='shock'){const f=sgn(q.vx);for(let i=0;i<4;i++){c.globalAlpha=.9-i*.2;px(c,x-f*i*4,Math.round(q.y)-6+i,3,7-i,i%2?'#8a7a60':'#c8b898');}c.globalAlpha=1;px(c,x-8,Math.round(q.y),16,1,'rgba(0,0,0,.4)');}
    else if(q.kind==='rock'){px(c,x-3,y-3,7,6,'#5a5048');px(c,x-2,y-3,4,2,'#7a7068');px(c,x-3,Math.round(q.y),7,1,'rgba(0,0,0,.4)');}
    else if(q.kind==='yfire'){for(let i=0;i<4;i++)disc(c,x-sgn(q.vx)*i*3,y,5-i,['#ffe060','#ffb020','#e86010','#a02a08'][i]);px(c,x-5,Math.round(q.y),10,1,'rgba(255,160,20,.35)');}
    else{const s=q.big?1.4:1,f=sgn(q.vx);c.globalAlpha=.85;for(let i=0;i<3;i++){const ox=x-f*i*5,h=Math.round((10+i*4)*s);px(c,ox,y-h/2,1,h,i?'#7fd8f0':'#e8fbff');px(c,ox+f,y-h/2-1,1,2,'#7fd8f0');px(c,ox+f,y+h/2-1,1,2,'#7fd8f0');}c.globalAlpha=1;
      px(c,x-6,Math.round(q.y),12,1,'rgba(127,216,240,.4)');}}
  for(const q of parts){if(q.screen)continue;c.globalAlpha=Math.max(0,q.life/q.max);
    if(q.ring){c.strokeStyle=q.col;c.lineWidth=2;c.beginPath();c.ellipse(Math.round(q.x-cx),Math.round(q.y-q.z),q.r,q.r*.45,0,0,Math.PI*2);c.stroke();}
    else px(c,q.x-cx-q.size/2,q.y-q.z-q.size/2,q.size,q.size,q.col);}
  c.globalAlpha=1;
  for(const m of msgs){c.globalAlpha=Math.min(1,m.life*3);text(m.t,m.x-cx,m.y-50,'#f2b632',8,'center');}c.globalAlpha=1;
  // primeiro plano
  fg(cx);
  c.setTransform(1,0,0,1,0,0);
  drawAmb();
  drawLighting(cx);
  if(P.hp<30&&P.hp>0&&mode==='play'){const a=.25+.2*Math.sin(performance.now()/140);c.globalAlpha=a;c.strokeStyle='#c8201a';c.lineWidth=6;c.strokeRect(3,3,SW-6,SH-6);c.globalAlpha=1;}
  if(dimT>0){c.globalAlpha=Math.min(.55,dimT*.6);c.fillStyle=heroFor(hero).mg==='psy'||heroFor(hero).mg==='blood'?'#1a0830':heroFor(hero).mg==='mark'?'#300808':'#000010';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  for(const q of parts){if(!q.screen)continue;c.globalAlpha=.9;px(c,q.x,q.y,1,3,q.col);}c.globalAlpha=1;
  vignette();
  if(flash>0){c.globalAlpha=Math.min(.8,flash);c.fillStyle='#fff';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  hud();
}
function drawLetter(e,x,y){x=Math.round(x);y=Math.round(y);const f=e.flash>0;e.flash=Math.max(0,(e.flash||0)-1/60);
  c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(x-12,y-1,24,3);c.globalAlpha=1;
  text(e.letter,x+1,y-33,'#000',24,'center',false);text(e.letter,x,y-34,f?'#ffffff':'#c8201a',24,'center',false);
  for(let i=0;i<e.lhp;i++)px(c,x-6+i*5,y+3,3,2,'#f2b632');}
function drawHound(e,x,y){ // cão do inferno: invisível, só a sombra, os olhos e o bafo
  x=Math.round(x);y=Math.round(y);const seen=e.flash>0||['air','down','dead'].includes(e.st);c.globalAlpha=seen?.85:.18;c.fillStyle='#120806';
  c.fillRect(x-10,y-14,20,7);c.fillRect(x+e.face*8,y-18,8,6);for(const lx of[-8,-3,4,8])c.fillRect(x+lx,y-8,2,8);c.fillRect(x-e.face*12,y-16,4,2);
  c.globalAlpha=e.st==='dead'?Math.max(0,1-e.stT/.6):1;px(c,x+e.face*13,y-16,2,1,'#ff3020');px(c,x+e.face*10,y-16,2,1,'#ff3020');
  if(Math.random()<.3)parts.push({x:e.x+e.face*14,y:e.y,z:12,vx:e.face*10,vy:0,vz:rand(4,10),life:.4,max:.4,col:'rgba(200,200,210,.5)',size:1,grav:0});c.globalAlpha=1;}
function drawBarrel(x,y){x=Math.round(x);y=Math.round(y);px(c,x-7,y-18,14,18,'#07060d');px(c,x-6,y-17,12,16,'#5a5e68');px(c,x-6,y-17,3,16,'#7a7e88');px(c,x+3,y-17,3,16,'#3e424a');px(c,x-6,y-12,12,1,'#3a3e46');px(c,x-6,y-6,12,1,'#3a3e46');px(c,x-8,y-20,16,3,'#6a6e78');px(c,x-2,y-22,4,2,'#3a3e46');}
function fg(cx){const R=seeded(77);for(let i=0;i<60;i++){const wx=R()*STAGE_W*1.2,x=Math.round(wx-cx*1.2);if(x<-20||x>SW+20)continue;const h=6+R()*8;c.fillStyle='#05050a';for(let k=0;k<5;k++)c.fillRect(x+k*3,SH-h+((k*7)%5),2,h);}}
let vig=null;
function vignette(){if(!vig){vig=c.createRadialGradient(SW/2,SH*.6,60,SW/2,SH*.6,220);vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(4,2,10,.55)');}c.fillStyle=vig;c.fillRect(0,0,SW,SH);}
function hud(){
  const H=heroFor(hero),p=P;
  px(c,3,3,132,32,'rgba(6,5,12,.82)');c.strokeStyle='#3a3150';c.lineWidth=1;c.strokeRect(3.5,3.5,131,31);
  // retrato
  drawPuppet(bg,lookFor(hero),{lean:0,crouch:0,fl:[0,0],bl:[0,0],fa:[0,0],ba:[0,0],weapon:false});
  const T=lookFor(hero).tall||0,hy=Math.round(OY-20-T*.8-17-T*.5-4);
  c.drawImage(buf,OX-6,hy-6,13,13,6,6,26,26);
  c.strokeStyle='#f2b632';c.strokeRect(5.5,5.5,27,27);
  text(H.name,37,6,'#efe8d6',8);text('x'+p.lives,112,6,'#f2b632',8);
  const blocks=10,f=Math.ceil(p.hp/p.maxHp*blocks);
  for(let i=0;i<blocks;i++){px(c,37+i*9,16,8,5,i<f?(p.hp<30?'#ff5a3a':'#c8392c'):'#2a1418');if(i<f)px(c,37+i*9,16,8,1,'#ff8a6a');}
  for(let i=0;i<4;i++){if(i<p.magic)icon(c,ICONS.salt.map,ICONS.salt.pal,37+i*9,24);else{c.strokeStyle='#3a3150';c.strokeRect(37.5+i*9,24.5,5,5);}}
  const rdy=p.shootCd<=0||coltReady(),sk=rdy?1:1-p.shootCd/H.shootCd;text(coltReady()?'COLT':'TIRO',76,25,rdy?'#9fe8ff':'#6a6680',6,'left',false);
  px(c,102,25,30,5,'#1a1420');px(c,102,25,Math.round(30*sk),5,rdy?(Math.floor(performance.now()/300)%2?'#9fe8ff':'#6ac8e8'):'#4a5a70');
  text(String(score).padStart(6,'0'),SW-6,7,'#f2b632',8,'right');
  if(boss&&!boss.dead){const w=110,x0=SW-6-w;
    if(boss.type==='azazel'){const held=boss.st==='held',k=held?Math.max(0,boss.stunT/6.5):boss.ctrl/boss.ctrlMax;
      text(held?(isSpirit()?'DEAN VAI ATIRAR!':'ATIRE COM O COLT!'):'CONTROLE DE AZAZEL',SW-6,18,held&&Math.floor(performance.now()/200)%2?'#ffd400':'#efe8d6',6,'right');
      px(c,x0,27,w,5,'#1a1420');px(c,x0,27,Math.round(w*k),5,held?'#9fd8ff':'#ffd400');}
    else{const HB=BOSSDEF[boss.type]&&BOSSDEF[boss.type].hud?BOSSDEF[boss.type].hud(boss):null;const col=HB?HB.col:boss.type==='woman'?'#e8f4ff':'#c8392c',k=HB?HB.k:Math.max(0,boss.hp/boss.maxHp);text(HB?HB.label:boss.name,SW-6,18,'#efe8d6',6,'right');px(c,x0,27,w,5,'#1a1420');px(c,x0,27,Math.round(w*k),5,col);px(c,x0,27,Math.round(w*k),1,'#ffffff');}}
  if(lastFoe&&!tut&&!lastFoe.e.dead){const e=lastFoe.e,k=Math.max(0,e.hp/e.maxHp);c.globalAlpha=Math.min(1,lastFoe.t*3);
    px(c,3,37,104,15,'rgba(6,5,12,.78)');text(e.fname||FOE_NAME[e.type]||'INIMIGO',7,39,'#c8c0d8',6,'left',false);px(c,7,47,96,3,'#2a1418');px(c,7,47,Math.round(96*k),3,e.type==='vp'?'#d03020':'#9fd8ff');c.globalAlpha=1;}
  if(chain>=3){const big=chain>=10;text(chain+' GOLPES',SW-6,boss?38:22,big?'#ff8a3a':'#f2b632',8,'right');}
  if(invertT>0&&Math.floor(invertT*4)%2===0)text('CONTROLES INVERTIDOS',SW/2,100,'#ff6a5a',8,'center');
  if(goT>0&&Math.floor(goT*3)%2===0){text('SIGA',SW-48,96,'#f2b632',8,'left');c.fillStyle='#f2b632';for(let i=0;i<5;i++)c.fillRect(SW-14+i,96+i,1,9-i*2);}
  if(banner){const a=Math.min(1,banner.t*2);c.globalAlpha=a;
    if(banner.small){text(banner.l1,SW/2,70,'#f2b632',8,'center');if(banner.l2)text(banner.l2,SW/2,82,'#efe8d6',8,'center');}
    else{px(c,0,70,SW,44,'rgba(0,0,0,.6)');text(banner.l1,SW/2,78,'#efe8d6',16,'center');text(banner.l2,SW/2,98,'#f2b632',8,'center');}
    c.globalAlpha=1;}
  drawTut();
  if(mode==='continue'){px(c,0,0,SW,SH,'rgba(0,0,0,.65)');text('CONTINUAR?',SW/2,80,'#efe8d6',16,'center');text(String(Math.max(0,Math.ceil(contT))),SW/2,108,'#c8392c',24,'center');text(touchMode?'TOQUE EM ATACAR':'APERTE ATACAR',SW/2,146,'#f2b632',8,'center');}
}

/* ============ Telas ============ */
const scr=$('#screen');
function show(html){scr.innerHTML=html;trDom(scr);scr.hidden=false;scr.scrollTop=0;const f=scr.querySelector('.go,.card');if(f)f.focus({preventScroll:true});}
function hideScreen(){scr.hidden=true;scr.innerHTML='';}
function showPad(){$('#pad').hidden=!(touchMode&&(mode==='play'||mode==='continue'||mode==='vs'));layout();}
let typing=null;
function typeText(el,full){full=tr(full);if(typing)clearInterval(typing);let i=0;el.textContent='';typing=setInterval(()=>{i+=1;el.textContent=full.slice(0,i);if(i>=full.length){clearInterval(typing);typing=null;}},26);el.dataset.full=full;}
