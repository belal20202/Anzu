'use strict';
/* الرسم: الطائر، الأزياء العصرية، المدينة الحديثة، العوائق */
const H=640,GY=570;
const col=(a,k=1,al=1)=>'rgba('+(a[0]*k|0)+','+(a[1]*k|0)+','+(a[2]*k|0)+','+al+')';
const mixA=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const rrect=(c,x,y,w,h,r)=>{c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);};
const dot=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,6.3);c.fill();};

/* ===== ألوان الريش: ظهر، بطن، جناح، لون مميز ===== */
const PAL={
 def:[[26,150,176],[250,164,56],[22,78,160],[32,200,210]],
 blu:[[40,100,210],[150,205,255],[24,56,150],[90,160,255]],
 red:[[210,60,50],[255,190,90],[140,30,40],[255,120,70]],
 grn:[[60,170,80],[230,225,110],[24,110,60],[150,225,90]],
 vio:[[130,70,200],[255,170,200],[80,40,140],[190,120,255]],
 blk:[[40,44,56],[110,120,140],[22,24,34],[80,200,255]],
 gld:[[230,170,40],[255,230,150],[170,110,20],[255,210,70]],
 pnk:[[230,90,150],[255,205,215],[160,40,100],[255,140,190]],
 org:[[245,125,40],[255,215,120],[170,70,20],[255,170,60]]
};
/* ===== 20 زياً بموديلات حديثة ===== */
const SKINS=[
 {n:'الأصلي',c:PAL.def,p:0},
 {n:'كاجوال',c:PAL.def,front:['h_cap'],pc:{h_cap:['#e53935','#b71c1c']},p:2000},
 {n:'ستريت',c:PAL.blk,gar:['b_hood'],front:['h_hood'],mid:['m_chain'],pc:{b_hood:['#2f3640','#566074'],h_hood:['#2f3640','#566074']},p:2500},
 {n:'شتوي',c:PAL.blu,front:['h_beanie'],mid:['m_scarf'],pc:{h_beanie:['#e65100','#ffd180'],m_scarf:['#e65100','#ffd180']},p:3000},
 {n:'رياضي',c:PAL.red,gar:['b_jersey'],front:['h_headband'],pc:{b_jersey:['#1565c0','#fafafa'],h_headband:['#fafafa']},p:3500},
 {n:'دي جي',c:PAL.vio,front:['h_phones'],mid:['m_chain'],pc:{h_phones:['#00e5ff']},p:4000},
 {n:'غيمر',c:PAL.grn,front:['h_headset'],pc:{h_headset:['#76ff03']},p:5000},
 {n:'صيفي',c:PAL.org,front:['h_shades','h_cap'],pc:{h_shades:['#111'],h_cap:['#fdd835','#f9a825']},p:5500},
 {n:'طيار',c:PAL.blu,gar:['b_jacket'],front:['h_pilot'],pc:{b_jacket:['#6b4a2b','#c9a27a'],h_pilot:['#6b4a2b']},p:6000},
 {n:'سباق',c:PAL.red,gar:['b_race'],front:['h_racehelm'],pc:{b_race:['#d32f2f','#ffd600'],h_racehelm:['#d32f2f','#fafafa']},p:7000},
 {n:'دراج',c:PAL.grn,back:['k_backpack'],mid:['m_strap'],front:['h_bikehelm'],pc:{k_backpack:['#37474f','#ff6d00'],m_strap:['#ff6d00'],h_bikehelm:['#00c853','#1b5e20']},p:7500},
 {n:'فنان',c:PAL.pnk,mid:['m_scarf'],front:['h_beret'],pc:{m_scarf:['#212121','#ff7043'],h_beret:['#c62828']},p:8500},
 {n:'غوّاص',c:PAL.blu,gar:['b_wetsuit'],front:['h_dive'],pc:{b_wetsuit:['#1d2430','#00b0ff'],h_dive:['#00b0ff','#ffd600']},p:9500},
 {n:'مبرمج',c:PAL.blk,gar:['b_hood'],front:['h_vr'],pc:{b_hood:['#263238','#37474f'],h_vr:['#00e5ff']},p:11000},
 {n:'شيف',c:PAL.org,gar:['b_apron'],mid:['m_scarf'],front:['h_chef'],pc:{m_scarf:['#d32f2f','#d32f2f']},p:12000},
 {n:'خريج',c:PAL.def,gar:['b_gown'],front:['h_grad'],pc:{h_grad:['#ffc400']},p:13500},
 {n:'رجل أعمال',c:PAL.blk,gar:['b_suit'],front:['h_fedora'],pc:{b_suit:['#263238','#c62828'],h_fedora:['#212121','#c62828']},p:15000},
 {n:'رائد فضاء',c:PAL.blu,back:['k_backpack'],gar:['b_astro'],front:['h_astro'],pc:{k_backpack:['#cfd8dc','#ff6d00'],b_astro:['#ff6d00'],h_astro:['#ff6d00']},p:17000},
 {n:'نجم الملعب',c:PAL.gld,gar:['b_jersey'],mid:['m_chain'],front:['h_cap'],pc:{b_jersey:['#0d47a1','#ffd600'],h_cap:['#0d47a1','#ffd600']},p:20000},
 {n:'نجم الموضة',c:PAL.gld,gar:['b_jacket'],mid:['m_chain'],front:['h_shades'],pc:{b_jacket:['#111','#ffd54a'],h_shades:['#ffd54a']},p:25000}
];

