'use strict';
/* ============ Fichas: inimigos, chefes, tiros e magias ============ */
const ENEMYDEF={},BOSSDEF={},SHOTS={},MAGICS={};
function spawnBossDef(k){
  const D=BOSSDEF[k],e=newEnt('enemy',cam.x+SW-60,182);
  e.type=k;e.isBoss=true;e.face=-1;e.atkCd=1.5;e.hp=e.maxHp=D.hp;e.look=LOOKS[D.look||k];e.spd=D.spd;e.name=D.name;e.outline=D.outline;
  if(D.demon)e.demon=true;
  e.st='appear';e.alpha=0;
  banner={l1:D.name,l2:D.sub||'',t:2.8};sfx(D.sfx||'boss');
  if(D.init)D.init(e);
  ents.push(e);boss=e;playSong('boss');shake=6;
}
/* ============ Personagens novos ============ */
Object.assign(LOOKS,{
  ruby:{skin:'#eec8a8',hair:'#e8c878',style:'woman',jacket:'#1a1414',jacketD:'#0e0a0a',shirt:'#5a2a2a',pants:'#1c1a22',pantsD:'#121016',boots:'#0c0a0a',weapon:'#c8ccd4',tall:0},
  ruby2:{skin:'#e8c0a0',hair:'#3a2418',style:'woman',jacket:'#2a1e1a',jacketD:'#1a1210',shirt:'#6a3a3a',pants:'#1c1a22',pantsD:'#121016',boots:'#0c0a0a',weapon:'#c8ccd4',tall:0},
  crowley:{skin:'#e4b894',hair:'#1e1612',style:'short',beard:'#3a2e26',jacket:'#141418',jacketD:'#0a0a0c',shirt:'#e8e8e8',tie:'#1a1a22',pants:'#141418',pantsD:'#0a0a0c',boots:'#060606',weapon:'#c8ccd4',tall:-1},
  jack:{skin:'#eec6a2',hair:'#7a5a3a',style:'messy',jacket:'#5a5a3a',jacketD:'#3e3e28',shirt:'#c8b89a',pants:'#3a4a6a',pantsD:'#28344c',boots:'#2a1e14',weapon:'#fff4c0',tall:1},
  ellen:{skin:'#eabc96',hair:'#4a2a1a',style:'woman',jacket:'#3a2a22',jacketD:'#261a14',shirt:'#6a5a4a',pants:'#2a2a34',pantsD:'#1c1c24',boots:'#1a1410',weapon:'#8c949e',gun:'shotgun',tall:0},
  jo:{skin:'#f0c8a8',hair:'#e0c080',style:'woman',jacket:'#4a3a5a',jacketD:'#32283e',shirt:'#c8b8a8',pants:'#2a3454',pantsD:'#1c243c',boots:'#1a1410',weapon:'#c8ccd4',gun:'pistol',tall:-1},
  deanMark:{skin:'#eab68c',hair:'#9a7040',style:'short',jacket:'#2e2420',jacketD:'#1e1612',shirt:'#5a1a1a',pants:'#2e3a52',pantsD:'#1e283a',boots:'#1c1410',weapon:'#e8dcc0',gun:'shotgun',tall:0},
  pride:{skin:'#dcb090',hair:'#2a2420',style:'short',jacket:'#4a4a52',jacketD:'#33333a',shirt:'#c8c8d0',tie:'#6a1a1a',pants:'#3a3a42',pantsD:'#26262e',boots:'#121212',eye:'#000',tall:3},
  lilith:{skin:'#f0dcd0',hair:'#e8d8b0',style:'woman',jacket:'#f4f0ec',jacketD:'#c8c4bc',shirt:'#ffffff',dress:'#f4f0ec',dressD:'#c8c4bc',skirt:true,eye:'#ffffff',boots:'#d8d0c8',tall:-8},
  lilith2:{skin:'#ecc8ac',hair:'#2a1c14',style:'woman',jacket:'#e8e0d8',jacketD:'#bcb4ac',shirt:'#f4f0ec',dress:'#e8e0d8',dressD:'#bcb4ac',skirt:true,eye:'#ffffff',boots:'#1a1410',tall:1},
  alastair:{skin:'#d8c0a8',hair:'#c8c4bc',style:'short',jacket:'#2a2a2e',jacketD:'#1a1a1e',shirt:'#8a8a90',pants:'#2a2a2e',pantsD:'#1a1a1e',boots:'#101010',eye:'#ffffff',tall:3},
  war:{skin:'#dcb094',hair:'#2a2018',style:'short',beard:'#3a2e24',jacket:'#2a2a30',jacketD:'#1a1a20',shirt:'#e0d8d0',tie:'#a01818',pants:'#2a2a30',pantsD:'#1a1a20',boots:'#101010',weapon:'#d0d4dc',tall:3},
  lucifer:{skin:'#e4c0a0',hair:'#6a5a4a',style:'short',jacket:'#3a4a5a',jacketD:'#28343e',shirt:'#8a9aaa',pants:'#2a2e38',pantsD:'#1c2026',boots:'#141414',eye:'#ff2a1a',tall:2},
  adam:{skin:'#eec6a2',hair:'#6a4a2a',style:'short',jacket:'#4a4a52',jacketD:'#33333a',shirt:'#9aa0a8',pants:'#3a4258',pantsD:'#283044',boots:'#1a1410',eye:'#9fd8ff',tall:1},
  abaddon:{skin:'#f0d0b8',hair:'#c83a1a',style:'woman',jacket:'#141014',jacketD:'#0a080a',shirt:'#2a1418',pants:'#141014',pantsD:'#0a080a',boots:'#060406',eye:'#000',tall:1},
  lucicas:{skin:'#ecc4a0',hair:'#2a2018',style:'messy',jacket:'#b49a6a',jacketD:'#8a7448',shirt:'#e8e8e8',tie:'#2a3a6a',pants:'#2a2a30',pantsD:'#1c1c22',boots:'#141414',eye:'#ff2a1a',tall:2},
  amara:{skin:'#e8c4a8',hair:'#140e0c',style:'woman',jacket:'#141018',jacketD:'#0a080c',shirt:'#1c1620',dress:'#141018',dressD:'#0a080c',skirt:true,eye:'#000',boots:'#060406',tall:1},
  chuck:{skin:'#e6be9c',hair:'#3a2a1e',style:'messy',beard:'#3a2a1e',jacket:'#5a4a3a',jacketD:'#3e3226',shirt:'#8a5a4a',plaid:'#5a3226',pants:'#3a3a44',pantsD:'#26262e',boots:'#2a1e14',tall:0},
  mary:{skin:'#f0c8a0',hair:'#e8c878',style:'woman',jacket:'#4a3a2a',jacketD:'#32261a',shirt:'#c8b8a0',pants:'#3a4a6a',pantsD:'#28344c',boots:'#1a1410',tall:0},
  eileen:{skin:'#eec8a8',hair:'#3a2418',style:'woman',jacket:'#4a5a6a',jacketD:'#34404c',shirt:'#c8c0b8',pants:'#2a2a34',pantsD:'#1c1c24',boots:'#1a1410',tall:-1},
  kevin:{skin:'#e8c49a',hair:'#141010',style:'short',jacket:'#3a4a3a',jacketD:'#283428',shirt:'#8a8a7a',pants:'#3a3a44',pantsD:'#26262e',boots:'#1a1410',tall:0},
  charlie:{skin:'#f2ccb0',hair:'#c8481a',style:'woman',jacket:'#2a3a5a',jacketD:'#1c283e',shirt:'#c8b8a8',pants:'#2a2a34',pantsD:'#1c1c24',boots:'#1a1410',tall:-1},
  dick:{skin:'#e4bc98',hair:'#1a1410',style:'short',jacket:'#1c1c22',jacketD:'#121216',shirt:'#e8e8e8',tie:'#3a3a6a',pants:'#1c1c22',pantsD:'#121216',boots:'#0a0a0a',tall:2},
  benny:{skin:'#e2b896',hair:'#3a2e24',style:'short',beard:'#4a3a2a',jacket:'#3a3a32',jacketD:'#282822',shirt:'#6a6458',pants:'#3a3a32',pantsD:'#282822',boots:'#1a1410',tall:1},
  metatron:{skin:'#e4c0a0',hair:'#3a3028',style:'short',jacket:'#5a5a5e',jacketD:'#3e3e42',shirt:'#c8c8c8',pants:'#3a3a3e',pantsD:'#26262a',boots:'#141414',tall:-2},
  kidDean:{skin:'#f0c098',hair:'#d8b060',style:'short',jacket:'#4a6a9a',jacketD:'#34507a',shirt:'#6a8aba',pants:'#4a6a9a',pantsD:'#34507a',boots:'#d8d0c0',tall:-8},
});
const MOOR=[ // moradores de River Pass, vistos como demônios pela Guerra
  {skin:'#dcb090',hair:'#3a2a1c',style:'short',jacket:'#5a4a3a',jacketD:'#3e3226',shirt:'#8a8478',pants:'#3a4258',pantsD:'#283044',boots:'#1a1410',eye:'#000'},
  {skin:'#e8c0a0',hair:'#6a4a2a',style:'woman',jacket:'#6a3a3a',jacketD:'#4a2828',shirt:'#c8b8a8',pants:'#2a2a34',pantsD:'#1c1c24',boots:'#1a1410',eye:'#000'},
  {skin:'#c8946c',hair:'#141010',style:'cap',cap:'#2a4a6a',jacket:'#3a5a3a',jacketD:'#284028',shirt:'#9a9a8a',plaid:'#284028',pants:'#3a3a44',pantsD:'#26262e',boots:'#1a1410',eye:'#000'},
];
const DARKS=[ // contaminados pela névoa
  {skin:'#9a9aa0',hair:'#141414',style:'short',jacket:'#2a2a30',jacketD:'#1a1a20',shirt:'#4a4a50',pants:'#2a2a30',pantsD:'#1a1a20',boots:'#0a0a0a',eye:'#000'},
  {skin:'#a8a4a4',hair:'#2a1c14',style:'woman',jacket:'#2a2228',jacketD:'#1a141a',shirt:'#4a4048',pants:'#26222a',pantsD:'#18141a',boots:'#0a0a0a',eye:'#000'},
];
const ANGELS=[
  {skin:'#e8c4a4',hair:'#4a3a2a',style:'short',jacket:'#2a2a30',jacketD:'#1a1a20',shirt:'#e8e8ec',tie:'#2a2a30',pants:'#2a2a30',pantsD:'#1a1a20',boots:'#0a0a0a',weapon:'#e8f0ff',eye:'#9fd8ff'},
  {skin:'#d8b090',hair:'#1a1410',style:'woman',jacket:'#3a3a44',jacketD:'#26262e',shirt:'#e0e0e8',pants:'#3a3a44',pantsD:'#26262e',boots:'#0a0a0a',weapon:'#e8f0ff',eye:'#9fd8ff'},
];
Object.assign(HEROES,{
  ruby:{name:'RUBY',reach:[24,26,24],dmg:[7,8,13],spd:66,shootCd:1.6,magicName:'FUMAÇA NEGRA',shot:'knife',mg:'smoke',gunName:'Faca arremessada',wName:'Faca da Ruby, que mata demônios',tag:'rubyknife',demon:true,stats:{forca:4,vel:5,tiro:4,magia:4},
    note:'Demônia: a faca dela mata demônios mais rápido, mas ataques sobrenaturais de longe ferem a Ruby mais do que os outros.'},
  crowley:{name:'CROWLEY',reach:[22,24,23],dmg:[6,7,12],spd:60,shootCd:2.4,magicName:'O CONTRATO',shot:'hound',mg:'contract',gunName:'Cão do inferno',wName:'Lâmina de demônio',tag:'blade',demon:true,stats:{forca:3,vel:3,tiro:5,magia:5},
    note:'Rei do Inferno: o contrato fere todos na tela e devolve vida ao Crowley. Como demônio, sofre mais com ataques sobrenaturais de longe.'},
  jack:{name:'JACK',reach:[25,27,26],dmg:[8,9,15],spd:66,shootCd:1.4,magicName:'PODER NEFILIM',shot:'beam',mg:'neph',free:true,mgCost:12,magicMult:1.5,gunName:'Raio de graça',wName:'Mãos de luz',tag:'smite',stats:{forca:5,vel:4,tiro:5,magia:5},
    note:'Nefilim: o poder máximo não precisa de sal, mas cada uso custa um pedaço da vida dele.'},
  ellen:{name:'ELLEN',reach:[24,26,24],dmg:[7,8,13],spd:58,shootCd:2.4,magicName:'CÍRCULO DE SAL',shot:'shotgun',mg:'salt',gunName:'Espingarda de sal grosso',wName:'Coronha da espingarda',tag:'iron',stats:{forca:4,vel:3,tiro:5,magia:4}},
  jo:{name:'JO',reach:[23,25,24],dmg:[6,7,12],spd:70,shootCd:1.6,magicName:'FACA GIRATÓRIA',shot:'pistol',mg:'spin',gunName:'Pistola',wName:'Faca de caça',tag:'blade',stats:{forca:3,vel:5,tiro:4,magia:3}},
  deanMark:{name:'DEAN',reach:[26,28,26],dmg:[9,10,16],spd:62,shootCd:2.6,magicName:'FÚRIA DA MARCA',shot:'shotgun',mg:'mark',gunName:'Espingarda',wName:'A Primeira Lâmina',tag:'blade',stats:{forca:5,vel:4,tiro:5,magia:5},
    note:'Marca de Caim: na fúria, o Dean bate o dobro e corre mais, mas perde vida enquanto ela dura.'},
  samBlood:{name:'SAM',reach:[27,29,26],dmg:[6,7,12],spd:68,shootCd:1.8,magicName:'PODER DO SANGUE',shot:'pistol',mg:'blood',magicMult:1.8,mgCost:8,gunName:'Pistola com bala de ferro',wName:'Faca da Ruby',tag:'rubyknife',stats:{forca:4,vel:5,tiro:3,magia:5},
    note:'Sangue de demônio: a onda do Sam fica muito mais forte, mas cada uso custa vida.'},
});
VARIANT.dean=ch=>ch===12?'deanMark':null;
VARIANT.sam=ch=>ch===9?'samBlood':null;
LOOKVAR.dean=ch=>ch===12?'deanMark':null;
LOOKVAR.ruby=ch=>ch>=8?'ruby2':null;
Object.assign(WEAK,{
  dm:Object.assign(WEAK.dm,{rubyknife:2.2}),meg:Object.assign(WEAK.meg,{rubyknife:1.8}),ac:Object.assign(WEAK.ac,{rubyknife:2.2}),
  hh:{holy:1.4,rubyknife:1.6,blade:1.3},an:{blade:1.6,smite:.6},dk:{smite:1.4,holy:1.2},
  pride:{holy:1.6,rubyknife:1.8,blade:1.3,smite:1.4},lilith:{rubyknife:1.4,holy:1.3},lilith2:{rubyknife:1.4,holy:1.3,smite:1.3},
  alastair:{holy:1.4,smite:1.5,rubyknife:1.5},abaddon:{blade:1.6,holy:1.3},lucicas:{smite:.8},amara:{smite:1.3},
});
Object.assign(FOE_NAME,{hh:'CÃO DO INFERNO',hm:'MORADOR',an:'ANJO',dk:'CONTAMINADO'});
Object.assign(ENEMYDEF,{
  hh:{ai:'vp',hp:40,look:()=>DEMONS[0],spd:[50,58],dmg:11,hound:true,demon:true},
  hm:{ai:'dm',walkIn:true,hp:36,look:()=>MOOR[(Math.random()*MOOR.length)|0],spd:[32,40],dmg:8,human:true,noThrow:true,outline:'#0c0610'},
  an:{ai:'v',hp:52,look:()=>ANGELS[(Math.random()*ANGELS.length)|0],spd:[36,42],dmg:11,angel:true,outline:'#2a3a4a'},
  dk:{ai:'vp',walkIn:true,hp:40,look:()=>DARKS[(Math.random()*DARKS.length)|0],spd:[42,50],dmg:10,dark:true,outline:'#000000'},
});
let decals=[];
function enemyFalls(e){
  if(e.human){floatMsg('ERA UM MORADOR',e.x,e.y);score+=50;}
  if(e.angel)decals.push({x:e.x,y:e.y,life:8});
  if(e.hound)sfx('hiss');
}

