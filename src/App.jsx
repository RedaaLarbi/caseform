import { useState, useEffect, useRef } from "react";

const VERTICALS = {
  pi: {
    name: "Personal Injury",
    icon: "⚖️",
    color: "#f0a030",
    desc: "Car accidents, slip-and-falls, workplace injuries, medical malpractice",
    greeting: "Hi there! I'm here to help gather some information before your consultation with your attorney. This helps them prepare so your meeting is as productive as possible. Let's start — can you briefly describe what happened?",
    systemPrompt: `You are a friendly, professional legal intake assistant for a personal injury law firm. Gather through natural conversation (1-2 questions at a time):
1. What happened (the incident/accident) 2. When it happened 3. Where it happened 4. Injuries sustained (type, severity) 5. Medical treatment received so far 6. Whether they've seen other doctors 7. Insurance information 8. Whether a police report was filed 9. Any witnesses 10. Impact on daily life/work 11. What outcome they're hoping for
Be empathetic. Use simple language. No legal jargon. Keep responses concise (2-3 sentences max, then a follow-up question).
IMPORTANT: When you've gathered enough (6-10 exchanges), end with: "I think I have everything your attorney will need. They'll review all of this before your meeting so you can dive right into strategy. Is there anything else you'd like to add?"`,
    summaryPrompt: `Analyze this legal intake and return ONLY valid JSON, no markdown, no backticks:
{"client_name":"","incident_type":"","incident_date":"","incident_location":"","injuries":[],"medical_treatment":[],"insurance_status":"","police_report":"","witnesses":"","life_impact":"","client_goals":"","key_facts":[],"red_flags":[],"recommended_focus":""}`
  },
  immigration: {
    name: "Immigration Law",
    icon: "🌍",
    color: "#3b8bd4",
    desc: "Visas, green cards, citizenship, asylum, deportation defense, DACA",
    greeting: "Hello! I'm here to help gather information before your immigration consultation. This way your attorney can come prepared. To start — what type of immigration matter are you looking for help with?",
    systemPrompt: `You are a professional, empathetic immigration law intake assistant. Gather through natural conversation (1-2 questions at a time):
1. Type of immigration matter 2. Current immigration status 3. Country of origin 4. How long in the US 5. Family situation 6. Employment situation 7. Prior applications filed 8. Prior violations or deportation orders 9. Criminal history (ask sensitively) 10. Deadlines or urgency 11. Desired outcome 12. Documents available
Be warm and reassuring. Use simple language. Never give legal advice.
IMPORTANT: When enough gathered (6-10 exchanges), end with: "Thank you for sharing all of this. Your attorney will review everything before your consultation. Is there anything else you'd like them to know?"`,
    summaryPrompt: `Analyze this immigration intake and return ONLY valid JSON, no markdown, no backticks:
{"client_name":"","country_of_origin":"","current_status":"","matter_type":"","time_in_us":"","family_situation":"","employment":"","prior_applications":[],"violations_or_issues":"","criminal_history":"","deadlines":"","documents_available":[],"client_goals":"","key_facts":[],"red_flags":[],"recommended_focus":""}`
  },
  family: {
    name: "Family Law",
    icon: "👨‍👩‍👧",
    color: "#d4537e",
    desc: "Divorce, child custody, adoption, prenuptial agreements, support",
    greeting: "Hello. I'm here to help gather some background before your family law consultation. I understand these matters are personal, and everything you share will be kept confidential. What's the main family law issue you're dealing with?",
    systemPrompt: `You are a compassionate, professional family law intake assistant. Gather through natural conversation (1-2 questions at a time):
1. Type of matter (divorce, custody, adoption, prenup, support, etc.) 2. Current marital status and duration of marriage 3. Children (ages, current custody arrangement if any) 4. Property and assets (home, vehicles, joint accounts) 5. Whether separation has occurred 6. Any history of domestic violence or protective orders 7. Current employment and income of both parties 8. What they're hoping for (custody arrangement, property division, etc.) 9. Whether spouse has retained an attorney 10. Any urgent timeline issues (hearing dates, move-out deadlines) 11. Previous family court involvement
Be sensitive and non-judgmental. These are deeply personal matters. Keep responses warm but concise.
IMPORTANT: When enough gathered (6-10 exchanges), end with: "Thank you for sharing this with me. Your attorney will review everything before your meeting so you can focus on next steps. Is there anything else you'd like them to know?"`,
    summaryPrompt: `Analyze this family law intake and return ONLY valid JSON, no markdown, no backticks:
{"client_name":"","matter_type":"","marital_status":"","marriage_duration":"","children":[],"custody_situation":"","property_assets":[],"domestic_violence":"","employment_income":"","spouse_attorney":"","client_goals":"","timeline_urgency":"","key_facts":[],"red_flags":[],"recommended_focus":""}`
  },
  criminal: {
    name: "Criminal Defense",
    icon: "🛡️",
    color: "#e24b4a",
    desc: "DUI/DWI, drug charges, assault, theft, white collar, federal crimes",
    greeting: "Hello. I'm here to help gather information before your consultation with your defense attorney. Everything you share is confidential and helps your attorney prepare the strongest possible strategy. What charges are you facing, or what happened?",
    systemPrompt: `You are a professional, non-judgmental criminal defense intake assistant. Gather through natural conversation (1-2 questions at a time):
1. What charges they're facing or what happened 2. When the incident occurred 3. Where it happened (jurisdiction matters) 4. Whether they've been arrested/booked 5. Whether they've been formally charged 6. Next court date if any 7. Whether they're currently on bail/bond 8. Any statements made to police 9. Any prior criminal record 10. Whether evidence was seized or searches conducted 11. Any witnesses or co-defendants 12. Current employment and personal situation
Be completely non-judgmental. Attorney-client privilege applies. Keep responses professional and concise. Never comment on guilt or innocence.
IMPORTANT: When enough gathered (6-10 exchanges), end with: "I've got a clear picture for your attorney. They'll review everything before your meeting to prepare the best strategy. Is there anything else you'd like to add?"`,
    summaryPrompt: `Analyze this criminal defense intake and return ONLY valid JSON, no markdown, no backticks:
{"client_name":"","charges":"","incident_date":"","jurisdiction":"","arrest_status":"","formally_charged":"","next_court_date":"","bail_bond_status":"","statements_to_police":"","prior_record":"","evidence_searches":"","witnesses_codefendants":"","key_facts":[],"red_flags":[],"recommended_focus":""}`
  },
  estate: {
    name: "Estate Planning",
    icon: "📄",
    color: "#22c589",
    desc: "Wills, trusts, power of attorney, probate, asset protection",
    greeting: "Welcome! I'm here to help gather some information before your estate planning consultation. This helps your attorney understand your goals so they can recommend the right strategy. What's prompting you to look into estate planning right now?",
    systemPrompt: `You are a friendly, professional estate planning intake assistant. Gather through natural conversation (1-2 questions at a time):
1. What prompted them (new family, aging parents, business ownership, etc.) 2. Current estate planning documents (will, trust, POA, etc.) 3. Family situation (spouse, children, dependents) 4. Major assets (real estate, retirement accounts, business interests, investments) 5. Approximate estate value range if comfortable sharing 6. Specific goals (minimize taxes, protect assets, provide for minor children, charitable giving) 7. Beneficiary preferences 8. Healthcare directive wishes 9. Business succession needs if applicable 10. Any concerns about particular family members or situations 11. State of residence (affects estate tax)
Be warm and professional. Estate planning involves thinking about difficult topics. Keep it comfortable and conversational.
IMPORTANT: When enough gathered (6-10 exchanges), end with: "This is really helpful. Your attorney will review all of this before your meeting so you can focus on building the right plan. Is there anything else you'd like them to know?"`,
    summaryPrompt: `Analyze this estate planning intake and return ONLY valid JSON, no markdown, no backticks:
{"client_name":"","trigger":"","existing_documents":[],"family_situation":"","major_assets":[],"estate_value_range":"","planning_goals":[],"beneficiary_preferences":"","healthcare_directives":"","business_succession":"","special_concerns":"","key_facts":[],"red_flags":[],"recommended_focus":""}`
  }
};