/* ===== أجزاء الأزياء (h_ للرأس، b_ للجسم، m_ للرقبة، k_ للخلف) ===== */
function featherU(c,len,wid,fill){c.save();c.scale(len,wid);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(.3,-1,.9,-.9,1,0);c.bezierCurveTo(.9,.9,.3,1,0,0);c.fillStyle=fill;c.fill();c.restore();}
function bodyPath(c){c.beginPath();c.moveTo(-15,1);c.bezierCurveTo(-14,-12,8,-15,15,-6);c.bezierCurveTo(20,0,14,13,2,14);c.bezierCurveTo(-8,15,-14,9,-15,1);c.closePath();}
const clipBody=(c,fn)=>{c.save();bodyPath(c);c.clip();fn();c.restore();};
const ACC={
 h_cap(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.moveTo(-9.8,-3);c.bezierCurveTo(-11,-15,0,-19,6,-14);c.lineTo(7.5,-8.5);c.quadraticCurveTo(-2,-9,-9.8,-3);c.closePath();c.fill();
  c.fillStyle=k[1];c.beginPath();c.moveTo(5.5,-11.5);c.quadraticCurveTo(14,-12.5,17,-9.5);c.lineTo(16.5,-8);c.quadraticCurveTo(10,-9.5,5,-8.5);c.closePath();c.fill();dot(c,-1.5,-17,1.4,k[1]);},
 h_beanie(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.moveTo(-10.2,-2);c.bezierCurveTo(-12,-17,2,-20,8,-9);c.lineTo(8,-6);c.quadraticCurveTo(-1,-9,-10,-1);c.closePath();c.fill();
  c.fillStyle=k[1];c.beginPath();c.moveTo(-10.4,-4);c.quadraticCurveTo(-1,-10.5,8,-8.4);c.lineTo(7.7,-4.8);c.quadraticCurveTo(-1,-7.6,-10.1,-1.2);c.closePath();c.fill();dot(c,-2.5,-18.5,3.2,k[1]);},
 h_shades(c,s,fl,wp,k){c.strokeStyle=k[0];c.lineWidth=1.5;c.beginPath();c.moveTo(0,-1.2);c.lineTo(-9,-2.4);c.stroke();c.fillStyle=k[0];c.beginPath();c.ellipse(4.6,-.8,4.7,3.3,.1,0,6.3);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(3.4,-2,1.8,.9,-.3,0,6.3);c.fill();},
 h_phones(c,s,fl,wp,k){c.strokeStyle='#22262c';c.lineWidth=3;c.beginPath();c.arc(0,-1,10.4,Math.PI*1.1,Math.PI*1.95);c.stroke();c.fillStyle='#22262c';c.beginPath();c.ellipse(-2.6,.4,4.2,5.4,0,0,6.3);c.fill();dot(c,-2.6,.4,2.4,k[0]);},
 h_headset(c,s,fl,wp,k){ACC.h_phones(c,s,fl,wp,k);c.strokeStyle='#22262c';c.lineWidth=1.8;c.beginPath();c.moveTo(-2.6,5);c.quadraticCurveTo(0,9,5,7);c.stroke();dot(c,5.6,7,1.8,k[0]);},
 h_hood(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.arc(-1.5,-1.5,13.3,0,6.3);c.moveTo(11.6,-1.2);c.arc(2.3,-1.2,9.3,0,6.3,true);c.fill('evenodd');c.strokeStyle=k[1];c.lineWidth=1.4;c.beginPath();c.moveTo(3,9);c.lineTo(3.5,15);c.moveTo(6,8.5);c.lineTo(7,14);c.stroke();},
 h_racehelm(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.ellipse(-1,-2,11.6,12,0,0,6.3);c.fill();c.fillStyle=k[1];c.fillRect(-12,-11,24,2.6);c.fillStyle='#10161c';c.beginPath();c.ellipse(4.6,-2.2,7.2,4.4,.05,0,6.3);c.fill();dot(c,4.8,-.7,1.6,'rgba(255,210,60,.7)');c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(2.5,-4.2,3,1,-.2,0,6.3);c.fill();},
 h_bikehelm(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.moveTo(-12.5,-1);c.bezierCurveTo(-12,-14,2,-17,8,-12);c.lineTo(8,-8.5);c.bezierCurveTo(0,-9.5,-8,-6,-12.5,-1);c.closePath();c.fill();
  c.fillStyle=k[1];for(let i=0;i<3;i++){c.beginPath();c.ellipse(-6+i*4.2,-11.5+i*.6,1.3,3,-.5,0,6.3);c.fill();}c.strokeStyle='#222';c.lineWidth=1.2;c.beginPath();c.moveTo(-4,-7);c.lineTo(-2,4);c.stroke();},
 h_astro(c,s,fl,wp,k){c.fillStyle='rgba(150,210,255,.22)';c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.4;c.beginPath();c.arc(.5,-1,14.2,0,6.3);c.fill();c.stroke();c.fillStyle=k[0];c.beginPath();c.ellipse(0,12,11.5,3.4,0,0,6.3);c.fill();
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.6;c.beginPath();c.arc(.5,-1,11,Math.PI*1.12,Math.PI*1.42);c.stroke();},
 h_vr(c,s,fl,wp,k){c.strokeStyle='#1c1f26';c.lineWidth=3;c.beginPath();c.arc(0,-1,10.2,Math.PI*1.02,Math.PI*1.9);c.stroke();c.fillStyle='#1c1f26';rrect(c,0,-5.6,11,9,2.5);c.fill();c.fillStyle=k[0];rrect(c,2,-3.2,7,3.2,1.5);c.fill();},
 h_chef(c,s,fl,wp,k){c.fillStyle='#f4f4f4';c.fillRect(-8,-14,15,5);[[-6,-18,5],[0,-21,6],[6,-18,5]].forEach(p=>dot(c,p[0],p[1],p[2],'#f4f4f4'));c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-8,-11,15,2);},
 h_grad(c,s,fl,wp,k){c.fillStyle='#16181d';c.beginPath();c.ellipse(0,-10,7.5,3,0,0,6.3);c.fill();c.beginPath();c.moveTo(-12,-13);c.lineTo(0,-17.5);c.lineTo(12,-13);c.lineTo(0,-9);c.closePath();c.fill();
  c.strokeStyle=k[0];c.lineWidth=1.2;c.beginPath();c.moveTo(0,-13.2);c.lineTo(10.5,-12.2);c.lineTo(10.5,-6);c.stroke();c.fillStyle=k[0];c.fillRect(9.4,-6.5,2.2,4.5);},
 h_dive(c,s,fl,wp,k){c.strokeStyle=k[1];c.lineWidth=2.6;c.beginPath();c.moveTo(-6,-4);c.lineTo(-12,-18);c.stroke();dot(c,-12,-18,1.8,k[1]);c.strokeStyle=k[0];c.lineWidth=2.2;c.beginPath();c.moveTo(-1,-.8);c.lineTo(-10,-3);c.stroke();
  c.fillStyle='rgba(120,210,255,.3)';c.beginPath();c.ellipse(4.6,-.8,6.2,4.8,.05,0,6.3);c.fill();c.stroke();},
 h_beret(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.ellipse(-1,-12,10.5,4.4,-.15,0,6.3);c.fill();dot(c,-4,-16.2,1.2,k[0]);c.strokeStyle='#222';c.lineWidth=1.2;c.beginPath();c.arc(4.4,-.8,3.7,0,6.3);c.moveTo(.7,-.8);c.lineTo(-9,-2.4);c.stroke();c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.arc(4.4,-.8,3.4,0,6.3);c.fill();},
 h_fedora(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.ellipse(0,-10,13.4,3.4,-.05,0,6.3);c.fill();rrect(c,-7,-21,14,12,3);c.fill();c.fillStyle=k[1];c.fillRect(-7,-13,14,3);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(-1.5,-21,3,3);},
 h_headband(c,s,fl,wp,k){c.strokeStyle=k[0];c.lineWidth=3.4;c.beginPath();c.moveTo(-9.5,-4);c.quadraticCurveTo(0,-11.5,9,-6);c.stroke();},
 h_pilot(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.moveTo(-10.4,3);c.bezierCurveTo(-12,-15,2,-18,8,-9);c.lineTo(5,-8);c.quadraticCurveTo(-3,-9,-6,-2);c.lineTo(-6,4);c.closePath();c.fill();
  c.strokeStyle='#333';c.lineWidth=1.6;c.beginPath();c.moveTo(-9,-5);c.lineTo(3,-7.6);c.stroke();c.fillStyle='rgba(120,200,255,.55)';c.beginPath();c.arc(3,-7.6,3.5,0,6.3);c.fill();c.stroke();},
 b_hood(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-8,40,30);c.fillStyle=k[1];rrect(c,-8,3,16,9,3);c.fill();});},
 b_jersey(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-7,40,30);c.fillStyle=k[1];for(let x=-16;x<20;x+=7)c.fillRect(x,-7,3,30);});c.fillStyle=k[1];c.font='700 9px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('10',2,4);},
 b_jacket(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-6,40,30);});c.fillStyle=k[1];c.beginPath();c.moveTo(7,-9);c.lineTo(13,-6);c.lineTo(10,0);c.closePath();c.fill();c.beginPath();c.moveTo(14,-7);c.lineTo(18,-3);c.lineTo(13,0);c.closePath();c.fill();c.strokeStyle='#9aa0a8';c.lineWidth=1;c.beginPath();c.moveTo(11,0);c.lineTo(9,13);c.stroke();},
 b_race(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-7,40,30);c.fillStyle=k[1];c.fillRect(-18,1,40,3);dot(c,-3,8,3.4,'#fafafa');});c.fillStyle='#111';c.font='700 5px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('7',-3,8.2);},
 b_wetsuit(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-6,40,30);c.fillStyle=k[1];c.fillRect(-18,2,40,2.5);});},
 b_apron(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle='#f4f4f4';c.fillRect(-18,-6,40,30);});dot(c,9,0,1.1,'#444');dot(c,9,4,1.1,'#444');dot(c,4,0,1.1,'#444');dot(c,4,4,1.1,'#444');},
 b_gown(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle='#16181d';c.fillRect(-18,-5,40,30);});},
 b_suit(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-6,40,30);});c.fillStyle='#f2f2f2';c.beginPath();c.moveTo(8,-7);c.lineTo(15,-7);c.lineTo(11.5,6);c.closePath();c.fill();c.fillStyle=k[1];c.beginPath();c.moveTo(10.6,-5);c.lineTo(12.4,-5);c.lineTo(13,3);c.lineTo(11.5,5.6);c.lineTo(10,3);c.closePath();c.fill();},
 b_astro(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle='#eceff1';c.fillRect(-18,-6,40,30);c.fillStyle=k[0];rrect(c,2,0,9,6,1.5);c.fill();});},
 m_chain(c){c.strokeStyle='#ffd54a';c.lineWidth=1.6;c.beginPath();c.arc(11,-4,7,.2,2.9);c.stroke();c.fillStyle='#ffd54a';c.beginPath();c.moveTo(11,4);c.lineTo(14,7);c.lineTo(11,11);c.lineTo(8,7);c.closePath();c.fill();},
 m_scarf(c,s,fl,wp,k){c.fillStyle=k[0];c.beginPath();c.ellipse(9,-1,7,4.4,.5,0,6.3);c.fill();c.beginPath();c.moveTo(5,0);c.quadraticCurveTo(-8,-1+fl,-18,2+fl*1.6);c.lineTo(-17,8+fl*1.6);c.quadraticCurveTo(-6,5+fl,6,6);c.closePath();c.fill();c.fillStyle=k[1];c.fillRect(-4,2+fl*.4,2,4);c.fillRect(-10,2+fl*.8,2,4);},
 m_strap(c,s,fl,wp,k){c.strokeStyle=k[0];c.lineWidth=2.6;c.beginPath();c.moveTo(-6,-10);c.quadraticCurveTo(4,-2,5,12);c.stroke();},
 k_backpack(c,s,fl,wp,k){c.fillStyle=k[0];rrect(c,-19,-9,12,18,3);c.fill();c.fillStyle=k[1];rrect(c,-18,2,9,5,1.5);c.fill();}
};

