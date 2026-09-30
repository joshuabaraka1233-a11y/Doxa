"use client";

import { useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = { id:number; icon:string; title:string; location:string; description:string; people:number; resources:number; pledged:number; status:number };

const starter:Problem[]=[
 {id:1,icon:"W",title:"School water shortage",location:"Nairobi",description:"A community school needs a reliable water solution for its students.",people:18,resources:3,pledged:8500,status:3},
 {id:2,icon:"D",title:"40 students need desks",location:"Kisumu",description:"Students are sharing desks. The school needs desks and transport.",people:7,resources:2,pledged:12000,status:2},
 {id:3,icon:"G",title:"Community garden needs tools",location:"Mombasa",description:"A neighborhood garden needs basic tools and volunteers.",people:5,resources:4,pledged:3000,status:1},
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
 solve:{label:"SOLVE",desc:"A global network for people who don't just see problems — they help move them forward."},
 swap:{label:"SWAP",desc:"Exchange things, skills and resources with people who can put them to work."},
 city:{label:"MYCITY",desc:"Turn local problems into visible, trackable action — from report to resolution."},
};

function Figure(){
 return <svg className="figure-art" viewBox="0 0 520 620" aria-hidden="true">
   <defs>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d4aaa1"/><stop offset=".38" stopColor="#8c5e59"/><stop offset=".72" stopColor="#4a2829"/><stop offset="1" stopColor="#160f11"/></linearGradient>
    <linearGradient id="light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3d0c7" stopOpacity=".75"/><stop offset="1" stopColor="#6b3b39" stopOpacity="0"/></linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
   </defs>
   <ellipse cx="270" cy="585" rx="180" ry="25" fill="#000" opacity=".45" filter="url(#soft)"/>
   <path d="M190 600 C185 545 184 500 199 454 C211 419 231 394 254 374 L315 374 C340 397 361 425 373 462 C389 511 385 558 382 600Z" fill="url(#stone)"/>
   <path d="M207 449 C164 432 132 414 111 383 C96 361 91 335 103 319 C111 308 125 308 136 320 L194 378 L231 403Z" fill="url(#stone)"/>
   <path d="M329 449 C373 431 405 412 426 383 C441 361 445 335 434 319 C426 308 412 308 401 320 L343 378 L306 403Z" fill="url(#stone)"/>
   <path d="M222 397 C235 373 244 350 244 321 L244 278 L315 278 L315 321 C315 350 325 373 339 397 C320 416 241 416 222 397Z" fill="url(#stone)"/>
   <path d="M244 285 C222 265 211 233 215 191 C218 151 239 119 275 116 C311 113 334 143 338 183 C342 229 330 265 307 286 C291 298 260 299 244 285Z" fill="url(#stone)"/>
   <path d="M228 183 C236 139 262 119 291 123 C317 126 331 148 337 177 C321 161 306 153 286 153 C264 153 246 163 228 183Z" fill="#2b191a" opacity=".8"/>
   <path d="M264 188 C273 181 282 181 290 188 L286 193 L270 193Z" fill="#1a1011"/>
   <path d="M248 220 C264 230 286 232 304 220 C297 244 257 245 248 220Z" fill="#381e20"/>
   <path d="M245 320 C269 337 292 338 316 320 L314 363 C291 376 268 376 246 363Z" fill="#5a3433"/>
   <path d="M225 405 C246 421 299 424 332 405 L353 482 C320 462 242 462 207 482Z" fill="#c28f88" opacity=".3"/>
   <path d="M211 454 C240 474 307 479 351 454" fill="none" stroke="url(#light)" strokeWidth="18" opacity=".55"/>
 </svg>
}

export default function Home(){
 const[problems,setProblems]=useState(starter);
 const[mode,setMode]=useState<Mode>("solve");
 const[selected,setSelected]=useState<Problem|null>(null);
 const[showCreate,setShowCreate]=useState(false);
 const[query,setQuery]=useState("");
 const[notice,setNotice]=useState("");
 const[form,setForm]=useState({title:"",location:"",description:""});

 const notify=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(""),2400)};
 const filtered=useMemo(()=>mode==="city"?problems.filter(p=>p.location==="Nairobi"):mode==="swap"?problems.filter(p=>p.resources>0):problems,[mode,problems]);
 const changeMode=(next:Mode)=>{setMode(next);setSelected(null)};
 const ask=()=>{if(!query.trim())return notify("Tell DOXA what you want to change.");notify("DOXA is building an action path for you.");setMode("solve")};
 const create=()=>{
  if(!form.title||!form.location||!form.description)return notify("Complete the three fields first.");
  const p:Problem={id:Date.now(),icon:"✦",title:form.title,location:form.location,description:form.description,people:1,resources:0,pledged:0,status:0};
  setProblems(c=>[p,...c]);setForm({title:"",location:"",description:""});setShowCreate(false);setSelected(p);notify("Problem published to DOXA.");
 };
 const help=(kind:string)=>{
  if(!selected)return;
  const next={...selected,people:selected.people+1,resources:selected.resources+(kind!=="Volunteer"?1:0),status:Math.min(4,selected.status+1)};
  setProblems(c=>c.map(p=>p.id===selected.id?next:p));setSelected(next);notify(kind+" added to this problem.");
 };

 return <main className="doxa editorial">
  <header className="topbar">
   <button className="brand" onClick={()=>changeMode("solve")}><span className="brand-mark"><i/><i/></span><strong>DOXA</strong></button>
   <nav>{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>changeMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</nav>
   <div className="top-right"><span className="live"><i/> LIVE</span><button className="menu-button" onClick={()=>notify("DOXA menu coming next.")}>MENU <b>↗</b></button></div>
  </header>

  <section className="hero">
   <div className="hero-copy">
    <div className="eyebrow"><span/> GLOBAL PROBLEM-SOLVING NETWORK</div>
    <h1>MAKE<br/><em>CHANGE</em><br/>REAL.</h1>
    <p>{modeInfo[mode].desc}</p>
    <div className="search-line"><span>↳</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder={mode==="solve"?"What should we change?":mode==="swap"?"What can you give or find?":"What needs changing near you?"}/><button onClick={ask}>→</button></div>
    <button className="post-link" onClick={()=>setShowCreate(true)}>POST A PROBLEM <span>+</span></button>
   </div>

   <div className="art-card">
    <div className="art-label top"><span>DOXA / {modeInfo[mode].label}</span><span>01 — 06</span></div>
    <div className="red-disc"/>
    <div className="halo"/>
    <Figure/>
    <div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/>
    {cities.map((city,i)=><button key={city.name} className={"city-pin pin-"+i} style={{left:city.x+"%",top:city.y+"%"}} onClick={()=>{const match=problems.find(p=>p.location===city.name);if(match)setSelected(match);else notify(city.label)}}><span/><b>{city.name}</b></button>)}
    <div className="art-copy"><strong>{modeInfo[mode].label}</strong><span>06 CITIES · {filtered.length.toString().padStart(2,"0")} ACTIVE PROBLEMS</span></div>
    <div className="art-scroll">SCROLL <b>↓</b></div>
   </div>
  </section>

  <section className="bottom-strip">
   <div className="statement"><span>01</span><strong>THE IDEA</strong><p>DOXA connects a problem to the people, resources and action needed to move it forward.</p></div>
   <div className="stats"><div><b>{filtered.length.toString().padStart(2,"0")}</b><span>ACTIVE<br/>PROBLEMS</span></div><div><b>{filtered.reduce((n,p)=>n+p.people,0)}</b><span>PEOPLE<br/>HELPING</span></div><div><b>{filtered.reduce((n,p)=>n+p.resources,0)}</b><span>RESOURCES<br/>READY</span></div></div>
   <div className="modes"><span>EXPLORE</span>{(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>changeMode(item)}>{item==="city"?"MYCITY":item.toUpperCase()}</button>)}</div>
  </section>

  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><article className="detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="detail-tag">{selected.location} / {mode.toUpperCase()}</div><div className="detail-symbol">{selected.icon}</div><h2>{selected.title}</h2><p>{selected.description}</p><div className="detail-stats"><div><b>{selected.people}</b><span>PEOPLE</span></div><div><b>{selected.resources}</b><span>RESOURCES</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>PLEDGED</span></div></div><div className="progress">{["PROBLEM","PEOPLE","RESOURCES","ACTION","SOLVED"].map((step,i)=><span key={step} className={i<=selected.status?"done":""}><i>{i<selected.status?"✓":i+1}</i>{step}</span>)}</div><div className="help-actions"><button onClick={()=>help("Volunteer")}>VOLUNTEER <b>→</b></button><button onClick={()=>help("Resource")}>OFFER RESOURCE <b>→</b></button><button onClick={()=>help("Funding")}>CONTRIBUTE <b>→</b></button><button onClick={()=>help("Transport")}>PROVIDE TRANSPORT <b>→</b></button></div></article></div>}

  {showCreate&&<div className="overlay" onClick={()=>setShowCreate(false)}><article className="create" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowCreate(false)}>×</button><div className="detail-tag">START SOMETHING</div><h2>PUT A REAL<br/><em>PROBLEM</em> ON THE MAP.</h2><p>Describe what is happening. DOXA will connect it to people, resources and action.</p><input placeholder="Problem title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="City or area" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><textarea placeholder="What is happening, and what would help?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="publish" onClick={create}>PUBLISH TO DOXA <span>→</span></button></article></div>}

  {notice&&<button className="toast" onClick={()=>setNotice("")}>{notice}<span>×</span></button>}
 </main>
}