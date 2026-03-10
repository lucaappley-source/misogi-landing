import { useState, useEffect, useRef } from "react";
import { Briefcase, Wallet, Activity, Users, Heart, BookOpen, Palette, ArrowRight, Check, Copy, Crown, Star, Shield, Zap, Target, Layers, Mountain, PenLine, TrendingUp, Globe, Rocket, Dumbbell } from "lucide-react";

const PILLARS = [
  { key:"business",name:"Business",fullName:"Business & Career",hex:"#6B8CAE",Icon:Briefcase,questions:[{q:"How fulfilled are you in your current career?",labels:["Miserable","Unfulfilled","Okay","Good","Thriving"]},{q:"How much progress are you making toward your professional goals?",labels:["None","Very little","Some","Solid","Rapid"]}]},
  { key:"finances",name:"Finances",fullName:"Finances",hex:"#7A9E8C",Icon:Wallet,questions:[{q:"How in control of your finances do you feel?",labels:["Drowning","Stressed","Coping","Comfortable","Free"]},{q:"How consistently are you building wealth or reducing debt?",labels:["Not at all","Rarely","Sometimes","Often","Always"]}]},
  { key:"health",name:"Health",fullName:"Health & Fitness",hex:"#B07A7A",Icon:Activity,questions:[{q:"How consistent is your exercise routine?",labels:["Nonexistent","Sporadic","Okay","Regular","Daily"]},{q:"How would you rate your daily energy levels?",labels:["Exhausted","Low","Average","Good","Electric"]}]},
  { key:"family",name:"Family",fullName:"Family & Friends",hex:"#8B85AA",Icon:Users,questions:[{q:"How strong are your closest relationships?",labels:["Isolated","Distant","Okay","Close","Unbreakable"]},{q:"How often do you invest quality time in people you love?",labels:["Never","Rarely","Monthly","Weekly","Daily"]}]},
  { key:"romance",name:"Romance",fullName:"Romance & Love",hex:"#A0788E",Icon:Heart,questions:[{q:"How satisfied are you with your romantic life?",labels:["Empty","Lonely","Okay","Happy","Deeply fulfilled"]},{q:"How present and intentional are you in this area?",labels:["Avoidant","Passive","Thinking about it","Working on it","Fully committed"]}]},
  { key:"growth",name:"Growth",fullName:"Personal Growth",hex:"#A09570",Icon:BookOpen,questions:[{q:"How actively are you learning and developing yourself?",labels:["Stagnant","Rarely","Sometimes","Often","Constantly"]},{q:"How connected do you feel to your purpose?",labels:["Lost","Searching","Glimpses","Clear","On fire"]}]},
  { key:"fun",name:"Fun",fullName:"Fun & Creation",hex:"#A0845A",Icon:Palette,questions:[{q:"How much joy and play is in your life right now?",labels:["None","Very little","Some","Good amount","Overflowing"]},{q:"How often do you make time for hobbies or creative pursuits?",labels:["Never","Rarely","Monthly","Weekly","Daily"]}]},
];

const TIERS = [{label:"Founding 100",count:100,active:true,icon:Crown},{label:"First 1,000",count:1000,active:false,icon:Star},{label:"10,000",count:10000,active:false,icon:Shield},{label:"100,000",count:100000,active:false,icon:null}];

const MISOGI_EXAMPLES = [
  { title: "Run a marathon", Icon: Dumbbell },
  { title: "Build a \u00a3100,000 investment portfolio", Icon: TrendingUp },
  { title: "Climb Kilimanjaro", Icon: Mountain },
  { title: "Launch a company", Icon: Rocket },
  { title: "Write a book", Icon: PenLine },
  { title: "Become fluent in Spanish", Icon: Globe },
];

