import { useState, useEffect, useRef, useCallback } from "react";
import { Briefcase, Wallet, Activity, Users, Heart, BookOpen, Palette, ChevronRight, ArrowRight, Copy, Check } from "lucide-react";

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const PILLARS = [
  { key: "business", name: "Business", fullName: "Business & Career", hex: "#6B8CAE", Icon: Briefcase,
    questions: [
      { q: "How fulfilled are you in your current career?", labels: ["Miserable", "Unfulfilled", "Okay", "Good", "Thriving"] },
      { q: "How much progress are you making toward your professional goals?", labels: ["None", "Very little", "Some", "Solid", "Rapid"] },
    ]},
  { key: "finances", name: "Finances", fullName: "Finances", hex: "#7A9E8C", Icon: Wallet,
    questions: [
      { q: "How in control of your finances do you feel?", labels: ["Drowning", "Stressed", "Coping", "Comfortable", "Free"] },
      { q: "How consistently are you building wealth or reducing debt?", labels: ["Not at all", "Rarely", "Sometimes", "Often", "Always"] },
    ]},
  { key: "health", name: "Health", fullName: "Health & Fitness", hex: "#B07A7A", Icon: Activity,
    questions: [
      { q: "How consistent is your exercise routine?", labels: ["Nonexistent", "Sporadic", "Okay", "Regular", "Daily"] },
      { q: "How would you rate your daily energy levels?", labels: ["Exhausted", "Low", "Average", "Good", "Electric"] },
    ]},
  { key: "family", name: "Family", fullName: "Family & Friends", hex: "#8B85AA", Icon: Users,
    questions: [
      { q: "How strong are your closest relationships?", labels: ["Isolated", "Distant", "Okay", "Close", "Unbreakable"] },
      { q: "How often do you invest quality time in people you love?", labels: ["Never", "Rarely", "Monthly", "Weekly", "Daily"] },
    ]},
  { key: "romance", name: "Romance", fullName: "Romance & Love", hex: "#A0788E", Icon: Heart,
    questions: [
      { q: "How satisfied are you with your romantic life?", labels: ["Empty", "Lonely", "Okay", "Happy", "Deeply fulfilled"] },
      { q: "How present and intentional are you in this area?", labels: ["Avoidant", "Passive", "Thinking about it", "Working on it", "Fully committed"] },
    ]},
  { key: "growth", name: "Growth", fullName: "Personal Growth", hex: "#A09570", Icon: BookOpen,
    questions: [
      { q: "How actively are you learning and developing yourself?", labels: ["Stagnant", "Rarely", "Sometimes", "Often", "Constantly"] },
      { q: "How connected do you feel to your purpose?", labels: ["Lost", "Searching", "Glimpses", "Clear", "On fire"] },
    ]},
  { key: "fun", name: "Fun", fullName: "Fun & Creation", hex: "#A0845A", Icon: Palette,
    questions: [
      { q: "How much joy and play is in your life right now?", labels: ["None", "Very little", "Some", "Good amount", "Overflowing"] },
      { q: "How often do you make time for hobbies or creative pursuits?", labels: ["Never", "Rarely", "Monthly", "Weekly", "Daily"] },
    ]},
];

/* ═══════════════════════════════════════
   RADAR COMPONENT
   ═══════════════════════════════════════ */
