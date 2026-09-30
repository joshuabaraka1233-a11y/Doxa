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
 return <div className="planet-art" aria-hidden="true">
   <svg viewBox="0 0 620 620" className="earth-svg">
    <defs>
      <radialGradient id="ocean" cx="36%" cy="28%">
        <stop offset="0" stopColor="#2de4e8"/><stop offset=".3" stopColor="#118acb"/><stop offset=".7" stopColor="#07549c"/><stop offset="1" stopColor="#031b50"/>
      </radialGradient>
      <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9ee95d"/><stop offset=".45" stopColor="#21a84c"/><stop offset="1" stopColor="#08723d"/>
      </linearGradient>
      <linearGradient id="land2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d0ee65"/><stop offset=".5" stopColor="#38b94d"/><stop offset="1" stopColor="#087b56"/>
      </linearGradient>
      <filter id="blur12"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="blur5"><feGaussianBlur stdDeviation="5"/></filter>
      <clipPath id="earthClip"><circle cx="310" cy="310" r="245"/></clipPath>
    </defs>

    <circle cx="310" cy="310" r="260" fill="#22dce4" opacity=".13" filter="url(#blur12)"/>
    <circle cx="310" cy="310" r="249" fill="url(#ocean)"/>
    <g clipPath="url(#earthClip)">
      <ellipse cx="205" cy="170" rx="160" ry="105" fill="#42d9e8" opacity=".18" filter="url(#blur12)"/>
      <path className="land land-a" d="M92 183 C126 119 181 104 227 128 C247 139 261 166 247 189 C228 220 193 215 177 240 C157 270 119 251 105 226 C94 208 88 198 92 183Z" fill="url(#land)"/>
      <path className="land land-b" d="M310 89 C354 68 415 85 441 119 C459 143 451 173 425 184 C402 193 391 218 359 222 C328 226 300 204 294 178 C289 147 287 106 310 89Z" fill="url(#land2)"/>
      <path className="land land-c" d="M419 244 C463 222 512 244 533 282 C547 308 527 334 498 337 C472 340 456 365 428 354 C402 343 391 314 397 288 C401 271 405 253 419 244Z" fill="url(#land)"/>
      <path className="land land-d" d="M190 315 C219 286 259 291 279 320 C296 345 287 379 266 397 C247 414 244 449 214 451 C183 453 162 424 166 393 C169 362 171 335 190 315Z" fill="url(#land2)"/>
      <path className="land land-e" d="M324 388 C356 359 401 366 421 394 C440 421 431 454 403 468 C379 480 359 510 329 499 C297 488 290 449 298 425 C303 409 311 399 324 388Z" fill="url(#land)"/>

      <g className="cloud-cloud cloud-1">
        <path d="M42 260 C95 215 141 231 160 263 C185 247 220 253 229 282 C244 320 195 334 151 321 C105 343 53 322 42 292 C35 279 35 269 42 260Z" fill="#b9fff4" opacity=".78"/>
        <path d="M20 288 C71 265 117 274 147 300 C177 326 143 350 105 343 C70 358 25 337 20 310Z" fill="#58ddd9" opacity=".68"/>
      </g>
      <g className="cloud-cloud cloud-2">
        <path d="M285 246 C330 213 366 225 382 252 C410 233 448 246 452 276 C458 310 420 322 384 309 C350 332 305 314 296 287 C287 274 281 259 285 246Z" fill="#c5fff5" opacity=".72"/>
      </g>
      <g className="cloud-cloud cloud-3">
        <path d="M150 458 C187 425 228 434 242 462 C266 446 302 456 309 484 C315 517 280 529 247 518 C214 538 172 524 162 498 C150 489 146 472 150 458Z" fill="#7ff1e6" opacity=".72"/>
      </g>
      <g className="cloud-cloud cloud-4">
        <path d="M390 105 C421 82 456 91 466 115 C489 100 518 111 520 136 C523 164 494 174 468 163 C443 179 407 169 401 147 C390 137 386 119 390 105Z" fill="#8af4e8" opacity=".66"/>
      </g>

      <g className="swirl-lines" fill="none" strokeLinecap="round">
        <path d="M61 163 C170 72 305 96 348 178 C382 244 324 296 241 283 C154 269 121 333 186 382 C258 436 370 414 444 352" stroke="#76fff0" strokeWidth="13" opacity=".34"/>
        <path d="M71 386 C142 329 218 348 244 404 C267 453 339 478 407 438 C452 411 488 373 520 385" stroke="#44e9e2" strokeWidth="10" opacity=".4"/>
        <path d="M120 125 C189 81 273 112 280 170 C286 221 238 245 192 228 C151 213 125 235 132 266" stroke="#c2fff6" strokeWidth="8" opacity=".34"/>
        <path d="M355 82 C303 126 310 184 357 203 C405 223 438 205 462 177" stroke="#72fff0" strokeWidth="11" opacity=".3"/>
      </g>
    </g>
    <circle cx="310" cy="310" r="246" fill="none" stroke="#5ff8ef" strokeWidth="5" opacity=".3"/>
    <circle cx="310" cy="310" r="253" fill="none" stroke="#38dce8" strokeWidth="1.5" opacity=".65"/>
    <ellipse cx="265" cy="205" rx="150" ry="70" fill="#fff" opacity=".08" filter="url(#blur12)"/>
   </svg>
   <span className="planet-star s1"/><span className="planet-star s2"/><span className="planet-star s3"/><span className="planet-star s4"/>
 </div>
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