'use strict';
/* الرسم: الطائر، الأزياء، الخلفيات، العوائق */
const H=640,GY=570;
const col=(a,k=1,al=1)=>'rgba('+(a[0]*k|0)+','+(a[1]*k|0)+','+(a[2]*k|0)+','+al+')';
const mixA=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];

const EAG=[[128,86,48],[226,196,140],[92,60,34]];
const SKINS=[
 {n:'أنزو الأصلي',c:EAG,a:'none',p:0},
 {n:'الغترة الحمراء',c:EAG,a:'kef',ac:['#d6322e','#ffffff'],p:1500},
 {n:'الغترة البيضاء',c:EAG,a:'kef',ac:['#f4f4f4','#555555'],p:1800},
 {n:'السدارة العراقية',c:EAG,a:'sidara',ac:['#8a8378'],p:2200},
 {n:'نظارة الصيف',c:EAG,a:'shades',ac:['#111'],p:2500},
 {n:'سماعات الموسيقى',c:EAG,a:'phones',ac:['#e8453c'],p:2800},
 {n:'عصابة القرصان',c:EAG,a:'bandana',ac:['#c0272d'],p:3000},
 {n:'خوذة الطيار',c:EAG,a:'helmet',ac:['#6b4a2b'],p:3300},
 {n:'إكليل الربيع',c:EAG,a:'flowers',ac:['#ff7aa8'],p:3600},
 {n:'وشاح الشتاء',c:EAG,a:'scarf',ac:['#e04a3a'],p:3900},
 {n:'عباءة الفارس',c:EAG,a:'cape',ac:['#7b1fa2'],p:4500},
 {n:'العمامة البيضاء',c:EAG,a:'turban',ac:['#f6f3ea'],p:4800},
 {n:'القبعة العالية',c:EAG,a:'tophat',ac:['#1b1b1b'],p:5200},
 {n:'تاج بابل',c:EAG,a:'crown',ac:['#ffcc33'],p:6500},
 {n:'الصقر الذهبي',c:[[212,160,40],[255,232,150],[160,110,20]],a:'crown',ac:['#fff3b0'],p:8000},
 {n:'غراب الليل',c:[[44,44,60],[96,96,118],[26,26,38]],a:'shades',ac:['#000'],p:8500},
 {n:'الثلجي',c:[[235,240,248],[255,255,255],[185,200,220]],a:'scarf',ac:['#3b82f6'],p:9000},
 {n:'الزمردي',c:[[30,130,90],[170,225,170],[18,90,60]],a:'turban',ac:['#e8f5e9'],p:9500},
 {n:'العنقاء النارية',c:[[210,60,30],[255,170,60],[150,30,20]],a:'cape',ac:['#ff8a00'],p:11000},
 {n:'ملك أنزو',c:[[40,70,170],[170,200,255],[25,40,110]],a:'crown',ac:['#ffd54a'],p:15000}
];

