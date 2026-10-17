'use strict';
/* ============ Estado ============ */
let mode='title',hero='dean';
let P=null,ents=[],props=[],items=[],projs=[],parts=[];
let cam={x:0,max:0},zoneIdx=0,zoneOn=false,waveIdx=0,spawnQ=[],spawnT=0;
let saltRings=[];
let amb=[],lastFoe=null,chain=0,chainT=0,beatT=0;
const FOE_NAME={v:'ESPÍRITO',g:'ESPÍRITO QUE GRITA',vp:'VAMPIRO',dm:'DEMÔNIO',ac:'ACHERI',ava:'AVA'};
let hitstop=0,shake=0,flash=0,banner=null,goT=0,score=0,boss=null,dimT=0,saltRain=0,endT=0;
function isSpirit(){return hero==='john'&&chapter===5;}
function heroFor(id){return id==='john'&&chapter===5?HEROES.johnSpirit:HEROES[id];}
function lookFor(id){return id==='john'&&chapter===5?LOOKS.johnSpirit:LOOKS[id];}
const HEROES={
  dean:{name:'DEAN',reach:[24,26,24],dmg:[7,8,13],spd:60,shootCd:2.6,magicName:'CÍRCULO DE SAL',gunName:'Espingarda de sal grosso',wName:'Pé de cabra de ferro',tag:'iron',stats:{forca:5,vel:3,tiro:5,magia:4}},
  sam:{name:'SAM',reach:[27,29,26],dmg:[6,7,12],spd:68,shootCd:1.8,magicName:'ONDA PSÍQUICA',gunName:'Pistola com bala de ferro',wName:'Atiçador de ferro',tag:'iron',stats:{forca:4,vel:5,tiro:3,magia:5}},
  john:{name:'JOHN',reach:[26,28,25],dmg:[8,8,14],spd:58,shootCd:2.2,magicName:'FACÃO GIRATÓRIO',gunName:'Rifle com bala de ferro',wName:'Facão',tag:'machete',stats:{forca:5,vel:3,tiro:4,magia:3}},
  bobby:{name:'BOBBY',reach:[24,26,24],dmg:[7,8,13],spd:55,shootCd:2,magicName:'ARMADILHA DO DIABO',gunName:'Frascos de água benta',wName:'Chave de roda',tag:'iron',stats:{forca:4,vel:2,tiro:4,magia:5}},
  johnSpirit:{name:'JOHN',reach:[25,27,25],dmg:[7,8,13],spd:62,shootCd:1.8,magicName:'FÚRIA POLTERGEIST',gunName:'Telecinese: arremessa destroços',wName:'Toque gelado',tag:'psychic',stats:{forca:4,vel:4,tiro:4,magia:4},
    note:'Espírito: golpes e balas causam metade do dano e às vezes o atravessam. Mas ele não come, sofre mais com ataques sobrenaturais e não segura armas: na hora do Colt, quem atira é o Dean.'},
  cas:{name:'CASTIEL',reach:[23,25,24],dmg:[9,9,15],spd:64,shootCd:2.4,magicName:'PUNIÇÃO DIVINA',gunName:'Teletransporte com asas',wName:'Lâmina angelical',tag:'blade',stats:{forca:5,vel:4,tiro:3,magia:5}},
};
let ZONES=[];
let traps=[];
const PROPS=[{x:250,y:160,drop:'salt'},{x:610,y:200,drop:'pie'},{x:960,y:162,drop:'salt'},{x:1290,y:205,drop:'burger'},{x:1440,y:165,drop:'salt'}];

