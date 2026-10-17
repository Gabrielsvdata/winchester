'use strict';
/* ============ Tela inicial ============ */
let titleMenu=false,titleSel=0,logoCv=null,lightT=0,boltX=0,rain=[];
const flick=new Array(10).fill(0);
const IN_PORTFOLIO=location.pathname.indexOf('/jogos/')===0;
let MENU=[];
function buildMenu(){MENU=[{label:'NOVO JOGO',act:()=>chapterIntro(1)}];if(progress>1)MENU.push({label:'CAPÍTULOS',act:()=>chaptersScreen()});MENU.push({label:'CONTROLES',act:()=>controlsScreen()});if(IN_PORTFOLIO)MENU.push({label:'VOLTAR AO PORTFÓLIO',act:()=>{location.href='/';}});}
const MENU_Y=166;
function titleScreen(){buildMenu();layers=getLayers(1);mode='title';hideScreen();$('#cap').hidden=true;titleMenu=false;titleSel=0;showPad();playSong('title');}
function titleConfirm(){audioOn();if(!titleMenu){titleMenu=true;sfx('pick');playSong('title');return;}sfx('pick');MENU[titleSel].act();}
function titleNav(d){audioOn();if(!titleMenu){titleMenu=true;return;}titleSel=(titleSel+d+MENU.length)%MENU.length;sfx('swing');}
function controlsScreen(){
  mode='controls';
  show(`<div class="box"><p class="eyebrow">CONTROLES</p>
    <dl class="keys">
      <dt>MOVER</dt><dd>Setas ou WASD. Toque duas vezes para o lado para correr.</dd>
      <dt>ATACAR</dt><dd>J ou Z. Aperte em sequência para o combo de 3 golpes.</dd>
      <dt>PULAR</dt><dd>K, X ou Espaço. Ataque no ar para a voadora.</dd>
      <dt>TIRO</dt><dd>L ou C. Tem tempo de recarga.</dd>
      <dt>MAGIA</dt><dd>I ou V. Usa os sacos de sal. Cada caçador tem a sua: círculo de sal (Dean), onda psíquica (Sam), facão giratório (John), Armadilha do Diabo (Bobby) e punição divina (Castiel). Mais sacos, mais força.</dd>
      <dt>ESPECIAL</dt><dd>Ataque e pulo juntos (J + K, ou os dois botões no celular). Golpe giratório que afasta quem estiver em volta. Custa um pouco de vida.</dd>
      <dt>COLT</dt><dd>No capítulo 4, quando o espírito do John segurar Azazel, aperte TIRO.</dd>
      <dt>CELULAR</dt><dd>Analógico à esquerda, botões à direita. Empurre até o fim para correr.</dd>
      <dt>CONTROLE</dt><dd>X ataca, A pula, B atira, Y magia, Start pausa.</dd>
    </dl>
    <p class="fine">Fan game gratuito e não oficial, inspirado em Supernatural, de Eric Kripke. Sem relação com a série nem com seus donos. Doações são opcionais e ajudam a continuar o desenvolvimento.</p>
    <div class="row"><button class="btn go" data-act="title">◀ VOLTAR</button></div></div>`);
}
function buildLogo(){
  logoCv=document.createElement('canvas');logoCv.width=260;logoCv.height=40;const g=logoCv.getContext('2d');
  g.font='24px '+FONT;g.textBaseline='top';
  const word='WINCHESTER';
  const gr=g.createLinearGradient(0,8,0,32);gr.addColorStop(0,'#fff8e0');gr.addColorStop(.42,'#f6c24a');gr.addColorStop(.58,'#d07a1c');gr.addColorStop(1,'#6a1a06');
  for(let i=0;i<word.length;i++){const x=10+i*24;g.fillStyle='#2a0602';g.fillText(word[i],x+2,10);g.fillText(word[i],x+1,11);g.fillStyle=gr;g.fillText(word[i],x,8);}
  g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,255,255,.28)';g.fillRect(0,8,260,3);g.globalCompositeOperation='source-over';
}
function drawLogo(x,y,t){
  if(!logoCv)buildLogo();
  const pulse=.16+.05*Math.sin(t*3)+(lightT>0?.2:0);
  const gl=c.createRadialGradient(x+130,y+20,8,x+130,y+20,150);gl.addColorStop(0,`rgba(242,140,40,${pulse})`);gl.addColorStop(1,'rgba(242,140,40,0)');
  c.fillStyle=gl;c.fillRect(x-30,y-30,320,110);
  for(let i=0;i<10;i++){
    if(flick[i]>0)flick[i]-=1/60;else if(Math.random()<.004)flick[i]=rand(.06,.3);
    const dim=flick[i]>0&&Math.floor(t*28)%2===0;
    c.globalAlpha=dim?.22:1;
    const jit=Math.random()<.008?Math.round(rand(-2,2)):0;
    c.drawImage(logoCv,10+i*24,0,24,40,x+10+i*24+jit,y,24,40);
  }
  c.globalAlpha=1;
}
function npc(L,x,y,face,st,t,o,extra){
  const e={st:st||'idle',stT:t,t,kind:'npc',ph:t*9};
  const pose=Object.assign(poseFor(e),extra||{});
  drawPuppet(bg,L,pose);
  if(!(o&&o.noShadow)){c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(Math.round(x-8),Math.round(y-1),16,3);c.globalAlpha=1;}
  blit(x,y,face,o||{});
}
function renderTitle(){
  const t=performance.now()/1000,dt=1/60;
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
  c.drawImage(layers.sky,0,0);
  if(lightT>0){lightT-=dt;
    if(lightT>.22){c.fillStyle='#f4f6ff';let bx=boltX,by=0;while(by<96){const nx=bx+Math.round(rand(-5,5));c.fillRect(Math.min(bx,nx),by,Math.abs(nx-bx)+1,6);bx=nx;by+=6;}}
    c.globalAlpha=Math.min(.45,lightT*1.4);c.fillStyle='#c8d0ff';c.fillRect(0,0,SW,150);c.globalAlpha=1;}
  else if(Math.random()<.0035){lightT=.5;boltX=rand(30,290);noise(1.4,.28,350);}
  c.drawImage(layers.far,0,0);c.drawImage(layers.mid,0,0);c.drawImage(layers.ground,0,layers.G0);
  // farol do Impala
  c.fillStyle='rgba(255,236,170,.09)';c.beginPath();c.moveTo(139,141);c.lineTo(SW,116);c.lineTo(SW,184);c.closePath();c.fill();
  c.fillStyle='rgba(255,236,170,.07)';c.beginPath();c.moveTo(139,141);c.lineTo(250,130);c.lineTo(250,156);c.closePath();c.fill();
  npc(LOOKS.dean,172,166,-1,'idle',t);
  npc(LOOKS.sam,196,168,-1,'idle',t+1.3);
  // chuva
  if(rain.length<110)for(let i=0;i<3;i++)rain.push({x:rand(0,SW+60),y:rand(-20,0),v:rand(230,310)});
  c.fillStyle='rgba(150,165,205,.45)';
  for(const r of rain){r.y+=r.v*dt;r.x-=r.v*dt*.25;c.fillRect(Math.round(r.x),Math.round(r.y),1,4);if(r.y>SH){r.y=rand(-20,0);r.x=rand(0,SW+60);}}
  vignette();
  drawLogo(30,22,t);
  text('SALVAR PESSOAS. CAÇAR COISAS.',160,68,'#efe8d6',8,'center');
  text('O NEGÓCIO DA FAMÍLIA',160,84,'#f2b632',8,'center');
  if(mode==='controls')return;
  if(!titleMenu){if(Math.floor(t*2)%2===0)text(touchMode?'TOQUE PARA COMEÇAR':'APERTE START',160,MENU_Y+12,'#efe8d6',8,'center');}
  else{
    c.fillStyle='rgba(6,5,12,.75)';c.fillRect(56,MENU_Y-7,208,MENU.length*14+8);
    MENU.forEach((m,i)=>{const on=i===titleSel,y=MENU_Y+i*14;text(m.label,160,y,on?'#f2b632':'#9fb6c8',8,'center');
      if(on){const ax=Math.round(160-m.label.length*4-12);c.fillStyle='#f2b632';for(let k=0;k<4;k++)c.fillRect(ax+k,y+k,1,8-k*2);}});
  }
  text('FAN GAME GRATUITO E NÃO OFICIAL',160,214,'#5c5874',6,'center',false);
}