function BreathingRadar({ size=280 }) {
  const [offsets,setOffsets]=useState([0,0,0,0,0,0,0]);
  const scores=[8.2,7.5,6.8,7.0,8.5,7.2,9.0];
  useEffect(()=>{const sp=[0.7,1.1,0.5,0.9,1.3,0.6,1.0],ph=[0,1.8,3.6,0.9,2.7,4.5,1.4],am=[1.2,0.9,1.4,1.0,1.1,1.3,0.8];let raf;const tick=(ts)=>{const t=ts/1000;setOffsets(sp.map((s,i)=>Math.sin(t*s+ph[i])*am[i]));raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[]);
  const cx=size/2,cy=size/2,r=size*0.28,n=7;const live=scores.map((s,i)=>Math.max(1,Math.min(10,s+offsets[i])));
  const pt=(i,v)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=(v/10)*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
  const rpt=(i,s)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=s*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
  const dp=live.map((s,i)=>pt(i,s));const path=dp.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z";
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible"}}><defs><radialGradient id="rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#D4A84B" stopOpacity="0.06"/><stop offset="100%" stopColor="#D4A84B" stopOpacity="0"/></radialGradient></defs><circle cx={cx} cy={cy} r={r*1.2} fill="url(#rg)"/>{[0.25,0.5,0.75,1].map((ring,ri)=>{const pts=Array.from({length:n},(_,j)=>rpt(j,ring));return <path key={ri} d={pts.map((p,j)=>`${j?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z"} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75"/>;})}{Array.from({length:n},(_,i)=>{const[x,y]=rpt(i,1);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>;})}<path d={path} fill="rgba(212,168,75,0.08)" stroke="rgba(212,168,75,0.5)" strokeWidth="1.5" strokeLinejoin="round"/>{dp.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#D4A84B" opacity={0.7}/>)}{PILLARS.map((pl,i)=>{const[x,y]=rpt(i,1.5);const Icon=pl.Icon;return(<foreignObject key={i} x={x-24} y={y-18} width={48} height={36} style={{overflow:"visible"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><Icon size={12} color={pl.hex} strokeWidth={1.8} style={{opacity:0.6}}/><span style={{fontSize:8,fontWeight:600,color:"rgba(255,255,255,0.3)",fontFamily:"'Outfit',sans-serif",textAlign:"center",lineHeight:1}}>{pl.name}</span></div></foreignObject>);})}</svg>);
}

function MiniRadar({scores,size=140,color="#D4A84B"}){const cx=size/2,cy=size/2,r=size*0.38,n=7;const pt=(i,v)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=(v/10)*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};const rpt=(i,s)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=s*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};const dp=scores.map((s,i)=>pt(i,s));const path=dp.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z";return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{[0.5,1].map((ring,ri)=>{const pts=Array.from({length:n},(_,j)=>rpt(j,ring));return <path key={ri} d={pts.map((p,j)=>`${j?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z"} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>;})}<path d={path} fill={`${color}15`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity={0.7}/>{dp.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={2} fill={color} opacity={0.7}/>)}</svg>);}

function BeehiivEmbed(){const ref=useRef(null);useEffect(()=>{if(!ref.current)return;const s=document.createElement("script");s.src="https://subscribe-forms.beehiiv.com/embed.js";s.async=true;ref.current.appendChild(s);return()=>{if(ref.current&&ref.current.contains(s))ref.current.removeChild(s);};},[]);return(<div ref={ref} style={{marginTop:12}}><iframe src="https://subscribe-forms.beehiiv.com/175f2ea4-025f-4c91-9942-fe81f12efcfb" className="beehiiv-embed" data-test-id="beehiiv-embed" frameBorder="0" scrolling="no" style={{width:"100%",maxWidth:560,height:315,margin:0,borderRadius:0,backgroundColor:"transparent",boxShadow:"none"}}/></div>);}