function feather(c,len,wid,fill,line){
  c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.55,-wid,len,0);c.quadraticCurveTo(len*.55,wid,0,0);c.fillStyle=fill;c.fill();
  c.strokeStyle=line;c.lineWidth=.8;c.beginPath();c.moveTo(2,0);c.lineTo(len*.92,0);c.stroke();
}
function drawWing(c,ang,sk,far){
  const L=[24,30,36,41,44,40],base=far?col(sk.c[2],.62):col(sk.c[2]),ln=col(sk.c[2],.45);
  c.save();
  for(let i=0;i<6;i++){c.save();c.rotate(Math.PI+ang+(i-2.5)*.11);feather(c,L[i],6.5,base,ln);c.restore();}
  c.save();c.rotate(Math.PI+ang);c.beginPath();c.ellipse(15,0,15,8.5,0,0,6.2832);c.fillStyle=far?col(sk.c[2],.75):col(sk.c[2],1.18);c.fill();
  c.strokeStyle=col(sk.c[2],.5,.5);c.lineWidth=.8;for(let k=0;k<3;k++){c.beginPath();c.arc(8+k*7,0,4.5,-1.2,1.2);c.stroke();}c.restore();
  c.restore();
}
function accBack(c,sk,fl){
  if(sk.a==='cape'){
    c.beginPath();c.moveTo(7,-9);c.quadraticCurveTo(-8,-14+fl,-30,-6+fl*1.6);c.quadraticCurveTo(-26,6,-22,17+fl);c.quadraticCurveTo(-4,14,8,8);c.closePath();
    c.fillStyle=sk.ac[0];c.fill();c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=1;c.stroke();
  }
}
function accFront(c,sk,fl,wp){
  const a=sk.a,k=sk.ac||[];
  if(a==='none')return;
  if(a==='kef'){
    c.beginPath();c.moveTo(9.5,-8);c.quadraticCurveTo(10,-22,20,-21);c.quadraticCurveTo(29,-20,28.5,-9);c.closePath();c.fillStyle=k[0];c.fill();
    c.beginPath();c.moveTo(10,-14);c.quadraticCurveTo(0,-14+fl,-9,-6+fl*1.3);c.quadraticCurveTo(0,0,11,-3);c.closePath();c.fill();
    c.fillStyle=k[1];for(let i=0;i<4;i++)for(let j=0;j<2;j++){c.fillRect(-4+i*4.2+j*2,-8+j*3.6-i*.4+fl*.3,1.8,1.8);}
    for(let i=0;i<4;i++)c.fillRect(12+i*4,-19+Math.abs(i-1.5)*1.2,1.8,1.8);
    c.strokeStyle='#111';c.lineWidth=2.2;c.beginPath();c.ellipse(19,-15.5,9.6,2.3,-.12,0,6.2832);c.stroke();
    c.beginPath();c.ellipse(19,-18.2,9.2,2.1,-.12,0,6.2832);c.stroke();
  }else if(a==='sidara'){
    c.beginPath();c.moveTo(9.5,-11);c.quadraticCurveTo(11,-25,22,-22.5);c.lineTo(29,-16.5);c.lineTo(28,-13.5);c.quadraticCurveTo(19,-15.5,9.5,-11);c.closePath();c.fillStyle=k[0];c.fill();
    c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke();
  }else if(a==='crown'){
    c.beginPath();c.moveTo(12,-15);c.lineTo(12,-25);c.lineTo(15.5,-20);c.lineTo(19,-28);c.lineTo(22.5,-20);c.lineTo(26,-25);c.lineTo(26,-15);c.closePath();
    c.fillStyle=k[0];c.fill();c.strokeStyle='rgba(120,70,0,.7)';c.lineWidth=1;c.stroke();
    c.fillStyle='#e53935';c.beginPath();c.arc(19,-18,1.6,0,6.3);c.fill();c.fillStyle='#29b6f6';c.beginPath();c.arc(14.5,-17.5,1.1,0,6.3);c.fill();c.beginPath();c.arc(23.5,-17.5,1.1,0,6.3);c.fill();
  }else if(a==='shades'){
    c.fillStyle=k[0];c.beginPath();c.ellipse(24,-10.5,5.6,3.6,.1,0,6.3);c.fill();
    c.strokeStyle=k[0];c.lineWidth=1.5;c.beginPath();c.moveTo(19,-11);c.lineTo(11,-12);c.stroke();
    c.fillStyle='rgba(255,255,255,.55)';c.fillRect(21.5,-12.7,2.6,1.1);
  }else if(a==='scarf'){
    c.beginPath();c.moveTo(7,-6);c.quadraticCurveTo(15,-1,12,6);c.lineTo(5,6);c.quadraticCurveTo(7,0,3,-4);c.closePath();c.fillStyle=k[0];c.fill();
    c.beginPath();c.moveTo(6,-1);c.quadraticCurveTo(-8,-4+fl,-20,-1+fl*1.7);c.lineTo(-19,5+fl*1.7);c.quadraticCurveTo(-8,3+fl,5,5);c.closePath();c.fill();
    c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-3-i*4,-1.5+fl*.3*i/3);c.lineTo(-3-i*4,4.5+fl*.3*i/3);c.stroke();}
  }else if(a==='helmet'){
    c.beginPath();c.moveTo(9.5,-8);c.quadraticCurveTo(9,-23,20,-22);c.quadraticCurveTo(29,-20,28,-11);c.quadraticCurveTo(19,-15,9.5,-8);c.closePath();c.fillStyle=k[0];c.fill();
    c.fillStyle='rgba(120,200,255,.85)';c.strokeStyle='#333';c.lineWidth=1.4;c.beginPath();c.arc(22.5,-16.5,3.4,0,6.3);c.fill();c.stroke();
    c.strokeStyle='#333';c.beginPath();c.moveTo(10,-12);c.lineTo(19,-17);c.stroke();
  }else if(a==='bandana'){
    c.beginPath();c.moveTo(10,-11);c.quadraticCurveTo(12,-21,21,-19.5);c.quadraticCurveTo(28,-18,28.5,-12);c.quadraticCurveTo(19,-15,10,-11);c.closePath();c.fillStyle=k[0];c.fill();
    c.beginPath();c.moveTo(11,-13);c.lineTo(2,-17+fl);c.lineTo(5,-11+fl);c.lineTo(0,-9+fl*1.4);c.lineTo(11,-9);c.closePath();c.fill();
    c.fillStyle='#fff';[[16,-16.5],[21,-17.5],[25,-14.5],[5,-12+fl*.6]].forEach(p=>{c.beginPath();c.arc(p[0],p[1],.9,0,6.3);c.fill();});
  }else if(a==='flowers'){
    const cols=['#ff7aa8','#ffd54a','#ffffff','#ff8a65','#ba68c8'];
    c.strokeStyle='#3c8d40';c.lineWidth=2;c.beginPath();c.arc(19,-8.5,9.4,Math.PI*1.02,Math.PI*1.98);c.stroke();
    for(let i=0;i<5;i++){const an=Math.PI*(1.08+i*.2);const x=19+Math.cos(an)*9.4,y=-8.5+Math.sin(an)*9.4;c.fillStyle=cols[i];c.beginPath();c.arc(x,y,2.5,0,6.3);c.fill();c.fillStyle='#ffeb3b';c.beginPath();c.arc(x,y,.9,0,6.3);c.fill();}
  }else if(a==='phones'){
    c.strokeStyle='#222';c.lineWidth=2.6;c.beginPath();c.arc(19,-8.5,9,Math.PI*1.05,Math.PI*1.95);c.stroke();
    c.fillStyle=k[0];c.beginPath();c.ellipse(14.5,-8,3,4.6,0,0,6.3);c.fill();c.strokeStyle='#222';c.lineWidth=1;c.stroke();
  }else if(a==='turban'){
    c.fillStyle=k[0];c.beginPath();c.ellipse(19,-17,10.5,6.2,-.08,0,6.3);c.fill();c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1;
    for(let i=0;i<3;i++){c.beginPath();c.arc(14+i*5,-21,8.5,.5,1.6);c.stroke();}
    c.beginPath();c.ellipse(19,-17,10.5,6.2,-.08,0,6.3);c.stroke();
    c.fillStyle='#c62828';c.beginPath();c.arc(26,-16,1.8,0,6.3);c.fill();
  }else if(a==='tophat'){
    c.fillStyle=k[0];c.fillRect(13.5,-35,11,17);c.beginPath();c.ellipse(19,-18,12.5,3,-.05,0,6.3);c.fill();
    c.fillStyle='#d32f2f';c.fillRect(13.5,-23,11,3.4);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(15,-34,2,14);
  }
}
function drawBird(c,x,y,rot,sk,wp,amp,sc){
  const fl=Math.sin(wp)*amp+.15,wob=Math.sin(wp*.8)*3;
  c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);
  accBack(c,sk,wob);
  for(let i=0;i<3;i++){c.save();c.translate(-19,3);c.rotate(Math.PI+(i-1)*.21+fl*.06);feather(c,[24,29,24][i],7,i===1?col(sk.c[2]):col(sk.c[2],.78),col(sk.c[2],.45));c.restore();}
  c.save();c.translate(4,-2);drawWing(c,fl*.8-.12,sk,true);c.restore();
  c.strokeStyle='#e9b43a';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(0,12);c.lineTo(-6,17);c.moveTo(0,12);c.lineTo(-1,18);c.moveTo(0,12);c.lineTo(5,17);c.stroke();
  const g=c.createLinearGradient(0,-15,0,16);g.addColorStop(0,col(sk.c[0]));g.addColorStop(.5,col(sk.c[0],1.05));g.addColorStop(.85,col(sk.c[1]));g.addColorStop(1,col(sk.c[1],.95));
  c.beginPath();c.moveTo(-22,2);c.bezierCurveTo(-18,-14,8,-16,20,-8);c.bezierCurveTo(27,-4,24,10,12,14);c.bezierCurveTo(0,18,-16,12,-22,2);c.closePath();c.fillStyle=g;c.fill();
  c.strokeStyle=col(sk.c[2],.8,.3);c.lineWidth=1;for(let i=0;i<3;i++)for(let j=0;j<3;j++){c.beginPath();c.arc(4+i*6-j*1.5,5+j*3.6,3,.3,2.85);c.stroke();}
  c.save();c.translate(-2,-4);drawWing(c,fl,sk,false);c.restore();
  c.fillStyle=col(sk.c[0],1.1);c.beginPath();c.arc(19,-9,8.6,0,6.3);c.fill();
  c.fillStyle=col(sk.c[2]);for(let i=0;i<3;i++){c.beginPath();c.moveTo(12+i*2.2,-14.5);c.lineTo(8+i*2.2-2,-21+i*1.2);c.lineTo(15+i*2.2,-16.5);c.closePath();c.fill();}
  c.fillStyle='#f0b93a';c.beginPath();c.moveTo(25,-12.5);c.bezierCurveTo(33,-12.5,38.5,-8,36.5,-.5);c.bezierCurveTo(35,-3.2,31,-5,26,-5.2);c.closePath();c.fill();
  c.fillStyle='#b8801a';c.beginPath();c.moveTo(26,-6.4);c.lineTo(32.5,-5.2);c.lineTo(27,-3.4);c.closePath();c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(22.5,-11,3.4,0,6.3);c.fill();
  c.fillStyle='#d98a00';c.beginPath();c.arc(23,-11,2.3,0,6.3);c.fill();c.fillStyle='#111';c.beginPath();c.arc(23.3,-11,1.3,0,6.3);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(23.9,-11.7,.6,0,6.3);c.fill();
  c.strokeStyle=col(sk.c[2],.7);c.lineWidth=1.6;c.beginPath();c.moveTo(18.5,-14.8);c.lineTo(27.4,-12.2);c.stroke();
  accFront(c,sk,wob,wp);
  c.restore();
}

