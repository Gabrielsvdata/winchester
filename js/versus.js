'use strict';
/* ============ Lutas dos Sonhos: modo versus 1x1 ============ */
Object.assign(LOOKS,{
  michael:{skin:'#eec6a2',hair:'#6a4a2a',style:'short',jacket:'#e8e8ee',jacketD:'#b8b8c4',shirt:'#ffffff',pants:'#c8c8d4',pantsD:'#9a9aa8',boots:'#8a8a96',eye:'#9fd8ff',weapon:'#e8f4ff',tall:2},
  gabriel:{skin:'#e8c09c',hair:'#8a5a2a',style:'short',jacket:'#6a4a2a',jacketD:'#4a321c',shirt:'#c8a070',pants:'#3a3a44',pantsD:'#26262e',boots:'#2a1e14',eye:'#ffd23a',weapon:'#e8f4ff',tall:0},
  raphael:{skin:'#7a5034',hair:'#141010',style:'short',jacket:'#2a2a34',jacketD:'#1a1a22',shirt:'#e0e0e8',tie:'#2a2a6a',pants:'#2a2a34',pantsD:'#1a1a22',boots:'#0a0a0a',eye:'#bfe8ff',weapon:'#e8f4ff',tall:3},
  death:{skin:'#d8ccc0',hair:'#3a3a3a',style:'short',jacket:'#0e0e12',jacketD:'#060608',shirt:'#1a1a20',tie:'#060608',pants:'#0e0e12',pantsD:'#060608',boots:'#000000',eye:'#1a1010',weapon:'#c8c8b8',coat:'#0a0a0e',coatLen:16,tall:4},
});
// ficha de cada lutador: golpes, especial (TIRO) e supergolpe (MAGIA)
const VSF={
  dean:{name:'DEAN',spd:74,dmg:[6,6,10],reach:[44,46,50],aura:null,sp:'shotgun',spName:'ESPINGARDA DE SAL',su:'fury',suName:'FÚRIA DA MARCA',quote:'Vamos dançar, filho da mãe.',win:'Ninguém mexe com a minha família.',fin:'DEAN USA A PRIMEIRA LÂMINA'},
  sam:{name:'SAM',spd:78,dmg:[5,6,9],reach:[48,50,52],aura:null,sp:'psywave',spName:'ONDA PSÍQUICA',su:'bloodhold',suName:'PODER DO SANGUE',quote:'Eu não vou dizer sim.',win:'A gente sempre dá um jeito.',fin:'SAM ESMAGA COM A MENTE'},
  cas:{name:'CASTIEL',spd:72,dmg:[7,7,11],reach:[44,46,48],aura:'#cfe8ff',sp:'blink',spName:'TELETRANSPORTE',su:'smite',suName:'PUNIÇÃO DIVINA',quote:'Eu sou um anjo do Senhor.',win:'A vontade do Céu foi feita.',fin:'CASTIEL QUEIMA OS OLHOS DELE'},
  crowley:{name:'CROWLEY',spd:66,dmg:[5,6,9],reach:[40,42,46],aura:'#c81a10',sp:'hound',spName:'CÃO DO INFERNO',su:'contract',suName:'O CONTRATO',quote:'Olá, querido.',win:'Os negócios vão muito bem.',fin:'OS CÃES ARRASTAM PARA O INFERNO'},
  lucifer:{name:'LÚCIFER',spd:68,dmg:[7,8,12],reach:[44,46,50],aura:'#ff4a1a',sp:'snap',spName:'ESTALO DE FOGO',su:'hellfire',suName:'FOGO DO INFERNO',quote:'Eu nunca menti pra você.',win:'Eu avisei.',fin:'LÚCIFER QUEIMA ATÉ AS CINZAS'},
  michael:{name:'MIGUEL',spd:68,dmg:[8,8,12],reach:[50,52,56],aura:'#ffffff',sp:'holyfire',spName:'FOGO SAGRADO',su:'archsword',suName:'ESPADA DO ARCANJO',quote:'Eu sou a espada de Deus.',win:'Eu sempre obedeço.',fin:'MIGUEL JOGA NA JAULA'},
  gabriel:{name:'GABRIEL',spd:82,dmg:[5,6,9],reach:[44,46,48],aura:'#ffd23a',sp:'decoy',spName:'ILUSÃO',su:'candy',suName:'TRAPAÇA FINAL',quote:'Hora da diversão!',win:'Era só um truque.',fin:'GABRIEL: "ERA TUDO UM TRUQUE"'},
  raphael:{name:'RAFAEL',spd:64,dmg:[7,8,12],reach:[46,48,52],aura:'#9fd8ff',sp:'bolt',spName:'RAIO',su:'storm',suName:'TEMPESTADE',quote:'O Céu precisa de ordem.',win:'A ordem foi restaurada.',fin:'RAFAEL CHAMA O RAIO FINAL'},
  amara:{name:'AMARA',spd:62,dmg:[8,8,12],reach:[46,48,52],aura:'#3a1a4a',sp:'tendrils',spName:'TENTÁCULOS',su:'eclipse',suName:'ECLIPSE',quote:'Eu sou a Escuridão.',win:'Tudo volta ao escuro.',fin:'AMARA APAGA A LUZ'},
  chuck:{name:'CHUCK',spd:66,dmg:[6,6,10],reach:[42,44,48],aura:'#f2eee2',sp:'pages',spName:'PÁGINAS',su:'rewrite',suName:'REESCREVER',quote:'Eu sou o autor.',win:'Fim da história.',fin:'CHUCK APAGA O PERSONAGEM'},
  jack:{name:'JACK',spd:76,dmg:[7,7,11],reach:[46,48,50],aura:'#ffd23a',sp:'beam',spName:'RAIO DE GRAÇA',su:'nephilim',suName:'EXPLOSÃO NEFILIM',quote:'Eu escolho ser bom.',win:'Eu protejo a minha família.',fin:'JACK ABSORVE O PODER'},
  death:{name:'MORTE',spd:58,dmg:[8,9,13],reach:[56,58,64],aura:'#4a6a4a',sp:'scythe',spName:'FOICE',su:'reaper',suName:'O TOQUE DA MORTE',quote:'Um dia eu vou ceifar até Deus.',win:'Todos chegam até mim.',fin:'A MORTE CEIFA A ALMA'},
};
const VS_ORDER=['dean','sam','cas','crowley','lucifer','michael','gabriel','raphael','amara','chuck','jack','death'];
const ARENAS={stull:{name:'CEMITÉRIO DE STULL',stage:11,cx:1260},convento:{name:'CONVENTO DE SANTA MARIA',stage:9,cx:400},paginas:{name:'AS PÁGINAS DE CHUCK',stage:15,cx:300},parque:{name:'O PARQUE',stage:14,cx:500},estrada:{name:'A ESTRADA',stage:1,cx:420},ferro:{name:'O FERRO-VELHO',stage:3,cx:60},vazio:{name:'O VAZIO',void:'#04030a'}};
const DUELS=[['michael','lucifer','stull'],['amara','chuck','parque'],['gabriel','lucifer','convento'],['cas','raphael','convento'],['dean','michael','stull'],['death','chuck','vazio']];
const vtx=(s,...a)=>text(tr(s).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),...a);
const GY=206,VSS=2; // chão e escala dos lutadores
let vs=null,vsPick=null;

