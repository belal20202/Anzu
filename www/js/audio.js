'use strict';
/* صوت مُولَّد برمجياً: موسيقى هادئة على مقام الحجاز + مؤثرات */
let AC=null,mixer,mGain,sGain,mTimer=null,nextT=0,mi=3,beat=0;
function audioInit(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  AC=new C();mixer=AC.createGain();mixer.connect(AC.destination);
  mGain=AC.createGain();sGain=AC.createGain();mGain.connect(mixer);sGain.connect(mixer);
  const dl=AC.createDelay(1);dl.delayTime.value=0.45;const fb=AC.createGain();fb.gain.value=0.38;const wet=AC.createGain();wet.gain.value=0.45;
  mGain.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(mixer);
  applyAudio();nextT=AC.currentTime+0.15;mTimer=setInterval(musicTick,250);
}
function applyAudio(){if(!AC)return;mixer.gain.value=S.set.vol;mGain.gain.value=S.set.music?0.55:0;sGain.gain.value=S.set.sfx?1:0;}
function audioPause(p){if(!AC)return;if(p)AC.suspend();else AC.resume();}
function tone(f,t,d,type,v,dest){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(dest||sGain);o.start(t);o.stop(t+d+0.05);}
function sweep(f1,f2,d,type,v,t0){const t=t0||AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(sGain);o.start(t);o.stop(t+d+0.05);}
function noise(d,v,fc){const t=AC.currentTime,n=Math.floor(AC.sampleRate*d),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=fc;const g=AC.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(sGain);s.start(t);}
function sfx(name){
  if(!AC||!S.set.sfx||AC.state!=='running')return;const t=AC.currentTime;
  switch(name){
    case'click':tone(720,t,.06,'triangle',.28);tone(1080,t+.035,.05,'triangle',.2);break;
    case'flap':sweep(240,520,.12,'sine',.2);noise(.09,.1,1400);break;
    case'coin':tone(988,t,.09,'square',.1);tone(1319,t+.07,.2,'square',.1);break;
    case'point':tone(880,t,.07,'sine',.12);break;
    case'power':[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.07,.14,'triangle',.25));break;
    case'shield':noise(.3,.4,900);sweep(700,160,.3,'triangle',.3);break;
    case'hit':noise(.4,.55,520);sweep(240,55,.45,'sawtooth',.35);break;
    case'fall':sweep(520,70,.7,'sine',.25);break;
    case'buy':[660,880,1175,1568].forEach((f,i)=>tone(f,t+i*.06,.16,'triangle',.25));break;
    case'reward':[523,784,1047].forEach((f,i)=>tone(f,t+i*.1,.25,'sine',.28));break;
    case'error':sweep(220,120,.22,'square',.18);break;
  }
}
const HZ=[0,1,4,5,7,8,10];
const midif=m=>440*Math.pow(2,(m-69)/12);
const scaleF=i=>{const o=Math.floor(i/7),s=HZ[((i%7)+7)%7];return midif(62+12*o+s);};
function pluck(f,t,d){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='triangle';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=2200;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(mGain);o.start(t);o.stop(t+d+.05);}
function padChord(notes,t,d){notes.forEach(m=>{const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=midif(m);fl.type='lowpass';fl.frequency.value=480;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.045,t+d*.4);g.gain.linearRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(mGain);o.start(t);o.stop(t+d+.05);});}
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