/* ===== تلميع الطائر ===== */
const GC=document.createElement('canvas').getContext('2d');
function prep(sk){
  if(sk.g)return;const c=sk.c;
  const mk=(a,k0,k1,k2)=>{const g=GC.createLinearGradient(0,0,1,0);g.addColorStop(0,col(a,k0));g.addColorStop(.5,col(a,k1));g.addColorStop(1,col(a,k2));return g;};
  const body=GC.createLinearGradient(0,-15,0,15);body.addColorStop(0,col(c[0],.9));body.addColorStop(.45,col(c[0],1.08));body.addColorStop(.62,col(mixA(c[0],c[1],.55)));body.addColorStop(.82,col(c[1],1.02));body.addColorStop(1,col(c[1],.9));
  const head=GC.createLinearGradient(0,-17,0,2);head.addColorStop(0,col(c[0],1.1));head.addColorStop(1,col(mixA(c[0],c[1],.35)));
  sk.g={wing:mk(c[2],1.2,.95,.5),far:mk(c[2],.7,.55,.38),tail:mk(c[0],.85,1.05,.7),crest:mk(c[3],.8,1.1,1),body,head};
}
/* جناح بمفصل: الذراع يتحرك، والريش ينفرد ويتأخر عند الطرف، وينطوي عند الصعود */
function drawWing(c,ang,sp,lag,sk,far){
  const L=[19,24,29,33,36,37,34];
  for(let i=0;i<7;i++){c.save();c.rotate(Math.PI+ang+(i-3)*.12*sp+lag*(i/6));featherU(c,L[i],5.6,far?sk.g.far:sk.g.wing);c.restore();}
  if(far)return;
  c.save();c.rotate(Math.PI+ang*.8+.2);for(let k=0;k<4;k++){c.save();c.rotate((k-1.5)*.16*sp);featherU(c,16-k*1.5,5,sk.g.wing);c.restore();}c.restore();
  c.save();c.rotate(Math.PI+ang);for(let k=0;k<4;k++){c.fillStyle=col(sk.c[3],.95-k*.04);c.beginPath();c.ellipse(8+k*5.5,0,5,6.5-k*.6,0,0,6.3);c.fill();}
  c.fillStyle=col(sk.c[2],1.25);for(let k=0;k<3;k++){c.beginPath();c.ellipse(6+k*5,-.5,3.6,4.6-k*.4,0,0,6.3);c.fill();}c.restore();
}
function drawBird(c,x,y,rot,sk,fp,amp,sc){
  prep(sk);
  const s=Math.sin(fp),cs=Math.cos(fp),ang=.2-1.05*amp*s,sp=1-(1-(.65+.35*s))*amp,lag=.5*amp*cs,sw=Math.sin(fp*.6)*1.8,fl=Math.sin(fp*.8)*2.5;
  const piece=n=>{c.save();if(n.charAt(0)==='h')c.translate(14,-8);ACC[n](c,sk,fl,fp,(sk.pc&&sk.pc[n])||sk.ac||['#888','#555']);c.restore();};
  c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);c.lineCap='round';
  (sk.back||[]).forEach(piece);
  for(let i=0;i<3;i++){c.save();c.translate(-13,3);c.rotate(Math.PI+(i-1)*.2);featherU(c,17,4.6,sk.g.tail);c.restore();}
  for(let q=-1;q<=1;q+=2){const ex=-47,ey=4+q*5+sw*q;c.strokeStyle=col(sk.c[2],.95);c.lineWidth=1.8;c.beginPath();c.moveTo(-13,3);c.quadraticCurveTo(-28,3+q*2.5,ex,ey);c.stroke();c.fillStyle=col(sk.c[3]);c.beginPath();c.ellipse(ex-3,ey,6,2.7,q*.2,0,6.3);c.fill();}
  c.save();c.translate(2,-2);drawWing(c,ang*.85-.1,sp,lag,sk,true);c.restore();
  c.strokeStyle='#e8782a';c.lineWidth=2;c.beginPath();c.moveTo(1,12);c.lineTo(-3,17);c.lineTo(-6,17.5);c.moveTo(-3,17);c.lineTo(-5,19.5);c.stroke();
  bodyPath(c);c.fillStyle=sk.g.body;c.fill();
  for(let r=0;r<3;r++)for(let j=0;j<4;j++){c.save();c.translate(2+j*4.6-r*1.4,2+r*3.8);c.rotate(Math.PI/2-.3);featherU(c,7,2.6,col(sk.c[1],1.08,.28));c.restore();}
  (sk.gar||[]).forEach(piece);
  c.save();c.translate(-3,-4);drawWing(c,ang,sp,lag,sk,false);c.restore();
  (sk.mid||[]).forEach(piece);
  c.fillStyle=sk.g.head;c.beginPath();c.arc(14,-8,9.5,0,6.3);c.fill();c.beginPath();c.ellipse(9,-2,8,8,0,0,6.3);c.fill();
  c.fillStyle=col(sk.c[1]);c.beginPath();c.ellipse(16,-1.3,5.4,3.2,.2,0,6.3);c.fill();
  for(let i=0;i<3;i++){c.save();c.translate(9+i*2,-15.5+i*.6);c.rotate(-1.9-i*.3+Math.sin(fp*.7+i)*.08);featherU(c,[13,16,12][i],2.6,sk.g.crest);c.restore();}
  c.fillStyle='#0c2630';c.beginPath();c.ellipse(17.2,-8.4,6.8,3.4,-.12,0,6.3);c.fill();
  c.fillStyle='#1b2125';c.beginPath();c.moveTo(21.5,-11.2);c.quadraticCurveTo(30,-10.5,37.5,-6.6);c.quadraticCurveTo(30,-5.2,21.5,-4.6);c.closePath();c.fill();
  c.fillStyle='#34414a';c.beginPath();c.moveTo(21.5,-11.2);c.quadraticCurveTo(30,-10.5,37.5,-6.6);c.quadraticCurveTo(30,-8.4,21.5,-7.6);c.closePath();c.fill();
  dot(c,18.8,-8.6,2.5,'#ffd23a');dot(c,19.1,-8.6,1.3,'#111');dot(c,19.7,-9.3,.5,'#fff');
  (sk.front||[]).forEach(piece);
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
const TREES=(()=>{const it=[];let x=20;while(x<1000){it.push({k:rr()<.4?'palm':'tree',x,h:60+rr()*50,l:(rr()-.5)*26});x+=60+rr()*90;}return{it,w:x+40};})();
const CLOUDS=Array.from({length:7},(_,i)=>({x:i*190+rr()*60,y:40+rr()*150,s:.7+rr()*.9,v:4+rr()*6}));
const STARS=Array.from({length:70},()=>({x:rr(),y:rr()*.55,r:.6+rr()*1.3,p:rr()*6}));
const RAIN=Array.from({length:130},()=>({x:rr()*500,y:rr()*H,v:620+rr()*260,l:10+rr()*12}));
const FLAKES=Array.from({length:100},()=>({x:rr()*500,y:rr()*H,v:40+rr()*60,r:1.2+rr()*2.2,p:rr()*6}));
const CARS=[{o:0,l:0,c:[220,60,60],s:1.9},{o:500,l:0,c:[60,120,220],s:1.9},{o:260,l:1,c:[235,235,235],s:.6},{o:760,l:1,c:[250,200,40],s:.6}];