/* ============ Abertura: a estrada até aqui ============ */
const L_MARY={skin:'#f0c8a0',hair:'#e8c878',style:'woman',jacket:'#f2f0ec',jacketD:'#c8c4bc',shirt:'#ffffff',dress:'#f4f2ee',dressD:'#cfcac2',skirt:true,eye:'#1a1010',boots:'#000',tall:1};
const L_JOHN={skin:'#e4b088',hair:'#3a2a1c',style:'short',jacket:'#5a4630',jacketD:'#3a2c1c',shirt:'#8a8478',pants:'#3a4258',pantsD:'#283044',boots:'#1a1410',tall:2};
const L_KID={skin:'#f0c098',hair:'#d8b060',style:'short',jacket:'#4a6a9a',jacketD:'#34507a',shirt:'#6a8aba',pants:'#4a6a9a',pantsD:'#34507a',boots:'#d8d0c0',tall:-8};
const L_SHADOW={skin:'#0c0c10',hair:'#050508',style:'short',jacket:'#0c0c12',jacketD:'#060608',shirt:'#101018',pants:'#0a0a10',pantsD:'#060608',boots:'#000',eye:'#ffd400',tall:2};
let introI=0,introT=0,introWait=0,cut=[];
function startIntro(){mode='intro';introI=-1;nextScene();}
function nextScene(){
  introI++;if(introI>=INTRO.length){endIntro();return;}
  introT=0;introWait=0;cut=[];
  const sc=INTRO[introI],cap=$('#cap');
  if(sc.sfx)sc.sfx();
  if(sc.text){cap.hidden=false;$('#capPlace').textContent=sc.place;$('#capHint').textContent=touchMode?'TOQUE PARA SEGUIR':'ENTER PARA SEGUIR';typeText($('#capText'),sc.text);}
  else{cap.hidden=true;if(typing){clearInterval(typing);typing=null;}}
  layout();
}
function advanceIntro(){if(introT<.3)return;const el=$('#capText');if(typing&&el){clearInterval(typing);typing=null;el.textContent=el.dataset.full;return;}nextScene();}
function endIntro(){if(typing){clearInterval(typing);typing=null;}$('#cap').hidden=true;chapter=1;selectScreen();}
function updIntro(dt){
  const sc=INTRO[introI];if(!sc)return;
  if(sc.auto){if(introT>sc.auto)nextScene();}
  else{const h=$('#capHint');const v=typing?'hidden':'visible';if(h.style.visibility!==v)h.style.visibility=v;}
  for(const q of cut){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;}
  cut=cut.filter(q=>q.life>0);if(cut.length>700)cut.splice(0,cut.length-700);
}
function renderIntro(){
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
  const sc=INTRO[introI];if(sc)sc.draw(introT);
  if(introT<.45){c.globalAlpha=1-introT/.45;c.fillStyle='#000';c.fillRect(0,0,SW,SH);c.globalAlpha=1;}
  c.fillStyle='#000';c.fillRect(0,0,SW,8);c.fillRect(0,SH-8,SW,8);
}
function drawCut(){for(const q of cut){c.globalAlpha=Math.max(0,Math.min(1,q.life/q.max));c.fillStyle=q.col;c.fillRect(Math.round(q.x),Math.round(q.y),q.s,q.s);}c.globalAlpha=1;}
const FIRE=['#ffd23a','#ff8a1a','#e8401a','#ffef9a'];
function flames(x,y,w,n){for(let i=0;i<n;i++)cut.push({x:x+rand(0,w),y:y+rand(-2,2),vx:rand(-6,6),vy:rand(-42,-14),life:rand(.4,.9),max:.9,col:FIRE[(Math.random()*4)|0],s:Math.random()<.3?2:1});}
function smoke(x,y,n){for(let i=0;i<n;i++)cut.push({x:x+rand(-8,8),y,vx:rand(-3,9),vy:rand(-22,-10),life:rand(1.4,2.2),max:2.2,col:'rgba(28,24,32,.75)',s:3});}
function pine(x,base,h,col){for(let y=0;y<h;y++){const w=Math.round((y/h)*h*.32)+1;c.fillStyle=col;c.fillRect(x-w,base-h+y,w*2+1,1);}c.fillRect(x-1,base,3,4);}
function lawn(y,col){px(c,0,y,SW,SH-y,col);const R=seeded(9);for(let i=0;i<260;i++){c.fillStyle=R()<.5?'#1a2a1e':'#0c140e';c.fillRect((R()*SW)|0,(y+R()*(SH-y))|0,1+(R()*2|0),1);}}
function drawHouse(x,y,stage,t){
  for(let r=0;r<28;r++){const w=Math.round(136-r*4.8);px(c,x+68-w/2,y-74-r,w,1,r%4?'#1c1a26':'#16141e');}
  px(c,x,y-74,136,74,'#2c2c3c');for(let yy=y-70;yy<y;yy+=4)px(c,x,yy,136,1,'#25252f');
  px(c,x+104,y-110,10,22,'#24202a');
  const fl=Math.random()<.5;
  const win=(wx,wy,col)=>{px(c,wx-1,wy-1,20,16,'#14121a');px(c,wx,wy,18,14,col);px(c,wx+8,wy,2,14,'#14121a');px(c,wx,wy+6,18,2,'#14121a');};
  let nur='#c8a050';
  if(stage==='flicker')nur=Math.random()<.3?'#16141e':'#c8a050';
  if(stage==='burn')nur=fl?'#ff9a2a':'#ffd060';
  const hot=stage==='burn';
  win(x+18,y-62,nur);win(x+100,y-62,hot?(fl?'#ff7a1a':'#ffc040'):'#1a2030');
  win(x+18,y-32,hot?(!fl?'#ff7a1a':'#ffc040'):'#3a3420');win(x+100,y-32,hot?'#ff8a2a':'#1a2030');
  px(c,x+58,y-34,18,34,hot?'#5a2a10':'#3a2a20');px(c,x+72,y-18,2,2,'#c8a050');
  px(c,x-6,y-37,148,3,'#3a3a48');for(let k=0;k<10;k++)px(c,x-4+k*15,y-34,2,34,'#30303c');
  if(hot){flames(x+18,y-64,18,3);flames(x+100,y-64,18,3);flames(x+18,y-34,18,2);flames(x+100,y-34,18,2);flames(x+8,y-100,120,5);if(Math.random()<.5)smoke(x+68,y-104,1);}
}
function sceneCard(t){
  c.fillStyle='#000';c.fillRect(0,0,SW,SH);
  for(let i=0;i<50;i++){c.fillStyle=Math.random()<.5?'#1c1a22':'#100e16';c.fillRect(rand(0,SW)|0,rand(0,SH)|0,2,1);}
  const on=Math.random()>.07;c.globalAlpha=(on?1:.25)*Math.min(1,t*1.4);
  text('A ESTRADA',160,84,'#efe8d6',16,'center');text('ATÉ AQUI',160,108,'#f2b632',16,'center');c.globalAlpha=1;
}
function sceneHouse(t){
  c.drawImage(layers.sky,0,0);c.drawImage(layers.far,0,10);
  lawn(150,'#121c16');
  pine(30,152,70,'#0c1612');pine(58,152,52,'#0e1a14');pine(292,152,76,'#0c1612');
  px(c,150,150,18,74,'#2a2620');
  drawHouse(92,150,t>2.6?'flicker':'calm',t);
  px(c,52,160,2,16,'#3a3a3a');px(c,46,154,14,8,'#2a3a5a');
  drawCut();
}
function sceneNursery(t){
  px(c,0,0,SW,170,'#161828');for(let x=0;x<SW;x+=14)px(c,x,0,1,170,'#1b1e30');px(c,0,0,SW,14,'#0e0f1a');
  px(c,0,170,SW,54,'#2a1c12');for(let y=176;y<SH;y+=8)px(c,0,y,SW,1,'#22160e');
  px(c,30,46,44,54,'#0c0e18');px(c,32,48,40,50,'#2a3a5a');px(c,51,48,2,50,'#0c0e18');px(c,32,72,40,2,'#0c0e18');disc(c,62,58,4,'#e8e4c8');
  c.fillStyle='rgba(160,180,230,.07)';c.beginPath();c.moveTo(32,98);c.lineTo(72,98);c.lineTo(150,SH);c.lineTo(70,SH);c.closePath();c.fill();
  const bx=200,by=178;
  px(c,bx-4,by-42,4,46,'#6a4a2a');px(c,bx+62,by-42,4,46,'#6a4a2a');px(c,bx-4,by-40,70,3,'#7a5432');px(c,bx-4,by-6,70,4,'#6a4a2a');
  px(c,bx+2,by-14,58,6,'#d8d0e0');px(c,bx+24,by-19,12,6,'#ece4f4');px(c,bx+33,by-19,4,4,'#f0c098');
  for(let k=0;k<11;k++)px(c,bx+2+k*6,by-38,2,32,'#8a6440');
  px(c,bx+30,14,1,28,'#555');const ma=t*1.4;
  for(let k=0;k<3;k++){const ax=bx+31+Math.cos(ma+k*2.1)*12;px(c,ax-2,42,4,4,['#e8c040','#7ab0e0','#e07a8a'][k]);}
  const evil=t<3.4;
  const lampOn=evil?!(t>1.2&&Math.random()<.3):false;
  px(c,112,140,8,30,'#3a2a20');px(c,104,128,24,12,lampOn?'#e8c878':'#2a2418');
  if(lampOn){c.fillStyle='rgba(232,200,120,.07)';c.beginPath();c.arc(116,134,60,0,Math.PI*2);c.fill();}
  if(evil){
    npc(L_SHADOW,190,178,1,'idle',t,{outline:'#000'},{lean:3,fa:[1.3,.4],ba:[1.1,.5]});
    const g=.55+.45*Math.sin(t*5);c.save();c.shadowColor='#ffd400';c.shadowBlur=8;c.fillStyle=`rgba(255,220,40,${g})`;
    c.fillRect(194,133,2,1);c.fillRect(197,133,2,1);c.restore();
  }else{
    const k=t-3.4;
    if(k<.15){c.fillStyle='#fff';c.fillRect(0,0,SW,SH);}
    npc(L_MARY,118,24,1,'down',0,{rot:Math.PI/2,noShadow:true});
    const w=Math.min(SW,k*190);flames(160-w/2,22,w,Math.min(10,2+k*5));
    drawCut();
    c.fillStyle=`rgba(255,110,30,${Math.min(.32,k*.18)})`;c.fillRect(0,0,SW,SH);
    return;
  }
  drawCut();
}
function sceneFire(t){
  c.drawImage(layers.sky,0,0);c.drawImage(layers.far,0,10);
  c.fillStyle='rgba(255,90,20,.12)';c.fillRect(0,0,SW,150);
  lawn(150,'#141a12');
  pine(30,152,70,'#0c1612');pine(292,152,76,'#0c1612');
  drawHouse(92,150,'burn',t);
  drawCut();
  npc(L_JOHN,120,204,1,'idle',t,{},{fa:[1.2,1.5],ba:[1.0,1.6]});
  px(c,123,158,12,7,'#e8e4dc');px(c,123,158,12,1,'#ffffff');px(c,131,159,3,3,'#f0c098');
  npc(L_KID,146,206,-1,'idle',t+.7,{},{fa:[.6,.4]});
  c.fillStyle=`rgba(255,120,30,${.1+.04*Math.sin(t*12)})`;c.fillRect(0,0,SW,SH);
}
function sceneDrive(t){
  c.drawImage(layers.sky,0,0);
  c.drawImage(layers.far,-Math.round(t*10),0);
  c.drawImage(layers.mid,-Math.round(t*35)%480,0);
  const sx=200+Math.round(t*140)%160;
  c.drawImage(layers.ground,sx,0,SW,104,0,layers.G0,SW,104);
  const bob=Math.sin(t*22)>0?1:0;
  c.fillStyle='rgba(255,236,170,.09)';c.beginPath();c.moveTo(215,142);c.lineTo(SW,124);c.lineTo(SW,172);c.closePath();c.fill();
  impala(c,104,130+bob);
  if(Math.random()<.6)cut.push({x:104,y:150,vx:-rand(20,50),vy:rand(-4,0),life:.6,max:.6,col:'rgba(120,120,130,.5)',s:2});
  drawCut();
  vignette();
  const year=Math.min(2005,1983+Math.floor(t*4));
  text(String(year),160,34,'#f2b632',16,'center');
}
function sceneStanford(t){
  c.drawImage(layers.sky,0,0);c.drawImage(layers.far,-40,10);
  lawn(150,'#16221a');
  px(c,40,66,240,84,'#3a3226');px(c,34,58,252,9,'#2a241c');
  const R=seeded(21);
  for(let row=0;row<3;row++)for(let col=0;col<10;col++){const wx=52+col*23,wy=74+row*24;if(col===4||col===5){if(row===2)continue;}
    const lit=R()<.35;px(c,wx,wy,12,14,lit?'#d8b860':'#141218');if(lit&&Math.random()<.002)0;px(c,wx+5,wy,2,14,'#2a241c');}
  px(c,140,114,40,36,'#1e1a14');for(let r=0;r<20;r++){const w=Math.round(Math.sqrt(400-r*r))*2;px(c,160-w/2,114-r+1,w,1,'#1e1a14');}
  const palm=(x)=>{for(let i=0;i<60;i++)px(c,x+Math.round(Math.sin(i/22)*4),150-i,3,1,'#2a2018');
    for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*.45;for(let j=0;j<20;j++)px(c,x+1+Math.cos(a)*j,90+Math.sin(a)*j*.6+j*j*.02,2,1,'#14261a');}};
  palm(18);palm(300);
  impala(c,6,128);
  npc(LOOKS.dean,176,200,1,'idle',t);
  npc(LOOKS.sam,204,202,-1,'idle',t+1.1);
}
function sceneJericho(t){
  const cx=800;
  c.drawImage(layers.sky,0,0);c.drawImage(layers.far,-Math.round(cx*.2),0);c.drawImage(layers.mid,-Math.round(cx*.5),0);
  c.drawImage(layers.ground,-cx,layers.G0);
  for(let i=0;i<6;i++){c.fillStyle='rgba(200,215,235,.05)';c.fillRect(Math.round(((i*90+t*12)%440)-60),150+i*9,130,6);}
  const a=.55+.3*Math.sin(t*3);
  drawPuppet(bg,LOOKS.woman,Object.assign(poseFor({st:'float',stT:t,t,kind:'npc',ph:0}),{fa:[.5,.3],ba:[-.2,.3]}));
  blit(214,170-4-Math.sin(t*2)*2,-1,{outline:'#ffffff',alpha:a,glitch:Math.random()<.15?.6:0});
  vignette();
}
const INTRO=[
  {draw:sceneCard,auto:2.8,sfx:()=>{noise(.5,.3,700);}},
  {place:'LAWRENCE, KANSAS · 2 DE NOVEMBRO DE 1983',text:'Era para ser uma noite comum na casa dos Winchester. Mary pôs o pequeno Sam, de seis meses, no berço e foi dormir. Lá em cima, as luzes começaram a piscar.',draw:sceneHouse},
  {place:'O QUARTO DO SAM',text:'Mary achou que fosse John debruçado sobre o berço. Não era. Era uma coisa de olhos amarelos. Minutos depois, ela estava presa no teto, em chamas.',draw:sceneNursery},
  {place:'NAQUELA MESMA NOITE',text:'John tirou Dean e o bebê de casa e viu tudo queimar. Ali começou a caçada da vida dele: encontrar o que matou Mary.',draw:sceneFire},
  {place:'A ESTRADA',text:'Os meninos cresceram entre motéis, sal grosso e espingardas. Dean virou caçador como o pai. Sam quis outra vida e foi estudar em Stanford.',draw:sceneDrive},
  {place:'STANFORD, CALIFÓRNIA · 2005',text:'Até que, numa madrugada, Dean bate na porta do irmão: "O pai saiu pra caçar e não volta faz dias." Sam entra no Impala. Só por um fim de semana.',draw:sceneStanford},
  {place:'JERICHO, CALIFÓRNIA',text:'A última pista do diário de John leva a uma estrada escura, onde homens somem depois de dar carona a uma moça de vestido branco.',draw:sceneJericho},
];