function AuditRadar({ scores, size = 280, animated }) {
  const [progress, setProgress] = useState(animated ? 0 : 1);
  useEffect(() => {
    if (!animated) { setProgress(1); return; }
    setProgress(0);
    let start = null, raf;
    const dur = 1600;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    function step(ts) { if (!start) start = ts; const p = Math.min((ts-start)/dur,1); setProgress(ease(p)); if (p<1) raf = requestAnimationFrame(step); }
    const timer = setTimeout(() => { raf = requestAnimationFrame(step); }, 400);
    return () => { clearTimeout(timer); if (raf) cancelAnimationFrame(raf); };
  }, [animated]);

  const cx = size/2, cy = size/2, r = size*0.30, n = 7;
  const pt = (i, v) => { const a = (Math.PI*2*i)/n - Math.PI/2; const d = (v/10)*r*progress; return [cx + d*Math.cos(a), cy + d*Math.sin(a)]; };
  const rpt = (i, s) => { const a = (Math.PI*2*i)/n - Math.PI/2; const d = s*r; return [cx + d*Math.cos(a), cy + d*Math.sin(a)]; };
  const dp = scores.map((s, i) => pt(i, s));
  const path = dp.map((p, i) => `${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {[0.25,0.5,0.75,1].map((ring,ri) => { const pts = Array.from({length:n},(_,j) => rpt(j,ring)); return <path key={ri} d={pts.map((p,j) => `${j?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z"} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />; })}
      {Array.from({length:n},(_,i) => { const [x,y] = rpt(i,1); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />; })}
      <path d={path} fill="rgba(212,168,75,0.12)" stroke="#D4A84B" strokeWidth="1.5" strokeLinejoin="round" opacity={progress} />
      {dp.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="#D4A84B" opacity={progress} />)}
      {PILLARS.map((pl,i) => {
        const [x,y] = rpt(i,1.5);
        const Icon = pl.Icon;
        return (
          <foreignObject key={`l${i}`} x={x-24} y={y-18} width={48} height={36} style={{ overflow: "visible" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Icon size={13} color={pl.hex} strokeWidth={1.8} style={{ opacity: 0.3 + progress * 0.5 }} />
              <span style={{ fontSize: 8.5, fontWeight: 600, color: `rgba(255,255,255,${0.2 + progress * 0.35})`, fontFamily: "'Outfit',sans-serif", textAlign: "center", lineHeight: 1 }}>{pl.name}</span>
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════
   QUESTION SCREEN
   ═══════════════════════════════════════ */
function QuestionScreen({ pillar, pillarIdx, answers, setAnswers, onNext, onBack, total }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(false); const t = setTimeout(() => setShow(true), 50); return () => clearTimeout(t); }, [pillarIdx]);

  const Icon = pillar.Icon;
  const current = answers[pillarIdx] || pillar.questions.map(() => 0);

  const setRating = (qi, val) => {
    const updated = [...current];
    updated[qi] = val;
    const newAnswers = [...answers];
    newAnswers[pillarIdx] = updated;
    setAnswers(newAnswers);
  };

  const allAnswered = current.every(v => v > 0);

  return (
    <div style={{ opacity: show?1:0, transition: "opacity 0.4s", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < pillarIdx ? "#D4A84B" : i === pillarIdx ? "rgba(212,168,75,0.4)" : "rgba(255,255,255,0.04)", transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Pillar header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${pillar.hex}15`, border: `1px solid ${pillar.hex}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={24} color={pillar.hex} strokeWidth={1.8} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#333", letterSpacing: "0.1em" }}>PILLAR {pillarIdx + 1} OF {total}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{pillar.fullName}</div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {pillar.questions.map((question, qi) => (
          <div key={qi}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#ccc", lineHeight: 1.5, marginBottom: 14 }}>{question.q}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3,4,5].map(val => {
                const isSelected = current[qi] === val;
                return (
                  <div key={val} onClick={() => setRating(qi, val)} style={{
                    flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                    background: isSelected ? `${pillar.hex}20` : "rgba(255,255,255,0.025)",
                    border: isSelected ? `1.5px solid ${pillar.hex}50` : "1px solid rgba(255,255,255,0.05)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? pillar.hex : "#333", fontFamily: "'JetBrains Mono',monospace" }}>{val}</div>
                    <div style={{ fontSize: 8, color: isSelected ? `${pillar.hex}` : "#2A2A2A", textAlign: "center", lineHeight: 1.2, fontWeight: 500, minHeight: 18 }}>{question.labels[val-1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 8 }}>
        {pillarIdx > 0 && (
          <div onClick={onBack} style={{ padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#555", cursor: "pointer", textAlign: "center" }}>Back</div>
        )}
        <div onClick={allAnswered ? onNext : undefined} style={{
          flex: 1, padding: "14px 0", borderRadius: 12, fontSize: 15, fontWeight: 700, textAlign: "center", cursor: allAnswered ? "pointer" : "default",
          background: allAnswered ? "#D4A84B" : "#151515", color: allAnswered ? "#000" : "#333",
          transition: "all 0.2s",
        }}>
          {pillarIdx === total - 1 ? "See My Results" : "Next"}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════ */
function ResultsScreen({ scores, onReset }) {
  const [phase, setPhase] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const avg = (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1);
  const sorted = scores.map((s, i) => ({ score: s, pillar: PILLARS[i] })).sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const gap = (strongest.score - weakest.score).toFixed(1);

  // Insight generation
  const getInsight = () => {
    if (parseFloat(avg) >= 8) return "You're operating at a high level across the board. The question isn't what to fix — it's what to take from great to elite.";
    if (parseFloat(avg) <= 4) return "You're in a rebuilding phase — and that's okay. The worst thing you can do is try to fix everything. Pick 3 and go deep.";
    if (parseFloat(gap) >= 5) return `There's a ${gap}-point gap between your strongest and weakest pillar. You're overinvesting in ${strongest.pillar.name} at the cost of ${weakest.pillar.name}.`;
    if (parseFloat(gap) <= 2) return "Your scores are fairly even — but even can mean evenly mediocre. Sometimes you need to sacrifice balance for breakthrough in what matters most.";
    return `${weakest.pillar.name} is holding you back. Focusing there could have the biggest impact on your overall life quality.`;
  };

  const handleSubmit = () => {
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Radar reveal */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 10px", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s" }}>
        <AuditRadar scores={scores} size={280} animated={phase >= 1} />
      </div>

      {/* Score */}
      <div style={{ textAlign: "center", opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.6s" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#2A2A2A", letterSpacing: "0.15em", marginBottom: 6 }}>YOUR LIFE SCORE</div>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#D4A84B", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "'JetBrains Mono',monospace" }}>{avg}</div>
        <div style={{ fontSize: 16, color: "#333", marginTop: 2 }}>/10</div>
      </div>

      {/* Breakdown + Insight */}
      <div style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.6s", marginTop: 24 }}>
        {/* Pillar breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {sorted.map(({ score, pillar }) => {
            const Icon = pillar.Icon;
            return (
              <div key={pillar.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${pillar.hex}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} color={pillar.hex} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>{pillar.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pillar.hex, fontFamily: "'JetBrains Mono',monospace" }}>{score.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ height: 3, borderRadius: 2, background: pillar.hex, width: `${score * 10}%`, opacity: 0.6, transition: "width 1s ease-out" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight card */}
        <div style={{ padding: "18px 20px", background: "rgba(212,168,75,0.04)", border: "1px solid rgba(212,168,75,0.1)", borderRadius: 14, marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#D4A84B", letterSpacing: "0.1em", marginBottom: 6 }}>YOUR INSIGHT</div>
          <div style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6 }}>{getInsight()}</div>
        </div>

        {/* CTA */}
        <div style={{ padding: "24px 20px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, marginBottom: 16 }}>
          {!submitted ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>You can't pursue everything.</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>Misogi helps you choose 3 pillars to focus on, build the daily habits that move them, and watch your radar expand. Join the waitlist.</div>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="your@email.com" style={{ flex: 1, padding: "13px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", fontSize: 14, color: "#fff", fontFamily: "'Outfit',sans-serif", outline: "none", boxSizing: "border-box" }} />
                <div onClick={handleSubmit} style={{ padding: "13px 20px", borderRadius: 10, background: email.includes("@") ? "#D4A84B" : "#1A1A1A", color: email.includes("@") ? "#000" : "#333", fontSize: 14, fontWeight: 700, cursor: email.includes("@") ? "pointer" : "default", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  Join Waitlist
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>
                <Check size={32} color="#D4A84B" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>You're on the list.</div>
              <div style={{ fontSize: 13, color: "#555" }}>We'll let you know when Misogi launches.</div>
            </div>
          )}
        </div>

        {/* Share + retake */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div onClick={() => { navigator.clipboard?.writeText(`My Misogi Life Score: ${avg}/10\n\n${sorted.map(s => `${s.pillar.name}: ${s.score.toFixed(1)}`).join('\n')}\n\nTake yours →`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#888", textAlign: "center", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {copied ? <><Check size={13} color="#D4A84B" strokeWidth={2} /> Copied!</> : <><Copy size={13} color="#888" strokeWidth={1.8} /> Share Results</>}
          </div>
          <div onClick={onReset} style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#555", textAlign: "center", cursor: "pointer" }}>Retake Audit</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════ */
export default function MisogiLanding() {
  const [started, setStarted] = useState(false);
  const [currentPillar, setCurrentPillar] = useState(0);
  const [answers, setAnswers] = useState(PILLARS.map(p => p.questions.map(() => 0)));
  const [showResults, setShowResults] = useState(false);
  const [heroShow, setHeroShow] = useState(false);
  const auditRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroShow(true), 100); }, []);

  const scores = answers.map(pillarAnswers => {
    const avg = pillarAnswers.reduce((a, b) => a + b, 0) / pillarAnswers.length;
    return Math.round(avg * 20) / 10; // Convert 1-5 to 2-10
  });

  const scrollToAudit = () => {
    setStarted(true);
    setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const reset = () => {
    setAnswers(PILLARS.map(p => p.questions.map(() => 0)));
    setCurrentPillar(0);
    setShowResults(false);
    setStarted(true);
    setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Outfit',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ─── HERO ─── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ padding: "60px 0 40px", opacity: heroShow?1:0, transition: "opacity 0.8s" }}>
          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em" }}>MISOGI</div>
              <div style={{ fontSize: 10, color: "#D4A84B", fontWeight: 600, opacity: 0.5 }}>禊</div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ marginBottom: 48, opacity: heroShow?1:0, transition: "opacity 0.8s 0.2s" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A84B", letterSpacing: "0.15em", marginBottom: 16 }}>FREE LIFE AUDIT</div>
            <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px", color: "#fff" }}>
              How balanced is<br />your life, <span style={{ fontStyle: "italic", color: "#D4A84B" }}>really?</span>
            </h1>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>
              Rate yourself across 7 pillars of life. Get your personalised radar chart. See where you're thriving — and where you're lying to yourself.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <div onClick={scrollToAudit} style={{ padding: "16px 32px", borderRadius: 12, background: "#D4A84B", color: "#000", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "transform 0.15s" }}>
                Take the Audit <ArrowRight size={18} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 13, color: "#333" }}>2 min · free</div>
            </div>
          </div>

          {/* Social proof / pillar preview */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, opacity: heroShow?1:0, transition: "opacity 0.8s 0.4s" }}>
            {PILLARS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px 6px 8px", background: `${p.hex}08`, border: `1px solid ${p.hex}18`, borderRadius: 8 }}>
                  <Icon size={13} color={p.hex} strokeWidth={1.8} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: `${p.hex}` }}>{p.name}</span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginBottom: 0 }} />
        </div>

        {/* ─── AUDIT SECTION ─── */}
        <div ref={auditRef} style={{ padding: "40px 0 60px", minHeight: started ? 400 : 0 }}>
          {started && !showResults && (
            <QuestionScreen
              pillar={PILLARS[currentPillar]}
              pillarIdx={currentPillar}
              answers={answers}
              setAnswers={setAnswers}
              total={7}
              onNext={() => {
                if (currentPillar === 6) setShowResults(true);
                else setCurrentPillar(currentPillar + 1);
              }}
              onBack={() => setCurrentPillar(Math.max(0, currentPillar - 1))}
            />
          )}
          {showResults && <ResultsScreen scores={scores} onReset={reset} />}
        </div>

        {/* ─── FOOTER ─── */}
        <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", marginBottom: 4 }}>MISOGI</div>
          <div style={{ fontSize: 11, color: "#222" }}>Focus. Sacrifice. Grow.</div>
        </div>
      </div>
    </div>
  );
}