/* ===== البيئة: وقت اليوم والطقس ===== */
const TT={
 day:{top:[79,179,255],bot:[200,236,255],light:1,sx:.75,sy:.17,sa:1,moon:0,stars:0},
 sunset:{top:[70,48,122],bot:[255,150,70],light:.6,sx:.7,sy:.6,sa:1,moon:0,stars:.15},
 night:{top:[5,10,36],bot:[32,48,98],light:.15,sx:.4,sy:.98,sa:0,moon:1,stars:1},
 dawn:{top:[52,62,128],bot:[255,176,150],light:.5,sx:.22,sy:.6,sa:1,moon:.25,stars:.3}
};
const ENV={top:[79,179,255],bot:[200,236,255],light:1,sx:.75,sy:.17,sa:1,moon:0,stars:0,grey:0,cloud:.3,rain:0,snow:0,T:null};
function envTarget(time,w){const t=TT[time];ENV.T={top:t.top,bot:t.bot,light:t.light,sx:t.sx,sy:t.sy,sa:t.sa,moon:t.moon,stars:t.stars,
  grey:w==='rain'?.55:w==='snow'?.4:0,cloud:w==='rain'?1:w==='snow'?.8:.3,rain:w==='rain'?1:0,snow:w==='snow'?1:0};}
