'use strict';
/* ============ Áudio ============ */
let AC=null,muted=false,musicOn=true;
function audioOn(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();}
let master=null;
function out(){if(!master){master=AC.createGain();master.gain.value=.7;master.connect(AC.destination);}return master;}
function tone(f,d,type,v,f2,at){if(!AC||muted)return;const t=at||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.06,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(out());o.start(t);o.stop(t+d+.02);}
let nb=null;
function noise(d,v,fq,at){if(!AC||muted)return;if(!nb){nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}const t=at||AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb;f.type='lowpass';f.frequency.value=fq||1500;g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(out());s.start(t);s.stop(t+d+.02);}
function sfx(n){switch(n){
  case 'swing':noise(.07,.08,3000);break;
  case 'hit':noise(.08,.28,900);tone(110,.08,'square',.07,60);break;
  case 'heavy':noise(.14,.4,700);tone(80,.14,'square',.1,40);break;
  case 'jump':tone(220,.12,'square',.04,440);break;
  case 'land':noise(.05,.12,400);break;
  case 'shotgun':noise(.3,.45,1400);tone(70,.2,'sine',.15,35);break;
  case 'pistol':noise(.07,.22,2600);break;
  case 'scream':tone(900,.5,'sawtooth',.05,1500);tone(940,.5,'sawtooth',.04,1400);break;
  case 'vanish':tone(600,.25,'sine',.05,150);break;
  case 'magic':tone(300,.8,'triangle',.1,1200);noise(.8,.15,5000);break;
  case 'salt':noise(.9,.25,7000);tone(180,.6,'triangle',.08,90);break;
  case 'break':noise(.18,.3,2000);tone(300,.1,'square',.05,100);break;
  case 'pick':tone(660,.07,'square',.05);tone(990,.1,'square',.05,null,AC&&AC.currentTime+.07);break;
  case 'hurt':tone(160,.18,'sawtooth',.08,70);break;
  case 'die':tone(400,.6,'square',.07,50);break;
  case 'dissolve':tone(500,.4,'triangle',.05,1600);break;
  case 'rifle':noise(.18,.38,1800);tone(120,.12,'square',.07,50);break;
  case 'glass':noise(.22,.3,6000);tone(1400,.08,'sine',.04,700);break;
  case 'wings':noise(.3,.15,900);tone(800,.3,'sine',.03,1600);break;
  case 'colt':noise(.6,.5,1200);tone(60,.5,'sine',.25,30);break;
  case 'smoke':noise(.35,.18,500);break;
  case 'hiss':noise(.25,.12,3000);break;
  case 'fire':noise(.4,.2,1500);tone(200,.3,'sawtooth',.04,80);break;
  case 'poof':noise(.3,.2,700);break;
  case 'boss':tone(80,.9,'sawtooth',.08,40);break;
  case 'beat':tone(62,.09,'sine',.22,40);tone(58,.09,'sine',.18,38,AC&&AC.currentTime+.16);break;
}}
// trilha chiptune
const N=n=>440*Math.pow(2,(n-69)/12);
const SONGS={
  stage:{bpm:128,chords:[[57,60,64],[53,57,60],[55,59,62],[52,56,59]],bass:[45,45,57,45,43,43,55,43,41,41,53,41,40,40,52,44]},
  title:{bpm:138,custom:(st,at,sp)=>titleStep(st,at,sp)},
  boss:{bpm:150,chords:[[50,53,57],[46,50,53],[43,46,50],[45,49,52]],bass:[38,38,50,38,34,34,46,34,31,31,43,31,33,33,45,37]},
};
// ---- Tema de abertura (composição original, estilo 8/16 bits)
const PW={};
function pulseWave(d){if(PW[d])return PW[d];const n=32,re=new Float32Array(n),im=new Float32Array(n);for(let i=1;i<n;i++)re[i]=2/(i*Math.PI)*Math.sin(i*Math.PI*d);return PW[d]=AC.createPeriodicWave(re,im);}
function voice(f,d,wave,v,at,vib){
  const o=AC.createOscillator(),g=AC.createGain();
  if(typeof wave==='number')o.setPeriodicWave(pulseWave(wave));else o.type=wave;
  o.frequency.setValueAtTime(f,at);
  g.gain.setValueAtTime(v,at);g.gain.setValueAtTime(v,at+d*.75);g.gain.exponentialRampToValueAtTime(.0001,at+d);
  if(vib){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=5.6;lg.gain.setValueAtTime(0,at);lg.gain.linearRampToValueAtTime(f*.014,at+Math.min(d*.6,.4));l.connect(lg).connect(o.frequency);l.start(at);l.stop(at+d+.02);}
  o.connect(g).connect(out());o.start(at);o.stop(at+d+.02);
}
function drumNoise(d,v,type,fq,at){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();if(!nb){nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}s.buffer=nb;f.type=type;f.frequency.value=fq;g.gain.setValueAtTime(v,at);g.gain.exponentialRampToValueAtTime(.0001,at+d);s.connect(f).connect(g).connect(out());s.start(at,Math.random()*.5);s.stop(at+d+.02);}
function kick(at){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(160,at);o.frequency.exponentialRampToValueAtTime(42,at+.12);g.gain.setValueAtTime(.38,at);g.gain.exponentialRampToValueAtTime(.001,at+.16);o.connect(g).connect(out());o.start(at);o.stop(at+.18);}
function snare(at){drumNoise(.13,.2,'bandpass',2600,at);voice(190,.07,'triangle',.06,at);}
function hat(at,v){drumNoise(.035,v,'highpass',7500,at);}
function crash(at){drumNoise(1.1,.13,'highpass',5000,at);}
function stab(notes,d,at,v){for(const n of notes)voice(N(n),d,.25,v||.035,at);}
// tema em loop: Mi menor, 8 compassos
const T_ROOT=[40,40,36,38,40,40,36,35];
const T_CH=[[52,55,59],[52,55,59],[48,52,55],[50,54,57],[52,55,59],[52,55,59],[48,52,55],[47,51,54]];
const T_LEAD=[
  [76,-1,71,-1,76,79,78,-1],
  [76,-1,-1,-1,74,-1,71,-1],
  [72,-1,76,-1,79,-1,81,79],
  [78,-1,74,-1,78,-1,81,-1],
  [83,-1,-1,81,79,-1,78,-1],
  [79,-1,78,76,74,-1,71,-1],
  [72,-1,74,-1,76,-1,79,-1],
  [78,-1,-1,-1,75,-1,71,-1],
];
function titleStep(st,at,sp){
  if(st<32){
    // abertura: acordes de impacto, virada e escalada
    if(st===0){crash(at);kick(at);stab([40,47,52,59],sp*5,at,.04);voice(N(28),sp*6,'triangle',.16,at);}
    if(st===6){kick(at);stab([40,47,52,59],sp*2,at,.035);}
    if(st===8){kick(at);stab([43,50,55,62],sp*4,at,.035);voice(N(31),sp*4,'triangle',.16,at);}
    if(st===12){stab([45,52,57,64],sp*4,at,.04);voice(N(33),sp*4,'triangle',.16,at);}
    if(st>=12&&st<16)snare(at);
    const run=[64,67,71,76,79,83,88];
    if(st>=16&&st<23)voice(N(run[st-16]),sp*1.2,.25,.04,at);
    if(st===16){kick(at);crash(at);voice(N(28),sp*16,'triangle',.15,at);}
    if(st===23){voice(N(88),sp*7,.25,.045,at,true);voice(N(76),sp*7,.5,.018,at,true);}
    if(st===24)kick(at);
    if(st>=28)snare(at);
    return;
  }
  const s=(st-32)%128,bar=s>>4,q=s&15;
  if(s===0)crash(at);
  if(q===0||q===8||q===10)kick(at);
  if(q===4||q===12)snare(at);
  if(q%2===0)hat(at,q%4===2?.05:.03);
  if(q%2===0){const r=T_ROOT[bar];voice(N(q===6||q===14?r+12:r),sp*1.7,'triangle',.13,at);}
  const ch=T_CH[bar];voice(N(ch[q%3]+12),sp*.8,.125,.012,at);
  if(q%2===0){const L=T_LEAD[bar],i=q>>1,n=L[i];if(n>0){let len=1;while(i+len<8&&L[i+len]===-1)len++;const d=sp*2*len*.95;
    voice(N(n),d,.25,.04,at,len>1);voice(N(n-12),d,.5,.014,at+sp*.5,len>1);}}
}
let song=null,step=0,nextT=0,musicTimer=null;
// Faixa de abertura em arquivo: se audio/abertura.mp3 existir ao lado do jogo, ela substitui a trilha sintetizada
let titleTrack=null;
try{fetch('audio/abertura.mp3',{method:'HEAD'}).then(r=>{if(r.ok&&/audio/.test(r.headers.get('content-type')||'')){titleTrack=new Audio('audio/abertura.mp3');titleTrack.loop=true;titleTrack.volume=.75;if(song===SONGS.title)playSong('title');}}).catch(()=>{});}catch(e){}
const TITLE_MODES=['title','intro','select','controls'];
function playTrack(){if(!titleTrack||muted)return;if(titleTrack.paused){titleTrack.play().catch(()=>{});}}
function playSong(name){
  if(titleTrack&&name==='title'){song=null;playTrack();return;}
  if(titleTrack)titleTrack.pause();
  song=SONGS[name];step=0;if(AC)nextT=AC.currentTime+.05;if(!musicTimer)musicTimer=setInterval(sched,25);}
function stopSong(){song=null;if(titleTrack)titleTrack.pause();}
function sched(){
  if(!AC||!song||muted||!musicOn)return;
  if(nextT<AC.currentTime)nextT=AC.currentTime+.02;
  const sp=60/song.bpm/4;
  while(nextT<AC.currentTime+.12){
    if(song.custom){song.custom(step,nextT,60/song.bpm/4);nextT+=sp;step++;continue;}
    const bar=Math.floor(step/16)%4,s=step%16,ch=song.chords[bar];
    if(s%2===0)tone(N(song.bass[(bar*4+(s>>2))%16]),sp*1.8,'triangle',.11,null,nextT);
    if(s%2===0){const n=ch[(s/2)%3]+12+((s>>3)%2?12:0);tone(N(n),sp*.9,'square',song.lead?.012:.022,null,nextT);}
    if(song.lead&&s%2===0){const n=song.lead[(bar*8+(s>>1))%32];if(n)tone(N(n),sp*1.7,'square',.032,null,nextT);}
    if(s%4===0)noise(.04,.05,s%8===0?300:5000,nextT);
    nextT+=sp;step++;
  }
}

