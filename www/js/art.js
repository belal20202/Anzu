'use strict';
/* الرسم: الطائر، الأزياء، حضارة وادي الرافدين، العوائق */
const H=640,GY=570;
const col=(a,k=1,al=1)=>'rgba('+(a[0]*k|0)+','+(a[1]*k|0)+','+(a[2]*k|0)+','+al+')';
const mixA=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const rrect=(c,x,y,w,h,r)=>{c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);};

/* ===== ألوان الريش (ظهر، بطن، جناح) ===== */
const PAL={
 eag:[[112,76,42],[214,176,116],[84,56,32]],
 brz:[[98,66,40],[192,150,100],[68,44,26]],
 sky:[[70,120,190],[170,205,240],[40,75,140]],
 crm:[[170,40,60],[240,170,140],[110,24,40]],
 lap:[[28,72,160],[150,190,235],[18,46,110]],
 tan:[[190,140,70],[240,205,140],[140,98,44]],
 vio:[[110,50,140],[205,165,225],[70,30,98]],
 ind:[[38,48,110],[120,135,200],[24,30,76]],
 gld:[[214,160,40],[255,226,140],[160,110,20]],
 teal:[[24,130,120],[150,215,195],[14,88,82]],
 rgl:[[225,176,44],[255,232,150],[170,118,22]],
 ash:[[62,42,34],[190,150,90],[40,26,22]]
};
/* ===== 20 زياً سومرياً وأكدياً وبابلياً وآشورياً ===== */
const SKINS=[
 {n:'الكاهن السومري',c:PAL.eag,mid:['beads'],front:['reed'],p:0},
 {n:'ملكة أور',c:PAL.eag,mid:['beads'],front:['puabi'],p:2000},
 {n:'سرجون الأكدي',c:PAL.eag,mid:['collar'],front:['akkhelm'],p:2500},
 {n:'جلجامش',c:PAL.brz,mid:['mane'],front:['reed'],p:3000},
 {n:'ثور السماء',c:PAL.eag,mid:['beads'],front:['bullhorns'],p:3500},
 {n:'آنو إله السماء',c:PAL.sky,mid:['collar'],front:['divine'],p:4000},
 {n:'عشتار',c:PAL.crm,back:['fringecape'],rc:'#2a3f94',mid:['collar'],front:['star'],p:5000},
 {n:'قرص آشور المجنّح',c:PAL.eag,mid:['beads'],front:['sundisk'],p:5500},
 {n:'الجندي الآشوري',c:PAL.brz,mid:['scales'],front:['helm'],p:6000},
 {n:'الملك الآشوري',c:PAL.eag,back:['fringecape'],rc:'#6a1f7a',mid:['collar'],front:['assytiara'],p:7000},
 {n:'حمورابي',c:PAL.brz,mid:['beads'],front:['hamcap','beard'],p:7500},
 {n:'نبوخذ نصّر',c:PAL.eag,back:['fringecape'],rc:'#1b3a8a',mid:['collar'],front:['mural'],p:8500},
 {n:'بوابة عشتار',c:PAL.lap,mid:['beads'],front:['mural'],hb:'#0e2f78',p:9500},
 {n:'اللَّمَسّو الحارس',c:PAL.tan,mid:['collar'],front:['featherT'],p:11000},
 {n:'سمير أميس',c:PAL.vio,mid:['beads'],front:['veil'],p:12000},
 {n:'سين إله القمر',c:PAL.ind,mid:['collar'],front:['crescent'],p:13500},
 {n:'شمش إله الشمس',c:PAL.gld,mid:['collar'],front:['rays'],p:15000},
 {n:'مردوخ والتنين',c:PAL.teal,back:['dragonBack'],mid:['scales'],sc:'#e0b040',front:['dragonHorn'],p:17000},
 {n:'ملك أور الذهبي',c:PAL.rgl,back:['fringecape'],rc:'#1b3a8a',mid:['collar'],front:['akkhelm'],hc:'#fff0a8',p:20000},
 {n:'آشوربانيبال',c:PAL.ash,back:['fringecape'],rc:'#7d0f26',mid:['collar'],front:['assytiara'],p:25000}
];

