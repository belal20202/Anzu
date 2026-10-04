'use strict';
/* صوت مُولَّد برمجياً: موسيقى هادئة على مقام الحجاز + مؤثرات */
let AC=null,mixer,mGain,sGain,mTimer=null,nextT=0,mi=3,beat=0,noiseBuf=null;
function audioInit(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  AC=new C();mixer=AC.createGain();mixer.connect(AC.destination);
  mGain=AC.createGain();sGain=AC.createGain();mGain.connect(mixer);sGain.connect(mixer);
  const dl=AC.createDelay(1);dl.delayTime.value=0.45;const fb=AC.createGain();fb.gain.value=0.38;const wet=AC.createGain();wet.gain.value=0.45;
  mGain.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(mixer);
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=noiseBuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
  applyAudio();nextT=AC.currentTime+0.15;mTimer=setInterval(musicTick,250);
}
function applyAudio(){if(!AC)return;mixer.gain.value=S.set.vol;mGain.gain.value=S.set.music?0.85:0;sGain.gain.value=S.set.sfx?1:0;}
function audioPause(p){if(!AC)return;if(p)AC.suspend();else AC.resume();}
function tone(f,t,d,type,v,dest){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(dest||sGain);o.start(t);o.stop(t+d+0.05);}
function sweep(f1,f2,d,type,v,t0){const t=t0||AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(sGain);o.start(t);o.stop(t+d+0.05);}
/* ضجيج مفلتر بتردد متحرك (يعاد استخدام نفس المخزن لتفادي الحمل) */
function noise(d,v,f1,f2,q){const t=AC.currentTime,s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+d*.25);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(sGain);s.start(t,Math.random()*.5);s.stop(t+d+.05);}
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
    case'thunder':noise(1.6,.45,200,50,.5);sweep(90,40,1.2,'sawtooth',.18);break;
    case'error':sweep(220,120,.22,'square',.15);break;
  }
}
const HZ=[0,1,4,5,7,8,10];
const midif=m=>440*Math.pow(2,(m-69)/12);
const scaleF=i=>{const o=Math.floor(i/7),s=HZ[((i%7)+7)%7];return midif(62+12*o+s);};
function pluck(f,t,d){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='triangle';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=2400;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(mGain);o.start(t);o.stop(t+d+.05);}
function padChord(notes,t,d){notes.forEach(m=>{const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=midif(m);fl.type='lowpass';fl.frequency.value=520;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.06,t+d*.4);g.gain.linearRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(mGain);o.start(t);o.stop(t+d+.05);});}
const CH=[[38,45,50],[43,50,55],[38,45,50],[45,52,57]];
function musicTick(){
  if(!AC||AC.state!=='running'||!S.set.music)return;
  if(nextT<AC.currentTime)nextT=AC.currentTime+.05;
  while(nextT<AC.currentTime+.8){
    if(beat%8===0)padChord(CH[(beat/8)%4],nextT,4.8);
    if(beat%2===0||Math.random()<.3){mi=clamp(mi+[-2,-1,-1,1,1,2][Math.floor(Math.random()*6)],-3,9);if(Math.random()<.8)pluck(scaleF(mi),nextT,1.5);}
    beat++;nextT+=.6;
  }
}