function mkF(id,x,face,cpu){const D=VSF[id];return{id,D,L:LOOKS[id],x,z:0,vx:0,vz:0,face,hp:100,st:'idle',stT:0,t:Math.random()*3,ph:0,meter:0,cd:0,cpu,kind:'npc',step:0,dur:0,hitAt:0,didHit:false,comboT:0,combo:0,inv:0,flash:0,ai:{blockT:0},hits:0,inverted:0};}
function vsStart(p1,p2,arena,keep){
  const A=ARENAS[arena]||ARENAS[Object.keys(ARENAS)[(Math.random()*7)|0]];
  vs={p1id:p1,p2id:p2,arena:A,wins:keep?keep.wins:[0,0],round:keep?keep.round+1:1,timer:60,phase:'vsintro',phT:0,proj:[],fx:[],parts:[],cutin:null,freeze:0,slow:0,shake:0,flash:0,dark:0,paper:0,grey:0,ban:null,clones:[],finTxt:null};
  vs.a=mkF(p1,90,1,false);vs.b=mkF(p2,230,-1,true);
  if(keep)vs.phase='round';
  mode='vs';hideScreen();$('#cap').hidden=true;showPad();if(!keep)playSong('boss2');
}
function vsBanner(l1,l2,t){vs.ban={l1,l2,t:t||1.4};}
function vsFrame(dt){if(vs.paused)return;vsAcc=(vsAcc||0)+dt;let n=0;while(vsAcc>=1/60&&n<4){vsUpdate(1/60);vsAcc-=1/60;n++;}if(n>=4)vsAcc=0;}
let vsAcc=0;

/* ---------- entrada do computador ---------- */
function aiInput(f,o,dt){
  const a=f.ai,r={x:0,y:0,atk:0,jump:0,shoot:0,magic:0},dx=o.x-f.x,d=Math.abs(dx);
  if(f.inverted>0){r.x=Math.random()<.5?-1:1;if(Math.random()<dt*2)r.atk=1;return r;}
  if(a.blockT>0){a.blockT-=dt;r.y=1;return r;}
  if(['atk','special','super'].includes(o.st)&&d<90&&Math.random()<dt*5)a.blockT=rand(.25,.5);
  if(f.meter>=100&&Math.random()<dt*1.2){r.magic=1;return r;}
  if(d>80){r.x=sgn(dx);if(f.cd<=0&&Math.random()<dt*1.4)r.shoot=1;if(Math.random()<dt*.35)r.jump=1;}
  else{if(Math.random()<dt*5.5)r.atk=1;else if(Math.random()<dt*.9)r.x=-sgn(dx);if(f.cd<=0&&Math.random()<dt*.7)r.shoot=1;if(Math.random()<dt*.3)r.jump=1;}
  return r;
}

/* ---------- regras da luta ---------- */
function vsHit(at,df,dmg,kd,opt){
  opt=opt||{};if(df.inv>0||['ko','dizzy'].includes(df.st)&&!opt.fin)return false;
  if(df.st==='down'&&!opt.otg)return false;
  const blocking=df.st==='block'&&sgn(at.x-df.x)===df.face&&!opt.unblock;
  if(blocking){df.hp=Math.max(1,df.hp-Math.round(dmg*.15));df.x-=df.face*6;at.meter=Math.min(100,at.meter+2);df.meter=Math.min(100,df.meter+4);vsSpark(df,'#9fd8ff',4);sfx('pick');return true;}
  df.hp=Math.max(0,df.hp-dmg);df.flash=.12;at.meter=Math.min(100,at.meter+dmg*1.3);df.meter=Math.min(100,df.meter+dmg*.9);
  at.combo=at.comboT>0?at.combo+1:1;at.comboT=1;if(at.combo>=3)vsBanner(at.combo+' '+tr('GOLPES'),'',0.8);
  vsSpark(df,opt.col||'#fff8c8',kd?10:6);vs.freeze=Math.max(vs.freeze,kd?.09:.05);sfx(kd?'heavy':'hit');vs.shake=Math.max(vs.shake,kd?5:2);
  if(df.hp<=0){vsKO(at,df);return true;}
  if(kd){df.st='air';df.stT=0;df.vx=sgn(df.x-at.x)*120;df.vz=220;df.z=Math.max(df.z,1);}
  else{df.st='hurt';df.stT=0;df.vx=sgn(df.x-at.x)*60;}
  return true;
}
function vsSpark(f,col,n){vsFx({k:'star',x:f.x,y:GY-f.z-50,dur:.18,r:n>=10?16:11,col,spin:rand(0,3)});for(let i=0;i<n;i++){const a=rand(0,Math.PI*2),v=rand(40,130);vs.parts.push({x:f.x,y:GY-f.z-50,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.3,max:.3,col,s:2});}vs.parts.push({x:f.x,y:GY-f.z-50,vx:0,vy:0,life:.08,max:.08,col:'#ffffff',s:10});}
function vsP(x,y,vx,vy,life,col,s,g){vs.parts.push({x,y,vx,vy,life,max:life,col,s:s||2,g:g||0});}
function vsFx(o){vs.fx.push(Object.assign({t:0},o));}
function inFront(at,df,reach,zr){const dx=(df.x-at.x)*at.face;return dx>-8&&dx<=reach&&Math.abs(df.z-at.z)<(zr||46);}
function vsKO(at,df){
  df.st='ko';df.stT=0;df.vx=sgn(df.x-at.x)*90;df.vz=200;df.z=Math.max(1,df.z);vs.slow=1.4;vs.flash=.6;sfx('die');
  const w=at===vs.a?0:1;vs.wins[w]++;vs.phase='ko';vs.phT=0;vs.lastWinner=w;
  vsBanner('K.O.','',2);
}

