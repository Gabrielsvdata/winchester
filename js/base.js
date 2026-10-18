'use strict';
/* ============ Constantes ============ */
const SW=320,SH=224,LT=152,LB=214,STAGE_W=1840,GRAV=460;
const cv=document.getElementById('cv'),c=cv.getContext('2d');
c.imageSmoothingEnabled=false;
const $=s=>document.querySelector(s);
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sgn=v=>v<0?-1:1;
function seeded(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646;};}
const FONT='"Press Start 2P", monospace';

/* ============ Primitivas de pixel ============ */
function px(g,x,y,w,h,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h);}
function limb(g,x0,y0,x1,y1,w,col){g.fillStyle=col;const dx=x1-x0,dy=y1-y0,n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))));for(let i=0;i<=n;i++){g.fillRect(Math.round(x0+dx*i/n-w/2),Math.round(y0+dy*i/n-w/2),w,w);}}
const SHC={};
function shade(c,k){const key=c+k;if(SHC[key])return SHC[key];if(typeof c!=='string'||c[0]!=='#'||c.length!==7)return SHC[key]=c;
  const f=v=>Math.max(0,Math.min(255,Math.round(k>0?v+(255-v)*k:v*(1+k))));
  return SHC[key]='#'+[1,3,5].map(i=>f(parseInt(c.slice(i,i+2),16)).toString(16).padStart(2,'0')).join('');}
// membro com volume: borda clara do lado da luz e borda escura do outro
function slimb(g,x0,y0,x1,y1,w,col){limb(g,x0,y0,x1,y1,w,col);if(w<3)return;
  const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1;let nx=-dy/l,ny=dx/l;if(nx*.55+ny*-.83<0){nx=-nx;ny=-ny;}
  const o=w/2-.5,n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))));
  g.fillStyle=shade(col,.3);for(let i=0;i<=n;i++)g.fillRect(Math.round(x0+dx*i/n+nx*o-.5),Math.round(y0+dy*i/n+ny*o-.5),1,1);
  g.fillStyle=shade(col,-.35);for(let i=0;i<=n;i++)g.fillRect(Math.round(x0+dx*i/n-nx*o-.5),Math.round(y0+dy*i/n-ny*o-.5),1,1);}
function disc(g,cx,cy,r,col){g.fillStyle=col;for(let y=-r;y<=r;y++){const hw=Math.round(Math.sqrt(r*r-y*y));g.fillRect(Math.round(cx-hw),Math.round(cy+y),hw*2+1,1);}}
function icon(g,map,pal,x,y){for(let r=0;r<map.length;r++)for(let k=0;k<map[r].length;k++){const ch=map[r][k];if(ch!=='.'){g.fillStyle=pal[ch];g.fillRect(x+k,y+r,1,1);}}}
const ACC={'Á':'A´','À':'A`','Â':'A^','Ã':'A~','É':'E´','Ê':'E^','Í':'I´','Ó':'O´','Ô':'O^','Õ':'O~','Ú':'U´','Ç':'C,'};
function accent(k,x,y,u,col){c.fillStyle=col;const r=(a,b,w,h)=>c.fillRect(Math.round(x+a*u),Math.round(y+b*u),Math.max(1,Math.round(w*u)),Math.max(1,Math.round(h*u)));
  if(k==='´'){r(4,-3,2,1);r(3,-2,2,1);}else if(k==='`'){r(2,-3,2,1);r(3,-2,2,1);}else if(k==='^'){r(3,-3,1,1);r(2,-2,1,1);r(4,-2,1,1);}else if(k==='~'){r(1,-2,1,1);r(2,-3,2,1);r(4,-2,1,1);r(5,-3,1,1);}else if(k===','){r(3,7,2,1);r(4,8,1,1);r(2,9,2,1);}}
function text(s,x,y,col,size,align,shadow){s=tr(s);
  size=size||8;const u=size/8,chars=[...String(s)],w=chars.length*size;
  const x0=Math.round(align==='center'?x-w/2:align==='right'?x-w:x);y=Math.round(y);
  c.font=`${size}px ${FONT}`;c.textAlign='left';c.textBaseline='top';
  const pass=(dx,dy,colr)=>{for(let i=0;i<chars.length;i++){const ch=chars[i],a=ACC[ch],base=a?a[0]:ch.normalize('NFD').replace(/[̀-ͯ]/g,''),cx2=x0+i*size+dx;c.fillStyle=colr;c.fillText(base,cx2,y+dy);if(a)accent(a[1],cx2,y+dy,u,colr);}};
  if(shadow!==false)pass(1,1,'#000');pass(0,0,col);
}

