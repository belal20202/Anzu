'use strict';
/* الرسم: الطائر، المدينة والمناظر، العوائق */
const H=640,GY=570;

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

/* ===== البيئة: وقت اليوم والطقس (صحو، مطر، ثلج، ضباب، عاصفة) ===== */
const TT={
 day:{top:[79,179,255],bot:[200,236,255],light:1,sx:.75,sy:.17,sa:1,moon:0,stars:0},
 sunset:{top:[70,48,122],bot:[255,150,70],light:.6,sx:.7,sy:.6,sa:1,moon:0,stars:.15},
 night:{top:[5,10,36],bot:[32,48,98],light:.15,sx:.4,sy:.98,sa:0,moon:1,stars:1},
 dawn:{top:[52,62,128],bot:[255,176,150],light:.5,sx:.22,sy:.6,sa:1,moon:.25,stars:.3}
};
const ENV={top:[79,179,255],bot:[200,236,255],light:1,sx:.75,sy:.17,sa:1,moon:0,stars:0,grey:0,cloud:.3,rain:0,snow:0,fog:0,stormK:0,T:null};
const ENVK=['light','sx','sy','sa','moon','stars','grey','cloud','rain','snow','fog','stormK'];
function envTarget(time,w){const t=TT[time];
  ENV.T={top:t.top,bot:t.bot,light:t.light,sx:t.sx,sy:t.sy,sa:t.sa,moon:t.moon,stars:t.stars,
   grey:w==='storm'?.78:w==='rain'?.55:w==='snow'?.4:w==='fog'?.35:0,cloud:w==='clear'?.3:w==='snow'?.8:1,
   rain:(w==='rain'||w==='storm')?1:0,snow:w==='snow'?1:0,fog:w==='fog'?1:0,stormK:w==='storm'?1:0};}
function envUpdate(dt,quick){const k=quick?1:1-Math.exp(-dt*1.1),T=ENV.T;
  for(const q of['top','bot'])for(let i=0;i<3;i++)ENV[q][i]=lerp(ENV[q][i],T[q][i],k);
  for(const q of ENVK)ENV[q]=lerp(ENV[q],T[q],k);}
envTarget('day','clear');
let FL=0,FLX=.5;
function lightningTick(dt){FL=Math.max(0,FL-dt*3.5);if(ENV.stormK>.6&&Math.random()<dt*.28){FL=1;FLX=.2+Math.random()*.6;return true;}return false;}
function drawLightning(c,W){if(FL<=.02)return;c.fillStyle='rgba(235,240,255,'+FL*.38+')';c.fillRect(0,0,W,H);
  if(FL>.5){c.strokeStyle='rgba(255,255,255,'+FL+')';c.lineWidth=2.6;c.beginPath();let x=FLX*W,y=0;c.moveTo(x,y);while(y<GY-60){y+=32;x+=(Math.random()-.5)*34;c.lineTo(x,y);}c.stroke();}}

const rr=mulberry(11);
const CLOUDS=Array.from({length:7},(_,i)=>({x:i*190+rr()*60,y:40+rr()*150,s:.7+rr()*.9,v:4+rr()*6}));
const STARS=Array.from({length:70},()=>({x:rr(),y:rr()*.55,r:.6+rr()*1.3,p:rr()*6}));
const RAIN=Array.from({length:130},()=>({x:rr()*500,y:rr()*H,v:620+rr()*260,l:10+rr()*12}));
const FLAKES=Array.from({length:100},()=>({x:rr()*500,y:rr()*H,v:40+rr()*60,r:1.2+rr()*2.2,p:rr()*6}));
const CARS=[{o:0,l:0,c:[220,60,60],s:1.9},{o:500,l:0,c:[60,120,220],s:1.9},{o:260,l:1,c:[235,235,235],s:.6},{o:760,l:1,c:[250,200,40],s:.6}];
const BALLOONS=[{x:120,y:150,v:5,p:0,s:1,c:[[231,76,60],[250,200,60],[255,255,255]]},{x:420,y:215,v:3.5,p:2,s:.78,c:[[41,128,185],[236,240,241],[231,76,60]]},{x:700,y:120,v:4.4,p:4,s:.6,c:[[142,68,173],[243,156,18],[255,255,255]]}];

