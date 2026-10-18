'use strict';
/* ============ Acabamento visual: roupas, olhos, golpes, mortes e luz ============ */
// roupas que marcam cada personagem
LOOKS.cas.coat=LOOKS.cas.jacket;LOOKS.cas.coatLen=15;
LOOKS.lucicas.coat=LOOKS.lucicas.jacket;LOOKS.lucicas.coatLen=15;
LOOKS.crowley.coat='#101014';LOOKS.crowley.coatLen=13;
LOOKS.dean.collar='#7a5230';LOOKS.deanMark.collar='#3e322a';LOOKS.john.collar='#4e4c40';

// olhos que brilham no escuro
const EYEGLOW={'#ffd400':'#ffd400','#ff2020':'#ff3020','#ff2a1a':'#ff3020','#ffffff':'#ffffff','#9fd8ff':'#9fd8ff'};
function eyeGlow(e,L,x,y){
  let col=EYEGLOW[L.eye];
  if(e===P){const H=heroFor(hero);if(H.mg==='neph'&&P.st==='magic')col='#ffc020';else if(H.mg==='smite'&&P.st==='magic')col='#bfe8ff';}
  if(!col||e.alpha<.5)return;
  const ex=Math.round(x+e.face*(PUP.hx+2-OX)),ey=Math.round(y+(PUP.hy-OY));
  c.globalCompositeOperation='lighter';c.globalAlpha=.35+.2*Math.sin((e.t||0)*6);disc(c,ex,ey,3,col);c.globalAlpha=.9;px(c,ex-1,ey,3,1,col);
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
}

// rastro da arma
const ARCCOL={salt:'#ffffff',iron:'#ffe0b0',blade:'#e8f4ff',rubyknife:'#f4e8e8',machete:'#ffffff',holy:'#a8d4ff',smite:'#fff2b0',psychic:'#d0b0ff'};
function swingArc(p,r,big,tag,down){addFx({k:'arc',x:p.x,y:p.y-p.z,face:p.face,r,dur:.15,col:ARCCOL[tag]||'#ffffff',big,down});}

// o impacto muda conforme a arma e a criatura
function impactFx(b,tag,dir){
  const x=b.x,y=b.y,z=b.z+30,P0=(n,col,sp,up,grav,size)=>{for(let i=0;i<n;i++)parts.push({x:x+rand(-4,4),y:y+rand(-2,2),z:z+rand(-6,6),vx:-dir*rand(10,sp)*(Math.random()<.3?-1:1),vy:0,vz:rand(up[0],up[1]),life:.45,max:.45,col:Array.isArray(col)?col[(Math.random()*col.length)|0]:col,size:size||1,grav:grav?1:0});};
  const cl=CLS[b.type];
  if(tag==='salt')P0(10,['#ffffff','#e8e8f0'],70,[-20,60]);
  else if(tag==='iron')P0(7,['#ffb040','#ffe080'],90,[20,90],true);
  else if(tag==='holy'){if(cl==='demon'){P0(8,['#e8e8e8','#b8b8c0'],20,[30,70],false,2);if(Math.random()<.4)floatMsg('TSSS',x,y);}else P0(6,'#9fd0ff',50,[10,60],true);}
  else if(tag==='smite')P0(9,['#fff2b0','#ffffff'],40,[40,110]);
  else if(tag==='psychic')P0(7,['#c8a0ff','#8a60e0'],60,[0,50]);
  else if(['blade','rubyknife','machete'].includes(tag)){if(cl==='demon'||cl==='dark')P0(6,'#120c10',60,[10,70],true,2);else if(cl==='ghost')P0(6,'#9fe8ff',40,[10,50]);else if(cl==='angel')P0(6,'#ffffff',40,[20,70]);else P0(6,['#8a1010','#5a0808'],60,[10,70],true,2);}
  if(cl==='ghost'&&tag!=='salt')P0(4,'#9fe8ff',30,[10,40]);
}

// assinatura visual de cada magia
function magicSignature(p,H){
  if(H.mg==='smite')addFx({k:'wings',follow:true,dur:1.3,back:true});
  else if(H.mg==='neph')addFx({k:'wings',follow:true,dur:1.3,back:true,gold:true});
  else if(H.mg==='contract')addFx({k:'sigil',x:p.x,y:p.y,dur:1.1,back:true});
  else if(H.mg==='psy'||H.mg==='blood')addFx({k:'ripple',follow:true,dur:.9,col:H.mg==='blood'?'#c83a3a':'#b080ff'});
  else if(H.mg==='mark')addFx({k:'ripple',follow:true,dur:.7,col:'#c81a10'});
}