/* ===== أجزاء الأزياء ===== */
function featherU(c,len,wid,fill){c.save();c.scale(len,wid);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(.3,-1,.9,-.9,1,0);c.bezierCurveTo(.9,.9,.3,1,0,0);c.fillStyle=fill;c.fill();c.restore();}
const dot=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,6.3);c.fill();};
const GLD='#f2c14e',LAP='#1f4fae',CAR='#c8402a',LIN='#f1e8d0';
const ACC={
 reed(c){c.fillStyle='#d9c48e';c.beginPath();c.moveTo(10.5,-9);c.quadraticCurveTo(18,-19.5,27,-13.5);c.lineTo(27,-11.5);c.quadraticCurveTo(18,-17,10.5,-7.5);c.closePath();c.fill();
  c.fillStyle='#4f9a45';[[14,-16],[19,-18],[24,-16.5]].forEach(p=>{c.beginPath();c.ellipse(p[0],p[1]-3,1.5,4.5,(p[0]-19)*.05,0,6.3);c.fill();});},
 beads(c){const cl=[LAP,GLD,CAR];for(let i=0;i<=8;i++){const t=i/8;dot(c,4+13*t,-6+8*t+5*Math.sin(Math.PI*t),1.9,cl[i%3]);}dot(c,10.5,3.4,3,GLD);dot(c,10.5,3.4,1.3,CAR);},
 collar(c){[LAP,GLD,CAR,GLD].forEach((cl,i)=>{c.strokeStyle=cl;c.lineWidth=2.4;c.setLineDash([2.2,1.1]);c.beginPath();c.arc(13,-5,7+i*2.4,.15*Math.PI,.9*Math.PI);c.stroke();});c.setLineDash([]);},
 scales(c,sk){const k=sk.sc||'#b5793a';for(let r=0;r<4;r++)for(let j=0;j<6;j++){c.fillStyle=(r+j)%2?k:'#8d5a22';c.beginPath();c.arc(-9+j*4.6+(r%2)*2.3,-2+r*3.6,2.6,0,Math.PI);c.fill();}},
 fringecape(c,sk,fl){c.fillStyle=sk.rc||'#7a1f3d';c.beginPath();c.moveTo(7,-9);c.quadraticCurveTo(-8,-14+fl,-30,-6+fl*1.6);c.quadraticCurveTo(-27,6,-23,17+fl);c.quadraticCurveTo(-4,14,8,8);c.closePath();c.fill();
  c.fillStyle=GLD;for(let i=0;i<6;i++){const t=i/5;c.fillRect(lerp(-30,-23,t)-1.2,lerp(-6+fl*1.6,17+fl,t),1.5,3.6);}
  c.strokeStyle=GLD;c.lineWidth=1.6;c.beginPath();c.moveTo(-30,-6+fl*1.6);c.quadraticCurveTo(-27,6,-23,17+fl);c.stroke();
  [[-8,-2],[-16,2],[-14,10]].forEach(p=>dot(c,p[0],p[1]+fl*.3,1.7,GLD));},
 mane(c){c.fillStyle='#6e4217';c.beginPath();for(let i=0;i<28;i++){const a=i*Math.PI/14,r=i%2?10:15.5;c.lineTo(12+Math.cos(a)*r,-4+Math.sin(a)*r);}c.closePath();c.fill();dot(c,12,-4,9.5,'#94602a');},
 puabi(c,sk,fl){c.fillStyle=GLD;for(let i=0;i<6;i++){const a=Math.PI*(1.1+i*.16);c.save();c.translate(19+Math.cos(a)*9.6,-9+Math.sin(a)*9.6);c.rotate(a+Math.PI/2);c.beginPath();c.ellipse(0,-2,1.8,3.6,0,0,6.3);c.fill();c.restore();}
  c.fillRect(17.5,-27,3,9);[16,19,22].forEach((x,i)=>{c.fillRect(x-.5,-30,1,4);dot(c,x,-31-(i===1?1.5:0),1.7,[LAP,CAR,'#f8e9c0'][i]);});
  for(let s=0;s<3;s++)for(let j=0;j<5;j++)dot(c,9-j*2.6-s*1.2,-10+j*2.6+s*2+fl*.1*j,1.1,(j+s)%2?LAP:GLD);
  c.strokeStyle=GLD;c.lineWidth=1.6;c.beginPath();c.arc(14,-3,2.8,.2,5.5);c.stroke();},
 akkhelm(c,sk){c.fillStyle=sk.hc||GLD;c.beginPath();c.moveTo(9.5,-3);c.bezierCurveTo(7.5,-15,14,-21,21,-19.8);c.bezierCurveTo(26.5,-19,28.5,-14.5,28,-11.5);c.lineTo(23,-11.8);c.bezierCurveTo(19,-13,14,-12,13,-3);c.closePath();c.fill();
  c.strokeStyle='#a8741a';c.lineWidth=.9;for(let i=0;i<5;i++){c.beginPath();c.moveTo(13+i*3,-19.2+Math.abs(i-2)*.6);c.quadraticCurveTo(12+i*2.4,-15,11.5+i*1.4,-8.5);c.stroke();}dot(c,26,-14.5,1.3,LAP);},
 bullhorns(c){c.fillStyle=GLD;c.strokeStyle='#a8741a';c.lineWidth=.8;
  c.beginPath();c.moveTo(12.5,-15);c.bezierCurveTo(3,-18,1,-30,9,-35);c.bezierCurveTo(7,-27,12,-22,17.5,-16.5);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(21,-17);c.bezierCurveTo(30,-19,33,-30,26,-35);c.bezierCurveTo(27,-28,23,-23,18,-17.5);c.closePath();c.fill();c.stroke();
  c.fillStyle=LAP;c.fillRect(13,-18.5,10,3);[15,19,22].forEach(x=>dot(c,x,-17,.9,GLD));},
 divine(c){c.lineCap='round';for(let i=0;i<3;i++){const w=14-i*3.2,x=19-w/2,y=-17-(i+1)*5.2;c.fillStyle=LIN;c.fillRect(x,y,w,5.2);c.fillStyle=GLD;c.fillRect(x,y+4,w,1.4);
   c.strokeStyle='#d9a93a';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+2.5);c.quadraticCurveTo(x-4.5,y,x-3.5,y-5);c.moveTo(x+w,y+2.5);c.quadraticCurveTo(x+w+4.5,y,x+w+3.5,y-5);c.stroke();}
  c.fillStyle=GLD;c.fillRect(11.5,-17.5,15,2);dot(c,19,-35.5,2,GLD);},
 star(c,sk,fl,wp){c.fillStyle=LAP;c.beginPath();c.moveTo(10.5,-9);c.quadraticCurveTo(18,-19,27,-13.5);c.lineTo(27,-11.5);c.quadraticCurveTo(18,-16.5,10.5,-7.5);c.closePath();c.fill();
  c.fillStyle=GLD;c.fillRect(20,-20,2,5);c.save();c.translate(21,-26);const s=1+.06*Math.sin(wp*.6);c.scale(s,s);c.beginPath();for(let i=0;i<16;i++){const r=i%2?3.6:9,a=-Math.PI/2+i*Math.PI/8;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();dot(c,0,0,2.2,CAR);c.restore();},
 sundisk(c,sk,fl,wp){const x=19,y=-34+Math.sin(wp*.35)*1.2;
  for(let s=-1;s<=1;s+=2)for(let i=0;i<5;i++){c.save();c.translate(x+s*5,y-2+i*1.7);c.rotate(s>0?(i-2)*.12:Math.PI-(i-2)*.12);featherU(c,13-i*.9,1.7,i%2?LAP:GLD);c.restore();}
  c.fillStyle=GLD;[-1,1].forEach(s=>{c.beginPath();c.moveTo(x+s*1,y+4);c.lineTo(x+s*4.5,y+11);c.lineTo(x+s*5.5,y+4);c.closePath();c.fill();});
  dot(c,x,y,5.6,GLD);dot(c,x,y,3.4,CAR);dot(c,x,y,1.4,'#f8e9c0');},
 assytiara(c,sk,fl){c.fillStyle=LAP;c.beginPath();c.moveTo(11.5,-18);c.quadraticCurveTo(2,-18+fl,-6,-12+fl*1.5);c.lineTo(-5,-9+fl*1.5);c.quadraticCurveTo(3,-14+fl,11.5,-14);c.closePath();c.fill();
  const L=t=>11.5+2*t,R=t=>26.5-3*t;c.fillStyle=LIN;c.beginPath();c.moveTo(L(0),-15);c.lineTo(L(1),-33);c.lineTo(18.5,-39);c.lineTo(R(1),-33);c.lineTo(R(0),-15);c.closePath();c.fill();
  c.fillStyle=GLD;[0,.33,.66].forEach(t=>{const y0=-15-t*18,y1=y0-2.6,t1=t+.145;c.beginPath();c.moveTo(L(t),y0);c.lineTo(L(t1),y1);c.lineTo(R(t1),y1);c.lineTo(R(t),y0);c.closePath();c.fill();});
  dot(c,18.5,-39.5,1.8,GLD);},
 helm(c,sk,fl){c.fillStyle='#b52a2a';c.beginPath();c.moveTo(17,-27);c.quadraticCurveTo(6,-36+fl,-4,-26+fl*1.5);c.quadraticCurveTo(6,-28+fl,16,-22);c.closePath();c.fill();
  c.fillStyle='#b5793a';c.beginPath();c.moveTo(9.5,-4);c.lineTo(10.5,-14);c.quadraticCurveTo(14,-27,20,-31.5);c.quadraticCurveTo(26,-25,28,-12.5);c.lineTo(23,-12);c.quadraticCurveTo(19,-13,15,-12);c.lineTo(14,-4);c.closePath();c.fill();
  c.fillStyle='#8d5a22';c.fillRect(10.5,-15,17.5,2.2);[13,17,21,25].forEach(x=>dot(c,x,-14,.8,GLD));dot(c,20,-31.8,1.4,GLD);},
 mural(c,sk){const k=sk.hc||GLD,b=sk.hb||LAP;c.fillStyle=b;c.fillRect(12,-22,14,8);c.fillStyle=k;c.fillRect(12,-16.5,14,2.2);
  for(let i=0;i<4;i++){c.fillStyle=b;c.fillRect(12+i*3.8,-25.6,2.6,3.8);c.fillStyle=k;c.fillRect(12+i*3.8,-25.6,2.6,1);}
  c.fillStyle='#0b1a3a';[15.5,22.5].forEach(x=>{c.beginPath();c.arc(x,-18.8,1.6,Math.PI,0);c.rect(x-1.6,-18.8,3.2,2.2);c.fill();});},
 hamcap(c){c.fillStyle='#8a6a3a';c.beginPath();c.ellipse(19,-18.6,9,5.6,-.06,Math.PI,0);c.fill();c.fillStyle=GLD;c.beginPath();c.ellipse(19,-18.2,10.6,2.6,-.06,0,6.3);c.fill();c.fillStyle=LAP;c.beginPath();c.ellipse(19,-18.2,10.6,1.1,-.06,0,6.3);c.fill();},
 beard(c){[[24.5,-1.5],[27,1.5],[22.5,2.5],[25.5,5.5],[20.5,6],[23,9],[18.5,9]].forEach((p,i)=>dot(c,p[0],p[1],2.9,i%2?'#2f2018':'#4a3222'));},
 featherT(c){const cl=[LAP,GLD,CAR];c.fillStyle=GLD;c.fillRect(11.5,-18,15,2.4);for(let r=0;r<3;r++){const n=5-r,w=14-r*2.6;for(let j=0;j<n;j++){c.fillStyle=cl[(j+r)%3];rrect(c,19-w/2+(j+.5)*w/n-1.7,-18-(r+1)*6.2,3.4,6.6,1.5);c.fill();}}dot(c,19,-39,2.2,GLD);},
 veil(c,sk,fl){c.fillStyle='rgba(160,90,200,.62)';c.beginPath();c.moveTo(14,-17);c.quadraticCurveTo(0,-20+fl,-22,-8+fl*2);c.quadraticCurveTo(-30,4+fl,-24,14+fl*2);c.quadraticCurveTo(-8,6+fl,10,-4);c.closePath();c.fill();
  c.fillStyle=GLD;c.beginPath();c.moveTo(12,-16);c.lineTo(13,-24);c.lineTo(16,-19);c.lineTo(19,-26);c.lineTo(22,-19);c.lineTo(25,-24);c.lineTo(26,-16);c.closePath();c.fill();
  [13,19,25].forEach((x,i)=>dot(c,x,-24.5-(i===1?2:0),1.2,'#f8e9c0'));c.strokeStyle=GLD;c.lineWidth=1.5;c.beginPath();c.arc(14,-3,2.7,.3,5.6);c.stroke();},
 crescent(c){c.fillStyle=GLD;c.beginPath();c.moveTo(11.5,-17);c.bezierCurveTo(8,-31,25,-39,30,-27);c.bezierCurveTo(22,-33,15,-29,11.5,-17);c.closePath();c.fill();c.fillRect(13.5,-19,11,2.4);dot(c,19,-17.8,1.2,LAP);dot(c,24,-30,1.5,'#f8e9c0');},
 rays(c,sk,fl,wp){c.fillStyle=GLD;const pul=1+.12*Math.sin(wp*.7);for(let i=0;i<9;i++){const a=-Math.PI*(.95-.9*i/8),x0=19+Math.cos(a)*9.5,y0=-9+Math.sin(a)*9.5,x1=19+Math.cos(a)*18*pul,y1=-9+Math.sin(a)*18*pul,nx=-Math.sin(a)*1.8,ny=Math.cos(a)*1.8;c.beginPath();c.moveTo(x0+nx,y0+ny);c.lineTo(x1,y1);c.lineTo(x0-nx,y0-ny);c.closePath();c.fill();}
  c.strokeStyle=GLD;c.lineWidth=2;c.beginPath();c.arc(19,-9,9.6,Math.PI*1.04,Math.PI*1.96);c.stroke();},
 dragonBack(c){for(let i=0;i<9;i++){const x=9-i*3.4,y=lerp(-14,-4,i/8);c.fillStyle=i%2?'#e0b040':'#0e5e55';c.beginPath();c.moveTo(x+2.2,y+2);c.lineTo(x-1,y-7);c.lineTo(x-2.4,y+2);c.closePath();c.fill();}},
 dragonHorn(c,sk,fl){c.fillStyle='#14a089';c.beginPath();c.moveTo(12,-12);c.lineTo(3,-17+fl);c.lineTo(5,-10+fl);c.lineTo(11,-7);c.closePath();c.fill();
  c.fillStyle='#f2c14e';c.beginPath();c.moveTo(20,-17);c.lineTo(30,-33);c.lineTo(24.5,-16.5);c.closePath();c.fill();c.fillStyle='#e0b040';c.beginPath();c.moveTo(15,-16.5);c.lineTo(15,-24);c.lineTo(19,-17.5);c.closePath();c.fill();}
};