/* ---------- especiais (TIRO) ---------- */
const SPEC={
  shotgun:{dur:.5,go:(f,o,t,dt)=>{if(t>=.15&&!f.fired){f.fired=1;sfx('shotgun');vs.shake=5;for(let i=0;i<18;i++)vsP(f.x+f.face*30,GY-f.z-58,f.face*rand(180,320),rand(-60,60),.35,'#f4f1e8',2);vsP(f.x+f.face*30,GY-f.z-58,0,0,.08,'#ffe08a',14);if(inFront(f,o,96))vsHit(f,o,9,true,{col:'#ffffff'});}}},
  psywave:{dur:.55,go:(f,o,t)=>{if(t>=.2&&!f.fired){f.fired=1;sfx('magic');vs.proj.push({k:'psy',x:f.x+f.face*24,z:40,vx:f.face*230,owner:f,dmg:8,kd:true,life:1.6,col:'#b080ff'});}}},
  blink:{dur:.5,go:(f,o,t)=>{if(t>=.08&&!f.fired){f.fired=1;sfx('wings');for(let i=0;i<14;i++)vsP(f.x,GY-rand(20,90),rand(-40,40),rand(-40,20),.5,i%2?'#ffffff':'#1a1a1a',2);
      f.x=clamp(o.x-o.face*40,24,296);f.face=sgn(o.x-f.x)||1;for(let i=0;i<14;i++)vsP(f.x,GY-rand(20,90),rand(-40,40),rand(-40,20),.5,i%2?'#ffffff':'#1a1a1a',2);}
    if(t>=.22&&f.fired===1){f.fired=2;sfx('swing');vsFx({k:'arc',f,r:44,dur:.15,col:'#e8f4ff'});if(inFront(f,o,56))vsHit(f,o,10,true,{col:'#e8f4ff'});}}},
  hound:{dur:.5,go:(f,o,t)=>{if(t>=.18&&!f.fired){f.fired=1;sfx('hiss');vs.proj.push({k:'hound',x:f.x+f.face*20,z:0,vx:f.face*260,owner:f,dmg:10,kd:true,life:1.4});}}},
  snap:{dur:.85,go:(f,o,t)=>{if(t>=.1&&!f.mark){f.mark={x:o.x};sfx('magic');}
    if(f.mark)vsFx({k:'mark',x:f.mark.x,dur:.02,col:'#ff4a1a'});
    if(t>=.7&&f.mark&&!f.fired){f.fired=1;sfx('fire');vs.shake=6;vsFx({k:'pillar',x:f.mark.x,dur:.6,col:'#ff6a1a',w:34});for(let i=0;i<30;i++)vsP(f.mark.x+rand(-18,18),GY,rand(-20,20),-rand(80,220),.7,FIRE[(Math.random()*4)|0],2);
      if(Math.abs(o.x-f.mark.x)<30&&o.z<30)vsHit(f,o,12,true,{col:'#ff8a1a',unblock:false});}}},
  holyfire:{dur:.8,go:(f,o,t)=>{if(t>=.1&&!f.mark){f.mark={x:o.x};sfx('magic');}
    if(f.mark)vsFx({k:'mark',x:f.mark.x,dur:.02,col:'#bfe8ff'});
    if(t>=.6&&f.mark&&!f.fired){f.fired=1;sfx('colt');vs.flash=.3;vsFx({k:'pillar',x:f.mark.x,dur:.6,col:'#bfe8ff',w:36});if(Math.abs(o.x-f.mark.x)<30)vsHit(f,o,12,true,{col:'#ffffff'});}}},
  decoy:{dur:.45,go:(f,o,t)=>{if(t>=.15&&!f.fired){f.fired=1;sfx('vanish');for(let i=0;i<12;i++)vsP(f.x,GY-rand(10,90),rand(-60,60),rand(-60,0),.5,['#ff6ab0','#ffd23a','#6ad0ff'][i%3],2);
      vs.proj.push({k:'clone',x:f.x+f.face*10,z:0,vx:f.face*190,owner:f,dmg:8,kd:true,life:1.6});}}},
  bolt:{dur:.8,go:(f,o,t)=>{if(t>=.1&&!f.mark){f.mark={x:o.x};}
    if(f.mark)vsFx({k:'mark',x:f.mark.x,dur:.02,col:'#9fd8ff'});
    if(t>=.5&&f.mark&&!f.fired){f.fired=1;sfx('colt');vs.flash=.5;vs.shake=6;vsFx({k:'bolt',x:f.mark.x,dur:.35,col:'#9fd8ff'});if(Math.abs(o.x-f.mark.x)<28)vsHit(f,o,11,true,{col:'#bfe8ff'});}}},
  tendrils:{dur:.55,go:(f,o,t)=>{if(t>=.2&&!f.fired){f.fired=1;sfx('smoke');vs.proj.push({k:'tendril',x:f.x+f.face*24,z:0,vx:f.face*170,owner:f,dmg:10,kd:true,life:1.8});}}},
  pages:{dur:.55,go:(f,o,t)=>{if(t>=.18&&!f.fired){f.fired=1;sfx('swing');for(const dz of[20,44,68])vs.proj.push({k:'page',x:f.x+f.face*20,z:dz,vx:f.face*240,owner:f,dmg:4,kd:false,life:1.4});}}},
  beam:{dur:.55,go:(f,o,t)=>{if(t>=.15&&!f.fired){f.fired=1;sfx('magic');vs.flash=.15;vsFx({k:'beam',f,dur:.3,col:'#ffd23a'});if(inFront(f,o,230,40))vsHit(f,o,10,true,{col:'#ffd23a'});}}},
  scythe:{dur:.65,go:(f,o,t)=>{if(t>=.25&&!f.fired){f.fired=1;sfx('swing');vsFx({k:'arc',f,r:70,dur:.22,col:'#7a9a6a',big:true});if(inFront(f,o,80))vsHit(f,o,12,true,{col:'#a8c898'});}}},
};
/* ---------- supergolpes (MAGIA, com a barra cheia) ---------- */
const SUPER={
  fury:{dur:1.6,go:(f,o,t)=>{vs.tint='#5a0808';if(t<1.3){const tx=o.x-f.face*30;f.x+=clamp(tx-f.x,-6,6);if(Math.floor(t/.22)>(f.n||0)){f.n=Math.floor(t/.22);sfx('swing');vsFx({k:'arc',f,r:46,dur:.14,col:'#ff3a2a',big:true});if(inFront(f,o,60))vsHit(f,o,f.n>=5?9:5,f.n>=5,{col:'#ff3a2a',unblock:f.n>=5});}}}},
  bloodhold:{dur:1.7,go:(f,o,t)=>{if(t<1.2&&o.hp>0&&o.st!=='ko'){o.st='held';o.z=Math.min(60,o.z+90/60);o.vx=0;for(let i=0;i<2;i++)vsP(o.x+rand(-14,14),GY-o.z-rand(0,90),0,-rand(20,60),.5,i?'#3a0a2a':'#8a2a6a',3);}
    if(t>=1.2&&!f.fired){f.fired=1;sfx('heavy');vs.shake=10;o.st='air';o.vz=-260;vsHit(f,o,24,true,{col:'#b080ff',unblock:true,otg:true});}}},
  smite:{dur:1.5,go:(f,o,t)=>{if(t<.05&&!f.w){f.w=1;vsFx({k:'wings',f,dur:1.4,col:'#0c0c12'});}
    if(t>=.7&&!f.fired){f.fired=1;sfx('colt');vs.flash=1;vsFx({k:'pillar',x:o.x,dur:.8,col:'#ffffff',w:44});vsHit(f,o,26,true,{col:'#ffffff',unblock:true});}}},
  contract:{dur:1.6,go:(f,o,t)=>{if(t<.05&&!f.w){f.w=1;vsFx({k:'sigil',x:o.x,dur:1.5});}
    if(t>.3&&t<1.2){for(let i=0;i<2;i++)vsP(o.x+rand(-10,10),GY-o.z-rand(20,90),(f.x-o.x)*rand(.6,1.2),0,.7,i?'#c81a10':'#ff6a3a',2);}
    if(t>=1.2&&!f.fired){f.fired=1;sfx('boss');vsHit(f,o,20,true,{col:'#c81a10',unblock:true});f.hp=Math.min(100,f.hp+12);}}},
  hellfire:{dur:1.8,go:(f,o,t)=>{if(t<.05&&!f.w){f.w=1;vsFx({k:'wings',f,dur:1.7,col:'#5a0a04',fire:true});}
    for(let k=0;k<3;k++){const at=.5+k*.3;if(t>=at&&(f.n||0)<=k){f.n=k+1;const x=f.x+f.face*(50+k*70);sfx('fire');vs.shake=6;vsFx({k:'pillar',x,dur:.5,col:'#ff5a1a',w:40});for(let i=0;i<20;i++)vsP(x+rand(-18,18),GY,rand(-20,20),-rand(100,240),.7,FIRE[(Math.random()*4)|0],2);if(Math.abs(o.x-x)<36&&o.z<40)vsHit(f,o,10,true,{col:'#ff8a1a'});}}}},
  archsword:{dur:1.6,go:(f,o,t)=>{if(t<.05&&!f.w){f.w=1;vsFx({k:'wings',f,dur:1.5,col:'#e8f0ff',light:true});}
    if(t>=.8&&!f.fired){f.fired=1;sfx('colt');vs.flash=.8;vs.shake=10;vsFx({k:'sweep',f,dur:.45,col:'#e8f4ff'});vsHit(f,o,26,true,{col:'#ffffff',unblock:o.z<10});}}},
  candy:{dur:2,go:(f,o,t)=>{vs.tint='#3a2a08';if(t<1.5&&Math.random()<.5)vs.proj.push({k:'candy',x:o.x+rand(-60,60),z:200,vz:-260,vx:0,owner:f,dmg:3,kd:false,life:2,c:['#ff6ab0','#ffd23a','#6ad0ff','#7aff8a'][(Math.random()*4)|0]});
    if(t>=1.7&&!f.fired){f.fired=1;sfx('glass');vs.flash=.6;vsFx({k:'rays',x:o.x,y:GY-50,dur:.6,col:'#ffd23a'});vsHit(f,o,10,true,{col:'#ffd23a',unblock:true});vsBanner('TRAPAÇA!','',1);}}},
  storm:{dur:1.9,go:(f,o,t)=>{vs.tint='#08182a';for(let k=0;k<5;k++){const at=.35+k*.3;if(t>=at&&(f.n||0)<=k){f.n=k+1;const x=k===4?o.x:o.x+rand(-60,60);sfx('colt');vs.flash=.35;vsFx({k:'bolt',x,dur:.3,col:'#9fd8ff'});if(Math.abs(o.x-x)<26)vsHit(f,o,8,k===4,{col:'#bfe8ff'});}}}},
  eclipse:{dur:1.8,go:(f,o,t)=>{vs.dark=Math.min(1,t*2);if(t>=1.3&&!f.fired){f.fired=1;vs.dark=0;sfx('boss');vs.shake=12;vsFx({k:'tendrils',x:o.x,dur:.8});vsHit(f,o,26,true,{col:'#3a1a4a',unblock:true});}}},
  rewrite:{dur:1.5,go:(f,o,t)=>{vs.paper=Math.min(1,t*2);if(t>=1&&!f.fired){f.fired=1;vs.paper=0;sfx('magic');vsFx({k:'ink',x:o.x,dur:.7});vsHit(f,o,18,true,{col:'#1a1410',unblock:true});o.inverted=4;vsBanner('CONTROLES REESCRITOS','',1.4);}}},
  nephilim:{dur:1.5,go:(f,o,t)=>{if(t<.05&&!f.w){f.w=1;vsFx({k:'wings',f,dur:1.4,col:'#4a3608',gold:true});}
    if(t>=.8&&!f.fired){f.fired=1;sfx('colt');vs.flash=1;vs.shake=12;for(let i=0;i<4;i++)vsFx({k:'ring',x:f.x,y:GY-50,dur:.5+i*.1,col:'#ffd23a'});vsFx({k:'pillar',x:o.x,dur:.7,col:'#ffd23a',w:44});vsHit(f,o,26,true,{col:'#ffd23a',unblock:true});f.hp=Math.max(1,f.hp-6);}}},
  reaper:{dur:1.8,go:(f,o,t)=>{vs.grey=Math.min(1,t*2);if(t>=.9&&!f.tp){f.tp=1;f.x=clamp(o.x-o.face*34,24,296);f.face=sgn(o.x-f.x)||1;}
    if(t>=1.2&&!f.fired){f.fired=1;sfx('dissolve');vsFx({k:'soul',x:o.x,dur:1});vsHit(f,o,30,true,{col:'#a8c898',unblock:true});}if(t>1.6)vs.grey=0;}},
};
// golpes finais (depois do último round)
const FINISH={michael:'cage',lucifer:'burn',amara:'dark',chuck:'erase',death:'soul',cas:'light',crowley:'hounds',dean:'blade',sam:'mind',gabriel:'trick',raphael:'bolt',jack:'light'};

