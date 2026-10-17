'use strict';
/* ============ Combate ============ */
function strike(a,targets,reach,dmg,kd,opt){
  opt=opt||{};let hitAny=false;if(a===P&&P.berserk>0)dmg*=2;
  for(const b of targets){
    if(b===a||b.dead||b.inv>0)continue;
    if(b.st==='down'||b.st==='dead'||b.st==='dying'||b.st==='vanish'||b.st==='bout'||(b.st==='air'&&!opt.juggle))continue;
    if(opt.set&&opt.set.has(b))continue;
    const dx=(b.x-a.x)*a.face;
    if(dx<-6||dx>reach)continue;
    if(Math.abs(b.y-a.y)>(opt.depth||10))continue;
    if(Math.abs(b.z-a.z)>(opt.zr||24))continue;
    if(opt.set)opt.set.add(b);
    damage(b,dmg,kd,a.face,opt);hitAny=true;
  }
  if(hitAny){hitstop=Math.max(hitstop,kd?.09:.05);sfx(kd?'heavy':'hit');if(kd&&a.kind==='player')parts.push({ring:true,x:a.x+a.face*(reach*.6),y:a.y,z:30,r:3,vr:150,life:.16,max:.16,col:'#fff8c8'});}
  return hitAny;
}
function spark(x,y,col){for(let i=0;i<6;i++){const a=rand(0,Math.PI*2),v=rand(30,90);parts.push({x,y,z:0,vx:Math.cos(a)*v,vy:0,vz:Math.sin(a)*v,life:.22,max:.22,col:col||'#fff8c8',size:2,grav:0});}parts.push({x,y,z:0,vx:0,vy:0,vz:0,life:.08,max:.08,col:'#ffffff',size:7,grav:0});}
function damage(b,dmg,kd,dir,opt){
  if(b.kind==='prop'&&b.letter){b.lhp--;b.flash=.15;shake=Math.max(shake,3);if(b.lhp>0){sfx('hit');return;}sfx('break');b.dead=true;for(let i=0;i<14;i++)parts.push({x:b.x,y:b.y,z:rand(4,30),vx:rand(-60,60),vy:0,vz:rand(40,120),life:.7,max:.7,col:i%2?'#1a1410':'#f2eee2',size:3,grav:1});return;}
  if(b.kind==='prop'){b.dead=true;sfx('break');for(let i=0;i<10;i++)parts.push({x:b.x,y:b.y,z:8,vx:rand(-60,60),vy:0,vz:rand(40,120),life:.7,max:.7,col:i%2?'#6a6e78':'#3a3e46',size:3,grav:1});dropItem(b.drop,b.x,b.y);return;}
  if(b.kind==='player'&&heroFor(hero).demon&&opt&&opt.super)dmg=Math.round(dmg*1.4);
  if(b.kind==='player'&&isSpirit()){
    if(opt&&opt.super)dmg=Math.round(dmg*1.5);
    else{if(Math.random()<.25){floatMsg('ATRAVESSOU',b.x,b.y);for(let i=0;i<8;i++)parts.push({x:b.x+rand(-8,8),y:b.y,z:rand(10,44),vx:rand(-20,20),vy:0,vz:rand(-10,20),life:.4,max:.4,col:'#9fd8ff',size:2,grav:0});sfx('vanish');return;}
      dmg=Math.round(dmg*.5);kd=false;}
  }
  if(b.kind==='enemy'&&!(opt&&opt.body)){const m=weakMult(b,opt&&opt.tag);dmg=Math.max(1,Math.round(dmg*m));weakFeedback(b,m);
    if(hero==='john'&&!isSpirit()&&CLS[b.type]==='vamp'){if(!(b.dmbT>0))floatMsg('SANGUE DE MORTO',b.x,b.y-10);b.dmbT=5;}}
  if(b.type==='azazel'){
    if(b.st==='held'||b.st==='dying')return;
    b.ctrl-=dmg;b.flash=.12;spark(b.x+dir*-4,b.y-b.z-30,'#ffd400');score+=dmg*10;
    if(b.ctrl<=0){b.ctrl=0;b.st='held';b.stT=0;b.stunT=6.5;b.vx=0;b.pin=null;projs=projs.filter(q=>q.owner!=='e');
      b.deanSide=(b.x-cam.x>110)?1:-1;
      if(isSpirit()){P.st='hold';P.stT=0;P.inv=99;P.y=b.y+2;P.face=-b.deanSide;P.x=clamp(b.x+b.deanSide*12,cam.x+10,cam.x+SW-10);b.autoColt=1.8;
        banner={l1:'JOHN SEGURA AZAZEL!',l2:'DEAN, ATIRA COM O COLT!',t:2.8};}
      else banner={l1:'O ESPÍRITO DO JOHN',l2:'SEGURA AZAZEL! ATIRE COM O COLT',t:2.8};
      flash=.6;sfx('magic');}
    return;
  }
  if(b.isBoss&&BOSSDEF[b.type]&&BOSSDEF[b.type].shield&&BOSSDEF[b.type].shield(b)){b.flash=.06;if(Math.random()<.3)floatMsg(BOSSDEF[b.type].shieldTxt||'NÃO ADIANTA',b.x,b.y);return;}
  b.hp-=dmg;b.flash=.12;
  if(b.kind==='enemy'&&!b.isBoss){lastFoe={e:b,t:2.2};chain++;chainT=1.3;}
  spark(b.x+dir*-4,b.y-b.z-30,b.kind==='player'?'#ff6a5a':'#c8f4ff');
  if(b.kind==='player'){sfx('hurt');shake=Math.max(shake,3);}
  else score+=dmg*10;
  if(b.isBoss){
    if(b.hp<=0){b.hp=0;bossDie(b);return;}
    if(['cwind','charge','swind','bwind','lwind','lunge','throw','pinw','drop','appear','jwind','cast'].includes(b.st)){return;}
    if(kd){b.stag=(b.stag||0)+1;if(b.stag>=3){b.stag=0;knock(b,dir,1);return;}}
    b.st='hurt';b.stT=0;b.vx=dir*(kd?110:30);b.face=-dir;b.atkCd=Math.min(b.atkCd,.6);return;
  }
  if(b.hp<=0||kd){knock(b,dir,kd?1:.7);}
  else{b.st='hurt';b.stT=0;b.vx=dir*30;b.face=-dir;if(b.kind==='player'){P.run=false;}}
}
function knock(b,dir,f){b.st='air';b.stT=0;b.vx=dir*85*f;b.vz=130*f;b.z=Math.max(b.z,1);b.face=-dir;b.bounced=false;b.bodySet=null;}
function dust(x,y,n,col){for(let i=0;i<n;i++)parts.push({x:x+rand(-6,6),y:y+rand(-1,1),z:1,vx:rand(-30,30),vy:0,vz:rand(8,30),life:rand(.25,.45),max:.45,col:col||'#6a6270',size:2,grav:0});}
// corpo arremessado derruba quem estiver no caminho
function bodyHit(e){
  if(Math.abs(e.vx)<60||e.z>30)return;
  for(const o of ents){if(o===e||o.dead||o.isBoss||SKIP_ST.includes(o.st)||o.st==='held'||(e.bodySet&&e.bodySet.has(o)))continue;
    if(Math.abs(o.x-e.x)<14&&Math.abs(o.y-e.y)<8){(e.bodySet=e.bodySet||new Set()).add(o);damage(o,7,true,sgn(e.vx),{body:true});sfx('heavy');hitstop=Math.max(hitstop,.05);floatMsg('DERRUBOU!',o.x,o.y);score+=60;}}
}
function physicsAir(e,dt){
  e.x+=e.vx*dt;e.z+=e.vz*dt;e.vz-=GRAV*dt;
  if(e.z<=0){e.z=0;if(!e.bounced&&e.vz<-110){e.vz=55;e.bounced=true;e.vx*=.5;sfx('land');shake=Math.max(shake,2);dust(e.x,e.y,5);}else{e.vz=0;e.vx=0;return true;}}
  return false;
}
function dropItem(type,x,y){if(!type)return;items.push({type,x,y,z:14,vz:80,t:0});}