/* ===== أشجار كاملة: نخيل، أشجار، صنوبر ===== */
function palm(c,x,base,h,lean,k,sn,full){
  const tx=x+lean,ty=base-h;c.lineCap='round';
  c.strokeStyle=col([116,82,48],k);c.lineWidth=6;c.beginPath();c.moveTo(x,base);c.quadraticCurveTo(x+lean*.1,base-h*.6,tx,ty);c.stroke();
  c.strokeStyle=col([84,58,32],k,.6);c.lineWidth=1.2;c.beginPath();for(let i=1;i<9;i++){const t=i/9,px=lerp(x,tx,t*t*.9),py=lerp(base,ty,t);c.moveTo(px-3,py);c.lineTo(px+3,py-1);}c.stroke();
  const lc=mixA([38,132,64],[235,240,245],sn*.75),lc2=mixA(lc,[18,78,40],.4);
  for(let i=-4;i<=4;i++){const a=-Math.PI/2+i*.42,L=36+(4-Math.abs(i))*1.5,cx=tx+Math.cos(a)*L*.55,cy=ty+Math.sin(a)*L*.55-10,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L+Math.abs(i)*5+4;
    c.strokeStyle=col(lc,k);c.lineWidth=3.4;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(cx,cy,ex,ey);c.stroke();
    if(full){c.strokeStyle=col(lc2,k);c.lineWidth=1.6;c.beginPath();const dx=ex-tx,dy=ey-ty,ln=Math.hypot(dx,dy)||1,nx=-dy/ln*5.5,ny=dx/ln*5.5;
      for(let j=1;j<=5;j++){const t=j/6,u=1-t,px=u*u*tx+2*u*t*cx+t*t*ex,py=u*u*ty+2*u*t*cy+t*t*ey;c.moveTo(px-nx,py-ny+2);c.lineTo(px,py);c.lineTo(px+nx,py+ny+2);}c.stroke();}}
  dot(c,tx-3,ty+5,2.4,col([196,116,30],k));dot(c,tx+3,ty+6,2.4,col([196,116,30],k));dot(c,tx,ty+3,2.2,col([210,130,40],k));
}
function tree(c,x,base,h,k,sn){
  poly(c,[[x-3.4,base],[x-2,base-h*.58],[x+2,base-h*.58],[x+3.4,base]],col([100,68,38],k));
  c.strokeStyle=col([100,68,38],k);c.lineWidth=2.2;c.beginPath();c.moveTo(x,base-h*.45);c.lineTo(x-h*.17,base-h*.62);c.moveTo(x,base-h*.5);c.lineTo(x+h*.16,base-h*.66);c.stroke();
  const g1=mixA([40,128,62],[236,240,245],sn*.8),g2=mixA([62,158,80],[240,244,248],sn*.8),g3=mixA([28,104,52],[226,232,238],sn*.8);
  [[0,-.7,.26,g1],[-.2,-.56,.2,g3],[.21,-.56,.2,g3],[-.12,-.84,.19,g1],[.13,-.82,.18,g1],[0,-.6,.2,g1]].forEach(p=>dot(c,x+p[0]*h,base+p[1]*h,p[2]*h,col(p[3],k)));
  [[-.08,-.8,.11],[.12,-.7,.09],[-.2,-.6,.08]].forEach(p=>dot(c,x+p[0]*h,base+p[1]*h,p[2]*h,col(g2,k,.8)));
}
function pine(c,x,base,h,k,sn){
  c.fillStyle=col([96,66,38],k);c.fillRect(x-2.4,base-h*.2,4.8,h*.2);
  const g=mixA([30,102,64],[236,240,245],sn*.8),g2=mixA([44,128,80],[240,244,248],sn*.85);
  for(let i=0;i<4;i++){const y0=base-h*.14-i*h*.2,w=h*.3*(1-i*.2);poly(c,[[x-w,y0],[x,y0-h*.3],[x+w,y0]],col(i%2?g:g2,k));}
  if(sn>.2)poly(c,[[x-h*.07,base-h*.14-3*h*.2-h*.14],[x,base-h*.14-3*h*.2-h*.3],[x+h*.07,base-h*.14-3*h*.2-h*.14]],'rgba(255,255,255,'+sn*.9+')');
}
const TREES=(()=>{const it=[];let x=24;while(x<1100){const r=rr();it.push({k:r<.3?'palm':r<.7?'tree':'pine',x,h:58+rr()*50,l:(rr()-.5)*26});x+=62+rr()*90;}return{it,w:x+40};})();