const ICONS={
  salt:{map:['..kk..','.wwww.','wwbbww','wbwwbw','wwbbww','.wwww.'],pal:{k:'#8a7a5a',w:'#f2f0ea',b:'#3a6ab0'}},
  pie:{map:['...cccc...','.cRcRRcRc.','cRRcRRcRRc','cccccccccc','.dddddddd.'],pal:{c:'#e0a050',R:'#a8283a',d:'#7a4a22'}},
  mem:{map:['..yy..','.yyyy.','yywwyy','yywwyy','.yyyy.','..yy..'],pal:{y:'#9fd8ff',w:'#ffffff'}},
  burger:{map:['.bbbbbb.','bbwbbwbb','gggggggg','mmmmmmmm','yyyyyyyy','.bbbbbb.'],pal:{b:'#d0882a',w:'#f4e4b0',g:'#4a9a3a',m:'#6a2a1a',y:'#e8c02a'}},
};

/* ============ Boneco de pixel ============ */
const BUF=72,OX=36,OY=66;
function mk(){const k=document.createElement('canvas');k.width=k.height=BUF;const g=k.getContext('2d');g.imageSmoothingEnabled=false;return[k,g];}
const [buf,bg]=mk(),[sil,sg]=mk(),[sil2,sg2]=mk();