/* ===== تلميع الطائر ===== */
const GC=document.createElement('canvas').getContext('2d');
function prep(sk){
  if(sk.g)return;const c=sk.c;
  const mk=(a,k0,k1,k2)=>{const g=GC.createLinearGradient(0,0,1,0);g.addColorStop(0,col(a,k0));g.addColorStop(.5,col(a,k1));g.addColorStop(1,col(a,k2));return g;};
  const body=GC.createLinearGradient(0,-15,0,16);body.addColorStop(0,col(c[0],.92));body.addColorStop(.5,col(c[0],1.08));body.addColorStop(.82,col(mixA(c[0],c[1],.7)));body.addColorStop(1,col(c[1],.96));
  sk.g={wing:mk(c[2],.85,1.08,.52),far:mk(c[2],.55,.7,.4),tail:mk(c[0],.8,1,.55),body,head:col(mixA(c[0],c[1],.32),1.06),nape:col(mixA(c[0],c[1],.5),1.12)};
}
function drawWing(c,ang,sk,far){
  const L=[22,27,32,37,41,44,40];
  for(let i=0;i<7;i++){c.save();c.rotate(Math.PI+ang+(i-3)*.1);featherU(c,L[i],6.2,far?sk.g.far:sk.g.wing);c.restore();}
  if(far)return;
  c.save();c.rotate(Math.PI+ang);
  for(let k=0;k<4;k++){c.fillStyle=col(sk.c[2],1.22);c.beginPath();c.ellipse(9+k*6.5,0,5.6,7.6-k*.7,0,0,6.3);c.fill();}
  for(let k=0;k<3;k++){c.fillStyle=col(sk.c[2],1.42);c.beginPath();c.ellipse(7+k*6,-.4,4,5.2-k*.4,0,0,6.3);c.fill();}
  c.restore();
}
function drawBird(c,x,y,rot,sk,wp,amp,sc){
  prep(sk);const fl=Math.sin(wp)*amp+.15,wob=Math.sin(wp*.8)*3;
  const piece=n=>{c.save();ACC[n](c,sk,wob,wp);c.restore();};
  c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);
  if(sk.back)sk.back.forEach(piece);
  [0,4,1,3,2].forEach(i=>{c.save();c.translate(-19,3);c.rotate(Math.PI+(i-2)*.14+fl*.05);featherU(c,[21,25,28,25,21][i],5.6,sk.g.tail);c.restore();});
  c.save();c.translate(2,-2);drawWing(c,fl*.8-.12,sk,true);c.restore();
  c.beginPath();c.moveTo(-22,2);c.bezierCurveTo(-18,-14,8,-16,20,-8);c.bezierCurveTo(27,-4,24,10,12,14);c.bezierCurveTo(0,18,-16,12,-22,2);c.closePath();c.fillStyle=sk.g.body;c.fill();
  for(let r=0;r<3;r++)for(let j=0;j<4;j++){c.save();c.translate(3+j*5-r*1.5,3.5+r*3.6);c.rotate(Math.PI/2-.35);featherU(c,7,2.6,col(sk.c[1],.92,.3));c.restore();}
  c.fillStyle=col(sk.c[1],.92);c.beginPath();c.ellipse(3,11,6.5,4.4,.1,0,6.3);c.fill();
  c.fillStyle='#e0aa30';for(let i=0;i<3;i++){c.save();c.translate(4+i*3.4,15.6-i*.6);c.rotate(.5+i*.2);c.beginPath();c.ellipse(0,0,2.5,1.2,0,0,6.3);c.fill();c.restore();}
  c.save();c.translate(-2,-4);drawWing(c,fl,sk,false);c.restore();
  if(sk.mid)sk.mid.forEach(piece);
  c.fillStyle=sk.g.head;c.beginPath();c.ellipse(11,-1,8,7,.3,0,6.3);c.fill();
  c.fillStyle=sk.g.nape;[[12,-10,.35],[11.5,-7,.1],[11,-4,-.1]].forEach(f=>{c.save();c.translate(f[0],f[1]);c.rotate(Math.PI+f[2]);featherU(c,8,2.6,sk.g.nape);c.restore();});
  c.fillStyle=sk.g.head;c.beginPath();c.moveTo(10,-3);c.bezierCurveTo(8,-12,14,-18.8,22,-16.8);c.bezierCurveTo(26,-15.8,28,-13,27.8,-10.5);c.bezierCurveTo(27.6,-6,24,-2,18,-1.5);c.bezierCurveTo(14,-1.2,11,-1.5,10,-3);c.closePath();c.fill();
  c.fillStyle='#e9b22e';c.beginPath();c.moveTo(25.5,-12.8);c.bezierCurveTo(32.5,-13.6,38,-9.5,36.6,-3);c.bezierCurveTo(35.8,-5.6,32.5,-6.8,29,-6.4);c.lineTo(25.6,-6.2);c.closePath();c.fill();
  c.fillStyle='#8a6414';c.beginPath();c.moveTo(34.6,-8);c.bezierCurveTo(36.4,-7,37.2,-5,36.6,-3);c.bezierCurveTo(35.8,-5.6,34.6,-6.5,33.4,-6.9);c.closePath();c.fill();dot(c,28.4,-10.6,.7,'#8a6414');
  c.fillStyle='#d9a22a';c.beginPath();c.moveTo(25.8,-6.4);c.lineTo(31.2,-5.9);c.quadraticCurveTo(29.5,-3.6,26,-3.8);c.closePath();c.fill();
  dot(c,22,-9.4,3.2,col(sk.c[2],.55));dot(c,22.2,-9.4,2.6,'#e8a317');dot(c,22.5,-9.4,1.4,'#111');dot(c,23,-10.1,.55,'#fff');
  c.fillStyle=col(sk.c[2],.75);c.beginPath();c.moveTo(17.5,-12.6);c.quadraticCurveTo(22,-15.2,26.4,-12);c.lineTo(25.8,-10.8);c.quadraticCurveTo(22,-12.8,18,-10.9);c.closePath();c.fill();
  if(sk.front)sk.front.forEach(piece);
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
const TREES=(()=>{const it=[];let x=20;while(x<1000){it.push({k:rr()<.7?'palm':'tree',x,h:60+rr()*50,l:(rr()-.5)*26});x+=60+rr()*90;}return{it,w:x+40};})();
const CLOUDS=Array.from({length:7},(_,i)=>({x:i*190+rr()*60,y:40+rr()*150,s:.7+rr()*.9,v:4+rr()*6}));
const STARS=Array.from({length:70},()=>({x:rr(),y:rr()*.55,r:.6+rr()*1.3,p:rr()*6}));
const RAIN=Array.from({length:130},()=>({x:rr()*500,y:rr()*H,v:620+rr()*260,l:10+rr()*12}));
const FLAKES=Array.from({length:100},()=>({x:rr()*500,y:rr()*H,v:40+rr()*60,r:1.2+rr()*2.2,p:rr()*6}));

