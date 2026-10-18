'use strict';
/* ============ Fraquezas da série e especialistas ============ */
// classe de cada criatura
const CLS={v:'ghost',g:'ghost',woman:'ghost',vp:'vamp',luther:'vamp',dm:'demon',ac:'demon',meg:'demon',azazel:'demon',pride:'demon',alastair:'demon',abaddon:'demon',lilith:'demon',lilith2:'demon',hh:'hound',an:'angel',hm:'human',jake:'human',ava:'human',dk:'dark'};
// quanto cada tipo de arma fere cada classe ('_' vale para o resto)
const WEAKNESS={
  ghost:{salt:2,iron:1.8,smite:1.3,psychic:1,holy:1,_:.6},          // sal e ferro dispersam espíritos
  vamp:{machete:2,blade:1.8,smite:1.8,rubyknife:1.2,psychic:.9,_:.6}, // decapitação; a luz de anjo queima por dentro
  demon:{rubyknife:2.2,blade:1.8,holy:2,smite:1.8,psychic:1.5,salt:1.2,_:.7}, // faca da Ruby, lâmina, água benta, exorcismo
  hound:{rubyknife:2,blade:2,smite:1.5,_:.4},                         // só a faca da Ruby e a lâmina matam
  angel:{blade:2,_:.5},                                               // só a lâmina angelical mata um anjo
  human:{_:1},dark:{smite:1.6,holy:1.2,_:1},
};
// especialistas: dano extra contra a criatura que cada um caça melhor na série
const SPECIAL={dean:{ghost:1.3},ellen:{ghost:1.2},jo:{ghost:1.2},john:{vamp:1.35},bobby:{demon:1.35},sam:{demon:1.25},cas:{demon:1.2,angel:1.25,vamp:1.2},ruby:{demon:1.2,hound:1.25},jack:{angel:1.2,demon:1.2}};
const CLASSINFO={
  ghost:{nome:'FANTASMAS',quem:'Dean, Ellen e Jo',diario:'Sal e ferro dispersam qualquer espírito. Para acabar de vez, é preciso salgar e queimar os ossos. Armas comuns quase não fazem efeito.'},
  vamp:{nome:'VAMPIROS',quem:'John',diario:'Regeneram qualquer ferimento, menos a cabeça cortada: facão e lâminas são o caminho. Sangue de homem morto enfraquece e corta a regeneração. A luz de um anjo os queima por dentro.'},
  demon:{nome:'DEMÔNIOS',quem:'Bobby e Sam',diario:'Água benta queima, sal repele, a Armadilha do Diabo prende e o exorcismo expulsa. Só a faca da Ruby e a lâmina angelical matam de vez.'},
  hound:{nome:'CÃES DO INFERNO',quem:'Ruby e Castiel',diario:'Invisíveis para quem não tem óculos queimados em fogo sagrado. Armas comuns não os matam: só a faca da Ruby e a lâmina angelical. Não atacam o Rei do Inferno.'},
  angel:{nome:'ANJOS',quem:'Castiel',diario:'Só a lâmina angelical mata um anjo. O selo de banimento, desenhado com sangue, manda o anjo para longe.'},
  human:{nome:'GENTE COMUM',quem:'qualquer caçador',diario:'Às vezes o monstro é humano, e às vezes nem monstro é. Derrube sem matar.'},
  dark:{nome:'CONTAMINADOS',quem:'Castiel e Jack',diario:'Gente que respirou a névoa da Escuridão e perdeu a alma. A graça de um anjo funciona melhor neles.'},
};
function weakMult(b,tag){
  const cl=CLS[b.type];if(!cl)return 1;
  const W=WEAKNESS[cl];let m=W[tag]!=null?W[tag]:W._;
  const S=SPECIAL[hero];if(S&&S[cl])m=Math.max(m,1)*S[cl];
  if(b.isBoss&&m<1)m=Math.max(.8,1+(m-1)*.5); // chefes resistem só pela metade: ninguém fica preso numa luta sem fim // o especialista nunca resiste à criatura que caça
  return m;
}
// avisa o jogador quando o golpe acerta uma fraqueza ou quando a criatura resiste
function weakFeedback(b,m){
  const now=performance.now();if(b.fbT&&now-b.fbT<1100)return;
  if(m>=1.5){b.fbT=now;floatMsg('FRAQUEZA!',b.x,b.y);}
  else if(m<=.65){b.fbT=now;floatMsg('RESISTE',b.x,b.y);}
}
// o diário do John: criaturas encontradas
let diario={};
try{diario=JSON.parse(localStorage.getItem('winchester-diario')||'{}')||{};}catch(e){}
function noteCreature(type){const cl=CLS[type];if(!cl||diario[cl])return;diario[cl]=1;try{localStorage.setItem('winchester-diario',JSON.stringify(diario));}catch(e){}}
// criatura mais comum de uma fase
function mainClass(n){const k={};for(const z of CHAPTERS[n].zones)for(const w of z.waves||[])for(const t of w){const c=CLS[t];if(c)k[c]=(k[c]||0)+1;}let best=null;for(const c in k)if(!best||k[c]>k[best])best=c;return best;}
function weakTip(n){const cl=mainClass(n);if(!cl)return '';const I=CLASSINFO[cl];return `<b>${pf(I.nome)}:</b> ${I.diario} <b>Especialista:</b> ${I.quem}.`;}
function specialTag(id,n){const cl=mainClass(n),S=SPECIAL[id];return cl&&S&&S[cl]?`<span class="tag spec">ESPECIALISTA EM <span>${pf(CLASSINFO[cl].nome)}</span></span>`:'';}
function diaryScreen(){
  mode='controls';layers=getLayers(1);
  const rows=Object.keys(CLASSINFO).map(cl=>{const I=CLASSINFO[cl];return diario[cl]?`<dt>${pf(I.nome)}</dt><dd>${I.diario} <b>Melhor caçador:</b> ${I.quem}.</dd>`:`<dt>???</dt><dd>Você ainda não encontrou esta criatura.</dd>`;}).join('');
  show(`<div class="box"><p class="eyebrow">O DIARIO DO JOHN</p><h2>Como matar o que caça a gente</h2><dl class="keys">${rows}</dl>
    <p class="fine">Qualquer caçador fere qualquer criatura, mas cada uma tem suas fraquezas, como na série. Na tela, FRAQUEZA mostra um golpe certeiro, e RESISTE mostra que a arma não é a melhor.</p>
    <div class="row"><button class="btn go" data-act="title" type="button">◀ VOLTAR</button></div></div>`);
}
