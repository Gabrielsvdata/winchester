'use strict';
/* ============ Cenários das fases 6 a 15 ============ */
// fachadas de prédios ao longo da rua
function facadesOn(m,W,R,cols,skip,lit){
  for(let x=0;x<W;x+=50+R()*34){
    if(skip&&skip.some(([a,b])=>x>a&&x<b))continue;
    const w=38+R()*28|0,h=40+R()*34|0,top=142-h;m.fillStyle=cols[(R()*cols.length)|0];m.fillRect(x,top,w,h);
    m.fillStyle='rgba(0,0,0,.22)';m.fillRect(x,top,w,2);m.fillRect(x+w-3,top,3,h);
    for(let wy=top+8;wy<142-18;wy+=14)for(let wx=x+5;wx<x+w-9;wx+=12){m.fillStyle=R()<(lit||.2)?'#c8a850':'#0c0a10';m.fillRect(wx,wy,7,8);}
    m.fillStyle='#08070c';m.fillRect(x+w/2-5|0,126,10,16);
  }
}
// casas de subúrbio com telhado de duas águas
function housesOn(m,W,R,wall,roof,lit){
  for(let x=10;x<W;x+=90+R()*40){
    const w=60+R()*20|0,top=96;m.fillStyle=wall;m.fillRect(x,top,w,46);
    for(let y=0;y<20;y++){const k=Math.round(w/2+4-y*(w/2+4)/20);m.fillStyle=roof;m.fillRect(x+w/2-k|0,top-y,k*2,1);}
    for(const wx of[x+8,x+w-20]){m.fillStyle=R()<(lit||.4)?'#d8b860':'#141018';m.fillRect(wx,top+12,12,10);m.fillStyle='#1a1418';m.fillRect(wx+5,top+12,2,10);}
    m.fillStyle='#120e10';m.fillRect(x+w/2-5|0,top+24,10,22);
    m.fillStyle='#d8d4c8';for(let k=x-6;k<x+w+6;k+=4)m.fillRect(k,134,2,8);m.fillRect(x-6,136,w+12,1);
  }
}
function roadGround(g,R,top,asph,line,curb){
  g.fillStyle=top[0];g.fillRect(0,0,STAGE_W,30);speckOn(g,R,0,STAGE_W,0,30,top,1400);
  g.fillStyle=curb;g.fillRect(0,26,STAGE_W,3);
  g.fillStyle=asph[0];g.fillRect(0,29,STAGE_W,75);speckOn(g,R,0,STAGE_W,29,104,asph,5200);
  if(line)for(let x=8;x<STAGE_W;x+=40){g.fillStyle=line;g.fillRect(x,63,22,2);}
}
Object.assign(STAGE_THEMES,{
  6:{ // Oasis Plains, Nebraska: a rua principal à noite
    sky:['#0a0a16','#0e0e1e','#141428','#1a1a30','#221e36','#2a2238'],stars:50,moon:[60,30,'#d8d2b8','#ece6cc'],cloud:'#1c1a30',clouds:5,
    far:'#14142a',farH:x=>112+Math.sin(x*.01)*3,
    mid:(m,W,R)=>{facadesOn(m,W,R,['#2a2430','#302838','#262230','#34283a'],[[540,660]],.3);
      // bar com letreiro de néon
      const B=560;m.fillStyle='#2e2026';m.fillRect(B,86,96,56);m.fillStyle='#0a0608';m.fillRect(B+38,112,18,30);
      m.fillStyle='#ff3a6a';m.fillRect(B+10,74,76,2);m.fillRect(B+10,84,76,2);m.fillRect(B+10,74,2,12);m.fillRect(B+84,74,2,12);
      m.fillStyle='#ff6a8a';for(let k=0;k<6;k++)m.fillRect(B+18+k*11,78,6,4);
      m.fillStyle='rgba(255,58,106,.12)';m.fillRect(B-10,66,116,40);},
    ground:(g,R)=>roadGround(g,R,['#262230','#1e1a26','#2c2836'],['#26242c','#1e1c22','#2e2c34'],'#c9a02a','#5a5660')},
  7:{ // New Harmony, Indiana: subúrbio à meia-noite
    sky:['#060810','#0a0c18','#0e1020','#121428','#161830','#1a1c34'],stars:70,moon:[250,34,'#c8c4b0','#e0dcc8'],cloud:'#141628',clouds:4,
    far:'#0e1020',farH:x=>108+Math.sin(x*.02)*4,
    mid:(m,W,R)=>{for(let x=-10;x<W;x+=26+R()*30)pineOn(m,x|0,142,30+R()*24,'#0c1418');housesOn(m,W,R,'#3a3a44','#24222c',.45);},
    ground:(g,R)=>{g.fillStyle='#16241a';g.fillRect(0,0,STAGE_W,30);speckOn(g,R,0,STAGE_W,0,30,['#1e3024','#0e1a14','#24382a'],1800);
      g.fillStyle='#8a8a90';g.fillRect(0,24,STAGE_W,5);for(let x=0;x<STAGE_W;x+=16){g.fillStyle='#6a6a70';g.fillRect(x,24,1,5);}
      g.fillStyle='#24242a';g.fillRect(0,29,STAGE_W,75);speckOn(g,R,0,STAGE_W,29,104,['#2c2c34','#1e1e24','#303038'],5000);
      for(let x=8;x<STAGE_W;x+=40){g.fillStyle='#bdb8a8';g.fillRect(x,63,22,1);}
      for(let i=0;i<14;i++){g.fillStyle='rgba(120,20,10,.5)';const x=R()*STAGE_W,y=36+R()*60;for(let k=0;k<4;k++)g.fillRect(x+k*3,y+k,1,5);}}},
  8:{ // Pontiac, Illinois: a cova do Dean e o celeiro
    sky:['#0c0a0e','#141016','#1c161c','#241c22','#2c2226','#36282a'],stars:30,moon:null,cloud:'#221a1e',clouds:8,
    far:'#1a1418',farH:x=>110+Math.sin(x*.012)*5,
    mid:(m,W,R)=>{
      for(let x=-10;x<W;x+=14+R()*18){if(x>200&&x<330)continue;deadTree(m,x|0,142,26+R()*30,'#120e10',R);}
      // árvores derrubadas em círculo em volta da cova
      for(let k=0;k<9;k++){const a=Math.PI*(.1+.8*k/8),cx=265,len=34;m.fillStyle='#1a1412';for(let i=0;i<len;i++)m.fillRect(Math.round(cx+Math.cos(a)*(8+i)*(k<4?-1:1)*.9),Math.round(140-Math.sin(a)*i*.25),2,2);}
      // celeiro com armadilhas pintadas
      const B=880;m.fillStyle='#3a1a14';m.fillRect(B,72,170,70);for(let y=0;y<34;y++){const w=Math.round(85-y*2.4);m.fillStyle='#2a120e';m.fillRect(B+85-w,72-y,w*2,1);}
      m.fillStyle='#4a2218';for(let x=B;x<B+170;x+=7)m.fillRect(x,74,1,68);
      m.fillStyle='#0a0606';m.fillRect(B+60,92,50,50);m.fillStyle='rgba(255,240,200,.25)';m.fillRect(B+66,96,38,46);
      m.strokeStyle='#c83020';m.lineWidth=1;m.beginPath();m.arc(B+30,100,12,0,Math.PI*2);m.stroke();m.beginPath();m.arc(B+140,100,12,0,Math.PI*2);m.stroke();},
    ground:(g,R)=>{g.fillStyle='#2a2216';g.fillRect(0,0,STAGE_W,104);speckOn(g,R,0,STAGE_W,0,104,['#322a1c','#221a10','#3a3020','#1a1a10'],7000);
      g.fillStyle='#14100a';g.fillRect(230,8,50,14);g.fillStyle='#3a2e1e';for(let i=0;i<30;i++)g.fillRect(226+R()*58,4+R()*20,3,2);
      g.fillStyle='#5a5048';g.fillRect(250,0,8,10);g.fillRect(246,2,16,2);
      for(let x=0;x<STAGE_W;x+=5)if(R()<.4){g.fillStyle='#4a3e22';g.fillRect(x,30+R()*70,1,3);}}},
  9:{ // convento de Santa Maria, Maryland
    sky:['#0a0810','#100c16','#16101c','#1c1422','#221828','#2a1c2c'],stars:20,moon:null,cloud:'#1c1422',clouds:6,
    far:'#18121c',farH:x=>40,
    mid:(m,W,R)=>{m.fillStyle='#241c26';m.fillRect(0,20,W,122);
      for(let x=10;x<W;x+=64){m.fillStyle='#2e2430';m.fillRect(x,20,12,122);
        for(let y=0;y<24;y++){m.fillStyle='#120e14';const k=Math.round(Math.sqrt(Math.max(0,24*24-y*y))*.9);m.fillRect(x+44-k*0+0,60-y,1,1);}
        m.fillStyle='#120e14';m.fillRect(x+24,50,28,60);for(let y=0;y<14;y++){const k=Math.round(14*Math.sqrt(1-(y/14)**2));m.fillRect(x+38-k,50-y,k*2,1);}
        const cols=['#8a2020','#20408a','#c8a030','#2a7a3a'];for(let k=0;k<6;k++){m.fillStyle=cols[(R()*4)|0];m.fillRect(x+27+(k%3)*8,54+((k/3)|0)*16,6,12);}}
      for(let x=30;x<W;x+=64){m.fillStyle='#e8d090';m.fillRect(x,128,2,6);m.fillStyle='#fff4c0';m.fillRect(x,125,2,3);}},
    ground:(g,R)=>{g.fillStyle='#2a2428';g.fillRect(0,0,STAGE_W,104);
      for(let y=0;y<104;y+=12)for(let x=((y/12)%2)*16;x<STAGE_W;x+=32){g.fillStyle=(x+y)%64?'#322a30':'#262024';g.fillRect(x,y,31,11);}
      g.fillStyle='#5a1a1a';g.fillRect(0,40,STAGE_W,22);g.fillStyle='#6a2222';g.fillRect(0,42,STAGE_W,2);g.fillRect(0,58,STAGE_W,2);
      g.strokeStyle='rgba(200,30,20,.7)';g.lineWidth=1;g.beginPath();g.ellipse(1720,60,60,22,0,0,Math.PI*2);g.stroke();g.beginPath();g.ellipse(1720,60,48,17,0,0,Math.PI*2);g.stroke();}},
  10:{ // River Pass, Colorado: a cidade das montanhas
    sky:['#1a0c10','#2a1014','#3a1618','#4a1e1a','#5a281c','#6a321e'],stars:0,moon:null,cloud:'#3a1416',clouds:6,
    far:'#2a1418',farH:x=>60+Math.abs(((x*.02)%2)-1)*50+Math.sin(x*.09)*4,
    mid:(m,W,R)=>{facadesOn(m,W,R,['#3a2420','#30201c','#40281e','#362218'],[[700,800]],.15);
      // o Mustang vermelho da Guerra
      const X=730;m.fillStyle='#8a1010';m.fillRect(X,128,60,10);m.fillRect(X+14,121,30,8);m.fillStyle='#1a1a24';m.fillRect(X+17,123,10,5);m.fillRect(X+30,123,10,5);disc(m,X+12,138,5,'#0a0a0a');disc(m,X+48,138,5,'#0a0a0a');},
    ground:(g,R)=>roadGround(g,R,['#3a2a22','#2a1e18','#44322a'],['#3a2e26','#2c221c','#443830'],null,'#5a4a3c')},
  11:{ // cemitério de Stull, Kansas
    sky:['#0a0a0c','#121214','#1a1a1c','#222024','#2a2628','#34302c'],stars:0,moon:null,cloud:'#2a282c',clouds:14,
    far:'#18181a',farH:x=>114+Math.sin(x*.01)*3,
    mid:(m,W,R)=>{for(let x=-10;x<W;x+=30+R()*30)deadTree(m,x|0,142,30+R()*34,'#101012',R);
      const C=W-260;m.fillStyle='#3a3630';m.fillRect(C,74,110,68);for(let y=0;y<28;y++){const w=Math.round(58-y*2);m.fillStyle='#2e2a26';m.fillRect(C+55-w,74-y,w*2,1);}
      m.fillStyle='#0a0a0a';m.fillRect(C+20,96,16,22);m.fillRect(C+74,96,16,22);m.fillRect(C+46,110,18,32);
      m.fillStyle='#4a4640';m.fillRect(C+48,30,14,20);m.fillRect(C+44,36,22,4);},
    ground:(g,R)=>{g.fillStyle='#1e221a';g.fillRect(0,0,STAGE_W,104);speckOn(g,R,0,STAGE_W,0,104,['#262a20','#161a12','#2c3024'],6000);
      for(let x=10;x<STAGE_W-200;x+=30+R()*34){const h=10+R()*10,w=8+R()*6,y=26-R()*10;g.fillStyle='#000';g.fillRect(x+2,y-h+2,w,h);g.fillStyle='#4a4c52';g.fillRect(x,y-h,w,h);}
      impala(g,STAGE_W-240,6);}},
  12:{ // o esconderijo de Abaddon
    sky:['#0c0808','#140c0c','#1c1010','#241414','#2c1818','#341c1a'],stars:0,moon:null,cloud:'#241212',clouds:0,
    far:'#1a1010',farH:x=>30,
    mid:(m,W,R)=>{m.fillStyle='#221818';m.fillRect(0,24,W,118);
      for(let x=0;x<W;x+=60){m.fillStyle='#2c201e';m.fillRect(x,24,6,118);m.fillStyle='#181010';m.fillRect(x+12,40,40,30);m.fillStyle='rgba(180,40,20,.25)';m.fillRect(x+14,42,36,26);}
      m.fillStyle='#3a2a26';m.fillRect(0,24,W,4);for(let x=0;x<W;x+=20)m.fillRect(x,28,2,10);
      for(let x=30;x<W;x+=120){m.fillStyle='#3a1a14';m.fillRect(x,112,20,30);m.fillStyle='#4a2218';m.fillRect(x,112,20,3);}},
    ground:(g,R)=>{g.fillStyle='#2a2422';g.fillRect(0,0,STAGE_W,104);speckOn(g,R,0,STAGE_W,0,104,['#322a28','#221c1a','#3a302c'],6000);
      for(let x=0;x<STAGE_W;x+=48){g.fillStyle='#201a18';g.fillRect(x,0,1,104);}g.fillStyle='#201a18';g.fillRect(0,52,STAGE_W,1);
      for(let i=0;i<10;i++){g.fillStyle='rgba(110,10,10,.45)';g.fillRect(R()*STAGE_W,30+R()*70,10+R()*14,2);}}},
  13:{ // a névoa da Escuridão
    sky:['#08080a','#0c0c0e','#101012','#141416','#18181a','#1c1c1e'],stars:0,moon:null,cloud:'#18181a',clouds:12,
    far:'#121214',farH:x=>110,
    mid:(m,W,R)=>{facadesOn(m,W,R,['#1c1c20','#202024','#18181c'],null,.05);m.fillStyle='rgba(0,0,0,.45)';m.fillRect(0,60,W,82);},
    ground:(g,R)=>{roadGround(g,R,['#1a1a1c','#121214','#202022'],['#1c1c1e','#141416','#222224'],'#6a5a2a','#3a3a3c');
      g.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<40;i++)g.fillRect(R()*STAGE_W,R()*104,20+R()*40,2);}},
  14:{ // o parque, sob o sol que se apaga
    sky:['#2a1a10','#3a2414','#4a2c16','#3a2210','#2a180c','#1a1008'],stars:0,moon:[160,46,'#5a3a1a','#7a5020'],cloud:'#2a1a0e',clouds:4,
    far:'#1e140c',farH:x=>108+Math.sin(x*.02)*3,
    mid:(m,W,R)=>{for(let x=-10;x<W;x+=22+R()*22){const h=20+R()*20;disc(m,x|0,128-h|0,10+R()*6|0,'#1a1c0e');m.fillStyle='#120c08';m.fillRect(x-1|0,128-h|0,3,h+14|0);}
      for(let x=40;x<W;x+=140){m.fillStyle='#2a2018';m.fillRect(x,130,30,3);m.fillRect(x+2,133,2,8);m.fillRect(x+26,133,2,8);}},
    ground:(g,R)=>{g.fillStyle='#24240e';g.fillRect(0,0,STAGE_W,104);speckOn(g,R,0,STAGE_W,0,104,['#2a2a12','#1c1c0a','#323216'],6000);
      g.fillStyle='#4a3e2a';g.fillRect(0,48,STAGE_W,22);speckOn(g,R,0,STAGE_W,48,70,['#54462e','#3e3424'],2000);}},
  15:{ // as páginas de Chuck
    sky:['#e8e4d8','#e0dccc','#d8d2c0','#ccc4b0','#bcb4a0','#aca490'],stars:0,moon:null,cloud:'#c8c0ac',clouds:0,
    far:'#c8c0aa',farH:x=>90+Math.sin(x*.03)*6,
    mid:(m,W,R)=>{for(let x=0;x<W;x+=46){m.fillStyle='#f2eee2';m.fillRect(x,40+R()*30|0,40,100);m.fillStyle='#8a8478';for(let y=60;y<130;y+=6)m.fillRect(x+4,y+(R()*20|0),24+R()*10|0,1);}
      m.fillStyle='rgba(30,26,20,.15)';m.fillRect(0,0,W,142);},
    ground:(g,R)=>{g.fillStyle='#d8d0bc';g.fillRect(0,0,STAGE_W,104);for(let y=6;y<104;y+=8){g.fillStyle='#b8b0a0';g.fillRect(0,y,STAGE_W,1);}
      g.fillStyle='#c84a3a';g.fillRect(40,0,1,104);for(let i=0;i<60;i++){g.fillStyle='#4a443a';g.fillRect(R()*STAGE_W,R()*104,8+R()*20,1);}}},
});
