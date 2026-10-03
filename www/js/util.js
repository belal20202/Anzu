'use strict';
/* أدوات عامة + الحفظ المحلي */
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const hashStr=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
const fmt=n=>Math.floor(n).toLocaleString('en-US');
const pad2=n=>String(n).padStart(2,'0');
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());};
const dayNum=s=>{const p=s.split('-');return Math.round(Date.UTC(+p[0],+p[1]-1,+p[2])/864e5);};

const SAVE_KEY='anzu_save_v1';
const defSave=()=>({coins:0,best:0,skin:0,owned:[0],up:{magnet:0,shield:0,slow:0},
  set:{sfx:true,music:true,vib:true,weather:true,low:false,vol:0.8},
  story:false,daily:{start:'',claimed:[0,0,0,0,0,0,0]},
  mis:{date:'',list:[],prog:{},claimed:{}},stats:{runs:0,meters:0}});
function mergeInto(d,o){for(const k in o){if(o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k])&&d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))mergeInto(d[k],o[k]);else d[k]=o[k];}return d;}
function loadSave(){try{const o=JSON.parse(localStorage.getItem(SAVE_KEY));return o?mergeInto(defSave(),o):defSave();}catch(e){return defSave();}}
let S=loadSave();
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function vibrate(ms){if(S.set.vib&&navigator.vibrate){try{navigator.vibrate(ms);}catch(e){}}}