/* ============ Jogador ============ */
function updPlayer(dt,inp){
  const p=P,H=heroFor(hero);p.t+=dt;p.stT+=dt;if(p.inv>0)p.inv-=dt;if(p.flash>0)p.flash-=dt;if(p.shootCd>0)p.shootCd-=dt;if(p.comboT>0)p.comboT-=dt;else p.combo=0;
  if(p.berserk>0){p.berserk-=dt;if(p.hp>1)p.hp=Math.max(1,p.hp-2.2*dt);if(Math.random()<dt*20)parts.push({x:p.x+rand(-8,8),y:p.y,z:rand(4,44),vx:0,vy:0,vz:rand(20,50),life:.4,max:.4,col:Math.random()<.5?'#c81a10':'#5a0808',size:2,grav:0});}
  const B=p.buf;for(const k in B){if(inp[k])B[k]=.15;else if(B[k]>0)B[k]-=dt;}
  if(p.st==='run'&&Math.random()<dt*9)dust(p.x-p.face*4,p.y,1);
  p.hist.unshift({x:p.x,y:p.y-p.z});if(p.hist.length>8)p.hist.pop();
  const free=['idle','walk','run'].includes(p.st);
  if(free&&B.atk>0&&B.jump>0){B.atk=B.jump=0;startEsc();}
  else if(free){
    const mvx=inp.x,mvy=inp.y;
    if(mvx)p.face=sgn(mvx);
    if(inp.run&&mvx)p.run=true;if(!mvx||sgn(mvx)!==p.face)p.run=false;
    const sp=(p.run?H.spd*2:H.spd)*(p.berserk>0?1.3:1);
    p.x+=mvx*sp*dt;p.y+=mvy*H.spd*.66*dt;
    if(mvx||mvy){p.st=p.run?'run':'walk';p.ph+=dt*(p.run?14:9);}else p.st='idle';
    if(B.jump>0){B.jump=0;p.st='jump';p.stT=0;p.vz=170;p.vx=mvx*(p.run?H.spd*1.9:H.spd*1.1);p.jatk=false;p.z=.1;p.set=new Set();sfx('jump');}
    else if(B.atk>0){B.atk=0;
      if(p.run){p.st='runatk';p.stT=0;p.vx=p.face*160;p.set=new Set();sfx('swing');}
      else{const step=p.comboT>0&&p.lastHit?Math.min(2,p.combo):0;if(step===0&&!mvx)autoFace(p,H.reach[0]);startAtk(step);}
    }
    else if(B.shoot>0&&(coltReady()||p.shootCd<=0)){B.shoot=0;p.st='shoot';p.stT=0;p.shot=0;p.colt=coltReady();if(!p.colt)p.shootCd=H.shootCd;}
    else if(B.magic>0&&(p.magic>0||H.free)&&!(H.mgCost&&p.hp<=H.mgCost)){B.magic=0;p.st='magic';p.stT=0;p.inv=1.4;p.mlvl=p.magic||2;p.magic=0;if(H.mgCost){p.hp-=H.mgCost;floatMsg('-'+H.mgCost,p.x,p.y);}p.mDone=false;p.face0=p.face;p.spinT=0;sfx('magic');dimT=['psy','smite','blood','neph'].includes(H.mg)?1.3:.5;
      banner={l1:H.magicName,l2:p.mlvl>=4?'NÍVEL MÁXIMO':'NÍVEL '+p.mlvl,t:1.3,small:true};if(p.mlvl>=4){shake=Math.max(shake,6);flash=Math.max(flash,.3);}}
  }
  switch(p.st){
    case 'atk':{
      if(!p.didHit&&p.stT>=p.hitAt){p.didHit=true;sfx('swing');p.lastHit=strike(p,ents.concat(props),H.reach[p.step],H.dmg[p.step],p.step===2,{tag:H.tag});if(p.lastHit){p.combo=p.step+1;p.comboT=.5;}}
      if(inp.atk&&p.stT>p.hitAt*.6){p.queued=true;if(p.step<2)B.atk=0;}
      if(p.stT>=p.dur){if(p.queued&&p.lastHit&&p.step<2){B.atk=0;startAtk(p.step+1);}else{p.st='idle';if(p.step===2)p.combo=0;}}
      break;}
    case 'jump':{
      if(inp.atk&&!p.jatk&&p.stT<.08){B.atk=B.jump=0;p.z=0;startEsc();break;}
      if(inp.x)p.vx=clamp(p.vx+inp.x*H.spd*3*dt,-H.spd*1.9,H.spd*1.9);
      p.y+=inp.y*H.spd*.35*dt;
      p.x+=p.vx*dt;p.z+=p.vz*dt;p.vz-=GRAV*dt;
      if(inp.atk&&!p.jatk){p.jatk=true;B.atk=0;sfx('swing');}
      if(p.jatk)strike(p,ents.concat(props),24,12,true,{set:p.set,zr:34,tag:H.tag});
      if(p.z<=0){p.z=0;p.st='idle';p.jatk=false;sfx('land');dust(p.x,p.y,4);}
      break;}
    case 'runatk':{p.x+=p.vx*dt;p.vx*=Math.pow(.02,dt);if(p.stT>.05&&p.stT<.32)strike(p,ents.concat(props),20,14,true,{set:p.set,tag:H.tag});if(p.stT>.45){p.st='idle';p.run=false;}break;}
    case 'shoot':{
      if(p.colt){if(p.stT>=.15&&!p.shot){p.shot=1;projs.push({kind:'colt',x:p.x+p.face*18,y:p.y,z:28,vx:p.face*520,life:1,owner:'p'});sfx('colt');flash=.35;shake=6;}
        if(p.stT>.6){p.st='idle';p.colt=false;}break;}
      if(H.shot==='shotgun'){if(p.stT>=.14&&!p.shot){p.shot=1;sfx('shotgun');shake=Math.max(shake,4);flash=.12;
          for(let i=0;i<14;i++)parts.push({x:p.x+p.face*18,y:p.y,z:28,vx:p.face*rand(160,280),vy:rand(-25,25),vz:rand(-30,30),life:.35,max:.35,col:'#f4f1e8',size:2,grav:0});
          const set=new Set();strike(p,ents,130,16,true,{set,depth:16,zr:40,tag:'salt'});}}
      else if(H.shot==='pistol'){for(const tt of[.12,.24,.36])if(p.stT>=tt&&p.shot<tt){p.shot=tt;sfx('pistol');projs.push({kind:'bullet',x:p.x+p.face*16,y:p.y,z:28,vx:p.face*320,life:.9,dmg:9,kd:tt>.3,owner:'p',tag:'iron'});parts.push({x:p.x+p.face*18,y:p.y,z:28,vx:0,vy:0,vz:0,life:.06,max:.06,col:'#ffe08a',size:5,grav:0});}}
      else if(H.shot==='tk'){if(p.stT>=.14&&!p.shot){p.shot=1;sfx('vanish');projs.push({kind:'tk',x:p.x+p.face*16,y:p.y,z:30,vx:p.face*300,life:.9,dmg:13,kd:true,owner:'p',tag:'psychic'});}}
      else if(H.shot==='rifle'){if(p.stT>=.16&&!p.shot){p.shot=1;sfx('rifle');shake=Math.max(shake,3);projs.push({kind:'rifle',x:p.x+p.face*20,y:p.y,z:28,vx:p.face*460,life:.8,dmg:16,kd:true,owner:'p',pierce:true,set:new Set(),tag:'iron'});parts.push({x:p.x+p.face*22,y:p.y,z:28,vx:0,vy:0,vz:0,life:.07,max:.07,col:'#ffe08a',size:6,grav:0});}}
      else if(H.shot==='flask'){if(p.stT>=.18&&!p.shot){p.shot=1;sfx('swing');projs.push({kind:'flask',x:p.x+p.face*10,y:p.y,z:32,vx:p.face*150,vz:110,life:2,dmg:15,owner:'p',tag:'holy'});}}
      else if(H.shot==='blink'){if(p.stT>=.05&&!p.shot){p.shot=1;castielBlink();}}
      else if(SHOTS[H.shot])SHOTS[H.shot](p,H);
      if(p.stT>(H.shot==='blink'?.4:.55))p.st='idle';break;}
    case 'magic':{
      if(MAGICS[H.mg]){if(MAGICS[H.mg](p,H,dt)){p.st='idle';p.mDone=false;}break;}
      if(H.mg==='salt'){
        const dmg=12+12*p.mlvl;
        if(p.stT<.5)for(let i=0;i<2;i++)parts.push({x:p.x+p.face*rand(8,12),y:p.y+rand(-1,1),z:rand(8,12),vx:p.face*rand(5,25),vy:rand(-8,8),vz:rand(-20,0),life:.5,max:.5,col:'#f4f2ec',size:1,grav:1});
        if(p.stT>=.5&&!p.ring){p.ring={x:p.x,y:p.y,r:6,max:120+28*p.mlvl,life:2.4,set:new Set()};saltRings.push(p.ring);flash=.25;shake=4;sfx('salt');}
        const w=p.ring;
        if(w&&w.r<w.max){w.r=Math.min(w.max,w.r+300*dt);
          for(const e of ents){if(e.dead||w.set.has(e)||['dead','dying','vanish','bout','appear'].includes(e.st))continue;
            if(Math.hypot(e.x-w.x,(e.y-w.y)*3)<=w.r){w.set.add(e);damage(e,dmg,e.isBoss?p.mlvl>=3:true,sgn(e.x-w.x),{});
              for(let i=0;i<10;i++)parts.push({x:e.x,y:e.y,z:rand(0,30),vx:rand(-40,40),vy:0,vz:rand(20,90),life:.5,max:.5,col:i%2?'#ffffff':'#9fe8ff',size:2,grav:0});}}}
        if(p.stT>1.1){p.st='idle';p.ring=null;}
        break;}
      if(H.mg==='spin'){
        if(!p.tor){p.tor=1;addFx({k:'tornado',follow:true,dur:1.05,col:'#c8d0d8'});}
        p.spinT-=dt;
        if(p.stT>.1&&p.stT<1.05){p.face=Math.floor(p.stT/.07)%2?-p.face0:p.face0;
          if(p.spinT<=0){p.spinT=.14;sfx('swing');const last=p.stT>.9;
            for(const e of ents){if(e.dead||SKIP_ST.includes(e.st))continue;if(Math.abs(e.x-p.x)<38&&Math.abs(e.y-p.y)<12)damage(e,5+3*p.mlvl,last,sgn(e.x-p.x),{tag:'machete'});}
            for(const pr of props)if(!pr.dead&&Math.abs(pr.x-p.x)<38&&Math.abs(pr.y-p.y)<12)damage(pr,1,false,1,{});}}
        if(p.stT>1.1){p.st='idle';p.face=p.face0;p.tor=0;}
        break;}
      if(H.mg==='trap'){
        if(p.stT<.5&&Math.random()<.6)parts.push({x:p.x+p.face*12,y:p.y+rand(-2,2),z:rand(2,8),vx:p.face*rand(10,30),vy:0,vz:rand(-10,10),life:.4,max:.4,col:'#c83020',size:1,grav:1});
        if(p.stT>=.5&&!p.mDone){p.mDone=true;const life=4+1.3*p.mlvl;traps.push({x:clamp(p.x+p.face*40,cam.x+20,cam.x+SW-20),y:p.y,r:44+6*p.mlvl,life,max:life});sfx('salt');flash=.2;}
        if(p.stT>.9){p.st='idle';p.mDone=false;}
        break;}
      if(p.stT>=.6&&!p.mDone){p.mDone=true;flash=.6;shake=8;
        const dmg=Math.round((12+12*p.mlvl)*(H.magicMult||1)),tag=H.mg==='smite'?'smite':'psychic';
        if(H.mg==='smite')flash=1;
        for(const e of ents){if(e.dead||e.x<cam.x-10||e.x>cam.x+SW+10)continue;if(['dead','dying','vanish','bout'].includes(e.st))continue;damage(e,dmg,e.isBoss?p.mlvl>=3:true,sgn(e.x-p.x),{tag});
          if(H.mg==='smite')addFx({k:'pillar',x:e.x,y:e.y,dur:.7,col:'#fff2b0',w:18});else if(H.mg==='polt')addFx({k:'tornado',x:e.x,y:e.y,dur:.6,col:'#9fd8ff'});else addFx({k:'bolt',x:e.x,y:e.y,dur:.3,col:'#a070ff'});}
        if(isSpirit())for(let i=0;i<30;i++)parts.push({x:cam.x+rand(0,SW),y:rand(LT,LB),z:rand(0,60),vx:rand(-40,40),vy:0,vz:rand(-20,40),life:.6,max:.6,col:i%2?'#9fd8ff':'#e0f4ff',size:2,grav:0});
        if(H.mg==='smite'){P.hp=Math.min(P.maxHp,P.hp+12);floatMsg('+12',p.x,p.y);for(let i=0;i<40;i++)parts.push({x:cam.x+rand(0,SW),y:rand(LT,LB),z:rand(0,80),vx:0,vy:0,vz:rand(60,140),life:.7,max:.7,col:i%2?'#ffffff':'#fff2b0',size:2,grav:0});}
        if(H.mg==='psy'||H.mg==='blood')for(let i=0;i<3;i++)parts.push({ring:true,x:p.x,y:p.y,z:26,r:6+i*10,vr:220,life:.6,max:.6,col:'#c8a0ff'});
      }
      if(p.stT>1.2){p.st='idle';p.mDone=false;}break;}
    case 'hurt':{p.x+=p.vx*dt;p.vx*=Math.pow(.01,dt);if(p.stT>.3)p.st='idle';break;}
    case 'air':{if(physicsAir(p,dt)){p.st='down';p.stT=0;}break;}
    case 'down':{if(p.stT>.75){if(p.hp<=0){loseLife();}else{p.st='getup';p.stT=0;p.inv=.8;}}break;}
    case 'getup':{if(p.stT>.3)p.st='idle';break;}
    case 'hold':{if(!boss||boss.st!=='held'){p.st='idle';p.inv=1;}break;}
    case 'esc':{p.face=Math.floor(p.stT/.06)%2?-p.face0:p.face0;
      if(p.stT>=.1&&!p.mDone){p.mDone=true;sfx('heavy');shake=Math.max(shake,4);
        parts.push({ring:true,x:p.x,y:p.y,z:24,r:6,vr:200,life:.25,max:.25,col:isSpirit()?'#9fd8ff':'#f2b632'});dust(p.x,p.y,8);
        for(const e of ents){if(e.dead||SKIP_ST.includes(e.st)||e.st==='held')continue;if(Math.abs(e.x-p.x)<36&&Math.abs(e.y-p.y)<12&&Math.abs(e.z-p.z)<30)damage(e,10,true,sgn(e.x-p.x)||p.face0,{tag:H.tag});}
        for(const pr of props)if(!pr.dead&&Math.abs(pr.x-p.x)<36&&Math.abs(pr.y-p.y)<12)damage(pr,1,false,1,{});}
      if(p.stT>.42){p.st='idle';p.face=p.face0;p.mDone=false;}break;}
  }
  p.y=clamp(p.y,LT,LB);p.x=clamp(p.x,cam.x+10,cam.x+SW-10);
  p.x=clamp(p.x,10,STAGE_W-10);
}
function startEsc(){const p=P;p.st='esc';p.stT=0;p.inv=Math.max(p.inv,.45);p.face0=p.face;p.mDone=false;p.run=false;p.vx=0;
  if(p.hp>8){p.hp-=5;floatMsg('-5',p.x,p.y);}sfx('swing');}