/* ============ Tiros e magias novas ============ */
SHOTS.knife=p=>{if(p.stT>=.12&&!p.shot){p.shot=1;sfx('swing');projs.push({kind:'knife',x:p.x+p.face*14,y:p.y,z:30,vx:p.face*340,life:.8,dmg:12,kd:false,owner:'p',tag:'rubyknife'});}};
SHOTS.hound=p=>{if(p.stT>=.18&&!p.shot){p.shot=1;sfx('hiss');projs.push({kind:'hound',x:p.x+p.face*14,y:p.y,z:6,vx:p.face*260,life:1.1,dmg:14,kd:true,owner:'p',pierce:true,set:new Set(),tag:'blade'});}};
SHOTS.beam=p=>{if(p.stT>=.12&&!p.shot){p.shot=1;sfx('magic');flash=.15;shake=Math.max(shake,3);
  strike(p,ents,170,14,true,{set:new Set(),depth:12,zr:40,tag:'smite'});
  for(let i=0;i<26;i++)parts.push({x:p.x+p.face*(16+i*6),y:p.y,z:28+rand(-2,2),vx:0,vy:0,vz:0,life:.25,max:.25,col:i%2?'#fff4c0':'#ffd23a',size:3,grav:0});}};
MAGICS.smoke=(p,H,dt)=>{ // Ruby vira fumaça e atravessa a tela
  if(p.stT<.15)return false;
  if(!p.mDone){p.mDone=true;p.set=new Set();sfx('smoke');}
  if(p.stT<.75){p.x=clamp(p.x+p.face*300*dt,cam.x+10,cam.x+SW-10);
    for(let i=0;i<3;i++)parts.push({x:p.x+rand(-8,8),y:p.y,z:rand(0,46),vx:-p.face*rand(10,40),vy:0,vz:rand(-5,10),life:.5,max:.5,col:'#0c080e',size:3,grav:0});
    for(const e of ents){if(e.dead||SKIP_ST.includes(e.st)||p.set.has(e))continue;if(Math.abs(e.x-p.x)<18&&Math.abs(e.y-p.y)<14){p.set.add(e);damage(e,10+8*p.mlvl,true,p.face,{tag:'rubyknife'});}}}
  return p.stT>.95;};
