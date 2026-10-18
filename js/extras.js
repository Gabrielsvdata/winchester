'use strict';
/* ============ Trilha de cada capítulo ============ */
// melodia a partir dos acordes: cada número do padrão é uma nota do acorde (-1 = pausa)
function mkLead(chords,pat,oct){const out=[];for(let b=0;b<4;b++)for(let i=0;i<8;i++){const k=pat[(b*8+i)%pat.length];out.push(k<0?0:chords[b][k%3]+(oct||12)+(k>2?12:0));}return out;}
const C4=(a,b,c,d)=>[a,b,c,d];
function songDef(bpm,ch,bass,pat,oct){return{bpm,chords:ch,bass,lead:pat?mkLead(ch,pat,oct):null};}
Object.assign(SONGS,{
  // cap. 2: O Portão do Diabo, ré menor e arrastado
  s2:songDef(120,C4([50,53,57],[46,50,53],[48,52,55],[45,49,52]),[38,38,50,38,34,34,46,34,36,36,48,36,33,33,45,37],[0,-1,1,-1,2,1,-1,0]),
  // cap. 3: Um Ano, o relógio correndo
  s3:songDef(140,C4([52,55,59],[48,52,55],[50,54,57],[47,51,54]),[40,40,52,40,36,36,48,36,38,38,50,38,35,35,47,39],[2,0,2,0,2,0,1,-1]),
  // cap. 4: Os Selos, mais lento e celestial
  s4:songDef(108,C4([52,55,59],[55,59,62],[50,54,57],[48,52,55]),[40,47,52,47,43,50,55,50,38,45,50,45,36,43,48,43],[2,-1,-1,-1,1,-1,0,-1],24),
  // cap. 5: A Jaula, o Apocalipse
  s5:songDef(132,C4([48,51,55],[44,48,51],[46,50,53],[43,47,50]),[36,36,48,36,32,32,44,32,34,34,46,34,31,31,43,35],[0,1,2,3,2,1,0,-1]),
  // cap. 6: A Marca de Caim, agressivo
  s6:songDef(150,C4([54,57,61],[50,54,57],[52,56,59],[49,53,56]),[42,42,54,42,38,38,50,38,40,40,52,40,37,37,49,41],[0,0,2,-1,1,1,3,-1]),
  // cap. 7: A Escuridão, estranho e lento
  s7:songDef(112,C4([47,50,54],[43,47,50],[52,55,59],[54,58,61]),[35,35,47,35,31,31,43,31,40,40,52,40,42,42,54,42],[0,-1,2,-1,-1,1,-1,-1]),
  // cap. 8: O Autor, heroico
  s8:songDef(136,C4([50,54,57],[45,49,52],[47,50,54],[43,47,50]),[38,38,50,38,33,33,45,33,35,35,47,35,31,31,43,31],[0,1,2,3,2,1,2,-1]),
  // chefes grandes: Lúcifer, Amara e Chuck
  boss2:songDef(160,C4([52,55,59],[53,57,60],[52,55,59],[50,54,57]),[40,40,52,40,41,41,53,41,40,40,52,40,38,38,50,38],[2,1,0,1,2,3,2,-1]),
  // os finais
  fim:songDef(96,C4([48,52,55],[43,47,50],[45,48,52],[41,45,48]),[36,43,48,43,31,38,43,38,33,40,45,40,29,36,41,36],[2,-1,1,-1,0,-1,1,-1],24),
});
function stageSong(){const a=arcOf(chapter);return a>1&&SONGS['s'+a]?'s'+a:'stage';}
function bossSong(){return boss&&['lucifer','amara','chuck','azazel'].includes(boss.type)?'boss2':'boss';}