function envUpdate(dt,quick){const k=quick?1:1-Math.exp(-dt*1.1),T=ENV.T;
  for(const q of['top','bot'])for(let i=0;i<3;i++)ENV[q][i]=lerp(ENV[q][i],T[q][i],k);
  for(const q of['light','sx','sy','sa','moon','stars','grey','cloud','rain','snow'])ENV[q]=lerp(ENV[q],T[q],k);}
envTarget('day','clear');

const rr=mulberry(11);
const CITY=(()=>{const it=[];let x=0;while(x<1500){const r=rr();
  if(r<.1){it.push({k:'dome',x,w:74,h:58+rr()*18});x+=80;}
  else if(r<.2){it.push({k:'min',x,w:11,h:104+rr()*40});x+=20;}
  else{const w=28+rr()*40;it.push({k:'b',x,w,h:28+rr()*74,s:rr()});x+=w+3;}}
  return{it,w:x};})();
const TREES=(()=>{const it=[];let x=20;while(x<1000){it.push({k:rr()<.62?'palm':'tree',x,h:60+rr()*50,l:(rr()-.5)*26});x+=60+rr()*90;}return{it,w:x+40};})();
const CLOUDS=Array.from({length:7},(_,i)=>({x:i*190+rr()*60,y:40+rr()*150,s:.7+rr()*.9,v:4+rr()*6}));
const STARS=Array.from({length:70},()=>({x:rr(),y:rr()*.55,r:.6+rr()*1.3,p:rr()*6}));
const RAIN=Array.from({length:130},()=>({x:rr()*500,y:rr()*H,v:620+rr()*260,l:10+rr()*12}));
const FLAKES=Array.from({length:100},()=>({x:rr()*500,y:rr()*H,v:40+rr()*60,r:1.2+rr()*2.2,p:rr()*6}));

