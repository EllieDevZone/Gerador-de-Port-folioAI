import { useState, useRef, useCallback, useEffect } from "react";

const FONTS_LINK = document.createElement("link");
FONTS_LINK.rel = "stylesheet";
FONTS_LINK.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,700;1,300;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
document.head.appendChild(FONTS_LINK);

const gStyle = document.createElement("style");
gStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; width: 100%; }
  body { background: #080810; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #e8ff0040; border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  @keyframes shimmer { 0%,100%{opacity:.5}50%{opacity:1} }
  @keyframes borderPulse { 0%,100%{border-color:#e8ff0030}50%{border-color:#e8ff0080} }
  .fu { animation: fadeUp .45s cubic-bezier(.22,1,.36,1) both; }
  .fi { animation: fadeIn .3s ease both; }
  .drop-active { animation: borderPulse .8s ease infinite; background: #e8ff0008 !important; }
  input, textarea, button { font-family: inherit; }
`;
document.head.appendChild(gStyle);

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

const PROFESSION_GROUPS = {
  tech: ["dev","developer","desenvolvedor","programador","engenheiro de software","frontend","backend","fullstack","ux","ui","designer","data scientist","devops","cloud","mobile","flutter","react","angular","web","ti "],
  legal: ["advogad","lawyer","juiz","promotor","defensor","procurador","notári","tabelião","jurídic","direito"],
  health: ["médic","doctor","enfermei","dentist","psicólog","fisioterapeut","nutricion","veterinári","farmacêut","clínic","terapeut","fonoaudiól"],
  business: ["contador","consultor","auditor","financeiro","economista","administrador","gerente","diretor","ceo","cfo","empreendedor","gestão","rh","recursos humanos","vendas","comercial","marketing"],
  creative: ["fotógraf","ilustrador","arquitet","artista","músic","escritor","jornalist","redator","publicitári","cineasta","designer","moda","interior","paisag","audiovisual"],
};

const PROF_TIPS = {
  tech: "Você tem carta branca — todos os templates ficam incríveis pra área tech! Neon Grid e Noir são os favoritos 🤓",
  legal: "Pra Direito, Luxury, Editorial e Studio passam autoridade e credibilidade. Noir com boa paleta também arrase!",
  health: "Studio, Luxury e Editorial transmitem confiança e seriedade. Quer algo mais moderno? Glassmorphism fica lindo!",
  business: "Studio e Editorial comunicam autoridade. Luxury foi feito pra quem quer passar sofisticação.",
  creative: "Você tem liberdade total! Retro, Bold e Neon Grid foram feitos pra quem vive de criatividade.",
};
const PROF_LABELS = { tech:"Tecnologia", legal:"Direito", health:"Saúde", business:"Negócios", creative:"Criativo" };

function detectGroup(role) {
  if (!role) return null;
  const lower = role.toLowerCase();
  for (const [group, keywords] of Object.entries(PROFESSION_GROUPS)) {
    if (keywords.some(k => lower.includes(k))) return group;
  }
  return null;
}

const TEMPLATES = [
  { id:"neon",     name:"Neon Grid",      emoji:"⚡", preview:"#050510", accent:"#00f5ff", font:"Space Mono",         tagline:"Cyberpunk & ousado",     vibe:"Pra quem quer ser lembrado muito depois de fechar a aba",      bestFor:["tech","creative"],                     favorite:true  },
  { id:"minimal",  name:"Noir Minimal",   emoji:"◆", preview:"#0d0d0d", accent:"#e8ff00", font:"Syne",               tagline:"Dark & sofisticado",     vibe:"Clean, direto, sem firulas — exatamente o que precisa",        bestFor:["tech","creative","business"],          favorite:true  },
  { id:"luxury",   name:"Luxury",         emoji:"✦", preview:"#0c0a06", accent:"#c9a84c", font:"Cormorant Garamond", tagline:"Sofisticado & premium",  vibe:"Pra quem quer transmitir excelência desde o primeiro segundo",  bestFor:["legal","health","business","creative"], favorite:false },
  { id:"glass",    name:"Glassmorphism",  emoji:"◎", preview:"#1a1040", accent:"#a78bfa", font:"Plus Jakarta Sans",  tagline:"Moderno & vibrante",     vibe:"Aquele visual de app de luxo que todo mundo acha bonito",      bestFor:["tech","creative","health"],            favorite:false },
  { id:"retro",    name:"Retro Poster",   emoji:"◈", preview:"#1a0a00", accent:"#ff6b35", font:"Bebas Neue",         tagline:"Vintage & marcante",     vibe:"Inspirado nos grandes cartazes dos anos 70 e 80",              bestFor:["creative","business","tech"],          favorite:false },
  { id:"split",    name:"Split Screen",   emoji:"▪", preview:"#f0ece4", accent:"#2d2d2d", font:"Playfair Display",   tagline:"Elegante & estruturado", vibe:"Foto de um lado, texto do outro — limpo e marcante",           bestFor:["creative","legal","health","business"], favorite:false },
  { id:"editorial",name:"Editorial",      emoji:"📖",preview:"#f5f0e8", accent:"#c0392b", font:"Fraunces",           tagline:"Clássico & elegante",    vibe:"Transmite credibilidade e autoridade na medida certa",         bestFor:["legal","health","business","creative"], favorite:false },
  { id:"studio",   name:"Studio",         emoji:"🏛", preview:"#f8f8f5", accent:"#1a1a2e", font:"Outfit",            tagline:"Limpo & profissional",   vibe:"Moderno sem assustar — funciona pra qualquer área",            bestFor:["legal","health","business","tech"],    favorite:false },
  { id:"bold",     name:"Bold Magazine",  emoji:"🔥", preview:"#ff3b00", accent:"#ffffff", font:"DM Serif Display",  tagline:"Impactante & marcante",  vibe:"Quando você quer que te lembrem depois de fechar a aba",       bestFor:["creative","business","tech"],          favorite:false },
];

const COLOR_PALETTES = [
  { name:"Neon Acid", bg:"#0a0a0f", text:"#f0f0f0", accent:"#e8ff00" },
  { name:"Crimson",   bg:"#f5f0e8", text:"#1a1a1a", accent:"#c0392b" },
  { name:"Cyan Punk", bg:"#050510", text:"#e0e0ff", accent:"#00f5ff" },
  { name:"Obsidian",  bg:"#0f0f0f", text:"#ffffff",  accent:"#7c3aed" },
  { name:"Sage",      bg:"#f0f4f0", text:"#2d3a2d", accent:"#4a7c59" },
  { name:"Fire",      bg:"#ff3b00", text:"#ffffff",  accent:"#ffd700" },
  { name:"Ivory",     bg:"#faf8f3", text:"#1a1410", accent:"#8b4513" },
  { name:"Navy",      bg:"#0a0e1a", text:"#e8edf5", accent:"#4a90d9" },
  { name:"Gold",      bg:"#0c0a06", text:"#e8e0cc", accent:"#c9a84c" },
  { name:"Violet",    bg:"#1a1040", text:"#e8e0ff", accent:"#a78bfa" },
];

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "Você é um copywriter profissional especializado em portfólios pessoais. Crie textos impactantes, humanos e diretos. Responda sempre em português. Nunca use asteriscos ou formatação markdown.",
      messages: [{ role:"user", content:prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

function getPalette(template, override) {
  if (override) return override;
  const t = TEMPLATES.find(t => t.id === template);
  const lightThemes = ["editorial","studio","split"];
  return { bg:t.preview, text:lightThemes.includes(template) ? "#1a1a1a" : "#f0f0f0", accent:t.accent };
}

function col1(w) { return w < 640; }
function col1sm(w) { return w < 480; }

function NeonTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:"linear-gradient(135deg,#050510 0%,#0a0520 100%)", fontFamily:"'Space Mono',monospace", color:"#f0f0f0", padding: mobile ? "28px 20px" : "60px 48px", minHeight:"100%" }}>
      <div style={{ borderBottom:`1px solid ${pal.accent}20`, paddingBottom:28, marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16, flexWrap:"wrap" }}>
          {data.photo && (
            <div style={{ width:64, height:64, borderRadius:"50%", overflow:"hidden", border:`2px solid ${pal.accent}`, boxShadow:`0 0 20px ${pal.accent}50`, flexShrink:0 }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
          <div>
            <div style={{ fontSize:9, letterSpacing:6, color:pal.accent, marginBottom:8, textShadow:`0 0 10px ${pal.accent}` }}>◈ PORTFOLIO.EXE — {new Date().getFullYear()}</div>
            <h1 style={{ fontSize:"clamp(28px,6vw,64px)", fontWeight:700, color:"#fff", textShadow:`0 0 30px ${pal.accent}40`, lineHeight:1 }}>{data.name||"SEU NOME"}</h1>
            <div style={{ fontSize:11, color:pal.accent, marginTop:8, letterSpacing:3, textShadow:`0 0 8px ${pal.accent}` }}>// {data.role||"PROFISSIONAL"}</div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ border:`1px solid ${pal.accent}25`, padding:20, background:`${pal.accent}05` }}>
          <div style={{ color:pal.accent, fontSize:9, letterSpacing:4, marginBottom:12 }}>&gt; ABOUT.TXT</div>
          <p style={{ fontSize:13, lineHeight:1.9, color:"#c0c0e0" }}>{data.bio||"Bio aqui."}</p>
        </div>
        <div style={{ border:`1px solid ${pal.accent}25`, padding:20, background:`${pal.accent}05` }}>
          <div style={{ color:pal.accent, fontSize:9, letterSpacing:4, marginBottom:12 }}>&gt; SKILLS.JSON</div>
          {(data.skills||[]).map((s,i) => (
            <div key={i} style={{ fontSize:12, color:"#a0a0c0", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:pal.accent }}>▸</span> {s}
            </div>
          ))}
          {data.contact && <div style={{ marginTop:16, fontSize:10, color:pal.accent, opacity:0.6, letterSpacing:2 }}>{data.contact}</div>}
        </div>
      </div>
      {data.projects?.length > 0 && (
        <div>
          <div style={{ color:pal.accent, fontSize:9, letterSpacing:4, marginBottom:14 }}>&gt; PROJECTS.DB</div>
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
            {data.projects.map((p,i) => (
              <div key={i} style={{ border:`1px solid ${pal.accent}35`, padding:18, background:`${pal.accent}08`, borderLeft:`3px solid ${pal.accent}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:11, color:"#7070a0", lineHeight:1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MinimalTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:pal.bg, color:pal.text, fontFamily:"'Syne',sans-serif", padding: mobile ? "28px 20px" : "60px 48px", minHeight:"100%" }}>
      <div style={{ borderBottom:`1px solid ${pal.accent}`, paddingBottom:28, marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
          {data.photo && (
            <div style={{ width:80, height:80, borderRadius:4, overflow:"hidden", flexShrink:0, border:`1px solid ${pal.accent}40` }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:5, color:pal.accent, marginBottom:12, opacity:0.8 }}>PORTFOLIO — {new Date().getFullYear()}</div>
            <h1 style={{ fontSize:"clamp(32px,6vw,72px)", fontWeight:800, lineHeight:1, letterSpacing:-2, wordBreak:"break-word" }}>{data.name||"Seu Nome"}</h1>
            <div style={{ fontSize:12, letterSpacing:3, marginTop:8, opacity:0.5, textTransform:"uppercase" }}>{data.role||"Profissional"}</div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 28 : 48 }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:4, color:pal.accent, marginBottom:14 }}>SOBRE</div>
          <p style={{ fontSize:14, lineHeight:1.85, opacity:0.85 }}>{data.bio||"Sua bio vai aparecer aqui."}</p>
        </div>
        <div>
          <div style={{ fontSize:9, letterSpacing:4, color:pal.accent, marginBottom:14 }}>HABILIDADES</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {(data.skills||[]).map((s,i) => (
              <span key={i} style={{ border:`1px solid ${pal.accent}60`, padding:"4px 12px", fontSize:11, letterSpacing:2, color:pal.accent }}>{s}</span>
            ))}
          </div>
          {data.contact && <div style={{ marginTop:24, fontSize:11, opacity:0.4, letterSpacing:2, wordBreak:"break-word" }}>{data.contact}</div>}
        </div>
      </div>
      {data.projects?.length > 0 && (
        <div style={{ marginTop:40 }}>
          <div style={{ fontSize:9, letterSpacing:4, color:pal.accent, marginBottom:20 }}>PROJETOS</div>
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(180px,1fr))", gap:20 }}>
            {data.projects.map((p,i) => (
              <div key={i} style={{ borderTop:`2px solid ${pal.accent}`, paddingTop:14 }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:11, opacity:0.5, lineHeight:1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LuxuryTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:`radial-gradient(ellipse at 20% 0%, #1a1408 0%, ${pal.bg} 60%)`, color:pal.text, fontFamily:"'Cormorant Garamond',serif", padding: mobile ? "28px 20px" : "60px 48px", minHeight:"100%" }}>
      <div style={{ textAlign:"center", paddingBottom:36, marginBottom:36, borderBottom:`1px solid ${pal.accent}30` }}>
        {data.photo ? (
          <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden", margin:"0 auto 16px", border:`2px solid ${pal.accent}80`, boxShadow:`0 0 40px ${pal.accent}20` }}>
            <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        ) : (
          <div style={{ width:60, height:1, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, margin:"0 auto 20px" }} />
        )}
        <div style={{ fontSize:9, letterSpacing:8, color:pal.accent, marginBottom:14, opacity:0.7 }}>PORTFÓLIO PESSOAL</div>
        <h1 style={{ fontSize:"clamp(28px,5.5vw,68px)", fontWeight:300, letterSpacing: mobile ? 2 : 6, lineHeight:1.1, color:pal.accent, wordBreak:"break-word" }}>{data.name||"SEU NOME"}</h1>
        <div style={{ fontSize:13, letterSpacing:4, marginTop:10, opacity:0.5, fontStyle:"italic" }}>{data.role||"Profissional"}</div>
        <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, margin:"16px auto 0" }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1.6fr 1fr", gap: mobile ? 28 : 48 }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:6, color:pal.accent, marginBottom:16, opacity:0.6 }}>— SOBRE</div>
          <p style={{ fontSize:15, lineHeight:2, opacity:0.8, fontWeight:300, fontStyle:"italic" }}>{data.bio||"Sua bio vai aparecer aqui."}</p>
          {data.projects?.length > 0 && (
            <div style={{ marginTop:32 }}>
              <div style={{ fontSize:9, letterSpacing:6, color:pal.accent, marginBottom:16, opacity:0.6 }}>— CASES</div>
              {data.projects.map((p,i) => (
                <div key={i} style={{ borderTop:`1px solid ${pal.accent}15`, paddingTop:16, paddingBottom:16 }}>
                  <div style={{ fontSize:15, letterSpacing:2, marginBottom:6, color:pal.accent, fontStyle:"italic" }}>{p.name}</div>
                  <div style={{ fontSize:13, opacity:0.5, lineHeight:1.8 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize:9, letterSpacing:6, color:pal.accent, marginBottom:16, opacity:0.6 }}>— ESPECIALIDADES</div>
          {(data.skills||[]).map((s,i) => (
            <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${pal.accent}15`, fontSize:14, letterSpacing:2, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:pal.accent, fontSize:8 }}>✦</span> {s}
            </div>
          ))}
          {data.contact && (
            <div style={{ marginTop:28, paddingTop:16, borderTop:`1px solid ${pal.accent}20` }}>
              <div style={{ fontSize:9, letterSpacing:4, color:pal.accent, opacity:0.5, marginBottom:10 }}>CONTATO</div>
              <div style={{ fontSize:13, opacity:0.5, letterSpacing:1, lineHeight:1.8, wordBreak:"break-word" }}>{data.contact}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlassTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:`linear-gradient(135deg,#1a1040 0%,#0d0820 50%,#1a0a30 100%)`, color:"#f0f0f0", fontFamily:"'Plus Jakarta Sans',sans-serif", padding: mobile ? "20px 16px" : "48px", minHeight:"100%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:`${pal.accent}12`, filter:"blur(50px)", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, padding: mobile ? "16px" : "24px 28px", background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", flexWrap:"wrap" }}>
          {data.photo && (
            <div style={{ width:64, height:64, borderRadius:10, overflow:"hidden", flexShrink:0, border:`1px solid ${pal.accent}40` }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:"clamp(22px,4.5vw,56px)", fontWeight:700, lineHeight:1.05, color:"#fff", wordBreak:"break-word" }}>{data.name||"Seu Nome"}</h1>
            <div style={{ fontSize:12, color:pal.accent, marginTop:4, fontWeight:500 }}>{data.role||"Profissional"}</div>
          </div>
          {data.contact && <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", wordBreak:"break-word", maxWidth:120 }}>{data.contact}</div>}
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1.2fr 1fr", gap:14, marginBottom:14 }}>
          <div style={{ padding:"20px", background:"rgba(255,255,255,0.04)", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize:10, letterSpacing:3, color:pal.accent, marginBottom:12, opacity:0.8 }}>SOBRE MIM</div>
            <p style={{ fontSize:13, lineHeight:1.9, color:"rgba(255,255,255,0.7)" }}>{data.bio||"Bio aqui."}</p>
          </div>
          <div style={{ padding:"20px", background:"rgba(255,255,255,0.04)", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize:10, letterSpacing:3, color:pal.accent, marginBottom:12, opacity:0.8 }}>HABILIDADES</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {(data.skills||[]).map((s,i) => (
                <div key={i} style={{ padding:"4px 10px", borderRadius:100, background:`${pal.accent}18`, border:`1px solid ${pal.accent}40`, fontSize:11, color:pal.accent, fontWeight:500 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
        {data.projects?.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
            {data.projects.map((p,i) => (
              <div key={i} style={{ padding:"18px 20px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:`1px solid ${pal.accent}25`, borderTop:`2px solid ${pal.accent}` }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RetroPoster({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:`radial-gradient(ellipse at center,#2a1500 0%,#1a0a00 100%)`, color:pal.text, fontFamily:"'Bebas Neue',sans-serif", padding: mobile ? "28px 20px" : "60px 48px", minHeight:"100%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 36px,${pal.accent}08 36px,${pal.accent}08 37px)`, pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:16 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, letterSpacing:6, color:pal.accent, opacity:0.6, marginBottom:6 }}>{new Date().getFullYear()} — PORTFÓLIO</div>
            <h1 style={{ fontSize:"clamp(40px,8vw,100px)", lineHeight:0.88, letterSpacing:2, color:pal.accent, textShadow:`4px 4px 0 #00000080`, wordBreak:"break-word" }}>{data.name||"SEU NOME"}</h1>
          </div>
          {data.photo && (
            <div style={{ width: mobile ? 72 : 96, height: mobile ? 88 : 116, overflow:"hidden", flexShrink:0, border:`3px solid ${pal.accent}`, filter:"sepia(30%) contrast(1.1)" }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, flexWrap:"wrap" }}>
          <div style={{ height:4, flex:1, background:pal.accent, minWidth:20 }} />
          <div style={{ fontSize: mobile ? 13 : 16, letterSpacing: mobile ? 4 : 8, color:pal.accent, fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{data.role||"PROFISSIONAL"}</div>
          <div style={{ height:4, flex:1, background:pal.accent, minWidth:20 }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1.4fr 1fr", gap: mobile ? 24 : 32 }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:6, color:pal.accent, opacity:0.5, marginBottom:12 }}>SOBRE</div>
            <p style={{ fontSize:14, lineHeight:1.85, color:`${pal.text}cc`, fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{data.bio||"Bio aqui."}</p>
            {data.projects?.length > 0 && (
              <div style={{ marginTop:24 }}>
                <div style={{ fontSize:11, letterSpacing:6, color:pal.accent, opacity:0.5, marginBottom:12 }}>PROJETOS</div>
                {data.projects.map((p,i) => (
                  <div key={i} style={{ borderLeft:`3px solid ${pal.accent}`, paddingLeft:14, marginBottom:14 }}>
                    <div style={{ fontSize:17, color:pal.accent, marginBottom:4 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:`${pal.text}60`, lineHeight:1.6, fontFamily:"'Outfit',sans-serif" }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize:11, letterSpacing:6, color:pal.accent, opacity:0.5, marginBottom:12 }}>ESPECIALIDADES</div>
            {(data.skills||[]).map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${pal.accent}20` }}>
                <div style={{ width:6, height:6, background:pal.accent, flexShrink:0 }} />
                <div style={{ fontSize: mobile ? 14 : 16, color:pal.accent, letterSpacing:2 }}>{s.toUpperCase()}</div>
              </div>
            ))}
            {data.contact && <div style={{ marginTop:20, fontSize:12, color:`${pal.text}40`, fontFamily:"'Outfit',sans-serif", letterSpacing:2, wordBreak:"break-word" }}>{data.contact}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ display:"flex", flexDirection: mobile ? "column" : "row", minHeight: mobile ? "auto" : 500, fontFamily:"'Playfair Display',serif", background:"#f5f0e8" }}>
      <div style={{ width: mobile ? "100%" : 220, flexShrink:0, background:pal.accent, display:"flex", flexDirection: mobile ? "row" : "column", alignItems:"center", justifyContent: mobile ? "flex-start" : "center", padding: mobile ? "20px 20px" : "36px 24px", gap: mobile ? 16 : 0 }}>
        {data.photo ? (
          <div style={{ width: mobile ? 64 : 110, height: mobile ? 64 : 110, borderRadius:"50%", overflow:"hidden", border:"4px solid rgba(255,255,255,0.3)", flexShrink:0, marginBottom: mobile ? 0 : 16 }}>
            <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        ) : (
          !mobile && <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(0,0,0,0.15)", marginBottom:16 }} />
        )}
        <div style={{ textAlign: mobile ? "left" : "center", flex: mobile ? 1 : "unset" }}>
          <div style={{ fontSize: mobile ? 16 : 17, fontWeight:700, color:"rgba(0,0,0,0.85)", lineHeight:1.2, marginBottom:6 }}>{data.name||"Seu Nome"}</div>
          <div style={{ fontSize:11, color:"rgba(0,0,0,0.55)", letterSpacing:2, fontFamily:"'Outfit',sans-serif", marginBottom: mobile ? 0 : 20 }}>{data.role||"Profissional"}</div>
        </div>
        {!mobile && (
          <>
            <div style={{ width:32, height:2, background:"rgba(0,0,0,0.2)", marginBottom:20 }} />
            <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
              {(data.skills||[]).map((s,i) => (
                <div key={i} style={{ fontSize:11, color:"rgba(0,0,0,0.65)", fontFamily:"'Outfit',sans-serif", textAlign:"center", padding:"5px 0", borderBottom:"1px solid rgba(0,0,0,0.1)" }}>{s}</div>
              ))}
            </div>
            {data.contact && <div style={{ marginTop:"auto", paddingTop:16, fontSize:10, color:"rgba(0,0,0,0.45)", fontFamily:"'Outfit',sans-serif", textAlign:"center", letterSpacing:1, wordBreak:"break-word" }}>{data.contact}</div>}
          </>
        )}
      </div>
      <div style={{ flex:1, padding: mobile ? "24px 20px" : "44px 36px", background:"#f5f0e8", color:"#1a1a1a" }}>
        <div style={{ fontSize:10, letterSpacing:5, color:pal.accent, marginBottom:16, opacity:0.7, fontFamily:"'Outfit',sans-serif" }}>PORTFÓLIO — {new Date().getFullYear()}</div>
        <h2 style={{ fontSize: mobile ? 22 : 26, fontStyle:"italic", fontWeight:400, marginBottom:14, color:pal.accent }}>Sobre mim</h2>
        <p style={{ fontSize:14, lineHeight:1.9, color:"#1a1a1a", opacity:0.8, marginBottom:28 }}>{data.bio||"Sua bio vai aparecer aqui."}</p>
        {mobile && data.skills?.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:18, fontStyle:"italic", fontWeight:400, marginBottom:12, color:pal.accent }}>Especialidades</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {data.skills.map((s,i) => (
                <div key={i} style={{ fontSize:12, color:"rgba(0,0,0,0.65)", fontFamily:"'Outfit',sans-serif", padding:"5px 12px", border:`1px solid ${pal.accent}40`, borderRadius:2 }}>{s}</div>
              ))}
            </div>
          </div>
        )}
        {data.projects?.length > 0 && (
          <>
            <h2 style={{ fontSize: mobile ? 18 : 22, fontStyle:"italic", fontWeight:400, marginBottom:16, color:pal.accent }}>Cases & Projetos</h2>
            {data.projects.map((p,i) => (
              <div key={i} style={{ borderTop:"1px solid rgba(0,0,0,0.1)", paddingTop:16, paddingBottom:16 }}>
                <div style={{ fontSize:15, fontWeight:700, fontStyle:"italic", marginBottom:5, color:"#1a1a1a" }}>{p.name}</div>
                <div style={{ fontSize:12, opacity:0.55, lineHeight:1.7, fontFamily:"'Outfit',sans-serif" }}>{p.desc}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function EditorialTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:"#f5f0e8", color:"#1a1a1a", fontFamily:"'Fraunces',serif", minHeight:"100%" }}>
      <div style={{ background:pal.accent, padding: mobile ? "28px 20px" : "52px 48px 36px" }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:20, flexWrap:"wrap" }}>
          {data.photo && (
            <div style={{ width: mobile ? 72 : 90, height: mobile ? 72 : 90, borderRadius:2, overflow:"hidden", flexShrink:0, border:"3px solid rgba(255,255,255,0.3)" }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:4, marginBottom:12, opacity:0.7, fontFamily:"'Outfit',sans-serif" }}>VOL.01 — PORTFÓLIO</div>
            <h1 style={{ fontSize:"clamp(32px,6vw,80px)", fontWeight:700, lineHeight:0.9, fontStyle:"italic", wordBreak:"break-word" }}>{data.name||"Seu Nome"}</h1>
            <div style={{ fontSize:14, marginTop:14, fontFamily:"'Outfit',sans-serif", opacity:0.75 }}>{data.role||"Profissional"}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: mobile ? "28px 20px" : "44px 48px", display:"grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: mobile ? 28 : 48 }}>
        <div>
          <h2 style={{ fontSize:22, fontStyle:"italic", marginBottom:12, color:pal.accent }}>Sobre mim</h2>
          <p style={{ fontSize:15, lineHeight:1.9 }}>{data.bio||"Sua bio aqui."}</p>
          {data.projects?.length > 0 && (
            <div style={{ marginTop:32 }}>
              {data.projects.map((p,i) => (
                <div key={i} style={{ borderTop:"1px solid rgba(0,0,0,0.12)", paddingTop:18, paddingBottom:18 }}>
                  <div style={{ fontSize:15, fontWeight:700, fontStyle:"italic", marginBottom:5 }}>{p.name}</div>
                  <div style={{ fontSize:13, opacity:0.6, lineHeight:1.7 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize:22, fontStyle:"italic", marginBottom:12, color:pal.accent }}>Especialidades</h2>
          {(data.skills||[]).map((s,i) => (
            <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid rgba(0,0,0,0.08)", fontSize:14, fontFamily:"'Outfit',sans-serif" }}>→ {s}</div>
          ))}
          {data.contact && (
            <div style={{ marginTop:28, padding:16, border:`2px solid ${pal.accent}`, fontSize:12, fontFamily:"'Outfit',sans-serif", lineHeight:1.7, wordBreak:"break-word" }}>
              <div style={{ fontWeight:700, marginBottom:5 }}>Contato</div>{data.contact}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudioTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:"#f8f8f5", color:"#1a1a1a", fontFamily:"'Outfit',sans-serif", padding: mobile ? "28px 20px" : "56px 48px", minHeight:"100%" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:44, flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          {data.photo && (
            <div style={{ width:72, height:72, borderRadius:6, overflow:"hidden", flexShrink:0, border:`2px solid ${pal.accent}30` }}>
              <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize:"clamp(28px,5vw,60px)", fontWeight:700, color:pal.accent, lineHeight:1, wordBreak:"break-word" }}>{data.name||"Seu Nome"}</h1>
            <div style={{ fontSize:14, color:"#888", marginTop:6, fontWeight:300 }}>{data.role||"Profissional"}</div>
          </div>
        </div>
        {data.contact && <div style={{ background:pal.accent, color:"#fff", padding:"12px 20px", fontSize:12, fontWeight:600, wordBreak:"break-word", maxWidth:220 }}>{data.contact}</div>}
      </div>
      <div style={{ background:"#f0f0ed", borderRadius:3, padding:22, marginBottom:28 }}>
        <p style={{ fontSize:15, lineHeight:1.9, color:"#444" }}>{data.bio||"Sua bio aqui."}</p>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
        {(data.skills||[]).map((s,i) => (
          <div key={i} style={{ background:"#f5f5f2", padding:"9px 14px", fontSize:13, fontWeight:500, color:"#333", borderBottom:`3px solid ${pal.accent}` }}>{s}</div>
        ))}
      </div>
      {data.projects?.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap:12 }}>
          {data.projects.map((p,i) => (
            <div key={i} style={{ background:"#f5f5f2", padding:20 }}>
              <div style={{ width:22, height:3, background:pal.accent, marginBottom:10 }} />
              <div style={{ fontSize:14, fontWeight:600, marginBottom:5, color:"#1a1a1a" }}>{p.name}</div>
              <div style={{ fontSize:12, color:"#777", lineHeight:1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BoldTpl({ data, pal, w }) {
  const mobile = col1(w);
  return (
    <div style={{ background:pal.bg, color:pal.text, fontFamily:"'DM Serif Display',serif", padding: mobile ? "28px 20px" : "56px 48px", minHeight:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:16 }}>
        <div style={{ fontSize:"clamp(44px,8vw,110px)", fontWeight:400, lineHeight:0.88, color:pal.accent, wordBreak:"break-word", flex:1 }}>{data.name||"SEU NOME"}</div>
        {data.photo && (
          <div style={{ width: mobile ? 80 : 110, height: mobile ? 96 : 130, overflow:"hidden", flexShrink:0, border:`3px solid ${pal.accent}`, marginTop:4 }}>
            <img src={data.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32, flexWrap:"wrap" }}>
        <div style={{ width:44, height:3, background:pal.accent, opacity:0.6, flexShrink:0 }} />
        <div style={{ fontSize: mobile ? 12 : 14, fontFamily:"'Outfit',sans-serif", fontWeight:300, letterSpacing:3, color:pal.accent, opacity:0.8, textTransform:"uppercase" }}>{data.role||"Profissional"}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1.4fr 1fr", gap: mobile ? 24 : 44, alignItems:"start" }}>
        <div>
          <p style={{ fontSize:15, lineHeight:1.9, color:pal.accent, opacity:0.85, fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{data.bio||"Bio aqui."}</p>
          {data.projects?.length > 0 && (
            <div style={{ marginTop:28, display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap:2 }}>
              {data.projects.map((p,i) => (
                <div key={i} style={{ background:`${pal.accent}12`, padding:"20px 16px", borderTop:`2px solid ${pal.accent}50` }}>
                  <div style={{ fontSize:16, marginBottom:6, color:pal.accent }}>{p.name}</div>
                  <div style={{ fontSize:11, color:pal.accent, opacity:0.55, lineHeight:1.7, fontFamily:"'Outfit',sans-serif" }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize:9, letterSpacing:4, color:pal.accent, opacity:0.45, marginBottom:16, fontFamily:"'Outfit',sans-serif" }}>EXPERTISE</div>
          {(data.skills||[]).map((s,i) => (
            <div key={i} style={{ fontSize: mobile ? 16 : 19, fontStyle:"italic", borderBottom:`1px solid ${pal.accent}20`, paddingBottom:10, marginBottom:10, color:pal.accent }}>{s}</div>
          ))}
          {data.contact && <div style={{ marginTop:20, fontSize:11, color:pal.accent, opacity:0.4, fontFamily:"'Outfit',sans-serif", letterSpacing:2, wordBreak:"break-word" }}>{data.contact}</div>}
        </div>
      </div>
    </div>
  );
}

function PortfolioPreview({ data, template, palette, w }) {
  const pal = getPalette(template, palette);
  const pw = w || 900;
  if (template==="neon")      return <NeonTpl     data={data} pal={pal} w={pw} />;
  if (template==="minimal")   return <MinimalTpl  data={data} pal={pal} w={pw} />;
  if (template==="luxury")    return <LuxuryTpl   data={data} pal={pal} w={pw} />;
  if (template==="glass")     return <GlassTpl    data={data} pal={pal} w={pw} />;
  if (template==="retro")     return <RetroPoster data={data} pal={pal} w={pw} />;
  if (template==="split")     return <SplitTpl    data={data} pal={pal} w={pw} />;
  if (template==="editorial") return <EditorialTpl data={data} pal={pal} w={pw} />;
  if (template==="studio")    return <StudioTpl   data={data} pal={pal} w={pw} />;
  if (template==="bold")      return <BoldTpl     data={data} pal={pal} w={pw} />;
}

function PhotoUpload({ photo, onPhoto }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => onPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]);
  }, []);

  if (photo) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 18px", background:"#ffffff07", border:"1px solid #ffffff12", borderRadius:8, flexWrap:"wrap" }}>
        <div style={{ width:60, height:60, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:"2px solid #e8ff0040" }}>
          <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div style={{ flex:1, minWidth:120 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:3 }}>Foto adicionada ✓</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:10 }}>Aparece em todos os templates</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button style={{ fontSize:11, color:"#e8ff00", background:"transparent", border:"1px solid #e8ff0030", padding:"5px 12px", cursor:"pointer", borderRadius:3 }} onClick={() => fileRef.current.click()}>Trocar foto</button>
            <button style={{ fontSize:11, color:"#666", background:"transparent", border:"1px solid #222", padding:"5px 12px", cursor:"pointer", borderRadius:3 }} onClick={() => onPhoto(null)}>Remover</button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => processFile(e.target.files[0])} />
      </div>
    );
  }

  return (
    <div className={dragging ? "drop-active" : ""}
      onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
      onClick={() => fileRef.current.click()}
      style={{ border:"1px dashed #ffffff18", borderRadius:8, padding:"24px 20px", cursor:"pointer", textAlign:"center", background:"#ffffff04", transition:"background .2s" }}>
      <div style={{ fontSize:28, marginBottom:8 }}>📸</div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:5 }}>Adicionar foto <span style={{ color:"#444", fontWeight:400, fontSize:12 }}>(opcional)</span></div>
      <div style={{ fontSize:12, color:"#3a3a3a", lineHeight:1.6 }}>
        Arrasta aqui ou <span style={{ color:"#e8ff00", textDecoration:"underline" }}>clica pra escolher</span><br />
        JPG, PNG, WEBP · Recomendado: 400×400px
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => processFile(e.target.files[0])} />
    </div>
  );
}

export default function App() {
  const w = useWindowWidth();
  const mobile = w < 640;
  const tablet = w < 900;

  const [step, setStep] = useState("form");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("neon");
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [copiedSite, setCopiedSite] = useState(false);
  const [toast, setToast] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [profGroup, setProfGroup] = useState(null);
  const [form, setForm] = useState({ name:"", role:"", bio:"", skills:"", contact:"", github:"", projects:"", photo:null });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };
  const upd = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const handleRoleChange = v => { upd("role",v); setProfGroup(detectGroup(v)); };
  const handlePhoto = v => { upd("photo",v); if(v) showToast("Foto adicionada! 📸"); };

  const generateBio = async () => {
    if (!form.name||!form.role) { showToast("Coloca pelo menos seu nome e área 😊"); return; }
    setAiLoading(true);
    try {
      const text = await callClaude(`Crie uma bio profissional impactante para um portfólio pessoal. A pessoa chama ${form.name} e trabalha como ${form.role}. ${form.bio?`Ela disse: "${form.bio}".`:""} Escreva em primeira pessoa, 3-4 frases diretas, tom humano e confiante. Só o texto, sem títulos.`);
      setForm(f => ({ ...f, bio:text.trim() }));
      showToast("Bio gerada com sucesso ✨");
    } catch { showToast("Erro na IA — tenta de novo!"); }
    setAiLoading(false);
  };

  const buildPortfolio = () => {
    if (!form.name) { showToast("Só precisamos do seu nome pra começar 😄"); return; }
    const skills = form.skills.split(",").map(s=>s.trim()).filter(Boolean);
    const projects = form.projects
      ? form.projects.split("\n").map(l=>{ const [n,...r]=l.split(":"); return {name:n.trim(),desc:r.join(":").trim()}; }).filter(p=>p.name)
      : [];
    setPortfolioData({ ...form, skills, projects });
    setStep("templates");
  };

  const openShareModal = () => {
    setShareLink(window.location.href.split("?")[0]+"?portfolio=shared");
    setShowShareModal(true);
  };

  const currentPalette = getPalette(selectedTemplate, selectedPalette);

  const orderedTemplates = profGroup
    ? [...TEMPLATES].sort((a,b) => {
        const aR=a.bestFor.includes(profGroup), bR=b.bestFor.includes(profGroup);
        return aR===bR ? 0 : aR ? -1 : 1;
      })
    : TEMPLATES;

  const steps = ["form","templates","customize","preview"];
  const stepIdx = steps.indexOf(step);

  const px = mobile ? "0 16px" : tablet ? "0 28px" : "0 40px";
  const cardPad = mobile ? 18 : 28;

  const S = {
    wrap:    { minHeight:"100vh", background:"#080810", fontFamily:"'Syne',sans-serif", color:"#f0f0f0", display:"flex", flexDirection:"column", width:"100%", overflowX:"hidden" },
    header:  { padding: mobile ? "14px 16px" : "20px 40px", borderBottom:"1px solid #ffffff0a", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, background:"#080810e8", backdropFilter:"blur(16px)", flexWrap:"wrap", gap:8 },
    main:    { flex:1, maxWidth:1080, margin:"0 auto", width:"100%", padding: mobile ? "36px 16px" : tablet ? "44px 28px" : "56px 40px" },
    label:   { fontSize:11, letterSpacing:3, color:"#555", marginBottom:8, textTransform:"uppercase", fontWeight:600 },
    hint:    { fontSize:12, color:"#333", marginTop:7, lineHeight:1.5 },
    input:   { width:"100%", background:"#ffffff07", border:"1px solid #ffffff12", borderRadius:6, padding:"13px 14px", fontSize: mobile ? 14 : 15, color:"#f0f0f0", fontFamily:"'Syne',sans-serif", outline:"none" },
    textarea:{ width:"100%", background:"#ffffff07", border:"1px solid #ffffff12", borderRadius:6, padding:"13px 14px", fontSize:14, color:"#f0f0f0", fontFamily:"'Syne',sans-serif", outline:"none", resize:"vertical" },
    btnY:    { background:"#e8ff00", color:"#080810", border:"none", padding: mobile ? "13px 22px" : "15px 28px", fontSize: mobile ? 12 : 13, fontWeight:700, fontFamily:"'Syne',sans-serif", letterSpacing:2, cursor:"pointer", textTransform:"uppercase", borderRadius:4 },
    btnW:    { background:"transparent", color:"#f0f0f0", border:"1px solid #ffffff18", padding: mobile ? "11px 16px" : "13px 22px", fontSize: mobile ? 12 : 13, fontFamily:"'Syne',sans-serif", letterSpacing:1, cursor:"pointer", borderRadius:4 },
    btnGhost:{ background:"transparent", color:"#555", border:"1px solid #1e1e1e", padding:"7px 14px", fontSize:11, fontFamily:"'Syne',sans-serif", letterSpacing:1, cursor:"pointer", borderRadius:3 },
    card:    { background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:10, padding:cardPad, marginBottom:18 },
    g2:      { display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap:16 },
    tag:     { fontSize:10, letterSpacing:3, padding:"4px 10px", border:"1px solid #e8ff0030", color:"#e8ff00", borderRadius:2 },
    row:     { display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" },
  };

  return (
    <div style={S.wrap}>
      <header style={S.header}>
        <div style={{ fontSize: mobile ? 18 : 20, fontWeight:800, letterSpacing:-0.5, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#e8ff00", fontSize: mobile ? 18 : 22 }}>◆</span>
          FOLIO<span style={{ color:"#e8ff00" }}>AI</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={S.tag}>100% GRÁTIS</div>
          {step!=="form" && (
            <button style={S.btnGhost} onClick={() => { setStep("form"); setPortfolioData(null); }}>← Recomeçar</button>
          )}
        </div>
      </header>

      {toast && (
        <div style={{ position:"fixed", bottom: mobile ? 16 : 28, left: mobile ? 12 : "50%", right: mobile ? 12 : "auto", transform: mobile ? "none" : "translateX(-50%)", background:"#e8ff00", color:"#080810", padding:"11px 20px", fontSize:13, fontWeight:700, letterSpacing:1, zIndex:9999, animation:"fadeUp .3s ease", borderRadius:4, textAlign:"center" }}>
          {toast}
        </div>
      )}

      {showShareModal && (
        <div style={{ position:"fixed", inset:0, background:"#000000d0", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
          <div style={{ ...S.card, maxWidth:480, width:"100%", margin:0 }}>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:5 }}>🔗 Compartilhar seu portfólio</div>
            <div style={{ fontSize:13, color:"#444", marginBottom:18 }}>Manda esse link pra quem quiser ver!</div>
            <div style={{ background:"#ffffff08", border:"1px solid #1e1e1e", padding:"11px 14px", fontSize:12, color:"#888", wordBreak:"break-all", borderRadius:4, marginBottom:14 }}>{shareLink}</div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button style={S.btnY} onClick={() => { navigator.clipboard.writeText(shareLink); setCopiedPortfolio(true); setTimeout(()=>setCopiedPortfolio(false),2000); }}>
                {copiedPortfolio ? "✓ Copiado!" : "Copiar link"}
              </button>
              <button style={S.btnW} onClick={() => setShowShareModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      <main style={S.main}>
        {step!=="form" && (
          <div style={{ display:"flex", gap: mobile ? 4 : 6, marginBottom: mobile ? 32 : 48, alignItems:"center", flexWrap:"wrap" }} className="fi">
            {["Dados","Templates","Cores","Pronto!"].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap: mobile ? 4 : 6, cursor:i<stepIdx?"pointer":"default" }}
                onClick={() => { if(i<stepIdx) setStep(steps[i]); }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:i<stepIdx?"#e8ff00":i===stepIdx?"#e8ff0070":"#1e1e1e", transition:"background .3s", flexShrink:0 }} />
                <span style={{ fontSize: mobile ? 9 : 10, letterSpacing:2, color:i===stepIdx?"#e8ff00":i<stepIdx?"#888":"#2a2a2a" }}>{s.toUpperCase()}</span>
                {i<3 && <div style={{ width: mobile ? 10 : 20, height:1, background:"#181818" }} />}
              </div>
            ))}
          </div>
        )}

        {step==="form" && (
          <div className="fu">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize:"clamp(32px,7vw,64px)", fontWeight:800, letterSpacing:-2, lineHeight:1.05, marginBottom:14 }}>
                Seu portfólio, <br /><span style={{ color:"#e8ff00" }}>em minutos</span> ✦
              </div>
              <div style={{ textAlign: 'center', color:"#5d5d5d", lineHeight:1.7 }}>
                Preenche aí que uma IA cuida do resto pra você. Sem precisar saber design, sem pagar nada.
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:20, color:"#e8ff00" }}>Vamos começar👋</div>

              <div style={{ marginBottom:18 }}>
                <PhotoUpload photo={form.photo} onPhoto={handlePhoto} />
              </div>

              <div style={S.g2}>
                <div>
                  <div style={S.label}>Seu nome</div>
                  <input style={S.input} placeholder="Ex: Ana Lima, João Costa..."
                    value={form.name} onChange={e=>upd("name",e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#e8ff0050"}
                    onBlur={e=>e.target.style.borderColor="#ffffff12"} />
                </div>
                <div>
                  <div style={S.label}>Área / Cargo</div>
                  <input style={S.input} placeholder="Ex: Advogada, Médico, Dev Full Stack..."
                    value={form.role} onChange={e=>handleRoleChange(e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#e8ff0050"}
                    onBlur={e=>e.target.style.borderColor="#ffffff12"} />
                  {profGroup && (
                    <div style={{ marginTop:10, fontSize:12, color:"#e8ff0090", lineHeight:1.6, padding:"10px 14px", background:"#e8ff0008", border:"1px solid #e8ff0015", borderRadius:4 }}>
                      💡 {PROF_TIPS[profGroup]}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                  <div style={S.label}>Sua bio</div>
                  <button style={{ ...S.btnGhost, borderColor:"#e8ff0030", color:"#e8ff00", animation:aiLoading?"shimmer 1s infinite":"none" }}
                    onClick={generateBio} disabled={aiLoading}>
                    {aiLoading ? "⟳ Gerando..." : "✨ Gerar com IA"}
                  </button>
                </div>
                <textarea style={S.textarea} rows={4}
                  placeholder="Conta sobre você — ou deixa em branco e a IA escreve pra você!"
                  value={form.bio} onChange={e=>upd("bio",e.target.value)} />
                <div style={S.hint}>Quanto mais contexto você der, melhor vai ficar 😉</div>
              </div>

              <div style={{ marginTop:18 }}>
                <div style={S.label}>O que você sabe fazer?</div>
                <input style={S.input}
                  placeholder="Ex: Direito Trabalhista, Excel avançado, Inglês fluente, Photoshop..."
                  value={form.skills} onChange={e=>upd("skills",e.target.value)}
                  onFocus={e=>e.target.style.borderColor="#e8ff0050"}
                  onBlur={e=>e.target.style.borderColor="#ffffff12"} />
                <div style={S.hint}>Separa por vírgula!</div>
              </div>

              <div style={{ ...S.g2, marginTop:18 }}>
                <div>
                  <div style={S.label}>Email / Contato</div>
                  <input style={S.input} placeholder="seunome@email.com"
                    value={form.contact} onChange={e=>upd("contact",e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#e8ff0050"}
                    onBlur={e=>e.target.style.borderColor="#ffffff12"} />
                </div>
                <div>
                  <div style={S.label}>LinkedIn / GitHub / Site</div>
                  <input style={S.input} placeholder="linkedin.com/in/seunome"
                    value={form.github} onChange={e=>upd("github",e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#e8ff0050"}
                    onBlur={e=>e.target.style.borderColor="#ffffff12"} />
                </div>
              </div>

              <div style={{ marginTop:18 }}>
                <div style={S.label}>Projetos, casos ou conquistas </div>
                <textarea style={{ ...S.textarea, minHeight:100 }} rows={5}
                  placeholder={"Um por linha — Nome: descrição\n\nEx:\nDefesa trabalhista: Recuperei R$200k para cliente\nApp de finanças: 5 mil usuários ativos\nSite clínica: Aumento de 40% nos agendamentos"}
                  value={form.projects} onChange={e=>upd("projects",e.target.value)} />
                <div style={S.hint}>Qualquer conquista conta!</div>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent: 'center', ...S.row, gap:14 }}>
              <button style={S.btnY} onClick={buildPortfolio}>
                {mobile ? "Próximo →" : "Próximo: escolher design →"}
              </button>
              <div style={{ fontSize:12, color:"#2a2a2a" }}>Você edita depois</div>
            </div>
          </div>
        )}

        {step==="templates" && (
          <div className="fu">
            <div style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:800, letterSpacing:-1, marginBottom:8 }}>Qual look combina com você?</div>
            <div style={{ fontSize: mobile ? 13 : 15, color:"#444", marginBottom:28, lineHeight:1.6 }}>
              {profGroup
                ? `Área de ${PROF_LABELS[profGroup]} detectada — ordenamos os melhores pra você!`
                : "9 designs diferentes, todos profissionais."}
              {form.photo && <span style={{ color:"#e8ff00" }}> Foto integrada em todos! 📸</span>}
            </div>

            <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr 1fr" : tablet ? "repeat(3,1fr)" : "repeat(auto-fill,minmax(190px,1fr))", gap: mobile ? 10 : 14, marginBottom:32 }}>
              {orderedTemplates.map(t => {
                const isRec = profGroup && t.bestFor.includes(profGroup);
                const isSel = selectedTemplate===t.id;
                return (
                  <div key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{ cursor:"pointer", border:isSel?"2px solid #e8ff00":"2px solid #ffffff08", borderRadius:10, overflow:"hidden", transition:"border .15s, transform .15s", transform:isSel?"scale(1.025)":"scale(1)", position:"relative" }}>
                    {t.favorite && <div style={{ position:"absolute", top:8, left:8, zIndex:2, fontSize:8, letterSpacing:2, background:"#e8ff00", color:"#000", padding:"2px 7px", fontWeight:700 }}>⭐ FAV</div>}
                    {isRec && !t.favorite && <div style={{ position:"absolute", top:8, left:8, zIndex:2, fontSize:8, letterSpacing:1, background:"#00f5ff20", color:"#00f5ff", padding:"2px 7px", border:"1px solid #00f5ff30" }}>REC.</div>}
                    {isSel && <div style={{ position:"absolute", top:8, right:8, zIndex:2, background:"#e8ff00", color:"#000", fontSize:9, padding:"2px 7px", fontWeight:700 }}>✓</div>}
                    <div style={{ height: mobile ? 80 : 100, background:t.preview, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize: mobile ? 22 : 28, gap:4 }}>
                      {t.emoji}
                      <div style={{ fontSize:8, color:t.accent, letterSpacing:2, opacity:0.8, fontFamily:"'Syne',sans-serif" }}>{t.id.toUpperCase()}</div>
                    </div>
                    <div style={{ padding: mobile ? "10px 12px" : "12px 14px", background:"#ffffff05" }}>
                      <div style={{ fontSize: mobile ? 12 : 13, fontWeight:700, marginBottom:3 }}>{t.name}</div>
                      <div style={{ fontSize:10, color:"#e8ff00", letterSpacing:1 }}>{t.tagline}</div>
                      {!mobile && <div style={{ fontSize:11, color:"#333", lineHeight:1.5, marginTop:4 }}>{t.vibe}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={S.row}>
              <button style={S.btnY} onClick={() => setStep("customize")}>
                {mobile ? "Próximo →" : "Próximo: personalizar cores →"}
              </button>
              <button style={S.btnW} onClick={() => setStep("preview")}>Pular pro resultado</button>
            </div>
          </div>
        )}

        {step==="customize" && (
          <div className="fu">
            <div style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:800, letterSpacing:-1, marginBottom:8 }}>Escolhe as cores</div>
            <div style={{ fontSize: mobile ? 13 : 15, color:"#444", marginBottom:28 }}>Cada paleta muda completamente o clima. Experimenta!</div>

            <div style={{ display:"grid", gridTemplateColumns: mobile ? "repeat(3,1fr)" : "repeat(auto-fill,minmax(140px,1fr))", gap: mobile ? 8 : 10, marginBottom:28 }}>
              {[...COLOR_PALETTES, { name:"Padrão", auto:true, bg:"#111", text:"#fff", accent:"#555" }].map((p,i) => (
                <div key={i} onClick={() => setSelectedPalette(p.auto ? null : p)} style={{ cursor:"pointer", border:(!selectedPalette&&p.auto)||selectedPalette?.name===p.name?"2px solid #e8ff00":"2px solid #ffffff08", borderRadius:8, overflow:"hidden", transition:"border .15s" }}>
                  <div style={{ height: mobile ? 44 : 52, background:p.bg, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {p.auto
                      ? <span style={{ fontSize:10, color:"#333" }}>padrão</span>
                      : <>
                          <div style={{ width:15, height:15, borderRadius:"50%", background:p.accent, boxShadow:`0 0 6px ${p.accent}50` }} />
                          <div style={{ width:22, height:4, background:p.text, opacity:0.2, borderRadius:2 }} />
                        </>
                    }
                  </div>
                  <div style={{ padding: mobile ? "6px 8px" : "7px 10px", background:"#ffffff05", fontSize: mobile ? 10 : 11, color:"#666" }}>{p.name}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:28 }}>
              <div style={S.label}>Como vai ficar</div>
              <div style={{ height:220, border:"1px solid #ffffff08", borderRadius:8, overflow:"hidden", position:"relative" }}>
                <div style={{ transform:"scale(0.45)", transformOrigin:"top left", width:"222%", pointerEvents:"none" }}>
                  <PortfolioPreview data={portfolioData} template={selectedTemplate} palette={currentPalette} w={900} />
                </div>
              </div>
            </div>

            <div style={S.row}>
              <button style={S.btnY} onClick={() => setStep("preview")}>
                {mobile ? "Ver resultado →" : "Ver o resultado final →"}
              </button>
              <button style={S.btnW} onClick={() => setStep("templates")}>← Templates</button>
            </div>
          </div>
        )}

        {step==="preview" && (
          <div className="fu">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:14 }}>
              <div>
                <div style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:800, letterSpacing:-1, marginBottom:4 }}>Ficou incrível 🎉</div>
                <div style={{ fontSize:12, color:"#333" }}>{TEMPLATES.find(t=>t.id===selectedTemplate)?.name} · {selectedPalette ? selectedPalette.name : "Cores padrão"}</div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button style={S.btnW} onClick={() => setStep("form")}>✏️ {mobile ? "" : "Editar"}</button>
                <button style={S.btnW} onClick={() => { window.print(); showToast("Ctrl+P → Salvar como PDF 📄"); }}>📄 {mobile ? "" : "PDF"}</button>
                <button style={S.btnW} onClick={() => showToast("🖼️ Extensão 'GoFullPage' no Chrome!")}>🖼️ {mobile ? "" : "JPG"}</button>
                <button style={S.btnY} onClick={openShareModal}>🔗 {mobile ? "" : "Compartilhar"}</button>
              </div>
            </div>

            <div style={{ border:"1px solid #ffffff0a", borderRadius:10, overflow:"hidden", boxShadow:"0 32px 80px #000000b0", marginBottom:20 }}>
              <PortfolioPreview data={portfolioData} template={selectedTemplate} palette={currentPalette} w={w} />
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{ ...S.btnGhost, borderColor:selectedTemplate===t.id?"#e8ff0050":"#1e1e1e", color:selectedTemplate===t.id?"#e8ff00":"#444", display:"flex", alignItems:"center", gap:5, fontSize: mobile ? 10 : 11 }}>
                  {t.emoji} {mobile ? "" : t.name}
                </button>
              ))}
            </div>

            <div style={{ ...S.card, borderColor:"#e8ff0015" }}>
              <div style={{ fontSize:13, color:"#444", marginBottom:14 }}>💡 <span style={{ color:"#e8ff00", fontWeight:700 }}>Como salvar e compartilhar</span></div>
              <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
                {[
                  { icon:"🔗", title:"Link direto",    desc:"Clica em Compartilhar acima!" },
                  { icon:"📄", title:"Salvar PDF",      desc:"Clica em PDF → Salvar como PDF" },
                  { icon:"🖼️", title:"Como imagem",    desc:"Extensão GoFullPage no Chrome" },
                  { icon:"📧", title:"Por email",       desc:"Cola o link no email ou LinkedIn" },
                ].map((d,i) => (
                  <div key={i} style={{ padding:"12px 14px", background:"#ffffff04", borderRadius:6, borderLeft:"2px solid #e8ff0025" }}>
                    <div style={{ fontSize:20, marginBottom:5 }}>{d.icon}</div>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{d.title}</div>
                    <div style={{ fontSize:12, color:"#333", lineHeight:1.6 }}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop:"1px solid #ffffff07", padding: mobile ? "36px 16px 28px" : "52px 40px 36px", background:"#040407" }}>
        <div style={{ maxWidth:1080, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 32 : 48, alignItems:"start", marginBottom:36 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:800, letterSpacing:-0.5, marginBottom:10 }}>
                <span style={{ color:"#e8ff00" }}>◆</span> FOLIO<span style={{ color:"#e8ff00" }}>AI</span>
              </div>
              <div style={{ fontSize:14, color:"#333", lineHeight:1.75, maxWidth:360, marginBottom:18 }}>
                Gerador de portfólio gratuito com IA. Pra quem quer ser encontrado sem precisar saber programar ou pagar caro.
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <div style={S.tag}>100% GRATUITO</div>
                <div style={S.tag}>SEM CADASTRO</div>
                <div style={S.tag}>9 TEMPLATES</div>
                <div style={S.tag}>IA INCLUSA</div>
              </div>
            </div>

            <div style={{ background:"#ffffff05", border:"1px solid #ffffff0a", borderRadius:12, padding: mobile ? 20 : 28 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:5 }}>Gostou? Compartilha! 🚀</div>
              <div style={{ fontSize:13, color:"#383838", marginBottom:18, lineHeight:1.6 }}>
                Manda pra um amigo que precise de um portfólio bonito e rápido. É de graça pra todo mundo!
              </div>
              <div style={{ background:"#ffffff08", border:"1px solid #1a1a1a", padding:"10px 14px", borderRadius:4, fontSize:12, color:"#3a3a3a", marginBottom:14, wordBreak:"break-all", fontFamily:"monospace" }}>
                {window.location.href.split("?")[0]}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button style={{ ...S.btnY, padding:"11px 20px" }}
                  onClick={() => { navigator.clipboard.writeText(window.location.href.split("?")[0]); setCopiedSite(true); setTimeout(()=>setCopiedSite(false),2500); }}>
                  {copiedSite ? "✓ Copiado!" : "Copiar link"}
                </button>
                <button style={{ ...S.btnW, padding:"10px 16px", fontSize:12 }}
                  onClick={() => window.open(`https://wa.me/?text=Cria%20seu%20portf%C3%B3lio%20de%20gra%C3%A7a%20com%20IA%20%E2%86%92%20${window.location.href.split("?")[0]}`,"_blank")}>
                  💬 WhatsApp
                </button>
                <button style={{ ...S.btnW, padding:"10px 16px", fontSize:12 }}
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=Criei%20meu%20portf%C3%B3lio%20com%20IA%20e%20%C3%A9%20de%20gra%C3%A7a!%20${window.location.href.split("?")[0]}`,"_blank")}>
                  𝕏 Twitter
                </button>
              </div>
            </div>
          </div>

          <div style={{ borderTop:"1px solid #0e0e0e", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ fontSize:11, color:"#222", letterSpacing:2 }}>FOLIO·AI — {new Date().getFullYear()}</div>
            <div style={{ fontSize:11, color:"#222" }}>Gratuito pra sempre · Sem cadastro <br /> <span style={{ color:"#e8ff00" }}>DESENVOLVIDO POR ELLIEDEVZONE</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}