// mortes como na série
const _enemyFalls=enemyFalls;
enemyFalls=function(e){
  _enemyFalls(e);
  const z0=e.z+44,P0=(n,col,vz,size,life)=>{for(let i=0;i<n;i++)parts.push({x:e.x+e.face*2+rand(-2,2),y:e.y,z:z0+rand(-3,3),vx:rand(-12,12),vy:0,vz:rand(vz[0],vz[1]),life:life||.9,max:life||.9,col:Array.isArray(col)?col[(Math.random()*col.length)|0]:col,size:size||3,grav:0});};
  if(e.hound){P0(16,['#ff8a1a','#ffd23a','#c81a10'],[20,80],2);return;}
  const hx=e.x-e.face*46,hy=e.y-6; // a cabeça de quem está caído
  if(e.demon){e.flashCol='#ff9a2a';e.flash=.4;addFx({k:'smokeout',x:hx,y:hy,dur:.9});P0(5,'#ff9a2a',[20,60],1,.4);return;} // a fumaça sai pela boca
  if(e.angel){e.flashCol='#ffffff';e.flash=.6;addFx({k:'rays',x:hx,y:hy-4,dur:.8});return;}
  if(e.ghost){P0(16,['#ff8a1a','#ffd23a','#ffffff'],[20,70],2);return;} // o espírito queima
  if(e.dark){P0(14,'#000000',[20,60],3);return;}
  if(e.ai==='vp'){P0(10,['#8a1010','#5a0808'],[10,50],2,.6);}
};
const _bossDie=bossDie;
bossDie=function(b){
  _bossDie(b);
  if(b.demon)addFx({k:'smokeout',x:b.x+b.face*3,y:b.y-50,dur:1.4,big:true});
  if(b.demon){b.flashCol='#ff9a2a';b.flash=.6;}
  if(['lucicas','chuck','amara'].includes(b.type))addFx({k:'rays',x:b.x,y:b.y-44,dur:1});
};

// fumaça saindo pela boca do demônio
function updFx2(dt){for(const f of fxs)if(f.k==='smokeout'&&f.t<f.dur*.8)for(let i=0;i<(f.big?5:3);i++)parts.push({x:f.x+rand(-2,2),y:f.y+30,z:30+rand(-2,2),vx:rand(-10,10),vy:0,vz:rand(60,130),life:rand(.7,1.1),max:1.1,col:Math.random()<.7?'#060408':'#2a1a30',size:Math.random()<.5?4:3,grav:0});}
// efeitos novos: rastro, asas, selo, ondas e raios de luz
function drawFx2(cx,back){
  for(const f of fxs){if(!!f.back!==back||!['arc','wings','sigil','ripple','rays'].includes(f.k))continue;
    const k=f.t/f.dur,a=Math.max(0,1-k),x=Math.round((f.follow?P.x:f.x)-cx),y=Math.round((f.follow?P.y-P.z:f.y));
    if(f.k==='arc'){c.save();c.translate(x+f.face*4,y-28);if(f.face<0)c.scale(-1,1);
      const s0=f.down?-1.3:-1.1,s1=f.down?1.2:.6,e1=s0+(s1-s0)*Math.min(1,k*2.2);
      c.globalAlpha=a*.9;c.strokeStyle=f.col;c.lineWidth=f.big?4:3;c.beginPath();c.arc(0,0,f.r,s0,e1);c.stroke();
      c.globalAlpha=a;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(0,0,f.r-2,s0,e1);c.stroke();c.restore();}
    else if(f.k==='wings'){const open=Math.min(1,k*3.5),flick=Math.floor(f.t*12)%5!==2;if(!flick)continue;
      c.globalAlpha=Math.min(.7,a*1.3);c.fillStyle=f.gold?'#4a3608':'#08080e';
      for(const s of[-1,1])for(let i=0;i<44;i++){const t2=i/44,bx=x+s*(6+t2*96*open),by=y-46-Math.sin(t2*Math.PI*.9)*34*open+t2*8,drop=Math.round((1-t2)*34+10);
        c.fillRect(Math.round(bx)-1,Math.round(by),3,drop);}
      c.globalAlpha=Math.min(.5,a)*(f.gold?1:.6);c.fillStyle=f.gold?'#ffd23a':'#cfe8ff';
      for(const s of[-1,1])for(let i=0;i<44;i+=2){const t2=i/44,bx=x+s*(6+t2*96*open),by=y-46-Math.sin(t2*Math.PI*.9)*34*open+t2*8;c.fillRect(Math.round(bx),Math.round(by)-1,2,1);}}
    else if(f.k==='sigil'){c.globalAlpha=Math.min(1,a*1.5);c.strokeStyle='#c81a10';c.lineWidth=1;c.beginPath();c.ellipse(x,y,34,11,0,0,Math.PI*2);c.stroke();
      c.beginPath();for(let i=0;i<=5;i++){const ang=f.t*2-Math.PI/2+i*Math.PI*4/5;const qx=x+Math.cos(ang)*30,qy=y+Math.sin(ang)*10;i?c.lineTo(qx,qy):c.moveTo(qx,qy);}c.stroke();}
    else if(f.k==='ripple'){for(let i=0;i<3;i++){const rr=(k*60+i*14)%70;c.globalAlpha=a*(1-rr/70);c.strokeStyle=f.col;c.lineWidth=1;c.beginPath();c.ellipse(x,y-26,rr,rr*.7,0,0,Math.PI*2);c.stroke();}}
    else if(f.k==='rays'){c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,a*1.4);c.strokeStyle='#fff6d8';c.lineWidth=3;disc(c,x,y,Math.round(8*a)+2,'#ffffff');
      for(let i=0;i<12;i++){const ang=i/12*Math.PI*2+f.t,l=20+k*70;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(ang)*l,y+Math.sin(ang)*l*.8);c.stroke();}c.globalCompositeOperation='source-over';}
  }
  c.globalAlpha=1;
}