/* ===== مدينة رافدينية مرسومة مرة واحدة على لوحة خفية (أداء عالٍ) ===== */
const RS=1.4;
function mkTile(w,h,fn){
  const mk=()=>{const k=document.createElement('canvas');k.width=Math.round(w*RS);k.height=Math.round(h*RS);const x=k.getContext('2d');x.scale(RS,RS);return[k,x];};
  const t={w,h,det:mk(),win:mk(),out:mk(),key:'',last:-9};fn(t.det[1],t.win[1],w,h);t.out[1].setTransform(1,0,0,1,0,0);return t;
}
function farCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h)=>{l.fillStyle='#ffd27a';l.fillRect(x,y,w||3,h||5);};
  const blob=(x,y,r,c)=>dot(d,x,y,r,c);
  const crenel=(x,y,w,c,g)=>{for(let i=0;i<w-5;i+=10){R(x+i,y-7,6,7,c);if(g)R(x+i,y-7,6,1.4,g);}};
  const archCut=(cx,by,w,h)=>{d.save();d.globalCompositeOperation='destination-out';d.beginPath();d.rect(cx-w/2,by-h,w,h);d.arc(cx,by-h,w/2,Math.PI,0);d.fill();d.restore();};
  /* زقورة أور */
  (function(x0){const cx=x0+100;let y=H;
    [[200,26],[152,26],[110,26],[72,24]].forEach((t,i)=>{y-=t[1];R(cx-t[0]/2,y,t[0],t[1],i%2?'#cf9f5c':'#c4934f');R(cx-t[0]/2,y,t[0],3,'#e6bf80');R(cx-t[0]/2,y+t[1]-3,t[0],3,'#8f6630');});
    d.fillStyle='#a6742f';d.beginPath();d.moveTo(cx-17,H);d.lineTo(cx-8,H-78);d.lineTo(cx+8,H-78);d.lineTo(cx+17,H);d.closePath();d.fill();
    d.strokeStyle='#7d5421';d.lineWidth=1;for(let s=0;s<9;s++){const yy=H-s*8.6,w=17-9*((H-yy)/78);d.beginPath();d.moveTo(cx-w,yy);d.lineTo(cx+w,yy);d.stroke();}
    const sy=y-22;R(cx-17,sy,34,22,'#1f5fbf');R(cx-19,sy-3,38,4,GLD);R(cx-3,sy+9,6,13,'#1b1208');lit(cx-12,sy+8,3,5);lit(cx+9,sy+8,3,5);lit(cx-2.5,sy+13,5,9);
  })(60);
  /* بوابة عشتار */
  (function(x0){const tw=50,th=150,gw=70,ty=H-th,animal=(x,y)=>{d.fillStyle='#e8c25a';d.beginPath();d.ellipse(x,y,6,2.6,0,0,6.3);d.fill();dot(d,x+6.5,y-2.6,2,'#e8c25a');R(x-4,y+1,1.6,3.4,'#e8c25a');R(x+3,y+1,1.6,3.4,'#e8c25a');R(x-8,y-.8,3,1.2,'#e8c25a');};
    [x0,x0+tw+gw].forEach(tx=>{R(tx,ty,tw,th,'#1b4aa8');for(let ry=ty+14,i=0;ry<H-10;ry+=19,i++){R(tx,ry,tw,2.4,'#dbe6ff');if(i%2===0){animal(tx+14,ry+11);animal(tx+36,ry+11);}else{R(tx,ry+5,tw,1.2,GLD);}}
      R(tx-2,ty-4,tw+4,5,GLD);crenel(tx,ty-4,tw,'#1b4aa8',GLD);lit(tx+tw/2-1.5,ty+36,3,9);lit(tx+tw/2-1.5,ty+78,3,9);});
    R(x0+tw,H-118,gw,118,'#173f95');R(x0+tw,H-118,gw,4,GLD);crenel(x0+tw,H-118,gw,'#173f95',GLD);animal(x0+tw+20,H-96);animal(x0+tw+50,H-96);
    for(let ry=H-86;ry<H-60;ry+=10)R(x0+tw,ry,gw,1.6,'#dbe6ff');
    archCut(x0+tw+gw/2,H,32,56);d.strokeStyle=GLD;d.lineWidth=2;d.beginPath();d.moveTo(x0+tw+gw/2-16,H);d.lineTo(x0+tw+gw/2-16,H-56);d.arc(x0+tw+gw/2,H-56,16,Math.PI,0);d.lineTo(x0+tw+gw/2+16,H);d.stroke();
  })(640);
  /* الجنائن المعلّقة */
  (function(x0){const cx=x0+95;let y=H;
    [[190,24],[160,24],[130,24],[100,24],[70,22]].forEach((t,i)=>{y-=t[1];R(cx-t[0]/2,y,t[0],t[1],i%2?'#c79a58':'#b88a4c');R(cx-t[0]/2,y,t[0],3,'#dcb878');
      for(let a=cx-t[0]/2+10,n=0;a<cx+t[0]/2-12;a+=22,n++){d.fillStyle='#4a2f14';d.beginPath();d.rect(a,y+9,8,t[1]-9);d.arc(a+4,y+9,4,Math.PI,0);d.fill();if(n%2)lit(a+2.5,y+13,3,5);}
      for(let g=cx-t[0]/2,n=0;g<=cx+t[0]/2;g+=9,n++){const r=5+((n*7)%4);blob(g,y,r,'#3f9150');blob(g+3,y-3,r*.7,'#52a85e');for(let v=1;v<=2+(i%2);v++)blob(g+1,y+v*5,2.4,'#2f7a3d');}});
    [[cx-14,y,-6],[cx+16,y,5]].forEach(p=>{d.strokeStyle='#6a4a28';d.lineWidth=3;d.beginPath();d.moveTo(p[0],p[1]);d.quadraticCurveTo(p[0]+p[2]*.3,p[1]-16,p[0]+p[2],p[1]-30);d.stroke();d.strokeStyle='#2f7a3d';d.lineWidth=2.6;
      for(let f=-3;f<=3;f++){const a=-Math.PI/2+f*.55;d.beginPath();d.moveTo(p[0]+p[2],p[1]-30);d.quadraticCurveTo(p[0]+p[2]+Math.cos(a)*10,p[1]-30+Math.sin(a)*10-5,p[0]+p[2]+Math.cos(a)*19,p[1]-30+Math.sin(a)*19+Math.abs(f)*3);d.stroke();}});
  })(900);
  /* مئذنة الملوية */
  (function(x0){const cx=x0+40;R(cx-32,H-22,64,22,'#c9a468');R(cx-32,H-22,64,3,'#e2c487');let y=H-22;
    [44,38,32,26].forEach(w=>{y-=38;R(cx-w/2,y,w,38,'#d1ad70');d.save();d.beginPath();d.rect(cx-w/2,y,w,38);d.clip();d.strokeStyle='#9b7338';d.lineWidth=3;for(let k=-2;k<9;k++){d.beginPath();d.moveTo(cx-w/2-4,y+k*8);d.lineTo(cx+w/2+4,y+k*8-9);d.stroke();}d.restore();R(cx-w/2-1.5,y,w+3,3,'#b48c4c');});
    R(cx-9,y-14,18,14,'#c9a468');d.fillStyle='#d8b87a';d.beginPath();d.arc(cx,y-14,9,Math.PI,0);d.fill();R(cx-1,y-31,2,9,'#b48c4c');lit(cx-2,y-9,4,6);
  })(1230);
  /* قبة الكاظمية وبغداد */
  (function(x0){const cx=x0+70;R(cx-48,H-46,96,46,'#d8c59c');R(cx-48,H-46,96,4,'#efe0b8');R(cx-48,H-14,96,14,'#1f5fbf');R(cx-48,H-16,96,2,GLD);
    d.fillStyle='#1f5fbf';d.beginPath();d.rect(cx-14,H-46,28,46);d.arc(cx,H-46,14,Math.PI,0);d.fill();d.fillStyle='#2a1a10';d.beginPath();d.rect(cx-8,H-36,16,36);d.arc(cx,H-36,8,Math.PI,0);d.fill();lit(cx-4,H-26,8,14);
    d.fillStyle='#e8b53a';d.beginPath();d.ellipse(cx,H-46,36,34,0,Math.PI,0);d.fill();d.fillStyle='#f6d36a';d.beginPath();d.ellipse(cx-8,H-52,16,18,-.3,Math.PI,0);d.fill();R(cx-1,H-90,2,11,GLD);dot(d,cx,H-92,2.4,GLD);
    [x0+8,x0+124].forEach(mx=>{R(mx,H-150,9,150,'#e2d2a8');R(mx-3,H-118,15,4,'#c9a468');R(mx,H-100,9,3,'#1f5fbf');R(mx,H-70,9,3,'#1f5fbf');d.fillStyle='#e8b53a';d.beginPath();d.arc(mx+4.5,H-150,5.5,Math.PI,0);d.fill();R(mx+3.5,H-164,2,9,'#e8b53a');lit(mx+3,H-135,3,6);});
  })(1450);
  /* بيوت من الطين المشوي بين المعالم */
  const hc=['#cfa66a','#c49a5e','#d6b27a','#bb8f55'];
  [[0,48],[285,625],[835,885],[1095,1210],[1305,1440],[1600,1890]].forEach(rg=>{let x=rg[0]+4;while(x<rg[1]-30){const w=26+rr()*20,h=22+rr()*34;
    R(x,H-h,w,h,hc[(rr()*4)|0]);R(x-1,H-h-3,w+2,3,'#a47a44');R(x+w*.5-3,H-13,6,13,'#3a2412');if(rr()<.6)lit(x+4,H-h+8,3,4);if(rr()<.6)lit(x+w-8,H-h+8,3,4);if(w>34)lit(x+w/2-1.5,H-h+16,3,4);if(rr()<.25){d.fillStyle='#d8b87a';d.beginPath();d.arc(x+w/2,H-h-3,w*.28,Math.PI,0);d.fill();}
    x+=w+2+rr()*5;}});
}
function nearCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h)=>{l.fillStyle='#ffd27a';l.fillRect(x,y,w||3,h||5);};
  const hc=['#c9a066','#bf9358','#d3ad74','#b88a50'];
  for(let x=0;x<W-40;){const w=30+rr()*24,h=52+rr()*40;R(x,H-h,w,h,hc[(rr()*4)|0]);R(x-1,H-h-3,w+2,3,'#9c723c');
    for(let wy=H-h+10;wy<H-48;wy+=14)for(let wx=x+6;wx<x+w-6;wx+=10){R(wx,wy,4,6,'#4a2f14');if(rr()<.55)lit(wx,wy,4,6);}
    if(rr()<.3){d.fillStyle='#d8b87a';d.beginPath();d.arc(x+w/2,H-h-3,w*.3,Math.PI,0);d.fill();}x+=w+1;}
  R(0,H-38,W,38,'#b98650');for(let y=H-28;y<H;y+=10)R(0,y,W,1,'rgba(90,56,24,.35)');for(let x=0;x<W;x+=14){R(x,H-46,8,8,'#b98650');R(x,H-46,8,1.5,'#d4a870');}
  for(let x=70;x<W-60;x+=250){R(x,H-96,38,96,'#a87a46');R(x-2,H-100,42,5,'#8d6234');for(let i=0;i<4;i++){R(x-2+i*11,H-108,7,8,'#a87a46');}
    lit(x+17,H-80,4,10);lit(x+17,H-55,4,10);d.fillStyle='#b52a2a';d.beginPath();d.moveTo(x+38,H-92);d.lineTo(x+52,H-86);d.lineTo(x+38,H-80);d.closePath();d.fill();
    const gx=x+125;d.fillStyle='#2a1810';d.beginPath();d.rect(gx-12,H-30,24,30);d.arc(gx,H-30,12,Math.PI,0);d.fill();lit(gx-9,H-18,3,4);lit(gx+6,H-18,3,4);}
}
const CITY_FAR=mkTile(1900,250,farCity),CITY_NEAR=mkTile(1500,130,nearCity);
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
  c.strokeStyle=col([70,48,28],k,.5);c.lineWidth=1;for(let i=1;i<7;i++){const t=i/7,px=lerp(x,tx,t*t),py=lerp(base,ty,t);c.beginPath();c.moveTo(px-3,py);c.lineTo(px+3,py);c.stroke();}
  const lc=mixA([36,125,62],[235,240,245],sn*.75);c.strokeStyle=col(lc,k);c.lineWidth=4;
  for(let i=-3;i<=3;i++){const a=-Math.PI/2+i*.5,L=34,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L+Math.abs(i)*6;
    c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*L*.55,ty+Math.sin(a)*L*.55-9,ex,ey);c.stroke();}
  c.fillStyle=col([150,90,30],k);c.beginPath();c.arc(tx-3,ty+4,2.2,0,6.3);c.arc(tx+3,ty+5,2.2,0,6.3);c.fill();
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
  drawTile(c,CITY_FAR,.12,cam,W,GY-40-CITY_FAR.h,.3,t);
  drawTile(c,CITY_NEAR,.26,cam,W,GY+1-CITY_NEAR.h,.1,t);
  const off=-((cam*.42)%TREES.w);
  for(let ox=off;ox<W+60;ox+=TREES.w)for(const tr of TREES.it){const x=ox+tr.x;if(x>W+70||x<-70)continue;
    if(tr.k==='palm')palm(c,x,GY+3,tr.h,tr.l,k,ENV.snow);else roundTree(c,x,GY+3,tr.h,k,ENV.snow);}
}
function drawGround(c,W,cam){
  const k=shadeK(),gc=mixA([118,152,66],[240,244,250],ENV.snow*.92);
  const g=c.createLinearGradient(0,GY,0,H);g.addColorStop(0,col(gc,k*1.05));g.addColorStop(1,col(mixA(gc,[90,70,40],.55),k));c.fillStyle=g;c.fillRect(-5,GY,W+10,H-GY+5);
  c.fillStyle=col(mixA(gc,[60,80,30],.5),k);c.fillRect(-5,GY,W+10,5);
  c.strokeStyle=col(mixA(gc,[60,80,30],.5),k,.7);c.lineWidth=2;
  const o=-(cam%46);c.beginPath();for(let x=o;x<W+46;x+=46){c.moveTo(x,GY+5);c.lineTo(x-4,GY+13);c.moveTo(x+5,GY+5);c.lineTo(x+7,GY+14);}c.stroke();
  c.fillStyle=col([90,64,38],k,.5);const o2=-(cam%130);for(let x=o2;x<W+130;x+=130){c.beginPath();c.ellipse(x+40,GY+36,9,3.5,0,0,6.3);c.fill();}
}
function partsUpdate(dt,W,speed){
  for(const r of RAIN){r.y+=r.v*dt;r.x-=speed*.2*dt;if(r.y>H){r.y=-20;r.x=Math.random()*(W+100);}if(r.x<-20)r.x=W+20;}
  for(const f of FLAKES){f.y+=f.v*dt;f.p+=dt;f.x+=Math.sin(f.p*1.5)*18*dt-speed*.1*dt;if(f.y>H){f.y=-10;f.x=Math.random()*(W+100);}if(f.x<-10)f.x=W+10;}
}
function partsDraw(c,W,low){
  if(ENV.rain>.04){c.strokeStyle='rgba(190,215,255,'+.55*ENV.rain+')';c.lineWidth=1.3;c.beginPath();const n=low?60:RAIN.length;for(let i=0;i<n;i++){const r=RAIN[i];c.moveTo(r.x,r.y);c.lineTo(r.x-r.l*.22,r.y-r.l);}c.stroke();}
  if(ENV.snow>.04){c.fillStyle='rgba(255,255,255,'+.9*ENV.snow+')';c.beginPath();const n=low?50:FLAKES.length;for(let i=0;i<n;i++){const f=FLAKES[i];c.moveTo(f.x+f.r,f.y);c.arc(f.x,f.y,f.r,0,6.3);}c.fill();}
}
function bricks(c,x,w,y0,y1,k){c.strokeStyle=col([120,84,40],k,.42);c.lineWidth=1.4;const dir=y1>y0?1:-1;let row=0;c.beginPath();
  for(let y=y0;dir>0?y<y1:y>y1;y+=24*dir,row++){c.moveTo(x,y);c.lineTo(x+w,y);const jx=x+(row%2?w*.3:w*.7);c.moveTo(jx,y);c.lineTo(jx,y+24*dir);}c.stroke();}