/* ============ Falas dos personagens ============ */
const QUIPS={
  dean:{start:['Salvar pessoas, caçar coisas.','Hora do negócio da família.','Depois disso, torta.'],magic:['Prova o sal, desgraçado!','Filho da mãe!'],win:['Ninguém mexe com a família.','Fácil. Agora, torta.']},
  sam:{start:['Vamos acabar logo com isso.','Dean, cuidado.'],magic:['Sai daqui!','Chega!'],win:['A gente conseguiu, Dean.']},
  john:{start:['Cuide do seu irmão.','Fiquem atrás de mim.'],magic:['Pra trás!'],win:['Bom trabalho, meninos.']},
  bobby:{start:['Idjits!','Família não termina no sangue.'],magic:['Fica aí dentro, demônio!'],win:['Idjits. Mas meus idjits.']},
  cas:{start:['Eu sou um anjo do Senhor.','Olá, Dean.'],magic:['Eu vou te punir.'],win:['A vontade de Deus foi feita.']},
  ruby:{start:['Vocês precisam de mim.','Confia em mim, Sam.'],magic:['Sumindo!'],win:['De nada.']},
  crowley:{start:['Olá, rapazes.','Eu sou o Rei do Inferno.'],magic:['Assina aqui, querido.'],win:['Os negócios estão ótimos.']},
  jack:{start:['Eu sou o Jack.','Eu escolho ser bom.'],magic:['Eu protejo a minha família!'],win:['Eles são a minha família.']},
  ellen:{start:['A Roadhouse está fechada.','Jo, fica perto.'],magic:['Sal neles!'],win:['Bebida por conta da casa.']},
  jo:{start:['Eu sei me virar.','Mãe, eu consigo.'],magic:['Toma!'],win:['Viu? Eu disse.']},
};
const BOSS_QUIPS={woman:'Você nunca vai voltar pra casa.',luther:'Vocês mataram a minha família.',meg:'Olá, garotos.',jake:'Só um pode sobrar.',azazel:'Lembra de mim, Sammy?',pride:'Somos a natureza humana.',lilith:'Hora de ir, Dean.',alastair:'Senti sua falta, Dean.',lilith2:'Eu sou o último selo.',war:'Eu só dou o empurrão.',lucifer:'O Sam não está mais aqui.',abaddon:'O inferno é meu.',lucicas:'Este anjo é meu agora.',amara:'Olá, Dean.',chuck:'Eu sou o autor.'};
let bubbles=[];
function say(who,txt,dur){bubbles=bubbles.filter(b=>b.who!==who);bubbles.push({who,txt,t:dur||2.4});}
function quip(kind){const Q=QUIPS[hero];if(!Q||!Q[kind])return;const l=Q[kind];say(P,l[(Math.random()*l.length)|0]);}
function updBubbles(dt){for(const b of bubbles)b.t-=dt;bubbles=bubbles.filter(b=>b.t>0&&!(b.who.dead));}
function drawBubbles(cx){
  for(const b of bubbles){const e=b.who,s=tr(b.txt).toUpperCase(),w=Math.min(SW-8,s.length*6+10),x=Math.round(clamp(e.x-cx-w/2,4,SW-w-4)),y=Math.round(e.y-e.z-74);
    c.globalAlpha=Math.min(1,b.t*3);px(c,x,y,w,12,'rgba(244,240,232,.92)');px(c,Math.round(e.x-cx)-1,y+12,3,3,'rgba(244,240,232,.92)');
    text(s,x+w/2,y+3,'#1a1410',6,'center',false);}
  c.globalAlpha=1;
}

/* ============ Recordes e finais vistos ============ */
function loadJSON(k){try{return JSON.parse(localStorage.getItem(k)||'{}')||{};}catch(e){return{};}}
let records=loadJSON('winchester-recordes'),endingsSeen=loadJSON('winchester-finais');
function saveRecord(n,sc){if(sc>(records[n]||0)){records[n]=sc;try{localStorage.setItem('winchester-recordes',JSON.stringify(records));}catch(e){}return true;}return false;}
function markEnding(w){endingsSeen[w]=1;try{localStorage.setItem('winchester-finais',JSON.stringify(endingsSeen));}catch(e){}}
function endingsCount(){return(endingsSeen.A?1:0)+(endingsSeen.B?1:0);}

/* ============ Cenas no fim de algumas fases ============ */
CHAPTERS[7].outroScenes=[
  sc('NEW HARMONY · MEIA-NOITE','O relógio bate meia-noite. Os cães do inferno entram pela porta.',mkScene({stage:7,cx:700,chars:[['dean',150,1,'hurt'],['sam',100,1,'idle']],fx:['hounds']})),
  sc('O INFERNO','Dean acorda pendurado por correntes, no escuro. Ele grita o nome do irmão.',mkScene({void:'#2a0606',chars:[['dean',160,1,'hurt']],fx:['chains','hellfire']})),
];
CHAPTERS[9].outroScenes=[
  sc('CONVENTO DE SANTA MARIA','O sangue de Lilith desenha um círculo no chão. Ela era o último selo.',mkScene({stage:9,cx:1500,chars:[['sam',120,1],['ruby2',170,-1]],fx:['seal']})),
  sc('A JAULA SE ABRE','Uma luz branca explode do chão do convento. Lúcifer está livre.',mkScene({stage:9,cx:1500,chars:[['dean',100,1],['sam',130,1]],fx:['light','rise']})),
];
CHAPTERS[11].outroScenes=[
  sc('CEMITÉRIO DE STULL','Lúcifer vê o soldadinho no cinzeiro do Impala. Quem pisca é o Sam.',mkScene({stage:11,cx:1500,impala:[150,138],chars:[['sam',110,1,'hurt']],fx:['glow']})),
  sc('A JAULA','Sam abre a Jaula com os anéis e se joga lá dentro. Miguel cai junto, no corpo de Adam.',mkScene({stage:11,cx:1100,chars:[['sam',150,1,'air',0,34],['adam',190,-1,'air',0,30]],fx:['cage']})),
];
CHAPTERS[12].outroScenes=[
  sc('O BUNKER','No quarto, o corpo de Dean está deitado. Então os olhos dele se abrem.',mkScene({void:'#0c0808',chars:[['deanDemon',160,1]],fx:['blackeyes']})),
];
CHAPTERS[14].outroScenes=[
  sc('O PARQUE','Amara chama o irmão. Chuck aparece entre as árvores, e os dois se abraçam. O sol volta a brilhar.',mkScene({stage:14,cx:600,chars:[['amara',150,1],['chuck',172,-1],['dean',80,1]],fx:['sunback']})),
];
LOOKS.deanDemon=Object.assign({},LOOKS.deanMark,{eye:'#000'});
