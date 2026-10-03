'use strict';
/* منطق اللعبة والواجهات */
const GRAV=1500,FLAP=-455,BR=12,PHL=250;
const PH=[{t:'day',w:'clear',n:'نهار مشمس'},{t:'day',w:'rain',n:'مطر'},{t:'sunset',w:'clear',n:'غروب'},{t:'night',w:'clear',n:'ليل'},{t:'night',w:'snow',n:'ثلوج ليلية'},{t:'dawn',w:'clear',n:'فجر'},{t:'day',w:'snow',n:'ثلوج'},{t:'day',w:'clear',n:'شمس الظهيرة'}];
const UP={magnet:{n:'المغناطيس',i:'🧲',d:'يجذب العملات القريبة نحوك',base:5,add:1.5},shield:{n:'الدرع',i:'🛡️',d:'يحميك من اصطدام واحد',base:8,add:2},slow:{n:'تبطيء الوقت',i:'⏳',d:'يبطئ سرعة اللعبة ليسهل المرور',base:4,add:1}};
const UPC=[500,1100,2000,3500,6000],UPMAX=5;
const upDur=k=>UP[k].base+UP[k].add*S.up[k];
const slowF=()=>.62-.03*S.up.slow;
const magR=()=>130+25*S.up.magnet;
const MP=[
 {t:'dist_run',g:150,r:150,m:'max',x:'اقطع 150 متراً في جولة واحدة'},
 {t:'dist_run',g:300,r:300,m:'max',x:'اقطع 300 متر في جولة واحدة'},
 {t:'dist_run',g:500,r:550,m:'max',x:'اقطع 500 متر في جولة واحدة'},
 {t:'coins_run',g:15,r:150,m:'max',x:'اجمع 15 عملة في جولة واحدة'},
 {t:'coins_run',g:30,r:300,m:'max',x:'اجمع 30 عملة في جولة واحدة'},
 {t:'coins_total',g:100,r:200,m:'add',x:'اجمع 100 عملة اليوم'},
 {t:'runs',g:5,r:120,m:'add',x:'العب 5 جولات'},
 {t:'runs',g:10,r:250,m:'add',x:'العب 10 جولات'},
 {t:'pipes_total',g:50,r:200,m:'add',x:'اعبر 50 عموداً'},
 {t:'pipes_total',g:120,r:350,m:'add',x:'اعبر 120 عموداً'},
 {t:'pick_magnet',g:3,r:150,m:'add',x:'التقط المغناطيس 3 مرات'},
 {t:'pick_shield',g:3,r:150,m:'add',x:'التقط الدرع 3 مرات'},
 {t:'pick_slow',g:3,r:150,m:'add',x:'التقط تبطيء الوقت 3 مرات'},
 {t:'dist_total',g:1000,r:300,m:'add',x:'اقطع 1000 متر إجمالاً اليوم'},
 {t:'dist_total',g:2500,r:550,m:'add',x:'اقطع 2500 متر إجمالاً اليوم'},
 {t:'night',g:1,r:200,m:'add',x:'حلّق حتى يحلّ الليل'},
 {t:'rain',g:1,r:200,m:'add',x:'اعبر المطر دون أن تسقط'},
 {t:'snow',g:1,r:250,m:'add',x:'اصل إلى الثلوج'},
 {t:'upgrade',g:1,r:300,m:'add',x:'طوّر إحدى القدرات'},
 {t:'runs',g:3,r:100,m:'add',x:'العب 3 جولات'}
];
const DAILY=[150,250,350,500,700,900,1500];
const STORY=[
 'قبل آلاف السنين، على ضفاف دجلة والفرات حيث وُلدت الحضارة، كانت السماء تحرس سرّاً عظيماً.',
 'هناك عاش «أنزو»، الطائر الأسطوري الذي قيل إنه يحمل لوح الأقدار بين جناحيه.',
 'وذات ليلة، سرقت العاصفة اللوح وبعثرت الذهب فوق مدن العراق ونخيله.',
 'حلّق أنزو من جديد، بين أعمدة الحجر، في الشمس والمطر والثلج، لا يهدأ حتى يستعيد ما ضاع.',
 'ساعده على جمع الذهب، وانظر إلى أي مدى تصل...'
];

