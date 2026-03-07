import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Crown,
  Heart,
  Palette,
  RotateCcw,
  Users,
  Wallet,
} from "lucide-react";

const GOLD = "#D4A84B";
const BG = "#030303";
const PANEL = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "#737373";

const PILLARS = [
  {
    key: "business",
    name: "Business",
    fullName: "Business & Career",
    hex: "#6B8CAE",
    Icon: Briefcase,
    questions: [
      {
        q: "How fulfilled are you in your current career?",
        labels: ["Miserable", "Unfulfilled", "Okay", "Good", "Thriving"],
      },
      {
        q: "How much progress are you making toward your professional goals?",
        labels: ["None", "Very little", "Some", "Solid", "Rapid"],
      },
    ],
  },
  {
    key: "finances",
    name: "Finances",
    fullName: "Finances",
    hex: "#7A9E8C",
    Icon: Wallet,
    questions: [
      {
        q: "How in control of your finances do you feel?",
        labels: ["Drowning", "Stressed", "Coping", "Comfortable", "Free"],
      },
      {
        q: "How consistently are you building wealth or reducing debt?",
        labels: ["Not at all", "Rarely", "Sometimes", "Often", "Always"],
      },
    ],
  },
  {
    key: "health",
    name: "Health",
    fullName: "Health & Fitness",
    hex: "#B07A7A",
    Icon: Activity,
    questions: [
      {
        q: "How consistent is your exercise routine?",
        labels: ["Nonexistent", "Sporadic", "Okay", "Regular", "Daily"],
      },
      {
        q: "How would you rate your daily energy levels?",
        labels: ["Exhausted", "Low", "Average", "Good", "Electric"],
      },
    ],
  },
  {
    key: "family",
    name: "Family",
    fullName: "Family & Friends",
    hex: "#8B85AA",
    Icon: Users,
    questions: [
      {
        q: "How strong are your closest relationships?",
        labels: ["Isolated", "Distant", "Okay", "Close", "Unbreakable"],
      },
      {
        q: "How often do you invest quality time in people you love?",
        labels: ["Never", "Rarely", "Monthly", "Weekly", "Daily"],
      },
    ],
  },
  {
    key: "romance",
    name: "Romance",
    fullName: "Romance & Love",
    hex: "#A0788E",
    Icon: Heart,
    questions: [
      {
        q: "How satisfied are you with your romantic life?",
        labels: ["Empty", "Lonely", "Okay", "Happy", "Deeply fulfilled"],
      },
      {
        q: "How present and intentional are you in this area?",
        labels: ["Avoidant", "Passive", "Thinking about it", "Working on it", "Fully committed"],
      },
    ],
  },
  {
    key: "growth",
    name: "Growth",
    fullName: "Personal Growth",
    hex: "#A09570",
    Icon: BookOpen,
    questions: [
      {
        q: "How actively are you learning and developing yourself?",
        labels: ["Stagnant", "Rarely", "Sometimes", "Often", "Constantly"],
      },
      {
        q: "How connected do you feel to your purpose?",
        labels: ["Lost", "Searching", "Glimpses", "Clear", "On fire"],
      },
    ],
  },
  {
    key: "fun",
    name: "Fun",
    fullName: "Fun & Creation",
    hex: "#A0845A",
    Icon: Palette,
    questions: [
      {
        q: "How much joy and play is in your life right now?",
        labels: ["None", "Very little", "Some", "Good amount", "Overflowing"],
      },
      {
        q: "How often do you make time for hobbies or creative pursuits?",
        labels: ["Never", "Rarely", "Monthly", "Weekly", "Daily"],
      },
    ],
  },
];

const STORAGE_KEY = "misogi-audit-answers";
const REDIRECT_FLAG = "misogi_subscribed";

function loadAnswers() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAnswers(answers) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // no-op
  }
}