const LOOKS={
  dean:{skin:'#eab68c',hair:'#9a7040',style:'short',jacket:'#64401f',jacketD:'#432a14',shirt:'#4e5c44',pants:'#3e4e72',pantsD:'#2a3652',boots:'#1c1410',weapon:'#8c949e',gun:'shotgun',tall:0},
  sam:{skin:'#eab892',hair:'#5c3a1c',style:'long',jacket:'#8e3026',jacketD:'#5e1c16',plaid:'#5a1610',shirt:'#c8b89a',pants:'#3a4a74',pantsD:'#283454',boots:'#2a1e14',weapon:'#9aa2ac',gun:'pistol',tall:3},
  john:{skin:'#e0aa82',hair:'#3a2a1c',style:'short',beard:'#3a2a1c',jacket:'#3c3a30',jacketD:'#28261e',shirt:'#6a6458',pants:'#2e3444',pantsD:'#1e2230',boots:'#1a1410',weapon:'#b8bec6',gun:'rifle',tall:2},
  bobby:{skin:'#e2ae88',hair:'#6a5a4a',style:'cap',cap:'#7a3a1a',beard:'#8a7a6a',jacket:'#4a5a3a',jacketD:'#323e28',shirt:'#8a4a32',plaid:'#5a2a1a',pants:'#3a3a44',pantsD:'#26262e',boots:'#2a1e14',weapon:'#8c949e',gun:'flask',tall:1},
  cas:{skin:'#ecc4a0',hair:'#2a2018',style:'messy',jacket:'#b49a6a',jacketD:'#8a7448',shirt:'#e8e8e8',tie:'#2a3a6a',pants:'#2a2a30',pantsD:'#1c1c22',boots:'#141414',weapon:'#dfe6ee',tall:2},
  johnSpirit:{skin:'#bcd4e4',hair:'#4a5a6c',style:'short',beard:'#4a5a6c',jacket:'#6a84a0',jacketD:'#4c6280',shirt:'#9ab0c4',pants:'#4a5a74',pantsD:'#36445a',boots:'#2a3444',tall:2},
  luther:{skin:'#d6cccc',hair:'#2a1a14',style:'short',beard:'#2a1a14',jacket:'#2a1a16',jacketD:'#1a100c',shirt:'#5a1a1a',pants:'#1e1e24',pantsD:'#141418',boots:'#0e0a08',eye:'#ff2020',fangs:true,tall:5},
  meg:{skin:'#ecc8a8',hair:'#d8b060',style:'woman',jacket:'#2a1f2c',jacketD:'#1a141c',shirt:'#5a2a3a',pants:'#1c1820',pantsD:'#141018',boots:'#0c0a0c',eye:'#000',tall:1},
  azazel:{skin:'#d8ac88',hair:'#5a5550',style:'short',jacket:'#4a5a78',jacketD:'#34405a',shirt:'#8a8270',pants:'#2e3648',pantsD:'#1e2432',boots:'#1a1410',eye:'#ffd400',tall:4},
  woman:{skin:'#e2ecf2',hair:'#0a0a12',style:'woman',dress:'#f0f4f8',dressD:'#a8b4c2',jacket:'#e6ecf2',jacketD:'#b0bcc8',shirt:'#f8fbfc',eye:'#000',skirt:true,tall:5,boots:'#000'},
};
LOOKS.jake={skin:'#7a5034',hair:'#141010',style:'short',jacket:'#4a5232',jacketD:'#343a22',shirt:'#6a6a50',pants:'#3a3e2a',pantsD:'#282c1c',boots:'#1a1410',tall:4};
LOOKS.ava={skin:'#ecc4a4',hair:'#2a1a12',style:'woman',jacket:'#5a3a5a',jacketD:'#3c263c',shirt:'#a07890',pants:'#2a2a3a',pantsD:'#1c1c28',boots:'#141014',tall:0};
const ACHERI={skin:'#e4cfc4',hair:'#3a2a1a',style:'woman',jacket:'#b8a8b8',jacketD:'#8a7a8a',shirt:'#d8c8d8',dress:'#b8a8b8',dressD:'#8a7a8a',skirt:true,eye:'#000',boots:'#2a2020',tall:-8};
const GHOSTS=[
  {skin:'#b6ccd8',hair:'#334454',style:'short',jacket:'#566a80',jacketD:'#3c4c5e',shirt:'#90a4b4',pants:'#3a4656',pantsD:'#283240',boots:'#1a2230',eye:'#000'},
  {skin:'#bcd0d8',hair:'#2a3038',style:'short',jacket:'#6a5c7c',jacketD:'#483e58',plaid:'#3a304a',shirt:'#a0a8b8',pants:'#3a4250',pantsD:'#262e3a',boots:'#161c26',eye:'#000',tall:2},
  {skin:'#b0c8cc',hair:'#4a4a3a',style:'short',jacket:'#4a6a62',jacketD:'#324a44',shirt:'#8aa098',pants:'#404a4a',pantsD:'#2a3232',boots:'#182020',eye:'#000',tall:1},
];
const SCREAMER={skin:'#c6d8e4',hair:'#141420',style:'woman',jacket:'#7a8ca4',jacketD:'#56647a',shirt:'#a8b8cc',dress:'#8a9cb4',dressD:'#5a6a82',skirt:true,eye:'#000',boots:'#000',tall:1};