/* ===== مدينة حديثة تُرسم مرة واحدة على لوحة خفية (أداء عالٍ) ===== */
const RS=1.4;
function mkTile(w,h,fn){
  const mk=()=>{const k=document.createElement('canvas');k.width=Math.round(w*RS);k.height=Math.round(h*RS);const x=k.getContext('2d');x.scale(RS,RS);return[k,x];};
  const t={w,h,det:mk(),win:mk(),out:mk(),key:'',last:-9};fn(t.det[1],t.win[1],w,h);t.out[1].setTransform(1,0,0,1,0,0);return t;
}
function farCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h,c)=>{l.fillStyle=c||'#ffd98a';l.fillRect(x,y,w,h);};
  const glow=(x,y,r,a)=>{const g=l.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba(255,240,180,'+a+')');g.addColorStop(1,'rgba(255,240,180,0)');l.fillStyle=g;l.fillRect(x-r,y-r,r*2,r*2);};
  const B=H-26;
  /* نهر */
  const rg=d.createLinearGradient(0,B,0,H);rg.addColorStop(0,'#5b93bd');rg.addColorStop(1,'#2f6590');d.fillStyle=rg;d.fillRect(0,B,W,26);
  d.fillStyle='rgba(255,255,255,.28)';for(let x=0;x<W;x+=26)d.fillRect(x+(x*7%13),B+5+(x*3%14),14,1.6);
  R(0,B-3,W,3,'#8f979f');
  const bld=(x,w,h,bc,gl,top)=>{R(x,B-h,w,h,bc);R(x,B-h,3,h,'rgba(255,255,255,.18)');R(x+w-3,B-h,3,h,'rgba(0,0,0,.12)');
    for(let wy=B-h+6;wy<B-8;wy+=8)for(let wx=x+4;wx<x+w-5;wx+=6){R(wx,wy,3.6,5,gl);if((((wx*13+wy*7)|0)&3)===0)lit(wx,wy,3.6,5);}
    if(top===1){R(x+w/2-1,B-h-16,2,16,'#8e99a6');lit(x+w/2-1.6,B-h-17.6,3.2,3.2,'#ff5252');}
    else if(top===2){R(x+4,B-h-9,w-8,9,bc);R(x+9,B-h-16,w-18,7,bc);}
    else if(top===3){d.fillStyle=bc;d.beginPath();d.moveTo(x,B-h);d.lineTo(x+w,B-h-14);d.lineTo(x+w,B-h);d.closePath();d.fill();}
    else if(top===4){R(x+3,B-h-6,w-6,6,'#8e99a6');R(x+w/2-4,B-h-11,8,5,'#a2adb9');}};
  const bk=['#aebfd3','#b9c8d9','#a3b5ca'],fr=['#d9d2c5','#cfc6b8','#e2dccf','#bfb7a8'];
  let x=8;while(x<W-40){if(x>690&&x<1000){x=1000;continue;}if(x>1670&&x<1745){x=1745;continue;}const w=26+rr()*22,h=110+rr()*105;bld(x,w,h,bk[(rr()*3)|0],'#8fa8c4',(rr()*5)|0);x+=w+rr()*10;}
  x=0;while(x<W-30){if(x>690&&x<1000){x=1000;continue;}if(x>1670&&x<1745){x=1745;continue;}const w=34+rr()*30,h=40+rr()*62;bld(x,w,h,fr[(rr()*4)|0],'#5f7390',rr()<.4?4:0);x+=w+2+rr()*8;}
  /* ملعب كرة قدم */
  (function(x0){const w=260,top=B-52;
    d.fillStyle='#7f8b99';d.beginPath();d.moveTo(x0,B);d.lineTo(x0+14,top+14);d.quadraticCurveTo(x0+w/2,top-14,x0+w-14,top+14);d.lineTo(x0+w,B);d.closePath();d.fill();
    for(let i=0;i<22;i++)R(x0+10+i*11.2,top+16,4,B-top-16,'rgba(255,255,255,.2)');
    d.fillStyle='#c5ced8';d.beginPath();d.moveTo(x0+4,top+18);d.quadraticCurveTo(x0+w/2,top-22,x0+w-4,top+18);d.lineTo(x0+w-4,top+26);d.quadraticCurveTo(x0+w/2,top-12,x0+4,top+26);d.closePath();d.fill();
    for(let i=0;i<7;i++){const ax=x0+24+i*32;d.fillStyle='#2d3640';d.beginPath();d.rect(ax,B-18,14,18);d.arc(ax+7,B-18,7,Math.PI,0);d.fill();lit(ax+3,B-12,8,12,'#ffe9a8');}
    [x0-14,x0+w+8].forEach(px=>{R(px,B-104,5,104,'#8e99a6');R(px-9,B-114,23,10,'#dfe6ee');for(let i=0;i<4;i++)lit(px-7+i*5.5,B-112,4,6,'#fffbe0');glow(px+2,B-110,40,.9);});
  })(720);
  /* برج اتصالات */
  R(1703,B-205,5,205,'#aab4c0');R(1699,B-60,13,60,'#9aa5b2');d.fillStyle='#c0c9d4';d.beginPath();d.ellipse(1705.5,B-150,13,7,0,0,6.3);d.fill();lit(1694,B-151,23,3);R(1705,B-224,1.6,20,'#8e99a6');lit(1704.6,B-226,3,3,'#ff5252');
  /* قوارب على النهر */
  [210,890,1450,1820].forEach(bx=>{const by=B+13;d.fillStyle='#e8eef4';d.beginPath();d.moveTo(bx,by);d.lineTo(bx+34,by);d.lineTo(bx+28,by+7);d.lineTo(bx+5,by+7);d.closePath();d.fill();R(bx+8,by-7,14,7,'#f5f8fb');R(bx+11,by-5,8,3,'#4f7fa8');lit(bx+11,by-5,8,3);});
}
function nearCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h,c)=>{l.fillStyle=c||'#ffd98a';l.fillRect(x,y,w,h);};
  const glow=(x,y,r,a)=>{const g=l.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba(255,240,180,'+a+')');g.addColorStop(1,'rgba(255,240,180,0)');l.fillStyle=g;l.fillRect(x-r,y-r,r*2,r*2);};
  /* ملاعب كرة قدم صغيرة مضاءة */
  [[520,260],[1180,200]].forEach(p=>{const px=p[0],w=p[1];R(px,H-24,w,12,'#3f9a4d');for(let i=0;i<w;i+=26)R(px+i,H-24,13,12,'rgba(255,255,255,.07)');R(px+w/2-1,H-24,2,12,'rgba(255,255,255,.5)');
    d.strokeStyle='#f4f4f4';d.lineWidth=1.8;[px+2,px+w-10].forEach(gx=>{d.strokeRect(gx,H-40,8,16);d.strokeStyle='rgba(255,255,255,.4)';d.lineWidth=.7;for(let i=1;i<4;i++){d.beginPath();d.moveTo(gx,H-40+i*4);d.lineTo(gx+8,H-40+i*4);d.stroke();}d.strokeStyle='#f4f4f4';d.lineWidth=1.8;});
    [px-6,px+w+3].forEach(fx=>{R(fx,H-88,3,76,'#4a525c');R(fx-6,H-94,15,7,'#dfe6ee');lit(fx-4,H-92,11,3,'#fffbe0');glow(fx+1,H-90,38,.9);});
    d.strokeStyle='rgba(70,80,90,.8)';d.lineWidth=1;for(let i=0;i<w;i+=8){d.beginPath();d.moveTo(px+i,H-30);d.lineTo(px+i,H-24);d.stroke();}});
  /* مقاهي وأكشاك */
  [260,880,1330].forEach(kx=>{R(kx,H-42,50,30,'#e0d6c2');for(let i=0;i<5;i++)R(kx+i*10,H-46,10,6,i%2?'#e53935':'#f5f5f5');R(kx+6,H-30,38,10,'#26323d');lit(kx+8,H-29,34,8,'#7fd8ff');glow(kx+25,H-26,34,.5);R(kx+2,H-24,4,12,'#5c6670');});
  /* أشجار الرصيف */
  for(let x=30;x<W-20;x+=64+((x*7)%30)){if((x>500&&x<800)||(x>1160&&x<1400))continue;R(x-2,H-38,4,26,'#5d4630');dot(d,x,H-40,11,'#2e7d4f');dot(d,x-6,H-34,8,'#3a9a60');dot(d,x+6,H-34,8,'#3a9a60');}
  /* سور النهر */
  R(0,H-12,W,12,'#8d949c');R(0,H-12,W,2.5,'#c4c9cf');for(let x=0;x<W;x+=9)R(x,H-10,2,10,'#6e757d');
  /* أعمدة إنارة الشارع */
  for(let x=60;x<W;x+=190){R(x,H-82,3,70,'#3d434b');R(x-9,H-84,15,3,'#3d434b');R(x-11,H-82,7,3,'#fff7d0');lit(x-11,H-82,7,3,'#fff7d0');glow(x-7,H-80,36,.85);}
}
const CITY_FAR=mkTile(1900,250,farCity),CITY_NEAR=mkTile(1500,100,nearCity);
function retint(t,hz,tm){
  const sc=skyCols(),key=[Math.round(ENV.light*20),Math.round(sc.bot[0]/10),Math.round(sc.bot[1]/10),Math.round(sc.bot[2]/10)].join();
  if(key===t.key||(t.key&&tm-t.last<.12))return;t.key=key;t.last=tm;
  const o=t.out[1],cw=t.out[0].width,ch=t.out[0].height;
  o.globalCompositeOperation='source-over';o.clearRect(0,0,cw,ch);o.drawImage(t.det[0],0,0);
  o.globalCompositeOperation='source-atop';o.fillStyle='rgba(8,12,40,'+((1-shadeK())).toFixed(3)+')';o.fillRect(0,0,cw,ch);
  o.fillStyle=col(sc.bot,1,hz);o.fillRect(0,0,cw,ch);o.globalCompositeOperation='source-over';
}
function drawTile(c,t,f,cam,W,y,hz,tm){
  retint(t,hz,tm);const off=-((cam*f)%t.w);
  for(let ox=off;ox<W;ox+=t.w){c.drawImage(t.out[0],ox,y,t.w,t.h);
    if(ENV.light<.78){c.globalAlpha=(1-ENV.light)*.9;c.drawImage(t.win[0],ox,y,t.w,t.h);c.globalAlpha=1;}}
}