function autoFace(p,reach){let f=0,b=0;for(const e of ents){if(e.dead||SKIP_ST.includes(e.st)||Math.abs(e.y-p.y)>10)continue;const dx=(e.x-p.x)*p.face;if(dx>-6&&dx<=reach+4)f++;else if(dx<=-6&&dx>=-reach-4)b++;}if(!f&&b)p.face=-p.face;}
function startAtk(step){const p=P;p.st='atk';p.stT=0;p.step=step;p.dur=[.24,.26,.36][step];p.hitAt=[.08,.1,.14][step];p.didHit=false;p.queued=false;p.lastHit=false;}
function loseLife(){
  const p=P;
  if(p.lives>0){p.lives--;p.hp=p.maxHp;p.st='getup';p.stT=0;p.inv=2.5;flash=.4;banner={l1:'DE PÉ!',l2:`VIDAS: ${p.lives}`,t:1.4,small:true};}
  else{mode='continue';contT=9.99;stopSong();showPad();}
}
let contT=0;
function doContinue(){if(mode!=='continue')return;const p=P;p.lives=2;p.hp=p.maxHp;p.st='getup';p.stT=0;p.inv=2.5;p.magic=Math.max(p.magic,1);mode='play';showPad();playSong(boss?'boss':'stage');score=0;}

