"use client";

import { useMemo, useState } from "react";

type Mode = "solve" | "swap" | "city";
type Problem = {
  id: number;
  icon: string;
  title: string;
  location: string;
  description: string;
  people: number;
  resources: number;
  pledged: number;
  status: number;
};

const starter: Problem[] = [
  { id: 1, icon: "W", title: "School water shortage", location: "Nairobi", description: "A community school needs a reliable water solution for its students.", people: 18, resources: 3, pledged: 8500, status: 3 },
  { id: 2, icon: "D", title: "40 students need desks", location: "Kisumu", description: "Students are sharing desks. The school needs desks and transport.", people: 7, resources: 2, pledged: 12000, status: 2 },
  { id: 3, icon: "G", title: "Community garden needs tools", location: "Mombasa", description: "A neighborhood garden needs basic tools and volunteers.", people: 5, resources: 4, pledged: 3000, status: 1 },
];

const cities = [
  { name: "Nairobi", x: 54, y: 58, label: "Water · 18 helping" },
  { name: "Kisumu", x: 49, y: 54, label: "Desks · 7 helping" },
  { name: "Mombasa", x: 61, y: 63, label: "Garden · 5 helping" },
  { name: "Lagos", x: 39, y: 49, label: "Food · 24 helping" },
  { name: "London", x: 44, y: 33, label: "Warmth · 31 helping" },
  { name: "Tokyo", x: 78, y: 42, label: "Reuse · 12 helping" },
];