function drawPipe(c,p){
  const k=shadeK(),top=p.gapY-p.gap/2,bot=p.gapY+p.gap/2,x=p.x,w=p.w;
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,col([238,198,122],k));g.addColorStop(.35,col([214,168,95],k));g.addColorStop(1,col([146,104,50],k));
  c.fillStyle=g;c.fillRect(x,-30,w,top+30);c.fillRect(x,bot,w,GY-bot+2);
  bricks(c,x,w,top-26,-30,k);bricks(c,x,w,bot+26,GY,k);
  c.fillRect(x-6,top-26,w+12,26);c.fillRect(x-6,bot,w+12,26);
  c.fillStyle=col([236,192,86],k);c.fillRect(x-6,top-9,w+12,4);c.fillRect(x-6,bot+5,w+12,4);
  c.strokeStyle=col([90,60,26],k,.6);c.lineWidth=1.5;c.strokeRect(x-6,top-26,w+12,26);c.strokeRect(x-6,bot,w+12,26);
  c.fillStyle=col([236,192,86],k);c.beginPath();for(let i=0;i<4;i++){const px=x-2+i*(w-4)/3.2;c.moveTo(px,top-14);c.lineTo(px+3,top-20);c.lineTo(px+6,top-14);c.moveTo(px,bot+14);c.lineTo(px+3,bot+20);c.lineTo(px+6,bot+14);}c.fill();
  if(ENV.snow>.3){c.fillStyle='rgba(255,255,255,'+Math.min(1,ENV.snow)*.95+')';rrect(c,x-8,bot-4,w+16,7,3);c.fill();}
}
function drawCoin(c,o,t){
  const sx=Math.max(.18,Math.abs(Math.cos(t*4+o.ph)));c.save();c.translate(o.x,o.y);c.scale(sx,1);
  c.fillStyle='#f2c14e';c.beginPath();c.arc(0,0,10,0,6.3);c.fill();c.fillStyle='#fff3b0';c.beginPath();c.arc(-2.5,-2.5,5,0,6.3);c.fill();
  c.strokeStyle='#8a5e0c';c.lineWidth=1.5;c.beginPath();c.arc(0,0,10,0,6.3);c.stroke();c.lineWidth=1.2;c.beginPath();c.arc(0,0,6.3,0,6.3);c.stroke();c.restore();
}
const PUPC={magnet:['#ff5252','🧲'],shield:['#40c4ff','🛡️'],slow:['#b388ff','⏳']};
function drawPickup(c,o,t){
  const y=o.y+Math.sin(t*3+o.ph)*4,cl=PUPC[o.type][0];
  c.globalAlpha=.3+.1*Math.sin(t*4);c.fillStyle=cl;c.beginPath();c.arc(o.x,y,24,0,6.3);c.fill();c.globalAlpha=1;
  c.fillStyle='rgba(10,20,50,.78)';c.beginPath();c.arc(o.x,y,15,0,6.3);c.fill();c.strokeStyle=cl;c.lineWidth=2.4;c.stroke();
  c.font='17px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(PUPC[o.type][1],o.x,y+1);
}