function selectScreen(){
  mode='select';layers=getLayers(chapter);$('#cap').hidden=true;
  const C=CHAPTERS[chapter];if(!C.heroes.includes(hero))hero=C.heroes[0];
  show(`<div class="box"><p class="eyebrow">${phaseLabel(chapter)} · ESCOLHA SEU CAÇADOR</p><div class="pick">${heroCards(C)}</div><p class="fine">${C.hint}</p></div>`);
  paintPortraits();
}
function pause(){if(mode!=='play')return;mode='pause';show(`<div class="box"><p class="eyebrow">PAUSA</p><h2>Respira, caçador.</h2>${touchMode?`<dl class="keys"><dt>MOVER</dt><dd>Analógico. Empurre até o fim para correr.</dd><dt>ATACAR</dt><dd>3 toques seguidos fazem o combo.</dd><dt>PULO</dt><dd>Ataque no ar para a voadora.</dd><dt>TIRO</dt><dd>Recarrega sozinho.</dd><dt>MAGIA</dt><dd>Usa os sacos de sal.</dd><dt>ESPECIAL</dt><dd>ATACAR + PULO juntos: gira e afasta todos. Custa um pouco de vida.</dd></dl>`:`<dl class="keys"><dt>MOVER</dt><dd>Setas ou WASD. Toque duas vezes para o lado para correr.</dd><dt>ATACAR</dt><dd>J ou Z. Três seguidos fazem o combo.</dd><dt>PULAR</dt><dd>K, X ou Espaço. Ataque no ar para a voadora.</dd><dt>TIRO</dt><dd>L ou C. Recarrega sozinho.</dd><dt>MAGIA</dt><dd>I ou V. Usa os sacos de sal.</dd><dt>ESPECIAL</dt><dd>J + K juntos: gira e afasta todos. Custa um pouco de vida.</dd></dl>`}<div class="row"><button class="btn go" data-act="resume">▶ CONTINUAR</button><button class="btn" data-act="restart">REINICIAR</button><button class="btn" data-act="title">MENU</button></div></div>`);showPad();}
function resume(){hideScreen();mode='play';showPad();}
function gameOverScreen(){mode='over';showPad();show(`<div class="box"><p class="eyebrow">FIM DE JOGO</p><h2>A estrada venceu desta vez.</h2><p class="sub">${CHAPTERS[chapter].over}</p><div class="row"><button class="btn go" data-act="restart">▶ TENTAR DE NOVO</button><button class="btn" data-act="pickagain">TROCAR CAÇADOR</button></div></div>`);}
function endingScreen(){
  mode='ending';showPad();const C=CHAPTERS[chapter],last=chapter===CHAPTERS.length-1;saveProgress(chapter+1);
  const btns=last?`<button class="btn go" data-act="chap" data-n="1" type="button">▶ JOGAR DE NOVO</button><button class="btn" data-act="title" type="button">MENU</button>`
    :`<button class="btn go" data-act="next" type="button">▶ ${arcOf(chapter+1)!==arcOf(chapter)?'CAPITULO '+arcOf(chapter+1):'FASE '+phaseOf(chapter+1)}</button><button class="btn" data-act="restart" type="button">JOGAR DE NOVO</button>`;
  show(`<div class="box"><p class="eyebrow">${last?'WINCHESTER · FIM DO CAPITULO 2':(phaseOf(chapter)===ARCS[arcOf(chapter)].stages.length?'FIM DO CAPITULO '+arcOf(chapter):'FIM DA FASE '+phaseOf(chapter))}</p><h2>${C.outro.h}</h2>
    <p class="txt" id="tw"></p>
    <p class="sub">Pontos: ${String(score).padStart(6,'0')}</p>
    ${last?'<p class="fine">Os próximos capítulos estão em produção: o ano de Dean, a chegada de Castiel, o Apocalipse e a Jaula.</p>':''}
    <div class="row">${btns}</div></div>`);
  typeText($('#tw'),C.outro.t);
}
scr.addEventListener('click',e=>{
  if(e.target.id==='tw'&&typing){clearInterval(typing);typing=null;e.target.textContent=e.target.dataset.full;return;}
  const b=e.target.closest('[data-act]');if(!b)return;audioOn();
  const a=b.dataset.act;
  if(a==='pick'){hero=b.dataset.id;startGame();}
  else if(a==='resume')resume();
  else if(a==='restart')startGame();
  else if(a==='pickagain')selectScreen();
  else if(a==='title')titleScreen();
  else if(a==='next')chapterIntro(chapter+1);
  else if(a==='chap')chapterIntro(+b.dataset.n);
});

/* ============ Layout ============ */
function layout(){
  const app=$('#app'),vw=app.clientWidth,vh=app.clientHeight;
  const padOn=!$('#pad').hidden,portrait=vh>vw;
  let availH=vh,top=0;
  const intro=mode==='intro';
  if(padOn&&portrait){availH=vh-210;}
  if(intro)availH=vh-(portrait?200:150);
  let s=Math.min(vw/SW,availH/SH);
  if(!touchMode&&s>=2)s=Math.floor(s);
  const w=Math.round(SW*s),h=Math.round(SH*s);
  top=intro?Math.max(8,Math.round((availH-h)/2)):padOn&&portrait?Math.min(Math.max(48,Math.round((availH-h)*.3)),Math.max(48,availH-h)):Math.round((vh-h)/2);
  cv.style.width=w+'px';cv.style.height=h+'px';cv.style.left=Math.round((vw-w)/2)+'px';cv.style.top=top+'px';
  const cap=$('#cap');
  if(!cap.hidden){cap.style.left=Math.round((vw-w)/2)+'px';cap.style.width=w+'px';
    cap.style.top=(top+h)+'px';cap.style.bottom='';}
}
addEventListener('resize',layout);