const modeInfo = {
  solve: { label: "SOLVE", title: "Problems, meet action.", desc: "A global network for people who don't just see problems — they help move them forward." },
  swap: { label: "SWAP", title: "Nothing useful should sit still.", desc: "Exchange things, skills and resources with people who can put them to work." },
  city: { label: "MYCITY", title: "See what needs changing.", desc: "Turn local problems into visible, trackable action — from report to resolution." },
};

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

  const filtered = useMemo(
    () =>
      mode === "city"
        ? problems.filter((p) => p.location === "Nairobi")
        : mode === "swap"
          ? problems.filter((p) => p.resources > 0)
          : problems,
    [mode, problems]
  );

  const changeMode = (next: Mode) => {
    setMode(next);
    setSelected(null);
  };

  const ask = () => {
    if (!query.trim()) return notify("Tell DOXA what you want to change.");
    notify("DOXA is building an action path for you.");
    setMode("solve");
  };

  const create = () => {
    if (!form.title || !form.location || !form.description) return notify("Complete the three fields first.");
    const p: Problem = {
      id: Date.now(),
      icon: "✦",
      title: form.title,
      location: form.location,
      description: form.description,
      people: 1,
      resources: 0,
      pledged: 0,
      status: 0,
    };
    setProblems((current) => [p, ...current]);
    setForm({ title: "", location: "", description: "" });
    setShowCreate(false);
    setSelected(p);
    notify("Problem published to DOXA.");
  };

  const help = (kind: string) => {
    if (!selected) return;
    const next = {
      ...selected,
      people: selected.people + 1,
      resources: selected.resources + (kind !== "Volunteer" ? 1 : 0),
      status: Math.min(4, selected.status + 1),
    };
    setProblems((current) => current.map((p) => (p.id === selected.id ? next : p)));
    setSelected(next);
    notify(kind + " added to this problem.");
  };

  return (
    <main className={"doxa editorial mode-" + mode}>
      <header className="topbar">
        <button className="brand" onClick={() => changeMode("solve")} aria-label="DOXA home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>DOXA</span>
        </button>

        <nav>
          <button className={mode === "solve" ? "active" : ""} onClick={() => changeMode("solve")}>SOLVE</button>
          <button className={mode === "swap" ? "active" : ""} onClick={() => changeMode("swap")}>SWAP</button>
          <button className={mode === "city" ? "active" : ""} onClick={() => changeMode("city")}>MYCITY</button>
        </nav>

        <div className="top-right">
          <span className="live"><i /> LIVE</span>
          <button className="menu-button" onClick={() => notify("DOXA menu coming next.")}>MENU <b>↗</b></button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> GLOBAL PROBLEM-SOLVING NETWORK</div>
          <h1>MAKE<br /><em>CHANGE</em><br />REAL.</h1>
          <p>{modeInfo[mode].desc}</p>

          <div className="search-line">
            <span>↳</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder={mode === "solve" ? "What should we change?" : mode === "swap" ? "What can you give or find?" : "What needs changing near you?"}
            />
            <button onClick={ask}>→</button>
          </div>

          <button className="post-link" onClick={() => setShowCreate(true)}>
            POST A PROBLEM <span>+</span>
          </button>
        </div>

        <div className="visual">
          <div className="visual-top"><span>DOXA / {modeInfo[mode].label}</span><span>01 — 06</span></div>
          <div className="red-sun" />
          <div className="planet">
            <div className="planet-lines" />
            <div className="continent c1" />
            <div className="continent c2" />
            <div className="continent c3" />
            <div className="continent c4" />
            <div className="planet-shade" />
          </div>
          <div className="orbit-line o1" />
          <div className="orbit-line o2" />
          {cities.map((city, i) => (
            <button
              key={city.name}
              className={"city-pin p" + i}
              style={{ left: city.x + "%", top: city.y + "%" }}
              onClick={() => {
                const match = problems.find((p) => p.location === city.name);
                if (match) setSelected(match);
                else notify(city.label);
              }}
            >
              <span />
              <b>{city.name}</b>
            </button>
          ))}
          <div className="visual-caption">
            <strong>{modeInfo[mode].label}</strong>
            <span>06 CITIES · {filtered.length.toString().padStart(2, "0")} ACTIVE PROBLEMS</span>
          </div>
          <div className="scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
        </div>
      </section>

      <section className="bottom-strip">
        <div className="statement"><span>01</span><strong>THE IDEA</strong><p>DOXA connects a problem to the people, resources and action needed to move it forward.</p></div>
        <div className="stats">
          <div><b>{filtered.length.toString().padStart(2, "0")}</b><span>ACTIVE<br />PROBLEMS</span></div>
          <div><b>{filtered.reduce((n, p) => n + p.people, 0)}</b><span>PEOPLE<br />HELPING</span></div>
          <div><b>{filtered.reduce((n, p) => n + p.resources, 0)}</b><span>RESOURCES<br />READY</span></div>
        </div>
        <div className="modes">
          <span>EXPLORE</span>
          {(["solve", "swap", "city"] as Mode[]).map((item) => (
            <button key={item} className={mode === item ? "active" : ""} onClick={() => changeMode(item)}>
              {item === "solve" ? "SOLVE" : item === "swap" ? "SWAP" : "MYCITY"}
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <article className="detail" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <div className="detail-tag">{selected.location} / {mode.toUpperCase()}</div>
            <div className="detail-symbol">{selected.icon}</div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="detail-stats">
              <div><b>{selected.people}</b><span>PEOPLE</span></div>
              <div><b>{selected.resources}</b><span>RESOURCES</span></div>
              <div><b>KSh {selected.pledged.toLocaleString()}</b><span>PLEDGED</span></div>
            </div>
            <div className="progress">{["PROBLEM", "PEOPLE", "RESOURCES", "ACTION", "SOLVED"].map((step, i) => <span key={step} className={i <= selected.status ? "done" : ""}><i>{i < selected.status ? "✓" : i + 1}</i>{step}</span>)}</div>
            <div className="help-actions">
              <button onClick={() => help("Volunteer")}>VOLUNTEER <b>→</b></button>
              <button onClick={() => help("Resource")}>OFFER RESOURCE <b>→</b></button>
              <button onClick={() => help("Funding")}>CONTRIBUTE <b>→</b></button>
              <button onClick={() => help("Transport")}>PROVIDE TRANSPORT <b>→</b></button>
            </div>
          </article>
        </div>
      )}

      {showCreate && (
        <div className="overlay" onClick={() => setShowCreate(false)}>
          <article className="create" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowCreate(false)}>×</button>
            <div className="detail-tag">START SOMETHING</div>
            <h2>PUT A REAL<br /><em>PROBLEM</em> ON THE MAP.</h2>
            <p>Describe what is happening. DOXA will connect it to people, resources and action.</p>
            <input placeholder="Problem title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="City or area" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <textarea placeholder="What is happening, and what would help?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="publish" onClick={create}>PUBLISH TO DOXA <span>→</span></button>
          </article>
        </div>
      )}

      {notice && <button className="toast" onClick={() => setNotice("")}>{notice}<span>×</span></button>}
    </main>
  );
}