MAGICS.contract=(p,H,dt)=>{ // Crowley: cada alma tem seu preço
  if(p.stT>=.6&&!p.mDone){p.mDone=true;flash=.4;shake=6;sfx('boss');let n=0;
    for(const e of ents){if(e.dead||e.x<cam.x-10||e.x>cam.x+SW+10||['dead','dying','vanish','bout'].includes(e.st))continue;damage(e,10+10*p.mlvl,e.isBoss?p.mlvl>=3:true,sgn(e.x-p.x),{tag:'blade'});n++;
      for(let i=0;i<6;i++)parts.push({x:e.x,y:e.y,z:rand(10,40),vx:(p.x-e.x)*rand(.8,1.4),vy:0,vz:rand(-10,10),life:.6,max:.6,col:i%2?'#c81a10':'#ff6a3a',size:2,grav:0});}
    const h=Math.min(30,4*n+4);P.hp=Math.min(P.maxHp,P.hp+h);floatMsg('+'+h,p.x,p.y);}
  return p.stT>1.1;};
MAGICS.neph=(p,H,dt)=>{ // Jack: explosão de graça na tela toda
  if(p.stT<.6&&Math.random()<.8)parts.push({x:p.x+rand(-10,10),y:p.y,z:rand(10,50),vx:0,vy:0,vz:rand(20,60),life:.4,max:.4,col:'#ffd23a',size:2,grav:0});
  if(p.stT>=.6&&!p.mDone){p.mDone=true;flash=1;shake=10;sfx('colt');
    for(const e of ents){if(e.dead||e.x<cam.x-10||e.x>cam.x+SW+10||['dead','dying','vanish','bout'].includes(e.st))continue;damage(e,Math.round((12+12*p.mlvl)*1.5),true,sgn(e.x-p.x),{tag:'smite'});}
    for(let i=0;i<50;i++)parts.push({x:cam.x+rand(0,SW),y:rand(LT,LB),z:rand(0,80),vx:0,vy:0,vz:rand(40,120),life:.8,max:.8,col:i%2?'#ffd23a':'#fff4c0',size:2,grav:0});}
  return p.stT>1.2;};
MAGICS.mark=(p,H,dt)=>{ // Dean: a fúria da Marca de Caim
  if(p.stT>=.3&&!p.mDone){p.mDone=true;p.berserk=4+p.mlvl;flash=.5;shake=8;sfx('heavy');banner={l1:'A MARCA ACORDA',l2:'DANO DOBRADO, MAS CUSTA VIDA',t:1.6,small:true};
    for(let i=0;i<24;i++)parts.push({ring:i<3,x:p.x,y:p.y,z:24,r:4+i*6,vr:180,life:.4,max:.4,col:'#c81a10'});}
  return p.stT>.6;};

