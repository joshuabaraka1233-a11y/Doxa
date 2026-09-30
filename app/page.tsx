"use client";

import { useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = { id:number; icon:string; title:string; location:string; description:string; people:number; resources:number; pledged:number; status:number };

const starter:Problem[]=[
  {id:1,icon:"💧",title:"School water shortage",location:"Nairobi",description:"A community school needs a reliable water solution for its students.",people:18,resources:3,pledged:8500,status:3},
  {id:2,icon:"🪑",title:"40 students need desks",location:"Kisumu",description:"Students are sharing desks. The school needs desks and transport.",people:7,resources:2,pledged:12000,status:2},
  {id:3,icon:"🌱",title:"Community garden needs tools",location:"Mombasa",description:"A neighborhood garden needs basic tools and volunteers.",people:5,resources:4,pledged:3000,status:1},
];

const cities=[
  {name:"Nairobi",x:54,y:58,label:"Water · 18 helping",color:"green"},
  {name:"Kisumu",x:51,y:55,label:"Desks · 7 helping",color:"blue"},
  {name:"Mombasa",x:58,y:61,label:"Garden · 5 helping",color:"orange"},
  {name:"Lagos",x:42,y:54,label:"Food · 24 helping",color:"purple"},
  {name:"London",x:46,y:34,label:"Warmth · 31 helping",color:"pink"},
  {name:"Tokyo",x:82,y:42,label:"Reuse · 12 helping",color:"cyan"},
];

const modeInfo={
  solve:{label:"SOLVE",title:"Turn problems into action",desc:"Find real problems and connect your time, skills, resources or money to people who need them.",color:"green"},
  swap:{label:"SWAP",title:"Give useful things a second life",desc:"Connect unused items, skills and resources with people who can use them.",color:"purple"},
  city:{label:"MYCITY",title:"Make your city better",desc:"See local problems, follow progress and help move your community from report to resolved.",color:"blue"}
};

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
 const create=()=>{
   if(!form.title||!form.location||!form.description)return notify("Complete the three fields first.");
   const p:Problem={id:Date.now(),icon:"✦",title:form.title,location:form.location,description:form.description,people:1,resources:0,pledged:0,status:0};
   setProblems(current=>[p,...current]);setForm({title:"",location:"",description:""});setShowCreate(false);setSelected(p);notify("Problem published to DOXA.");
 };
 const ask=()=>{if(!query.trim())return notify("Tell DOXA what you want to change.");notify("DOXA is building an action path for you.");setMode("solve")};
 const help=(kind:string)=>{
   if(!selected)return;
   const next={...selected,people:selected.people+1,resources:selected.resources+(kind!=="Volunteer"?1:0),status:Math.min(4,selected.status+1)};
   setProblems(current=>current.map(p=>p.id===selected.id?next:p));setSelected(next);notify(kind+" added to this problem.");
 };

 return <main className={"doxa nexus mode-"+mode}>
  <header className="topbar">
   <button className="logo" onClick={()=>changeMode("solve")}><span className="logo-mark">◈</span>DOXA</button>
   <nav className="main-nav">
    <button className={mode==="solve"?"active":""} onClick={()=>changeMode("solve")}>Solve</button>
    <button className={mode==="swap"?"active":""} onClick={()=>changeMode("swap")}>Swap</button>
    <button className={mode==="city"?"active":""} onClick={()=>changeMode("city")}>MyCity</button>
   </nav>
   <div className="top-actions"><div className="network-status"><i/> LIVE · 12,842 actions</div><button className="profile" onClick={()=>notify("Profile & contribution history coming next.")}>T</button></div>
  </header>

  <div className="side-rail"><div className="rail-brand">DOXA <small>NEXUS</small></div><button className={mode==="solve"?"rail-active":""} onClick={()=>changeMode("solve")}><span>◉</span> Solve</button><button className={mode==="swap"?"rail-active":""} onClick={()=>changeMode("swap")}><span>⇄</span> Swap</button><button className={mode==="city"?"rail-active":""} onClick={()=>changeMode("city")}><span>⌖</span> MyCity</button><div className="rail-spacer"/><button onClick={()=>notify("Impact dashboard coming next.")}><span>✦</span> Impact</button><button onClick={()=>notify("Settings coming next.")}><span>⚙</span> Settings</button></div>
  <section className="hero">
   <div className={"section-badge badge-"+modeInfo[mode].color}><span/> NEXUS / {modeInfo[mode].label}</div>
   <div className="hero-kicker">GLOBAL ACTION NETWORK <span>● LIVE</span></div><h1>{modeInfo[mode].title}</h1>
   <p>{modeInfo[mode].desc}</p>
   <div className="prompt"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder={mode==="solve"?"Search a problem or ask DOXA...":mode==="swap"?"What do you want to give or find?":"Search your city..."} /><button onClick={ask}>→</button></div>
   <button className="start-button" onClick={()=>setShowCreate(true)}>＋ Post a problem <span>It takes less than a minute</span></button>
  </section>

  <section className="world" aria-label="DOXA living world"><div className="world-header"><span>WORLD ACTIVITY</span><b>REAL-TIME SIGNALS</b></div><div className="scan-line"/>
   <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
   <div className="globe"><div className="atmosphere"/><div className="ocean-texture"/><div className="clouds"/>
    <div className="globe-grid grid-a"/><div className="globe-grid grid-b"/>
    <div className="land land-a"/><div className="land land-b"/><div className="land land-c"/><div className="land land-d"/><div className="glow"/><div className="route route-one"><i/></div><div className="route route-two"><i/></div><div className="route route-three"><i/></div>
    {cities.map((city,index)=><button key={city.name} className={"world-pin pin-"+index+" pin-"+city.color} style={{left:city.x+"%",top:city.y+"%"}} onClick={()=>{const match=problems.find(p=>p.location===city.name);if(match)setSelected(match);else notify(city.label)}}><span className="pulse"/><b>{city.name}</b><small>{city.label}</small></button>)}
   </div>
   <div className="world-particles"><i/><i/><i/><i/><i/><i/></div><div className="world-info"><strong>GLOBAL ACTIVITY</strong><span>06 cities · 03 active problems · 24 people moving</span></div><div className="map-scale"><span>01</span><i/><span>GLOBAL</span></div>
  </section>

  <aside className="signal-rail"><div className="signal-live"><i/> LIVE NETWORK <b>+{problems.length}</b></div>
   <div className="rail-head"><div><span className="rail-kicker">{modeInfo[mode].label}</span><h2>{mode==="solve"?"Open problems":mode==="swap"?"Active exchanges":"Nairobi signals"}</h2></div><span className="count">{filtered.length}</span></div>
   {filtered.slice(0,3).map((p,index)=><button key={p.id} className="signal" onClick={()=>setSelected(p)}><span className="signal-index">0{index+1}</span><span><strong>{p.title}</strong><small>{p.location} · {p.people} people involved</small></span><b>↗</b></button>)}
   <button className="view-all" onClick={()=>notify(filtered.length+" active items in this view.")}>View all signals <span>→</span></button>
  </aside>

  <div className="metrics"><div><span>ACTIVE PROBLEMS</span><b>{filtered.length.toString().padStart(2,"0")}</b></div><div><span>PEOPLE HELPING</span><b>{filtered.reduce((n,p)=>n+p.people,0)}</b></div><div><span>RESOURCES</span><b>{filtered.reduce((n,p)=>n+p.resources,0)}</b></div><div><span>IMPACT VALUE</span><b>KSh {filtered.reduce((n,p)=>n+p.pledged,0).toLocaleString()}</b></div></div><div className="bottom-bar">
   <div className="mode-switch">
    {(["solve","swap","city"] as Mode[]).map(item=><button key={item} className={mode===item?"active":""} onClick={()=>changeMode(item)}><span>{item==="solve"?"◎":item==="swap"?"↔":"⌖"}</span>{item==="solve"?"SOLVE":item==="swap"?"SWAP":"MYCITY"}</button>)}
   </div>
   <div className="legend"><span className="legend-dot green"/> NETWORK ACTIVE <span className="sep"/> <b>{12_842+problems.length-3}</b> actions today</div>
  </div>

  {selected&&<div className="focus" onClick={()=>setSelected(null)}>
   <div className="focus-world"><div className="focus-ring"/><div className="focus-dot"/></div>
   <article className="focus-panel" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={()=>setSelected(null)}>×</button>
    <div className="focus-meta"><span>{selected.location}</span><i/> DOXA {mode.toUpperCase()}</div>
    <div className="focus-icon">{selected.icon}</div><h2>{selected.title}</h2><p>{selected.description}</p>
    <div className="impact-line"><div><b>{selected.people}</b><span>people</span></div><div><b>{selected.resources}</b><span>resources</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>pledged</span></div></div>
    <div className="path">{["Problem","People","Resources","Action","Solved"].map((step,i)=><div key={step} className={i<=selected.status?"done":""}><span>{i<selected.status?"✓":i+1}</span><small>{step}</small></div>)}</div>
    <div className="help-actions"><button onClick={()=>help("Volunteer")}>🙋 <span>Volunteer</span></button><button onClick={()=>help("Resource")}>📦 <span>Offer resource</span></button><button onClick={()=>help("Funding")}>◈ <span>Contribute</span></button><button onClick={()=>help("Transport")}>↗ <span>Transport</span></button></div>
   </article>
  </div>}

  {showCreate&&<div className="focus create-focus" onClick={()=>setShowCreate(false)}><article className="create-panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowCreate(false)}>×</button><div className="eyebrow">START SOMETHING</div><h2>Put a real problem<br/><em>on the map.</em></h2><p>Describe what is happening. DOXA will connect it to people, resources and action.</p><input placeholder="Problem title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="City or area" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><textarea placeholder="What is happening, and what would help?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="publish" onClick={create}>PUBLISH TO THE WORLD <span>→</span></button></article></div>}

  {notice&&<button className="toast" onClick={()=>setNotice("")}>{notice}<span>×</span></button>}
 </main>
}