function EmailCapture({variant,onSubmit,submitted}){const[email,setEmail]=useState("");const[submitting,setSubmitting]=useState(false);const[error,setError]=useState(false);const[showFallback,setShowFallback]=useState(false);const valid=email.includes("@")&&email.includes(".");const showSuccess=submitted&&(variant==="hero"||variant==="final");const handle=async()=>{if(!valid||submitting)return;setSubmitting(true);setError("");try{await onSubmit(email.trim());}catch(e){const msg=e instanceof Error?e.message:"Something went wrong. Please try again.";setError(msg);if(variant!=="gate")setShowFallback(true);}finally{setSubmitting(false);}};if(showSuccess)return(<div style={{textAlign:"center",padding:"20px 0"}}><div style={{width:48,height:48,borderRadius:14,background:"rgba(212,168,75,0.12)",border:"1px solid rgba(212,168,75,0.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Check size={24} color="#D4A84B" strokeWidth={2}/></div><div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:4}}>You're in.</div><div style={{fontSize:13,color:"#444"}}>We'll email you when the Misogi app opens.</div></div>);if(showFallback)return(<div><div style={{fontSize:13,color:"#999",marginBottom:4,lineHeight:1.5}}>Having trouble? Subscribe directly below:</div><BeehiivEmbed/></div>);const ctaLabel=submitting?"Submitting...":"Join the Founding Challengers";const defaultLabel=submitting?"Submitting...":"Join Waitlist";return(<div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="your@email.com" style={{flex:1,minWidth:0,padding:"14px 16px",background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",fontSize:15,color:"#fff",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box"}}/><div role="button" onClick={handle} style={{padding:"14px 24px",borderRadius:12,fontSize:14,fontWeight:700,cursor:valid&&!submitting?"pointer":"default",whiteSpace:"nowrap",background:valid&&!submitting?"#D4A84B":"#111",color:valid&&!submitting?"#000":"#333",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",opacity:submitting?0.7:1}}>{variant==="gate"?defaultLabel:ctaLabel} <ArrowRight size={16} strokeWidth={2.5}/></div></div>{error&&<div style={{fontSize:12,color:"#ffb4b4",marginTop:8,lineHeight:1.4}}>{error}</div>}{(variant==="hero"||variant==="final")&&<div style={{fontSize:11,color:"#444",marginTop:8,textAlign:"center",lineHeight:1.5}}><div>Early access opening soon</div><div style={{opacity:0.9}}>Limited founding members</div></div>}</div>);}

function QuestionScreen({pillar,pillarIdx,answers,setAnswers,onNext,onBack,total}){const[show,setShow]=useState(false);useEffect(()=>{setShow(false);const t=setTimeout(()=>setShow(true),50);return()=>clearTimeout(t);},[pillarIdx]);const Icon=pillar.Icon;const current=answers[pillarIdx]||pillar.questions.map(()=>0);const setRating=(qi,val)=>{const u=[...current];u[qi]=val;const n=[...answers];n[pillarIdx]=u;setAnswers(n);};const allAnswered=current.every(v=>v>0);return(<div style={{opacity:show?1:0,transition:"opacity 0.4s",display:"flex",flexDirection:"column",gap:24}}><div style={{display:"flex",gap:4}}>{Array.from({length:total},(_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<pillarIdx?"#D4A84B":i===pillarIdx?"rgba(212,168,75,0.4)":"rgba(255,255,255,0.04)"}}/>))}</div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:48,height:48,borderRadius:13,background:`${pillar.hex}15`,border:`1px solid ${pillar.hex}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={22} color={pillar.hex} strokeWidth={1.8}/></div><div><div style={{fontSize:10,fontWeight:700,color:"#333",letterSpacing:"0.1em"}}>PILLAR {pillarIdx+1} OF {total}</div><div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{pillar.fullName}</div></div></div><div style={{display:"flex",flexDirection:"column",gap:20}}>{pillar.questions.map((q,qi)=>(<div key={qi}><div style={{fontSize:15,fontWeight:500,color:"#ccc",lineHeight:1.5,marginBottom:14}}>{q.q}</div><div style={{display:"flex",gap:6}}>{[1,2,3,4,5].map(val=>{const sel=current[qi]===val;return(<div key={val} onClick={()=>setRating(qi,val)} style={{flex:1,padding:"12px 4px",borderRadius:10,cursor:"pointer",background:sel?`${pillar.hex}20`:"rgba(255,255,255,0.025)",border:sel?`1.5px solid ${pillar.hex}50`:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.15s"}}><div style={{fontSize:18,fontWeight:800,color:sel?pillar.hex:"#333",fontFamily:"'JetBrains Mono',monospace"}}>{val}</div><div style={{fontSize:8,color:sel?pillar.hex:"#2A2A2A",textAlign:"center",lineHeight:1.2,fontWeight:500,minHeight:18}}>{q.labels[val-1]}</div></div>);})}</div></div>))}</div><div style={{display:"flex",gap:8}}>{pillarIdx>0&&<div role="button" onClick={onBack} style={{padding:"14px 20px",borderRadius:12,fontSize:14,fontWeight:600,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:"#555",cursor:"pointer"}}>Back</div>}<div role="button" onClick={allAnswered?onNext:undefined} style={{flex:1,padding:"14px 0",borderRadius:12,fontSize:15,fontWeight:700,textAlign:"center",cursor:allAnswered?"pointer":"default",background:allAnswered?"#D4A84B":"#151515",color:allAnswered?"#000":"#333",transition:"all 0.2s"}}>{pillarIdx===total-1?"See My Results":"Next"}</div></div></div>);}

function AuditRadar({scores,size=260}){const[progress,setProgress]=useState(0);useEffect(()=>{let start=null,raf;const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;function step(ts){if(!start)start=ts;const p=Math.min((ts-start)/1400,1);setProgress(ease(p));if(p<1)raf=requestAnimationFrame(step);}const timer=setTimeout(()=>{raf=requestAnimationFrame(step);},300);return()=>{clearTimeout(timer);if(raf)cancelAnimationFrame(raf);};},[]);const cx=size/2,cy=size/2,r=size*0.30,n=7;const pt=(i,v)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=(v/10)*r*progress;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};const rpt=(i,s)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const d=s*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};const dp=scores.map((s,i)=>pt(i,s));const path=dp.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z";return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible"}}>{[0.25,0.5,0.75,1].map((ring,ri)=>{const pts=Array.from({length:n},(_,j)=>rpt(j,ring));return <path key={ri} d={pts.map((p,j)=>`${j?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+"Z"} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75"/>;})}<path d={path} fill="rgba(212,168,75,0.1)" stroke="#D4A84B" strokeWidth="1.5" strokeLinejoin="round" opacity={progress}/>{dp.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#D4A84B" opacity={progress}/>)}{PILLARS.map((pl,i)=>{const[x,y]=rpt(i,1.45);const Icon=pl.Icon;return(<foreignObject key={i} x={x-22} y={y-16} width={44} height={32} style={{overflow:"visible"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><Icon size={11} color={pl.hex} strokeWidth={1.8} style={{opacity:0.4+progress*0.4}}/><span style={{fontSize:7.5,fontWeight:600,color:`rgba(255,255,255,${0.15+progress*0.3})`,fontFamily:"'Outfit',sans-serif",textAlign:"center",lineHeight:1}}>{pl.name}</span></div></foreignObject>);})}</svg>);}

function ResultsScreen({scores,onSubmit,submitted}){const[phase,setPhase]=useState(0);const[copied,setCopied]=useState(false);useEffect(()=>{const t1=setTimeout(()=>setPhase(1),200);const t2=setTimeout(()=>setPhase(2),1200);const t3=setTimeout(()=>setPhase(3),2000);return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};},[]);const avg=(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);const sorted=scores.map((s,i)=>({score:s,pillar:PILLARS[i]})).sort((a,b)=>b.score-a.score);const strongest=sorted[0];const weakest=sorted[sorted.length-1];const gap=(strongest.score-weakest.score).toFixed(1);const getInsight=()=>{if(parseFloat(avg)>=8)return"You're operating at a high level. The question isn't what to fix — it's what to take from great to elite.";if(parseFloat(avg)<=4)return"You're in a rebuilding phase. The worst thing you can do is try to fix everything. Pick 3 and go deep.";if(parseFloat(gap)>=5)return`There's a ${gap}-point gap between your strongest and weakest pillar. You're overinvesting in ${strongest.pillar.name} at the cost of ${weakest.pillar.name}.`;return`${weakest.pillar.name} is holding you back. Focusing there could have the biggest impact on your overall life quality.`;};return(<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0 8px",opacity:phase>=1?1:0,transition:"opacity 0.8s"}}><AuditRadar scores={scores} size={260}/></div><div style={{textAlign:"center",opacity:phase>=2?1:0,transition:"opacity 0.6s"}}><div style={{fontSize:10,fontWeight:700,color:"#2A2A2A",letterSpacing:"0.15em",marginBottom:4}}>YOUR LIFE SCORE</div><div style={{fontSize:56,fontWeight:800,color:"#D4A84B",letterSpacing:"-0.04em",lineHeight:1,fontFamily:"'JetBrains Mono',monospace"}}>{avg}</div><div style={{fontSize:14,color:"#333",marginTop:2}}>/10</div></div><div style={{opacity:phase>=3?1:0,transition:"opacity 0.6s",marginTop:20}}><div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:16}}>{sorted.map(({score,pillar})=>{const Icon=pillar.Icon;return(<div key={pillar.key} style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:26,height:26,borderRadius:7,background:`${pillar.hex}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={12} color={pillar.hex} strokeWidth={1.8}/></div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600,color:"#888"}}>{pillar.name}</span><span style={{fontSize:11,fontWeight:700,color:pillar.hex,fontFamily:"'JetBrains Mono',monospace"}}>{score.toFixed(1)}</span></div><div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.04)"}}><div style={{height:3,borderRadius:2,background:pillar.hex,width:`${score*10}%`,opacity:0.5}}/></div></div></div>);})}</div><div style={{padding:"16px 18px",background:"rgba(212,168,75,0.04)",border:"1px solid rgba(212,168,75,0.1)",borderRadius:12,marginBottom:20}}><div style={{fontSize:9,fontWeight:700,color:"#D4A84B",letterSpacing:"0.1em",marginBottom:4}}>YOUR INSIGHT</div><div style={{fontSize:13,color:"#999",lineHeight:1.6}}>{getInsight()}</div></div><div style={{padding:"20px 18px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,marginBottom:14}}><div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>Ready to change your score?</div><div style={{fontSize:12,color:"#444",lineHeight:1.6,marginBottom:14}}>Join the Founding Challengers and start your Misogi.</div><EmailCapture variant="results" onSubmit={onSubmit} submitted={submitted}/></div><div onClick={()=>{navigator.clipboard?.writeText(`My Misogi Life Score: ${avg}/10\n\n${sorted.map(s=>`${s.pillar.name}: ${s.score.toFixed(1)}`).join('\n')}\n\nTake yours →`);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{padding:"11px 0",borderRadius:10,fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",color:"#666",textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{copied?<><Check size={13} color="#D4A84B" strokeWidth={2}/> Copied!</>:<><Copy size={13} color="#666" strokeWidth={1.8}/> Share Results</>}</div></div></div>);}

/* ─── Section Divider ─── */
function SectionDivider() {
  return <div style={{height:1,background:"rgba(255,255,255,0.03)",margin:"0"}} />;
}

/* ─── Red Dot (Japan symbol) ─── */
function RedDot({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 40% 40%, #E84040, #B02020)",
      boxShadow: "0 0 30px rgba(232,64,64,0.2), 0 0 60px rgba(232,64,64,0.08)",
      flexShrink: 0,
    }} />
  );
}

export default function MisogiFoundingPage(){
  const[submitted,setSubmitted]=useState(false);
  const[auditStarted,setAuditStarted]=useState(false);
  const[currentPillar,setCurrentPillar]=useState(0);
  const[answers,setAnswers]=useState(PILLARS.map(p=>p.questions.map(()=>0)));
  const[showResults,setShowResults]=useState(false);
  const[emailGated,setEmailGated]=useState(false);
  const[heroShow,setHeroShow]=useState(false);
  const auditRef=useRef(null);
  useEffect(()=>{setTimeout(()=>setHeroShow(true),100);},[]);
  const scores=answers.map(a=>{const avg=a.reduce((x,y)=>x+y,0)/a.length;return Math.round(avg*20)/10;});

  const subscribe=async(email)=>{
    const res=await fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data?.error||"Subscription failed. Please try again.");
    setSubmitted(true);
  };

  const startAudit=()=>{
    setAuditStarted(true);
    setTimeout(()=>auditRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50);
  };

return(
<div style={{minHeight:"100vh",background:"#030303",fontFamily:"'Outfit',sans-serif",color:"#fff"}}>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}.fade-up{animation:fadeUp 0.8s ease-out forwards;opacity:0;}`}</style>
<div style={{maxWidth:560,margin:"0 auto",padding:"0 24px"}}>

{/* ═══ NAV ═══ */}
<div style={{display:"flex",alignItems:"center",padding:"32px 0 0"}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <span style={{fontSize:18,fontWeight:800,letterSpacing:"-0.04em"}}>MISOGI</span>
    <span style={{fontSize:10,color:"#D4A84B",fontWeight:600,opacity:0.4}}>禊</span>
  </div>
</div>

{/* ═══ TASK 1: HERO ═══ */}
<div style={{padding:"48px 0 32px",opacity:heroShow?1:0,transition:"opacity 0.8s"}}>
  <div style={{textAlign:"center",marginBottom:28}}>
    <div className="fade-up" style={{animationDelay:"0.2s"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",background:"rgba(212,168,75,0.08)",border:"1px solid rgba(212,168,75,0.15)",borderRadius:20,marginBottom:16}}>
        <Crown size={12} color="#D4A84B" strokeWidth={2}/>
        <span style={{fontSize:11,fontWeight:700,color:"#D4A84B",letterSpacing:"0.08em"}}>FOUNDING CHALLENGERS</span>
      </div>
    </div>
    <h1 className="fade-up" style={{fontSize:42,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.12,margin:"0 0 18px",animationDelay:"0.4s"}}>
      Do one thing this year<br/>that changes your life.
    </h1>
    <p className="fade-up" style={{fontSize:16,color:"#888",lineHeight:1.7,margin:"0 auto 12px",maxWidth:440,animationDelay:"0.6s"}}>
      A Misogi is a challenge so difficult it forces you to become someone new.
    </p>
    <p className="fade-up" style={{fontSize:14,color:"#555",lineHeight:1.7,margin:"0 auto 0",maxWidth:440,animationDelay:"0.75s"}}>
      The Misogi app helps you choose your challenge, commit to it, and complete it within 365 days.
    </p>
  </div>
  <div className="fade-up" style={{animationDelay:"0.9s"}}>
    <EmailCapture variant="hero" onSubmit={subscribe} submitted={submitted}/>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 2: PROBLEM SECTION ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 28px",maxWidth:440}}>
    Most people never do the thing that could change their life.
  </h2>
  <div style={{fontSize:16,color:"#888",lineHeight:1.9,marginBottom:24}}>
    People dream about doing something big.
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:28,paddingLeft:2}}>
    {["Running an ultra marathon.","Climbing a mountain.","Starting a company.","Writing a book."].map((line,i) => (
      <div key={i} style={{fontSize:15,color:"#666",lineHeight:1.6,paddingLeft:16,borderLeft:"2px solid rgba(212,168,75,0.15)"}}>
        {line}
      </div>
    ))}
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:0}}>
    <div style={{fontSize:16,color:"#888",lineHeight:1.8}}>But comfort wins.</div>
    <div style={{fontSize:16,color:"#666",lineHeight:1.8}}>Years pass.</div>
    <div style={{fontSize:16,color:"#555",lineHeight:1.8}}>Nothing changes.</div>
    <div style={{fontSize:18,fontWeight:700,color:"#D4A84B",lineHeight:1.8,marginTop:8}}>
      Misogi exists to break that cycle.
    </div>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 3: MISOGI PHILOSOPHY ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
    <RedDot size={40} />
    <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:0}}>
      What is a Misogi?
    </h2>
  </div>

  <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
    <div style={{fontSize:16,color:"#888",lineHeight:1.8}}>
      In Japanese tradition, a Misogi is a challenge so difficult that success isn't guaranteed.
    </div>
    <div style={{fontSize:16,color:"#777",lineHeight:1.8}}>
      It pushes you beyond comfort.
    </div>
    <div style={{fontSize:16,color:"#777",lineHeight:1.8}}>
      Beyond excuses.
    </div>
    <div style={{fontSize:16,color:"#777",lineHeight:1.8}}>
      Beyond who you currently are.
    </div>
    <div style={{fontSize:16,color:"#999",lineHeight:1.8,marginTop:4}}>
      If you succeed, you don't just complete a challenge.
    </div>
    <div style={{fontSize:16,color:"#ccc",fontWeight:600,lineHeight:1.8}}>
      You become someone else.
    </div>
  </div>

  {/* Quote block */}
  <div style={{
    padding:"24px 28px",
    background:"rgba(232,64,64,0.04)",
    border:"1px solid rgba(232,64,64,0.12)",
    borderLeft:"3px solid rgba(232,64,64,0.4)",
    borderRadius:12,
  }}>
    <div style={{fontSize:20,fontWeight:700,color:"#fff",lineHeight:1.7,letterSpacing:"-0.01em"}}>
      One challenge.<br/>
      One year.<br/>
      A new identity.
    </div>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 4: TRANSFORMATION EXAMPLES ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 24px"}}>
    What could your Misogi be?
  </h2>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
    {MISOGI_EXAMPLES.map((ex,i) => {
      const Icon = ex.Icon;
      return (
        <div key={i} style={{
          display:"flex",alignItems:"center",gap:10,
          padding:"14px 16px",
          background:"rgba(255,255,255,0.02)",
          border:"1px solid rgba(255,255,255,0.05)",
          borderRadius:12,
        }}>
          <div style={{
            width:32,height:32,borderRadius:9,flexShrink:0,
            background:"rgba(212,168,75,0.08)",
            border:"1px solid rgba(212,168,75,0.12)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <Icon size={15} color="#D4A84B" strokeWidth={1.8}/>
          </div>
          <span style={{fontSize:13,fontWeight:600,color:"#ccc",lineHeight:1.3}}>{ex.title}</span>
        </div>
      );
    })}
  </div>
  <div style={{fontSize:14,color:"#555",lineHeight:1.7,fontStyle:"italic"}}>
    A Misogi should feel almost impossible when you start.<br/>
    <span style={{color:"#888",fontWeight:600,fontStyle:"normal"}}>That is the point.</span>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 5: HOW MISOGI WORKS ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <div style={{fontSize:10,fontWeight:700,color:"#2A2A2A",letterSpacing:"0.15em",marginBottom:8}}>THE PROCESS</div>
  <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 28px"}}>
    How Misogi works
  </h2>
  <div style={{display:"flex",flexDirection:"column",gap:0}}>
    {[
      {step:"1",title:"Choose your Misogi",desc:"Define the challenge that will shape your year."},
      {step:"2",title:"Commit publicly",desc:"Declare your challenge and join the community."},
      {step:"3",title:"Train and prepare",desc:"Track progress and stay accountable."},
      {step:"4",title:"Complete it within 365 days",desc:"Success isn't guaranteed. But transformation is."},
    ].map((s,i) => (
      <div key={i} style={{
        display:"flex",gap:16,padding:"20px 0",
        borderBottom:i<3?"1px solid rgba(255,255,255,0.03)":"none",
      }}>
        <div style={{
          width:36,height:36,borderRadius:10,flexShrink:0,
          background:i===3?"rgba(212,168,75,0.12)":"rgba(255,255,255,0.03)",
          border:i===3?"1px solid rgba(212,168,75,0.25)":"1px solid rgba(255,255,255,0.05)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:15,fontWeight:800,
          color:i===3?"#D4A84B":"#555",
          fontFamily:"'JetBrains Mono',monospace",
        }}>{s.step}</div>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>{s.title}</div>
          <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>{s.desc}</div>
        </div>
      </div>
    ))}
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 6: RADAR SYSTEM EXPLANATION ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <div style={{fontSize:10,fontWeight:700,color:"#2A2A2A",letterSpacing:"0.15em",marginBottom:8}}>THE PRODUCT</div>
  <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 24px"}}>
    Focus on what matters most.
  </h2>

  <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      Most productivity apps try to help people do more.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      Misogi does the opposite.
    </div>
    <div style={{fontSize:15,color:"#999",lineHeight:1.8,fontWeight:500}}>
      It helps you focus on what matters most right now.
    </div>
  </div>

  <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
    <BreathingRadar size={240}/>
  </div>

  <div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      The Misogi radar visualises the key pillars of your life.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      You can only actively push forward <span style={{color:"#D4A84B",fontWeight:700}}>three goals</span> at a time.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      This forces focus and intentional sacrifice.
    </div>
    <div style={{fontSize:15,color:"#999",lineHeight:1.8}}>
      At the same time, the radar ensures you never lose sight of the bigger picture.
    </div>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 8: FOUNDER STORY ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 24px"}}>
    Why we built Misogi
  </h2>
  <div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      Most productivity tools optimise small habits.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      But life is changed by big decisions.
    </div>
    <div style={{fontSize:15,color:"#999",lineHeight:1.8,fontWeight:500}}>
      Misogi was created around a simple idea.
    </div>
    <div style={{fontSize:16,color:"#ccc",lineHeight:1.8,fontWeight:600,fontStyle:"italic",padding:"16px 20px",background:"rgba(255,255,255,0.02)",borderRadius:12,border:"1px solid rgba(255,255,255,0.04)"}}>
      What if everyone committed to one challenge each year that truly scared them?
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      A challenge big enough that completing it would redefine who they are.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      The Misogi app exists to help people commit to that challenge and see it through.
    </div>
  </div>
</div>

<SectionDivider/>

{/* ═══ TASK 9: COMMUNITY / SOCIAL PROOF ═══ */}
<div style={{padding:"48px 0 40px"}}>
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
    <Crown size={20} color="#D4A84B" strokeWidth={1.8}/>
    <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:0}}>
      Join the founding challengers.
    </h2>
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      The first Misogi cohort is forming now.
    </div>
    <div style={{fontSize:15,color:"#888",lineHeight:1.8}}>
      Early members will help shape the culture of the platform and define what it means to complete a Misogi.
    </div>
  </div>
  <EmailCapture variant="community" onSubmit={subscribe} submitted={submitted}/>
</div>

<SectionDivider/>

{/* ═══ LIFE AUDIT ═══ */}
<div ref={auditRef} style={{padding:"48px 0 44px"}}>
  <div style={{fontSize:10,fontWeight:700,color:"#2A2A2A",letterSpacing:"0.15em",marginBottom:8}}>FREE LIFE AUDIT</div>
  <h2 style={{fontSize:26,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,margin:"0 0 12px"}}>
    See where you <span style={{color:"#D4A84B",fontStyle:"italic"}}>actually</span> stand.
  </h2>
  <p style={{fontSize:14,color:"#444",lineHeight:1.7,margin:"0 0 24px"}}>
    Rate yourself honestly across all 7 pillars. Get your personalised radar chart. Takes 2 minutes.
  </p>
  {!auditStarted&&<div role="button" onClick={startAudit} style={{padding:"16px 0",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",fontSize:15,fontWeight:700,color:"#fff",textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>Take the Audit <ArrowRight size={16} strokeWidth={2.5}/></div>}
  {auditStarted&&!emailGated&&!showResults&&<QuestionScreen pillar={PILLARS[currentPillar]} pillarIdx={currentPillar} answers={answers} setAnswers={setAnswers} total={7} onNext={()=>{if(currentPillar===6)setEmailGated(true);else setCurrentPillar(currentPillar+1);}} onBack={()=>setCurrentPillar(Math.max(0,currentPillar-1))}/>}
  {emailGated&&!showResults&&(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,padding:"20px 0"}}>
      <div style={{width:64,height:64,borderRadius:18,background:"rgba(212,168,75,0.1)",border:"1px solid rgba(212,168,75,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={28} color="#D4A84B" strokeWidth={2}/></div>
      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:6}}>Audit complete.</div><div style={{fontSize:14,color:"#555",lineHeight:1.6,maxWidth:360}}>Your personalised radar chart is ready. Enter your email below to unlock your results and join the Founding Challengers.</div></div>
      <div style={{width:"100%",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:16,padding:"20px 16px"}}><EmailCapture variant="gate" onSubmit={async(email)=>{await subscribe(email);setShowResults(true);}} submitted={submitted}/></div>
      <div style={{fontSize:11,color:"#222",textAlign:"center"}}>Already subscribed? Use the same email again to unlock.</div>
    </div>
  )}
  {showResults&&<ResultsScreen scores={scores} onSubmit={subscribe} submitted={submitted}/>}
</div>

<SectionDivider/>

{/* ═══ TASK 10: FINAL CTA ═══ */}
<div style={{padding:"56px 0 48px",textAlign:"center"}}>
  <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,margin:"0 0 16px"}}>
    Your Misogi starts now.
  </h2>
  <div style={{fontSize:16,color:"#888",lineHeight:1.7,marginBottom:8}}>
    One challenge could change your life.
  </div>
  <div style={{fontSize:15,color:"#555",lineHeight:1.7,marginBottom:28}}>
    The only question is whether you commit.
  </div>
  <EmailCapture variant="final" onSubmit={subscribe} submitted={submitted}/>
</div>

{/* ═══ FOOTER ═══ */}
<div style={{padding:"24px 0 40px",borderTop:"1px solid rgba(255,255,255,0.03)",textAlign:"center"}}>
  <div style={{fontSize:16,fontWeight:800,letterSpacing:"-0.04em",color:"#fff",marginBottom:4}}>MISOGI</div>
  <div style={{fontSize:11,color:"#1A1A1A"}}>One challenge. One year. A new you.</div>
</div>

</div>
</div>
);}