function skyCols(){const gtop=[100,108,122].map(v=>v*(.3+.7*ENV.light)),gbot=[150,158,170].map(v=>v*(.3+.7*ENV.light));
  return{top:mixA(ENV.top,gtop,ENV.grey),bot:mixA(ENV.bot,gbot,ENV.grey)};}
const shadeK=()=>.38+.62*ENV.light;

function palm(c,x,base,h,lean,k,sn){
  const tx=x+lean,ty=base-h;c.lineCap='round';c.strokeStyle=col([108,76,44],k);c.lineWidth=6;
  c.beginPath();c.moveTo(x,base);c.quadraticCurveTo(x+lean*.15,base-h*.62,tx,ty);c.stroke();
  const lc=mixA([36,125,62],[235,240,245],sn*.75);c.strokeStyle=col(lc,k);c.lineWidth=4;
  for(let i=-3;i<=3;i++){const a=-Math.PI/2+i*.5,L=34,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L+Math.abs(i)*6;
    c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*L*.55,ty+Math.sin(a)*L*.55-9,ex,ey);c.stroke();}
}
function roundTree(c,x,base,h,k,sn){
  c.fillStyle=col([96,66,38],k);c.fillRect(x-3,base-h*.5,6,h*.5);
  const lc=mixA([46,130,66],[235,240,245],sn*.8);c.fillStyle=col(lc,k);
  c.beginPath();c.arc(x,base-h*.62,h*.3,0,6.3);c.arc(x-h*.2,base-h*.45,h*.22,0,6.3);c.arc(x+h*.2,base-h*.45,h*.22,0,6.3);c.fill();
}
function drawBackdrop(c,W,cam,t,Q){
  const sc=skyCols(),k=shadeK(),nS=Q===1?30:STARS.length,nC=Q===1?3:Q===2?5:CLOUDS.length;
  const g=c.createLinearGradient(0,0,0,GY);g.addColorStop(0,col(sc.top));g.addColorStop(1,col(sc.bot));c.fillStyle=g;c.fillRect(-5,-5,W+10,H+10);
  if(ENV.stars>.03){for(let i=0;i<nS;i++){const s=STARS[i];c.fillStyle='rgba(255,255,255,'+(ENV.stars*(.5+.5*Math.sin(t*2+s.p))*(1-ENV.grey))+')';c.beginPath();c.arc(s.x*W,s.y*H,s.r,0,6.3);c.fill();}}
  if(ENV.sa>.03){const x=ENV.sx*W,y=ENV.sy*H;const gr=c.createRadialGradient(x,y,6,x,y,90);gr.addColorStop(0,'rgba(255,230,150,'+.7*ENV.sa*(1-ENV.grey)+')');gr.addColorStop(1,'rgba(255,200,100,0)');
    c.fillStyle=gr;c.fillRect(x-100,y-100,200,200);c.fillStyle='rgba(255,236,160,'+ENV.sa*(1-ENV.grey*.8)+')';c.beginPath();c.arc(x,y,26,0,6.3);c.fill();}
  if(ENV.moon>.03){const x=W*.24,y=H*.17;c.fillStyle='rgba(240,244,255,'+ENV.moon*(1-ENV.grey*.7)+')';c.beginPath();c.arc(x,y,22,0,6.3);c.fill();
    c.fillStyle=col(sc.top,1,ENV.moon);c.beginPath();c.arc(x+9,y-5,19,0,6.3);c.fill();}
  const cc=mixA([255,255,255],[150,156,168],ENV.grey);
  for(let i=0;i<nC;i++){const cl=CLOUDS[i],x=((cl.x-cam*.08-t*cl.v)%(W+300)+W+300)%(W+300)-150;c.fillStyle=col(cc,.4+.6*ENV.light,.25+.7*ENV.cloud);
    c.beginPath();c.arc(x,cl.y,22*cl.s,0,6.3);c.arc(x+22*cl.s,cl.y+4,18*cl.s,0,6.3);c.arc(x-22*cl.s,cl.y+6,16*cl.s,0,6.3);c.arc(x+4*cl.s,cl.y-10*cl.s,18*cl.s,0,6.3);c.fill();}
  drawTile(c,CITY_FAR,.1,cam,W,GY-12-CITY_FAR.h,.28,t);
  drawTile(c,CITY_NEAR,.3,cam,W,GY+1-CITY_NEAR.h,.08,t);
  const off=-((cam*.45)%TREES.w);
  for(let ox=off;ox<W+60;ox+=TREES.w)for(const tr of TREES.it){const x=ox+tr.x;if(x>W+70||x<-70)continue;
    if(tr.k==='palm')palm(c,x,GY+3,tr.h,tr.l,k,ENV.snow);else roundTree(c,x,GY+3,tr.h,k,ENV.snow);}
}
function drawCar(c,x,y,cl,dir,k){
  c.save();c.translate(x,y);if(dir<0){c.translate(38,0);c.scale(-1,1);}
  c.fillStyle=col(cl,k);rrect(c,0,0,38,10,3);c.fill();c.fillStyle=col(cl,k*.9);c.beginPath();c.moveTo(8,0);c.lineTo(12,-7);c.lineTo(27,-7);c.lineTo(32,0);c.closePath();c.fill();
  c.fillStyle='#1d2a3a';c.beginPath();c.moveTo(11,-.5);c.lineTo(14,-5.5);c.lineTo(25,-5.5);c.lineTo(29,-.5);c.closePath();c.fill();dot(c,9,10,3.6,'#15171a');dot(c,29,10,3.6,'#15171a');
  if(ENV.light<.6){c.fillStyle='rgba(255,240,170,.9)';c.fillRect(37,2,3,3);c.fillStyle='rgba(255,240,170,.16)';c.beginPath();c.moveTo(40,3);c.lineTo(70,-3);c.lineTo(70,11);c.closePath();c.fill();}
  c.restore();
}
function drawGround(c,W,cam){
  const k=shadeK(),sn=ENV.snow*.9,walk=mixA([182,186,192],[240,244,250],sn),road=mixA([62,66,74],[205,210,218],sn*.85);
  c.fillStyle=col(walk,k);c.fillRect(-5,GY,W+10,12);c.fillStyle=col(mixA(walk,[0,0,0],.25),k);c.fillRect(-5,GY+10,W+10,3);
  c.fillStyle=col(road,k);c.fillRect(-5,GY+13,W+10,H-GY-13+5);
  c.strokeStyle=col(mixA(walk,[0,0,0],.18),k,.8);c.lineWidth=1.5;const o=-(cam%40);c.beginPath();for(let x=o;x<W+40;x+=40){c.moveTo(x,GY+1);c.lineTo(x-6,GY+10);}c.stroke();
  c.fillStyle=col([240,240,235],k,.9);const o2=-((cam*1.2)%80);for(let x=o2;x<W+80;x+=80)c.fillRect(x,GY+42,42,4);
  c.fillStyle=col([255,200,40],k,.8);c.fillRect(-5,GY+62,W+10,2.5);
  const span=W+260;for(const cr of CARS){const x=(((cr.o-cam*cr.s)%span)+span)%span-130;drawCar(c,x,GY+(cr.l?47:20),cr.c,cr.l?1:-1,k);}
}
function partsUpdate(dt,W,speed){
  for(const r of RAIN){r.y+=r.v*dt;r.x-=speed*.2*dt;if(r.y>H){r.y=-20;r.x=Math.random()*(W+100);}if(r.x<-20)r.x=W+20;}
  for(const f of FLAKES){f.y+=f.v*dt;f.p+=dt;f.x+=Math.sin(f.p*1.5)*18*dt-speed*.1*dt;if(f.y>H){f.y=-10;f.x=Math.random()*(W+100);}if(f.x<-10)f.x=W+10;}
}
function partsDraw(c,W,Q){
  const f=Q===1?.35:Q===2?.7:1;
  if(ENV.rain>.04){c.strokeStyle='rgba(190,215,255,'+.55*ENV.rain+')';c.lineWidth=1.3;c.beginPath();const n=Math.floor(RAIN.length*f);for(let i=0;i<n;i++){const r=RAIN[i];c.moveTo(r.x,r.y);c.lineTo(r.x-r.l*.22,r.y-r.l);}c.stroke();}
  if(ENV.snow>.04){c.fillStyle='rgba(255,255,255,'+.9*ENV.snow+')';c.beginPath();const n=Math.floor(FLAKES.length*f);for(let i=0;i<n;i++){const q=FLAKES[i];c.moveTo(q.x+q.r,q.y);c.arc(q.x,q.y,q.r,0,6.3);}c.fill();}
}
/* ===== عوائق: أنابيب فولاذية عصرية ===== */
function steel(c,x,w,k){const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,col([58,78,98],k));g.addColorStop(.3,col([150,176,200],k));g.addColorStop(.55,col([112,138,162],k));g.addColorStop(1,col([46,62,82],k));return g;}
function hazard(c,x,y,w,h,k){c.fillStyle=col([250,200,30],k);c.fillRect(x,y,w,h);c.fillStyle=col([30,32,36],k);c.beginPath();for(let i=-h;i<w;i+=12){c.moveTo(x+Math.max(0,i),y+(i<0?-i:0));c.lineTo(x+Math.min(w,i+6),y+(i+6>w?i+6-w:0));c.lineTo(x+Math.min(w,i+6-h),y+h);c.lineTo(x+Math.max(0,i-h),y+h);}c.fill();}
function drawPipe(c,p){
  const k=shadeK(),top=p.gapY-p.gap/2,bot=p.gapY+p.gap/2,x=p.x,w=p.w;
  c.fillStyle=steel(c,x,w,k);c.fillRect(x,-30,w,top+30);c.fillRect(x,bot,w,GY-bot+2);
  c.fillStyle='rgba(255,255,255,.16)';c.fillRect(x+9,-30,5,top+30);c.fillRect(x+9,bot,5,GY-bot);
  c.fillStyle=col([40,52,68],k,.6);for(let y=top-60;y>-30;y-=50)c.fillRect(x,y,w,3);for(let y=bot+60;y<GY;y+=50)c.fillRect(x,y,w,3);
  c.fillStyle=steel(c,x-6,w+12,k);c.fillRect(x-6,top-26,w+12,26);c.fillRect(x-6,bot,w+12,26);
  c.strokeStyle=col([30,40,54],k,.8);c.lineWidth=1.5;c.strokeRect(x-6,top-26,w+12,26);c.strokeRect(x-6,bot,w+12,26);
  hazard(c,x-4,top-12,w+8,6,k);hazard(c,x-4,bot+6,w+8,6,k);
  c.fillStyle=col([210,222,235],k);for(let i=0;i<4;i++){const bx=x-1+i*(w+2)/3;dot(c,bx,top-20,1.4,c.fillStyle);dot(c,bx,bot+20,1.4,c.fillStyle);}
  if(ENV.snow>.3){c.fillStyle='rgba(255,255,255,'+Math.min(1,ENV.snow)*.95+')';rrect(c,x-8,bot-4,w+16,7,3);c.fill();}
}
function drawCoin(c,o,t){
  const sx=Math.max(.18,Math.abs(Math.cos(t*4+o.ph)));c.save();c.translate(o.x,o.y);c.scale(sx,1);
  c.fillStyle='#f2c14e';c.beginPath();c.arc(0,0,10,0,6.3);c.fill();c.fillStyle='#fff3b0';c.beginPath();c.arc(-2.5,-2.5,5,0,6.3);c.fill();
  c.strokeStyle='#8a5e0c';c.lineWidth=1.5;c.beginPath();c.arc(0,0,10,0,6.3);c.stroke();c.lineWidth=1.2;c.beginPath();c.arc(0,0,6.3,0,6.3);c.stroke();c.restore();
}
const PUPC={magnet:['#ff5252','🧲'],shield:['#40c4ff','🛡️'],slow:['#b388ff','⏳'],double:['#ffd54a','💰']};
function drawPickup(c,o,t){
  const y=o.y+Math.sin(t*3+o.ph)*4,cl=PUPC[o.type][0];
  c.globalAlpha=.3+.1*Math.sin(t*4);c.fillStyle=cl;c.beginPath();c.arc(o.x,y,24,0,6.3);c.fill();c.globalAlpha=1;
  c.fillStyle='rgba(10,20,50,.78)';c.beginPath();c.arc(o.x,y,15,0,6.3);c.fill();c.strokeStyle=cl;c.lineWidth=2.4;c.stroke();
  c.font='17px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(PUPC[o.type][1],o.x,y+1);
}