/* ====== الحالة ====== */
const cv=$('#cv'),ctx=cv.getContext('2d');
let VW=360,scale=1,state='menu',cur='menu',T=0;
let cam=0,shake=0,speed=190,dist=0,runCoins=0,passed=0,nextPup=6,phIdx=-1,deadT=0,overShown=false;
const bird={y:H*.5,vy:0,rot:0,wp:0,boost:0,inv:0};
let pipes=[],coins=[],pups=[],fx=[],seen={};
const P={magnet:0,shield:0,slow:0};
const birdX=()=>clamp(VW*.3,80,150);

function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,S.set.low?1.25:2.5),w=innerWidth||360,h=innerHeight||640;
  cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);cv.style.width=w+'px';cv.style.height=h+'px';
  scale=cv.height/H;VW=cv.width/scale;
}
window.addEventListener('resize',resize);

/* ====== شاشات ====== */
function show(id){cur=id;$$('.screen').forEach(s=>s.classList.add('hidden'));if(id)$('#'+id).classList.remove('hidden');}
function setHud(on){$('#hud').classList.toggle('hidden',!on);}
let toastT=0;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1900);}
function askBox(msg,ok){$('#dlgMsg').textContent=msg;$('#dialog').classList.remove('hidden');$('#dlgOk').onclick=()=>{$('#dialog').classList.add('hidden');ok();};$('#dlgNo').onclick=()=>$('#dialog').classList.add('hidden');}

function goMenu(){
  state='menu';setHud(false);resetRun();phIdx=-1;
  const h=new Date().getHours();envTarget(h>=7&&h<17?'day':h>=17&&h<19?'sunset':h>=5&&h<7?'dawn':'night','clear');
  $('#menuCoins').textContent='🪙 '+fmt(S.coins);$('#menuBest').textContent='🏆 أفضل مسافة: '+fmt(S.best)+' م';refreshDots();show('menu');
}
function goReady(){resetRun();state='ready';show(null);setHud(true);$('#hudHint').classList.remove('hidden');$('#hudDist').textContent='0 م';$('#hudCoins').textContent='🪙 0';envTarget('day','clear');phIdx=-1;updatePowersHud();}
function startPlay(){state='play';$('#hudHint').classList.add('hidden');flap();}
function resetRun(){pipes=[];coins=[];pups=[];fx=[];seen={};dist=0;runCoins=0;passed=0;speed=190;nextPup=rint(5,8);deadT=0;overShown=false;P.magnet=P.shield=P.slow=0;
  Object.assign(bird,{y:H*.42,vy:0,rot:0,boost:0,inv:0});shake=0;}