function newEnt(kind,x,y){return{kind,x,y,z:0,vx:0,vy:0,vz:0,face:1,st:'idle',stT:0,t:Math.random()*5,ph:0,hp:1,maxHp:1,flash:0,inv:0,atkCd:rand(.8,1.6),vanCd:rand(5,9),dead:false,alpha:1,set:null};}
/* ============ Treino ============ */
let tut=null;
function tutDone(){try{return localStorage.getItem('winchester-treino')==='1';}catch(e){return false;}}
const TUT_STEPS=[
  {t:'ANDE',k:'SETAS OU WASD',m:'ANALÓGICO',d:'Ande para os lados e para cima e baixo.'},
  {t:'ATAQUE',k:'J',m:'ATACAR',d:'Golpeie com a arma do seu caçador.'},
  {t:'COMBO',k:'J J J',m:'ATACAR 3 VEZES',d:'Acertando, o terceiro golpe derruba.'},
  {t:'VOADORA',k:'K E DEPOIS J NO AR',m:'PULO E ATACAR NO AR',d:'Pule e ataque no ar: é a voadora.'},
  {t:'TIRO',k:'L',m:'TIRO',d:'Cada um tem seu tiro. Ele recarrega.'},
  {t:'MAGIA',k:'I',m:'MAGIA',d:'Usa os sacos de sal. Mais sal, mais força.'},
  {t:'ESPECIAL',k:'J + K JUNTOS',m:'ATACAR + PULO JUNTOS',d:'Gira e afasta todos. Custa um pouco de vida.'},
];
function startTut(){tut={step:0,move:0,presses:[],doneT:0};$('#skipTut').hidden=false;cam.max=0;}
function endTut(){tut=null;$('#skipTut').hidden=true;try{localStorage.setItem('winchester-treino','1');}catch(e){}cam.max=ZONES[0].x;banner={l1:'BOA CAÇADA!',l2:touchMode?'DICA: EMPURRE ATÉ O FIM = CORRER':'DICA: 2 TOQUES NO LADO = CORRER',t:3,small:true};}
function updTut(dt,inp){
  if(!tut)return;
  if(tut.doneT>0){tut.doneT-=dt;if(tut.doneT<=0){tut.step++;if(tut.step>=TUT_STEPS.length){endTut();}}return;}
  const p=P;let ok=false;
  switch(tut.step){
    case 0:tut.move+=(Math.abs(inp.x)+Math.abs(inp.y))*dt;ok=tut.move>1.2;break;
    case 1:ok=inp.atk;break;
    case 2:if(inp.atk){const now=performance.now();tut.presses.push(now);tut.presses=tut.presses.filter(x=>now-x<1300);}ok=tut.presses.length>=3;break;
    case 3:ok=p.st==='jump'&&p.jatk;break;
    case 4:ok=p.st==='shoot';break;
    case 5:ok=p.st==='magic';if(p.magic<1&&p.st!=='magic')p.magic=1;break;
    case 6:ok=p.st==='esc';if(p.hp<40)p.hp=40;break;
  }
  if(ok){tut.doneT=.8;sfx('pick');}
}
function drawTut(){
  if(!tut||(banner&&!banner.small))return;
  const st=TUT_STEPS[Math.min(tut.step,TUT_STEPS.length-1)],done=tut.doneT>0;
  px(c,20,40,280,46,'rgba(6,5,12,.86)');c.strokeStyle=done?'#9fe8ff':'#f2b632';c.lineWidth=1;c.strokeRect(20.5,40.5,279,45);
  text('TREINO '+(tut.step+1)+'/'+TUT_STEPS.length,28,46,'#9fb6c8',6,'left',false);
  text(done?'BOA!':st.t,292,46,done?'#9fe8ff':'#f2b632',6,'right',false);
  text((touchMode?st.m:st.k),160,57,'#efe8d6',8,'center');
  text(st.d,160,72,'#9fb6c8',6,'center',false);
}
function startGame(){
  const C=CHAPTERS[chapter];ZONES=C.zones;layers=getLayers(chapter);
  ents=[];props=[];items=[];projs=[];parts=[];saltRings=[];traps=[];score=0;boss=null;
  P=newEnt('player',60,186);P.hp=P.maxHp=100;P.lives=2;P.magic=1;P.shootCd=0;P.combo=0;P.comboT=0;P.queued=false;P.run=false;P.jatk=false;P.face=1;P.inv=1;
  P.buf={atk:0,jump:0,shoot:0,magic:0};P.hist=[];amb=[];lastFoe=null;chain=0;chainT=0;beatT=0;msgs.length=0;
  edge.atk=edge.jump=edge.shoot=edge.magic=0;
  cam.x=0;cam.max=ZONES[0].x;zoneIdx=0;zoneOn=false;waveIdx=0;spawnQ=[];goT=0;endT=0;
  tut=null;$('#skipTut').hidden=true;
  PROPS.forEach((p,i)=>{const e=newEnt('prop',p.x,p.y);e.hp=1;e.drop=C.drops[i]||p.drop;props.push(e);});
  banner={l1:'CAPÍTULO '+arcOf(chapter),l2:(ARCS[arcOf(chapter)].stages.length>1?'FASE '+phaseOf(chapter)+': ':'')+C.title,t:3};
  if(chapter===1&&!tutDone())startTut();
  mode='play';hideScreen();showPad();playSong('stage');
}

