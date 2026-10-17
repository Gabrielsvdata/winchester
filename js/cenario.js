'use strict';
/* ============ Cenário ============ */
let layers={};
function buildStage(){
  layers={};
  const R=seeded(1983);
  // céu
  const sky=document.createElement('canvas');sky.width=SW;sky.height=160;const s=sky.getContext('2d');
  const bands=['#0a0918','#0e0c20','#131029','#1a1433','#22183c','#2a1c40'];
  for(let y=0;y<160;y++){const b=Math.min(bands.length-1,Math.floor(y/24)),f=(y%24)/24;s.fillStyle=bands[b];s.fillRect(0,y,SW,1);if(b<bands.length-1&&f>.6){s.fillStyle=bands[b+1];for(let x=(y%2);x<SW;x+=2)if(f>.8||x%4<2)s.fillRect(x,y,1,1);}}
  for(let i=0;i<70;i++){s.fillStyle=R()<.2?'#e8e4ff':'#7a7498';s.fillRect((R()*SW)|0,(R()*100)|0,1,1);}
  disc(s,252,38,14,'#d8d2b8');disc(s,256,35,12,'#ece6cc');px(s,250,34,3,3,'#c8c0a0');px(s,258,42,4,3,'#d0c8a8');px(s,262,30,2,2,'#d0c8a8');
  s.fillStyle='#1e1a34';for(const[cx,cy,w]of[[230,44,40],[268,52,34],[60,30,50],[110,54,40]]){s.fillRect(cx,cy,w,3);s.fillRect(cx+6,cy-2,w-14,2);}
  layers.sky=sky;
  // morros distantes
  const farW=SW+Math.ceil((STAGE_W-SW)*.2)+4;const far=document.createElement('canvas');far.width=farW;far.height=160;const f=far.getContext('2d');
  for(let x=0;x<farW;x++){const h=96+Math.sin(x*.021)*9+Math.sin(x*.057+1)*5+Math.sin(x*.13)*2;f.fillStyle='#17162c';f.fillRect(x,Math.round(h),1,160);}
  layers.far=far;
  // árvores e casa
  const midW=SW+Math.ceil((STAGE_W-SW)*.5)+4;const mid=document.createElement('canvas');mid.width=midW;mid.height=160;const m=mid.getContext('2d');
  const pine=(x,base,h,col)=>{for(let y=0;y<h;y++){const w=Math.round((y/h)*h*.32)+1;m.fillStyle=col;m.fillRect(x-w,base-h+y,w*2+1,1);}m.fillRect(x-1,base,3,4);};
  for(let x=-10;x<midW;x+=7+R()*9){if(x>800&&x<1060)continue;pine(x,140,26+R()*24,R()<.5?'#0e1a20':'#122228');}
  // casa da Constance
  const H0=860;m.fillStyle='#1a1820';m.fillRect(H0,74,170,70);m.fillStyle='#24202a';for(let y=78;y<144;y+=5)m.fillRect(H0,y,170,1);
  m.fillStyle='#120f18';for(let i=0;i<40;i++){m.fillRect(H0-6+i*2,74-Math.min(i,40-i)*1.1,190-i*4>0?4:0,2);}
  for(let y=0;y<34;y++){const w=Math.round(y*2.7);m.fillStyle='#14111a';m.fillRect(H0+85-w,40+y,w*2,1);}
  m.fillStyle='#2a2430';m.fillRect(H0+130,24,12,24);
  for(const wx of[H0+20,H0+60,H0+110,H0+145]){m.fillStyle='#3a3a18';m.fillRect(wx,92,14,16);m.fillStyle='#08070c';m.fillRect(wx+6,92,2,16);m.fillRect(wx,99,14,2);}
  m.fillStyle='#6a6420';m.fillRect(H0+21,93,5,6);
  m.fillStyle='#0c0a10';m.fillRect(H0+78,108,18,36);
  layers.mid=mid;
  // chão
  const gr=document.createElement('canvas');gr.width=STAGE_W;gr.height=104;const g=gr.getContext('2d');const G0=120;
  const speck=(x0,x1,y0,y1,cols,n)=>{for(let i=0;i<n;i++){g.fillStyle=cols[(R()*cols.length)|0];g.fillRect(Math.round(x0+R()*(x1-x0)),Math.round(y0+R()*(y1-y0)),1+(R()*2|0),1);}};
  // estrada na mata 0-700
  g.fillStyle='#16241c';g.fillRect(0,0,700,26);speck(0,700,0,26,['#1e3024','#0e1a14','#24382a'],900);
  for(let x=0;x<700;x+=3){if(R()<.5){g.fillStyle='#22382a';g.fillRect(x,22+(R()*4|0),1,4);}}
  g.fillStyle='#24242a';g.fillRect(0,26,700,78);speck(0,700,26,104,['#2c2c34','#1e1e24','#303038'],2600);
  g.fillStyle='#bdb8a8';g.fillRect(0,28,700,1);
  for(let x=8;x<700;x+=40){g.fillStyle='#c9a02a';g.fillRect(x,63,22,2);}
  // ponte 700-1140
  g.fillStyle='#0b1626';g.fillRect(700,0,440,26);for(let i=0;i<120;i++){g.fillStyle=R()<.5?'#1a3050':'#2a4a70';g.fillRect(700+R()*440,4+R()*20,3+R()*6,1);}
  g.fillStyle='#38383e';g.fillRect(700,26,440,78);speck(700,1140,26,104,['#404048','#303036','#46464e'],1600);
  for(let x=700;x<1140;x+=34){g.fillStyle='#2c2c32';g.fillRect(x,26,1,78);}
  g.fillStyle='#5a5a62';g.fillRect(700,8,440,3);g.fillRect(700,17,440,2);for(let x=704;x<1140;x+=22){g.fillStyle='#4a4a52';g.fillRect(x,6,4,22);g.fillStyle='#6a6a72';g.fillRect(x,6,4,1);}
  g.fillStyle='#bdb8a8';g.fillRect(700,64,440,1);
  // quintal 1140-1840
  g.fillStyle='#1c2418';g.fillRect(1140,0,700,30);speck(1140,1840,0,30,['#26301e','#141a10','#2e3a22'],800);
  for(let x=1146;x<1840;x+=16){g.fillStyle='#2a2218';g.fillRect(x,4,3,22);g.fillRect(x-6,10,16,2);}
  g.fillStyle='#2e2620';g.fillRect(1140,30,700,74);speck(1140,1840,30,104,['#382e26','#241e18','#3e3428','#26301e'],2400);
  g.fillStyle='#3a3026';g.fillRect(1700,14,140,18);g.fillStyle='#2a221a';for(let i=0;i<3;i++)g.fillRect(1730+i*6,20+i*4,60,2);
  // transições
  g.fillStyle='#4a4a52';g.fillRect(698,0,4,104);g.fillRect(1138,0,4,104);
  // Impala, de lado
  impala(g,28,10);
  layers.ground=gr;layers.G0=G0;
}
function impala(g,x,y){
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(x+4,y+24,104,4);
  g.fillStyle='#0b0b0f';g.fillRect(x,y+10,110,12);g.fillRect(x+2,y+8,106,3);
  g.fillRect(x+30,y,44,10);g.fillRect(x+26,y+4,52,6);
  g.fillStyle='#283850';g.fillRect(x+32,y+2,18,7);g.fillRect(x+53,y+2,18,7);g.fillStyle='#0b0b0f';g.fillRect(x+50,y+1,3,9);
  g.fillStyle='#3a3a4a';g.fillRect(x+2,y+11,106,1);g.fillStyle='#4e4e60';g.fillRect(x+30,y,44,1);
  g.fillStyle='#b8bcc4';g.fillRect(x+106,y+14,5,5);g.fillRect(x-1,y+14,4,5);g.fillRect(x+4,y+17,102,1);
  g.fillStyle='#f0e8b0';g.fillRect(x+108,y+11,3,3);g.fillStyle='#a01818';g.fillRect(x,y+11,2,3);
  for(const wx of[x+22,x+88]){disc(g,wx,y+22,6,'#060608');disc(g,wx,y+22,2,'#8a8a92');}
}