/* ============ Chefes ============ */
function proj3(e,p,kind,spd,dmg,dys,o){for(const dy of dys)projs.push(Object.assign({kind,x:e.x+e.face*12,y:clamp(e.y+dy,LT,LB),z:28,vx:e.face*spd,life:2.6,dmg,owner:'e'},o||{}));}
function lightBlast(e){ // a luz branca de Lilith
  flash=.9;shake=8;sfx('magic');
  for(const dy of[-14,0,14])projs.push({kind:'light',big:true,x:e.x+e.face*10,y:clamp(e.y+dy,LT,LB),z:20,vx:e.face*150,life:2.4,dmg:13,owner:'e'});
}
let memGot=0,invertT=0;
const MEMS=[{l1:'O SOLDADINHO NO CINZEIRO',l2:'SAM ENFIOU ALI QUANDO ERA CRIANÇA'},{l1:'OS LEGOS NA VENTILAÇÃO',l2:'DEAN PÔS ALI E O CARRO CHACOALHA ATÉ HOJE'},{l1:'AS INICIAIS NO CARRO',l2:'D.W. E S.W., GRAVADAS PELOS DOIS'}];
Object.assign(BOSSDEF,{
  pride:{name:'ORGULHO',sub:'UM DOS SETE PECADOS',hp:440,spd:36,outline:'#0c0610',demon:true,smoky:true,dist:80,sfx:'smoke',summon:['dm','dm'],sumTxt:'OS OUTROS PECADOS',
    pick:(e,near,r)=>near?'bwind':r<.5?'throw':'bout'},
  lilith:{name:'LILITH',sub:'A PRIMEIRA DEMÔNIA',hp:420,spd:30,outline:'#d8d8e8',demon:true,smoky:true,dist:100,sfx:'scream',summon:['hh','hh'],sumTxt:'OS CÃES DO INFERNO',
    pick:(e,near,r)=>near?'bout':r<.45?'cast':r<.75?'pinw':'bout',cast:lightBlast,
    onDie:b=>{banner={l1:'MEIA-NOITE',l2:'O RELÓGIO DE DEAN PAROU',t:3};},
    die:(e,dt)=>{e.alpha=Math.max(0,1-e.stT/1.6);if(Math.random()<.6)parts.push({x:e.x+rand(-8,8),y:e.y,z:rand(0,40),vx:0,vy:0,vz:rand(20,60),life:.6,max:.6,col:'#ffffff',size:2,grav:0});if(e.stT>2.4&&!endT)endT=1.5;}},
  alastair:{name:'ALASTAIR',sub:'O TORTURADOR DO INFERNO',hp:480,spd:38,outline:'#0c0610',demon:true,trapImmune:true,smoky:true,dist:70,summon:['dm','dm'],sumTxt:'DEMÔNIOS DE ALASTAIR',rage:'A ARMADILHA NÃO SEGURA ALASTAIR',
    pick:(e,near,r)=>near?'bwind':r<.5?'throw':'bout',
    fire:(e,p)=>{sfx('swing');proj3(e,p,'blade',190,10,[-12,0,12]);}},
  lilith2:{name:'LILITH',sub:'O ÚLTIMO SELO',hp:540,look:'lilith2',spd:32,outline:'#d8d8e8',demon:true,smoky:true,dist:100,sfx:'scream',summon:['dm','an'],sumTxt:'O CONVENTO SE ENCHE',
    pick:(e,near,r)=>near?(r<.5?'bwind':'bout'):r<.5?'cast':r<.8?'pinw':'bout',cast:lightBlast},
  war:{name:'GUERRA',sub:'O CAVALEIRO VERMELHO',hp:500,spd:40,dist:70,sfx:'heavy',rage:'A GUERRA SE ESPALHA',
    pick:(e,near,r)=>near?'bwind':r<.45?'lwind':'cast',
    cast:e=>{banner={l1:'TODOS CONTRA TODOS',l2:'',t:1.4,small:true};sfx('scream');spawnEnemy('hm',cam.x+20,rand(LT,LB));spawnEnemy('hm',cam.x+SW-20,rand(LT,LB));},
    onDie:b=>{banner={l1:'O ANEL DA GUERRA',l2:'DEAN CORTA O DEDO DO CAVALEIRO',t:2.8,small:true};}},
  lucifer:{name:'LÚCIFER',sub:'NO CORPO DO SAM',hp:3,look:'sam',spd:34,outline:'#3a0a06',dist:100,sfx:'boss',
    init:e=>{memGot=0;e.memT=4;e.look=Object.assign({},LOOKS.sam,{eye:'#ff2a1a'});},
    shield:b=>true,shieldTxt:'NÃO ADIANTA BATER',
    hud:b=>({label:'MEMÓRIAS DO SAM '+memGot+'/3',k:memGot/3,col:'#9fd8ff'}),
    tick:(e,dt)=>{if(e.st==='dying')return false;
      if(!items.some(i=>i.type==='mem')){e.memT-=dt;if(e.memT<=0&&memGot<3){e.memT=6;dropItem('mem',clamp(P.x+(P.x-cam.x>SW/2?-1:1)*rand(80,130),cam.x+20,cam.x+SW-20),rand(LT+6,LB-6));banner={l1:'UMA MEMÓRIA',l2:'PEGUE ANTES QUE ELE PERCEBA',t:1.6,small:true};}}
      if(memGot>=3){e.hp=0;bossDie(e);return true;}return false;},
    pick:(e,near,r)=>near?(r<.5?'bout':'pinw'):r<.4?'throw':r<.75?'pinw':'bout',
    fire:(e,p)=>{sfx('fire');proj3(e,p,'redfire',140,12,[-16,0,16]);},
    onDie:b=>{banner={l1:'SAM VOLTOU',l2:'',t:3};},
    die:(e,dt)=>{if(Math.random()<.4)parts.push({x:e.x+rand(-8,8),y:e.y,z:rand(0,46),vx:0,vy:0,vz:rand(20,50),life:.6,max:.6,col:'#9fd8ff',size:2,grav:0});if(e.stT>2.4&&!endT)endT=1.5;}},
  abaddon:{name:'ABADDON',sub:'A ÚLTIMA CAVALEIRA DO INFERNO',hp:560,spd:42,outline:'#1a0404',demon:true,smoky:true,dist:70,summon:['dm','dm'],sumTxt:'O EXÉRCITO DE ABADDON',rage:'ABADDON PERDE A PACIÊNCIA',
    pick:(e,near,r)=>near?'bwind':r<.35?'lwind':r<.65?'throw':'bout',
    onDie:b=>{banner={l1:'A PRIMEIRA LÂMINA',l2:'DEAN ACABA COM ABADDON',t:2.8,small:true};}},
  lucicas:{name:'LÚCIFER',sub:'NO CORPO DE CASTIEL',hp:520,spd:38,outline:'#3a0a06',smoky:true,dist:90,
    pick:(e,near,r)=>near?(r<.5?'bwind':'bout'):r<.4?'throw':r<.7?'pinw':'bout',
    fire:(e,p)=>{sfx('fire');proj3(e,p,'redfire',150,12,[-14,0,14]);},
    onDie:b=>{banner={l1:'ROWENA ABRE O FEITIÇO',l2:'LÚCIFER É EXPULSO DO CASTIEL',t:2.8,small:true};}},
  amara:{name:'AMARA',sub:'A ESCURIDÃO',hp:620,spd:30,outline:'#000000',smoky:true,dist:110,sfx:'boss',summon:['dk','dk'],sumTxt:'A NÉVOA SE ESPALHA',
    pick:(e,near,r)=>near?'bout':r<.4?'throw':r<.75?'pinw':'cast',
    fire:(e,p)=>{sfx('smoke');proj3(e,p,'dark',120,12,[-20,-7,7,20]);},
    cast:(e,p)=>{sfx('smoke');shake=6;for(const d of[-1,1])projs.push({kind:'dark',big:true,x:e.x+d*12,y:p.y,z:10,vx:d*130,life:2.6,dmg:13,owner:'e'});},
    onDie:b=>{banner={l1:'CHUCK CHEGA',l2:'IRMÃO E IRMÃ, FRENTE A FRENTE',t:3};}},
  chuck:{name:'CHUCK',sub:'O AUTOR',hp:720,spd:34,outline:'#3a2a1e',dist:110,sfx:'boss',
    init:e=>{e.phase=0;},
    shield:b=>props.some(q=>q.letter&&!q.dead),shieldTxt:'QUEBRE AS LETRAS',
    hud:b=>{const lt=props.some(q=>q.letter&&!q.dead);return{label:lt?'QUEBRE O "FIM"':'CHUCK, O AUTOR',k:b.hp/b.maxHp,col:'#e8e4d8'};},
    tick:(e,dt)=>{
      if(e.phase===0&&e.hp<e.maxHp*.7){e.phase=1;reprise();}
      if(e.phase===1&&e.hp<e.maxHp*.4){e.phase=2;writeEnd();}
      return false;},
    pick:(e,near,r)=>near?'bout':r<.45?'throw':r<.75?'pinw':'cast',
    fire:(e,p)=>{sfx('swing');proj3(e,p,'page',160,11,[-18,-6,6,18]);},
    cast:(e,p)=>{invertT=4;banner={l1:'CHUCK REESCREVE AS REGRAS',l2:'OS CONTROLES ESTÃO INVERTIDOS',t:2,small:true};sfx('magic');flash=.4;},
    onDie:b=>{banner={l1:'TODOS JUNTOS',l2:'DEAN, SAM, CASTIEL E JACK',t:3};flash=1;shake=14;},
    die:(e,dt)=>{e.alpha=1;if(Math.random()<.5)parts.push({x:e.x+rand(-10,10),y:e.y,z:rand(0,46),vx:0,vy:0,vz:rand(20,60),life:.6,max:.6,col:'#ffd23a',size:2,grav:0});if(e.stT>2.6&&!endT)endT=1.5;}},
});
function reprise(){ // Chuck traz de volta inimigos de histórias antigas
  banner={l1:'REPRISE',l2:'CHUCK REESCREVE OS CHEFES ANTIGOS',t:2.4};sfx('scream');flash=.5;
  const olds=[['v',LOOKS.woman,'A MULHER DE BRANCO'],['vp',LOOKS.luther,'LUTHER'],['dm',LOOKS.azazel,'AZAZEL'],['dm',LOOKS.lilith,'LILITH']];
  olds.forEach(([t,L,nm],i)=>{const e=spawnEnemy(t,cam.x+(i%2?SW-30:30),LT+12+i*14);e.look=L;e.fname=nm;e.hp=e.maxHp=60;e.reprise=true;});
}
function writeEnd(){ // Chuck escreve FIM na tela
  banner={l1:'FIM',l2:'QUEBRE AS LETRAS PARA CONTINUAR',t:2.4};sfx('boss');flash=.6;
  ['F','I','M'].forEach((ch,i)=>{const e=newEnt('prop',cam.x+90+i*70,LT+22+(i%2)*18);e.hp=1;e.letter=ch;e.lhp=3;props.push(e);});
}