// luz dinâmica: o cenário escurece e as fontes de luz abrem o escuro
const DARK={1:.16,2:.15,3:.14,4:.16,5:.18,6:.12,7:.16,8:.15,9:.13,10:.08,11:.18,12:.15,13:.2,14:.1,15:0};
const LIGHTP={bullet:[22,'rgba(255,220,120,.35)'],rifle:[26,'rgba(255,230,150,.4)'],colt:[44,'rgba(255,220,80,.6)'],yfire:[36,'rgba(255,200,40,.45)'],redfire:[36,'rgba(255,90,30,.45)'],
  light:[48,'rgba(255,255,255,.45)'],flask:[20,'rgba(120,180,255,.3)'],tk:[18,'rgba(150,210,255,.3)'],wave:[28,'rgba(130,220,240,.35)'],shock:[16,'rgba(200,180,140,.2)'],page:[14,'rgba(255,250,230,.2)'],hound:[16,'rgba(255,60,20,.25)']};
let lightCv=null,lgc=null;
function drawLighting(cx){
  const d=DARK[chapter]||0;if(!d||!P)return;
  if(!lightCv){lightCv=document.createElement('canvas');lightCv.width=SW;lightCv.height=SH;lgc=lightCv.getContext('2d');}
  lgc.globalCompositeOperation='source-over';lgc.clearRect(0,0,SW,SH);lgc.fillStyle=`rgba(4,3,12,${d})`;lgc.fillRect(0,0,SW,SH);
  lgc.globalCompositeOperation='destination-out';
  const hole=(x,y,r,a)=>{const g=lgc.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');lgc.fillStyle=g;lgc.fillRect(x-r,y-r,r*2,r*2);};
  hole(P.x-cx,P.y-P.z-26,80,.75);
  for(const q of projs){const L=LIGHTP[q.kind];if(L)hole(q.x-cx,q.y-q.z,L[0]*1.4,1);}
  for(const f of fxs)if(['pillar','bolt','tk','ring','tornado','wings','rays'].includes(f.k))hole((f.follow?P.x:f.x)-cx,(f.follow?P.y:f.y)-30,90,1);
  for(const r of saltRings)hole(r.x-cx,r.y,r.r+20,.6);
  c.drawImage(lightCv,0,0);
  c.globalCompositeOperation='lighter';
  for(const q of projs){const L=LIGHTP[q.kind];if(!L)continue;const x=q.x-cx,y=q.y-q.z,g=c.createRadialGradient(x,y,0,x,y,L[0]);g.addColorStop(0,L[1]);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-L[0],y-L[0],L[0]*2,L[0]*2);}
  c.globalCompositeOperation='source-over';
}