/* ===== لوحات خفية تُرسم مرة واحدة: جبال، مدينة بعيدة، كورنيش قريب ===== */
const RS=1.15;
function mkTile(w,h,fn){
  const mk=()=>{const k=document.createElement('canvas');k.width=Math.round(w*RS);k.height=Math.round(h*RS);const x=k.getContext('2d');x.scale(RS,RS);return[k,x];};
  const t={w,h,det:mk(),win:mk(),out:mk(),key:'',last:-9};fn(t.det[1],t.win[1],w,h);t.out[1].setTransform(1,0,0,1,0,0);return t;
}
function mountTile(d,l,W,H){
  const TP=Math.PI*2;
  const ridge=(base,amp,colr,seed,snow,pines)=>{const y=x=>base-amp*(.42+.58*Math.abs(Math.sin(TP*7*x/W+seed)*Math.cos(TP*3*x/W+seed*2)))-amp*.1*Math.sin(TP*23*x/W+seed*3);
    d.fillStyle=colr;d.beginPath();d.moveTo(0,H);for(let x=0;x<=W;x+=8)d.lineTo(x,y(x));d.lineTo(W,H);d.closePath();d.fill();
    if(snow)for(let x=8;x<W;x+=8){const yy=y(x);if(yy<y(x-8)&&yy<y(x+8)&&yy<base-amp*.78){poly(d,[[x,yy],[x-15,yy+17],[x-6,yy+12],[x-1,yy+20],[x+6,yy+12],[x+16,yy+18]],'#f4f7fb');}}
    if(pines)for(let x=6;x<W;x+=12+((x*7)%9)){const yy=y(x),h=12+((x*13)%12);poly(d,[[x-4,yy+3],[x,yy-h],[x+4,yy+3]],pines);}};
  ridge(H-20,92,'#a9bdd2',1.3,true);ridge(H-8,70,'#8aa6bf',2.7,true);ridge(H+4,48,'#6f9a86',4.1,false,'#3f6f58');
  l.fillStyle='#ffd98a';for(let i=0;i<22;i++)l.fillRect((i*83)%W,H-8-((i*11)%12),1.8,1.8);
}
function farCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h,c)=>{l.fillStyle=c||'#ffd98a';l.fillRect(x,y,w,h);};
  const glow=(x,y,r,a,cc)=>{const g=l.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+(cc||'255,240,180')+','+a+')');g.addColorStop(1,'rgba('+(cc||'255,240,180')+',0)');l.fillStyle=g;l.fillRect(x-r,y-r,r*2,r*2);};
  const B=H-26,Z=[[610,930],[1020,1250],[1320,1590],[1650,1820],[2250,2360],[2770,2870]];
  const inZ=x=>Z.find(z=>x>z[0]-30&&x<z[1]);
  const rg=d.createLinearGradient(0,B,0,H);rg.addColorStop(0,'#5b93bd');rg.addColorStop(1,'#2f6590');d.fillStyle=rg;d.fillRect(0,B,W,26);
  d.fillStyle='rgba(255,255,255,.28)';for(let x=0;x<W;x+=26)d.fillRect(x+(x*7%13),B+5+(x*3%14),14,1.6);
  R(0,B-3,W,3,'#8f979f');
  const bld=(x,w,h,bc,gl,top)=>{R(x,B-h,w,h,bc);R(x,B-h,3,h,'rgba(255,255,255,.18)');R(x+w-3,B-h,3,h,'rgba(0,0,0,.12)');
    for(let wy=B-h+6;wy<B-8;wy+=8)for(let wx=x+4;wx<x+w-5;wx+=6){R(wx,wy,3.6,5,gl);if((((wx*13+wy*7)|0)&3)===0)lit(wx,wy,3.6,5);}
    if(top===1){R(x+w/2-1,B-h-16,2,16,'#8e99a6');lit(x+w/2-1.6,B-h-17.6,3.2,3.2,'#ff5252');}
    else if(top===2){R(x+4,B-h-9,w-8,9,bc);R(x+9,B-h-16,w-18,7,bc);}
    else if(top===3){poly(d,[[x,B-h],[x+w,B-h-14],[x+w,B-h]],bc);}
    else if(top===4){R(x+3,B-h-6,w-6,6,'#8e99a6');R(x+w/2-4,B-h-11,8,5,'#a2adb9');}};
  const bk=['#aebfd3','#b9c8d9','#a3b5ca'],fr=['#d9d2c5','#cfc6b8','#e2dccf','#bfb7a8'];
  let x=8,z;while(x<W-40){if((z=inZ(x))){x=z[1];continue;}const w=26+rr()*22,h=110+rr()*95;bld(x,w,h,bk[(rr()*3)|0],'#8fa8c4',(rr()*5)|0);x+=w+rr()*10;}
  x=0;while(x<W-30){if((z=inZ(x))){x=z[1];continue;}const w=34+rr()*30,h=40+rr()*62;bld(x,w,h,fr[(rr()*4)|0],'#5f7390',rr()<.4?4:0);x+=w+2+rr()*8;}
  /* ملعب كرة قدم كبير */
  (function(x0){const w=260,top=B-52;
    d.fillStyle='#7f8b99';d.beginPath();d.moveTo(x0,B);d.lineTo(x0+14,top+14);d.quadraticCurveTo(x0+w/2,top-14,x0+w-14,top+14);d.lineTo(x0+w,B);d.closePath();d.fill();
    for(let i=0;i<22;i++)R(x0+10+i*11.2,top+16,4,B-top-16,'rgba(255,255,255,.2)');
    d.fillStyle='#c5ced8';d.beginPath();d.moveTo(x0+4,top+18);d.quadraticCurveTo(x0+w/2,top-22,x0+w-4,top+18);d.lineTo(x0+w-4,top+26);d.quadraticCurveTo(x0+w/2,top-12,x0+4,top+26);d.closePath();d.fill();
    for(let i=0;i<7;i++){const ax=x0+24+i*32;d.fillStyle='#2d3640';d.beginPath();d.rect(ax,B-18,14,18);d.arc(ax+7,B-18,7,Math.PI,0);d.fill();lit(ax+3,B-12,8,12,'#ffe9a8');}
    [x0-14,x0+w+8].forEach(px=>{R(px,B-104,5,104,'#8e99a6');R(px-9,B-114,23,10,'#dfe6ee');for(let i=0;i<4;i++)lit(px-7+i*5.5,B-112,4,6,'#fffbe0');glow(px+2,B-110,40,.9);});
  })(660);
  /* عجلة دوّارة (ملاهي) */
  (function(cx,cy,r){d.strokeStyle='#8b96a3';d.lineWidth=2.2;d.beginPath();d.arc(cx,cy,r,0,6.3);d.stroke();d.beginPath();d.arc(cx,cy,r*.62,0,6.3);d.stroke();
    d.lineWidth=1;d.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6;d.moveTo(cx,cy);d.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}d.stroke();
    d.lineWidth=3.2;d.beginPath();d.moveTo(cx,cy);d.lineTo(cx-26,B-3);d.moveTo(cx,cy);d.lineTo(cx+26,B-3);d.stroke();
    const gc=['#ef5350','#42a5f5','#ffca28','#66bb6a','#ab47bc','#ff7043'];for(let i=0;i<12;i++){const a=i*Math.PI/6,gx=cx+Math.cos(a)*r,gy=cy+Math.sin(a)*r;R(gx-3.5,gy-2,7,6,gc[i%6]);lit(gx-2.5,gy-1,5,4,gc[i%6]);}
    for(let i=0;i<36;i++){const a=i*Math.PI/18;lit(cx+Math.cos(a)*r-1,cy+Math.sin(a)*r-1,2,2,'#fff3b0');}glow(cx,cy,r+14,.28,'255,230,150');dot(d,cx,cy,4,'#6c7683');
  })(1135,B-84,70);
  /* دار الأوبرا بأشرعتها */
  (function(x0){R(x0,B-14,230,14,'#cfd3d8');[[x0+8,64,64],[x0+52,86,96],[x0+112,74,80],[x0+168,56,52]].forEach(s=>{const sx=s[0],w=s[1],hh=s[2];d.fillStyle='#f6f3ec';d.beginPath();d.moveTo(sx,B-14);d.quadraticCurveTo(sx+w*.12,B-14-hh*1.15,sx+w*.55,B-14-hh);d.quadraticCurveTo(sx+w*.92,B-14-hh*.5,sx+w,B-14);d.closePath();d.fill();
    d.strokeStyle='#d6d0c0';d.lineWidth=1;d.beginPath();for(let i=1;i<6;i++){d.moveTo(sx+w*i/7,B-14);d.quadraticCurveTo(sx+w*(.1+i*.06),B-14-hh*.5,sx+w*.55,B-14-hh+2);}d.stroke();});
    lit(x0+10,B-12,210,3,'#ffe9a8');glow(x0+115,B-10,90,.35);
  })(1345);
  /* برجان توأمان وجسر معلّق بينهما */
  bld(1668,34,214,'#9fb2c8','#7f9ab6',1);bld(1722,34,204,'#a6b8cd','#7f9ab6',1);R(1702,B-120,20,6,'#8e99a6');lit(1702,B-119,20,2,'#fff3b0');
  /* برج الاتصالات */
  R(2301,B-205,5,205,'#aab4c0');R(2297,B-60,13,60,'#9aa5b2');d.fillStyle='#c0c9d4';d.beginPath();d.ellipse(2303.5,B-150,13,7,0,0,6.3);d.fill();lit(2292,B-151,23,3);R(2303,B-224,1.6,20,'#8e99a6');lit(2302.6,B-226,3,3,'#ff5252');
  /* خزان مياه */
  R(2800,B-60,3,60,'#8b95a1');R(2830,B-60,3,60,'#8b95a1');R(2800,B-66,33,8,'#6e7783');d.fillStyle='#c7ccd2';rrect(d,2796,B-92,41,28,6);d.fill();poly(d,[[2794,B-92],[2816.5,B-106],[2839,B-92]],'#aeb5be');lit(2806,B-80,6,5);
  /* قوارب على النهر */
  [210,890,1450,1820,2560,3000].forEach(bx=>{const by=B+13;d.fillStyle='#e8eef4';poly(d,[[bx,by],[bx+34,by],[bx+28,by+7],[bx+5,by+7]],'#e8eef4');R(bx+8,by-7,14,7,'#f5f8fb');R(bx+11,by-5,8,3,'#4f7fa8');lit(bx+11,by-5,8,3);});
}
function nearCity(d,l,W,H){
  const R=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(x,y,w,h);};
  const lit=(x,y,w,h,c)=>{l.fillStyle=c||'#ffd98a';l.fillRect(x,y,w,h);};
  const glow=(x,y,r,a,cc)=>{const g=l.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+(cc||'255,240,180')+','+a+')');g.addColorStop(1,'rgba('+(cc||'255,240,180')+',0)');l.fillStyle=g;l.fillRect(x-r,y-r,r*2,r*2);};
  const Z=[[500,790],[1500,1770],[290,390],[870,960],[1300,1360],[2240,2300]];
  const inZ=x=>Z.some(z=>x>z[0]-14&&x<z[1]+14);
  /* ملاعب كرة قدم مضاءة */
  [[520,260],[1520,240]].forEach(p=>{const px=p[0],w=p[1];R(px,H-24,w,12,'#3f9a4d');for(let i=0;i<w;i+=26)R(px+i,H-24,13,12,'rgba(255,255,255,.07)');R(px+w/2-1,H-24,2,12,'rgba(255,255,255,.5)');
    d.strokeStyle='#f4f4f4';d.lineWidth=1.8;[px+2,px+w-10].forEach(gx=>{d.strokeRect(gx,H-40,8,16);d.strokeStyle='rgba(255,255,255,.4)';d.lineWidth=.7;for(let i=1;i<4;i++){d.beginPath();d.moveTo(gx,H-40+i*4);d.lineTo(gx+8,H-40+i*4);d.stroke();}d.strokeStyle='#f4f4f4';d.lineWidth=1.8;});
    [px-6,px+w+3].forEach(fx=>{R(fx,H-88,3,76,'#4a525c');R(fx-6,H-94,15,7,'#dfe6ee');lit(fx-4,H-92,11,3,'#fffbe0');glow(fx+1,H-90,38,.9);});
    d.strokeStyle='rgba(70,80,90,.8)';d.lineWidth=1;d.beginPath();for(let i=0;i<w;i+=8){d.moveTo(px+i,H-30);d.lineTo(px+i,H-24);}d.stroke();});
  /* نافورة */
  (function(cx){d.fillStyle='#b9c2cc';d.beginPath();d.ellipse(cx,H-14,38,7,0,0,6.3);d.fill();d.fillStyle='#4fa3d8';d.beginPath();d.ellipse(cx,H-15,34,5,0,0,6.3);d.fill();R(cx-3,H-46,6,32,'#c9d1d9');d.fillStyle='#b9c2cc';d.beginPath();d.ellipse(cx,H-46,13,3,0,0,6.3);d.fill();
    d.strokeStyle='rgba(190,230,255,.9)';d.lineWidth=1.6;d.beginPath();[-1,1].forEach(s=>{for(let i=1;i<=3;i++){d.moveTo(cx,H-50);d.quadraticCurveTo(cx+s*i*9,H-76+i*4,cx+s*i*14,H-16);}});d.moveTo(cx,H-50);d.lineTo(cx,H-66);d.stroke();
    lit(cx-34,H-16,68,2,'#9fe2ff');glow(cx,H-30,46,.35,'150,220,255');})(340);
  /* مقاهي وأكشاك */
  [140,1080,1960].forEach(kx=>{R(kx,H-42,50,30,'#e0d6c2');for(let i=0;i<5;i++)R(kx+i*10,H-46,10,6,i%2?'#e53935':'#f5f5f5');R(kx+6,H-30,38,10,'#26323d');lit(kx+8,H-29,34,8,'#7fd8ff');glow(kx+25,H-26,34,.5);R(kx+2,H-24,4,12,'#5c6670');});
  /* موقف حافلة */
  R(880,H-44,3,32,'#4a525c');R(950,H-44,3,32,'#4a525c');R(876,H-48,80,5,'#2f3a45');d.fillStyle='rgba(160,210,240,.45)';d.fillRect(884,H-43,64,26);R(888,H-24,56,4,'#7a5a3a');lit(888,H-42,60,2,'#9fe2ff');glow(918,H-40,36,.4,'150,220,255');
  /* لوحات إعلانية مضيئة */
  [[1310,'#26c6da'],[2250,'#ec407a']].forEach(b=>{R(b[0]+22,H-60,4,48,'#4a525c');R(b[0],H-92,48,30,'#1c2128');R(b[0]+3,H-89,42,24,b[1]);lit(b[0]+3,H-89,42,24,b[1]);glow(b[0]+24,H-78,50,.45,'200,230,255');});
  /* ورود وأشجار */
  for(let x=30;x<W-20;x+=58+((x*7)%34)){if(inZ(x))continue;if((x*3)%5<2){R(x-2,H-38,4,26,'#5d4630');dot(d,x,H-40,11,'#2e7d4f');dot(d,x-6,H-34,8,'#3a9a60');dot(d,x+6,H-34,8,'#3a9a60');}else{for(let i=0;i<7;i++)dot(d,x-12+i*4,H-17-(i%2)*2,2.4,['#ff5c8a','#ffd54a','#ffffff','#ff8a50'][i%4]);R(x-13,H-14,28,3,'#2e7d4f');}}
  /* سور النهر */
  R(0,H-12,W,12,'#8d949c');R(0,H-12,W,2.5,'#c4c9cf');for(let x=0;x<W;x+=9)R(x,H-10,2,10,'#6e757d');
  /* أعمدة إنارة */
  for(let x=60;x<W;x+=190){R(x,H-82,3,70,'#3d434b');R(x-9,H-84,15,3,'#3d434b');lit(x-11,H-82,7,3,'#fff7d0');glow(x-7,H-80,36,.85);}
}
const CITY_MOUNT=mkTile(1800,150,mountTile),CITY_FAR=mkTile(3200,260,farCity),CITY_NEAR=mkTile(2400,110,nearCity);
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