function drawPuppet(g,L,P){
  g.clearRect(0,0,BUF,BUF);
  const T=L.tall||0,th=10+T*.4,sh=10+T*.4,tor=17+T*.5,ua=8,fa=8;
  const hipX=OX,hipY=OY-th-sh+(P.crouch||0);
  const neckX=hipX+(P.lean||0),neckY=hipY-tor;
  const leg=(a,col)=>{const kx=hipX+Math.sin(a[0])*th,ky=hipY+Math.cos(a[0])*th,s=a[0]-a[1],fx=kx+Math.sin(s)*sh,fy=ky+Math.cos(s)*sh;slimb(g,hipX,hipY,kx,ky,4,col);slimb(g,kx,ky,fx,fy,4,col);px(g,fx-1,fy-1,5,3,L.boots);};
  const arm=(a,col)=>{const sx=neckX,sy=neckY+3,ex=sx+Math.sin(a[0])*ua,ey=sy+Math.cos(a[0])*ua,s=a[0]+a[1],hx=ex+Math.sin(s)*fa,hy=ey+Math.cos(s)*fa;slimb(g,sx,sy,ex,ey,4,col);slimb(g,ex,ey,hx,hy,3,col);px(g,hx-1,hy-1,3,3,L.skin);return{hx,hy,s};};
  if(L.skirt){
    const flow=P.flow||0;
    for(let y=Math.round(hipY-3);y<=OY;y++){const k=(y-hipY+3)/(OY-hipY+3),w=Math.round(5+k*8+Math.sin(y*.5+flow)*1.2),x=hipX+(P.lean||0)*(1-k)*.4;px(g,x-w,y,w,1,L.dressD);px(g,x,y,w+1,1,L.dress);}
  }else leg(P.bl,L.pantsD);
  arm(P.ba,L.jacketD);
  slimb(g,hipX,hipY-2,neckX,neckY+3,9,L.jacket);
  if(L.plaid){for(let y=Math.round(neckY+5);y<hipY-1;y+=3){const k=(hipY-y)/(hipY-neckY),x=hipX+(neckX-hipX)*k;px(g,x-4,y,9,1,L.plaid);}for(let d=-3;d<=3;d+=3)limb(g,hipX+d,hipY-3,neckX+d,neckY+4,1,L.plaid);}
  limb(g,hipX+2,hipY-3,neckX+2,neckY+5,3,L.shirt);
  if(L.tie)limb(g,hipX+2,hipY-6,neckX+2,neckY+5,1,L.tie);
  if(!L.skirt){px(g,hipX-4,hipY-3,9,2,'#1a1410');leg(P.fl,L.pants);}
  const hx=neckX+1,hy=neckY-4;
  if(L.style==='woman'){px(g,hx-6,hy-3,5,15,L.hair);}
  disc(g,hx,hy,4,L.skin);px(g,hx-4,hy,1,3,shade(L.skin,-.3));px(g,hx-2,hy+3,4,1,shade(L.skin,-.22));px(g,hx+1,hy-3,2,1,shade(L.skin,.25));
  g.fillStyle=L.hair;
  if(L.style==='short'){g.fillRect(hx-4,hy-5,9,3);g.fillRect(hx-4,hy-3,2,3);g.fillRect(hx+3,hy-4,2,1);}
  else if(L.style==='long'){g.fillRect(hx-4,hy-5,9,3);g.fillRect(hx-5,hy-3,3,7);g.fillRect(hx+2,hy-3,3,2);}
  else if(L.style==='woman'){g.fillRect(hx-5,hy-5,10,3);g.fillRect(hx-5,hy-3,3,9);g.fillRect(hx+3,hy-3,2,6);}
  else if(L.style==='messy'){g.fillRect(hx-4,hy-5,9,3);g.fillRect(hx-3,hy-6,2,1);g.fillRect(hx+1,hy-6,2,1);g.fillRect(hx-4,hy-3,2,2);}
  else if(L.style==='cap'){g.fillRect(hx-4,hy-3,2,3);g.fillStyle=L.cap;g.fillRect(hx-5,hy-6,10,3);g.fillRect(hx+2,hy-4,5,1);}
  if(L.style!=='cap')px(g,hx-1,hy-5,4,1,shade(L.hair,.35));
  if(P.mouth){px(g,hx+1,hy+1,3,3,'#000');if(L.fangs){px(g,hx+1,hy+1,1,1,'#fff');px(g,hx+3,hy+1,1,1,'#fff');}}
  if(L.beard){px(g,hx-1,hy+2,5,2,L.beard);px(g,hx-3,hy,2,3,L.beard);}
  px(g,hx+2,hy-1,1,2,L.eye||'#1a1010');
  if(L.eye==='#000'){px(g,hx+1,hy-1,2,2,'#000');}
  const f=arm(P.fa,L.jacket);
  if(P.colt){px(g,f.hx-2,f.hy-2,10,2,'#c8ccd4');px(g,f.hx-3,f.hy-1,3,3,'#6a4a2a');px(g,f.hx+6,f.hy-3,2,1,'#fff');}
  else if(P.gun&&L.gun){if(L.gun==='flask'){px(g,f.hx-1,f.hy-6,4,6,'#7ab8f0');px(g,f.hx,f.hy-8,2,2,'#d8d0c0');}
    else{const len=L.gun==='rifle'?20:L.gun==='shotgun'?17:10,stock=L.gun==='pistol'?'#22252c':'#5a3a22';px(g,f.hx-2,f.hy-2,len,2,'#22252c');px(g,f.hx-4,f.hy-1,4,3,stock);px(g,f.hx+len-4,f.hy-3,2,1,'#888');}}
  else if(P.weapon!==false&&L.weapon){const wx=f.hx+Math.sin(f.s)*13,wy=f.hy+Math.cos(f.s)*13;limb(g,f.hx,f.hy,wx,wy,2,L.weapon);px(g,wx-1,wy-1,2,2,'#d0d8e0');}
  if(P.claw){px(g,f.hx+1,f.hy-1,2,1,'#fff');px(g,f.hx+1,f.hy+1,2,1,'#fff');}
  if(P.spray){px(g,f.hx-1,f.hy-5,3,6,'#c83020');px(g,f.hx,f.hy-6,1,1,'#dddddd');}
  if(P.bag){px(g,f.hx-2,f.hy-6,5,6,'#f2f0ea');px(g,f.hx-1,f.hy-4,3,2,'#3a6ab0');px(g,f.hx-1,f.hy-7,3,1,'#8a7a5a');}
}
function silhouette(g,col){g.globalCompositeOperation='source-over';g.clearRect(0,0,BUF,BUF);g.drawImage(buf,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,BUF,BUF);g.globalCompositeOperation='source-over';}
function blit(x,y,face,o){
  silhouette(sg,o.outline||'#07060d');
  c.save();c.globalAlpha=o.alpha==null?1:o.alpha;c.translate(Math.round(x),Math.round(y));
  if(face<0)c.scale(-1,1);if(o.rot)c.rotate(o.rot);
  for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(sil,-OX+dx,-OY+dy);
  if(o.glitch){for(let y0=0;y0<BUF;y0+=4){const off=Math.random()<o.glitch?Math.round(rand(-4,4)):0;c.drawImage(buf,0,y0,BUF,4,-OX+off,-OY+y0,BUF,4);}}
  else c.drawImage(buf,-OX,-OY);
  if(o.flash>0){silhouette(sg2,'#ffffff');c.globalAlpha=(o.alpha==null?1:o.alpha)*.85;c.drawImage(sil2,-OX,-OY);}
  c.restore();
}

