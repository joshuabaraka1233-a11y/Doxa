"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = { id:number; icon:string; title:string; location:string; description:string; people:number; resources:number; pledged:number; status:number; category?:string; need?:string };

const starter:Problem[]=[
 {id:1,icon:"W",title:"School water shortage",location:"Nairobi",description:"A community school needs a reliable water solution for its students.",people:18,resources:3,pledged:8500,status:3},
 {id:2,icon:"D",title:"40 students need desks",location:"Kisumu",description:"Students are sharing desks. The school needs desks and transport.",people:7,resources:2,pledged:12000,status:2},
 {id:3,icon:"G",title:"Community garden needs tools",location:"Mombasa",description:"A neighborhood garden needs basic tools and volunteers.",people:5,resources:4,pledged:3000,status:1},
 {id:4,icon:"F",title:"Community food drive",location:"Lagos",description:"Local volunteers are organizing weekly food support for families.",people:24,resources:6,pledged:18000,status:3},
];

const cities=[
 {name:"Nairobi",x:54,y:58,label:"Water · 18 helping"},
 {name:"Kisumu",x:49,y:54,label:"Desks · 7 helping"},
 {name:"Mombasa",x:61,y:63,label:"Garden · 5 helping"},
 {name:"Lagos",x:39,y:49,label:"Food · 24 helping"},
 {name:"London",x:44,y:33,label:"Warmth · 31 helping"},
 {name:"Tokyo",x:78,y:42,label:"Reuse · 12 helping"},
];

const modeInfo={
 solve:{label:"SOLVE",desc:"Find a problem, bring a resource, and turn intention into action."},
 swap:{label:"SWAP",desc:"Move unused things, skills and resources to people who can use them."},
 city:{label:"MYCITY",desc:"See what needs changing around you and follow it from report to resolution."},
};

function Figure({progress=0}:{progress?:number}){
 const dots=Array.from({length:150},(_,i)=>{
   const col=i%15,row=Math.floor(i/15),x=18+col*4.6,y=8+row*5.8;
   const nx=(x-50)/42,ny=(y-50)/42,inside=nx*nx+ny*ny<1;
   const land=(nx>-0.05&&nx<0.55&&ny>-0.2&&ny<0.5)||(nx<-0.35&&nx>-0.8&&ny>-0.55&&ny<0.15)||(nx>0.25&&nx<0.75&&ny>-0.65&&ny<-0.2)||(nx<-0.1&&nx<0.35&&ny>0.25&&ny<0.72);
   return {x,y,inside,land};
 });
 const cityOffset=progress*360;
 return <div className="globe-stage" aria-hidden="true">
   <div className="globe-stars"/>
   <div className="globe-halo"/>
   <div className="globe-wrap" style={{transform:`translate(-50%,-50%) rotateY(${cityOffset}deg)`}}>
    <div className="globe-sphere">
      <svg viewBox="0 0 100 100" className="globe-svg">
       <defs><radialGradient id="ocean" cx="32%" cy="28%"><stop offset="0%" stopColor="#48f0df"/><stop offset="38%" stopColor="#0b9a9b"/><stop offset="78%" stopColor="#07545f"/><stop offset="100%" stopColor="#031c27"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="1.4"/></filter></defs>
       <circle cx="50" cy="50" r="46" fill="url(#ocean)" stroke="#70fff033" strokeWidth="1"/>
       <ellipse cx="38" cy="31" rx="24" ry="14" fill="#b9fff51a" filter="url(#glow)"/>
       {dots.filter(d=>d.inside).map((d,i)=><circle key={i} cx={d.x} cy={d.y} r={d.land?.9:.62} className={d.land?"land-dot":"water-dot"}/>)}
       <path d="M18 42 C30 31 39 34 44 41 C48 46 43 51 38 53 C31 56 26 53 21 49Z" className="continent north"/>
       <path d="M43 54 C50 55 54 61 51 70 C49 78 43 84 39 82 C36 77 39 69 38 63Z" className="continent africa"/>
       <path d="M55 27 C65 22 76 27 83 33 C79 39 71 39 65 36 C59 34 55 32 55 27Z" className="continent asia"/>
       <path d="M70 59 C77 58 82 63 81 68 C77 71 72 69 69 65Z" className="continent aus"/>
       <path d="M31 58 C35 61 34 68 31 74 C27 71 26 66 27 61Z" className="continent south"/>
       <g className="globe-clouds"><ellipse cx="30" cy="27" rx="16" ry="4"/><ellipse cx="61" cy="20" rx="13" ry="3"/><ellipse cx="70" cy="46" rx="17" ry="4"/><ellipse cx="38" cy="73" rx="12" ry="3"/></g>
       <g className="globe-arcs"><path d="M31 57 Q50 22 75 42"/><path d="M22 44 Q50 66 67 31"/><path d="M43 68 Q62 60 78 64"/></g>
       <g className="globe-lights"><circle cx="54" cy="58" r="1.3"/><circle cx="64" cy="50" r="1"/><circle cx="73" cy="42" r=".9"/></g>
      </svg>
    </div>
    <div className="orbit-ring"><i/></div>
   </div>
   <div className="globe-caption"><span>LIVE EARTH / {Math.round(progress*100).toString().padStart(2,"0")}%</span><b>{progress<.34?"NAIROBI":progress<.68?"LONDON":"TOKYO"}</b></div>
   <div className="globe-side-note">PROBLEMS <i/> PEOPLE <i/> RESOURCES <i/> ACTION</div>
 </div>
}