/* ============ Inimigos ============ */
const VAMPS=[
  {skin:'#d8cfcc',hair:'#1a1210',style:'long',jacket:'#1e1a1c',jacketD:'#121012',shirt:'#5a1414',pants:'#1c1c22',pantsD:'#121216',boots:'#0c0a0a',eye:'#ff2020',fangs:true},
  {skin:'#d0c8c6',hair:'#3a1c10',style:'short',jacket:'#3a1612',jacketD:'#24100c',shirt:'#2a2a2a',pants:'#22222a',pantsD:'#16161c',boots:'#100c0a',eye:'#ff2020',fangs:true,tall:2},
  {skin:'#dcd4d0',hair:'#0e0c0c',style:'woman',jacket:'#2a1a22',jacketD:'#1a1016',shirt:'#6a1a2a',pants:'#1a161c',pantsD:'#100e12',boots:'#0a0808',eye:'#ff2020',fangs:true,tall:1},
];
const DEMONS=[
  {skin:'#e0b48e',hair:'#2a2018',style:'short',jacket:'#3a4a5a',jacketD:'#28343e',shirt:'#c8c0b0',pants:'#2a2e36',pantsD:'#1c2026',boots:'#141414',eye:'#000'},
  {skin:'#c9946a',hair:'#1a1410',style:'long',jacket:'#5a2a2a',jacketD:'#3a1a1a',shirt:'#2a2a2a',pants:'#2a2a30',pantsD:'#1c1c20',boots:'#121212',eye:'#000',tall:1},
  {skin:'#d8aa86',hair:'#8a6a3a',style:'short',jacket:'#4a4a3a',jacketD:'#323226',shirt:'#7a7a70',plaid:'#3a3a2c',pants:'#3a3028',pantsD:'#28201a',boots:'#1a1410',eye:'#000',tall:2},
  {skin:'#b07a56',hair:'#141010',style:'messy',jacket:'#2a3a2a',jacketD:'#1c281c',shirt:'#a09070',pants:'#202428',pantsD:'#14181c',boots:'#0e0e0e',eye:'#000'},
];
const SKIP_ST=['down','air','dead','dying','vanish','bout','appear','drop'];
function spawnEnemy(type,x,y){
  const e=newEnt('enemy',x,y);e.type=type;e.ai=type;noteCreature(type);e.offY=rand(-22,22);e.face=x<P.x?1:-1;e.throwCd=rand(2,4);
  const DF=ENEMYDEF[type];
  if(DF){e.ai=DF.ai;e.hp=e.maxHp=DF.hp;e.look=typeof DF.look==='function'?DF.look():DF.look;e.spd=rand(DF.spd[0],DF.spd[1]);e.dmg=DF.dmg;e.outline=DF.outline;for(const k of['ghost','demon','hound','human','angel','dark','noThrow'])if(DF[k])e[k]=true;}
  else if(type==='ac'){e.ai='v';e.demon=true;e.hp=e.maxHp=30;e.look=ACHERI;e.spd=rand(42,48);e.dmg=8;e.outline='#0c0610';}
  else if(type==='ava'){e.hp=e.maxHp=120;e.look=LOOKS.ava;e.spd=30;e.dmg=8;e.atkCd=1.2;banner={l1:'AVA',l2:'ELA CONTROLA OS DEMÔNIOS',t:2.4};}
  else if(type==='v'){e.hp=e.maxHp=40;e.look=GHOSTS[(Math.random()*GHOSTS.length)|0];e.spd=rand(30,38);e.ghost=true;e.dmg=8;}
  else if(type==='g'){e.hp=e.maxHp=30;e.look=SCREAMER;e.spd=26;e.ghost=true;}
  else if(type==='vp'){e.hp=e.maxHp=46;e.look=VAMPS[(Math.random()*VAMPS.length)|0];e.spd=rand(40,48);e.dmg=10;e.outline='#1a0404';}
  else{e.demon=true;e.hp=e.maxHp=42;e.look=DEMONS[(Math.random()*DEMONS.length)|0];e.spd=rand(32,38);e.dmg=9;e.outline='#0c0610';}
  if(type==='vp'){e.st='drop';e.z=70;e.vz=0;e.alpha=1;sfx('hiss');}
  else{e.st='appear';e.stT=0;e.alpha=0;sfx(e.demon?'smoke':e.angel?'wings':'vanish');
    if(e.angel)for(let i=0;i<12;i++)parts.push({x:e.x+rand(-8,8),y:e.y,z:rand(0,50),vx:rand(-20,20),vy:0,vz:rand(-10,30),life:.6,max:.6,col:i%2?'#ffffff':'#fff2b0',size:2,grav:0});
    if(DF&&DF.walkIn){e.st='idle';e.alpha=1;}
    else if(e.demon)for(let i=0;i<14;i++)parts.push({x:e.x+rand(-8,8),y:e.y,z:rand(0,40),vx:rand(-15,15),vy:0,vz:rand(-10,20),life:.7,max:.7,col:'#0c080e',size:3,grav:0});}
  ents.push(e);return e;
}
function spawnBoss(){
  const k=CHAPTERS[chapter].boss;let e;noteCreature(k);
  if(BOSSDEF[k]){spawnBossDef(k);return;}
  if(k==='woman'){
    e=newEnt('enemy',cam.x+SW-50,180);e.type='woman';e.isBoss=true;e.ghost=true;e.hp=e.maxHp=360;e.look=LOOKS.woman;e.spd=30;e.face=-1;e.st='appear';e.alpha=0;e.atkCd=1.6;e.sum1=false;e.sum2=false;e.name='MULHER DE BRANCO';
    banner={l1:'A MULHER',l2:'DE BRANCO',t:2.6};sfx('scream');
  }else{
    e=newEnt('enemy',cam.x+SW-60,182);e.type=k;e.isBoss=true;e.face=-1;e.atkCd=1.5;e.sum1=false;e.sum2=false;
    if(k==='luther'){e.hp=e.maxHp=420;e.look=LOOKS.luther;e.spd=40;e.outline='#1a0404';e.name='LUTHER';e.st='drop';e.z=90;e.vz=0;banner={l1:'LUTHER',l2:'O LÍDER DO NINHO',t:2.6};sfx('hiss');}
    else if(k==='jake'){e.hp=e.maxHp=460;e.look=LOOKS.jake;e.spd=38;e.name='JAKE';e.st='idle';banner={l1:'JAKE',l2:'O SOLDADO COM FORÇA DE DEMÔNIO',t:2.6};sfx('heavy');}
    else if(k==='meg'){e.hp=e.maxHp=440;e.look=LOOKS.meg;e.spd=36;e.outline='#0c0610';e.name='MEG';e.st='appear';e.alpha=0;banner={l1:'MEG',l2:'SERVA DO OLHO AMARELO',t:2.6};sfx('smoke');}
    else{e.hp=e.maxHp=1;e.ctrl=e.ctrlMax=480;e.look=LOOKS.azazel;e.spd=30;e.outline='#1a1200';e.name='AZAZEL';e.st='appear';e.alpha=0;banner={l1:'AZAZEL',l2:'O DEMÔNIO DE OLHOS AMARELOS',t:2.8};sfx('boss');}
  }
  ents.push(e);boss=e;playSong('boss');shake=6;
}
function updBoss(e,dt){return e.type==='woman'?updWoman(e,dt):updBossX(e,dt);}
function bossSummon(e){
  const D=BOSSDEF[e.type];if(D&&D.summon){banner={l1:D.sumTxt||'REFORÇOS',l2:'',t:1.6,small:true};const s=D.summon;spawnEnemy(s[0],cam.x+20,rand(LT,LB));spawnEnemy(s[1]||s[0],cam.x+SW-20,rand(LT,LB));return;}
  const t=e.type==='luther'?'vp':'dm';
  banner={l1:e.type==='luther'?'O NINHO ACORDOU':'REFORÇOS DO INFERNO',l2:'',t:1.6,small:true};
  spawnEnemy(t,cam.x+20,rand(LT,LB));spawnEnemy(t,cam.x+SW-20,rand(LT,LB));
}
function smokePuff(e,col){parts.push({x:e.x+rand(-10,10),y:e.y,z:rand(0,46),vx:0,vy:0,vz:rand(10,30),life:.6,max:.6,col:col||'#0c080e',size:3,grav:0});}
function updBossX(e,dt){
  e.t+=dt;e.stT+=dt;if(e.flash>0)e.flash-=dt;e.atkCd-=dt;
  const p=P,side=e.x<p.x?-1:1,sp=e.spd*(e.slowF||1)*(e.rage?1.3:1),smoky=BOSSDEF[e.type]?!!BOSSDEF[e.type].smoky:e.type!=='luther'&&e.type!=='jake';
  const BD=BOSSDEF[e.type];
  if(BD){if(BD.rage&&!e.rage&&e.hp<e.maxHp*.5){e.rage=true;banner={l1:BD.rage,l2:'',t:1.6,small:true};sfx('heavy');shake=6;}
    if(BD.summon){if(!e.sum1&&e.hp<e.maxHp*.66){e.sum1=true;bossSummon(e);}if(!e.sum2&&e.hp<e.maxHp*.33){e.sum2=true;bossSummon(e);}}
    if(BD.tick&&BD.tick(e,dt))return;}
  else if(e.type==='jake'){if(!e.rage&&e.hp<e.maxHp*.5){e.rage=true;banner={l1:'JAKE NÃO DESISTE',l2:'',t:1.6,small:true};sfx('heavy');shake=6;}}
  else if(e.type!=='azazel'){if(!e.sum1&&e.hp<e.maxHp*.66){e.sum1=true;bossSummon(e);}if(!e.sum2&&e.hp<e.maxHp*.33){e.sum2=true;bossSummon(e);}}
  if(e.trapped&&['idle','walk','recover'].includes(e.st)){e.st='idle';e.hp=Math.max(1,e.hp-8*dt);e.flash=Math.max(e.flash,.03);return;}
  switch(e.st){
    case 'appear':e.alpha=Math.min(1,e.stT/.6);if(Math.random()<.5)smokePuff(e,e.type==='azazel'?'#3a2a00':'#0c080e');if(e.stT>.6){e.st='idle';e.alpha=1;}return;
    case 'drop':e.z+=e.vz*dt;e.vz-=GRAV*dt;if(e.z<=0){e.z=0;e.vz=0;e.st='idle';sfx('heavy');shake=6;}return;
    case 'dying':{e.vx=0;if(BD&&BD.die){BD.die(e,dt);return;}if(e.type==='jake'){if(Math.random()<.3)dust(e.x,e.y,1);if(e.stT>2.2&&!endT)endT=1.5;return;}const col=e.type==='luther'?(Math.random()<.5?'#8a1010':'#4a4a4a'):e.type==='azazel'?(Math.random()<.4?'#ffd400':'#0c080e'):'#0c080e';
      if(Math.random()<.8)parts.push({x:e.x+rand(-10,10),y:e.y,z:rand(0,40),vx:rand(-10,10),vy:0,vz:rand(30,80),life:.9,max:.9,col,size:3,grav:0});
      e.alpha=Math.max(.15,1-e.stT/2.6);if(e.stT>2.6&&!endT){endT=1.5;}return;}
    case 'air':if(physicsAir(e,dt)){e.st='down';e.stT=0;}return;
    case 'down':if(e.stT>.9){e.st='getup';e.stT=0;}return;
    case 'getup':if(e.stT>.35){e.st=smoky?'bout':'idle';e.stT=0;if(smoky)sfx('smoke');}return;
    case 'hurt':e.x+=e.vx*dt;e.vx*=Math.pow(.01,dt);if(e.stT>.2){e.st='idle';e.stT=0;if(smoky&&Math.random()<.25){e.st='bout';sfx('smoke');}}return;
    case 'held':e.stunT-=dt;
      if(isSpirit()&&e.autoColt>0){e.autoColt-=dt;if(e.autoColt<=0){const sd=e.deanSide||1;projs.push({kind:'colt',x:e.x-sd*78,y:e.y,z:28,vx:sd*520,life:1,owner:'p'});sfx('colt');flash=.35;shake=6;}}if(Math.random()<.4)parts.push({x:e.x+rand(-14,14),y:e.y,z:rand(0,50),vx:0,vy:0,vz:rand(10,30),life:.5,max:.5,col:'#9fd8ff',size:2,grav:0});
      if(e.stunT<=0){e.ctrl=Math.round(e.ctrlMax*.6);e.st='idle';e.atkCd=1;banner={l1:'AZAZEL SE SOLTOU!',l2:'',t:1.6,small:true};sfx('scream');bossSummon(e);}return;
    case 'lwind':e.face=-side;e.y+=clamp(p.y-e.y,-1,1)*30*dt;if(e.stT>.45){e.st='lunge';e.stT=0;e.set=new Set();sfx('hiss');}return;
    case 'lunge':e.x+=e.face*235*dt;strike(e,[P],22,14,true,{set:e.set,zr:30});
      if(Math.random()<.5)parts.push({x:e.x-e.face*8,y:e.y,z:rand(6,40),vx:0,vy:0,vz:0,life:.25,max:.25,col:e.type==='jake'?'#6a5a48':'#5a1010',size:3,grav:0});
      if(e.stT>.38||e.x<cam.x+14||e.x>cam.x+SW-14){e.x=clamp(e.x,cam.x+14,cam.x+SW-14);if(e.chain){e.chain=false;e.st='lwind';e.stT=.2;}else{e.st='recover';e.stT=0;}}return;
    case 'throw':e.face=-side;
      if(e.stT>.5&&!e.fired){e.fired=true;
        if(e.type==='azazel'){sfx('fire');for(const dy of[-16,0,16])projs.push({kind:'yfire',x:e.x+e.face*12,y:clamp(e.y+dy,LT,LB),z:28,vx:e.face*135,life:2.6,dmg:11,owner:'e'});}
        else if(BD&&BD.fire){BD.fire(e,p);}
        else if(e.type==='jake'){sfx('heavy');for(const dy of[-8,8])projs.push({kind:'rock',x:e.x+e.face*12,y:clamp(p.y+dy,LT,LB),z:30,vx:e.face*170,life:2.4,dmg:11,owner:'e'});}
        else{sfx('smoke');for(const dy of[-14,0,14])projs.push({kind:'smoke',x:e.x+e.face*12,y:clamp(e.y+dy,LT,LB),z:26,vx:e.face*130,life:2.6,dmg:10,owner:'e'});}}
      if(e.stT>.9){e.st='recover';e.stT=0;e.fired=false;}return;
    case 'jwind':e.face=-side;if(e.stT>.65&&!e.fired){e.fired=true;sfx('heavy');shake=8;dust(e.x,e.y,10);
        for(const d of[-1,1])projs.push({kind:'shock',big:true,x:e.x+d*14,y:e.y,z:0,vx:d*150,life:2.2,dmg:12,owner:'e'});}
      if(e.stT>1){e.st='recover';e.stT=0;e.fired=false;}return;
    case 'cast':e.face=-side;if(e.stT>.6&&!e.fired){e.fired=true;if(BD&&BD.cast)BD.cast(e,p);}
      if(e.stT>1){e.st='recover';e.stT=0;e.fired=false;}return;
    case 'pinw':e.face=-side;
      if(e.stT>.9){const pn=e.pin;
        if(pn&&p.inv<=0&&!['down','air'].includes(p.st)&&Math.abs(p.x-pn.x)<24&&Math.abs(p.y-pn.y)<10&&p.z<10){damage(p,13,true,sgn(p.x-e.x),{super:true});sfx('heavy');shake=6;}
        if(pn)pinFx(e,pn);e.pin=null;e.st='recover';e.stT=0;}return;
    case 'bout':e.alpha=Math.max(0,1-e.stT/.3);if(Math.random()<.6)smokePuff(e);
      if(e.stT>.3){e.x=clamp(p.x-p.face*38,cam.x+14,cam.x+SW-14);e.y=p.y;e.face=e.x<p.x?1:-1;e.st='bin';e.stT=0;}return;
    case 'bin':e.alpha=Math.min(1,e.stT/.2);if(e.stT>.2){e.alpha=1;e.st='bwind';e.stT=0;}return;
    case 'bwind':e.face=e.x<p.x?1:-1;if(e.stT>.3){e.st='bstrike';e.stT=0;e.set=new Set();sfx('swing');}return;
    case 'bstrike':if(e.stT<.12)strike(e,[P],28,12,true,{set:e.set});if(e.stT>.2){e.st='recover';e.stT=0;}return;
    case 'recover':if(e.stT>.55){e.st='idle';e.atkCd=rand(1.1,1.9);}return;
  }
  const dist=BD&&BD.dist?BD.dist:e.type==='luther'?70:90;
  const tx=clamp(p.x+side*dist,cam.x+20,cam.x+SW-20),ty=p.y,dx=tx-e.x,dy=ty-e.y;
  if(Math.abs(dx)>3||Math.abs(dy)>2){e.x+=Math.sign(dx)*Math.min(Math.abs(dx),sp*dt);e.y+=Math.sign(dy)*Math.min(Math.abs(dy),sp*.6*dt);e.st='walk';e.ph+=dt*8;}
  else e.st='idle';
  e.face=p.x>e.x?1:-1;e.y=clamp(e.y,LT,LB);
  if(e.atkCd>0||['down','air'].includes(p.st))return;
  const r=Math.random(),near=Math.abs(p.x-e.x)<40&&Math.abs(p.y-e.y)<8;
  if(BD){e.st=BD.pick(e,near,r,p);if(e.st==='pinw')e.pin={x:p.x,y:p.y};}
  else if(e.type==='luther'){e.st=near?'bwind':'lwind';e.chain=Math.random()<.5;}
  else if(e.type==='meg'){e.st=near?'bwind':(r<.55?'throw':'bout');}
  else if(e.type==='jake'){e.st=near&&r<.6?'bwind':r<.4?'lwind':r<.75?'jwind':'throw';e.chain=e.rage&&e.st==='lwind'&&Math.random()<.5;}
  else{e.st=r<.35?'pinw':r<.7?'throw':'bout';if(e.st==='pinw'){e.pin={x:p.x,y:p.y};sfx('magic');}}
  e.stT=0;e.fired=false;if(e.st==='bout')sfx('smoke');
}
function coltReady(){return !!(boss&&boss.type==='azazel'&&boss.st==='held'&&!isSpirit());}
function coltKill(e){e.hp=0;bossDie(e);flash=1;shake=14;banner={l1:'O COLT NÃO ERRA',l2:'',t:2.4,small:true};sfx('colt');
  for(let i=0;i<30;i++)parts.push({x:e.x,y:e.y,z:44,vx:rand(-80,80),vy:0,vz:rand(-20,90),life:.9,max:.9,col:i%2?'#ffd400':'#ffffff',size:2,grav:0});}