/* ============ Poses ============ */
function poseFor(e){
  const s=e.st,k=e.stT,t=e.t;
  const P={lean:0,crouch:0,fl:[.12,.1],bl:[-.12,.1],fa:[.35,.6],ba:[-.2,.4]};
  const walk=(amp,lean)=>{const ph=Math.sin(e.ph);P.fl=[ph*amp,Math.max(0,-ph)*amp*1.5];P.bl=[-ph*amp,Math.max(0,ph)*amp*1.5];P.fa=[-ph*amp+.35,.6+amp*.4];P.ba=[ph*amp,.4];P.lean=lean;P.crouch=Math.abs(ph)>.7?0:1;};
  switch(s){
    case 'idle':case 'float':P.crouch=Math.sin(t*3)>0?1:0;break;
    case 'walk':walk(.55,0);break;
    case 'run':walk(.95,3);break;
    case 'atk':{const q=k/e.dur;P.fl=[.35,.1];P.bl=[-.35,.15];
      if(e.step===0){P.fa=q<.35?[-.7,1.1]:[1.55,0];P.lean=q<.35?-1:2;}
      else if(e.step===1){P.fa=q<.35?[2.9,.3]:[.85,.15];P.lean=q<.35?-1:2;}
      else{P.fl=q<.3?[.7,1.5]:[1.6,0];P.bl=[-.2,.1];P.lean=-2;P.fa=[.6,.6];P.ba=[-.7,.5];}
      break;}
    case 'jump':if(e.jatk){P.fl=[1.5,0];P.bl=[-.4,1.4];P.fa=[.3,.5];P.lean=-1;}else{P.fl=[.7,1.3];P.bl=[-.3,1];P.fa=[1.9,.6];P.ba=[-1.2,.6];}break;
    case 'runatk':P.lean=4;P.fa=[1.45,0];P.ba=[1.2,.2];P.fl=[.6,.4];P.bl=[-.8,.6];break;
    case 'shoot':P.fa=[1.57,0];P.ba=[1.4,.2];P.gun=true;P.colt=!!e.colt;P.lean=(k>.12&&k<.22)?-2:0;if(e.kind==='player'&&heroFor(hero).shot==='blink'&&!e.colt){P.gun=false;P.fa=[1.4,0];}break;
    case 'magic':
      if(e.kind==='player'&&['salt','trap'].includes(heroFor(hero).mg)){P.crouch=k<.12?2:5;P.lean=3;P.fl=[.9,1.6];P.bl=[-.3,1.9];P.fa=[1.0+Math.sin(k*14)*.25,.35];P.ba=[.5,.7];P.weapon=false;P.bag=hero==='dean'&&k<1;P.spray=hero==='bobby'&&k<.6;}
      else if(e.kind==='player'&&heroFor(hero).mg==='spin'){P.fa=[1.57,0];P.ba=[1.57,0];}
      else{P.fa=[3.05,0];P.ba=[2.8,0];P.weapon=false;P.crouch=k<.3?2:0;}
      break;
    case 'hurt':P.lean=-3;P.fa=[-.9,.7];P.ba=[-1.3,.4];P.fl=[.3,.2];P.bl=[-.3,.2];break;
    case 'windup':P.fa=[-.9,.9];P.ba=[-.5,.6];P.lean=-2;P.claw=true;P.weapon=false;break;
    case 'eatk':P.fa=[1.5,.05];P.ba=[1.2,.3];P.lean=3;P.claw=true;P.weapon=false;break;
    case 'recover':P.fa=[.9,.4];P.lean=1;P.weapon=false;break;
    case 'jwind':P.fa=[2.9,.2];P.ba=[2.7,.2];P.lean=-2;P.crouch=k>.4?2:0;P.weapon=false;break;
    case 'summon':P.fa=[2.6,.4];P.ba=[2.4,.4];P.lean=-1;P.weapon=false;break;
    case 'scream':case 'swind':case 'cast':P.fa=[2.3,.5];P.ba=[2.1,.5];P.lean=-2;P.mouth=k>.25;P.weapon=false;break;
    case 'cwind':P.fa=[1.3,.2];P.ba=[1.1,.3];P.lean=-3;P.claw=true;break;
    case 'charge':P.fa=[1.6,0];P.ba=[1.4,.1];P.lean=5;P.claw=true;P.mouth=true;break;
    case 'bwind':P.fa=[2.6,.8];P.lean=-2;P.claw=true;break;
    case 'air':case 'down':case 'dead':case 'dying':P.fl=[.1,0];P.bl=[-.1,0];P.fa=[2.6,.3];P.ba=[2.9,.2];P.weapon=e.kind==='player'?true:false;break;
    case 'getup':P.crouch=3;P.fa=[.8,.8];break;
    case 'lwind':P.fa=[1.3,.2];P.ba=[1.1,.3];P.lean=-3;P.claw=true;P.mouth=true;break;
    case 'lunge':P.fa=[1.6,0];P.ba=[1.4,.1];P.lean=5;P.claw=true;P.mouth=true;P.fl=[.8,.3];P.bl=[-.9,.5];break;
    case 'throw':P.fa=k<.45?[2.8,.5]:[1.4,0];P.ba=[-.4,.5];P.lean=k<.45?-2:3;break;
    case 'pinw':P.fa=[2.0,0];P.ba=[-.4,.6];P.lean=-1;break;
    case 'hold':P.fa=[1.5,.3];P.ba=[1.3,.4];P.lean=2;break;
    case 'esc':P.fa=[1.57,0];P.ba=[1.57,0];P.fl=[.5,.3];P.bl=[-.5,.3];P.crouch=1;break;
    case 'held':P.fa=[-.5,.2];P.ba=[-.7,.2];P.lean=-2;P.crouch=1;P.mouth=true;break;
    case 'drop':P.fl=[.6,1.2];P.bl=[-.3,1];P.fa=[2.2,.4];P.ba=[-1.5,.5];break;
    case 'bstrike':P.fa=[1.5,.05];P.ba=[1.2,.3];P.lean=3;P.claw=true;break;
    case 'vanish':case 'appear':case 'bout':case 'bin':break;
  }
  if(e.kind!=='player')P.weapon=false;
  P.flow=t*6;
  return P;
}