/* ====== مهام ====== */
function ensureMissions(){
  const t=todayStr();if(S.mis.date===t&&S.mis.list.length===10)return false;
  const rng=mulberry(hashStr(t)),idx=MP.map((_,i)=>i);
  for(let i=idx.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  S.mis={date:t,list:idx.slice(0,10),prog:{},claimed:{}};save();return true;
}
function mp(type,val,mode){
  let changed=false;
  for(const i of S.mis.list){const m=MP[i];if(m.t!==type)continue;const old=S.mis.prog[i]||0;
    const nv=Math.min(m.g,mode==='max'?Math.max(old,val):old+val);S.mis.prog[i]=nv;
    if(nv>=m.g&&old<m.g){toast('✅ أنجزت مهمة: '+m.x);changed=true;}}
  return changed;
}
const claimable=()=>S.mis.list.filter(i=>(S.mis.prog[i]||0)>=MP[i].g&&!S.mis.claimed[i]).length;
function dailySlot(){const t=todayStr();if(!S.daily.start||dayNum(t)-dayNum(S.daily.start)>=7||dayNum(t)<dayNum(S.daily.start)){S.daily.start=t;S.daily.claimed=[0,0,0,0,0,0,0];save();}return dayNum(t)-dayNum(S.daily.start);}
const dailyReady=()=>!S.daily.claimed[dailySlot()];
function refreshDots(){$('#dotMis').classList.toggle('hidden',claimable()===0);$('#dotDaily').classList.toggle('hidden',!dailyReady());}

function renderMissions(){
  ensureMissions();
  $('#misList').innerHTML=S.mis.list.map((i,n)=>{const m=MP[i],p=S.mis.prog[i]||0,done=p>=m.g,cl=S.mis.claimed[i];
    return '<div class="row-card"><div class="grow"><div class="rt">'+m.x+'</div><div class="bar"><i style="width:'+(p/m.g*100)+'%"></i></div><small>'+fmt(p)+' / '+fmt(m.g)+'</small></div>'+
      '<button class="btn sm '+(cl?'ghost':'')+'" data-mi="'+i+'" '+(!done||cl?'disabled':'')+'>'+(cl?'تم ✓':done?'استلم 🪙'+m.r:'🪙 '+m.r)+'</button></div>';}).join('');
}
function renderDaily(){
  const slot=dailySlot();
  $('#dailyGrid').innerHTML=DAILY.map((r,i)=>{const c=S.daily.claimed[i],today=i===slot,miss=i<slot&&!c;
    return '<div class="dtile '+(c?'got':'')+(today?' today':'')+(miss?' miss':'')+(i>slot?' lock':'')+'"><b>اليوم '+(i+1)+'</b><span>'+(i===6?'🎁':'🪙')+'</span><em>'+fmt(r)+'</em><small>'+(c?'✓ تم':today?'اليوم':miss?'فات':'')+'</small></div>';}).join('');
  const b=$('#dailyClaim');b.disabled=!!S.daily.claimed[slot];b.textContent=S.daily.claimed[slot]?'عُد غداً':'استلم مكافأة اليوم';
}

/* ====== المتجر ====== */
let shopTab='skins';
function renderShop(){
  $('#shopCoins').textContent='🪙 '+fmt(S.coins);
  $$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.tab===shopTab));
  const L=$('#shopList');
  if(shopTab==='skins'){
    L.className='grid-cards';
    L.innerHTML=SKINS.map((s,i)=>{const own=S.owned.includes(i),eq=S.skin===i;
      return '<div class="card '+(eq?'eq':'')+'"><canvas class="sk" width="200" height="170" data-i="'+i+'"></canvas><div class="cn">'+s.n+'</div>'+
        (own?'<button class="btn sm '+(eq?'ghost':'')+'" data-eq="'+i+'" '+(eq?'disabled':'')+'>'+(eq?'مُختار':'اختيار')+'</button>':'<button class="btn sm buy" data-buy="'+i+'">🪙 '+fmt(s.p)+'</button>')+'</div>';}).join('');
    $$('#shopList canvas.sk').forEach(c=>{const x=c.getContext('2d');x.scale(2,2);drawBird(x,52,52,-.12,SKINS[+c.dataset.i],0,.25,1.55);});
  }else{
    L.className='list-cards';
    L.innerHTML=Object.keys(UP).map(k=>{const lv=S.up[k],u=UP[k],max=lv>=UPMAX;
      return '<div class="row-card up"><div class="ico">'+u.i+'</div><div class="grow"><div class="rt">'+u.n+'</div><small>'+u.d+'</small><div class="pips">'+Array.from({length:UPMAX},(_,j)=>'<i class="'+(j<lv?'on':'')+'"></i>').join('')+'</div>'+
        '<small>المدة: '+upDur(k).toFixed(1)+' ثانية'+(max?'':' ← '+(upDur(k)+u.add).toFixed(1))+'</small></div>'+
        '<button class="btn sm" data-up="'+k+'" '+(max?'disabled':'')+'>'+(max?'الحد الأقصى':'🪙 '+fmt(UPC[lv]))+'</button></div>';}).join('');
  }
}
$('#shopList').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.eq!==undefined){S.skin=+b.dataset.eq;save();renderShop();}
  else if(b.dataset.buy!==undefined){const i=+b.dataset.buy,p=SKINS[i].p;
    if(S.coins<p){sfx('error');toast('لا تملك عملات كافية');return;}
    S.coins-=p;S.owned.push(i);S.skin=i;save();sfx('buy');toast('تم شراء: '+SKINS[i].n);renderShop();}
  else if(b.dataset.up){const k=b.dataset.up,lv=S.up[k];if(lv>=UPMAX)return;
    if(S.coins<UPC[lv]){sfx('error');toast('لا تملك عملات كافية');return;}
    S.coins-=UPC[lv];S.up[k]++;mp('upgrade',1,'add');save();sfx('buy');toast('تم تطوير '+UP[k].n);renderShop();}
});
$$('.tab').forEach(t=>t.onclick=()=>{shopTab=t.dataset.tab;renderShop();});