function castielBlink(){
  const p=P;let best=null,bd=1e9;
  for(const e of ents){if(e.dead||SKIP_ST.includes(e.st)||e.st==='held')continue;const dx=(e.x-p.x)*p.face;if(dx<0||dx>170||Math.abs(e.y-p.y)>30)continue;if(dx<bd){bd=dx;best=e;}}
  const fx=()=>{for(let i=0;i<10;i++)parts.push({x:p.x+rand(-8,8),y:p.y,z:rand(10,44),vx:rand(-30,30),vy:0,vz:rand(-20,30),life:.5,max:.5,col:i%3?'#f4f4f4':'#1a1a1a',size:2,grav:0});};
  fx();sfx('wings');
  if(best){p.x=clamp(best.x+p.face*16,cam.x+10,cam.x+SW-10);p.y=best.y;p.face=-p.face;fx();damage(best,18,true,p.face,{tag:'blade'});hitstop=.08;flash=.15;}
  else{p.x=clamp(p.x+p.face*70,cam.x+10,cam.x+SW-10);fx();}
  p.inv=Math.max(p.inv,.35);
}
function explodeFlask(q){
  sfx('glass');
  for(let i=0;i<16;i++)parts.push({x:q.x,y:q.y,z:Math.max(4,q.z),vx:rand(-70,70),vy:rand(-10,10),vz:rand(30,110),life:.5,max:.5,col:i%2?'#bfe0ff':'#7ab8f0',size:2,grav:1});
  for(const e of ents){
    if(e.dead||SKIP_ST.includes(e.st))continue;
    if(Math.abs(e.x-q.x)<34&&Math.abs(e.y-q.y)<14){
      damage(e,q.dmg,true,sgn(e.x-q.x),{tag:'holy'});
      if(e.type==='dm'||e.type==='meg'||e.type==='azazel')for(let i=0;i<6;i++)parts.push({x:e.x,y:e.y,z:30,vx:rand(-20,20),vy:0,vz:rand(30,60),life:.6,max:.6,col:'#e8e8e8',size:2,grav:0});
    }
  }
}
function playerProj(q){
  for(const e of ents){
    if(e.dead||SKIP_ST.includes(e.st))continue;
    if(q.kind==='colt'){if(e.type==='azazel'&&e.st==='held'&&Math.abs(e.y-q.y)<14&&Math.abs(e.x-q.x)<12){q.dead=true;coltKill(e);return;}continue;}
    if(q.kind==='flask'&&q.z>44)continue;
    if(Math.abs(e.y-q.y)<9&&Math.abs(e.x-q.x)<(q.kind==='rifle'?11:9)){
      if(q.kind==='flask'){explodeFlask(q);q.dead=true;return;}
      if(q.pierce){if(q.set.has(e))continue;q.set.add(e);damage(e,q.dmg,q.kd,sgn(q.vx),{tag:q.tag});sfx('hit');continue;}
      q.dead=true;damage(e,q.dmg,q.kd,sgn(q.vx),{tag:q.tag});sfx('hit');return;
    }
  }
}
function updTraps(dt){
  for(const t of traps)t.life-=dt;traps=traps.filter(t=>t.life>0);
  for(const e of ents){e.trapped=false;e.slowF=1;
    for(const t of traps)if(Math.hypot(e.x-t.x,(e.y-t.y)*3)<t.r){if((e.demon||e.type==='meg')&&!(BOSSDEF[e.type]&&BOSSDEF[e.type].trapImmune))e.trapped=true;else e.slowF=.45;}}
}

