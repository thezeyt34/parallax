(function(){
const VIDEO_URL="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/77806b3d-8a1a-4df5-af52-0651710f8a85.mp4";
const img=(id,w,q)=>"https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260906_"+id+".png&w="+w+"&q="+q;
const IDS=[
 ["195408_3baa90af-104c-4651-a954-4c32d032f447","205336_d8018410-76ae-4756-bce5-51737d6c83a2"],
 ["195510_80256fb7-1e2d-4135-be89-85b9c9736604","205412_dea76893-5f89-4ef5-ad3f-6d5889502ed4"],
 ["195543_44e0ac0c-4c7b-4a94-a8b0-935bd48a1503","205443_924891fc-e4fa-452d-a187-95614fdc06eb"],
 ["195629_69f05c67-a2fe-4235-a5ff-233c0bdda517","205904_ad824661-4b68-42c0-b922-22b11ccff041"],
 ["195701_5e5cb558-d608-44b3-81af-6098c19701f9","210026_33e66723-2c92-4fa2-89ba-8da99891d131"]
];
const APPS=[
 {label:"Construction equipment",title:"Armatex CHG",more:"More about Armatex CHG",thumb:img(IDS[0][0],640,80),
  specs:[{k:"Service temperature",v:"−55°C to +200°C"},{k:"Impact resistance",v:"LV 312-3 X < 25"},{k:"Wear resistance",tag:"ISO 6722-1 CLASS 4"}]},
 {label:"Electric & hybrid",title:"Armatex VHG10 Purple",more:"More about Armatex VHG10",thumb:img(IDS[1][0],640,80),
  specs:[{k:"Service temperature",v:"−70°C to +225°C (Peaks at +300°C)"},{k:"Impact resistance",v:"LV 312-3 X < 25"}]},
 {label:"Buses and trucks",title:"Flexline PS",more:"More about Flexline PS",thumb:img(IDS[2][0],640,80),colors:["#111","#e85a1a","#f4f4f4","#7a4aa8"],
  specs:[{k:"Service temperature",v:"−70°C to +150°C"},{k:"Stretch ratio",v:"1:2"},{k:"Wear resistance",tag:"ISO 6722-1 CLASS 4 (4,000 – 14,999 CYCLES)"}]},
 {label:"Rail systems",title:"Flexline RX",more:"More about Flexline RX",thumb:img(IDS[3][0],640,80),
  specs:[{k:"Service temperature",v:"−50°C to +180°C"},{k:"Fire performance",v:"EN 45545-2 HL3"},{k:"Shock rating",v:"IEC 61373 Category 1"}]},
 {label:"Agricultural machines",title:"Armatex AG",more:"More about Armatex AG",thumb:img(IDS[4][0],640,80),
  specs:[{k:"Service temperature",v:"−40°C to +150°C"},{k:"Dirt & moisture",v:"IP6K9K sealed jackets"},{k:"Wear resistance",tag:"ISO 6722-1 CLASS 3"}]}
];

const $=id=>document.getElementById(id);
const video=$("heroVideo"),heroLayer=$("heroLayer"),appsLayer=$("appsLayer"),track=$("track"),
 menu=$("menu"),card=$("card"),more=$("more"),btnFull=$("btnFull"),btnOverview=$("btnOverview"),
 boot=$("boot"),bootBar=$("bootBar"),bootPct=$("bootPct");

appsLayer.insertAdjacentHTML("afterbegin",IDS.map((p,i)=>
 '<div class="scene'+(i?'':' is-on')+'" data-i="'+i+'"><img class="bg" alt="" src="'+img(p[0],1920,85)+'"><img class="cable" alt="" src="'+img(p[1],1920,85)+'"></div>').join(""));
const scenes=[...document.querySelectorAll(".scene")];

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const range=(v,a,b)=>clamp((v-a)/(b-a),0,1);
const MOBILE_BP=900,STEPS=APPS.length-1;
const HERO_VH=4.4,FADE_VH=1,STEP_VH=1;

let heroTarget=0,seekAt=0,dur=6,ready=false,raf=0,index=-1,wheelLock=false;
let vh=innerHeight,lastW=innerWidth,heroLen=0,fadeLen=0,appsLen=0,appsStart=0;
let lastFade=-1,lastOnApps=null;

function layout(force){
 const h=Math.max(1,innerHeight);
 if(!force&&innerWidth===lastW&&Math.abs(h-vh)<120)return;
 vh=h;lastW=innerWidth;
 document.documentElement.style.setProperty("--vh",h+"px");
 heroLen=HERO_VH*h;fadeLen=FADE_VH*h;appsLen=STEP_VH*STEPS*h;appsStart=heroLen+fadeLen;
 track.style.height=(appsStart+appsLen+h)+"px";
}
const heroProgress=()=>clamp((scrollY||0)/heroLen,0,1);

const opts=APPS.map((it,i)=>{
 const b=document.createElement("button");
 b.type="button";b.className="opt"+(i?"":" is-on");
 b.innerHTML=it.label+'<img alt="" src="'+it.thumb+'">';
 b.addEventListener("click",()=>setIndex(i,false));
 menu.appendChild(b);return b;
});

function renderCard(i){
 const it=APPS[i];
 let h="<h2>"+it.title+"</h2>";
 it.specs.forEach(s=>{h+='<div class="spec"><b></b><div><small>'+s.k+'</small>'+(s.tag?'<span class="tag">'+s.tag+'</span>':'<span>'+s.v+'</span>')+'</div></div>'});
 if(it.colors)h+='<div class="spec"><b></b><div><small>Supplied in</small><div class="swatches">'+it.colors.map(c=>'<i style="background:'+c+'"></i>').join("")+'</div></div></div>';
 card.innerHTML=h;more.textContent=it.more;
}

function setIndex(i,fromScroll){
 if(!Number.isFinite(i))return;
 const next=clamp(i,0,STEPS);
 if(next!==index){
  index=next;
  scenes.forEach((s,k)=>s.classList.toggle("is-on",k===index));
  opts.forEach((o,k)=>o.classList.toggle("is-on",k===index));
  renderCard(index);
  if(innerWidth<=MOBILE_BP){
   const a=opts[index].getBoundingClientRect(),m=menu.getBoundingClientRect();
   menu.scrollBy({left:(a.left+a.width/2)-(m.left+m.width/2),behavior:"smooth"});
  }
 }
 if(!fromScroll)scrollTo({top:appsStart+(index/STEPS)*appsLen,behavior:"smooth"});
}

function paintUI(){
 const y=scrollY||pageYOffset;
 const fadeP=range(y,heroLen,appsStart);
 if(fadeP!==lastFade){
  lastFade=fadeP;
  heroLayer.style.opacity=1-fadeP;appsLayer.style.opacity=fadeP;
  heroLayer.style.visibility=fadeP===1?"hidden":"visible";
  appsLayer.style.visibility=fadeP===0?"hidden":"visible";
 }
 setIndex(Math.round(range(y,appsStart,appsStart+appsLen)*STEPS),true);
 const onApps=fadeP>.5;
 if(onApps!==lastOnApps){
  lastOnApps=onApps;
  btnFull.classList.toggle("is-on",!onApps);
  btnOverview.classList.toggle("is-on",onApps);
 }
}

/* preloader + video attach */
let started=false,attached=false;
function setBootProgress(f){
 bootBar.style.transform="scaleX("+f+")";
 bootPct.textContent="LOADING "+Math.round(f*100)+"%";
}
function start(){
 if(started)return;
 started=ready=true;boot.classList.add("done");
 heroTarget=heroProgress();seekAt=heroTarget*dur;
 renderCard(Math.max(index,0));paintUI();
}
function attach(src){
 if(attached)return;attached=true;
 video.addEventListener("loadedmetadata",()=>{
  dur=isFinite(video.duration)&&video.duration>0?video.duration:6;
  video.pause();heroTarget=heroProgress();seekAt=heroTarget*dur;
  try{video.currentTime=seekAt}catch(e){}
 });
 ["loadeddata","canplaythrough","error"].forEach(ev=>video.addEventListener(ev,start));
 video.src=src;video.load();
 setTimeout(start,12000);
}
function preload(){
 const ctrl="AbortController" in window?new AbortController():null;
 const bail=setTimeout(()=>{if(attached)return;if(ctrl)ctrl.abort();setBootProgress(1);attach(VIDEO_URL)},15000);
 fetch(VIDEO_URL,ctrl?{signal:ctrl.signal}:undefined).then(res=>{
  if(!res.ok||!res.body)throw new Error("no body");
  const total=+res.headers.get("content-length")||0,reader=res.body.getReader(),chunks=[];let got=0;
  return (function pump(){
   return reader.read().then(r=>{
    if(r.done)return new Blob(chunks,{type:"video/mp4"});
    chunks.push(r.value);got+=r.value.length;
    setBootProgress(total?got/total:Math.min(got/6.5e6,.95));
    return pump();
   });
  })();
 }).then(blob=>{clearTimeout(bail);setBootProgress(1);attach(URL.createObjectURL(blob))})
 .catch(()=>{clearTimeout(bail);setBootProgress(1);attach(VIDEO_URL)});
}
function unlock(){
 const p=video.play();
 if(p&&p.then)p.then(()=>video.pause()).catch(()=>{});else video.pause();
}
["touchstart","pointerdown","wheel","keydown"].forEach(ev=>addEventListener(ev,unlock,{once:true,passive:true}));

/* scrub loop */
function frame(){
 if(ready&&dur){
  const gap=heroTarget*dur-seekAt;
  if(Math.abs(gap)>.0008){
   seekAt+=gap*.115;
   if(video.readyState>=2&&!video.seeking){try{video.currentTime=seekAt}catch(e){}}
  }
 }
 paintUI();
 raf=requestAnimationFrame(frame);
}

/* events */
addEventListener("scroll",()=>{heroTarget=heroProgress()},{passive:true});
addEventListener("resize",()=>{layout(false);heroTarget=heroProgress()});
addEventListener("orientationchange",()=>{layout(true);heroTarget=heroProgress()});
const inAppsZone=()=>{const y=scrollY||pageYOffset;return y>=appsStart-1&&y<=appsStart+appsLen+1};
function step(down){
 if((down&&index>=STEPS)||(!down&&index<=0))return false;
 setIndex(index+(down?1:-1),false);return true;
}
addEventListener("wheel",e=>{
 if(!inAppsZone()||wheelLock)return;
 const down=e.deltaY>0;
 if((down&&index>=STEPS)||(!down&&index<=0))return;
 e.preventDefault();wheelLock=true;step(down);
 setTimeout(()=>{wheelLock=false},620);
},{passive:false});
let sy=0,sx=0;
addEventListener("touchstart",e=>{sy=e.touches[0].clientY;sx=e.touches[0].clientX},{passive:true});
addEventListener("touchend",e=>{
 const t=e.changedTouches[0],dy=sy-t.clientY,dx=Math.abs(sx-t.clientX);
 if(Math.abs(dy)<40||dx>60||!inAppsZone())return;
 step(dy>0);
},{passive:true});
btnFull.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
btnOverview.addEventListener("click",()=>scrollTo({top:appsStart,behavior:"smooth"}));
document.addEventListener("visibilitychange",()=>{
 if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(frame);
});

/* bootstrap */
video.pause();video.muted=true;
layout(true);renderCard(0);paintUI();preload();
raf=requestAnimationFrame(frame);
})();