/* ============ Capítulos ============ */
let chapter=1,progress=1;
try{progress=Math.max(1,Math.min(5,parseInt(localStorage.getItem('winchester-progresso'),10)||1));}catch(e){}
function saveProgress(n){progress=Math.max(progress,Math.min(CHAPTERS.length-1,n));try{localStorage.setItem('winchester-progresso',String(progress));}catch(e){}}
const BOSS_ZONE={x:STAGE_W-SW,boss:true};
// Capítulos (um por temporada) e suas fases. 'chapter' guarda o número da fase.
const ARCS=[null,
  {title:'O NEGÓCIO DA FAMÍLIA',season:'TEMPORADA 1',stages:[1,2,3]},
  {title:'O PORTÃO DO DIABO',season:'TEMPORADA 2',stages:[4,5],
    intro:'John está morto. O pacto que ele fez com o Olho Amarelo trouxe Dean de volta, e os irmãos passam o ano caçando sem o pai, com a ajuda de Bobby e de Ellen, dona da Roadhouse. Até que o demônio dá o próximo passo do plano dele.'},
];
const arcOf=n=>ARCS.findIndex(a=>a&&a.stages.includes(n));
const phaseOf=n=>ARCS[arcOf(n)].stages.indexOf(n)+1;
const phaseLabel=n=>ARCS[arcOf(n)].stages.length>1?`CAPITULO ${arcOf(n)} · FASE ${phaseOf(n)}`:`CAPITULO ${arcOf(n)}`;
const CHAPTERS=[null,
  {title:'A MULHER DE BRANCO',place:'JERICHO, CALIFÓRNIA',heroes:['dean','sam'],boss:'woman',
    zones:[{x:80,waves:[['v','v']]},{x:400,waves:[['v','g','v'],['v','v']]},{x:770,waves:[['v','v','v'],['g','v','g']]},{x:1120,waves:[['v','g','v','v'],['g','v','v']]},BOSS_ZONE],
    drops:['salt','pie','salt','burger','salt'],
    hint:'Ferro e sal espantam espíritos: a arma dos dois é de ferro. Dean bate mais forte, Sam é mais rápido.',
    over:'Dica: pule as ondas de grito e guarde a magia para quando estiver cercado.',
    outro:{h:'Ela volta para casa',t:'Sam acelera o Impala porta adentro da velha casa. Lá dentro, os filhos de Constance Welch esperam pela mãe. Os três somem no assoalho, e a Mulher de Branco nunca mais aparece na estrada de Jericho.'}},
  {title:'SANGUE DE MORTO',place:'MANNING, COLORADO',heroes:['dean','sam','john'],boss:'luther',
    newcomers:[{id:'john',label:'JOHN WINCHESTER',why:'Depois de meses sumido, John reaparece em Manning. Ele caçava o demônio sozinho, mas para tirar o Colt do ninho precisa dos filhos. Pela primeira vez em anos, os três caçam juntos.'}],
    zones:[{x:80,waves:[['vp','vp']]},{x:400,waves:[['vp','vp','vp'],['vp','vp']]},{x:770,waves:[['vp','vp','vp'],['vp','vp','vp','vp']]},{x:1120,waves:[['vp','vp','vp','vp'],['vp','vp','vp']]},BOSS_ZONE],
    drops:['salt','burger','salt','pie','salt'],
    intro:'Os irmãos finalmente reencontram John. Ele está atrás de uma arma de lenda: o Colt, revólver feito por Samuel Colt em 1835, capaz de matar quase qualquer coisa. Um ninho de vampiros roubou a arma. Para recuperá-la, os três Winchester vão caçar juntos.',
    tip:'Novo caçador: JOHN. Vampiros são rápidos e dão bote em linha reta. Lâminas e o facão do John cortam mais fundo neles.',
    hint:'John entra na equipe com facão e rifle. Lâminas causam mais dano nos vampiros.',
    over:'Dica: os vampiros avisam antes do bote. Saia da linha deles andando para cima ou para baixo.',
    outro:{h:'O Colt',t:'Luther cai, e o Colt volta para as mãos dos Winchester. Pela primeira vez em vinte e dois anos, John tem uma arma capaz de matar o demônio que levou Mary. Agora precisa achá-lo antes que ele ache os filhos.'}},
  {title:'OLHOS NEGROS',place:'FERRO-VELHO DO BOBBY, DAKOTA DO SUL',heroes:['dean','sam','john','bobby'],boss:'meg',
    newcomers:[{id:'bobby',label:'BOBBY SINGER',why:'Velho amigo de John, Bobby abre as portas do ferro-velho para os irmãos. Ninguém entende mais de demônios: a casa dele tem livros de exorcismo, sal, água benta e uma Armadilha do Diabo pintada no teto.'}],
    zones:[{x:80,waves:[['dm','dm']]},{x:400,waves:[['dm','dm','dm'],['dm','vp']]},{x:770,waves:[['dm','dm','vp'],['dm','dm','dm']]},{x:1120,waves:[['dm','dm','dm','vp'],['dm','dm','dm']]},BOSS_ZONE],
    drops:['salt','salt','pie','salt','burger'],
    intro:'Os demônios querem o Colt de volta. Meg, que serve ao Olho Amarelo, sequestra John e cerca os irmãos com uma legião de olhos negros. A saída é procurar Bobby Singer, velho amigo do pai, no ferro-velho dele em Dakota do Sul.',
    tip:'Novo caçador: BOBBY. Água benta e a Armadilha do Diabo são as armas mais fortes contra demônios.',
    hint:'Bobby entra na equipe. Água benta é mortal para demônios, e a armadilha dele os prende no lugar.',
    over:'Dica: a Armadilha do Diabo do Bobby prende os demônios no lugar. Use antes de cercarem você.',
    outro:{h:'O pacto',t:'Meg é exorcizada, e os irmãos resgatam John. Mas o Olho Amarelo possui o pai, e Sam atira na perna dele com o Colt para salvá-lo. O demônio escapa. Na estrada, um caminhão guiado por outro demônio atinge o Impala. Dean fica entre a vida e a morte, e John chama o Olho Amarelo para um pacto: a própria alma e o Colt pela vida do filho. Dean acorda no hospital. John não.'}},
  {title:'COLD OAK',place:'CIDADE FANTASMA, DAKOTA DO SUL',heroes:['sam','dean','bobby'],boss:'jake',
    zones:[{x:80,waves:[['ac','ac']]},{x:400,waves:[['ac','ac','ac'],['ac','dm']]},{x:770,waves:[['ava','ac'],['ac','ac','dm']]},{x:1120,waves:[['ac','dm','ac','ac'],['dm','ac','dm']]},BOSS_ZONE],
    drops:['salt','burger','salt','pie','salt'],
    intro:'Sam some de uma lanchonete enquanto Dean busca a comida, e acorda numa cidade fantasma em Dakota do Sul. Ele não está sozinho: o Olho Amarelo juntou ali as crianças especiais, os jovens que visitou quando eram bebês, para lutarem até sobrar um. Ava, sumida há meses, aprendeu a controlar demônios. Jake, um soldado, ganhou força sobre-humana. Dean e Bobby correm para achar Sam antes que seja tarde.',
    tip:'Os Acheri são demônios com cara de criança: somem e aparecem atrás de você. Ava controla todos eles. Jake tem força sobre-humana: quando ele levantar os braços, pule a onda de choque.',
    hint:'A primeira caçada sem o John. Água benta funciona nos Acheri, e a Armadilha do Diabo do Bobby prende eles.',
    over:'Dica: quando Jake levanta os braços, ele vai socar o chão. Pule a onda de choque.',
    outro:{h:'Cold Oak',t:'Jake cai, e Sam decide poupar a vida dele. Dean e Bobby chegam à rua principal e veem Sam de longe. Então Jake se levanta e crava uma faca nas costas de Sam. Sam morre nos braços do irmão, enquanto Jake some na noite como o último que sobrou.'}},
  {title:'O PORTÃO DO DIABO',place:'CEMITÉRIO ABANDONADO, WYOMING',heroes:['dean','sam','bobby','john'],boss:'azazel',
    newcomers:[{id:'john',label:'O ESPÍRITO DE JOHN',why:'Com o portão aberto, não são só demônios que escapam do inferno: almas também. Uma delas é a de John, que vem lutar ao lado dos filhos uma última vez. Como espírito, ele sente menos os golpes e às vezes é atravessado por eles. Mas não come, sofre mais com ataques sobrenaturais e não consegue segurar armas.'}],
    zones:[{x:80,waves:[['dm','dm','dm']]},{x:400,waves:[['dm','vp','dm'],['v','dm','dm']]},{x:770,waves:[['dm','dm','dm','vp'],['dm','g','dm']]},{x:1120,waves:[['dm','dm','vp','vp'],['dm','dm','dm','dm']]},BOSS_ZONE],
    drops:['salt','pie','salt','salt','burger'],
    intro:'Dean não aceita perder o irmão. Vai até uma encruzilhada e faz um pacto: Sam volta à vida, e ele ganha só um ano antes de ir para o inferno. Em Wyoming, Jake usa o Colt para abrir o Portão do Diabo, num cemitério cercado por uma linha de ferro feita por Samuel Colt. Centenas de demônios escapam.',
    tip:'Azazel não sente dano comum: seus golpes só quebram o controle dele. Quando a barra zerar, o espírito do John segura o demônio. Aí aperte TIRO para atirar com o Colt.',
    hint:'Batalha final da temporada 2. O espírito do John joga com regras próprias: leia a ficha dele antes de escolher.',
    over:'Dica: quando Azazel aponta, um círculo amarelo aparece no chão. Saia dele antes que feche.',
    outro:{h:'Os olhos se apagam',t:'Um tiro do Colt, e o Olho Amarelo cai. O espírito de John olha para os filhos e some numa luz, finalmente em paz. Bobby e Ellen conseguem fechar o portão, mas centenas de demônios já escaparam. E o relógio do Dean começou a correr: um ano.'}},
];
function heroCards(C){
  const isNew=id=>(C.newcomers||[]).some(n=>n.id===id);
  return C.heroes.map(id=>{const H=heroFor(id),st=H.stats,nw=isNew(id);
    const nm=id==='john'&&chapter===5?'JOHN (ESPÍRITO)':H.name;
    return`<button class="card${nw?' isnew':''}" data-act="pick" data-id="${id}" type="button"><canvas width="72" height="72" data-pv="${id}"></canvas><div class="info">${nw?'<span class="tag">NOVO</span>':''}<div class="nm">${nm}</div>
    <div class="stat">Força <i style="--v:${st.forca}"></i></div><div class="stat">Velocidade <i style="--v:${st.vel}"></i></div><div class="stat">Tiro <i style="--v:${st.tiro}"></i></div><div class="stat">Magia <i style="--v:${st.magia}"></i></div>
    <div class="ln">Arma: <b>${H.wName}</b></div><div class="ln">Tiro: <b>${H.gunName}</b></div><div class="ln">Magia: <b>${H.magicName.toLowerCase().replace(/^./,m=>m.toUpperCase())}</b></div>${H.note?`<div class="ln">${H.note}</div>`:''}</div></button>`;}).join('');
}
function paintPortraits(){
  document.querySelectorAll('[data-pv]').forEach(cv2=>{const g=cv2.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,72,72);
    drawPuppet(bg,lookFor(cv2.dataset.pv),{lean:0,crouch:0,fl:[.3,.1],bl:[-.3,.1],fa:[.5,.9],ba:[-.3,.4]});
    silhouette(sg,cv2.dataset.pv==='john'&&chapter===5?'#9fd8ff':'#07060d');for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]])g.drawImage(sil,dx,dy);g.drawImage(buf,0,0);});
}
function chapterIntro(n){
  chapter=n;layers=getLayers(n);
  if(n===1){startIntro();return;}
  const C=CHAPTERS[n];mode='select';$('#cap').hidden=true;showPad();
  if(!C.heroes.includes(hero))hero=C.heroes[0];
  const nc=(C.newcomers||[]).map(k=>`<div class="newhero"><canvas width="72" height="72" data-pv="${k.id}"></canvas><div class="nh"><span class="tag">ENTRA NA EQUIPE</span><span class="nm">${k.label}</span><p>${k.why}</p></div></div>`).join('');
  const A=ARCS[arcOf(n)],first=phaseOf(n)===1;
  show(`<div class="box">${first?`<p class="eyebrow">CAPITULO ${arcOf(n)} · ${A.season}</p><h2>${A.title}</h2>${A.intro?`<p class="txt">${A.intro}</p>`:''}`:''}<p class="eyebrow">${A.stages.length>1?'FASE '+phaseOf(n)+' · ':''}${C.title}</p><h2>${C.place}</h2><p class="txt" id="tw"></p>${nc}<p class="sub">${C.tip}</p>
    <p class="eyebrow">ESCOLHA SEU CAÇADOR</p><div class="pick">${heroCards(C)}</div><p class="fine">${C.hint}</p></div>`);
  typeText($('#tw'),C.intro);
  paintPortraits();
}
function chaptersScreen(){
  mode='controls';layers=getLayers(1);
  const b=[];
  for(let a=1;a<ARCS.length;a++){const A=ARCS[a],open=A.stages.filter(i=>i<=progress);if(!open.length)continue;
    b.push(`<p class="eyebrow">CAPITULO ${a} · ${A.season} · ${A.title}</p>`);
    for(const i of open)b.push(`<button class="btn${i===progress?' go':''}" data-act="chap" data-n="${i}" type="button">${A.stages.length>1?'Fase '+phaseOf(i)+': ':''}${CHAPTERS[i].title}</button>`);}
  show(`<div class="box"><p class="eyebrow">CAPITULOS E FASES LIBERADOS</p><div class="row" style="flex-direction:column;align-items:stretch">${b.join('')}</div><div class="row"><button class="btn" data-act="title" type="button">◀ VOLTAR</button></div></div>`);
}

