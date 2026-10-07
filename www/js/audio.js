'use strict';
/* صوت مُولَّد برمجياً: موسيقى مغامرات بإيقاع وبيس وألحان + مؤثرات + رعد واقعي */
let AC=null,mixer,mGain,sGain,mTimer=null,noiseBuf=null,mMode='menu',mStep=0,mNext=0,ld=7;
function audioInit(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  AC=new C();mixer=AC.createGain();mixer.connect(AC.destination);
  mGain=AC.createGain();sGain=AC.createGain();mGain.connect(mixer);sGain.connect(mixer);
  const dl=AC.createDelay(1);dl.delayTime.value=.27;const fb=AC.createGain();fb.gain.value=.3;const wet=AC.createGain();wet.gain.value=.28;
  mGain.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(mixer);
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=noiseBuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
  applyAudio();mNext=AC.currentTime+.15;mTimer=setInterval(musicTick,120);
}
function applyAudio(){if(!AC)return;mixer.gain.value=S.set.vol;mGain.gain.value=S.set.music?.8:0;sGain.gain.value=S.set.sfx?1:0;}
function audioPause(p){if(!AC)return;if(p)AC.suspend();else AC.resume();}
function setMusicMode(m){mMode=m;}
function tone(f,t,d,type,v,dest){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(dest||sGain);o.start(t);o.stop(t+d+0.05);}
function sweep(f1,f2,d,type,v,t0){const t=t0||AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(sGain);o.start(t);o.stop(t+d+0.05);}
/* ضجيج مفلتر بتردد متحرك (مخزن واحد يُعاد استخدامه) */
function noise(d,v,f1,f2,q,dest,t0){const t=t0||AC.currentTime,s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+d*.25);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(dest||sGain);s.start(t,Math.random()*.5);s.stop(t+d+.05);}
/* رعد واقعي: فرقعة قصيرة ثم قصف منخفض متدحرج بتموّجات وصدى */
function thunder(){
  const t=AC.currentTime,far=Math.random(),dur=3.4+Math.random()*1.6;
  if(far<.55)noise(.2,.12*(1-far),1800,400,.7,sGain,t);
  const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.Q.value=.5;lp.frequency.setValueAtTime(420-far*140,t);lp.frequency.exponentialRampToValueAtTime(60,t+dur);
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.36,t+.22);
  let tt=t+.22;while(tt<t+dur-.8){tt+=.3+Math.random()*.55;g.gain.linearRampToValueAtTime(.12+Math.random()*.22,tt);}
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(lp);lp.connect(g);g.connect(sGain);s.start(t,Math.random()*.5);s.stop(t+dur+.1);
  const o=AC.createOscillator(),og=AC.createGain();o.type='sine';o.frequency.setValueAtTime(60,t);o.frequency.exponentialRampToValueAtTime(32,t+dur);
  og.gain.setValueAtTime(.0001,t);og.gain.linearRampToValueAtTime(.14,t+.4);og.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(og);og.connect(sGain);o.start(t);o.stop(t+dur+.1);
}
function sfx(name){
  if(!AC||!S.set.sfx||AC.state!=='running')return;const t=AC.currentTime;
  switch(name){
    case'click':tone(720,t,.06,'triangle',.22);tone(1080,t+.035,.05,'triangle',.15);break;
    case'flap':{const p=1+Math.random()*.08-.04;noise(.17,.06,520*p,1900*p,.7);sweep(430*p,720*p,.12,'sine',.045);tone(1175*p,t+.03,.14,'sine',.02);break;}
    case'coin':tone(988,t,.09,'square',.08);tone(1319,t+.07,.2,'square',.08);break;
    case'point':tone(880,t,.07,'sine',.1);break;
    case'power':[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.07,.14,'triangle',.22));break;
    case'shield':noise(.3,.35,900,300,.8);sweep(700,160,.3,'triangle',.25);break;
    case'hit':noise(.4,.5,520,160,.8);sweep(240,55,.45,'sawtooth',.3);break;
    case'fall':sweep(520,70,.7,'sine',.22);break;
    case'buy':[660,880,1175,1568].forEach((f,i)=>tone(f,t+i*.06,.16,'triangle',.22));break;
    case'reward':[523,784,1047].forEach((f,i)=>tone(f,t+i*.1,.25,'sine',.25));break;
    case'quest':[523,659,784,1047,1319].forEach((f,i)=>tone(f,t+i*.07,.3,'triangle',.22));tone(2093,t+.4,.5,'sine',.08);break;
    case'thunder':thunder();break;
    case'error':sweep(220,120,.22,'square',.15);break;
  }
}
/* ===== موسيقى المغامرات: ري الصغير، 112 نبضة، دورة Dm - Bb - F - C ===== */
const ST=60/112/2;
const midif=m=>440*Math.pow(2,(m-69)/12);
const PROG=[{b:38,t:[62,65,69]},{b:46,t:[58,62,65]},{b:41,t:[60,65,69]},{b:48,t:[60,64,67]}];
const SCALE=[62,64,65,67,69,70,72,74,76,77,79,81];
function mtone(f,t,d,type,v,lp){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type=type;o.frequency.setValueAtTime(f,t);fl.type='lowpass';fl.frequency.value=lp||2400;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(mGain);o.start(t);o.stop(t+d+.05);}
function kick(t,v){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(48,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(mGain);o.start(t);o.stop(t+.25);}
function mnoise(t,d,v,f1,type){const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=f1;f.Q.value=.8;const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(mGain);s.start(t,Math.random()*.5);s.stop(t+d+.05);}
function musicStep(t,i){
  const ch=PROG[Math.floor(i/8)%4],s=i%8,play=mMode==='play';
  if(s===0)ch.t.forEach(m=>mtone(midif(m-12),t,ST*8,'sawtooth',.026,700));
  if(s===0||s===3||s===4||s===6)mtone(midif(ch.b+(s===3||s===6?7:0)),t,ST*.9,'triangle',play?.26:.2,600);
  mtone(midif(ch.t[[0,1,2,1,0,1,2,1][s]]+12),t,ST*1.4,'triangle',play?.075:.05,2600);
  if(s%2===0&&Math.random()<(play?.7:.4)){
    ld=clamp(ld+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)],2,11);
    if(s===0||s===4){let best=ld,bd=99;SCALE.forEach((n,j)=>{if(ch.t.some(m=>(m-n)%12===0)){const d=Math.abs(j-ld);if(d<bd){bd=d;best=j;}}});ld=best;}
    mtone(midif(SCALE[ld]),t,ST*(Math.random()<.4?3:1.6),'sawtooth',play?.055:.04,1700);
  }
  if(play){
    if(s===0||s===4||(s===6&&Math.random()<.3))kick(t,.28);
    if(s===2||s===6){mnoise(t,.12,.09,1800);mtone(190,t,.08,'triangle',.05,900);}
    mnoise(t,.04,s%2?.045:.028,7000,'highpass');
  }
}
function musicTick(){
  if(!AC||AC.state!=='running'||!S.set.music)return;
  if(mNext<AC.currentTime)mNext=AC.currentTime+.05;
  while(mNext<AC.currentTime+.4){musicStep(mNext,mStep);mStep++;mNext+=ST;}
}
