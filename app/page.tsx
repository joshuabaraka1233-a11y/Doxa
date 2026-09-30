"use client";

import { useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = {
  id: number; icon: string; title: string; location: string; description: string;
  people: number; resources: number; pledged: number; status: number;
};

const starter: Problem[] = [
  { id: 1, icon: "💧", title: "School water shortage", location: "Nairobi", description: "A community school needs a reliable water solution for its students.", people: 18, resources: 3, pledged: 8500, status: 3 },
  { id: 2, icon: "🪑", title: "40 students need desks", location: "Kisumu", description: "Students are sharing desks. The school needs desks and transport.", people: 7, resources: 2, pledged: 12000, status: 2 },
  { id: 3, icon: "🌱", title: "Community garden needs tools", location: "Mombasa", description: "A neighborhood garden needs basic tools and volunteers.", people: 5, resources: 4, pledged: 3000, status: 1 },
];

const cities = [
  { name: "Nairobi", x: 54, y: 58, label: "Water · 18 helping" },
  { name: "Kisumu", x: 51, y: 55, label: "Desks · 7 helping" },
  { name: "Mombasa", x: 58, y: 61, label: "Garden · 5 helping" },
  { name: "Lagos", x: 42, y: 54, label: "Food · 24 helping" },
  { name: "London", x: 46, y: 34, label: "Warmth · 31 helping" },
  { name: "Tokyo", x: 82, y: 42, label: "Reuse · 12 helping" },
];

export default function Home() {
  const [problems, setProblems] = useState(starter);
  const [mode, setMode] = useState<Mode>("solve");
  const [selected, setSelected] = useState<Problem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ title: "", location: "", description: "" });

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const filtered = useMemo(() => {
    if (mode === "city") return problems.filter((p) => p.location === "Nairobi");
    if (mode === "swap") return problems.filter((p) => p.resources > 0);
    return problems;
  }, [mode, problems]);

  const create = () => {
    if (!form.title || !form.location || !form.description) return notify("Complete the three fields first.");
    const p: Problem = { id: Date.now(), icon: "✦", title: form.title, location: form.location, description: form.description, people: 1, resources: 0, pledged: 0, status: 0 };
    setProblems((current) => [p, ...current]);
    setForm({ title: "", location: "", description: "" });
    setShowCreate(false); setSelected(p);
    notify("Your problem is now visible to the DOXA network.");
  };

  const ask = () => {
    if (!query.trim()) return notify("Tell DOXA what you want to change.");
    notify("DOXA is turning your idea into an action path."); setMode("solve");
  };

  const help = (kind: string) => {
    if (!selected) return;
    const next = { ...selected, people: selected.people + 1, resources: selected.resources + (kind !== "Volunteer" ? 1 : 0), status: Math.min(4, selected.status + 1) };
    setProblems((current) => current.map((p) => p.id === selected.id ? next : p));
    setSelected(next); notify(kind + " added to this problem.");
  };

  return (
    <main className={"doxa mode-" + mode}>
      <header className="topbar">
        <button className="logo" onClick={() => setMode("solve")}>DOXA<span /></button>
        <div className="network-status"><i /> LIVE WORLD · {12_842 + problems.length - 3} actions</div>
        <button className="profile" onClick={() => notify("Profile & contribution history coming next.")}>T</button>
      </header>

      <section className="hero">
        <div className="eyebrow">A living network for change</div>
        <h1>What should<br /><em>we change?</em></h1>
        <p>Problems are everywhere. So are people who can help. DOXA connects the two.</p>
        <div className="prompt">
          <span>↳</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Tell DOXA what you're trying to change..." />
          <button onClick={ask}>→</button>
        </div>
        <button className="start-button" onClick={() => setShowCreate(true)}>＋ Start a real-world problem</button>
      </section>

      <section className="world" aria-label="Living world">
        <div className="orbit orbit-a" /><div className="orbit orbit-b" />
        <div className="globe">
          <div className="globe-grid grid-a" /><div className="globe-grid grid-b" />
          <div className="land land-a" /><div className="land land-b" /><div className="land land-c" /><div className="glow" />
          {cities.map((city, index) => (
            <button key={city.name} className={"world-pin pin-" + index} style={{ left: city.x + "%", top: city.y + "%" }}
              onClick={() => { const match = problems.find((p) => p.location === city.name); if (match) setSelected(match); else notify(city.label); }}>
              <span className="pulse" /><b>{city.name}</b><small>{city.label}</small>
            </button>
          ))}
        </div>
        <div className="world-caption"><span>01</span> LIVING WORLD <i /> Problems become visible where they happen.</div>
      </section>

      <nav className="mode-nav">
        {(["solve", "swap", "city"] as Mode[]).map((item) => (
          <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
            <span>{item === "solve" ? "◎" : item === "swap" ? "↔" : "⌖"}</span>
            {item === "solve" ? "SOLVE" : item === "swap" ? "SWAP" : "MYCITY"}
          </button>
        ))}
      </nav>

      <aside className="signal-rail">
        <div className="rail-label">{mode === "solve" ? "SIGNALS" : mode === "swap" ? "SECOND LIFE" : "CITY SIGNALS"}</div>
        {filtered.slice(0, 3).map((p, index) => (
          <button key={p.id} className="signal" onClick={() => setSelected(p)}>
            <span className="signal-index">0{index + 1}</span>
            <span><strong>{p.title}</strong><small>{p.location} · {p.people} active</small></span><b>↗</b>
          </button>
        ))}
      </aside>

      {selected && (
        <div className="focus" onClick={() => setSelected(null)}>
          <div className="focus-world"><div className="focus-ring" /><div className="focus-dot" /></div>
          <article className="focus-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <div className="focus-meta"><span>{selected.location}</span><i /> DOXA {mode.toUpperCase()}</div>
            <div className="focus-icon">{selected.icon}</div><h2>{selected.title}</h2><p>{selected.description}</p>
            <div className="impact-line">
              <div><b>{selected.people}</b><span>people</span></div><div><b>{selected.resources}</b><span>resources</span></div><div><b>KSh {selected.pledged.toLocaleString()}</b><span>pledged</span></div>
            </div>
            <div className="path">{["Problem", "People", "Resources", "Action", "Solved"].map((step, i) =>
              <div key={step} className={i <= selected.status ? "done" : ""}><span>{i < selected.status ? "✓" : i + 1}</span><small>{step}</small></div>
            )}</div>
            <div className="help-actions">
              <button onClick={() => help("Volunteer")}>🙋 <span>Volunteer</span></button>
              <button onClick={() => help("Resource")}>📦 <span>Offer resource</span></button>
              <button onClick={() => help("Funding")}>◈ <span>Contribute</span></button>
              <button onClick={() => help("Transport")}>↗ <span>Provide transport</span></button>
            </div>
          </article>
        </div>
      )}

      {showCreate && (
        <div className="focus create-focus" onClick={() => setShowCreate(false)}>
          <article className="create-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowCreate(false)}>×</button>
            <div className="eyebrow">START SOMETHING</div><h2>Put a real problem<br /><em>on the map.</em></h2>
            <p>Describe what is happening. DOXA will connect it to people, resources and action.</p>
            <input placeholder="Problem title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="City or area" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <textarea placeholder="What is happening, and what would help?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="publish" onClick={create}>PUBLISH TO THE WORLD <span>→</span></button>
          </article>
        </div>
      )}

      {notice && <button className="toast" onClick={() => setNotice("")}>{notice}<span>×</span></button>}
    </main>
  );
}