/* ====== إعدادات ====== */
const SETROWS=[['sfx','المؤثرات الصوتية'],['music','الموسيقى'],['vib','الاهتزاز'],['weather','مؤثرات الطقس (مطر وثلج)'],['low','وضع الأداء (رسومات أخف)']];
function renderSettings(){
  $('#setList').innerHTML=SETROWS.map(r=>'<div class="row-card"><div class="grow rt">'+r[1]+'</div><button class="sw '+(S.set[r[0]]?'on':'')+'" data-k="'+r[0]+'" aria-label="'+r[1]+'"><i></i></button></div>').join('')+
   '<div class="row-card"><div class="grow rt">مستوى الصوت</div><input type="range" id="volR" min="0" max="100" value="'+Math.round(S.set.vol*100)+'"></div>'+
   '<div class="row-card"><div class="grow rt">سياسة الخصوصية</div><button class="btn sm" id="btnPriv">عرض</button></div>'+
   '<div class="row-card"><div class="grow rt">إعادة ضبط التقدم</div><button class="btn sm danger" id="btnReset">مسح</button></div>'+
   '<p class="ver">Anzu v1.0 — صنع في العراق 🇮🇶</p>';
}
$('#setList').addEventListener('click',e=>{
  const sw=e.target.closest('.sw');
  if(sw){const k=sw.dataset.k;S.set[k]=!S.set[k];save();applyAudio();if(k==='low')resize();renderSettings();if(k==='sfx'&&S.set.sfx)sfx('click');return;}
  if(e.target.id==='btnPriv'){$('#privFrame').src='privacy.html';$('#privacy').classList.remove('hidden');}
  if(e.target.id==='btnReset')askBox('سيتم مسح العملات والأزياء والتطويرات والتقدم نهائياً. هل أنت متأكد؟',()=>{S=defSave();save();applyAudio();resize();ensureMissions();toast('تمت إعادة الضبط');renderSettings();});
});
$('#setList').addEventListener('input',e=>{if(e.target.id==='volR'){S.set.vol=e.target.value/100;applyAudio();save();}});
$('#privClose').onclick=()=>$('#privacy').classList.add('hidden');

/* ====== قصة ====== */
let sIdx=0;
function showStory(){sIdx=0;show('story');drawStory();}
function drawStory(){
  $('#storyText').style.opacity=0;setTimeout(()=>{$('#storyText').textContent=STORY[sIdx];$('#storyText').style.opacity=1;},180);
  $('#storyDots').innerHTML=STORY.map((_,i)=>'<i class="'+(i===sIdx?'on':'')+'"></i>').join('');
  $('#storyNext').textContent=sIdx===STORY.length-1?'ابدأ الرحلة':'التالي';
}
function endStory(){S.story=true;save();afterBoot();}
$('#storyNext').onclick=()=>{if(sIdx<STORY.length-1){sIdx++;drawStory();}else endStory();};
$('#storySkip').onclick=endStory;

/* ====== أزرار ====== */
$('#btnPlay').onclick=goReady;
$('#btnShop').onclick=()=>{renderShop();show('shop');};
$('#btnMissions').onclick=()=>{renderMissions();show('missions');};
$('#btnDaily').onclick=()=>{renderDaily();show('daily');};
$('#btnSettings').onclick=()=>{renderSettings();show('settings');};
$$('[data-back]').forEach(b=>b.onclick=goMenu);
$('#misList').addEventListener('click',e=>{const b=e.target.closest('button[data-mi]');if(!b)return;const i=+b.dataset.mi;if(S.mis.claimed[i])return;
  S.mis.claimed[i]=1;S.coins+=MP[i].r;save();sfx('reward');vibrate(30);toast('+'+MP[i].r+' عملة');renderMissions();refreshDots();});
$('#dailyClaim').onclick=()=>{const s=dailySlot();if(S.daily.claimed[s])return;S.daily.claimed[s]=1;S.coins+=DAILY[s];save();sfx('reward');vibrate(40);toast('+'+DAILY[s]+' عملة');renderDaily();refreshDots();};
$('#btnReplay').onclick=goReady;
$('#btnHome').onclick=goMenu;
$('#btnPause').onclick=pauseGame;
$('#btnResume').onclick=()=>{show(null);state='play';};
$('#btnQuit').onclick=goMenu;
document.addEventListener('click',e=>{if(e.target.closest('button')){audioInit();sfx('click');}});
function pauseGame(){if(state!=='play')return;state='paused';show('pause');}