/* ============ Capítulos 3 a 8 ============ */
const Z=(a,b,c,d)=>[{x:80,waves:a},{x:400,waves:b},{x:770,waves:c},{x:1120,waves:d},BOSS_ZONE];
CHAPTERS.push(
  {title:'OS SETE PECADOS',place:'OASIS PLAINS, NEBRASKA',heroes:['dean','sam','bobby','ruby'],boss:'pride',
    newcomers:[{id:'ruby',label:'RUBY',why:'Uma demônia loira que salva os irmãos com uma faca capaz de matar demônios. Ela diz que pode ajudar Dean a escapar do pacto. Dean não confia nela.'}],
    zones:Z([['dm','dm']],[['dm','dm','dm'],['dm','dm']],[['dm','dm','dm'],['dm','dm','dm','dm']],[['dm','dm','dm','dm'],['dm','dm','dm']]),
    drops:['salt','burger','salt','pie','salt'],
    intro:'Na primeira caçada depois do Portão, os irmãos dão de cara com sete demônios ao mesmo tempo: os Sete Pecados Capitais, soltos numa cidade pequena do Nebraska.',
    tip:'Nova caçadora: RUBY. A faca dela mata demônios mais rápido do que qualquer arma.',
    hint:'Dean tem um ano de vida. A faca da Ruby é a melhor arma contra os Pecados.',
    over:'Dica: os Pecados se teletransportam para as suas costas. Guarde o especial para quando aparecerem.',
    outro:{h:'Os Pecados',t:'Orgulho cai, e Bobby exorciza os Pecados que sobraram. Ruby some na noite com a faca, deixando uma promessa: ela sabe como livrar Dean do pacto. Dean não acredita. O relógio continua correndo.'}},
  {title:'SEM DESCANSO',place:'NEW HARMONY, INDIANA',heroes:['dean','sam','bobby','ruby'],boss:'lilith',
    zones:Z([['hh','dm']],[['hh','hh','dm'],['dm','dm']],[['hh','dm','hh'],['hh','hh','dm']],[['dm','hh','hh','dm'],['hh','hh','hh']]),
    drops:['salt','pie','salt','burger','salt'],
    intro:'O ano de Dean chegou ao fim. Bela roubou o Colt e entregou aos demônios, e a dona do contrato de Dean finalmente tem nome: Lilith, a primeira demônia. A pista leva a um subúrbio de New Harmony, onde ela se esconde no corpo de uma menina. Faltam poucas horas para a meia-noite.',
    tip:'Os cães do inferno são invisíveis: veja a sombra e os olhos vermelhos. Lilith ataca com uma luz branca, então saia da frente.',
    hint:'Última noite de Dean. Os cães do inferno estão chegando.',
    over:'Dica: quando Lilith levanta os braços, a luz branca vem em três linhas. Mude de altura.',
    outro:{h:'Meia-noite',t:'O relógio bate meia-noite. Os cães do inferno arrebentam a porta e despedaçam Dean diante do irmão. Lilith ergue a mão contra Sam, e a luz branca que mata tudo não faz nada com ele. No escuro, Dean acorda pendurado por correntes. Está no inferno.'}},
  {title:'LÁZARO',place:'PONTIAC, ILLINOIS',heroes:['dean','sam','bobby','cas','ruby'],boss:'alastair',
    newcomers:[{id:'cas',label:'CASTIEL',why:'Um anjo do Senhor, com a força total do Céu: lâmina angelical, teletransporte e a luz que mata demônios. Foi ele quem tirou Dean do inferno.'}],
    zones:Z([['dm','dm']],[['dm','dm','dm'],['dm','dm']],[['dm','dm','dm'],['an','dm','dm']],[['dm','dm','dm','dm'],['dm','an','dm']]),
    drops:['salt','burger','salt','pie','salt'],
    intro:'Os demônios querem Dean de volta. Quem comanda a caçada é Alastair, o torturador que trabalhou a alma de Dean por trinta anos, no tempo do inferno. Os anjos também andam por perto, e nem todos estão do lado dos Winchester.',
    tip:'Novo caçador: CASTIEL. Alastair não fica preso na Armadilha do Diabo por muito tempo.',
    hint:'Dean voltou do inferno. Ruby voltou em outro corpo.',
    over:'Dica: as facas de Alastair vêm em três linhas. Pule ou mude de altura.',
    outro:{h:'Alastair',t:'Alastair cai, e Sam termina o serviço com um poder que vinha treinando escondido com Ruby: ele mata o demônio só com a mente. Dean vê o irmão fazer isso sem saber, ainda, de onde vem aquela força: sangue de demônio.'}},
  {title:'O ÚLTIMO SELO',place:'CONVENTO DE SANTA MARIA, MARYLAND',heroes:['sam','dean','cas','ruby'],boss:'lilith2',
    zones:Z([['dm','dm']],[['dm','an','dm'],['an','an']],[['dm','dm','an'],['dm','dm','dm']],[['an','dm','an','dm'],['dm','dm','dm']]),
    drops:['salt','pie','salt','burger','salt'],
    intro:'Quase todos os selos estão quebrados. Sam, cheio de sangue de demônio, vai atrás de Lilith com Ruby. Os anjos trancam Dean numa sala: eles querem que o Apocalipse aconteça. Castiel se rebela contra o Céu e tira Dean de lá.',
    tip:'O Sam joga com o sangue de demônio: a magia dele fica muito mais forte, mas cada uso custa vida.',
    hint:'O Sam está diferente neste capítulo. Leia a ficha dele.',
    over:'Dica: Lilith ataca de longe. Use o teletransporte do Castiel ou a fumaça da Ruby para chegar perto.',
    outro:{h:'O último selo',t:'Sam mata Lilith. O sangue dela escorre pelo chão e desenha um círculo: ela era o último selo. Ruby ri. Ela trabalhava para Lúcifer desde o começo. Sam segura Ruby, e Dean crava nela a faca da própria demônia. Debaixo do convento, a Jaula se abre. Lúcifer está livre.'}},
  {title:'GUERRA',place:'RIVER PASS, COLORADO',heroes:['dean','sam','ellen','jo'],boss:'war',
    newcomers:[{id:'ellen',label:'ELLEN HARVELLE',why:'Dona da Roadhouse e velha amiga de John. Caçadora experiente, de espingarda na mão.'},{id:'jo',label:'JO HARVELLE',why:'Filha de Ellen. Cresceu ouvindo histórias dos Winchester e virou caçadora contra a vontade da mãe.'}],
    zones:Z([['hm','hm']],[['hm','hm','hm'],['hm','hm']],[['hm','hm','hm'],['hm','hm','hm','hm']],[['hm','hm','hm','hm'],['hm','hm','hm']]),
    drops:['salt','burger','salt','pie','salt'],
    intro:'River Pass virou zona de guerra: os moradores juram que a cidade foi tomada por demônios. Os irmãos encontram Ellen e Jo no meio do tiroteio. Mas há algo errado: ninguém ali tem cheiro de enxofre.',
    tip:'Ninguém aqui é demônio. É a Guerra, o Cavaleiro, fazendo as pessoas se enxergarem como monstros. Derrube os moradores, não mate.',
    hint:'Ellen e Jo entram na equipe. Os "demônios" desta fase são gente comum.',
    over:'Dica: a Guerra investe com a espada. Saia da linha dele andando para cima ou para baixo.',
    outro:{h:'O primeiro anel',t:'Dean corta o dedo da Guerra e fica com o anel. O Cavaleiro some no Mustang vermelho, e os moradores de River Pass voltam a se ver como gente. Faltam Fome, Peste e Morte.'}},
  {title:'A JAULA',place:'CEMITÉRIO DE STULL, KANSAS',heroes:['dean'],boss:'lucifer',
    zones:[{x:80,waves:[['dm','dm']]},{x:600,waves:[['dm','an','dm'],['an','an']]},{x:1120,waves:[['dm','dm','an','dm']]},BOSS_ZONE],
    drops:['pie','burger','salt','pie','salt'],
    intro:'Os quatro anéis estão juntos, mas o preço foi alto: Ellen e Jo se sacrificaram contra os cães do inferno. Sam diz sim a Lúcifer para jogá-lo de volta na Jaula, só que o Diabo toma conta. No cemitério de Stull, Miguel chega no corpo de Adam, o meio-irmão dos Winchester. Dean chega no Impala, sozinho.',
    tip:'Não dá para vencer o Diabo na porrada. Sobreviva e pegue as três memórias que aparecem no chão: elas trazem o Sam de volta.',
    hint:'Só o Dean. Os outros já caíram.',
    over:'Dica: fuja dos círculos e das chamas, e corra para cada memória assim que ela aparecer.',
    outro:{h:'A Jaula',t:'Lúcifer vê o soldadinho no cinzeiro do Impala, e quem pisca é o Sam. Ele retoma o controle, abre a Jaula com os anéis e se joga lá dentro, levando o Diabo junto. Miguel tenta impedir e cai também, no corpo de Adam. A Jaula se fecha. Castiel volta à vida, cura Dean e Bobby. Dean cumpre a promessa ao irmão e vai tentar viver uma vida normal. Debaixo de um poste, do outro lado da rua, alguém observa. É o Sam.'}},
  {title:'A PRIMEIRA LÂMINA',place:'ESCONDERIJO DE ABADDON',heroes:['dean','sam','cas','crowley'],boss:'abaddon',
    newcomers:[{id:'crowley',label:'CROWLEY',why:'O Rei do Inferno, do lado dos Winchester porque Abaddon quer o trono dele. Cães do inferno, contratos e muito sarcasmo.'},{id:'dean',label:'DEAN COM A MARCA DE CAIM',why:'A Primeira Lâmina é a única arma que mata um Cavaleiro do Inferno, e só funciona nas mãos de quem tem a Marca. Dean aceitou o preço.'}],
    zones:Z([['dm','dm']],[['dm','dm','dm'],['dm','dm']],[['dm','dm','dm'],['dm','dm','dm','dm']],[['dm','dm','dm','dm'],['dm','dm','dm','dm']]),
    drops:['salt','burger','salt','pie','salt'],
    intro:'Abaddon reuniu um exército de demônios para tomar o inferno e transformar a Terra no quintal dele. Com a Marca de Caim no braço e a Primeira Lâmina na mão, Dean vai buscá-la, com Sam, Castiel e um aliado improvável: Crowley.',
    tip:'A FÚRIA DA MARCA dobra o dano do Dean e deixa ele mais rápido, mas consome vida enquanto dura.',
    hint:'Dean carrega a Marca. Crowley entra na equipe.',
    over:'Dica: Abaddon investe em linha reta. Desvie e contra-ataque pelas costas.',
    outro:{h:'Demônio',t:'Com a Primeira Lâmina, Dean acaba com Abaddon. Mas a Marca não sossega. Metatron mata Dean com uma lâmina de anjo, e ele morre nos braços do irmão. No bunker, os olhos de Dean se abrem, pretos. A Marca não o deixou morrer: Dean virou demônio.'}},
  {title:'O DIABO NO ANJO',place:'ESTRADAS DO KANSAS, NA NÉVOA',heroes:['dean','sam','crowley'],boss:'lucicas',
    zones:Z([['dk','dk']],[['dk','dk','dk'],['dk','dk']],[['dk','dm','dk'],['dk','dk','dk']],[['dk','dk','dk','dk'],['dm','dk','dk']]),
    drops:['salt','pie','salt','burger','salt'],
    intro:'A névoa da Escuridão se espalha, e quem a respira vira um monstro sem alma. Para enfrentar Amara, Castiel diz sim a Lúcifer. O Diabo agora usa o corpo do anjo e decide que os Winchester estão no caminho dele.',
    tip:'Os contaminados correm em linha reta e não sentem dor. Lúcifer no corpo do Castiel ataca com fogo e estalos de dedo.',
    hint:'Castiel não está na equipe: o corpo dele é do Diabo agora.',
    over:'Dica: quando aparecer um círculo no chão, saia de cima dele.',
    outro:{h:'Expulso',t:'Lúcifer cai de joelhos, e Rowena, a bruxa mãe de Crowley, abre o feitiço que arranca o Diabo do corpo de Castiel. Cas está de volta. Falta a Escuridão.'}},
  {title:'A ESCURIDÃO',place:'UM PARQUE, SOB O SOL QUE SE APAGA',heroes:['dean','sam','cas','crowley'],boss:'amara',
    zones:Z([['dk','dk']],[['dk','dk','dk'],['dk','dk']],[['dk','dk','dk'],['dk','dk','dk','dk']],[['dk','dk','dk','dk'],['dk','dk','dk']]),
    drops:['salt','burger','salt','pie','salt'],
    intro:'Chuck Shurley, o profeta que escrevia a vida dos irmãos, reaparece e revela a verdade: ele é Deus. Amara, a irmã dele, presa desde antes da criação, feriu Chuck e está apagando o sol. Se ela vencer, não sobra nada.',
    tip:'Amara não para de chamar contaminados. Use as magias de tela toda quando eles se juntarem.',
    hint:'Castiel volta para a equipe.',
    over:'Dica: a névoa de Amara vem em quatro linhas. Fique entre elas.',
    outro:{h:'Irmãos',t:'Dean chega até Amara com uma bomba de almas no peito e pede que ela perdoe o irmão. Amara chama Chuck. Os dois se abraçam, o sol volta a brilhar, e os irmãos de Deus vão embora juntos. Antes de partir, Amara devolve a Dean o que ele mais queria: a mãe. Mary Winchester está viva.'}},
  {title:'O AUTOR',place:'AS PÁGINAS DE CHUCK',heroes:['dean','sam','cas','jack'],boss:'chuck',choice:true,
    newcomers:[{id:'jack',label:'JACK KLINE',why:'Filho de Lúcifer, criado por Sam, Dean e Castiel como o filho que nunca tiveram. Metade anjo, metade humano: o caçador mais forte do jogo.'}],
    zones:Z([['v','v']],[['v','vp','v'],['dm','dm']],[['vp','dm','v'],['an','dm','vp']],[['dm','an','vp','v'],['dm','dm','an','vp']]),
    drops:['salt','pie','salt','burger','salt'],
    intro:'Chuck reescreve o mundo em volta dos irmãos, página por página. Monstros de histórias antigas voltam à vida, e o chão vira papel. Para chegar até o autor, é preciso atravessar o roteiro dele.',
    tip:'Chuck vai reescrever a luta: traz chefes antigos, inverte os controles e escreve FIM na tela. Quebre as letras para continuar.',
    hint:'A última caçada. Jack entra na equipe.',
    over:'Dica: quando os controles inverterem, espere um instante parado. Dura poucos segundos.'},
);
const sc=(place,text,draw)=>({place,text,draw});
ARCS.push(
  {title:'UM ANO',season:'TEMPORADA 3',stages:[6,7],
    intro:'Os olhos amarelos se apagaram, mas o Portão do Diabo ficou aberto tempo demais. Centenas de demônios andam soltos. E Dean tem só um ano antes de os cães do inferno virem buscá-lo.',
    scenes:[
      sc('A ESTRADA · 2007','Os olhos amarelos se apagaram, mas o Portão do Diabo ficou aberto tempo demais. Centenas de demônios andam soltos pelo mundo.',mkScene({stage:6,cx:40,impala:[60,138],chars:[['dean',200,-1],['sam',226,-1]]})),
      sc('O RELÓGIO','E Dean tem só um ano. Quando o prazo acabar, os cães do inferno vêm buscar a alma dele. Sam promete que vai achar um jeito de quebrar o pacto.',mkScene({stage:6,cx:300,chars:[['dean',140,1],['sam',176,-1]],fx:['clock']})),
    ]},
  {title:'OS SELOS',season:'TEMPORADA 4',stages:[8,9],
    intro:'Quatro meses depois de ir para o inferno, Dean sai de uma cova em Pontiac, Illinois, sem um arranhão. Alguém o tirou de lá.',
    scenes:[
      sc('O INFERNO','Quatro meses na Terra são quarenta anos no inferno. Por trinta, Dean resistiu às torturas de Alastair. Depois, quebrou.',mkScene({void:'#2a0606',chars:[['dean',160,1,'hurt']],fx:['chains','hellfire']})),
      sc('PONTIAC, ILLINOIS','Uma mão rompe a terra de uma cova rasa. Dean sai vivo, sem um arranhão, no meio de uma clareira de árvores derrubadas em círculo.',mkScene({stage:8,cx:150,chars:[['dean',118,1,'getup']],fx:['grave']})),
      sc('UM CELEIRO, DIAS DEPOIS','Dean e Bobby enchem um celeiro de armadilhas e invocam o que o tirou do inferno. As portas se abrem sozinhas, e as lâmpadas estouram uma a uma.',mkScene({stage:8,cx:1500,chars:[['dean',120,1],['bobby',96,1],['cas',230,-1]],fx:['sparks']})),
      sc('O CELEIRO','Por um instante, a sombra de duas asas enormes cobre as paredes. "Eu sou aquele que te agarrou firme e te tirou da perdição." O nome dele é Castiel. É um anjo do Senhor.',mkScene({stage:8,cx:1500,chars:[['dean',130,1],['cas',200,-1]],fx:['wings']})),
      sc('OS 66 SELOS','Lilith quer quebrar 66 selos para libertar Lúcifer da Jaula. No meio da guerra, os irmãos acham um escritor de livros baratos, Chuck Shurley, que assina como Carver Edlund e escreve a vida deles antes de ela acontecer. Ele é um profeta. Guarde esse nome.',mkScene({stage:7,cx:300,chars:[['chuck',160,1]],fx:['book']})),
    ]},
  {title:'A JAULA',season:'TEMPORADA 5',stages:[10,11],
    intro:'Lúcifer está livre. Para vencer o Diabo, os irmãos precisam dos anéis dos Quatro Cavaleiros: Guerra, Fome, Peste e Morte. Juntos, eles abrem a Jaula.',
    scenes:[
      sc('O APOCALIPSE · 2009','Lúcifer anda pela Terra no corpo de Nick, um homem que perdeu a família. Por onde ele passa, a terra congela.',mkScene({stage:11,cx:300,chars:[['lucifer',160,1]],fx:['frost']})),
      sc('O DESTINO','Os anjos têm outro plano: Dean é a casca de Miguel, e Sam é a casca de Lúcifer. Os irmãos estão escritos para se matar numa luta final. Os dois se recusam a dizer sim.',mkScene({stage:11,cx:500,chars:[['dean',120,1],['sam',200,-1]],fx:['light']})),
      sc('OS CAVALEIROS','Os quatro anéis dos Cavaleiros do Apocalipse, juntos, viram a chave da Jaula. O primeiro está com a Guerra, numa cidade das montanhas do Colorado.',mkScene({stage:10,cx:600,impala:[30,138],chars:[['dean',190,1],['sam',214,1]]})),
    ]},
  {title:'A MARCA DE CAIM',season:'TEMPORADAS 9 E 10',stages:[12],
    intro:'Abaddon, a última Cavaleira do Inferno, quer o trono de Crowley. Só uma arma mata um Cavaleiro do Inferno: a Primeira Lâmina. E só quem carrega a Marca de Caim consegue usá-la.',
    scenes:[
      sc('TEMPORADA 6','Um ano depois, Sam volta da Jaula. Mas veio sem alma: caça sem medo, sem culpa, sem sentir nada. A Morte em pessoa devolve a alma dele, enquanto Castiel trava sozinho uma guerra civil no Céu.',mkScene({stage:11,cx:200,chars:[['sam',160,1]],fx:['soulless']})),
      sc('O NOVO DEUS','Para vencer a guerra, Castiel faz um acordo com Crowley e engole as almas do Purgatório. Ele se declara o novo Deus. As almas o devoram por dentro e soltam os Leviatãs.',mkScene({stage:9,cx:300,chars:[['cas',160,1]],fx:['light','glow']})),
      sc('TEMPORADA 7','Os Leviatãs, comandados por Dick Roman, querem transformar a humanidade em gado. Bobby morre com uma bala na cabeça. Dean mata Dick com um osso abençoado, e a explosão manda Dean e Castiel para o Purgatório.',mkScene({stage:13,cx:200,chars:[['dick',180,-1],['dean',120,1]],fx:['ooze']})),
      sc('TEMPORADA 8','Dean escapa do Purgatório com a ajuda de Benny, um vampiro. Kevin Tran, um profeta, traduz as tábuas da Palavra de Deus. No fim, Metatron, o escriba de Deus, expulsa todos os anjos do Céu, e Castiel cai junto.',mkScene({stage:7,cx:600,chars:[['kevin',120,1],['metatron',200,-1]],fx:['falling']})),
      sc('TEMPORADA 9','Crowley reina no inferno, mas Abaddon quer o trono. Para matá-la, Dean procura Caim, o primeiro assassino, e aceita a Marca dele no braço.',mkScene({void:'#1a0606',chars:[['deanMark',140,1],['crowley',190,-1]],fx:['mark']})),
    ]},
  {title:'A ESCURIDÃO',season:'TEMPORADA 11',stages:[13,14],
    intro:'Para tirar a Marca de Dean, Rowena usou um feitiço. Funcionou, mas a Marca era uma tranca: ela segurava a Escuridão.',
    scenes:[
      sc('TEMPORADA 10','Sam cura o irmão com sangue humano consagrado, e Dean volta a ser gente. Para tirar a Marca de vez, os irmãos pedem ajuda a Rowena, a bruxa mãe de Crowley.',mkScene({stage:12,cx:200,chars:[['dean',130,1],['sam',190,-1]],fx:['spell']})),
      sc('A ESCURIDÃO','O feitiço funciona, mas a Marca era uma tranca. Uma névoa negra se espalha pelo campo: a Escuridão está livre, e tem nome. Amara, a irmã de Deus.',mkScene({stage:13,cx:400,chars:[['amara',200,-1]],fx:['dark']})),
      sc('UM SIM','Para enfrentar Amara, Castiel diz sim a Lúcifer. O Diabo sai da Jaula usando o corpo do anjo.',mkScene({stage:13,cx:700,chars:[['lucicas',160,1]],fx:['hellfire']})),
    ]},
  {title:'O AUTOR',season:'TEMPORADA 15',stages:[15],
    intro:'Chuck abriu o inferno porque não gostou do final. Agora os mortos andam pela Terra, e os irmãos sabem a verdade: a vida deles foi escrita, como um seriado.',
    scenes:[
      sc('TEMPORADA 12','Mary volta depois de trinta e três anos e precisa reaprender o mundo e os filhos. Lúcifer gera um filho com uma humana: Jack, um nefilim, metade anjo, metade humano. Crowley morre para prender o Diabo.',mkScene({stage:7,cx:300,chars:[['mary',120,1],['dean',160,-1],['sam',190,-1]]})),
      sc('TEMPORADA 13','Jack nasce e escolhe ser bom. Ele trata Sam, Dean e Castiel como os pais que nunca teve. De uma fenda chega um mundo alternativo, arrasado por uma guerra, e um Miguel que nunca foi parado.',mkScene({stage:9,cx:400,chars:[['jack',150,1],['cas',190,-1]],fx:['glow']})),
      sc('TEMPORADA 14','Sem alma, Jack mata Mary num ataque de fúria. Chuck aparece e manda Dean matar o garoto, como num livro. Dean se recusa. Chuck mata Jack com um estalar de dedos e, irritado com o final, abre o inferno: "Fim da história."',mkScene({stage:11,cx:300,chars:[['chuck',200,-1],['dean',120,1]],fx:['hellfire']})),
      sc('TEMPORADA 15','Os mortos voltam, e os irmãos descobrem a verdade: tudo o que viveram foi escrito. Chuck escreveu a vida deles como um seriado, mundo após mundo. Jack volta do Vazio com um plano. Desta vez, os Winchester vão escrever o próprio final.',mkScene({stage:15,cx:300,chars:[['dean',110,1],['sam',136,1],['cas',200,-1],['jack',226,-1]],fx:['pages']})),
    ]},
);
progress=Math.min(progress,CHAPTERS.length-1);