function skyCols(){const gtop=[100,108,122].map(v=>v*(.3+.7*ENV.light)),gbot=[150,158,170].map(v=>v*(.3+.7*ENV.light));
  return{top:mixA(ENV.top,gtop,ENV.grey),bot:mixA(ENV.bot,gbot,ENV.grey)};}
const shadeK=()=>.38+.62*ENV.light;

function palm(c,x,base,h,lean,k,sn){
  const tx=x+lean,ty=base-h;c.lineCap='round';c.strokeStyle=col([108,76,44],k);c.lineWidth=6;
  c.beginPath();c.moveTo(x,base);c.quadraticCurveTo(x+lean*.15,base-h*.62,tx,ty);c.stroke();
  c.strokeStyle=col([70,48,28],k,.5);c.lineWidth=1;for(let i=1;i<7;i++){const t=i/7,px=lerp(x,tx,t*t),py=lerp(base,ty,t);c.beginPath();c.moveTo(px-3,py);c.lineTo(px+3,py);c.stroke();}
  const lc=mixA([36,125,62],[235,240,245],sn*.75);c.strokeStyle=col(lc,k);c.lineWidth=4;
  for(let i=-3;i<=3;i++){const a=-Math.PI/2+i*.5,L=34,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L+Math.abs(i)*6;
    c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*L*.55,ty+Math.sin(a)*L*.55-9,ex,ey);c.stroke();}
  c.fillStyle=col([90,60,30],k);c.beginPath();c.arc(tx,ty+2,3,0,6.3);c.fill();
}
function roundTree(c,x,base,h,k,sn){
  c.fillStyle=col([96,66,38],k);c.fillRect(x-3,base-h*.5,6,h*.5);
  const lc=mixA([46,130,66],[235,240,245],sn*.8);c.fillStyle=col(lc,k);
  c.beginPath();c.arc(x,base-h*.62,h*.3,0,6.3);c.arc(x-h*.2,base-h*.45,h*.22,0,6.3);c.arc(x+h*.2,base-h*.45,h*.22,0,6.3);c.fill();
}
function drawBackdrop(c,W,cam,t){
  const sc=skyCols(),k=shadeK();
  const g=c.createLinearGradient(0,0,0,GY);g.addColorStop(0,col(sc.top));g.addColorStop(1,col(sc.bot));c.fillStyle=g;c.fillRect(-5,-5,W+10,H+10);
  if(ENV.stars>.03){for(const s of STARS){c.fillStyle='rgba(255,255,255,'+(ENV.stars*(.5+.5*Math.sin(t*2+s.p))*(1-ENV.grey))+')';c.beginPath();c.arc(s.x*W,s.y*H,s.r,0,6.3);c.fill();}}
  if(ENV.sa>.03){const x=ENV.sx*W,y=ENV.sy*H;const gr=c.createRadialGradient(x,y,6,x,y,90);gr.addColorStop(0,'rgba(255,230,150,'+.7*ENV.sa*(1-ENV.grey)+')');gr.addColorStop(1,'rgba(255,200,100,0)');
    c.fillStyle=gr;c.fillRect(x-100,y-100,200,200);c.fillStyle='rgba(255,236,160,'+ENV.sa*(1-ENV.grey*.8)+')';c.beginPath();c.arc(x,y,26,0,6.3);c.fill();}
  if(ENV.moon>.03){const x=W*.24,y=H*.17;c.fillStyle='rgba(240,244,255,'+ENV.moon*(1-ENV.grey*.7)+')';c.beginPath();c.arc(x,y,22,0,6.3);c.fill();
    c.fillStyle=col(sc.top,1,ENV.moon);c.beginPath();c.arc(x+9,y-5,19,0,6.3);c.fill();}
  const cc=mixA([255,255,255],[150,156,168],ENV.grey);
  for(const cl of CLOUDS){const x=((cl.x-cam*.08-t*cl.v)%(W+300)+W+300)%(W+300)-150;c.fillStyle=col(cc,.4+.6*ENV.light,.25+.7*ENV.cloud);
    c.beginPath();c.arc(x,cl.y,22*cl.s,0,6.3);c.arc(x+22*cl.s,cl.y+4,18*cl.s,0,6.3);c.arc(x-22*cl.s,cl.y+6,16*cl.s,0,6.3);c.arc(x+4*cl.s,cl.y-10*cl.s,18*cl.s,0,6.3);c.fill();}
  const cityC=mixA(ENV.bot,[45,55,85].map(v=>v*(.35+.65*ENV.light)),.62),cb=GY-4;
  let off=-((cam*.16)%CITY.w);
  for(let ox=off;ox<W;ox+=CITY.w)for(const b of CITY.it){const x=ox+b.x;if(x>W+90||x<-90)continue;
    c.fillStyle=col(cityC);
    if(b.k==='b'){c.fillRect(x,cb-b.h,b.w,b.h);
      if(ENV.light<.7){c.fillStyle='rgba(255,214,120,'+(.75*(1-ENV.light))+')';for(let wy=cb-b.h+8;wy<cb-8;wy+=11)for(let wx=x+5;wx<x+b.w-5;wx+=9)if(((wx*7+wy*3+b.s*100)|0)%3)c.fillRect(wx,wy,3,4);}}
    else if(b.k==='dome'){c.fillRect(x,cb-34,b.w,34);c.fillStyle=col(mixA(cityC,[220,170,60],.55*ENV.light));c.beginPath();c.ellipse(x+b.w/2,cb-34,b.w*.42,b.h-34,0,Math.PI,0);c.fill();c.fillRect(x+b.w/2-1,cb-b.h-9,2,10);
      c.fillStyle=col(cityC);c.fillRect(x-4,cb-62,7,62);c.fillRect(x+b.w-3,cb-62,7,62);}
    else{c.fillRect(x,cb-b.h,b.w,b.h);c.fillRect(x-3,cb-b.h+22,b.w+6,4);c.beginPath();c.moveTo(x,cb-b.h);c.lineTo(x+b.w/2,cb-b.h-18);c.lineTo(x+b.w,cb-b.h);c.fill();}
  }
  off=-((cam*.42)%TREES.w);
  for(let ox=off;ox<W+60;ox+=TREES.w)for(const tr of TREES.it){const x=ox+tr.x;if(x>W+70||x<-70)continue;
    if(tr.k==='palm')palm(c,x,GY+3,tr.h,tr.l,k,ENV.snow);else roundTree(c,x,GY+3,tr.h,k,ENV.snow);}
}
function drawGround(c,W,cam){
  const k=shadeK(),gc=mixA([118,152,66],[240,244,250],ENV.snow*.92);
  const g=c.createLinearGradient(0,GY,0,H);g.addColorStop(0,col(gc,k*1.05));g.addColorStop(1,col(mixA(gc,[90,70,40],.55),k));c.fillStyle=g;c.fillRect(-5,GY,W+10,H-GY+5);
  c.fillStyle=col(mixA(gc,[60,80,30],.5),k);c.fillRect(-5,GY,W+10,5);
  c.strokeStyle=col(mixA(gc,[60,80,30],.5),k,.7);c.lineWidth=2;
  const o=-(cam%46);for(let x=o;x<W+46;x+=46){c.beginPath();c.moveTo(x,GY+5);c.lineTo(x-4,GY+13);c.moveTo(x+5,GY+5);c.lineTo(x+7,GY+14);c.stroke();}
  c.fillStyle=col([90,64,38],k,.5);const o2=-(cam%130);for(let x=o2;x<W+130;x+=130){c.beginPath();c.ellipse(x+40,GY+36,9,3.5,0,0,6.3);c.fill();}
}
function partsUpdate(dt,W,speed){
  for(const r of RAIN){r.y+=r.v*dt;r.x-=speed*.2*dt;if(r.y>H){r.y=-20;r.x=Math.random()*(W+100);}if(r.x<-20)r.x=W+20;}
  for(const f of FLAKES){f.y+=f.v*dt;f.p+=dt;f.x+=Math.sin(f.p*1.5)*18*dt-speed*.1*dt;if(f.y>H){f.y=-10;f.x=Math.random()*(W+100);}if(f.x<-10)f.x=W+10;}
}
function partsDraw(c,W,low){
  if(ENV.rain>.04){c.strokeStyle='rgba(190,215,255,'+.55*ENV.rain+')';c.lineWidth=1.3;c.beginPath();const n=low?60:RAIN.length;for(let i=0;i<n;i++){const r=RAIN[i];c.moveTo(r.x,r.y);c.lineTo(r.x-r.l*.22,r.y-r.l);}c.stroke();}
  if(ENV.snow>.04){c.fillStyle='rgba(255,255,255,'+.9*ENV.snow+')';const n=low?50:FLAKES.length;for(let i=0;i<n;i++){const f=FLAKES[i];c.beginPath();c.arc(f.x,f.y,f.r,0,6.3);c.fill();}}
}
function bricks(c,x,w,y0,y1,k){c.strokeStyle=col([120,84,40],k,.42);c.lineWidth=1.4;const dir=y1>y0?1:-1;let row=0;
  for(let y=y0;dir>0?y<y1:y>y1;y+=24*dir,row++){c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();const jx=x+(row%2?w*.3:w*.7);c.beginPath();c.moveTo(jx,y);c.lineTo(jx,y+24*dir);c.stroke();}}