/* ===== عناصر السماء: مناطيد، طائرة، أسراب طيور، نيزك، توربينات ===== */
function balloon(c,x,y,s,cl,k){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle=col(cl[0],k);c.beginPath();c.ellipse(0,0,16,20,0,0,6.3);c.fill();c.fillStyle=col(cl[1],k);c.beginPath();c.ellipse(0,0,8,20,0,0,6.3);c.fill();c.fillStyle=col(cl[2],k);c.beginPath();c.ellipse(0,0,3,20,0,0,6.3);c.fill();
  poly(c,[[-9,17],[9,17],[4,24],[-4,24]],col(cl[0],k));c.strokeStyle='rgba(60,40,20,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(-5,24);c.lineTo(-4,32);c.moveTo(5,24);c.lineTo(4,32);c.stroke();c.fillStyle=col([140,96,50],k);c.fillRect(-5,32,10,6);c.restore();}
function drawSky(c,W,cam,t,Q){
  const k=shadeK(),clear=clamp(1-ENV.grey*1.3-ENV.fog*.6,0,1);
  if(Q>1&&clear>.1){c.globalAlpha=clear;
    for(const b of BALLOONS){const x=((b.x-cam*.04-t*b.v)%(W+200)+W+200)%(W+200)-100;balloon(c,x,b.y+Math.sin(t*.6+b.p)*6,b.s,b.c,k);}
    const px=(t*48)%(W+900)-450,py=70+Math.sin(px*.003)*6;c.fillStyle=col([235,240,245],k);c.beginPath();c.ellipse(px,py,16,3,0,0,6.3);c.fill();poly(c,[[px-2,py],[px-8,py+9],[px-4,py+9],[px+4,py]],col([235,240,245],k));poly(c,[[px-14,py-1],[px-18,py-8],[px-13,py-8],[px-9,py-1]],col([235,240,245],k));
    c.strokeStyle='rgba(255,255,255,'+.28*k+')';c.lineWidth=2;c.beginPath();c.moveTo(px-16,py);c.lineTo(px-130,py+2);c.stroke();if(ENV.light<.6&&Math.floor(t*2)%2)dot(c,px+1,py+1,1.6,'#ff3b30');
    if(ENV.light>.4){const fx=((t*26+cam*.05)%(W+500))-250;c.strokeStyle='rgba(30,40,60,.7)';c.lineWidth=1.6;c.beginPath();for(let i=0;i<6;i++){const bx=fx+i*17,by=150+Math.abs(i-2.5)*7+Math.sin(t+i)*3,fl=Math.sin(t*9+i)*3.5;c.moveTo(bx-6,by+fl);c.quadraticCurveTo(bx-2,by-3,bx,by);c.quadraticCurveTo(bx+2,by-3,bx+6,by+fl);}c.stroke();}
    c.globalAlpha=1;}
  if(ENV.stars>.6&&clear>.5){const ph=(t%9)/1.1;if(ph<1){const sx=W*.2+ph*W*.35,sy=40+ph*90;c.strokeStyle='rgba(255,255,255,'+(1-ph)+')';c.lineWidth=2;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx-46,sy-26);c.stroke();}}
}
function drawTurbines(c,W,cam,t){
  const w=CITY_MOUNT.w;for(const bx of[300,760,1180,1560]){const off=-((cam*.04)%w);for(let ox=off;ox<W+40;ox+=w){const x=ox+bx,y=GY-38-24;if(x<-40||x>W+40)continue;
    c.strokeStyle='rgba(240,244,248,.85)';c.lineWidth=1.8;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-34);c.stroke();c.lineWidth=1.6;c.beginPath();for(let i=0;i<3;i++){const a=t*1.4+i*2.094+bx;c.moveTo(x,y-34);c.lineTo(x+Math.cos(a)*15,y-34+Math.sin(a)*15);}c.stroke();dot(c,x,y-34,1.6,'#e8edf2');}}
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
  drawSky(c,W,cam,t,Q);
  if(Q>1){drawTile(c,CITY_MOUNT,.04,cam,W,GY-38-CITY_MOUNT.h,.5,t);drawTurbines(c,W,cam,t);}
  drawTile(c,CITY_FAR,.1,cam,W,GY-12-CITY_FAR.h,.28,t);
  const fogC=mixA([214,220,228],[40,48,70],1-ENV.light);
  if(ENV.fog>.03){const fg=c.createLinearGradient(0,GY-300,0,GY);fg.addColorStop(0,col(fogC,1,0));fg.addColorStop(.55,col(fogC,1,ENV.fog*.5));fg.addColorStop(1,col(fogC,1,ENV.fog*.62));c.fillStyle=fg;c.fillRect(0,GY-300,W,300);}
  drawTile(c,CITY_NEAR,.3,cam,W,GY+1-CITY_NEAR.h,.08,t);
  const off=-((cam*.45)%TREES.w);
  for(let ox=off;ox<W+80;ox+=TREES.w)for(const tr of TREES.it){const x=ox+tr.x;if(x>W+80||x<-80)continue;
    if(tr.k==='palm')palm(c,x,GY+3,tr.h,tr.l,k,ENV.snow,Q>1);else if(tr.k==='tree')tree(c,x,GY+3,tr.h,k,ENV.snow);else pine(c,x,GY+3,tr.h,k,ENV.snow);}
  if(ENV.fog>.03){const fg=c.createLinearGradient(0,0,0,GY+4);fg.addColorStop(0,col(fogC,1,ENV.fog*.08));fg.addColorStop(1,col(fogC,1,ENV.fog*.3));c.fillStyle=fg;c.fillRect(0,0,W,GY+4);}
}
function drawCar(c,x,y,cl,dir,k){
  c.save();c.translate(x,y);if(dir<0){c.translate(38,0);c.scale(-1,1);}
  c.fillStyle=col(cl,k);rrect(c,0,0,38,10,3);c.fill();poly(c,[[8,0],[12,-7],[27,-7],[32,0]],col(cl,k*.9));
  poly(c,[[11,-.5],[14,-5.5],[25,-5.5],[29,-.5]],'#1d2a3a');dot(c,9,10,3.6,'#15171a');dot(c,29,10,3.6,'#15171a');
  if(ENV.light<.6){c.fillStyle='rgba(255,240,170,.9)';c.fillRect(37,2,3,3);poly(c,[[40,3],[70,-3],[70,11]],'rgba(255,240,170,.16)');}
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
/* ===== حواجز: أنابيب فولاذية عصرية ===== */
function steel(c,x,w,k){const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,col([52,70,92],k));g.addColorStop(.28,col([128,152,178],k));g.addColorStop(.5,col([104,128,154],k));g.addColorStop(1,col([42,58,78],k));return g;}
function hazard(c,x,y,w,h,k){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle=col([250,200,30],k);c.fillRect(x,y,w,h);c.fillStyle=col([30,32,36],k);for(let i=-h;i<w+h;i+=12){c.beginPath();c.moveTo(x+i,y+h);c.lineTo(x+i+6,y+h);c.lineTo(x+i+6+h,y);c.lineTo(x+i+h,y);c.closePath();c.fill();}c.restore();}
function drawPipe(c,p){
  const k=shadeK(),top=p.gapY-p.gap/2,bot=p.gapY+p.gap/2,x=p.x,w=p.w,dk=col([30,42,58],k);
  c.fillStyle=steel(c,x,w,k);c.fillRect(x,-30,w,top+30);c.fillRect(x,bot,w,GY-bot+2);
  c.fillStyle=col([30,42,58],k,.5);for(let y=top-60;y>-30;y-=50)c.fillRect(x,y,w,3);for(let y=bot+60;y<GY;y+=50)c.fillRect(x,y,w,3);
  c.fillStyle=steel(c,x-6,w+12,k);c.fillRect(x-6,top-26,w+12,26);c.fillRect(x-6,bot,w+12,26);
  c.strokeStyle=col([26,36,50],k,.9);c.lineWidth=1.5;c.strokeRect(x-6,top-26,w+12,26);c.strokeRect(x-6,bot,w+12,26);
  hazard(c,x-4,top-13,w+8,7,k);hazard(c,x-4,bot+6,w+8,7,k);
  for(let i=0;i<4;i++){const bx=x-1+i*(w+2)/3;dot(c,bx,top-20,1.3,dk);dot(c,bx,bot+20,1.3,dk);}
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