/* ============ Cenas ============ */
// mkScene: monta uma cena com o cenário de uma fase, personagens e efeitos
function mkScene(o){
  return t=>{
    if(o.void){c.fillStyle=o.void;c.fillRect(0,0,SW,SH);}
    else{const L=getLayers(o.stage),cx=(o.cx||0)+t*6;
      c.drawImage(L.sky,0,0);c.drawImage(L.far,-Math.round(cx*.2),0);c.drawImage(L.mid,-Math.round(cx*.5),0);c.drawImage(L.ground,-Math.round(cx),L.G0);}
    const fx=o.fx||[];
    if(fx.includes('wings')&&Math.floor(t*3)%3!==1){c.globalAlpha=.6;c.fillStyle='#000';for(const d of[-1,1])for(let i=0;i<40;i++){const a=i/40;c.fillRect(Math.round(200+d*(8+a*110)),Math.round(70+a*30-Math.sin(a*3)*30),Math.round(6+a*6),Math.round(30-a*20));}c.globalAlpha=1;}
    if(o.impala)impala(c,o.impala[0],o.impala[1]);
    for(const ch of o.chars||[]){const [id,x,face,st]=ch;const L=LOOKS[id];npc(L,x,184,face,st||'idle',t,{});}
    fxDraw(fx,t);
    vignette();
  };
}
function fxDraw(fx,t){
  if(fx.includes('chains')){c.fillStyle='#4a3a3a';for(const x of[100,160,220])for(let y=0;y<130;y+=6)c.fillRect(x+(y/6%2?1:0),y,3,4);}
  if(fx.includes('hellfire')&&Math.random()<.9)for(let i=0;i<3;i++)cut.push({x:rand(0,SW),y:SH-8,vx:rand(-6,6),vy:rand(-50,-20),life:rand(.5,1),max:1,col:FIRE[(Math.random()*4)|0],s:2});
  if(fx.includes('grave')&&Math.random()<.5)cut.push({x:118+rand(-10,10),y:184,vx:rand(-30,30),vy:rand(-50,-20),life:.6,max:.6,col:'#4a3a22',s:2});
  if(fx.includes('sparks')&&Math.random()<.3){const x=rand(40,280);for(let i=0;i<8;i++)cut.push({x,y:60,vx:rand(-40,40),vy:rand(-10,60),life:.5,max:.5,col:'#fff4c0',s:1});}
  if(fx.includes('light')){c.globalAlpha=.15+.1*Math.sin(t*3);c.fillStyle='#fff8e0';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  if(fx.includes('glow')){c.globalAlpha=.25;c.fillStyle='#fff2b0';disc(c,160,140,40+Math.sin(t*4)*4|0,'#fff2b0');c.globalAlpha=1;}
  if(fx.includes('book')){px(c,150,150,22,14,'#e8e0c8');px(c,160,150,2,14,'#8a7a5a');for(let i=0;i<4;i++)px(c,152,153+i*3,6,1,'#5a5040');}
  if(fx.includes('clock')){disc(c,160,60,16,'#d8d0b8');disc(c,160,60,14,'#1a1820');c.fillStyle='#d8d0b8';const a=t*1.2;c.fillRect(159,47,2,13);c.fillRect(Math.round(160+Math.cos(a)*1),60,Math.round(Math.cos(a-Math.PI/2)*10)||1,2);}
  if(fx.includes('frost')&&Math.random()<.6)cut.push({x:rand(0,SW),y:rand(0,40),vx:rand(-6,6),vy:rand(15,30),life:3,max:3,col:'#e8f4ff',s:1});
  if(fx.includes('soulless')){c.globalAlpha=.25;c.fillStyle='#0a1830';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  if(fx.includes('ooze')&&Math.random()<.4)cut.push({x:180+rand(-8,8),y:150,vx:0,vy:rand(20,40),life:.6,max:.6,col:'#101014',s:2});
  if(fx.includes('falling')&&Math.random()<.3)cut.push({x:rand(0,SW),y:-4,vx:rand(-10,10),vy:rand(80,120),life:2.4,max:2.4,col:'#fff2b0',s:2});
  if(fx.includes('mark')){px(c,148,150,8,3,'#c81a10');c.globalAlpha=.2+.15*Math.sin(t*5);c.fillStyle='#c81a10';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  if(fx.includes('spell')&&Math.random()<.6)cut.push({x:160+rand(-30,30),y:170,vx:rand(-10,10),vy:rand(-40,-10),life:1,max:1,col:Math.random()<.5?'#c83a8a':'#fff4c0',s:1});
  if(fx.includes('dark')){for(let i=0;i<2;i++)cut.push({x:rand(0,SW),y:SH,vx:rand(-6,6),vy:rand(-30,-10),life:3,max:3,col:'rgba(0,0,0,.7)',s:4});}
  if(fx.includes('pages')&&Math.random()<.4)cut.push({x:rand(0,SW),y:-6,vx:rand(-12,12),vy:rand(20,40),life:6,max:6,col:'#f2eee2',s:3});
  if(fx.includes('heaven')&&Math.random()<.5)cut.push({x:rand(0,SW),y:SH,vx:rand(-4,4),vy:rand(-20,-8),life:4,max:4,col:'#ffe8a0',s:1});
  drawCut();
}

/* ============ Os dois finais ============ */
const ENDING_ACCEPT=[
  sc('O FINAL ESCRITO','Dean aceita as páginas. Ele segura Chuck enquanto Jack absorve o poder do autor, e o último golpe que Chuck guardou acerta Dean em cheio. Ele morre do jeito que viveu: protegendo o irmão.',mkScene({stage:15,cx:500,chars:[['dean',130,1,'getup'],['sam',170,-1],['jack',210,-1]],fx:['light']})),
  sc('ANOS DEPOIS','Sam segue a vida, como prometeu. Casa com Eileen e tem um filho, que recebe o nome do tio: Dean. Aos sábados, pai e filho lavam o Impala juntos.',mkScene({stage:7,cx:200,impala:[150,138],chars:[['sam',110,1],['eileen',80,1],['kidDean',132,1]]})),
  sc('UM CÉU SEM ROTEIRO','Jack, o novo Deus, não escreve a vida de ninguém. No Céu, Dean espera na ponte, com o Impala e uma cerveja gelada, o tempo que for preciso. Um dia, Sam chega.',mkScene({stage:1,cx:760,impala:[30,138],chars:[['dean',170,-1],['sam',140,1]],fx:['heaven']})),
];
const ENDING_TEAR=[
  sc('O ROTEIRO RASGADO','Dean rasga as páginas ao meio. "A gente escreve o resto." Sem roteiro, Chuck não tem mais o que prever. Jack absorve o poder dele, e ninguém precisa morrer.',mkScene({stage:15,cx:500,chars:[['dean',120,1],['sam',146,1],['chuck',210,-1,'getup'],['jack',240,-1]],fx:['pages']})),
  sc('O VAZIO','A primeira coisa que Jack faz como Deus é ir ao Vazio buscar Castiel. Cas volta, e desta vez Dean responde ao que ele disse antes de partir.',mkScene({void:'#06060a',chars:[['cas',180,-1],['dean',140,1],['jack',220,-1]],fx:['glow']})),
  sc('CHUCK','Chuck vira só um homem. Volta a ser Carver Edlund e escreve um último livro, sem poder mudar nada, só contando o que aconteceu. O título do livro é Winchester.',mkScene({stage:7,cx:900,chars:[['chuck',160,1]],fx:['book']})),
  sc('MUITOS ANOS DEPOIS','Os irmãos caçam por anos, agora por escolha. Sam se casa com Eileen e tem um filho chamado Dean. Dean fica com o Impala, a estrada e o Castiel por perto. Os dois envelhecem.',mkScene({stage:1,cx:200,impala:[40,138],chars:[['dean',170,1],['cas',196,-1],['sam',236,-1],['eileen',262,-1]]})),
  sc('O CÉU','Depois de uma vida inteira, os irmãos se reencontram na ponte. Na Roadhouse do Céu, todo mundo espera: John, Mary, Bobby, Ellen, Jo, Charlie e Kevin. A estrada continua.',mkScene({stage:1,cx:760,chars:[['john',60,1],['mary',84,1],['bobby',108,1],['ellen',196,-1],['jo',220,-1],['charlie',244,-1],['kevin',268,-1],['dean',140,1],['sam',166,-1]],fx:['heaven']})),
];
function choiceScreen(){
  mode='ending';showPad();
  show(`<div class="box"><p class="eyebrow">O ULTIMO CAPITULO</p><h2>O roteiro</h2>
    <p class="txt">Chuck está de joelhos, sem forças, mas ainda segura as últimas páginas. "Eu já escrevi o final de vocês. É bonito. É trágico. Os leitores vão chorar. É só aceitar."</p>
    <div class="row"><button class="btn" data-act="endA" type="button">ACEITAR O FINAL ESCRITO</button><button class="btn go" data-act="endB" type="button">RASGAR O ROTEIRO</button></div></div>`);
}
function creditsScreen(which){
  mode='ending';showPad();try{localStorage.setItem('winchester-final',which);}catch(e){}
  show(`<div class="box"><p class="eyebrow">WINCHESTER · FIM</p><h2>${which==='B'?'A estrada continua':'Carry on'}</h2>
    <p class="txt">${which==='B'?'Você rasgou o roteiro e deu aos irmãos o final que escolheram.':'Você aceitou o final escrito. Quer ver o que acontece quando os irmãos rasgam o roteiro?'}</p>
    <p class="fine">Fan game gratuito e não oficial, inspirado em Supernatural, de Eric Kripke. Obrigado por jogar até o fim.</p>
    <div class="row"><button class="btn go" data-act="${which==='B'?'title':'endB'}" type="button">${which==='B'?'MENU':'VER O OUTRO FINAL'}</button><button class="btn" data-act="${which==='B'?'endA':'title'}" type="button">${which==='B'?'VER O OUTRO FINAL':'MENU'}</button></div></div>`);
}