export default function Home(){
 const[scrollProgress,setScrollProgress]=useState(0);
 const[problems,setProblems]=useState<Problem[]>(starter); const[mode,setMode]=useState<Mode>("solve"); const[selected,setSelected]=useState<Problem|null>(null); const[category,setCategory]=useState("ALL"); const[activity,setActivity]=useState<string[]>(["A volunteer joined School water shortage","KSh 5,000 was pledged to the food drive","A resource was offered in Kisumu"]); const[hydrated,setHydrated]=useState(false); const[showCreate,setShowCreate]=useState(false); const[showMenu,setShowMenu]=useState(false); const[query,setQuery]=useState(""); const[notice,setNotice]=useState(""); const[form,setForm]=useState({title:"",location:"",description:"",category:"Community",need:""});
 useEffect(()=>{const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);setScrollProgress(Math.min(1,Math.max(0,window.scrollY/max)))};window.addEventListener("scroll",onScroll,{passive:true});onScroll();return()=>window.removeEventListener("scroll",onScroll)},[]);
 useEffect(()=>{try{const p=localStorage.getItem("doxa-problems");const a=localStorage.getItem("doxa-activity");if(p)setProblems(JSON.parse(p));if(a)setActivity(JSON.parse(a));}catch{}setHydrated(true)},[]);
 useEffect(()=>{if(hydrated)localStorage.setItem("doxa-problems",JSON.stringify(problems))},[problems,hydrated]);
 useEffect(()=>{if(hydrated)localStorage.setItem("doxa-activity",JSON.stringify(activity))},[activity,hydrated]);
 const notify=(m:string)=>{setNotice(m);window.setTimeout(()=>setNotice(""),2400)};
 const categories=["ALL",...Array.from(new Set(problems.map(p=>p.category||"Community")))]; const filtered=useMemo(()=>{const q=query.toLowerCase().trim();return problems.filter(p=>(mode==="city"?p.location==="Nairobi":mode==="swap"?p.resources>0:true)&&(category==="ALL"||(p.category||"Community")===category)&&(!q||[p.title,p.location,p.description,p.need,p.category].join(" ").toLowerCase().includes(q)))},[mode,problems,query,category]);
 const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
 const changeMode=(next:Mode)=>{setMode(next);setSelected(null);setCategory("ALL");go("explore")};
 const ask=()=>{if(!query.trim())return notify("Type a problem, city or resource to search.");go("explore")};
 const create=()=>{if(!form.title||!form.location||!form.description)return notify("Complete the title, location and description.");const p:Problem={id:Date.now(),icon:"✦",title:form.title,location:form.location,description:form.description,people:1,resources:0,pledged:0,status:0,category:form.category,need:form.need||"Community support"};setProblems(c=>[p,...c]);setActivity(a=>[p.location+": "+p.title+" was added to DOXA",...a].slice(0,8));setForm({title:"",location:"",description:"",category:"Community",need:""});setShowCreate(false);setSelected(p);notify("Problem published to DOXA.");go("explore")};
 const help=(kind:string)=>{if(!selected)return;const pledge=kind==="Funding"?5000:0;const next={...selected,people:selected.people+1,resources:selected.resources+(kind!=="Volunteer"?1:0),pledged:selected.pledged+pledge,status:Math.min(4,selected.status+1)};setProblems(c=>c.map(p=>p.id===selected.id?next:p));setSelected(next);setActivity(a=>[(kind+" joined "+selected.title+(pledge?" — KSh 5,000 pledged":"")),...a].slice(0,8));notify(pledge?"KSh 5,000 pledged to this problem":kind+" added to this problem.");};
 return <main className="doxa editorial">
  <header className="topbar"><button className="brand" onClick={()=>go("home")}><span className="brand-mark"><i/><i/></span><strong>DOXA</strong></button><nav>{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>changeMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</nav><div className="top-right"><span className="live"><i/> LIVE</span><button className="menu-button" onClick={()=>setShowMenu(true)}>MENU <b>↗</b></button></div></header>

  <section id="home" className="hero-scroll"><div className="hero-stage"><div className="hero"><div className="hero-copy"><div className="eyebrow"><span/> GLOBAL PROBLEM-SOLVING NETWORK</div><h1>MAKE<br/><em>CHANGE</em><br/>REAL.</h1><p>{modeInfo[mode].desc}</p><div className="search-line"><span>↳</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder={mode==="solve"?"Search a problem...":mode==="swap"?"Find something to swap...":"Find a local problem..."}/><button onClick={ask}>→</button></div><button className="post-link" onClick={()=>setShowCreate(true)}>POST A PROBLEM <span>+</span></button></div>
   <div className="art-card"><div className="art-label top"><span>DOXA / {modeInfo[mode].label}</span><span>SCROLL TO EXPLORE</span></div><Figure progress={scrollProgress}/><div className="art-copy"><strong>{modeInfo[mode].label}</strong><span>LIVE WORLD · {filtered.length.toString().padStart(2,"0")} MATCHES</span></div><div className="art-scroll">SCROLL <b>↓</b></div><div className="chapter-card"><span>0{scrollProgress<.34?1:scrollProgress<.68?2:3} / 03</span><strong>{scrollProgress<.34?"A PROBLEM IS POSTED":scrollProgress<.68?"RESOURCES FIND IT":"ACTION BECOMES PROOF"}</strong><p>{scrollProgress<.34?"See an issue that needs people.":scrollProgress<.68?"Skills, things and funding move toward it.":"Progress becomes visible and measurable."}</p></div></div>
  </div><div className="hero-progress"><i style={{width:(scrollProgress*100)+"%"}}/><span>01</span><span>02</span><span>03</span></div></div></section>

  <section className="intro-band"><div><span>02</span><h2>ONE PROBLEM.<br/><em>ONE ACTION PATH.</em></h2></div><p>DOXA turns scattered good intentions into a visible chain of people, resources and action. Explore what is happening, choose how you can help, and watch progress move.</p><button onClick={()=>go("how")}>HOW IT WORKS <b>↓</b></button></section>

  <section id="explore" className="workspace"><div className="section-head"><div><span>03 / LIVE BOARD</span><h2>WHAT NEEDS<br/><em>YOU.</em></h2></div><div className="mode-tabs">{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>setMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</div></div>
   <div className="category-row">{categories.map(cat=><button key={cat} className={category===cat?"active":""} onClick={()=>setCategory(cat)}>{cat}</button>)}</div>
   <div className="workspace-grid"><div className="problem-list">{filtered.length?filtered.map((p,i)=><button className="problem-card" key={p.id} onClick={()=>setSelected(p)}><span className="card-no">0{i+1}</span><div className="problem-icon">{p.icon}</div><div className="problem-main"><div className="problem-meta"><span>{p.location}</span><span>{p.people} helping</span></div><h3>{p.title}</h3><p>{p.description}</p><div className="mini-progress"><i style={{width:((p.status+1)/5*100)+"%"}}/></div></div><b className="card-arrow">↗</b></button>):<div className="empty-card"><b>NO MATCHES</b><p>Try another city, problem or resource.</p></div>}</div>
    <aside className="action-panel"><div className="panel-top"><span>DOXA / ACTION</span><i>● LIVE</i></div><h3>What can<br/><em>you do?</em></h3><button className="action-option action-click" onClick={()=>filtered[0]&&setSelected(filtered[0])}><b>01</b><span>VOLUNTEER</span><small>Give your time</small></button><button className="action-option action-click" onClick={()=>filtered[0]&&setSelected(filtered[0])}><b>02</b><span>RESOURCE</span><small>Offer something useful</small></button><button className="action-option action-click" onClick={()=>filtered[0]&&setSelected(filtered[0])}><b>03</b><span>CONTRIBUTE</span><small>Fund the solution</small></button><button onClick={()=>setShowCreate(true)} className="panel-button">START A PROBLEM <b>+</b></button></aside>
   </div>
  </section>

  <section className="facts" id="facts"><div className="section-head"><div><span>04 / VERIFIED GLOBAL SIGNALS</span><h2>THE PROBLEMS<br/><em>ARE REAL.</em></h2></div><p>Selected figures from UN, World Bank, UNESCO and UNEP sources. DOXA uses evidence to frame problems; local submissions still require verification.</p></div><div className="fact-grid"><article><small>WATER / UN 2026</small><b>2.2B</b><h3>people lacked safely managed drinking water in 2024.</h3><a href="https://unstats.un.org/sdgs/report/2026/Goal-06/" target="_blank" rel="noreferrer">VERIFY SOURCE ↗</a></article><article><small>POVERTY / WORLD BANK</small><b>~700M</b><h3>people were living in extreme poverty under the $2.15/day line in the World Bank's 2024 assessment.</h3><a href="https://www.worldbank.org/en/publication/poverty-prosperity-and-planet" target="_blank" rel="noreferrer">VERIFY SOURCE ↗</a></article><article><small>EDUCATION / UNESCO</small><b>251M</b><h3>children and youth remained out of school globally in the 2024/5 GEM reporting.</h3><a href="https://www.unesco.org/reports/gem-report/en/2024-monitoringsdg4" target="_blank" rel="noreferrer">VERIFY SOURCE ↗</a></article><article><small>WASTE / UNEP</small><b>3.8B t</b><h3>municipal solid waste is projected to be generated annually by 2050.</h3><a href="https://www.unep.org/resources/global-waste-management-outlook-2024" target="_blank" rel="noreferrer">VERIFY SOURCE ↗</a></article></div><div className="fact-note">SOURCE DATA IS PRESENTED WITH THE ORIGINAL DEFINITIONS AND TIME PERIODS — NOT AS LIVE DOXA COUNTS.</div></section>

  <section id="how" className="how"><div className="section-head"><div><span>04 / THE SYSTEM</span><h2>FROM PROBLEM<br/><em>TO SOLVED.</em></h2></div><p>Every issue gets a simple, trackable action path.</p></div><div className="steps">{[["01","PROBLEM","Something needs changing."],["02","PEOPLE","People gather around it."],["03","RESOURCES","Skills, items and money appear."],["04","ACTION","The solution gets moving."],["05","SOLVED","The result is visible."]].map((s,i)=><div className={"step "+(i===3?"featured":"")} key={s[0]}><span>{s[0]}</span><b>{s[1]}</b><p>{s[2]}</p><i>→</i></div>)}</div></section><section className="activity-section"><div className="section-head"><div><span>05 / LIVE ACTIVITY</span><h2>PEOPLE ARE<br/><em>MOVING.</em></h2></div><p>Every action changes the live board. DOXA keeps the chain visible.</p></div><div className="activity-feed">{activity.map((item,i)=><div key={item+i}><span>0{i+1}</span><b>{item}</b><i>NOW</i></div>)}</div></section>

  <section id="impact" className="impact"><div className="impact-copy"><span>06 / WHY DOXA</span><h2>DON'T JUST<br/><em>SCROLL.</em></h2><p>A social layer for real-world action. Problems become places where people can actually participate.</p><button onClick={()=>go("explore")}>EXPLORE LIVE PROBLEMS <b>→</b></button></div><div className="impact-board"><div><b>{problems.length.toString().padStart(2,"0")}</b><span>ACTIVE<br/>PROBLEMS</span></div><div><b>{problems.reduce((n,p)=>n+p.people,0)}</b><span>PEOPLE<br/>HELPING</span></div><div><b>{problems.reduce((n,p)=>n+p.resources,0)}</b><span>RESOURCES<br/>READY</span></div><div><b>KSh {problems.reduce((n,p)=>n+p.pledged,0).toLocaleString()}</b><span>COMMITTED<br/>SO FAR</span></div></div></section>

  <footer><div className="brand"><span className="brand-mark"><i/><i/></span><strong>DOXA</strong></div><span>THE PLATFORM FOR TURNING PROBLEMS INTO ACTION.</span><button onClick={()=>go("home")}>BACK TO TOP ↑</button></footer>

  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><article className="detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="detail-tag">{selected.location} / {mode.toUpperCase()}</div><div className="detail-symbol">{selected.icon}</div><h2>{selected.title}</h2><p>{selected.description}</p><div className="detail-stats"><div><b>{selected.people}</b><span>PEOPLE</span></div><div><b>{selected.resources}</b><span>RESOURCES</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>PLEDGED</span></div></div><div className="progress">{["PROBLEM","PEOPLE","RESOURCES","ACTION","SOLVED"].map((step,i)=><span key={step} className={i<=selected.status?"done":""}><i>{i<selected.status?"✓":i+1}</i>{step}</span>)}</div><div className="help-actions"><button onClick={()=>help("Volunteer")}>VOLUNTEER <b>→</b></button><button onClick={()=>help("Resource")}>OFFER RESOURCE <b>→</b></button><button onClick={()=>help("Funding")}>CONTRIBUTE <b>→</b></button><button onClick={()=>help("Transport")}>PROVIDE TRANSPORT <b>→</b></button></div></article></div>}

  {showCreate&&<div className="overlay" onClick={()=>setShowCreate(false)}><article className="create" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowCreate(false)}>×</button><div className="detail-tag">START SOMETHING</div><h2>PUT A REAL<br/><em>PROBLEM</em> ON THE MAP.</h2><p>Describe what is happening. DOXA will connect it to people, resources and action.</p><input placeholder="Problem title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="City or area" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Community</option><option>Water</option><option>Education</option><option>Environment</option><option>Food</option><option>Transport</option><option>Health</option></select><input placeholder="What is needed? (optional)" value={form.need} onChange={e=>setForm({...form,need:e.target.value})}/><textarea placeholder="What is happening, and what would help?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="publish" onClick={create}>PUBLISH TO DOXA <span>→</span></button></article></div>}

  {showMenu&&<div className="menu-overlay" onClick={()=>setShowMenu(false)}><div className="menu-sheet" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowMenu(false)}>×</button><span>DOXA / MENU</span><button onClick={()=>{setShowMenu(false);go("explore")}}>EXPLORE PROBLEMS</button><button onClick={()=>{setShowMenu(false);go("how")}}>HOW DOXA WORKS</button><button onClick={()=>{setShowMenu(false);go("impact")}}>IMPACT</button><button onClick={()=>{setShowMenu(false);setShowCreate(true)}}>POST A PROBLEM</button></div></div>}

  {notice&&<button className="toast" onClick={()=>setNotice("")}>{notice}<span>×</span></button>}
 </main>
}