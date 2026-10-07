'use strict';
/* أدوات الرسم المشتركة + ألوان الطائر + 20 زياً عربياً (على الجسم والرقبة والظهر فقط، بلا أي شيء على الرأس أو العين) */
const col=(a,k=1,al=1)=>'rgba('+(a[0]*k|0)+','+(a[1]*k|0)+','+(a[2]*k|0)+','+al+')';
const mixA=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const rrect=(c,x,y,w,h,r)=>{c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);};
const dot=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,6.3);c.fill();};
const poly=(c,pts,f)=>{c.fillStyle=f;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();};
function featherU(c,len,wid,fill){c.save();c.scale(len,wid);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(.3,-1,.9,-.9,1,0);c.bezierCurveTo(.9,.9,.3,1,0,0);c.fillStyle=fill;c.fill();c.restore();}
function bodyPath(c){c.beginPath();c.moveTo(-15,1);c.bezierCurveTo(-14,-12,8,-15,15,-6);c.bezierCurveTo(20,0,14,13,2,14);c.bezierCurveTo(-8,15,-14,9,-15,1);c.closePath();}
const clipBody=(c,fn)=>{c.save();bodyPath(c);c.clip();fn();c.restore();};
const ring=(c,cx,cy,rx,ry,a0,a1,n,r,cols,f2)=>{for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/(n-1),x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;dot(c,x,y,r,cols[i%cols.length]);if(f2)f2(x,y,i);}};
const star8=(c,cx,cy,r,f)=>{c.fillStyle=f;c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,q=i%2?r*.45:r;c.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q);}c.closePath();c.fill();};
const flower=(c,x,y,r,petal,center)=>{for(let p=0;p<5;p++)dot(c,x+Math.cos(p*1.2566)*r,y+Math.sin(p*1.2566)*r,r*.75,petal);dot(c,x,y,r*.55,center);};
const GOLD='#f2c14e',GOLD2='#d4af37';

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
const SKINS=[
 {n:'الأصلي',c:PAL.def,p:0},
 {n:'ثوب أبيض ومسبحة',c:PAL.def,gar:['b_thobe'],mid:['m_misbaha'],pc:{b_thobe:['#f7f5ef','#d4af37']},p:2000},
 {n:'بشت أسود مذهّب',c:PAL.gld,back:['k_bisht'],gar:['b_bisht'],pc:{b_bisht:['#14110d','#e0b24a'],k_bisht:['#14110d','#e0b24a']},p:2500},
 {n:'بشت بني مطرّز',c:PAL.org,back:['k_bisht'],gar:['b_bisht'],pc:{b_bisht:['#6b4423','#e8c15a'],k_bisht:['#6b4423','#e8c15a']},p:3000},
 {n:'قفطان مغربي',c:PAL.def,gar:['b_kaftan'],pc:{b_kaftan:['#0f7a55','#e0b24a']},p:3500},
 {n:'ثوب فلسطيني مطرّز',c:PAL.grn,gar:['b_tatreez'],p:4000},
 {n:'زبون عراقي',c:PAL.blu,gar:['b_zboon'],p:5000},
 {n:'جبّة دمشقية',c:PAL.vio,gar:['b_damask'],p:5500},
 {n:'صدرية مطرّزة',c:PAL.def,gar:['b_vest'],p:6000},
 {n:'سديري خليجي',c:PAL.org,gar:['b_sidayri'],p:7000},
 {n:'ثوب بدوي أحمر',c:PAL.red,gar:['b_bedouin'],p:7500},
 {n:'حُلي فضية بدوية',c:PAL.blu,gar:['b_indigo'],mid:['m_coins'],p:8500},
 {n:'عباءة مطرّزة',c:PAL.pnk,back:['k_abaya'],gar:['b_abaya'],p:9500},
 {n:'ثوب عماني',c:PAL.def,gar:['b_omani'],mid:['m_tassel'],p:11000},
 {n:'فروة شتوية',c:PAL.org,gar:['b_farwa'],mid:['m_fur'],pc:{m_fur:['#f6efe0','#e3d6bd']},p:12000},
 {n:'جلابة مغربية',c:PAL.grn,gar:['b_djellaba'],p:13500},
 {n:'ثوب بنقوش إسلامية',c:PAL.gld,gar:['b_zellige'],p:15000},
 {n:'ثوب ذهبي مطرّز',c:PAL.blk,gar:['b_gold'],p:17000},
 {n:'بشت ملكي',c:PAL.def,back:['k_bisht'],gar:['b_bisht'],pc:{b_bisht:['#f2e8cf','#d4af37'],k_bisht:['#f2e8cf','#d4af37']},p:20000},
 {n:'ثوب العروس',c:PAL.pnk,back:['k_train'],gar:['b_bride'],mid:['m_gold'],p:25000}
];
const ACC={
 b_thobe(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-9,40,30);c.fillStyle='rgba(0,0,0,.05)';for(let x=-17;x<21;x+=4)c.fillRect(x,-9,1,30);c.fillStyle='rgba(0,0,0,.09)';c.fillRect(-18,10,40,6);c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=.8;c.beginPath();c.moveTo(11,-5);c.lineTo(10,14);c.stroke();});for(let y=-2;y<12;y+=3.4)dot(c,10.8-(y+2)*.07,y,.9,k[1]);},
 m_misbaha(c){for(let i=0;i<11;i++){const t=i/10,x=18*t,y=3+6*Math.sin(Math.PI*t);dot(c,x,y,2.2,i%5===4?'#2b1b10':'#c8791c');dot(c,x-.6,y-.6,.7,'rgba(255,230,160,.8)');}c.strokeStyle='#8a5a1c';c.lineWidth=1.2;c.beginPath();c.moveTo(9,9);c.lineTo(9,14);c.stroke();c.fillStyle='#8a5a1c';c.beginPath();c.ellipse(9,15.5,1.8,2.6,0,0,6.3);c.fill();},
 b_bisht(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-9,40,30);c.fillStyle='#f6f2e8';c.fillRect(9.2,-9,3.4,30);c.fillStyle=k[1];c.fillRect(7.6,-9,1.6,30);c.fillRect(12.6,-9,1.6,30);for(let y=-8;y<14;y+=3.2)dot(c,10.9,y,.7,k[1]);c.fillRect(-18,-3,40,1.3);c.fillRect(-18,11,40,2);for(let x=-16;x<20;x+=3)poly(c,[[x,13],[x+1.5,15],[x+3,13]],k[1]);});},
 k_bisht(c,s,fl,wp,k){const p=()=>{c.beginPath();c.moveTo(7,-9);c.quadraticCurveTo(-8,-14+fl,-30,-6+fl*1.6);c.quadraticCurveTo(-27,6,-23,17+fl);c.quadraticCurveTo(-4,14,8,8);};p();c.closePath();c.fillStyle=k[0];c.fill();p();c.strokeStyle=k[1];c.lineWidth=2.4;c.stroke();for(let i=0;i<5;i++){const t=i/4;dot(c,lerp(-24,-8,t),lerp(9+fl*.5,2,t)+Math.sin(t*6)*1.5,.9,k[1]);}},
 b_kaftan(c,s,fl,wp,k){clipBody(c,()=>{c.fillStyle=k[0];c.fillRect(-18,-9,40,30);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(-18,10,40,6);c.fillStyle=k[1];c.fillRect(8.4,-9,3.6,30);for(let y=-8;y<14;y+=3.4)poly(c,[[8.4,y],[10.2,y+1.7],[12,y],[10.2,y-1.7]],'#0b4f37');c.fillStyle=k[1];c.fillRect(-18,-2,40,2.2);for(let x=-16;x<20;x+=4)poly(c,[[x,.2],[x+2,-1.6],[x+4,.2]],'#0b4f37');c.fillStyle=k[1];c.fillRect(-18,11,40,2);});for(let y=-4;y<12;y+=3.6)dot(c,10.2,y,.9,'#fff3b0');},
 b_tatreez(c){clipBody(c,()=>{c.fillStyle='#17110f';c.fillRect(-18,-9,40,30);const cl=['#c62828','#e65100','#2e7d32','#c62828'];for(let r=0;r<4;r++)for(let q=-6;q<=6;q++){const x=-4+q*2.6,y=-4+r*3;if(((q+r)&1)===0&&Math.abs(q)<=6-r){c.fillStyle=cl[(q+r+8)%4];c.fillRect(x-1,y-1,2,2);}}c.fillStyle='#c62828';c.fillRect(-18,9.5,40,2.4);for(let x=-16;x<20;x+=5){c.fillStyle='#e65100';c.fillRect(x,12.6,2.4,2.4);c.fillStyle='#2e7d32';c.fillRect(x+2.6,12.6,1.2,1.2);}});},
 b_zboon(c){clipBody(c,()=>{const cl=['#1a2b5c','#e8c15a','#f5f1e6','#1a2b5c'];for(let i=0;i<20;i++){c.fillStyle=cl[i%4];c.fillRect(-18+i*2.2,-9,2.2,30);}c.fillStyle='#b3262f';c.fillRect(-18,5.5,40,4);c.fillStyle='#e8c15a';c.fillRect(-18,7,40,.9);for(let i=0;i<16;i++){c.fillStyle=i%2?'#b3262f':'#e8c15a';c.fillRect(-17+i*2.6,9.5,1.4,4.5);}});dot(c,2,7.5,2.2,'#e8c15a');},
 b_damask(c){clipBody(c,()=>{c.fillStyle='#7a1230';c.fillRect(-18,-9,40,30);for(let r=0;r<5;r++)for(let q=0;q<7;q++){const x=-15+q*6+(r%2)*3,y=-6+r*5;flower(c,x,y,1.3,GOLD2,'#f6d36a');c.fillStyle=GOLD2;c.fillRect(x-.3,y+2.4,.6,1.6);}c.fillStyle=GOLD2;c.fillRect(-18,11,40,2);c.fillRect(8.6,-9,1.6,30);c.fillRect(12.2,-9,1.6,30);});},
 b_vest(c){clipBody(c,()=>{c.fillStyle='#f6f2e8';c.fillRect(-18,-9,40,30);c.fillStyle='#14214d';c.beginPath();c.moveTo(-18,-9);c.lineTo(7,-9);c.lineTo(11,3);c.lineTo(15,-9);c.lineTo(22,-9);c.lineTo(22,21);c.lineTo(-18,21);c.closePath();c.fill();c.strokeStyle=GOLD2;c.lineWidth=1.4;c.beginPath();c.moveTo(7,-9);c.lineTo(11,3);c.lineTo(15,-9);c.stroke();for(let r=0;r<3;r++)for(let q=0;q<6;q++)flower(c,-13+q*5+(r%2)*2.5,r*4.5,.9,GOLD2,'#ffe08a');c.fillStyle=GOLD2;c.fillRect(-18,12,40,1.6);});},
 b_sidayri(c){clipBody(c,()=>{c.fillStyle='#f4f1ea';c.fillRect(-18,-9,40,30);c.fillStyle='#7b4a22';c.beginPath();c.moveTo(-18,-9);c.lineTo(8,-9);c.lineTo(11,2);c.lineTo(14,-9);c.lineTo(22,-9);c.lineTo(22,21);c.lineTo(-18,21);c.closePath();c.fill();c.strokeStyle='rgba(255,226,170,.35)';c.lineWidth=.8;c.beginPath();for(let i=-30;i<30;i+=5){c.moveTo(i,-9);c.lineTo(i+24,15);c.moveTo(i+24,-9);c.lineTo(i,15);}c.stroke();c.strokeStyle=GOLD2;c.lineWidth=1.2;c.beginPath();c.moveTo(8,-9);c.lineTo(11,2);c.lineTo(14,-9);c.moveTo(-18,12);c.lineTo(22,12);c.stroke();dot(c,11,5,1,GOLD2);dot(c,11,8.5,1,GOLD2);});},
 b_bedouin(c){clipBody(c,()=>{c.fillStyle='#b3262f';c.fillRect(-18,-9,40,30);c.fillStyle='#14110f';c.fillRect(-14,-6,28,9);for(let x=-12;x<14;x+=4.2){poly(c,[[x,-5],[x+1.7,-3.4],[x,-1.8],[x-1.7,-3.4]],GOLD2);dot(c,x,.9,.8,'#43a047');}c.fillStyle='#14110f';c.fillRect(-18,10,40,4);for(let x=-16;x<20;x+=4)poly(c,[[x,10],[x+2,12.6],[x+4,10]],GOLD2);});},
 b_indigo(c){clipBody(c,()=>{c.fillStyle='#1c2f6b';c.fillRect(-18,-9,40,30);c.fillStyle='rgba(255,255,255,.06)';for(let x=-17;x<21;x+=4)c.fillRect(x,-9,1,30);c.fillStyle='#c9d1db';c.fillRect(9.4,-9,1.4,30);c.fillRect(-18,11,40,1.4);});},
 m_coins(c){c.strokeStyle='#c9d1db';c.lineWidth=1;c.beginPath();c.arc(9,-3,8.6,.15,2.95);c.stroke();for(let i=0;i<8;i++){const a=.15+i*(2.8/7),x=9+Math.cos(a)*8.6,y=-3+Math.sin(a)*8.6,r=i===3||i===4?3:2.2;dot(c,x,y+r,r,'#d8dde3');dot(c,x,y+r,r*.55,'#aab3bd');}dot(c,9,9,3.6,'#e6eaee');dot(c,9,9,2,'#b4bcc6');},
 b_abaya(c){clipBody(c,()=>{const g=c.createLinearGradient(-15,-9,18,14);g.addColorStop(0,'#1a1a22');g.addColorStop(1,'#07070a');c.fillStyle=g;c.fillRect(-18,-9,40,30);c.strokeStyle=GOLD2;c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(8,-8+i*5);c.quadraticCurveTo(13,-6+i*5,12.5,-3+i*5);c.stroke();}for(let x=-16;x<20;x+=3.4)dot(c,x,12.6,.8,GOLD2);c.fillStyle=GOLD2;c.fillRect(-18,10.4,40,1);flower(c,-8,2,1.4,'#c0c8d2',GOLD2);flower(c,-1,5,1.2,'#c0c8d2',GOLD2);});},
 k_abaya(c,s,fl){c.fillStyle='rgba(12,12,18,.9)';c.beginPath();c.moveTo(6,-9);c.quadraticCurveTo(-10,-14+fl,-27,-4+fl*1.4);c.quadraticCurveTo(-31,8+fl,-25,17+fl);c.quadraticCurveTo(-8,11,6,7);c.closePath();c.fill();c.strokeStyle=GOLD2;c.lineWidth=1.6;c.beginPath();c.moveTo(-27,-4+fl*1.4);c.quadraticCurveTo(-31,8+fl,-25,17+fl);c.stroke();},
 b_omani(c){clipBody(c,()=>{c.fillStyle='#f8f6f0';c.fillRect(-18,-9,40,30);c.fillStyle='rgba(0,0,0,.07)';c.fillRect(-18,10,40,6);poly(c,[[2,-9],[20,-9],[11,8]],GOLD2);poly(c,[[4.4,-9],[17.6,-9],[11,4.6]],'#f8f6f0');const cl=['#c62828','#1e88e5','#43a047','#7b1fa2'];for(let r=0;r<4;r++)for(let q=0;q<=3-r;q++){c.fillStyle=cl[(q+r)%4];c.fillRect(7.6+q*1.9+r*.95,-8+r*2.6,1.3,1.3);}});},
 m_tassel(c){c.strokeStyle='#6a4a2a';c.lineWidth=1.6;c.beginPath();c.moveTo(11,4);c.bezierCurveTo(9,7,13,9,11,12);c.stroke();c.strokeStyle=GOLD2;c.lineWidth=1;c.beginPath();c.moveTo(11,4);c.bezierCurveTo(13,7,9,9,11,12);c.stroke();poly(c,[[9,12],[13,12],[14,17],[8,17]],'#6a4a2a');c.strokeStyle=GOLD2;c.lineWidth=.8;c.beginPath();for(let x=8.6;x<14;x+=1.3){c.moveTo(x,13);c.lineTo(x+(x-11)*.2,17);}c.stroke();dot(c,11,12,1.4,GOLD2);},
 b_farwa(c){clipBody(c,()=>{c.fillStyle='#b08a5c';c.fillRect(-18,-9,40,30);c.lineWidth=.9;for(let i=0;i<70;i++){const x=-16+(i*13.7)%36,y=-8+(i*7.9)%23;c.strokeStyle=i%2?'#c9a577':'#8d6a40';c.beginPath();c.moveTo(x,y);c.lineTo(x+1.2,y+2.2);c.stroke();}c.fillStyle='#8a5a2c';c.fillRect(-18,5,40,1.6);for(let x=-17;x<22;x+=4)dot(c,x,12.5,3.2,'#f1e6d0');dot(c,9,2,1,'#5a3a1a');dot(c,9,6,1,'#5a3a1a');});},
 m_fur(c,s,fl,wp,k){ring(c,10,-1,8.6,6.6,.12*Math.PI,.9*Math.PI,9,3.3,[k[0],k[1]]);},
 b_djellaba(c){clipBody(c,()=>{c.fillStyle='#c2603a';c.fillRect(-18,-9,40,30);c.fillStyle='rgba(0,0,0,.1)';for(let x=-17;x<21;x+=3)c.fillRect(x,-9,1,30);c.fillStyle='#f3e4c4';c.fillRect(8.8,-9,4.4,30);for(let y=-8;y<14;y+=3.2){dot(c,11,y,1.1,'#5a2a14');dot(c,11,y,.45,'#f3e4c4');}c.fillStyle='#f3e4c4';c.fillRect(-18,10.5,40,2.4);for(let x=-16;x<20;x+=4)poly(c,[[x,10.5],[x+2,8.2],[x+4,10.5]],'#f3e4c4');});},
 b_zellige(c){clipBody(c,()=>{c.fillStyle='#123a8c';c.fillRect(-18,-9,40,30);for(let r=0;r<4;r++)for(let q=0;q<6;q++){const x=-14+q*6+(r%2)*3,y=-5+r*5.4;star8(c,x,y,2.6,'#e0b24a');dot(c,x,y,.8,'#123a8c');}c.fillStyle='#e0b24a';c.fillRect(-18,11,40,2);c.fillRect(-18,-9.4,40,1.2);});},
 b_gold(c){clipBody(c,()=>{const g=c.createLinearGradient(-15,-9,18,14);g.addColorStop(0,'#f6d77a');g.addColorStop(.5,'#e0b24a');g.addColorStop(1,'#b8861a');c.fillStyle=g;c.fillRect(-18,-9,40,30);for(let r=0;r<5;r++)for(let q=0;q<7;q++)flower(c,-15+q*6+(r%2)*3,-6+r*4.6,1.2,'#8e1b3a','#fff3b0');c.fillStyle='#8e1b3a';c.fillRect(-18,11.4,40,1.6);poly(c,[[-8,-9],[-2,-9],[8,14],[2,14]],'rgba(255,255,255,.18)');});},
 b_bride(c){clipBody(c,()=>{c.fillStyle='#fbf3e3';c.fillRect(-18,-9,40,30);c.fillStyle=GOLD2;c.fillRect(-18,2,40,1.6);for(let x=-17;x<21;x+=3.4)poly(c,[[x,3.6],[x+1.7,6.2],[x+3.4,3.6]],'#c62828');for(let i=0;i<10;i++)star8(c,-14+(i*7.1)%30,-6+(i*4.7)%8,1.4,'#e0b24a');c.fillStyle=GOLD2;c.fillRect(-18,11,40,2);for(let x=-17;x<21;x+=5)dot(c,x,8,.9,'#c62828');});},
 k_train(c,s,fl){c.fillStyle='rgba(255,252,244,.6)';c.beginPath();c.moveTo(6,-8);c.quadraticCurveTo(-12,-14+fl,-34,-4+fl*1.8);c.quadraticCurveTo(-40,8+fl,-30,18+fl*1.6);c.quadraticCurveTo(-10,12,6,8);c.closePath();c.fill();c.strokeStyle=GOLD2;c.lineWidth=1.4;c.beginPath();c.moveTo(-34,-4+fl*1.8);c.quadraticCurveTo(-40,8+fl,-30,18+fl*1.6);c.stroke();for(let i=0;i<9;i++)dot(c,-30+(i*4.3)%24,-1+(i*3.7)%14+fl*.4,.9,'#e0b24a');},
 m_gold(c){c.strokeStyle='#e0b24a';c.lineWidth=1.8;c.beginPath();c.arc(9,-3,8.4,.2,2.9);c.stroke();c.strokeStyle='#f6d36a';c.lineWidth=.8;c.beginPath();c.arc(9,-3,7.2,.2,2.9);c.stroke();for(let i=0;i<5;i++){const a=.55+i*.52;dot(c,9+Math.cos(a)*8.4,-3+Math.sin(a)*8.4+1.2,1.5,'#c62828');}dot(c,9,8,3,'#e0b24a');dot(c,9,8,1.6,'#c62828');}
};