function drawPipe(c,p){
  const k=shadeK(),top=p.gapY-p.gap/2,bot=p.gapY+p.gap/2,x=p.x,w=p.w;
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,col([238,198,122],k));g.addColorStop(.35,col([214,168,95],k));g.addColorStop(1,col([146,104,50],k));
  c.fillStyle=g;c.fillRect(x,-30,w,top+30);c.fillRect(x,bot,w,GY-bot+2);
  bricks(c,x,w,top-26,-30,k);bricks(c,x,w,bot+26,GY,k);
  c.fillRect(x-6,top-26,w+12,26);c.fillRect(x-6,bot,w+12,26);
  c.fillStyle=col([236,192,86],k);c.fillRect(x-6,top-9,w+12,4);c.fillRect(x-6,bot+5,w+12,4);
  c.strokeStyle=col([90,60,26],k,.6);c.lineWidth=1.5;c.strokeRect(x-6,top-26,w+12,26);c.strokeRect(x-6,bot,w+12,26);
  c.fillStyle=col([236,192,86],k);for(let i=0;i<4;i++){const px=x-2+i*(w-4)/3.2;c.beginPath();c.moveTo(px,top-14);c.lineTo(px+3,top-20);c.lineTo(px+6,top-14);c.closePath();c.fill();c.beginPath();c.moveTo(px,bot+14);c.lineTo(px+3,bot+20);c.lineTo(px+6,bot+14);c.closePath();c.fill();}
  if(ENV.snow>.3){c.fillStyle='rgba(255,255,255,'+Math.min(1,ENV.snow)*.95+')';c.beginPath();c.roundRect?c.roundRect(x-8,bot-4,w+16,7,3):c.rect(x-8,bot-4,w+16,7);c.fill();}
}
function drawCoin(c,o,t){
  const sx=Math.max(.18,Math.abs(Math.cos(t*4+o.ph)));c.save();c.translate(o.x,o.y);c.scale(sx,1);
  const g=c.createRadialGradient(-3,-3,1,0,0,11);g.addColorStop(0,'#fff3b0');g.addColorStop(.6,'#f2c14e');g.addColorStop(1,'#b8861a');
  c.fillStyle=g;c.beginPath();c.arc(0,0,10,0,6.3);c.fill();c.strokeStyle='#8a5e0c';c.lineWidth=1.5;c.stroke();
  c.strokeStyle='rgba(138,94,12,.7)';c.lineWidth=1.2;c.beginPath();c.arc(0,0,6.3,0,6.3);c.stroke();c.restore();
}
const PUPC={magnet:['#ff5252','🧲'],shield:['#40c4ff','🛡️'],slow:['#b388ff','⏳']};
function drawPickup(c,o,t){
  const y=o.y+Math.sin(t*3+o.ph)*4,cl=PUPC[o.type][0];
  const g=c.createRadialGradient(o.x,y,2,o.x,y,26);g.addColorStop(0,cl);g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=.55;c.fillStyle=g;c.fillRect(o.x-28,y-28,56,56);c.globalAlpha=1;
  c.fillStyle='rgba(10,20,50,.78)';c.beginPath();c.arc(o.x,y,15,0,6.3);c.fill();c.strokeStyle=cl;c.lineWidth=2.4;c.stroke();
  c.font='17px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(PUPC[o.type][1],o.x,y+1);
}