function engageTokens(){
  const list=ents.filter(e=>!e.dead&&['v','vp','dm'].includes(e.ai)&&!['air','down','dead','getup'].includes(e.st));
  list.sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x));
  list.forEach((e,i)=>e.engaged=i<2);
}
function updEnemy(e,dt){
  e.t+=dt;e.stT+=dt;if(e.flash>0)e.flash-=dt;if(e.inv>0)e.inv-=dt;e.atkCd-=dt;e.vanCd-=dt;e.throwCd-=dt;
  const p=P,side=e.x<p.x?-1:1;
  const pDown=['down','air'].includes(p.st);
  if(e.trapped&&!['air','down','dead','getup','appear','drop'].includes(e.st)){e.st='idle';e.hp-=12*dt;e.flash=Math.max(e.flash,.03);
    if(Math.random()<dt*6)parts.push({x:e.x+rand(-6,6),y:e.y,z:rand(10,40),vx:0,vy:0,vz:rand(20,40),life:.4,max:.4,col:'#c83020',size:1,grav:0});
    if(e.hp<=0)knock(e,P.face,.6);return;}
  switch(e.st){
    case 'drop':e.z+=e.vz*dt;e.vz-=GRAV*dt;if(e.z<=0){e.z=0;e.vz=0;e.st='idle';sfx('land');for(let i=0;i<6;i++)parts.push({x:e.x,y:e.y,z:1,vx:rand(-40,40),vy:0,vz:rand(10,40),life:.4,max:.4,col:'#5a4a3a',size:2,grav:1});}return;
    case 'lwind':e.face=-side;if(e.stT>.35){e.st='lunge';e.stT=0;e.set=new Set();sfx('hiss');}return;
    case 'lunge':e.x=clamp(e.x+e.face*175*(e.slowF||1)*dt,cam.x+8,cam.x+SW-8);strike(e,[P],18,e.dmg,false,{set:e.set});if(e.stT>.32){e.st='recover';e.stT=0;}return;
    case 'throw':e.face=-side;if(e.stT>.5&&!e.fired){e.fired=true;sfx('smoke');projs.push({kind:'smoke',x:e.x+e.face*12,y:e.y,z:26,vx:e.face*125,life:2.4,dmg:9,owner:'e'});}
      if(e.stT>.85){e.st='idle';e.fired=false;e.atkCd=rand(1,1.6);}return;
    case 'appear':e.alpha=Math.min(1,e.stT/.45);if(e.stT>.45){e.st='idle';e.alpha=1;}return;
    case 'vanish':e.alpha=Math.max(0,1-e.stT/.35);if(e.stT>.35){e.x=clamp(p.x-p.face*rand(50,70),cam.x+14,cam.x+SW-14);e.y=clamp(p.y+rand(-6,6),LT,LB);e.face=e.x<p.x?1:-1;e.st='appear';e.stT=0;sfx('vanish');}return;
    case 'air':bodyHit(e);if(physicsAir(e,dt)){e.st='down';e.stT=0;}return;
    case 'down':if(e.stT>.7){if(e.hp<=0){e.st='dead';e.stT=0;if(e.type==='ava')avaFalls();enemyFalls(e);sfx(e.ghost?'dissolve':e.angel?'wings':'poof');score+=e.ai==='g'?150:100;}else{e.st='getup';e.stT=0;e.inv=.4;}}return;
    case 'getup':if(e.stT>.35){e.st='idle';if(e.ai==='v'&&Math.random()<.35){e.st='vanish';e.stT=0;}}return;
    case 'dead':e.alpha=1-e.stT/.6;if(Math.random()<.6&&!e.human)parts.push({x:e.x+rand(-10,10),y:e.y,z:rand(0,10),vx:0,vy:0,vz:e.demon?rand(60,110):rand(30,70),life:.6,max:.6,col:e.hound?(Math.random()<.5?'#ff5020':'#2a0a06'):e.angel?(Math.random()<.5?'#ffffff':'#fff2b0'):e.dark?'#000000':e.ai==='vp'?(Math.random()<.5?'#8a1010':'#4a4a4a'):e.demon?'#0c080e':'#9fe8ff',size:e.demon||e.dark?3:2,grav:0});
      if(e.stT>.6){e.dead=true;if(e.ai==='g'?Math.random()<.6:Math.random()<.18)dropItem(Math.random()<.6?'salt':'burger',e.x,e.y);}return;
    case 'hurt':e.x+=e.vx*dt;e.vx*=Math.pow(.01,dt);if(e.stT>.26)e.st='idle';return;
    case 'windup':e.face=-side;if(e.stT>.4){e.st='eatk';e.stT=0;e.set=new Set();sfx('swing');}return;
    case 'eatk':if(e.stT<.12)strike(e,[P],24,e.dmg||8,false,{set:e.set});if(e.stT>.22){e.st='recover';e.stT=0;}return;
    case 'recover':if(e.stT>.4){e.st='idle';e.atkCd=rand(1,1.8);}return;
    case 'summon':e.face=-side;if(e.stT>.7&&!e.fired){e.fired=true;sfx('smoke');banner={l1:'AVA CHAMA OS ACHERI',l2:'',t:1.4,small:true};
        for(const d of[-1,1])spawnEnemy('ac',clamp(p.x+d*60,cam.x+16,cam.x+SW-16),clamp(p.y+rand(-10,10),LT,LB));}
      if(e.stT>1.1){e.st='idle';e.fired=false;}return;
    case 'scream':e.face=-side;if(e.stT>.55&&!e.fired){e.fired=true;sfx('scream');projs.push({kind:'wave',x:e.x+e.face*12,y:e.y,z:24,vx:e.face*115,life:2.4,dmg:10,owner:'e'});}
      if(e.stT>1){e.st='idle';e.fired=false;e.atkCd=rand(2.2,3.4);}return;
  }
  // idle / walk
  let tx,ty;
  if(e.ai!=='g'){const near=e.ai==='vp'?46:24;tx=p.x+side*(e.engaged?near:72);ty=e.engaged?p.y:clamp(p.y+e.offY,LT,LB);}
  else{tx=p.x+side*110;ty=p.y;}
  tx=clamp(tx,cam.x+12,cam.x+SW-12);
  const dx=tx-e.x,dy=ty-e.y;
  if(Math.abs(dx)>3||Math.abs(dy)>2){
    const sp=e.spd*(e.slowF||1);
    e.x+=Math.sign(dx)*Math.min(Math.abs(dx),sp*dt);
    e.y+=Math.sign(dy)*Math.min(Math.abs(dy),sp*.7*dt);
    e.st='walk';e.ph+=dt*8;}
  else e.st='idle';
  e.face=p.x>e.x?1:-1;
  e.y=clamp(e.y,LT,LB);
  if(e.dmbT>0)e.dmbT-=dt;
  if(e.type==='vp'&&e.hp<e.maxHp&&!(e.dmbT>0))e.hp=Math.min(e.maxHp,e.hp+2*dt);
  if(pDown)return;
  if(e.hound&&hero==='crowley'){if(!e.obey){e.obey=1;floatMsg('O CÃO OBEDECE O REI',e.x,e.y);}return;}
  if(e.ai==='vp'){if(e.engaged&&Math.abs(p.x-e.x)<72&&Math.abs(p.y-e.y)<7&&e.atkCd<=0){e.st='lwind';e.stT=0;}return;}
  if(e.ai==='dm'){
    if(e.engaged&&Math.abs(p.x-e.x)<30&&Math.abs(p.y-e.y)<6&&e.atkCd<=0){e.st='windup';e.stT=0;}
    else if(!e.noThrow&&!e.engaged&&Math.abs(p.y-e.y)<8&&Math.abs(p.x-e.x)<190&&e.throwCd<=0){e.st='throw';e.stT=0;e.fired=false;e.throwCd=rand(3,5);}
    return;}
  if(e.type==='ava'){
    if(e.atkCd<=0){const n=ents.filter(x=>!x.dead&&x.type==='ac').length;
      if(Math.abs(p.x-e.x)<44&&Math.abs(p.y-e.y)<10){e.st='vanish';e.stT=0;sfx('smoke');e.atkCd=rand(1.6,2.4);}
      else if(n<3){e.st='summon';e.stT=0;e.fired=false;e.atkCd=rand(3,4);}
      else e.atkCd=1;}
    return;}
  if(e.ai==='v'){
    if(e.engaged&&Math.abs(p.x-e.x)<30&&Math.abs(p.y-e.y)<6&&e.atkCd<=0){e.st='windup';e.stT=0;}
    else if(e.vanCd<=0&&Math.abs(p.x-e.x)>60){e.vanCd=rand(6,10);e.st='vanish';e.stT=0;sfx('vanish');}
  }else if(Math.abs(e.y-p.y)<6&&Math.abs(e.x-p.x)<180&&e.atkCd<=0){e.st='scream';e.stT=0;e.fired=false;}
}
function updWoman(e,dt){
  e.t+=dt;e.stT+=dt;if(e.flash>0)e.flash-=dt;e.atkCd-=dt;
  const p=P,side=e.x<p.x?-1:1;
  const fz=5+Math.sin(e.t*2)*2;
  if(!['air','down','getup'].includes(e.st))e.z+=(fz-e.z)*Math.min(1,dt*6);
  if(!e.sum1&&e.hp<e.maxHp*.66){e.sum1=true;summon();}
  if(!e.sum2&&e.hp<e.maxHp*.33){e.sum2=true;summon();}
  switch(e.st){
    case 'appear':e.alpha=Math.min(1,e.stT/.6);if(e.stT>.6){e.st='float';e.alpha=1;}return;
    case 'dying':e.vx=0;if(Math.random()<.8)parts.push({x:e.x+rand(-12,12),y:e.y,z:rand(0,44),vx:0,vy:0,vz:rand(20,60),life:.8,max:.8,col:Math.random()<.5?'#ffffff':'#9fe8ff',size:2,grav:0});
      if(e.stT>2.6&&!endT){endT=1.5;}return;
    case 'air':if(physicsAir(e,dt)){e.st='down';e.stT=0;}return;
    case 'down':if(e.stT>.9){e.st='getup';e.stT=0;}return;
    case 'getup':if(e.stT>.35){e.st='bout';e.stT=0;sfx('vanish');}return;
    case 'hurt':e.x+=e.vx*dt;e.vx*=Math.pow(.01,dt);if(e.stT>.18){e.st=Math.random()<.3?'bout':'float';e.stT=0;if(e.st==='bout')sfx('vanish');}return;
    case 'cwind':e.face=-side;e.y+=clamp(p.y-e.y,-1,1)*30*dt;if(e.stT>.6){e.st='charge';e.stT=0;e.set=new Set();sfx('scream');}return;
    case 'charge':e.x+=e.face*215*dt;strike(e,[P],22,14,true,{set:e.set,zr:30});if(Math.random()<.7)parts.push({x:e.x-e.face*8,y:e.y,z:rand(6,40),vx:0,vy:0,vz:0,life:.3,max:.3,col:'#e8f4ff',size:3,grav:0});
      if(e.stT>.65||e.x<cam.x+14||e.x>cam.x+SW-14){e.x=clamp(e.x,cam.x+14,cam.x+SW-14);e.st='recover';e.stT=0;}return;
    case 'swind':e.face=-side;if(e.stT>.55&&!e.fired){e.fired=true;sfx('scream');shake=4;for(const dy of[-10,10])projs.push({kind:'wave',big:true,x:e.x+e.face*12,y:clamp(e.y+dy,LT,LB),z:26,vx:e.face*125,life:2.6,dmg:12,owner:'e'});}
      if(e.stT>1){e.st='recover';e.stT=0;e.fired=false;}return;
    case 'bout':e.alpha=Math.max(0,1-e.stT/.3);if(e.stT>.3){e.x=clamp(p.x-p.face*38,cam.x+14,cam.x+SW-14);e.y=p.y;e.face=e.x<p.x?1:-1;e.st='bin';e.stT=0;}return;
    case 'bin':e.alpha=Math.min(1,e.stT/.2);if(e.stT>.2){e.alpha=1;e.st='bwind';e.stT=0;}return;
    case 'bwind':e.face=e.x<p.x?1:-1;if(e.stT>.3){e.st='bstrike';e.stT=0;e.set=new Set();sfx('swing');}return;
    case 'bstrike':if(e.stT<.12)strike(e,[P],30,11,true,{set:e.set});if(e.stT>.2){e.st='recover';e.stT=0;}return;
    case 'recover':if(e.stT>.55){e.st='float';e.atkCd=rand(1.3,2.2);}return;
  }
  // flutuando
  const tx=clamp(p.x+side*80,cam.x+20,cam.x+SW-20),ty=p.y;
  e.x+=clamp(tx-e.x,-1,1)*Math.min(Math.abs(tx-e.x),e.spd*dt);e.y+=clamp(ty-e.y,-1,1)*Math.min(Math.abs(ty-e.y),e.spd*.6*dt);
  e.face=p.x>e.x?1:-1;e.st='float';
  if(e.atkCd<=0&&!['down','air'].includes(p.st)){
    const r=Math.random(),far=Math.abs(p.x-e.x)>70;
    e.st=far?(r<.5?'cwind':r<.85?'swind':'bout'):(r<.5?'bout':'cwind');e.stT=0;e.fired=false;
    if(e.st==='bout')sfx('vanish');
  }
}
function avaFalls(){banner={l1:'JAKE ACABA COM AVA',l2:'O CONTROLE DOS ACHERI SE QUEBRA',t:2.6,small:true};sfx('heavy');
  for(const x of ents)if(!x.dead&&x.type==='ac'&&!['dead','air','down'].includes(x.st)){x.hp=0;knock(x,sgn(x.x-P.x)||1,.6);}}