/* ============ Cenários dos capítulos 2 a 4 ============ */
function speckOn(g,R,x0,x1,y0,y1,cols,n){for(let i=0;i<n;i++){g.fillStyle=cols[(R()*cols.length)|0];g.fillRect(Math.round(x0+R()*(x1-x0)),Math.round(y0+R()*(y1-y0)),1+(R()*2|0),1);}}
function pineOn(g,x,base,h,col){for(let y=0;y<h;y++){const w=Math.round((y/h)*h*.32)+1;g.fillStyle=col;g.fillRect(x-w,base-h+y,w*2+1,1);}g.fillRect(x-1,base,3,4);}
function deadTree(g,x,base,h,col,R){g.fillStyle=col;g.fillRect(x-1,base-h,3,h);for(let i=0;i<5;i++){const y=base-h+R()*h*.7,len=6+R()*14,d=R()<.5?-1:1;for(let k=0;k<len;k++)g.fillRect(Math.round(x+d*k),Math.round(y-k*.6),1,1);}}
function wreck(g,x,y,col,R){
  g.fillStyle=col;g.fillRect(x,y-12,60,9);g.fillRect(x+14,y-19,28,8);
  g.fillStyle='#14100c';g.fillRect(x+17,y-17,10,5);g.fillRect(x+30,y-17,10,5);
  g.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<6;i++)g.fillRect(Math.round(x+R()*56),Math.round(y-12+R()*8),3,2);
  disc(g,x+12,y-3,4,'#0a0a0a');disc(g,x+48,y-3,4,'#0a0a0a');
}
const STAGE_THEMES={
  2:{ // ninho de vampiros: fazenda e celeiro no Colorado
    sky:['#100810','#180a12','#220d18','#2c101e','#361424','#3e1828'],stars:40,moon:[250,40,'#a8382a','#c84a34'],cloud:'#2a0e18',clouds:5,
    far:'#1c0e18',farH:x=>72+Math.abs(((x*.03)%2)-1)*28+Math.sin(x*.11)*3,
    mid:(m,W,R)=>{
      for(let x=-10;x<W;x+=8+R()*10){if(x>820&&x<1080)continue;pineOn(m,x,142,24+R()*26,R()<.5?'#140c14':'#1a1018');}
      const silo=x=>{m.fillStyle='#1e121a';m.fillRect(x,70,22,72);disc(m,x+11,70,11,'#1e121a');};silo(300);silo(330);
      const B=860;m.fillStyle='#2a1218';m.fillRect(B,70,200,72);
      for(let y=0;y<40;y++){const w=Math.round(100-y*2.2);m.fillRect(B+100-w,70-y,w*2,1);}
      m.fillStyle='#3a1820';for(let x=B;x<B+200;x+=8)m.fillRect(x,72,1,70);
      m.fillStyle='#0a0406';m.fillRect(B+70,90,60,52);
      m.fillStyle='#8a2010';m.fillRect(B+20,86,14,10);m.fillRect(B+166,86,14,10);
      m.fillStyle='#4a1a12';m.fillRect(B+90,44,20,14);m.fillStyle='#c83a1a';m.fillRect(B+95,48,10,6);
    },
    ground:(g,R)=>{
      g.fillStyle='#1c1410';g.fillRect(0,0,STAGE_W,30);speckOn(g,R,0,STAGE_W,0,30,['#241a12','#140e0a','#2a2014'],1600);
      for(let x=4;x<1300;x+=18){g.fillStyle='#3a281a';g.fillRect(x,6,3,22);}
      g.fillStyle='#4a3420';g.fillRect(0,10,1300,2);g.fillRect(0,18,1300,2);
      g.fillStyle='#2e2218';g.fillRect(0,30,1300,74);speckOn(g,R,0,1300,30,104,['#382a1e','#241a12','#3e2e20'],3000);
      for(let x=0;x<1300;x+=6){if(R()<.3){g.fillStyle='#241a12';g.fillRect(x,58+(R()*4|0),4,1);g.fillRect(x,80+(R()*4|0),4,1);}}
      for(const hx of[180,520,900,1180]){g.fillStyle='#6a5222';g.fillRect(hx,8,26,16);g.fillStyle='#806428';g.fillRect(hx,8,26,3);g.fillStyle='#4a3814';g.fillRect(hx+8,8,1,16);g.fillRect(hx+17,8,1,16);}
      g.fillStyle='#2a1810';g.fillRect(1300,0,540,30);for(let x=1300;x<1840;x+=10){g.fillStyle=x%20?'#341e12':'#2e1a10';g.fillRect(x,0,10,30);}
      g.fillStyle='#3a2414';g.fillRect(1300,30,540,74);for(let y=30;y<104;y+=7){g.fillStyle='#2a180e';g.fillRect(1300,y,540,1);}
      for(let i=0;i<60;i++){g.fillStyle='#2a180e';g.fillRect(Math.round(1300+R()*540),30+((R()*10)|0)*7,1,7);}
      for(let i=0;i<8;i++){g.fillStyle='rgba(110,10,10,.5)';const x=1320+R()*500,y=40+R()*55;g.fillRect(x,y,8+R()*10,2);g.fillRect(x+2,y+2,4+R()*6,1);}
      g.fillStyle='#5a2a14';g.fillRect(1296,0,4,104);
    }},
  3:{ // ferro-velho do Bobby
    sky:['#0a0e0e','#0e1414','#121a18','#16201c','#1a2420','#1e2824'],stars:10,moon:null,cloud:'#1a2422',clouds:9,
    far:'#121a18',farH:x=>100+Math.sin(x*.015)*6+Math.sin(x*.05)*3,
    mid:(m,W,R)=>{
      const cols=['#4a2a1c','#3a3a40','#5a3a20','#2a3a3a','#4a1c1c','#3a3020'];
      for(let x=150;x<W;x+=70+R()*30){let y=142;const n=1+(R()*3|0);for(let k=0;k<n;k++){wreck(m,Math.round(x+R()*8),y,cols[(R()*cols.length)|0],R);y-=14;}}
      m.fillStyle='#2a2618';m.fillRect(620,40,6,102);for(let i=0;i<90;i++)m.fillRect(626+i,40+Math.round(i*.15),1,3);m.fillRect(705,52,1,40);m.fillRect(700,90,10,6);
      const H0=10;m.fillStyle='#2a2620';m.fillRect(H0,70,120,72);
      for(let y=0;y<28;y++){const w=Math.round(66-y*2.3);m.fillStyle='#1e1a16';m.fillRect(H0+60-w,70-y,w*2,1);}
      m.fillStyle='#c8a050';m.fillRect(H0+18,86,14,12);m.fillRect(H0+86,86,14,12);
      m.fillStyle='#14100c';m.fillRect(H0+24,86,2,12);m.fillRect(H0+92,86,2,12);
      m.fillStyle='#0e0c0a';m.fillRect(H0+52,108,16,34);m.fillStyle='#3a3228';m.fillRect(H0-4,104,128,3);
    },
    ground:(g,R)=>{
      g.fillStyle='#1e1e1a';g.fillRect(0,0,STAGE_W,30);speckOn(g,R,0,STAGE_W,0,30,['#262620','#141410','#2c2c24'],1400);
      for(let x=0;x<STAGE_W;x+=24){g.fillStyle=['#3a3a40','#4a3a2a','#3a4040','#4a2a20'][((x/24)|0)%4];g.fillRect(x,2,23,24);g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<23;k+=4)g.fillRect(x+k,2,1,24);}
      g.fillStyle='#2c2a24';g.fillRect(0,30,STAGE_W,74);speckOn(g,R,0,STAGE_W,30,104,['#34322a','#22201a','#3a362c','#1c1a14'],5000);
      for(let i=0;i<30;i++){g.fillStyle='rgba(8,8,10,.55)';const x=R()*STAGE_W,y=36+R()*60,w=10+R()*24;g.fillRect(x,y,w,3);g.fillRect(x+3,y-1,w-6,5);}
      for(let x=0;x<STAGE_W;x+=5){if(R()<.4){g.fillStyle='#22201a';g.fillRect(x,54,3,2);g.fillRect(x,86,3,2);}}
      for(const tx of[240,700,1050,1400,1700]){for(let k=0;k<3;k++){disc(g,tx,22-k*4,6,'#0e0e0e');disc(g,tx,22-k*4,2,'#2a2a2a');}}
      g.strokeStyle='rgba(150,30,20,.6)';g.lineWidth=1;g.beginPath();g.ellipse(120,70,30,10,0,0,Math.PI*2);g.stroke();
    }},
  4:{ // cemitério em Wyoming, com o Portão do Diabo
    sky:['#06080e','#0a0c16','#0e101c','#141420','#1c1a22','#2a2418'],stars:80,moon:[70,36,'#c8b868','#e0d490'],cloud:'#141420',clouds:4,
    far:'#0e1016',farH:x=>104+Math.sin(x*.01)*4,
    mid:(m,W,R)=>{
      for(let x=-10;x<W;x+=20+R()*30){if(x>820&&x<1080)continue;deadTree(m,Math.round(x),142,30+R()*30,'#0c0e12',R);}
      m.fillStyle='#2a2a30';m.fillRect(0,136,W,2);for(let x=0;x<W;x+=10)m.fillRect(x,134,3,8);
      const C=860;m.fillStyle='#22222a';m.fillRect(C+30,60,140,82);
      for(let y=0;y<26;y++){const w=Math.round(80-y*3);m.fillStyle='#1a1a22';m.fillRect(C+100-w,60-y,w*2,1);}
      for(let k=0;k<4;k++){m.fillStyle='#2e2e38';m.fillRect(C+40+k*36,66,8,76);}
      m.fillStyle='#0a0406';m.fillRect(C+80,84,40,58);m.fillStyle='#e85a10';m.fillRect(C+99,84,2,58);
      m.fillStyle='rgba(232,90,16,.25)';m.fillRect(C+70,80,60,62);
      m.fillStyle='#3a3a44';m.fillRect(C+96,20,8,22);m.fillRect(C+90,26,20,6);
    },
    ground:(g,R)=>{
      g.fillStyle='#141a14';g.fillRect(0,0,STAGE_W,32);speckOn(g,R,0,STAGE_W,0,32,['#1a2218','#0c120c','#202a1c'],1600);
      g.fillStyle='#2a2a30';g.fillRect(0,28,STAGE_W,1);for(let x=0;x<STAGE_W;x+=6){g.fillRect(x,20,1,9);g.fillRect(x-1,19,3,1);}
      for(let x=10;x<STAGE_W;x+=26+R()*30){const h=10+R()*10,w=8+R()*6,y=26-R()*10;
        g.fillStyle='#000';g.fillRect(x+2,y-h+2,w,h);g.fillStyle=R()<.5?'#4a4c52':'#3c3e44';g.fillRect(x,y-h,w,h);g.fillRect(x+1,y-h-1,w-2,1);
        g.fillStyle='#2a2c30';g.fillRect(x+2,y-h+3,w-4,1);g.fillRect(x+2,y-h+5,w-4,1);
        if(R()<.25){g.fillStyle='#4a4c52';g.fillRect(x+w/2-1,y-h-6,2,6);g.fillRect(x+w/2-3,y-h-4,6,2);}}
      g.fillStyle='#22241e';g.fillRect(0,32,STAGE_W,72);speckOn(g,R,0,STAGE_W,32,104,['#2a2c24','#181a14','#30322a'],5000);
      for(let i=0;i<40;i++){g.fillStyle='#1a2a16';const x=R()*STAGE_W,y=34+R()*66;g.fillRect(x,y,1,3);g.fillRect(x+2,y+1,1,2);}
      g.fillStyle='rgba(232,90,16,.12)';g.fillRect(1600,0,240,104);
    }},
};
function buildStageN(n){
  layers={};
  const R=seeded(1983+n*101),T=STAGE_THEMES[n];
  const sky=document.createElement('canvas');sky.width=SW;sky.height=160;const s=sky.getContext('2d');
  const bands=T.sky;
  for(let y=0;y<160;y++){const b=Math.min(bands.length-1,Math.floor(y/24)),f=(y%24)/24;s.fillStyle=bands[b];s.fillRect(0,y,SW,1);if(b<bands.length-1&&f>.6){s.fillStyle=bands[b+1];for(let x=(y%2);x<SW;x+=2)if(f>.8||x%4<2)s.fillRect(x,y,1,1);}}
  for(let i=0;i<T.stars;i++){s.fillStyle=R()<.2?'#e8e4ff':'#7a7498';s.fillRect((R()*SW)|0,(R()*100)|0,1,1);}
  if(T.moon){disc(s,T.moon[0],T.moon[1],14,T.moon[2]);disc(s,T.moon[0]+4,T.moon[1]-3,12,T.moon[3]);}
  s.fillStyle=T.cloud;for(let i=0;i<T.clouds;i++){const cx=Math.round(R()*SW),cy=Math.round(20+R()*60),w=Math.round(30+R()*60);s.fillRect(cx,cy,w,3);s.fillRect(cx+6,cy-2,w-14,2);s.fillRect(cx+3,cy+3,w-8,2);}
  layers.sky=sky;
  const farW=SW+Math.ceil((STAGE_W-SW)*.2)+4,far=document.createElement('canvas');far.width=farW;far.height=160;const f=far.getContext('2d');
  f.fillStyle=T.far;for(let x=0;x<farW;x++)f.fillRect(x,Math.round(T.farH(x)),1,160);
  layers.far=far;
  const midW=SW+Math.ceil((STAGE_W-SW)*.5)+4,mid=document.createElement('canvas');mid.width=midW;mid.height=160;
  T.mid(mid.getContext('2d'),midW,R);layers.mid=mid;
  const gr=document.createElement('canvas');gr.width=STAGE_W;gr.height=104;
  T.ground(gr.getContext('2d'),R);layers.ground=gr;layers.G0=120;
}
const LAYERS={};
function getLayers(n){if(!LAYERS[n]){if(n===1)buildStage();else buildStageN(n);LAYERS[n]=layers;}return LAYERS[n];}