function Button({ children, onClick, disabled = false, kind = "primary", type = "button" }) {
  const primary = kind === "primary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        border: "none",
        borderRadius: 14,
        padding: "15px 18px",
        cursor: disabled ? "not-allowed" : "pointer",
        background: primary ? GOLD : "transparent",
        color: primary ? "#000" : "#fff",
        borderColor: primary ? "transparent" : BORDER,
        borderStyle: "solid",
        borderWidth: 1,
        fontSize: 15,
        fontWeight: 700,
        opacity: disabled ? 0.45 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "transform 0.15s ease, opacity 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function Section({ eyebrow, title, subtitle, children, idRef }) {
  return (
    <section ref={idRef} style={{ padding: "34px 0" }}>
      {eyebrow ? (
        <div style={{ fontSize: 11, letterSpacing: "0.14em", fontWeight: 700, color: "#303030", marginBottom: 10 }}>
          {eyebrow}
        </div>
      ) : null}
      {title ? (
        <h2
          style={{
            fontSize: 30,
            lineHeight: 1.1,
            margin: "0 0 12px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p style={{ margin: "0 0 22px", color: MUTED, lineHeight: 1.7, fontSize: 15 }}>{subtitle}</p>
      ) : null}
      {children}
    </section>
  );
}

function ProgressBar({ current, total }) {
  const width = `${(current / total) * 100}%`;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: MUTED }}>
        <span>Progress</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width, background: GOLD, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function RadarChart({ scores, size = 300 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;
  const n = PILLARS.length;

  const point = (i, value, radiusScale = 1) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const distance = (value / 10) * r * radiusScale;
    return [cx + distance * Math.cos(angle), cy + distance * Math.sin(angle)];
  };

  const polygon = (values, radiusScale = 1) =>
    values
      .map((v, i) => {
        const [x, y] = point(i, v, radiusScale);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  const scorePath = polygon(scores);

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 18px" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: "100%", height: "auto" }}>
        {[2.5, 5, 7.5, 10].map((ring, idx) => (
          <path
            key={idx}
            d={polygon(Array(PILLARS.length).fill(ring))}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        ))}

        {PILLARS.map((pillar, i) => {
          const [x, y] = point(i, 10, 1.12);
          return <line key={pillar.key} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" />;
        })}

        <path d={scorePath} fill="rgba(212,168,75,0.12)" stroke={GOLD} strokeWidth="2" />

        {scores.map((value, i) => {
          const [x, y] = point(i, value);
          return <circle key={PILLARS[i].key} cx={x} cy={y} r="4" fill={GOLD} />;
        })}

        {PILLARS.map((pillar, i) => {
          const [x, y] = point(i, 10, 1.28);
          return (
            <g key={pillar.key}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={pillar.hex}
                fontSize="11"
                fontWeight="700"
              >
                {pillar.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ScoreCards({ scores }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
        gap: 12,
      }}
    >
      {PILLARS.map((pillar, index) => {
        const score = scores[index];
        const Icon = pillar.Icon;
        return (
          <div
            key={pillar.key}
            style={{
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon size={16} color={pillar.hex} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{pillar.name}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: pillar.hex }}>{score.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: MUTED }}>out of 10</div>
          </div>
        );
      })}
    </div>
  );
}

function EmailCapture({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().includes("@") && !submitting;

  const submit = async (event) => {
    event?.preventDefault?.();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Subscription failed. Please try again.");
      }

      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 800 }}>Enter your email to unlock results</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
          We’ll send your radar chart and future Misogi updates. Unsubscribe anytime.
        </div>
      </div>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        style={{
          width: "100%",
          borderRadius: 14,
          padding: "14px 14px",
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${BORDER}`,
          color: "#fff",
          outline: "none",
          fontSize: 14,
        }}
      />

      {error ? (
        <div style={{ color: "#ffb4b4", fontSize: 13, lineHeight: 1.5 }}>
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={!canSubmit}>
        {submitting ? "Subscribing..." : "Unlock my results"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}

function App() {
  const auditRef = useRef(null);
  const [answers, setAnswers] = useState(() => (typeof window === "undefined" ? {} : loadAnswers()));
  const [currentPillar, setCurrentPillar] = useState(0);
  const [stage, setStage] = useState("intro");

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const subscribed = params.get(REDIRECT_FLAG) === "1";
    const hasSavedAudit = Object.keys(loadAnswers()).length > 0;

    if (subscribed && hasSavedAudit) {
      setAnswers(loadAnswers());
      setStage("results");
      setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, []);

  const answeredCount = useMemo(() => {
    return PILLARS.reduce((count, pillar) => {
      const selected = answers[pillar.key] || [];
      return count + selected.filter((value) => typeof value === "number").length;
    }, 0);
  }, [answers]);

  const totalQuestions = PILLARS.reduce((sum, pillar) => sum + pillar.questions.length, 0);
  const currentQuestionSet = PILLARS[currentPillar];
  const currentAnswers = answers[currentQuestionSet.key] || [];
  const canAdvance = currentAnswers.length === currentQuestionSet.questions.length && currentAnswers.every((value) => typeof value === "number");

  const scores = useMemo(() => {
    return PILLARS.map((pillar) => {
      const values = answers[pillar.key] || [];
      if (!values.length) return 0;
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return Number((average * 2).toFixed(1));
    });
  }, [answers]);

  const overallScore = useMemo(() => {
    if (!scores.length) return 0;
    const validScores = scores.filter((score) => score > 0);
    if (!validScores.length) return 0;
    return Number((validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1));
  }, [scores]);

  const strongest = useMemo(() => {
    const ranked = PILLARS.map((pillar, index) => ({ ...pillar, score: scores[index] })).sort((a, b) => b.score - a.score);
    return ranked.slice(0, 3);
  }, [scores]);

  const weakest = useMemo(() => {
    const ranked = PILLARS.map((pillar, index) => ({ ...pillar, score: scores[index] })).sort((a, b) => a.score - b.score);
    return ranked.slice(0, 3);
  }, [scores]);

  const scrollToAudit = () => {
    setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  const startAudit = () => {
    setStage("audit");
    scrollToAudit();
  };

  const selectAnswer = (pillarKey, questionIndex, value) => {
    setAnswers((prev) => {
      const next = { ...prev };
      const existing = [...(next[pillarKey] || [])];
      existing[questionIndex] = value;
      next[pillarKey] = existing;
      return next;
    });
  };

  const nextStep = () => {
    if (!canAdvance) return;
    if (currentPillar === PILLARS.length - 1) {
      setStage("gate");
      scrollToAudit();
      return;
    }
    setCurrentPillar((value) => value + 1);
  };

  const prevStep = () => {
    if (currentPillar === 0) {
      setStage("intro");
      return;
    }
    setCurrentPillar((value) => value - 1);
  };

  const resetAudit = () => {
    setAnswers({});
    setCurrentPillar(0);
    setStage("intro");
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      const url = new URL(window.location.href);
      url.searchParams.delete(REDIRECT_FLAG);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const currentQuestionNumber = PILLARS.slice(0, currentPillar).reduce((sum, pillar) => sum + pillar.questions.length, 0);
  const unlockResults = () => {
    setStage("results");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set(REDIRECT_FLAG, "1");
      window.history.replaceState({}, "", url.toString());
    }
    setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#fff", fontFamily: "Inter, Outfit, system-ui, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${BG}; }
        button { font-family: inherit; }
        @media (max-width: 640px) {
          .hero-title { font-size: 38px !important; }
          .shell { padding-left: 18px !important; padding-right: 18px !important; }
        }
      `}</style>

      <div className="shell" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 56px" }}>
        <header style={{ padding: "28px 0 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em" }}>MISOGI</div>
            <div style={{ color: GOLD, fontSize: 12, opacity: 0.75 }}>禊</div>
          </div>
          <div style={{ fontSize: 12, color: MUTED }}>Life alignment audit</div>
        </header>

        <Section
          eyebrow="FOUNDING 100"
          title={<span className="hero-title">Your life has seven pillars. Most people only track one.</span>}
          subtitle="Take the Misogi life audit, see your current shape across all 7 pillars, and unlock your radar chart after subscribing."
        >
          <div
            style={{
              background: "linear-gradient(180deg, rgba(212,168,75,0.08), rgba(255,255,255,0.02))",
              border: `1px solid rgba(212,168,75,0.14)`,
              borderRadius: 22,
              padding: 22,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                "2 minute audit",
                "7 pillar score",
                "Radar chart unlocked after signup",
              ].map((item) => (
                <div key={item} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 14, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Button onClick={startAudit}>
                Take the Life Audit <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Section>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        <Section
          idRef={auditRef}
          eyebrow="FREE LIFE AUDIT"
          title="See where you actually stand."
          subtitle={
            stage === "gate"
              ? "Your answers are saved on this device. Subscribe below and Beehiiv will redirect you back here to unlock your results automatically."
              : stage === "results"
                ? "Your results are unlocked. Focus on strengthening the weakest pillars first."
                : "Answer honestly across all 7 pillars. Your answers stay saved on this device until you reset the audit."
          }
        >
          {stage === "intro" ? (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 20 }}>
              <div style={{ marginBottom: 16, fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
                You’ll answer 14 quick questions. At the end, your email unlocks your personalised radar chart.
              </div>
              <Button onClick={startAudit}>
                Start audit <ArrowRight size={16} />
              </Button>
            </div>
          ) : null}

          {stage === "audit" ? (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 20 }}>
              <ProgressBar current={answeredCount} total={totalQuestions} />

              <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${currentQuestionSet.hex}18`,
                    border: `1px solid ${currentQuestionSet.hex}33`,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {(() => { const CurrentIcon = currentQuestionSet.Icon; return <CurrentIcon size={18} color={currentQuestionSet.hex} />; })()}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: MUTED }}>
                    Pillar {currentPillar + 1} of {PILLARS.length}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{currentQuestionSet.fullName}</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
                {currentQuestionSet.questions.map((question, questionIndex) => {
                  const globalQuestion = currentQuestionNumber + questionIndex + 1;
                  const selectedValue = currentAnswers[questionIndex];
                  return (
                    <div key={question.q} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 14, border: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Question {globalQuestion}</div>
                      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.45, marginBottom: 12 }}>{question.q}</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {question.labels.map((label, labelIndex) => {
                          const value = labelIndex + 1;
                          const selected = selectedValue === value;
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => selectAnswer(currentQuestionSet.key, questionIndex, value)}
                              style={{
                                textAlign: "left",
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: selected ? `1px solid ${currentQuestionSet.hex}` : `1px solid ${BORDER}`,
                                background: selected ? `${currentQuestionSet.hex}14` : "rgba(255,255,255,0.015)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: 999,
                                  border: selected ? `6px solid ${currentQuestionSet.hex}` : `1px solid rgba(255,255,255,0.22)`,
                                  background: selected ? "transparent" : "transparent",
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <Button kind="secondary" onClick={prevStep}>
                    Back
                  </Button>
                </div>
                <div style={{ flex: 2, minWidth: 160 }}>
                  <Button onClick={nextStep} disabled={!canAdvance}>
                    {currentPillar === PILLARS.length - 1 ? "Finish audit" : "Next pillar"} <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {stage === "gate" ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  background: "rgba(212,168,75,0.08)",
                  border: `1px solid rgba(212,168,75,0.16)`,
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <CheckCircle2 size={18} color={GOLD} />
                  <div style={{ fontWeight: 800 }}>Audit complete</div>
                </div>
                <div style={{ color: "#c7c7c7", lineHeight: 1.7, fontSize: 14 }}>
                  Your answers are saved on this device. Enter your email below to subscribe and unlock your radar chart instantly.
                </div>
              </div>

              <EmailCapture onSuccess={unlockResults} />

              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Optional Beehiiv redirect (backup)</div>
                <code
                  style={{
                    display: "block",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: 12,
                    color: GOLD,
                    lineHeight: 1.6,
                  }}
                >
                  {"https://yourdomain.com/?misogi_subscribed=1"}
                </code>
                <div style={{ marginTop: 10, color: MUTED, lineHeight: 1.7, fontSize: 13 }}>
                  If you ever switch back to a Beehiiv-hosted form, set its success action to redirect to the URL above to unlock results. With the API flow, unlocking happens instantly after a successful subscription.
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Button kind="secondary" onClick={() => setStage("audit")}>
                    Edit answers
                  </Button>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Button kind="secondary" onClick={resetAudit}>
                    Reset audit
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {stage === "results" ? (
            <div style={{ display: "grid", gap: 18 }}>
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(212,168,75,0.12), rgba(255,255,255,0.02))",
                  border: `1px solid rgba(212,168,75,0.18)`,
                  borderRadius: 22,
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Crown size={18} color={GOLD} />
                  <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Results unlocked</div>
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em" }}>{overallScore.toFixed(1)}</div>
                <div style={{ color: MUTED, fontSize: 14 }}>Overall life alignment score</div>
                <RadarChart scores={scores} />
              </div>

              <ScoreCards scores={scores} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Strongest pillars</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {strongest.map((pillar) => (
                      <div key={pillar.key} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ color: pillar.hex, fontWeight: 700 }}>{pillar.name}</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{pillar.score.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Needs attention</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {weakest.map((pillar) => (
                      <div key={pillar.key} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ color: pillar.hex, fontWeight: 700 }}>{pillar.name}</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{pillar.score.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Button kind="secondary" onClick={resetAudit}>
                    <RotateCcw size={16} /> Retake audit
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </Section>
      </div>
    </div>
  );
}

export default App;