function summon(){banner={l1:'ELA CHAMA AS VÍTIMAS',l2:'',t:1.6,small:true};sfx('scream');spawnEnemy('v',cam.x+20,rand(LT,LB));spawnEnemy('v',cam.x+SW-20,rand(LT,LB));}
function bossDie(b){if(BOSSDEF[b.type]&&BOSSDEF[b.type].onDie)BOSSDEF[b.type].onDie(b);if(b.type==='jake')banner={l1:'JAKE CAI',l2:'MAS A NOITE NÃO ACABOU',t:2.6,small:true};b.st='dying';b.stT=0;b.vx=0;stopSong();sfx('die');flash=.8;shake=10;ents.forEach(e=>{if(e!==b&&!e.dead){e.st='dead';e.stT=0;}});projs=[];}

/* ============ Ondas e câmera ============ */
function updateZones(dt){
  const z=ZONES[zoneIdx];
  if(!zoneOn){
    if(z&&cam.x>=z.x-.5){zoneOn=true;cam.max=z.x;waveIdx=0;
      if(z.boss){spawnBoss();}else queueWave();}
    return;
  }
  if(spawnQ.length){spawnT-=dt;if(spawnT<=0){const t=spawnQ.shift();const left=spawnQ.length%2===0;spawnEnemy(t,left?cam.x+18:cam.x+SW-18,rand(LT+4,LB-4));spawnT=.5;}return;}
  if(z.boss)return;
  if(ents.every(e=>e.dead)){
    if(waveIdx<z.waves.length-1){waveIdx++;queueWave();}
    else{zoneOn=false;zoneIdx++;const n=ZONES[zoneIdx];cam.max=n?n.x:STAGE_W-SW;goT=3.5;}
  }
}
function queueWave(){spawnQ=ZONES[zoneIdx].waves[waveIdx].slice();spawnT=.6;}
function updateCam(dt){
  const target=clamp(P.x-130,0,cam.max);
  if(target>cam.x)cam.x+=Math.min(target-cam.x,140*dt);
  cam.x=clamp(cam.x,0,STAGE_W-SW);
  if(goT>0&&P.x>cam.x+SW*.6)goT=Math.min(goT,.5);
}