/* ---------- atualização ---------- */
function vsUpdate(dt){
  if(vs.ban){vs.ban.t-=dt;if(vs.ban.t<=0)vs.ban=null;}
  for(const q of vs.parts){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.g)q.vy+=300*dt;}vs.parts=vs.parts.filter(q=>q.life>0);if(vs.parts.length>600)vs.parts.splice(0,vs.parts.length-600);
  for(const f of vs.fx)f.t+=dt;vs.fx=vs.fx.filter(f=>f.t<f.dur);
  vs.shake=Math.max(0,vs.shake-dt*25);vs.flash=Math.max(0,vs.flash-dt*2);
  vs.phT+=dt;
  if(vs.phase==='vsintro'){if(vs.phT>2.8){vs.phase='round';vs.phT=0;}return;}
  if(vs.phase==='round'){if(vs.phT<.05){vsBanner('ROUND '+vs.round,'',1.3);sfx('boss');}if(vs.phT>1.3&&!vs.lute){vs.lute=1;vsBanner('LUTE!','',.9);sfx('heavy');}if(vs.phT>2){vs.phase='fight';vs.phT=0;vs.lute=0;}}
  if(vs.freeze>0){vs.freeze-=dt;return;}
  const sdt=vs.slow>0?dt*.3:dt;if(vs.slow>0)vs.slow-=dt;
  if(vs.phase==='fight'){vs.timer-=sdt;if(vs.timer<=0){vs.timer=0;const w=vs.a.hp>=vs.b.hp?0:1;vsKO(w?vs.b:vs.a,w?vs.a:vs.b);}}
  const inp=readInput(dt);
  const ia=vs.phase==='fight'||vs.phase==='finish'?(vs.a.inverted>0?{...inp,x:-inp.x}:inp):{x:0,y:0};
  const ib=vs.phase==='fight'||(vs.phase==='finish'&&vs.lastWinner===1)?aiInput(vs.b,vs.a,sdt):{x:0,y:0};
  updF(vs.a,vs.b,ia,sdt);updF(vs.b,vs.a,ib,sdt);
  // empurrão entre os dois
  const d=vs.b.x-vs.a.x;if(Math.abs(d)<26&&vs.a.z<20&&vs.b.z<20){const p=(26-Math.abs(d))/2*sgn(d||1);vs.a.x-=p;vs.b.x+=p;}
  for(const f of[vs.a,vs.b])f.x=clamp(f.x,24,296);
  updProj(sdt);
  if(vs.phase==='ko'&&vs.phT>2.4){
    if(vs.wins[vs.lastWinner]>=2){vs.phase='finish';vs.phT=0;const L=vs.lastWinner?vs.b:vs.a,Lo=vs.lastWinner?vs.a:vs.b;Lo.st='dizzy';Lo.stT=0;Lo.hp=1;Lo.z=0;Lo.vz=0;vsBanner('ACABE COM ELE!','',3.5);sfx('scream');}
    else{const keep={wins:vs.wins,round:vs.round};vsStart(vs.p1id,vs.p2id,Object.keys(ARENAS).find(k=>ARENAS[k]===vs.arena),keep);}
  }
  if(vs.phase==='finish'){const W=vs.lastWinner?vs.b:vs.a,Lo=vs.lastWinner?vs.a:vs.b;
    if(!vs.finTxt&&(vs.phT>4||(W===vs.a&&(inp.atk||inp.magic||inp.shoot)&&Math.abs(W.x-Lo.x)<120)||(W===vs.b&&vs.phT>1.5)))doFinisher(W,Lo);
    if(vs.finTxt&&vs.phT>vs.finAt+3)vsResult();}
}
function updF(f,o,inp,dt){
  f.t+=dt;f.stT+=dt;if(f.inv>0)f.inv-=dt;if(f.flash>0)f.flash-=dt;if(f.cd>0)f.cd-=dt;if(f.comboT>0)f.comboT-=dt;if(f.inverted>0)f.inverted-=dt;
  const D=f.D,free=['idle','walk','block'].includes(f.st);
  if(free){
    f.face=sgn(o.x-f.x)||f.face;
    if(inp.y>.5&&f.z===0){f.st='block';}
    else{if(f.st==='block')f.st='idle';
      f.x+=(inp.x||0)*D.spd*dt;if(inp.x){f.st='walk';f.ph+=dt*9;}else f.st='idle';
      if(inp.jump){f.st='jump';f.stT=0;f.vz=230;f.vx=(inp.x||0)*D.spd;f.jatk=false;f.z=.1;sfx('jump');}
      else if(inp.atk){const step=f.comboT>0&&f.lastHit?Math.min(2,f.combo):0;startAtkF(f,step);}
      else if(inp.shoot&&f.cd<=0){f.st='special';f.stT=0;f.cd=2.2;f.fired=0;f.mark=null;f.n=0;}
      else if(inp.magic&&f.meter>=100){f.meter=0;f.st='super';f.stT=0;f.fired=0;f.n=0;f.w=0;f.tp=0;vs.freeze=.9;vs.cutin={f,t:1.1};sfx('boss');}}
  }
  switch(f.st){
    case 'atk':if(!f.didHit&&f.stT>=f.hitAt){f.didHit=true;sfx('swing');vsFx({k:'arc',f,r:D.reach[f.step]-4,dur:.13,col:'#ffffff',big:f.step===2});f.lastHit=inFront(f,o,D.reach[f.step])&&vsHit(f,o,D.dmg[f.step],f.step===2);}
      if(inp.atk&&f.stT>f.hitAt*.5)f.queued=true;
      if(f.stT>=f.dur){if(f.queued&&f.lastHit&&f.step<2)startAtkF(f,f.step+1);else f.st='idle';}break;
    case 'jump':f.x+=f.vx*dt;f.z+=f.vz*dt;f.vz-=520*dt;if(inp.atk&&!f.jatk){f.jatk=true;sfx('swing');vsFx({k:'arc',f,r:40,dur:.15,col:'#ffffff',down:true});}
      if(f.jatk&&!f.jhit&&inFront(f,o,44,60)){f.jhit=true;vsHit(f,o,8,true);}
      if(f.z<=0){f.z=0;f.st='idle';f.jhit=false;sfx('land');}break;
    case 'special':{const S=SPEC[D.sp];S.go(f,o,f.stT,dt);if(f.stT>=S.dur){f.st='idle';f.mark=null;}break;}
    case 'super':{const S=SUPER[D.su];S.go(f,o,f.stT,dt);if(f.stT>=S.dur){f.st='idle';vs.tint=null;vs.dark=0;vs.paper=0;vs.grey=0;}break;}
    case 'hurt':f.x+=f.vx*dt;f.vx*=Math.pow(.02,dt);if(f.stT>.3)f.st='idle';break;
    case 'air':case 'ko':f.x+=f.vx*dt;f.z+=f.vz*dt;f.vz-=520*dt;if(f.z<=0){f.z=0;f.vx*=.4;if(f.st==='ko'){f.vz=0;f.vx=0;break;}f.st='down';f.stT=0;vs.shake=Math.max(vs.shake,3);sfx('land');}break;
    case 'down':if(f.stT>.6){f.st='getup';f.stT=0;f.inv=.5;}break;
    case 'getup':if(f.stT>.3)f.st='idle';break;
    case 'held':break;
    case 'dizzy':break;
  }
}
function startAtkF(f,step){f.st='atk';f.stT=0;f.step=step;f.dur=[.24,.26,.36][step];f.hitAt=[.08,.1,.14][step];f.didHit=false;f.queued=false;f.lastHit=false;}
function updProj(dt){
  for(const q of vs.proj){q.x+=q.vx*dt;if(q.vz){q.z+=q.vz*dt;}q.life-=dt;const o=q.owner===vs.a?vs.b:vs.a;
    if(q.k==='tendril'&&Math.random()<.6)vsP(q.x,GY,rand(-10,10),-rand(10,40),.4,'#050308',3);
    if(q.k==='psy'&&Math.random()<.5)vsP(q.x,GY-q.z,rand(-10,10),rand(-10,10),.3,'#c8a0ff',2);
    if(q.x<0||q.x>SW||q.life<=0||(q.k==='candy'&&q.z<=0)){q.dead=true;continue;}
    if(Math.abs(o.x-q.x)<16&&Math.abs((o.z+30)-(q.z+10))<44){q.dead=true;vsHit(q.owner,o,q.dmg,q.kd,{col:q.col||'#ffffff'});}
  }
  vs.proj=vs.proj.filter(q=>!q.dead);
}
function doFinisher(W,Lo){
  vs.finTxt=W.D.fin;vs.finAt=vs.phT;vs.flash=1;vs.shake=12;sfx('boss');const k=FINISH[W.id],x=Lo.x;
  if(k==='cage'){vsFx({k:'pit',x,dur:3});Lo.st='falling';}
  else if(k==='burn'){vsFx({k:'pillar',x,dur:1.6,col:'#ff5a1a',w:50});Lo.fade=1;}
  else if(k==='dark'){vs.dark=1;Lo.fade=1;setTimeout(()=>{if(vs)vs.dark=0;},1500);}
  else if(k==='erase'){vsFx({k:'ink',x,dur:1.2});Lo.fade=1;}
  else if(k==='soul'){vsFx({k:'soul',x,dur:2});Lo.fade=1;}
  else if(k==='light'){vsFx({k:'pillar',x,dur:1.6,col:W.id==='jack'?'#ffd23a':'#ffffff',w:50});Lo.fade=1;}
  else if(k==='hounds'){vsFx({k:'sigil',x,dur:2});Lo.fade=1;}
  else if(k==='bolt'){for(let i=0;i<3;i++)vsFx({k:'bolt',x:x+rand(-10,10),dur:.5+i*.2,col:'#9fd8ff'});Lo.fade=1;}
  else if(k==='trick'){for(let i=0;i<40;i++)vsP(x,GY-50,rand(-150,150),rand(-200,50),1.2,['#ff6ab0','#ffd23a','#6ad0ff','#7aff8a'][i%4],3,1);Lo.fade=1;}
  else {vsFx({k:'arc',f:W,r:60,dur:.3,col:W.id==='dean'?'#ff3a2a':'#b080ff',big:true});Lo.st='ko';Lo.vz=160;Lo.z=1;}
  vsBanner(vs.finTxt,'',3);
}
function vsResult(){
  const W=vs.lastWinner?vs.b:vs.a;const you=vs.lastWinner===0;mode='vsover';showPad();
  show(`<div class="box"><p class="eyebrow">LUTAS DOS SONHOS</p><h2><span>${pf(W.D.name)}</span> <span>VENCE</span></h2><p class="txt">"<span>${W.D.win}</span>"</p><p class="sub">${you?'Você venceu a luta.':'O computador venceu desta vez.'}</p>
    <div class="row"><button class="btn go" data-act="vsagain" type="button">▶ REVANCHE</button><button class="btn" data-act="vspick" type="button">TROCAR LUTADOR</button><button class="btn" data-act="title" type="button">MENU</button></div></div>`);
}

