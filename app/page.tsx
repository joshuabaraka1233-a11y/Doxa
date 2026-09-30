"use client";
import {useState} from "react";

type Mode="solve"|"swap"|"city";
type Problem={id:number;icon:string;title:string;location:string;description:string;people:number;resources:number;pledged:number;status:number};

const starter:Problem[]=[
{id:1,icon:"💧",title:"School water shortage",location:"Nairobi",description:"A community school needs a reliable water solution for its students.",people:18,resources:3,pledged:8500,status:3},
{id:2,icon:"🪑",title:"40 students need desks",location:"Kisumu",description:"Students are sharing desks. The school needs desks and transport.",people:7,resources:2,pledged:12000,status:2},
{id:3,icon:"🌱",title:"Community garden needs tools",location:"Mombasa",description:"A neighborhood garden needs basic tools and volunteers.",people:5,resources:4,pledged:3000,status:1}
];

export default function Home(){
 const[problems,setProblems]=useState(starter); const[mode,setMode]=useState<Mode>("solve"); const[selected,setSelected]=useState<Problem|null>(null);
 const[showCreate,setShowCreate]=useState(false); const[query,setQuery]=useState(""); const[notice,setNotice]=useState("");
 const[form,setForm]=useState({title:"",location:"",description:""});
 const notify=(s:string)=>{setNotice(s);setTimeout(()=>setNotice(""),2400)};
 const create=()=>{if(!form.title||!form.location||!form.description){notify("Complete the three fields first.");return}
   const p:Problem={id:Date.now(),icon:"🌍",title:form.title,location:form.location,description:form.description,people:1,resources:0,pledged:0,status:0};
   setProblems(x=>[p,...x]);setForm({title:"",location:"",description:""});setShowCreate(false);setSelected(p);notify("Your problem is now visible to the DOXA network.");
 };
 const filtered=mode==="solve"?problems:mode==="city"?problems.filter(p=>p.location==="Nairobi"):problems.filter(p=>p.resources>0);
 const ask=()=>{if(!query.trim()){notify("Tell DOXA what you want to change.");return}notify("DOXA is turning your idea into an action path.");setMode("solve")};
 const help=(kind:string)=>{if(!selected)return;setProblems(ps=>ps.map(p=>p.id===selected.id?{...p,people:p.people+1,resources:p.resources+(kind!=="volunteer"?1:0),status:Math.min(4,p.status+1)}:p));setSelected({...selected,people:selected.people+1,resources:selected.resources+(kind!=="volunteer"?1:0),status:Math.min(4,selected.status+1)});notify(kind+" added to this problem.");};
 return <main className="doxa">
  <header className="topbar"><div className="logo">DOXA<span className="logoDot"/></div><div className="tag">The action network</div><button className="avatar" onClick={()=>notify("Profile & contribution history coming next.")}>T</button></header>
  <section className="hero"><div className="eyebrow">A new kind of internet</div><h1>Change<br/><em>something.</em></h1><p>Find a problem. Give something a second life. Improve your city. Connect with people who can make things happen.</p>
   <div className="prompt"><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="What do you want to change?"/><button className="go" onClick={ask}>DO IT →</button></div>
  </section>
  <div className="globe"><span className="pin nairobi"/><span className="pin lagos"/><span className="pin london"/><span className="pin tokyo"/><span className="pin sao"/></div>
  <div className="bottom"><nav className="modes">{(["solve","swap","city"] as Mode[]).map(m=><button key={m} className={"mode "+(mode===m?"active":"")} onClick={()=>setMode(m)}>{m==="solve"?"🌎 SOLVE":m==="swap"?"↔ SWAP":"⌂ MYCITY"}</button>)}</nav><div className="status"><span className="live"/> <b>{12_842+problems.length-3}</b> actions happening now</div></div>
  <section className="drawer">
   <div className="drawerHead"><div><span className="eyebrow">DOXA {mode.toUpperCase()}</span><h2>{mode==="solve"?"Problems worth solving":mode==="swap"?"Give something another life":"Your city is alive"}</h2></div><button className="createBtn" onClick={()=>setShowCreate(true)}>+ Post a problem</button></div>
   <div className="problemGrid">{filtered.map(p=><button className="problemCard" key={p.id} onClick={()=>setSelected(p)}><span className="problemIcon">{p.icon}</span><div><h3>{p.title}</h3><p>{p.location} · {p.people} people involved</p><div className="miniProgress"><span style={{width:(p.status/4*100)+"%"}}/></div></div><span className="arrow">↗</span></button>)}</div>
  </section>
  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><article className="problemModal" onClick={e=>e.stopPropagation()}><button className="modalClose" onClick={()=>setSelected(null)}>×</button><div className="bigIcon">{selected.icon}</div><div className="eyebrow">{selected.location} · DOXA SOLVE</div><h2>{selected.title}</h2><p className="description">{selected.description}</p><div className="stats"><div><b>{selected.people}</b><span>people</span></div><div><b>{selected.resources}</b><span>resources</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>pledged</span></div></div><h4>Path to solved</h4><div className="steps">{["Problem","People","Resources","Action","Solved"].map((s,i)=><div className={i<=selected.status?"step done":"step"} key={s}><span>{i<selected.status?"✓":i+1}</span>{s}</div>)}</div><div className="helpGrid"><button onClick={()=>help("Volunteer")}>🙋 Volunteer</button><button onClick={()=>help("Resource")}>📦 Offer a resource</button><button onClick={()=>help("Funding")}>💰 Contribute</button><button onClick={()=>help("Transport")}>🚚 Provide transport</button></div></article></div>}
  {showCreate&&<div className="overlay" onClick={()=>setShowCreate(false)}><article className="createModal" onClick={e=>e.stopPropagation()}><button className="modalClose" onClick={()=>setShowCreate(false)}>×</button><div className="eyebrow">START SOMETHING</div><h2>What needs to change?</h2><p>Describe a real problem. DOXA will connect it to people, resources and action.</p><input placeholder="Problem title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="City or area" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><textarea placeholder="What is happening, and what would help?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="publish" onClick={create}>PUBLISH PROBLEM →</button></article></div>}
  {notice&&<button className="toast" onClick={()=>setNotice("")}>{notice}</button>}
 </main>
}