/* ====== لعب ====== */
function flap(){if(state!=='play')return;bird.vy=FLAP;bird.boost=1;sfx('flap');}
function tap(e){if(e&&e.preventDefault)e.preventDefault();audioInit();if(state==='ready')startPlay();else if(state==='play')flap();}
cv.addEventListener('pointerdown',tap);
addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();tap();}else if(e.code==='Escape')onBack();});
document.addEventListener('visibilitychange',()=>{audioPause(document.hidden);if(document.hidden)pauseGame();else{if(ensureMissions())toast('🔔 تجددت المهام اليومية');refreshDots();}});

const gapSize=()=>Math.max(150,205-dist/40*.06);
function spawnPipe(){
  const last=pipes[pipes.length-1],g=gapSize(),sp=speed*1.42+62;
  const x=last?last.x+sp:VW+240;
  const gy=last?clamp(last.gapY+rnd(-130,130),g/2+70,GY-g/2-55):H*.42;
  const p={x,gapY:gy,gap:g,w:62,passed:false};pipes.push(p);
  if(last){
    const f=t=>({x:lerp(last.x,x,t)+31,y:lerp(last.gapY,gy,t)});
    if(--nextPup<=0){const q=f(.5);pups.push({x:q.x,y:q.y,type:['magnet','shield','slow'][rint(0,2)],ph:rnd(0,6)});nextPup=rint(5,9);}
    else if(Math.random()<.78)[.34,.5,.66].forEach((t,i)=>{const q=f(t);coins.push({x:q.x,y:q.y-(i===1?10:0),ph:rnd(0,6)});});
    if(Math.random()<.3)coins.push({x:x+31,y:gy,ph:rnd(0,6)});
  }
}
function rectCirc(rx,ry,rw,rh,cx,cy,r){const nx=clamp(cx,rx,rx+rw),ny=clamp(cy,ry,ry+rh),dx=cx-nx,dy=cy-ny;return dx*dx+dy*dy<r*r;}
function hit(kind){
  if(bird.inv>0)return;
  if(P.shield>0){P.shield=0;bird.inv=1.3;sfx('shield');vibrate(25);shake=.25;bird.vy=kind==='ground'?-520:-260;if(kind==='ground')bird.y=GY-BR-3;burst(birdX(),bird.y,10,'#7fd8ff');updatePowersHud();return;}
  die();
}
function die(){state='dead';sfx('hit');setTimeout(()=>sfx('fall'),250);vibrate(80);shake=.5;bird.vy=-230;bird.boost=0;burst(birdX(),bird.y,16,'#c9a06a');
  for(const k in P)P[k]=0;updatePowersHud();}
