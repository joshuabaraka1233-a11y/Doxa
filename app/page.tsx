"use client";

import { useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = { id:number; icon:string; title:string; location:string; description:string; people:number; resources:number; pledged:number; status:number };

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

function Figure(){
 return <div className="planet-art" aria-hidden="true"><svg viewBox="0 0 620 620" className="earth-svg">
  <defs><radialGradient id="ocean" cx="36%" cy="28%"><stop offset="0" stopColor="#2de4e8"/><stop offset=".3" stopColor="#118acb"/><stop offset=".7" stopColor="#07549c"/><stop offset="1" stopColor="#031b50"/></radialGradient><linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9ee95d"/><stop offset=".45" stopColor="#21a84c"/><stop offset="1" stopColor="#08723d"/></linearGradient><linearGradient id="land2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d0ee65"/><stop offset=".5" stopColor="#38b94d"/><stop offset="1" stopColor="#087b56"/></linearGradient><filter id="blur12"><feGaussianBlur stdDeviation="12"/></filter><clipPath id="earthClip"><circle cx="310" cy="310" r="245"/></clipPath></defs>
  <circle cx="310" cy="310" r="260" fill="#22dce4" opacity=".13" filter="url(#blur12)"/><circle cx="310" cy="310" r="249" fill="url(#ocean)"/>
  <g clipPath="url(#earthClip)">
   <path className="land land-a" d="M92 183 C126 119 181 104 227 128 C247 139 261 166 247 189 C228 220 193 215 177 240 C157 270 119 251 105 226 C94 208 88 198 92 183Z" fill="url(#land)"/><path className="land land-b" d="M310 89 C354 68 415 85 441 119 C459 143 451 173 425 184 C402 193 391 218 359 222 C328 226 300 204 294 178 C289 147 287 106 310 89Z" fill="url(#land2)"/><path className="land land-c" d="M419 244 C463 222 512 244 533 282 C547 308 527 334 498 337 C472 340 456 365 428 354 C402 343 391 314 397 288 C401 271 405 253 419 244Z" fill="url(#land)"/><path className="land land-d" d="M190 315 C219 286 259 291 279 320 C296 345 287 379 266 397 C247 414 244 449 214 451 C183 453 162 424 166 393 C169 362 171 335 190 315Z" fill="url(#land2)"/><path className="land land-e" d="M324 388 C356 359 401 366 421 394 C440 421 431 454 403 468 C379 480 359 510 329 499 C297 488 290 449 298 425 C303 409 311 399 324 388Z" fill="url(#land)"/>
   <g className="cloud-cloud cloud-1"><path d="M42 260 C95 215 141 231 160 263 C185 247 220 253 229 282 C244 320 195 334 151 321 C105 343 53 322 42 292 C35 279 35 269 42 260Z" fill="#b9fff4" opacity=".78"/></g>
   <g className="cloud-cloud cloud-2"><path d="M285 246 C330 213 366 225 382 252 C410 233 448 246 452 276 C458 310 420 322 384 309 C350 332 305 314 296 287 C287 274 281 259 285 246Z" fill="#c5fff5" opacity=".72"/></g>
   <g className="cloud-cloud cloud-3"><path d="M150 458 C187 425 228 434 242 462 C266 446 302 456 309 484 C315 517 280 529 247 518 C214 538 172 524 162 498 C150 489 146 472 150 458Z" fill="#7ff1e6" opacity=".72"/></g>
   <g className="swirl-lines" fill="none" strokeLinecap="round"><path d="M61 163 C170 72 305 96 348 178 C382 244 324 296 241 283 C154 269 121 333 186 382 C258 436 370 414 444 352" stroke="#76fff0" strokeWidth="13" opacity=".34"/><path d="M71 386 C142 329 218 348 244 404 C267 453 339 478 407 438 C452 411 488 373 520 385" stroke="#44e9e2" strokeWidth="10" opacity=".4"/></g>
  </g><circle cx="310" cy="310" r="253" fill="none" stroke="#38dce8" strokeWidth="2" opacity=".65"/></svg>
  <span className="planet-star s1"/><span className="planet-star s2"/><span className="planet-star s3"/>
 </div>
}

export default function Home(){
 const[problems,setProblems]=useState(starter); const[mode,setMode]=useState<Mode>("solve"); const[selected,setSelected]=useState<Problem|null>(null); const[showCreate,setShowCreate]=useState(false); const[showMenu,setShowMenu]=useState(false); const[query,setQuery]=useState(""); const[notice,setNotice]=useState(""); const[form,setForm]=useState({title:"",location:"",description:""});
 const notify=(m:string)=>{setNotice(m);window.setTimeout(()=>setNotice(""),2400)};
 const filtered=useMemo(()=>{const q=query.toLowerCase().trim();return problems.filter(p=>(mode==="city"?p.location==="Nairobi":mode==="swap"?p.resources>0:true)&&(!q||[p.title,p.location,p.description].join(" ").toLowerCase().includes(q)))},[mode,problems,query]);
 const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
 const changeMode=(next:Mode)=>{setMode(next);setSelected(null);go("explore")};
 const ask=()=>{if(!query.trim())return notify("Type a problem, city or resource to search.");go("explore")};
 const create=()=>{if(!form.title||!form.location||!form.description)return notify("Complete the three fields first.");const p:Problem={id:Date.now(),icon:"✦",title:form.title,location:form.location,description:form.description,people:1,resources:0,pledged:0,status:0};setProblems(c=>[p,...c]);setForm({title:"",location:"",description:""});setShowCreate(false);setSelected(p);notify("Problem published to DOXA.");go("explore")};
 const help=(kind:string)=>{if(!selected)return;const next={...selected,people:selected.people+1,resources:selected.resources+(kind!=="Volunteer"?1:0),status:Math.min(4,selected.status+1)};setProblems(c=>c.map(p=>p.id===selected.id?next:p));setSelected(next);notify(kind+" added.");};
 return <main className="doxa editorial">
  <header className="topbar"><button className="brand" onClick={()=>go("home")}><span className="brand-mark"><i/><i/></span><strong>DOXA</strong></button><nav>{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>changeMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</nav><div className="top-right"><span className="live"><i/> LIVE</span><button className="menu-button" onClick={()=>setShowMenu(true)}>MENU <b>↗</b></button></div></header>

  <section id="home" className="hero"><div className="hero-copy"><div className="eyebrow"><span/> GLOBAL PROBLEM-SOLVING NETWORK</div><h1>MAKE<br/><em>CHANGE</em><br/>REAL.</h1><p>{modeInfo[mode].desc}</p><div className="search-line"><span>↳</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder={mode==="solve"?"Search a problem...":mode==="swap"?"Find something to swap...":"Find a local problem..."}/><button onClick={ask}>→</button></div><button className="post-link" onClick={()=>setShowCreate(true)}>POST A PROBLEM <span>+</span></button></div>
   <div className="art-card"><div className="art-label top"><span>DOXA / {modeInfo[mode].label}</span><span>01 — 06</span></div><div className="red-disc"/><div className="halo"/><Figure/>{cities.map((city,i)=><button key={city.name} className={"city-pin pin-"+i} style={{left:city.x+"%",top:city.y+"%"}} onClick={()=>{const match=problems.find(p=>p.location===city.name);if(match){setSelected(match);go("explore")}else notify(city.label)}}><span/><b>{city.name}</b></button>)}<div className="art-copy"><strong>{modeInfo[mode].label}</strong><span>06 CITIES · {filtered.length.toString().padStart(2,"0")} MATCHES</span></div><div className="art-scroll">SCROLL <b>↓</b></div></div>
  </section>

  <section className="intro-band"><div><span>02</span><h2>ONE PROBLEM.<br/><em>ONE ACTION PATH.</em></h2></div><p>DOXA turns scattered good intentions into a visible chain of people, resources and action. Explore what is happening, choose how you can help, and watch progress move.</p><button onClick={()=>go("how")}>HOW IT WORKS <b>↓</b></button></section>

  <section id="explore" className="workspace"><div className="section-head"><div><span>03 / LIVE BOARD</span><h2>WHAT NEEDS<br/><em>YOU.</em></h2></div><div className="mode-tabs">{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>setMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</div></div>
   <div className="workspace-grid"><div className="problem-list">{filtered.length?filtered.map((p,i)=><button className="problem-card" key={p.id} onClick={()=>setSelected(p)}><span className="card-no">0{i+1}</span><div className="problem-icon">{p.icon}</div><div className="problem-main"><div className="problem-meta"><span>{p.location}</span><span>{p.people} helping</span></div><h3>{p.title}</h3><p>{p.description}</p><div className="mini-progress"><i style={{width:((p.status+1)/5*100)+"%"}}/></div></div><b className="card-arrow">↗</b></button>):<div className="empty-card"><b>NO MATCHES</b><p>Try another city, problem or resource.</p></div>}</div>
    <aside className="action-panel"><div className="panel-top"><span>DOXA / ACTION</span><i>● LIVE</i></div><h3>What can<br/><em>you do?</em></h3><div className="action-option"><b>01</b><span>VOLUNTEER</span><small>Give your time</small></div><div className="action-option"><b>02</b><span>RESOURCE</span><small>Offer something useful</small></div><div className="action-option"><b>03</b><span>CONTRIBUTE</span><small>Fund the solution</small></div><button onClick={()=>setShowCreate(true)} className="panel-button">START A PROBLEM <b>+</b></button></aside>
   </div>
  </section>

  <section id="how" className="how"><div className="section-head"><div><span>04 / THE SYSTEM</span><h2>FROM PROBLEM<br/><em>TO SOLVED.</em></h2></div><p>Every issue gets a simple, trackable action path.</p></div><div className="steps">{[["01","PROBLEM","Something needs changing."],["02","PEOPLE","People gather around it."],["03","RESOURCES","Skills, items and money appear."],["04","ACTION","The solution gets moving."],["05","SOLVED","The result is visible."]].map((s,i)=><div className={"step "+(i===3?"featured":"")} key={s[0]}><span>{s[0]}</span><b>{s[1]}</b><p>{s[2]}</p><i>→</i></div>)}</div></section>

  <section id="impact" className="impact"><div className="impact-copy"><span>05 / WHY DOXA</span><h2>DON'T JUST<br/><em>SCROLL.</em></h2><p>A social layer for real-world action. Problems become places where people can actually participate.</p><button onClick={()=>go("explore")}>EXPLORE LIVE PROBLEMS <b>→</b></button></div><div className="impact-board"><div><b>{problems.length.toString().padStart(2,"0")}</b><span>ACTIVE<br/>PROBLEMS</span></div><div><b>{problems.reduce((n,p)=>n+p.people,0)}</b><span>PEOPLE<br/>HELPING</span></div><div><b>{problems.reduce((n,p)=>n+p.resources,0)}</b><span>RESOURCES<br/>READY</span></div><div><b>KSh {problems.reduce((n,p)=>n+p.pledged,0).toLocaleString()}</b><span>COMMITTED<br/>SO FAR</span></div></div></section>

  <footer><div className="brand"><span className="brand-mark"><i/><i/></span><strong>DOXA</strong></div><span>THE PLATFORM FOR TURNING PROBLEMS INTO ACTION.</span><button onClick={()=>go("home")}>BACK TO TOP ↑</button></footer>

  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><article className="detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="detail-tag">{selected.location} / {mode.toUpperCase()}</div><div className="detail-symbol">{selected.icon}</div><h2>{selected.title}</h2><p>{selected.description}</p><div className="detail-stats"><div><b>{selected.people}</b><span>PEOPLE</span></div><div><b>{selected.resources}</b><span>RESOURCES</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>PLEDGED</span></div></div><div className="progress">{["PROBLEM","PEOPLE","RESOURCES","ACTION","SOLVED"].map((step,i)=><span key={step} className={i<=selected.status?"done":""}><i>{i<selected.status?"✓":i+1}</i>{step}</span>)}</div><div className="help-actions"><button onClick={()=>help("Volunteer")}>VOLUNTEER <b>→</b></button><button onClick={()=>help("Resource")}>OFFER RESOURCE <b>→</b></button><button onClick={()=>help("Funding")}>CONTRIBUTE <b>→</b></button><button onClick={()=>help("Transport")}>PROVIDE TRANSPORT <b>→</b></button></div></article></div>}

  {showCreate&&<div className="overlay" onClick={()=>setShowCreate(false)}><article className="create" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowCreate(false)}>×</button><div className="detail-tag">START SOMETHING</div><h2>PUT A REAL<br/><em>PROBLEM</em> ON THE MAP.</h2><p>Describe what is happening. DOXA will connect it to people, resources and action.</p><input placeholder="Problem title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="City or area" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><textarea placeholder="What is happening, and what would help?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="publish" onClick={create}>PUBLISH TO DOXA <span>→</span></button></article></div>}

  {showMenu&&<div className="menu-overlay" onClick={()=>setShowMenu(false)}><div className="menu-sheet" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowMenu(false)}>×</button><span>DOXA / MENU</span><button onClick={()=>{setShowMenu(false);go("explore")}}>EXPLORE PROBLEMS</button><button onClick={()=>{setShowMenu(false);go("how")}}>HOW DOXA WORKS</button><button onClick={()=>{setShowMenu(false);go("impact")}}>IMPACT</button><button onClick={()=>{setShowMenu(false);setShowCreate(true)}}>POST A PROBLEM</button></div></div>}

  {notice&&<button className="toast" onClick={()=>setNotice("")}>{notice}<span>×</span></button>}
 </main>
}