const CF = "'Inter', system-ui, sans-serif";
const CM = "'JetBrains Mono', monospace";
const G  = "#22c589";

const Logo = ({s=24,c=G}) => (
  <svg width={s*5.5} height={s} viewBox="0 0 165 30" fill="none">
    <rect x="2" y="4" width="22" height="22" rx="5" stroke={c} strokeWidth="1.8" fill="none"/>
    <path d="M8 10h10M8 15h6M8 20h8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <text x="32" y="22" fill={c} fontFamily={CF} fontSize="21" fontWeight="700" letterSpacing="-0.5">Caseform</text>
  </svg>
);

function App() {
  const [view, setView]                   = useState("landing");
  const [vertical, setVertical]           = useState("pi");
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [summary, setSummary]             = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [intakeComplete, setIntakeComplete] = useState(false);
  const [mounted, setMounted]             = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [formData, setFormData]           = useState({name:"",company:"",email:"",phone:"",message:"",consent:false});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError]         = useState("");
  const chatEnd = useRef(null);

  useEffect(()=>{ setMounted(true); },[]);
  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  useEffect(()=>{
    const onScroll = ()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll", onScroll);
    return ()=>window.removeEventListener("scroll", onScroll);
  },[]);

  useEffect(()=>{
    if(view!=="landing") return;
    const obs = new IntersectionObserver(
      entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); }),
      {threshold:0.1}
    );
    const timer = setTimeout(()=>{
      document.querySelectorAll(".scroll-fade").forEach(el=>obs.observe(el));
    }, 100);
    return ()=>{ clearTimeout(timer); obs.disconnect(); };
  },[view]);

  const start = (v)=>{
    setVertical(v);
    setMessages([{role:"assistant",content:VERTICALS[v].greeting}]);
    setSummary(null);
    setIntakeComplete(false);
    setView("chat");
  };

  const submitForm = ()=>{
    if(!formData.name.trim()||!formData.company.trim()||!formData.email.trim()){
      setFormError("Please fill in all required fields.");return;
    }
    if(!formData.email.includes("@")){ setFormError("Please enter a valid email address.");return; }
    setFormError("");
    console.log("LEAD:", JSON.stringify({...formData, ts:new Date().toISOString()}));
    setFormSubmitted(true);
  };

  const send = async ()=>{
    if(!input.trim()||loading) return;
    const um={role:"user",content:input.trim()};
    const nm=[...messages,um];
    setMessages(nm); setInput(""); setLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system:VERTICALS[vertical].systemPrompt,messages:nm.map(m=>({role:m.role,content:m.content}))})
      });
      const d=await r.json();
      if(!r.ok){console.error("Anthropic error:",JSON.stringify(d));throw new Error(d.error?.message||"API error");}
      const reply=d.content?.map(b=>b.type==="text"?b.text:"").join("")||"I'm sorry, could you try again?";
      setMessages([...nm,{role:"assistant",content:reply}]);
      const lc=reply.toLowerCase();
      if(["i think i have everything","i've got a clear picture","this is really helpful","anything else you'd like to add","anything else you'd like them to know","anything else you'd like to mention"].some(p=>lc.includes(p)))
        setIntakeComplete(true);
    }catch{ setMessages([...nm,{role:"assistant",content:"Connection issue. Please try again."}]); }
    setLoading(false);
  };

  const genSummary = async ()=>{
    setSummaryLoading(true); setView("dashboard");
    const ct=messages.map(m=>`${m.role==="user"?"Client":"AI"}: ${m.content}`).join("\n\n");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-5-20251022",max_tokens:1000,messages:[{role:"user",content:`${VERTICALS[vertical].summaryPrompt}\n\nConversation:\n${ct}`}]})
      });
      const d=await r.json();
      const raw=d.content?.map(b=>b.type==="text"?b.text:"").join("")||"{}";
      setSummary(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch{ setSummary({error:"Could not generate summary."}); }
    setSummaryLoading(false);
  };

  const scrollTo = (id)=>{ document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };

  // ====================== LANDING ======================
  if(view==="landing"){
    const problems=[
      {icon:"M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",t:"Lost leads",d:"67% of prospects abandon traditional intake forms before completion. You never hear from them again."},
      {icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",t:"Wasted consultations",d:"Attorneys spend the first 20 minutes of every meeting asking basic background questions that should have been gathered upfront."},
      {icon:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438",t:"No qualification",d:"Without structured intake, there's no consistent way to evaluate case viability before it lands on an attorney's calendar."},
    ];
    const solutions=[
      {icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",t:"Conversational AI intake",d:"Not a static form. Our AI conducts a real interview, asking intelligent follow-ups based on what your client says."},
      {icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",t:"Structured case briefs",d:"Every intake produces a structured brief with key facts, red flags, and recommended focus areas — ready before you walk in."},
      {icon:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",t:"Lead qualification scoring",d:"AI scores each intake on case viability: strong, moderate, or weak. Stop spending hours on cases you'll never take."},
      {icon:"M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",t:"Multi-language support",d:"AI converses in 30+ languages natively. Critical for immigration matters and diverse urban client bases."},
    ];
    const benefits=[
      {icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",t:"5-minute intake",d:"Clients complete intake on their phone in under 5 minutes. No downloads, no accounts."},
      {icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",t:"Attorney-grade privacy",d:"All conversations are encrypted end-to-end. Designed for attorney-client confidentiality standards."},
      {icon:"M13 10V3L4 14h7v7l9-11h-7z",t:"Instant briefs",d:"Case brief lands on your dashboard before the client walks in. Key facts, red flags, strategy notes."},
      {icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",t:"No credit card to start",d:"Set up your pilot in under 10 minutes. Full access, no risk."},
      {icon:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",t:"24/7 availability",d:"Clients intake on their schedule — weekends, evenings, whenever. You sleep; Caseform works."},
      {icon:"M4 6h16M4 10h16M4 14h10",t:"CRM integration ready",d:"Briefs export to Clio, MyCase, Filevine, PracticePanther. Your data, your systems."},
    ];
    const testimonials=[
      {q:"We went from spending 20 minutes per intake call to having everything ready before the client sits down. Caseform paid for itself in the first week.",n:"Managing Partner",f:"PI firm, 4 attorneys"},
      {q:"Our immigration clients love it. They can tell their story in their own language, on their own time. We get a clean brief in English with every detail.",n:"Immigration Attorney",f:"Solo practice"},
      {q:"The lead scoring alone is worth the subscription. We stopped wasting consultation time on cases we'd never take.",n:"Intake Coordinator",f:"Multi-practice firm, 8 attorneys"},
    ];

    return (
      <div style={{minHeight:"100vh",background:"#111116",color:"#ffffff",fontFamily:CF}}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:.3}}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          .typing::after{content:'...';animation:blink 1.2s infinite}
          .scroll-fade{opacity:0;transform:translateY(28px);transition:opacity .7s ease-out,transform .7s ease-out}
          .scroll-fade.visible{opacity:1;transform:translateY(0)}
          .section{max-width:1320px;margin:0 auto;padding:0 48px}
          .btn-p{background:${G};color:#06070a;border:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:${CF};transition:all .15s;display:inline-flex;align-items:center;gap:6px}
          .btn-p:hover{opacity:.88;transform:translateY(-1px)}
          .btn-s{background:transparent;color:#ffffff;border:1px solid #2e2e3a;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;font-family:${CF};transition:all .2s;display:inline-flex;align-items:center;gap:6px}
          .btn-s:hover{border-color:#707070;background:#1a1a24}
          .card{background:#18181f;border:1px solid #25252e;border-radius:12px;padding:24px;transition:border-color .25s,transform .25s}
          .card:hover{border-color:#38384a;transform:translateY(-2px)}
          .tag{font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${G};font-family:${CM}}
          .nav-link{color:#b0b0b0;font-size:14px;font-weight:500;text-decoration:none;cursor:pointer;transition:color .2s;background:none;border:none;font-family:${CF};padding:0}
          .nav-link:hover{color:#ffffff}
          .input-field{width:100%;padding:12px 16px;border-radius:8px;border:1px solid #2e2e3a;background:#0e0e14;color:#ffffff;font-size:14px;outline:none;font-family:${CF};transition:border-color .2s}
          .input-field:focus{border-color:${G}}
          .input-field::placeholder{color:#787878}
          .faq-item{border-bottom:1px solid #25252e;padding:22px 0;cursor:pointer}
          .faq-q{display:flex;justify-content:space-between;align-items:center;font-size:15px;font-weight:500;color:#f0f0f0}
          .faq-a{font-size:14px;color:#c8c8c8;line-height:1.75;margin:14px 0 0}
          textarea.input-field{resize:vertical;min-height:100px;line-height:1.6}
        `}</style>

        {/* ── STICKY NAV ── */}
        <nav style={{
          position:"fixed",top:0,left:0,right:0,zIndex:100,
          background:scrolled?"rgba(17,17,22,0.92)":"rgba(17,17,22,0.7)",
          backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
          borderBottom:scrolled?"1px solid #25252e":"1px solid transparent",
          transition:"all .3s"
        }}>
          <div className="section" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
            <Logo/>
            {/* Desktop nav links */}
            <div style={{display:"flex",gap:32,alignItems:"center",position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
              {[["The Problem","problem"],["Our Solution","solution"],["Why Caseform","why"],["Live Demo","demo"]].map(([label,id])=>(
                <button key={id} className="nav-link" onClick={()=>scrollTo(id)}>{label}</button>
              ))}
            </div>
            {/* Right side */}
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button className="btn-p" style={{fontSize:13,padding:"9px 18px"}} onClick={()=>scrollTo("cta")}>
                Request Demo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {/* Hamburger (mobile only — shown via media query workaround with inline display) */}
              <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",background:"none",border:"none",color:"#ffffff",cursor:"pointer",padding:4}} id="hamburger-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={menuOpen?"M4 4l12 12M16 4L4 16":"M3 6h14M3 10h14M3 14h14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          {/* Mobile menu */}
          {menuOpen&&(
            <div style={{background:"#111116",borderTop:"1px solid #25252e",padding:"16px 28px 24px",display:"flex",flexDirection:"column",gap:4}}>
              {[["The Problem","problem"],["Our Solution","solution"],["Why Caseform","why"],["Live Demo","demo"]].map(([label,id])=>(
                <button key={id} onClick={()=>scrollTo(id)} style={{background:"none",border:"none",color:"#b0b0b0",fontFamily:CF,fontSize:15,padding:"12px 0",textAlign:"left",cursor:"pointer",borderBottom:"1px solid #1e1e28"}}>
                  {label}
                </button>
              ))}
              <button className="btn-p" style={{marginTop:12,justifyContent:"center"}} onClick={()=>scrollTo("cta")}>Request Demo</button>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="section" style={{paddingTop:148,paddingBottom:100,position:"relative"}}>
          {/* Radial glow */}
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 50% at 50% 85%, ${G}18 0%, transparent 70%)`,pointerEvents:"none",zIndex:0}}/>
          <div style={{position:"relative",zIndex:1,opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(20px)",transition:"all .8s cubic-bezier(.16,1,.3,1)"}}>
            {/* Badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px",background:`${G}12`,border:`1px solid ${G}35`,borderRadius:100,marginBottom:32}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:G,animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:12,color:G,fontWeight:600,fontFamily:CM,letterSpacing:.5}}>NOW ACCEPTING PILOT FIRMS</span>
            </div>

            <h1 style={{fontSize:"clamp(44px,7vw,72px)",fontWeight:800,lineHeight:1.04,marginBottom:24,letterSpacing:"-0.04em",maxWidth:720}}>
              Your AI paralegal<br/>
              <span style={{color:G}}>for client intake.</span>
            </h1>
            <p style={{fontSize:18,color:"#a8a8a8",lineHeight:1.75,marginBottom:40,maxWidth:520}}>
              Caseform interviews your clients before the consultation, gathers every detail that matters, and delivers a structured case brief to your desk. Built exclusively for law firms.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:72}}>
              <button className="btn-p" style={{padding:"13px 26px",fontSize:15}} onClick={()=>scrollTo("demo")}>
                Try the live demo
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8m0 0L8.5 4M12 8l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="btn-s" style={{padding:"13px 26px",fontSize:15}} onClick={()=>scrollTo("cta")}>Join the pilot</button>
            </div>

            {/* Product visual mockup */}
            <div style={{
              background:"#18181f",border:"1px solid #2e2e3a",borderRadius:16,padding:"28px 28px 20px",
              maxWidth:800,
              filter:`drop-shadow(0 32px 64px ${G}20)`,
              position:"relative",overflow:"hidden"
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
                {["#ff5f57","#ffbd2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                <div style={{flex:1,height:1,background:"#25252e",marginLeft:8}}/>
                <div style={{fontFamily:CM,fontSize:11,color:"#787878",letterSpacing:.5}}>CASEFORM INTAKE</div>
              </div>
              {/* Simulated vertical chips */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
                {Object.entries(VERTICALS).map(([k,v])=>(
                  <div key={k} style={{
                    display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                    background:k==="pi"?`${v.color}20`:"#0e0e14",
                    border:`1px solid ${k==="pi"?v.color:"#25252e"}`,
                    borderRadius:8,fontSize:12,color:k==="pi"?v.color:"#686868",
                    fontFamily:CF,fontWeight:500
                  }}>
                    <span style={{fontSize:13}}>{v.icon}</span>{v.name}
                  </div>
                ))}
              </div>
              {/* Simulated chat bubbles */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:26,height:26,borderRadius:6,background:"#0e0e14",border:"1px solid #25252e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="9" rx="2.5" stroke={G} strokeWidth="1.1" fill="none"/><path d="M3.5 4.5h5M3.5 6.5h3.5" stroke={G} strokeWidth="1" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{padding:"10px 14px",background:"#0e0e14",border:"1px solid #25252e",borderRadius:"10px 10px 10px 3px",fontSize:13,color:"#e0e0e0",lineHeight:1.55,maxWidth:"75%"}}>
                    Can you briefly describe what happened in the accident?
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <div style={{padding:"10px 14px",background:G,borderRadius:"10px 10px 3px 10px",fontSize:13,color:"#06070a",lineHeight:1.55,maxWidth:"70%",fontWeight:500}}>
                    I was rear-ended at a red light last Tuesday. The other driver was on their phone.
                  </div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:26,height:26,borderRadius:6,background:"#0e0e14",border:"1px solid #25252e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="9" rx="2.5" stroke={G} strokeWidth="1.1" fill="none"/><path d="M3.5 4.5h5M3.5 6.5h3.5" stroke={G} strokeWidth="1" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{padding:"10px 14px",background:"#0e0e14",border:"1px solid #25252e",borderRadius:"10px 10px 10px 3px",fontSize:13,color:"#e0e0e0",lineHeight:1.55,maxWidth:"75%"}}>
                    I'm sorry to hear that. Were you able to seek medical attention afterwards, and if so, what injuries were documented?
                  </div>
                </div>
              </div>
              <div style={{marginTop:16,padding:"10px 14px",background:"#0e0e14",border:"1px solid #25252e",borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,color:"#787878",flex:1}}>Type your response...</span>
                <div style={{padding:"5px 12px",background:G,borderRadius:6,fontSize:12,color:"#06070a",fontWeight:600}}>Send</div>
              </div>
            </div>

            {/* Metrics strip */}
            <div style={{display:"flex",gap:48,flexWrap:"wrap",marginTop:60,paddingTop:40,borderTop:"1px solid #25252e"}}>
              {[{v:"67%",l:"of leads lost to intake forms"},{v:"5 min",l:"average Caseform intake"},{v:"30%",l:"higher conversion rate"},{v:"24/7",l:"client availability"}].map((m,i)=>(
                <div key={i}>
                  <div style={{fontSize:30,fontWeight:800,color:G,letterSpacing:"-0.02em",lineHeight:1}}>{m.v}</div>
                  <div style={{fontSize:13,color:"#909090",marginTop:5}}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM ── */}
        <section id="problem" className="section scroll-fade" style={{paddingTop:100,paddingBottom:100}}>
          <div className="tag" style={{marginBottom:14}}>The Problem</div>
          <h2 style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:16,maxWidth:640}}>
            Law firms lose clients before the first meeting.
          </h2>
          <p style={{fontSize:16,color:"#c8c8c8",lineHeight:1.75,marginBottom:56,maxWidth:560}}>
            The intake process is broken. Clients abandon forms, attorneys waste consultation time, and there's no consistent way to qualify leads before they walk in.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            {problems.map((p,i)=>(
              <div key={i} className="card">
                <div style={{width:40,height:40,borderRadius:10,background:`${G}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={p.icon} stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:8,color:"#f8f8f8"}}>{p.t}</div>
                <div style={{fontSize:14,color:"#c8c8c8",lineHeight:1.7}}>{p.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OUR SOLUTION ── */}
        <section id="solution" style={{background:"#0d0d12",paddingTop:100,paddingBottom:100}}>
          <div className="section scroll-fade">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
              {/* Left: copy */}
              <div>
                <div className="tag" style={{marginBottom:14}}>Our Solution</div>
                <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:20,lineHeight:1.15}}>
                  Everything your intake process is missing.
                </h2>
                <p style={{fontSize:15,color:"#c8c8c8",lineHeight:1.8,marginBottom:36}}>
                  Caseform replaces clipboards, intake forms, and awkward first meetings with a conversational AI that knows exactly what to ask — for every practice area.
                </p>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <button className="btn-p" onClick={()=>scrollTo("demo")}>
                    Try live demo
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-s" onClick={()=>scrollTo("cta")}>Request a demo</button>
                </div>
              </div>
              {/* Right: feature cards */}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {solutions.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start",padding:"18px 20px",background:"#18181f",border:"1px solid #25252e",borderRadius:12,transition:"border-color .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#38384a"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#25252e"}>
                    <div style={{width:36,height:36,borderRadius:8,background:`${G}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={s.icon} stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <div style={{fontSize:15,fontWeight:600,marginBottom:4,color:"#f8f8f8"}}>{s.t}</div>
                      <div style={{fontSize:13,color:"#c8c8c8",lineHeight:1.65}}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CASEFORM ── */}
        <section id="why" className="section scroll-fade" style={{paddingTop:100,paddingBottom:80}}>
          <div className="tag" style={{marginBottom:14}}>Why Caseform</div>
          <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:16,maxWidth:600}}>
            Built for how attorneys actually work.
          </h2>
          <p style={{fontSize:15,color:"#c8c8c8",lineHeight:1.8,marginBottom:56,maxWidth:520}}>
            Every feature exists because a real attorney asked for it.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:56}}>
            {benefits.map((b,i)=>(
              <div key={i} className="card">
                <div style={{width:38,height:38,borderRadius:9,background:`${G}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={b.icon} stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{fontSize:15,fontWeight:600,marginBottom:6,color:"#f8f8f8"}}>{b.t}</div>
                <div style={{fontSize:13,color:"#c8c8c8",lineHeight:1.7}}>{b.d}</div>
              </div>
            ))}
          </div>
          {/* Practice area chips */}
          <div className="tag" style={{marginBottom:16}}>Built for every practice area</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {Object.entries(VERTICALS).map(([k,v])=>(
              <div key={k} style={{
                display:"flex",alignItems:"center",gap:8,padding:"8px 16px",
                background:"#18181f",border:"1px solid #25252e",borderRadius:8,
                fontSize:13,color:"#b0b0b0",cursor:"pointer",transition:"all .2s"
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=v.color;e.currentTarget.style.color="#ffffff";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#25252e";e.currentTarget.style.color="#b0b0b0";}}
                onClick={()=>scrollTo("demo")}
              >
                <span style={{fontSize:15}}>{v.icon}</span>{v.name}
              </div>
            ))}
          </div>
        </section>

        {/* ── LIVE DEMO ── */}
        <section id="demo" style={{background:"#0d0d12",paddingTop:100,paddingBottom:100}}>
          <div className="section scroll-fade">
            <div className="tag" style={{marginBottom:14}}>Live Demo</div>
            <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:12}}>Try Caseform yourself</h2>
            <p style={{fontSize:15,color:"#c8c8c8",lineHeight:1.75,marginBottom:40,maxWidth:520}}>
              Pick a practice area and have a real AI intake conversation. See exactly what your clients experience.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
              {Object.entries(VERTICALS).map(([k,v])=>(
                <div key={k} onClick={()=>start(k)} className="card" style={{cursor:"pointer",textAlign:"center",padding:"28px 16px"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=v.color;e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#25252e";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{fontSize:34,marginBottom:14}}>{v.icon}</div>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:5,color:"#f8f8f8"}}>{v.name}</div>
                  <div style={{fontSize:12,color:"#909090",lineHeight:1.55}}>{v.desc}</div>
                  <div style={{marginTop:16,display:"inline-flex",alignItems:"center",gap:4,fontSize:12,color:v.color,fontWeight:600}}>
                    Start intake
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3M9.5 6l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section scroll-fade" style={{paddingTop:100,paddingBottom:80}}>
          <div className="tag" style={{marginBottom:14}}>What firms are saying</div>
          <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:48}}>Built with attorneys. Loved by firms.</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:16}}>
            {testimonials.map((t,i)=>(
              <div key={i} className="card">
                <div style={{fontSize:32,color:G,marginBottom:16,lineHeight:1,fontFamily:"Georgia,serif"}}>"</div>
                <div style={{fontSize:14,color:"#d0d0d0",lineHeight:1.8,marginBottom:20}}>{t.q}</div>
                <div style={{borderTop:"1px solid #25252e",paddingTop:14}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#f8f8f8"}}>{t.n}</div>
                  <div style={{fontSize:12,color:"#909090",marginTop:2}}>{t.f}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section style={{background:"#0d0d12",paddingTop:80,paddingBottom:100}}>
          <div className="section scroll-fade">
            <div className="tag" style={{marginBottom:14}}>Pricing</div>
            <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:48}}>Simple pricing. No surprises.</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16,maxWidth:1100}}>
              {[
                {name:"Solo",price:"$149",per:"/mo",features:["1 practice area","Up to 50 intakes/mo","Case brief dashboard","Email support"],cta:"Start free trial"},
                {name:"Firm",price:"$349",per:"/mo",features:["All 5 practice areas","Unlimited intakes","Lead scoring","Priority support","CRM integration"],cta:"Start free trial",featured:true},
                {name:"Enterprise",price:"Custom",per:"",features:["Multi-office support","Custom question flows","API access","Dedicated account manager","White-label option"],cta:"Contact sales"},
              ].map((p,i)=>(
                <div key={i} className="card" style={{border:p.featured?`1.5px solid ${G}`:"1px solid #25252e",position:"relative"}}>
                  {p.featured&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:G,color:"#06070a",fontSize:10,fontWeight:700,padding:"3px 12px",borderRadius:100,letterSpacing:1,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
                  <div style={{fontSize:13,fontWeight:600,color:"#c8c8c8",marginBottom:6}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:2,marginBottom:22}}>
                    <span style={{fontSize:38,fontWeight:800,color:"#ffffff"}}>{p.price}</span>
                    <span style={{fontSize:13,color:"#909090"}}>{p.per}</span>
                  </div>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:"#d0d0d0",marginBottom:10}}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>{f}
                    </div>
                  ))}
                  <button
                    className={p.featured?"btn-p":"btn-s"}
                    style={{width:"100%",marginTop:20,justifyContent:"center"}}
                    onClick={()=>scrollTo("cta")}
                  >{p.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FORM ── */}
        <section id="cta" className="section scroll-fade" style={{paddingTop:100,paddingBottom:100,position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${G}10 0%, transparent 70%)`,pointerEvents:"none",zIndex:0}}/>
          <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
            <div className="tag" style={{marginBottom:16}}>Get Started</div>
            <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:14}}>
              See Caseform in action. Free.
            </h2>
            <p style={{fontSize:16,color:"#c8c8c8",lineHeight:1.75,marginBottom:48,maxWidth:460,margin:"0 auto 48px"}}>
              Join our pilot program. We set up Caseform for your practice at no cost. You give us feedback.
            </p>
            {formSubmitted?(
              <div style={{
                display:"inline-flex",alignItems:"center",gap:12,
                padding:"20px 32px",background:`${G}12`,
                border:`1px solid ${G}35`,borderRadius:12,
                marginBottom:24
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4.5 4.5 8-8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{color:G,fontWeight:600,fontSize:16}}>You're on the list! We'll reach out soon with your free trial access.</span>
              </div>
            ):(
              <div style={{background:"#18181f",border:"1px solid #25252e",borderRadius:14,padding:"36px 32px",textAlign:"left"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:500,color:"#b0b0b0",display:"block",marginBottom:6}}>Full name <span style={{color:G}}>*</span></label>
                    <input type="text" placeholder="Jane Smith" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="input-field"/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:500,color:"#b0b0b0",display:"block",marginBottom:6}}>Firm / company <span style={{color:G}}>*</span></label>
                    <input type="text" placeholder="Smith & Associates" value={formData.company} onChange={e=>setFormData({...formData,company:e.target.value})} className="input-field"/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:500,color:"#b0b0b0",display:"block",marginBottom:6}}>Work email <span style={{color:G}}>*</span></label>
                    <input type="email" placeholder="jane@smithlaw.com" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="input-field"/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:500,color:"#b0b0b0",display:"block",marginBottom:6}}>Phone <span style={{color:"#787878"}}>optional</span></label>
                    <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} className="input-field"/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:13,fontWeight:500,color:"#b0b0b0",display:"block",marginBottom:6}}>Message <span style={{color:"#787878"}}>optional</span></label>
                  <textarea placeholder="Tell us about your firm and what you're hoping to solve..." value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} className="input-field" style={{minHeight:90,resize:"vertical",lineHeight:1.6}}/>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:22}}>
                  <div
                    onClick={()=>setFormData({...formData,consent:!formData.consent})}
                    style={{
                      width:18,height:18,borderRadius:4,border:`1.5px solid ${formData.consent?G:"#404040"}`,
                      background:formData.consent?G:"transparent",cursor:"pointer",flexShrink:0,marginTop:1,
                      display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"
                    }}>
                    {formData.consent&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 5-5" stroke="#06070a" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{fontSize:13,color:"#c8c8c8",lineHeight:1.6}}>
                    I agree to receive product updates and trial access information from Caseform. No spam, unsubscribe anytime.
                  </span>
                </div>
                {formError&&<div style={{fontSize:13,color:"#e87070",marginBottom:14,padding:"10px 14px",background:"#1e0f0f",border:"1px solid #3a1515",borderRadius:8}}>{formError}</div>}
                <button className="btn-p" onClick={submitForm} style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:15,borderRadius:8}}>
                  Request Free Trial
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8m0 0L8.5 4M12 8l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:16,flexWrap:"wrap"}}>
                  {["No credit card required","Setup in under 10 minutes","Cancel anytime"].map((t,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#909090"}}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 5-5" stroke={G} strokeWidth="1.4" strokeLinecap="round"/></svg>{t}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:"1px solid #25252e",paddingTop:56,paddingBottom:48}}>
          <div className="section">
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:48}}>
              {/* Brand */}
              <div>
                <Logo s={18}/>
                <p style={{fontSize:14,color:"#c0c0c0",lineHeight:1.75,marginTop:16,maxWidth:280}}>
                  AI-powered legal intake for modern law firms. Structured briefs before every consultation.
                </p>
              </div>
              {/* Nav */}
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#e0e0e0",letterSpacing:1,textTransform:"uppercase",fontFamily:CM,marginBottom:18}}>Navigation</div>
                {[["The Problem","problem"],["Our Solution","solution"],["Why Caseform","why"],["Live Demo","demo"],["Get Started","cta"]].map(([label,id])=>(
                  <div key={id} style={{marginBottom:10}}>
                    <button onClick={()=>scrollTo(id)} style={{background:"none",border:"none",color:"#d8d8d8",fontFamily:CF,fontSize:14,cursor:"pointer",padding:0,transition:"color .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.color="#ffffff"}
                      onMouseLeave={e=>e.currentTarget.style.color="#d8d8d8"}>
                      {label}
                    </button>
                  </div>
                ))}
              </div>
              {/* Contact & Legal */}
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#e0e0e0",letterSpacing:1,textTransform:"uppercase",fontFamily:CM,marginBottom:18}}>Contact</div>
                <a href="mailto:hello@caseform.ai" style={{fontSize:14,color:"#d8d8d8",textDecoration:"none",display:"block",marginBottom:10,transition:"color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.color=G}
                  onMouseLeave={e=>e.currentTarget.style.color="#d8d8d8"}>
                  hello@caseform.ai
                </a>
                <div style={{marginTop:24}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#e0e0e0",letterSpacing:1,textTransform:"uppercase",fontFamily:CM,marginBottom:14}}>Legal</div>
                  {["Privacy Policy","Terms of Service","Cookie Policy"].map((l,i)=>(
                    <div key={i} style={{marginBottom:8}}>
                      <a href="#" style={{fontSize:13,color:"#c0c0c0",textDecoration:"none",transition:"color .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.color="#ffffff"}
                        onMouseLeave={e=>e.currentTarget.style.color="#c0c0c0"}>{l}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{borderTop:"1px solid #2a2a2a",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <span style={{fontSize:13,color:"#b0b0b0"}}>© 2025 Caseform. Built for attorneys.</span>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  width:34,height:34,borderRadius:8,border:"1px solid #3a3a3a",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#c0c0c0",textDecoration:"none",transition:"all .2s"
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#888888";e.currentTarget.style.color="#ffffff";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#3a3a3a";e.currentTarget.style.color="#c0c0c0";}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                  width:34,height:34,borderRadius:8,border:"1px solid #3a3a3a",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#c0c0c0",textDecoration:"none",transition:"all .2s"
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#888888";e.currentTarget.style.color="#ffffff";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#3a3a3a";e.currentTarget.style.color="#c0c0c0";}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-1a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ====================== CHAT ======================
  if(view==="chat"){
    const vc=VERTICALS[vertical];
    return(
      <div style={{minHeight:"100vh",background:"#111116",color:"#ffffff",fontFamily:CF,display:"flex",flexDirection:"column"}}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
        <style>{`
          @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:.3}}
          @keyframes spin{to{transform:rotate(360deg)}}
          .typing::after{content:'...';animation:blink 1.2s infinite}
          .input-field{width:100%;padding:13px 16px;border-radius:10px;border:1px solid #2e2e3a;background:#0e0e14;color:#ffffff;font-size:14px;outline:none;font-family:${CF};transition:border-color .2s}
          .input-field:focus{border-color:${G}}
          .input-field::placeholder{color:#787878}
        `}</style>
        <div style={{
          padding:"14px 24px",borderBottom:"1px solid #25252e",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          flexShrink:0,background:"rgba(17,17,22,0.92)",
          backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
          position:"sticky",top:0,zIndex:10
        }}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <button onClick={()=>setView("landing")} style={{
              display:"flex",alignItems:"center",gap:7,background:"transparent",
              border:"1px solid #2e2e3a",borderRadius:8,padding:"7px 14px",
              color:"#c8c8c8",cursor:"pointer",fontSize:13,fontWeight:500,
              fontFamily:CF,transition:"all .2s"
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#555555";e.currentTarget.style.color="#ffffff";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#2e2e3a";e.currentTarget.style.color="#c8c8c8";}}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>
            <div style={{width:1,height:22,background:"#25252e"}}/>
            <span style={{fontSize:16}}>{vc.icon}</span>
            <span style={{fontSize:14,color:"#b0b0b0",fontWeight:500}}>{vc.name}</span>
          </div>
          {intakeComplete&&(
            <button onClick={genSummary} style={{
              background:G,color:"#06070a",border:"none",borderRadius:8,
              padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",
              fontFamily:CF,display:"flex",alignItems:"center",gap:6,transition:"opacity .15s"
            }} onMouseEnter={e=>e.currentTarget.style.opacity=".88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              View case brief
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"28px 24px 140px",maxWidth:720,margin:"0 auto",width:"100%"}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:16,gap:10}}>
              {m.role!=="user"&&(
                <div style={{width:30,height:30,borderRadius:8,background:"#18181f",border:"1px solid #25252e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="2.5" stroke={G} strokeWidth="1.1" fill="none"/><path d="M3.5 5h7M3.5 7.5h4.5" stroke={G} strokeWidth="1" strokeLinecap="round"/></svg>
                </div>
              )}
              <div style={{
                maxWidth:"78%",padding:"13px 17px",
                borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                background:m.role==="user"?G:"#18181f",
                color:m.role==="user"?"#06070a":"#ebebeb",
                fontSize:14,lineHeight:1.7,
                border:m.role!=="user"?"1px solid #25252e":"none"
              }}>{m.content}</div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <div style={{width:30,height:30,borderRadius:8,background:"#18181f",border:"1px solid #25252e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="2.5" stroke={G} strokeWidth="1.1" fill="none"/><path d="M3.5 5h7M3.5 7.5h4.5" stroke={G} strokeWidth="1" strokeLinecap="round"/></svg>
              </div>
              <div style={{padding:"13px 17px",borderRadius:"14px 14px 14px 4px",background:"#18181f",color:"#787878",fontSize:14,border:"1px solid #25252e"}}>
                <span className="typing">Thinking</span>
              </div>
            </div>
          )}
          <div ref={chatEnd}/>
        </div>
        <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 24px 28px",background:"linear-gradient(transparent,#111116 35%)"}}>
          <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
            <input
              type="text" value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Type your response..."
              className="input-field"
            />
            <button onClick={send} disabled={loading||!input.trim()} style={{
              padding:"13px 20px",borderRadius:10,border:"none",
              background:input.trim()?G:"#1e1e28",
              color:input.trim()?"#06070a":"#787878",
              fontSize:14,fontWeight:600,cursor:input.trim()?"pointer":"default",
              transition:"all .15s",fontFamily:CF,flexShrink:0
            }}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  // ====================== DASHBOARD ======================
  if(view==="dashboard"){
    const vc=VERTICALS[vertical];
    const renderVal=(val)=>{
      if(Array.isArray(val)) return val.length>0
        ? val.map((item,i)=>(
            <div key={i} style={{padding:"8px 12px",background:"#0e0e14",borderRadius:7,fontSize:13,marginBottom:4,border:"1px solid #1e1e28",lineHeight:1.55}}>
              {typeof item==="string"?item:JSON.stringify(item)}
            </div>
          ))
        : <span style={{color:"#787878",fontSize:13}}>None mentioned</span>;
      return <span>{val||<span style={{color:"#787878"}}>Not mentioned</span>}</span>;
    };
    const pKeys=["key_facts","red_flags","recommended_focus"];
    const entries=summary&&!summary.error?Object.entries(summary):[];
    const top=entries.filter(([k])=>pKeys.includes(k));
    const detail=entries.filter(([k])=>!pKeys.includes(k));
    return(
      <div style={{minHeight:"100vh",background:"#111116",color:"#ffffff",fontFamily:CF}}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{
          padding:"14px 24px",borderBottom:"1px solid #25252e",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:"rgba(17,17,22,0.92)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
          position:"sticky",top:0,zIndex:10
        }}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{cursor:"pointer"}} onClick={()=>setView("chat")}><Logo s={16}/></div>
            <div style={{width:1,height:22,background:"#25252e"}}/>
            <span style={{fontFamily:CM,fontSize:11,color:"#b0b0b0",letterSpacing:1.2,textTransform:"uppercase"}}>Case brief</span>
          </div>
          <button
            onClick={()=>{setView("landing");setMessages([]);setSummary(null);setIntakeComplete(false);}}
            style={{background:"transparent",border:"1px solid #2e2e3a",color:"#b0b0b0",borderRadius:8,padding:"7px 18px",fontSize:13,cursor:"pointer",fontFamily:CF,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#707070";e.currentTarget.style.color="#ffffff";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2e2e3a";e.currentTarget.style.color="#b0b0b0";}}
          >New intake</button>
        </div>
        <div style={{maxWidth:920,margin:"0 auto",padding:"36px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
            <span style={{fontSize:26}}>{vc.icon}</span>
            <div>
              <div style={{fontFamily:CM,fontSize:11,color:"#909090",letterSpacing:1.5,textTransform:"uppercase"}}>{vc.name}</div>
              <h1 style={{fontSize:30,fontWeight:800,margin:0,letterSpacing:"-0.02em",color:"#ffffff"}}>Case Brief</h1>
            </div>
          </div>
          {summaryLoading?(
            <div style={{textAlign:"center",padding:"100px 0"}}>
              <div style={{width:40,height:40,border:"2px solid #25252e",borderTopColor:G,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 20px"}}/>
              <div style={{fontSize:15,color:"#909090"}}>Building your case brief...</div>
            </div>
          ):summary?.error?(
            <div style={{background:"#180e0e",border:"1px solid #3a1515",borderRadius:12,padding:24,color:"#e87070"}}>{summary.error}</div>
          ):summary?(<>
            {top.length>0&&(
              <div style={{marginBottom:24}}>
                {top.map(([k,val])=>(
                  <div key={k} style={{
                    marginBottom:10,padding:"20px 24px",borderRadius:12,
                    border:`1px solid ${k==="red_flags"?"#3a1515":"#1a2e22"}`,
                    background:k==="red_flags"?"#120909":"#091a10"
                  }}>
                    <div style={{fontFamily:CM,fontSize:11,color:k==="red_flags"?"#e87070":G,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>
                      {k.replace(/_/g," ")}
                    </div>
                    {renderVal(val)}
                  </div>
                ))}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10}}>
              {detail.map(([k,val])=>(
                <div key={k} style={{background:"#18181f",border:"1px solid #25252e",borderRadius:10,padding:"16px 20px"}}>
                  <div style={{fontFamily:CM,fontSize:10,color:"#787878",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>
                    {k.replace(/_/g," ")}
                  </div>
                  <div style={{fontSize:14,lineHeight:1.65,color:"#d8d8d8"}}>{renderVal(val)}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:40}}>
              <div style={{fontFamily:CM,fontSize:11,color:"#787878",letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>Full transcript</div>
              <div style={{background:"#18181f",border:"1px solid #25252e",borderRadius:12,padding:"24px",maxHeight:400,overflowY:"auto"}}>
                {messages.map((m,i)=>(
                  <div key={i} style={{marginBottom:20}}>
                    <div style={{fontFamily:CM,fontSize:10,color:m.role==="user"?G:"#787878",marginBottom:5,textTransform:"uppercase",letterSpacing:1.2}}>
                      {m.role==="user"?"Client":"Caseform AI"}
                    </div>
                    <div style={{fontSize:14,color:"#bbbbbb",lineHeight:1.7}}>{m.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </>):null}
        </div>
      </div>
    );
  }
  return null;
}
export default App;