function burst(x,y,n,c){for(let i=0;i<n;i++)fx.push({x,y,vx:rnd(-140,140),vy:rnd(-200,60),life:rnd(.4,.9),c,r:rnd(1.5,3.2)});}
function announce(t){const e=$('#hudPhase');e.textContent=t;e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash');}
let hudCache={};
function setTxt(id,v){if(hudCache[id]!==v){hudCache[id]=v;$('#'+id).textContent=v;}}
function updatePowersHud(){
  const el=$('#hudPowers');let h='';
  for(const k in P)if(P[k]>0){const mx=k==='shield'?upDur('shield'):upDur(k);h+='<div class="pchip"><span>'+UP[k].i+'</span><div class="pbar"><i style="width:'+clamp(P[k]/mx*100,0,100)+'%"></i></div></div>';}
  if(h!==hudCache.pw){hudCache.pw=h;el.innerHTML=h;}
}
function updatePlay(dt){
  const ts=P.slow>0?slowF():1,d=dt*ts,bx=birdX();
  for(const k in P)if(P[k]>0)P[k]=Math.max(0,P[k]-dt);
  if(bird.inv>0)bird.inv-=dt;
  const m=dist/40;speed=185+Math.min(115,m*.28);dist+=speed*d;cam+=speed*d;
  bird.vy=Math.min(bird.vy+GRAV*d,720);bird.y+=bird.vy*d;
  if(bird.y<14){bird.y=14;bird.vy=Math.max(bird.vy,0);}
  bird.rot=lerp(bird.rot,clamp(bird.vy*.0017,-.5,1.1),Math.min(1,dt*12));
  bird.boost=Math.max(0,bird.boost-dt*2.6);bird.wp+=dt*(9+bird.boost*22);
  while(!pipes.length||pipes[pipes.length-1].x<VW+120)spawnPipe();
  for(const p of pipes){p.x-=speed*d;
    if(!p.passed&&p.x+p.w<bx-BR){p.passed=true;passed++;mp('pipes_total',1,'add');sfx('point');}}
  for(const o of coins)o.x-=speed*d;for(const o of pups)o.x-=speed*d;
  pipes=pipes.filter(p=>p.x>-90);coins=coins.filter(o=>o.x>-30&&!o.t);pups=pups.filter(o=>o.x>-30&&!o.t);
  if(P.magnet>0){const R=magR();for(const o of coins){const dx=bx-o.x,dy=bird.y-o.y,ds=Math.hypot(dx,dy);if(ds<R&&ds>1){const v=460*d;o.x+=dx/ds*v;o.y+=dy/ds*v;}}}
  for(const o of coins)if(Math.hypot(o.x-bx,o.y-bird.y)<BR+12){o.t=1;runCoins++;sfx('coin');burst(o.x,o.y,5,'#ffd54a');mp('coins_total',1,'add');mp('coins_run',runCoins,'max');}
  for(const o of pups)if(Math.hypot(o.x-bx,o.y-bird.y)<BR+16){o.t=1;P[o.type]=upDur(o.type);sfx('power');vibrate(20);burst(o.x,o.y,10,PUPC[o.type][0]);mp('pick_'+o.type,1,'add');toast(UP[o.type].i+' '+UP[o.type].n);}
  if(bird.inv<=0)for(const p of pipes){const top=p.gapY-p.gap/2,bot=p.gapY+p.gap/2;
    if(rectCirc(p.x,-40,p.w,top+40,bx,bird.y,BR)||rectCirc(p.x-6,top-26,p.w+12,26,bx,bird.y,BR)||rectCirc(p.x,bot,p.w,GY-bot,bx,bird.y,BR)||rectCirc(p.x-6,bot,p.w+12,26,bx,bird.y,BR)){hit('pipe');break;}}
  if(state==='play'&&bird.y+BR>GY)hit('ground');
  const ph=Math.floor(m/PHL)%PH.length;
  if(ph!==phIdx){phIdx=ph;const f=PH[ph];envTarget(f.t,f.w);announce(f.n);
    if(f.t==='night'&&!seen.n){seen.n=1;mp('night',1,'add');}if(f.w==='rain'&&!seen.r){seen.r=1;mp('rain',1,'add');}if(f.w==='snow'&&!seen.s){seen.s=1;mp('snow',1,'add');}}
  setTxt('hudDist',Math.floor(m)+' م');setTxt('hudCoins','🪙 '+runCoins);updatePowersHud();
}
function updateDead(dt){
  deadT+=dt;bird.vy=Math.min(bird.vy+GRAV*dt,800);bird.y+=bird.vy*dt;bird.rot=lerp(bird.rot,1.45,Math.min(1,dt*4));bird.wp+=dt*2;
  if(bird.y>GY-8){bird.y=GY-8;bird.vy=0;}
  if(deadT>.95&&!overShown){overShown=true;endRun();}
}
function endRun(){
  const m=Math.floor(dist/40),nb=m>S.best;if(nb)S.best=m;
  S.coins+=runCoins;S.stats.runs++;S.stats.meters+=m;
  mp('runs',1,'add');mp('dist_run',m,'max');mp('coins_run',runCoins,'max');mp('dist_total',m,'add');save();
  $('#ovDist').textContent=fmt(m)+' م';$('#ovBest').textContent=nb?'🏆 رقم قياسي جديد!':'أفضل مسافة: '+fmt(S.best)+' م';
  $('#ovCoins').textContent='🪙 +'+fmt(runCoins);$('#ovTotal').textContent='رصيدك: '+fmt(S.coins);
  setHud(false);refreshDots();if(nb)sfx('reward');show('over');
}

/* ====== الحلقة الرئيسية ====== */
let lastT=0;
function frame(ts){
  const dt=Math.min(.05,(ts-lastT)/1000||.016);lastT=ts;T+=dt;
  if(state==='play')updatePlay(dt);
  else if(state==='dead'){updateDead(dt);}
  else if(state==='menu')cam+=26*dt;
  envUpdate(dt);partsUpdate(dt,VW,state==='play'?speed:40);
  for(const f of fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=420*dt;f.life-=dt;}fx=fx.filter(f=>f.life>0);
  if(shake>0)shake=Math.max(0,shake-dt);
  render();
  requestAnimationFrame(frame);
}
function render(){
  const c=ctx;c.setTransform(scale,0,0,scale,0,0);
  if(shake>0)c.translate(rnd(-1,1)*shake*14,rnd(-1,1)*shake*14);
  drawBackdrop(c,VW,cam,T);
  for(const p of pipes)drawPipe(c,p);
  drawGround(c,VW,cam);
  for(const o of coins)drawCoin(c,o,T);
  for(const o of pups)drawPickup(c,o,T);
  const sk=SKINS[S.skin]||SKINS[0],bx=birdX();
  if(state==='menu'||cur==='shop'){drawBird(c,VW/2,H*.5+Math.sin(T*2)*9,Math.sin(T*1.5)*.08,sk,T*7,.4,2.2);}
  else{
    let by=bird.y,rot=bird.rot,wp=bird.wp,amp=.3+bird.boost*.75;
    if(state==='ready'){by=H*.42+Math.sin(T*3)*7;rot=0;wp=T*8;amp=.45;}
    if(state==='dead'||state==='over')amp=.12;
    if(!(bird.inv>0&&state==='play'&&Math.floor(T*14)%2))drawBird(c,bx,by,rot,sk,wp,amp,1);
    if(P.shield>0&&state==='play'){const bl=P.shield<2&&Math.floor(T*8)%2;if(!bl){c.strokeStyle='rgba(120,220,255,'+(.65+.25*Math.sin(T*6))+')';c.lineWidth=3;c.fillStyle='rgba(120,220,255,.14)';c.beginPath();c.arc(bx,by,27,0,6.3);c.fill();c.stroke();}}
    if(P.magnet>0&&state==='play'){c.strokeStyle='rgba(255,90,90,.28)';c.lineWidth=2;c.setLineDash([6,8]);c.beginPath();c.arc(bx,by,magR()*(.9+.1*Math.sin(T*5)),0,6.3);c.stroke();c.setLineDash([]);}
  }
  for(const f of fx){c.globalAlpha=clamp(f.life*2,0,1);c.fillStyle=f.c;c.beginPath();c.arc(f.x,f.y,f.r,0,6.3);c.fill();}c.globalAlpha=1;
  if(S.set.weather)partsDraw(c,VW,S.set.low);
  if(P.slow>0&&state==='play'){c.fillStyle='rgba(120,90,255,.1)';c.fillRect(0,0,VW,H);}
  const dk=1-ENV.light;if(dk>.05){c.fillStyle='rgba(4,8,30,'+dk*.28+')';c.fillRect(0,0,VW,H);}
}

/* ====== زر الرجوع في أندرويد ====== */
function onBack(){
  if(!$('#dialog').classList.contains('hidden')){$('#dialog').classList.add('hidden');return;}
  if(!$('#privacy').classList.contains('hidden')){$('#privacy').classList.add('hidden');return;}
  if(state==='play'){pauseGame();return;}
  if(state==='paused'){$('#btnResume').click();return;}
  if(cur==='story')return;
  if(cur!=='menu'||state!=='menu'){goMenu();return;}
  try{const A=window.Capacitor.Plugins.App;A.exitApp();}catch(e){}
}
try{const A=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App;if(A&&A.addListener)A.addListener('backButton',onBack);}catch(e){}

/* ====== الإقلاع ====== */
function afterBoot(){
  ensureMissions();goMenu();
  if(dailyReady()){renderDaily();show('daily');}
}
setInterval(()=>{if(ensureMissions()){toast('🔔 تجددت المهام اليومية');refreshDots();}},30000);
resize();envUpdate(1,true);
if(!S.story)showStory();else afterBoot();
requestAnimationFrame(frame);