/* ---------- desenho ---------- */
function vsPose(f){
  const st=f.st==='special'||f.st==='super'?(['shotgun','beam','pages','psywave'].includes(f.st==='special'?f.D.sp:'')?'shoot':['scythe','blink'].includes(f.D.sp)&&f.st==='special'?'atk':'cast'):f.st==='held'||f.st==='falling'?'air':f.st==='dizzy'?'hurt':f.st==='ko'?(f.z>0?'air':'down'):f.st==='block'?'idle':f.st;
  const e={st,stT:f.st==='special'&&st==='atk'?f.stT*.5:f.stT,t:f.t,kind:'npc',ph:f.ph,step:st==='atk'?2:f.step,dur:st==='atk'?.6:f.dur,jatk:f.jatk};
  const P=poseFor(e);
  if(f.st==='block')Object.assign(P,{fa:[2.4,1.9],ba:[2.2,1.7],crouch:2,lean:-1,weapon:false});
  if(f.st==='dizzy'){P.lean=Math.sin(f.t*4)*3;}
  if(f.id==='death'&&!['shoot'].includes(st))P.weapon=true;
  return P;
}
function drawF(f){
  const L=f.L,x=Math.round(f.x),y=Math.round(GY-f.z),alpha=f.fade?Math.max(0,1-(vs.phT-vs.finAt)/1.2):1;
  if(alpha<=0)return;
  if(f.st==='falling'){f.z-=60/60;}
  // sombra e aura
  c.globalAlpha=.45;c.fillStyle='#000';c.beginPath();c.ellipse(x,GY+1,22,5,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
  if(f.D.aura){c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y-50,4,x,y-50,60);g.addColorStop(0,f.D.aura+'55');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-60,y-110,120,120);c.globalCompositeOperation='source-over';}
  drawPuppet(bg,L,vsPose(f));
  const rot=f.st==='down'||(f.st==='ko'&&f.z<=0)?-Math.PI/2:f.st==='air'||(f.st==='ko'&&f.z>0)?-.6:0;
  if(f.st==='atk'&&f.step===2&&f.stT>f.hitAt*.6&&f.stT<f.hitAt+.08){silhouette(sg,'#ffffff');c.save();c.globalAlpha=.22;c.translate(x-f.face*10,y);c.scale(VSS,VSS);if(f.face<0)c.scale(-1,1);c.drawImage(sil,-OX,-OY);c.restore();}
  c.save();c.translate(x,y+(rot?-4:0));c.scale(VSS,VSS);blit(0,0,f.face,{outline:'#07060d',alpha,rot,flash:f.flash});c.restore();
  if(!rot){const col=EYEGLOW[L.eye]||(f.st==='super'&&f.D.aura?f.D.aura:null);if(col){const ex=x+f.face*(PUP.hx+2-OX)*VSS,ey=y+(PUP.hy-OY)*VSS;c.globalCompositeOperation='lighter';c.globalAlpha=.6;disc(c,ex,ey,4,col);c.globalAlpha=1;px(c,ex-2,ey,4,2,col);c.globalCompositeOperation='source-over';}}
  if(f.st==='dizzy'){for(let i=0;i<3;i++){const a=f.t*4+i*2.1;vtx('*',x+Math.cos(a)*16,y-118+Math.sin(a)*4,'#ffd23a',8,'center',false);}}
  if(f.st==='block'){c.globalAlpha=.35;c.strokeStyle='#9fd8ff';c.lineWidth=2;c.beginPath();c.arc(x+f.face*16,y-60,30,-1.2,1.2);c.stroke();c.globalAlpha=1;}
}
function drawVsFx(back){
  for(const f of vs.fx){const k=f.t/f.dur,a=Math.max(0,1-k);
    const fx=f.f?f.f.x:f.x,fy=f.f?GY-f.f.z:(f.y||GY),face=f.f?f.f.face:1;
    if(back!==(f.k==='wings'||f.k==='sigil'||f.k==='mark'||f.k==='pit'))continue;
    if(f.k==='arc'){c.save();c.translate(fx+face*10,fy-62);if(face<0)c.scale(-1,1);const s0=f.down?-1.2:-1.2,s1=f.down?1.3:.8,e1=s0+(s1-s0)*Math.min(1,k*2.2);
      c.globalAlpha=a;c.strokeStyle=f.col;c.lineWidth=f.big?7:5;c.beginPath();c.arc(0,0,f.r,s0,e1);c.stroke();c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.arc(0,0,f.r-3,s0,e1);c.stroke();c.restore();}
    else if(f.k==='pillar'){const w=f.w*(k<.15?k/.15:1);c.globalAlpha=a*.6;c.fillStyle=f.col;c.fillRect(f.x-w/2,0,w,GY);c.globalAlpha=a;c.fillStyle='#ffffff';c.fillRect(f.x-w/6,0,w/3,GY);c.globalAlpha=a*.6;c.fillStyle=f.col;c.beginPath();c.ellipse(f.x,GY,f.w,f.w*.3,0,0,Math.PI*2);c.fill();}
    else if(f.k==='mark'){c.globalAlpha=Math.floor(vs.phT*14)%2?.9:.4;c.strokeStyle=f.col;c.lineWidth=2;c.beginPath();c.ellipse(f.x,GY,30,8,0,0,Math.PI*2);c.stroke();}
    else if(f.k==='bolt'){c.globalAlpha=a;for(const [col,wd] of[[f.col,5],['#ffffff',2]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();let bx=f.x+rand(-14,14),by=0;c.moveTo(bx,by);while(by<GY-60){by+=rand(10,22);bx+=rand(-14,14);c.lineTo(bx,by);if(Math.random()<.25){c.moveTo(bx,by);c.lineTo(bx+rand(-28,28),by+rand(10,24));c.moveTo(bx,by);}}c.lineTo(f.x,GY-40);c.stroke();}c.globalAlpha=a*.5;c.fillStyle=f.col;c.beginPath();c.ellipse(f.x,GY,34,10,0,0,Math.PI*2);c.fill();}
    else if(f.k==='beam'){const L=230*Math.min(1,k*5);c.globalAlpha=a;c.fillStyle=f.col;c.fillRect(face>0?fx+20:fx-20-L,fy-66,L,12);c.fillStyle='#ffffff';c.fillRect(face>0?fx+20:fx-20-L,fy-62,L,4);}
    else if(f.k==='sweep'){c.globalAlpha=a;c.fillStyle=f.col;const y0=fy-70;c.fillRect(0,y0,SW,18);c.fillStyle='#ffffff';c.fillRect(0,y0+6,SW,6);for(let i=0;i<20;i++)px(c,rand(0,SW),y0+rand(-10,28),rand(4,16),1,'#ffffff');}
    else if(f.k==='wings'){const open=Math.min(1,k*3.5);c.globalAlpha=Math.min(.8,a*1.4);c.fillStyle=f.col;
      for(const s of[-1,1])for(let i=0;i<50;i++){const t2=i/50,bx=fx+s*(10+t2*150*open),by=fy-96-Math.sin(t2*Math.PI*.9)*60*open+t2*14,drop=Math.round((1-t2)*60+16);c.fillRect(Math.round(bx)-2,Math.round(by),5,drop);}
      c.globalAlpha=Math.min(.6,a);c.fillStyle=f.gold?'#ffd23a':f.fire?'#ff6a1a':f.light?'#ffffff':'#cfe8ff';for(const s of[-1,1])for(let i=0;i<50;i+=2){const t2=i/50,bx=fx+s*(10+t2*150*open),by=fy-96-Math.sin(t2*Math.PI*.9)*60*open+t2*14;c.fillRect(Math.round(bx),Math.round(by)-1,3,2);}}
    else if(f.k==='sigil'){c.globalAlpha=Math.min(1,a*1.5);c.strokeStyle='#c81a10';c.lineWidth=2;c.beginPath();c.ellipse(f.x,GY,50,14,0,0,Math.PI*2);c.stroke();c.beginPath();for(let i=0;i<=5;i++){const ang=f.t*2-Math.PI/2+i*Math.PI*4/5;const qx=f.x+Math.cos(ang)*44,qy=GY+Math.sin(ang)*12;i?c.lineTo(qx,qy):c.moveTo(qx,qy);}c.stroke();}
    else if(f.k==='tendrils'){c.globalAlpha=Math.min(1,a*1.5);c.fillStyle='#050308';for(let i=0;i<9;i++){const bx=f.x-36+i*9,h=Math.round(Math.sin(Math.min(1,k*3)*Math.PI/2)*(60+(i*17)%40));for(let j=0;j<h;j+=3)c.fillRect(Math.round(bx+Math.sin(j*.15+i+f.t*8)*5),GY-j,5,3);}}
    else if(f.k==='ink'){c.globalAlpha=a;c.strokeStyle='#1a1410';c.lineWidth=8;const r=Math.min(1,k*4)*44;c.beginPath();c.moveTo(f.x-r,GY-90-r/2);c.lineTo(f.x+r,GY-r/2+r*.5);c.moveTo(f.x+r,GY-90-r/2);c.lineTo(f.x-r,GY-r/2+r*.5);c.stroke();}
    else if(f.k==='ring'){c.globalAlpha=a;c.strokeStyle=f.col;c.lineWidth=3;c.beginPath();c.ellipse(f.x,f.y,10+k*120,(10+k*120)*.5,0,0,Math.PI*2);c.stroke();}
    else if(f.k==='rays'){c.globalCompositeOperation='lighter';c.globalAlpha=a;c.strokeStyle=f.col||'#fff6d8';c.lineWidth=3;for(let i=0;i<14;i++){const ang=i/14*Math.PI*2+f.t,l=30+k*100;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x+Math.cos(ang)*l,f.y+Math.sin(ang)*l*.8);c.stroke();}c.globalCompositeOperation='source-over';}
    else if(f.k==='soul'){const y=GY-60-k*120;c.globalAlpha=a;c.fillStyle='#c8ffd8';disc(c,f.x,y,8,'#c8ffd8');c.fillStyle='#ffffff';disc(c,f.x,y,4,'#ffffff');for(let i=0;i<3;i++)px(c,f.x-6+i*6,y+8+i*4,2,8,'#a8e8b8');}
    else if(f.k==='star'){const r=k<.3?k/.3*f.r:f.r*(1-(k-.3)/.7*.5);c.globalCompositeOperation='lighter';c.globalAlpha=a;
      for(const[col,m]of[[f.col,1],['#ffffff',.5]]){c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const ang=i*Math.PI/4+(f.spin||0),rr=(i%2?r*.35:r)*m;i?c.lineTo(f.x+Math.cos(ang)*rr,f.y+Math.sin(ang)*rr):c.moveTo(f.x+Math.cos(ang)*rr,f.y+Math.sin(ang)*rr);}c.closePath();c.fill();}
      c.globalCompositeOperation='source-over';}
    else if(f.k==='pit'){c.globalAlpha=.8;disc(c,f.x,GY+6,40,'#fff2b0');disc(c,f.x,GY+6,28,'#ffffff');}
  }
  c.globalAlpha=1;
}
function renderVS(){
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
  const A=vs.arena,sx=Math.round(rand(-vs.shake,vs.shake)),sy=Math.round(rand(-vs.shake,vs.shake)*.6);
  if(A.void){c.fillStyle=A.void;c.fillRect(0,0,SW,SH);for(let i=0;i<30;i++)px(c,(i*53)%SW,(i*97)%140,1,1,'#2a2440');c.fillStyle='#0a0814';c.fillRect(0,GY-8,SW,SH-GY+8);}
  else{const L=getLayers(A.stage),cx=A.cx;c.drawImage(L.sky,0,0);c.drawImage(L.far,-Math.round(cx*.2),0);c.drawImage(L.mid,-Math.round(cx*.5),0);c.drawImage(L.ground,-cx,L.G0);}
  c.translate(sx,sy);
  if(vs.phase==='vsintro'){renderVsIntro();return;}
  drawVsFx(true);
  const order=[vs.a,vs.b].sort((p,q)=>p.st==='super'?1:-1);for(const f of order)drawF(f);
  for(const cl of vs.proj)drawProj(cl);
  drawVsFx(false);
  for(const q of vs.parts){c.globalAlpha=Math.max(0,q.life/q.max);px(c,q.x-q.s/2,q.y-q.s/2,q.s,q.s,q.col);}c.globalAlpha=1;
  c.setTransform(1,0,0,1,0,0);
  if(vs.tint){c.globalAlpha=.25;c.fillStyle=vs.tint;c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  if(vs.dark>0){c.globalAlpha=Math.min(.92,vs.dark);c.fillStyle='#000';c.fillRect(0,0,SW,SH);c.globalAlpha=1;for(const f of[vs.a,vs.b])if(f.id==='amara'||f===vs.a||f===vs.b){const ex=f.x+f.face*6,ey=GY-f.z-98;px(c,ex,ey,3,2,f.id==='amara'?'#ffffff':'#3a3a3a');}}
  if(vs.paper>0){c.globalAlpha=vs.paper*.6;c.fillStyle='#e8e4d8';c.fillRect(0,0,SW,SH);c.fillStyle='#8a8478';for(let y=10;y<SH;y+=10)c.fillRect(0,y,SW,1);c.globalAlpha=1;}
  if(vs.grey>0){c.globalCompositeOperation='saturation';c.globalAlpha=vs.grey;c.fillStyle='#808080';c.fillRect(0,0,SW,SH);c.globalCompositeOperation='source-over';c.globalAlpha=1;}
  vignette();
  if(vs.flash>0){c.globalAlpha=Math.min(.55,vs.flash);c.fillStyle='#fff';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  vsHud();
}
function drawProj(q){const x=Math.round(q.x),y=Math.round(GY-q.z);
  if(q.k==='psy'){for(let i=0;i<3;i++){c.globalAlpha=.8-i*.2;c.strokeStyle='#b080ff';c.lineWidth=2;c.beginPath();c.ellipse(x-sgn(q.vx)*i*8,y-40,6+i*3,16+i*4,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;}
  else if(q.k==='hound'){const f=sgn(q.vx);c.globalAlpha=.85;px(c,x-16,y-18,32,12,'#120806');px(c,x+f*12,y-24,12,10,'#120806');for(const lx of[-12,-4,6,12])px(c,x+lx,y-8,4,8,'#120806');c.globalAlpha=1;px(c,x+f*18,y-22,4,2,'#ff3020');}
  else if(q.k==='clone'){drawPuppet(bg,LOOKS.gabriel,poseFor({st:'walk',stT:0,t:vs.phT,kind:'npc',ph:vs.phT*12}));c.save();c.translate(x,y);c.scale(VSS,VSS);blit(0,0,sgn(q.vx),{outline:'#ffd23a',alpha:.55});c.restore();}
  else if(q.k==='tendril'){c.fillStyle='#050308';for(let i=0;i<4;i++){const h=30+i*10;for(let j=0;j<h;j+=3)c.fillRect(x-i*7+Math.round(Math.sin(j*.2+vs.phT*10+i)*3),y-j,4,3);}}
  else if(q.k==='page'){px(c,x-6,y-8,12,15,'#f2eee2');for(let i=0;i<4;i++)px(c,x-4,y-5+i*3,8,1,'#6a6458');}
  else if(q.k==='candy'){px(c,x-3,y-3,7,5,q.c);px(c,x-6,y-2,3,3,q.c);px(c,x+4,y-2,3,3,q.c);}
}
function vsHud(){
  const bar=(x,w,k,col,rev)=>{px(c,x-1,7,w+2,10,'#07060d');px(c,x,8,w,8,'#3a1418');const fw=Math.round(w*Math.max(0,k));px(c,rev?x+w-fw:x,8,fw,8,col);px(c,rev?x+w-fw:x,8,fw,2,'#ffffff');};
  bar(8,130,vs.a.hp/100,vs.a.hp<30?'#ff5a3a':'#f2b632');bar(182,130,vs.b.hp/100,vs.b.hp<30?'#ff5a3a':'#f2b632',true);
  vtx(VSF[vs.a.id].name,8,20,'#efe8d6',8,'left');vtx(VSF[vs.b.id].name,312,20,'#efe8d6',8,'right');
  vtx(String(Math.ceil(vs.timer)).padStart(2,'0'),160,6,vs.timer<10?'#ff5a3a':'#efe8d6',16,'center');
  for(let i=0;i<2;i++){px(c,8+i*10,32,7,7,i<vs.wins[0]?'#f2b632':'#2a2440');px(c,305-i*10,32,7,7,i<vs.wins[1]?'#f2b632':'#2a2440');}
  const mb=(x,f,rev)=>{px(c,x-1,213,92,7,'#07060d');const w=Math.round(90*f.meter/100);px(c,rev?x+90-w:x,214,w,5,f.meter>=100?(Math.floor(vs.phT*6)%2?'#9fd8ff':'#ffffff'):'#4a6a9a');};
  mb(8,vs.a);mb(222,vs.b,true);if(vs.a.meter>=100)vtx('SUPER!',8,203,'#9fd8ff',6,'left',false);if(vs.b.meter>=100)vtx('SUPER!',312,203,'#9fd8ff',6,'right',false);
  if(vs.cutin&&vs.freeze>0){const f=vs.cutin.f,k=1-vs.freeze/.9,x0=f===vs.a?-320+k*640:320-k*640;px(c,0,74,SW,52,'rgba(0,0,0,.75)');
    px(c,0,74,SW,2,f.D.aura||'#f2b632');px(c,0,124,SW,2,f.D.aura||'#f2b632');
    drawPuppet(bg,f.L,{lean:0,crouch:0,fl:[0,0],bl:[0,0],fa:[0,0],ba:[0,0],weapon:false});const T=f.L.tall||0,hy=Math.round(OY-20-T*.8-17-T*.5-4);
    c.drawImage(buf,OX-7,hy-6,15,14,Math.round(clamp(x0+40,8,40)),76,45,42);
    vtx(f.D.suName,clamp(160+(f===vs.a?-1:1)*(1-k)*200,120,200),94,'#ffffff',8,'center');}
  if(vs.ban){const a=Math.min(1,vs.ban.t*3);c.globalAlpha=a;const big=vs.ban.l1.length<14;vtx(vs.ban.l1,160,big?84:96,vs.ban.l1==='K.O.'?'#ff3a2a':'#f2b632',big?24:8,'center');c.globalAlpha=1;}
  if(vs.a.inverted>0&&Math.floor(vs.phT*4)%2)vtx('CONTROLES INVERTIDOS',160,46,'#ff6a5a',6,'center',false);
}
function renderVsIntro(){
  const k=Math.min(1,vs.phT/.6);c.setTransform(1,0,0,1,0,0);px(c,0,0,SW,SH,'rgba(0,0,0,.55)');
  for(const [f,side] of[[vs.a,-1],[vs.b,1]]){drawPuppet(bg,f.L,poseFor({st:'idle',stT:0,t:vs.phT,kind:'npc',ph:0}));const x=160+side*(220-k*130);c.save();c.translate(x,200);c.scale(2.6,2.6);blit(0,0,-side,{outline:f.D.aura||'#07060d'});c.restore();
    vtx(f.D.name,x,40,'#efe8d6',8,'center');if(vs.phT>.9)vtx('"'+tr(f.D.quote)+'"',side<0?8:312,side<0?198:212,'#c8c0d8',6,side<0?'left':'right',false);}
  if(vs.phT>.5){vtx('VS',160,90,'#f2b632',24,'center');}
  vtx(vs.arena.name,160,20,'#9fb6c8',6,'center',false);
}

/* ---------- telas de seleção ---------- */
function vsSelectScreen(step){
  mode='vssel';showPad();layers=getLayers(11);
  const cards=VS_ORDER.map(id=>`<button class="card vsc" data-act="vschoose" data-id="${id}" type="button"><canvas width="72" height="72" data-pv="${id}"></canvas><div class="info"><div class="nm">${pf(VSF[id].name)}</div><div class="ln">${VSF[id].spName.toLowerCase().replace(/^./,m=>m.toUpperCase())}</div><div class="ln"><b>${VSF[id].suName.toLowerCase().replace(/^./,m=>m.toUpperCase())}</b></div></div></button>`).join('');
  const duels=step===1?`<p class="eyebrow">DUELOS CLASSICOS</p><div class="row" style="flex-wrap:wrap">${DUELS.map((d,i)=>`<button class="btn" data-act="vsduel" data-i="${i}" type="button"><span>${pf(VSF[d[0]].name)}</span> X <span>${pf(VSF[d[1]].name)}</span></button>`).join('')}</div>`:'';
  show(`<div class="box"><p class="eyebrow">LUTAS DOS SONHOS · ${step===1?'ESCOLHA SEU LUTADOR':'ESCOLHA O ADVERSARIO'}</p><h2>${step===1?'Quem entra na arena?':'<span>'+pf(VSF[vsPick].name)+'</span> <span>contra quem?</span>'}</h2>
    <p class="sub">Fora da história: as lutas que a série nunca mostrou. ATACAR soca, TIRO solta o especial, PULO pula, baixo defende, e MAGIA solta o supergolpe quando a barra enche.</p>${duels}
    <div class="pick vsgrid">${cards}</div>${step===2?'<div class="row"><button class="btn" data-act="vsrandom" type="button">ADVERSÁRIO ALEATÓRIO</button></div>':''}<div class="row"><button class="btn" data-act="title" type="button">◀ VOLTAR</button></div></div>`);
  vs={step};paintPortraits();
}
scr.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;if(!a.startsWith('vs'))return;audioOn();
  if(a==='vschoose'){if(vs&&vs.step===1){vsPick=b.dataset.id;vsSelectScreen(2);}else{vsStart(vsPick,b.dataset.id,null);}}
  else if(a==='vsrandom'){const o=VS_ORDER.filter(x=>x!==vsPick);vsStart(vsPick,o[(Math.random()*o.length)|0],null);}
  else if(a==='vsduel'){const d=DUELS[+b.dataset.i];vsPick=d[0];vsStart(d[0],d[1],d[2]);}
  else if(a==='vsagain'){vsStart(vs.p1id,vs.p2id,Object.keys(ARENAS).find(k=>ARENAS[k]===vs.arena));}
  else if(a==='vspick')vsSelectScreen(1);
  else if(a==='vsresume'){vs.paused=false;hideScreen();mode='vs';showPad();}
});
function vsPause(){if(mode!=='vs')return;vs.paused=true;show(`<div class="box"><p class="eyebrow">PAUSA</p><h2>Lutas dos Sonhos</h2><div class="row"><button class="btn go" data-act="vsresume" type="button">▶ CONTINUAR</button><button class="btn" data-act="title" type="button">SAIR</button></div></div>`);}
