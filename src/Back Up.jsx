import { useState, useReducer, useEffect, useCallback } from "react";

// ─── FONTS & GLOBAL STYLES ────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; background: #080c12; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2d40; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #2a3f58; }
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
    select option { background: #0d1621; color: #c8d6e5; }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }
    @keyframes slide-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes bar-fill { from{width:0} to{width:var(--w)} }
    @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.85} 94%{opacity:1} 96%{opacity:.9} 97%{opacity:1} }
  `}</style>
);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED = {
  rawMaterials: [
    { id:"RM001", name:"Steel Sheet 2mm",  unit:"kg",  cost:2.40, stock:1200, minStock:300 },
    { id:"RM002", name:"Aluminum Extrusion 40x40", unit:"m", cost:8.50, stock:180, minStock:80 },
    { id:"RM003", name:"M8 Bolts (box/100)", unit:"box", cost:12.00, stock:45, minStock:20 },
    { id:"RM004", name:"Hydraulic Hose 12mm", unit:"m", cost:6.20, stock:320, minStock:100 },
    { id:"RM005", name:"Bearing 6205-2RS", unit:"pcs", cost:4.80, stock:88, minStock:50 },
    { id:"RM006", name:"Control PCB Assembly", unit:"pcs", cost:38.00, stock:22, minStock:15 },
    { id:"RM007", name:"Rubber Seal Kit", unit:"set", cost:9.50, stock:8,  minStock:25 },
    { id:"RM008", name:"Stainless Pipe Ø50mm", unit:"m", cost:14.00, stock:95, minStock:40 },
    { id:"RM009", name:"Paint — RAL 7016", unit:"L", cost:18.00, stock:35, minStock:20 },
    { id:"RM010", name:"Wiring Harness A-12", unit:"pcs", cost:52.00, stock:14, minStock:10 },
  ],
  finishedGoods: [
    { id:"FG001", name:"External WiFi Module Final Assembly",          category:"Electronics",  leadDays:3, basePrice:320  },
    { id:"FG002", name:"G3 Picatinny Mount - ( C Interface )",         category:"Mounts",       leadDays:4, basePrice:185  },
    { id:"FG003", name:"G3 Picatinny Mount - Local",                   category:"Mounts",       leadDays:4, basePrice:165  },
    { id:"FG004", name:"HMG Picatinny Mount - ( Chair Interface )",    category:"Mounts",       leadDays:4, basePrice:210  },
    { id:"FG005", name:"LMG Picatinny Mount - ( Hinge Interface )",    category:"Mounts",       leadDays:4, basePrice:220  },
    { id:"FG006", name:"NVG / Low Light Telescope - P45 Tube",         category:"Optics",       leadDays:5, basePrice:890  },
    { id:"FG007", name:"Night Vision Goggles",                         category:"Optics",       leadDays:7, basePrice:2400 },
    { id:"FG008", name:"ORCA NV",                                      category:"Optics",       leadDays:6, basePrice:1950 },
    { id:"FG009", name:"SKUA Complete with accessories",               category:"SKUA Systems", leadDays:8, basePrice:3200 },
    { id:"FG010", name:"SKUA Complete with accessories (12um Wifi)",   category:"SKUA Systems", leadDays:8, basePrice:3600 },
    { id:"FG011", name:"SKUA Complete with accessories (12um)",        category:"SKUA Systems", leadDays:8, basePrice:3400 },
    { id:"FG012", name:"SKUA MP - MINI - DAY LASER RANGE FINDER",      category:"SKUA Systems", leadDays:6, basePrice:2800 },
    { id:"FG013", name:"SKUA MP PRO",                                  category:"SKUA Systems", leadDays:7, basePrice:4100 },
    { id:"FG014", name:"SMG Picatinny Mount - ( Cover Rail )",         category:"Mounts",       leadDays:4, basePrice:195  },
    { id:"FG015", name:"SMG Picatinny Mount - ( Cover Rail ) (Local)", category:"Mounts",       leadDays:4, basePrice:175  },
    { id:"FG016", name:"SSR Picatinny Mount - ( Dovetail Interface )", category:"Mounts",       leadDays:4, basePrice:230  },
    { id:"FG017", name:"TARSIER LR 80 Assembly",                      category:"TARSIER",      leadDays:9, basePrice:5200 },
    { id:"FG018", name:"TARSIER LR 80 LRF Assembly",                  category:"TARSIER",      leadDays:9, basePrice:5800 },
    { id:"FG019", name:"TARSIER LR Final with accessories",           category:"TARSIER",      leadDays:10,basePrice:6400 },
    { id:"FG020", name:"TWS Mini Final 35MF",                         category:"TWS",          leadDays:6, basePrice:2100 },
    { id:"FG021", name:"TWS Mini Final 50MF",                         category:"TWS",          leadDays:6, basePrice:2300 },
    { id:"FG022", name:"TWS Mini Final 50MF 12um",                    category:"TWS",          leadDays:6, basePrice:2600 },
    { id:"FG023", name:"TWS Mini Final 50MF 12um - MK",               category:"TWS",          leadDays:7, basePrice:2750 },
    { id:"FG024", name:"Video Extension Cable 10 M",                  category:"Cables",       leadDays:2, basePrice:95   },
    { id:"FG025", name:"Video Extension Cable 10 M - Local",          category:"Cables",       leadDays:2, basePrice:85   },
    { id:"FG026", name:"Video Extension Cable 18 M",                  category:"Cables",       leadDays:2, basePrice:140  },
    { id:"FG027", name:"Video Extension Cable 18 M ( Local RCA )",    category:"Cables",       leadDays:2, basePrice:125  },
    { id:"FG028", name:"Video Extension Cable 4.1 M",                 category:"Cables",       leadDays:2, basePrice:65   },
    { id:"FG029", name:"Video Extension Cable 4.1 M ( Local RCA )",   category:"Cables",       leadDays:2, basePrice:58   },
    { id:"FG030", name:"Video Extension Cable 50 M",                  category:"Cables",       leadDays:3, basePrice:310  },
    { id:"FG031", name:"Video Extension Cable 50 M ( Local RCA )",    category:"Cables",       leadDays:3, basePrice:280  },
    { id:"FG032", name:"Video Extension Cable 6.1 M",                 category:"Cables",       leadDays:2, basePrice:72   },
    { id:"FG033", name:"Video Extension Cable 6.1 M ( Local RCA )",   category:"Cables",       leadDays:2, basePrice:65   },
  ],
  bom: {
    FG001: [
      { materialId:"RM006", qty:1,  operation:"PCB integration" },
      { materialId:"RM010", qty:1,  operation:"WiFi wiring harness" },
      { materialId:"RM003", qty:1,  operation:"Module fasteners" },
    ],
    FG007: [
      { materialId:"RM006", qty:2,  operation:"Image intensifier PCB" },
      { materialId:"RM010", qty:1,  operation:"Internal wiring" },
      { materialId:"RM005", qty:2,  operation:"Optic bearings" },
      { materialId:"RM009", qty:1,  operation:"Housing paint" },
      { materialId:"RM003", qty:1,  operation:"Assembly fasteners" },
    ],
    FG008: [
      { materialId:"RM006", qty:2,  operation:"NV PCB assembly" },
      { materialId:"RM010", qty:1,  operation:"Wiring harness" },
      { materialId:"RM005", qty:2,  operation:"Rotation bearings" },
      { materialId:"RM009", qty:1,  operation:"Housing finish" },
    ],
    FG009: [
      { materialId:"RM006", qty:3,  operation:"Control PCB stack" },
      { materialId:"RM010", qty:2,  operation:"System wiring" },
      { materialId:"RM005", qty:4,  operation:"Gimbal bearings" },
      { materialId:"RM003", qty:2,  operation:"Assembly fasteners" },
      { materialId:"RM009", qty:1,  operation:"Enclosure coating" },
    ],
    FG017: [
      { materialId:"RM002", qty:4,  operation:"Optical rail frame" },
      { materialId:"RM006", qty:2,  operation:"Range finding PCB" },
      { materialId:"RM010", qty:2,  operation:"System wiring" },
      { materialId:"RM005", qty:6,  operation:"Focus mechanism bearings" },
      { materialId:"RM003", qty:3,  operation:"Structural fasteners" },
      { materialId:"RM009", qty:2,  operation:"Housing paint" },
    ],
    FG020: [
      { materialId:"RM006", qty:1,  operation:"Sensor PCB" },
      { materialId:"RM010", qty:1,  operation:"Wiring harness" },
      { materialId:"RM005", qty:2,  operation:"Lens bearings" },
      { materialId:"RM003", qty:1,  operation:"Assembly fasteners" },
    ],
    FG024: [
      { materialId:"RM004", qty:10, operation:"Cable assembly" },
      { materialId:"RM007", qty:1,  operation:"Connector sealing" },
    ],
    FG030: [
      { materialId:"RM004", qty:50, operation:"Long-run cable assembly" },
      { materialId:"RM007", qty:2,  operation:"Connector sealing" },
      { materialId:"RM003", qty:1,  operation:"Strain relief" },
    ],
  },
  salesOrders: [
    { id:"SO-0041", customer:"Meridian Defence",     fgId:"FG017", qty:2, date:"2024-01-14", dueDate:"2024-01-28", status:"In Production", priority:"HIGH",   total:10400, notes:"Urgent delivery — field deployment" },
    { id:"SO-0042", customer:"Delta Optics Ltd",     fgId:"FG009", qty:3, date:"2024-01-16", dueDate:"2024-01-25", status:"Picking",       priority:"NORMAL", total:9600,  notes:"" },
    { id:"SO-0043", customer:"Nexus Security",       fgId:"FG007", qty:2, date:"2024-01-18", dueDate:"2024-01-30", status:"Pending",       priority:"NORMAL", total:4800,  notes:"" },
    { id:"SO-0044", customer:"Apex Systems",         fgId:"FG020", qty:4, date:"2024-01-20", dueDate:"2024-01-28", status:"Pending",       priority:"HIGH",   total:8400,  notes:"Urgent — training exercise deadline" },
    { id:"SO-0045", customer:"Ironfield Tactical",   fgId:"FG008", qty:1, date:"2024-01-22", dueDate:"2024-02-05", status:"Quote",         priority:"NORMAL", total:1950,  notes:"" },
  ],
  workOrders: [
    { id:"WO-0019", soId:"SO-0041", fgId:"FG017", qty:2, line:"Line A", status:"In Progress", stage:"Assembly",    progress:72, startDate:"2024-01-20", endDate:"2024-01-28" },
    { id:"WO-0020", soId:"SO-0042", fgId:"FG009", qty:3, line:"Line B", status:"In Progress", stage:"Fabrication", progress:35, startDate:"2024-01-22", endDate:"2024-01-25" },
    { id:"WO-0021", soId:"SO-0043", fgId:"FG007", qty:2, line:"Line A", status:"Scheduled",   stage:"Pending",     progress:0,  startDate:"2024-01-26", endDate:"2024-01-30" },
  ],
  purchaseOrders: [
    { id:"PO-0088", supplier:"MetalCore Ltd",    materialId:"RM001", qty:800,  unitCost:2.20, status:"In Transit", orderDate:"2024-01-12", etaDate:"2024-01-25", total:1760 },
    { id:"PO-0089", supplier:"SealTech GmbH",    materialId:"RM007", qty:80,   unitCost:9.00, status:"Ordered",    orderDate:"2024-01-18", etaDate:"2024-01-28", total:720  },
    { id:"PO-0090", supplier:"BearingWorld",     materialId:"RM005", qty:150,  unitCost:4.50, status:"Ordered",    orderDate:"2024-01-19", etaDate:"2024-02-01", total:675  },
    { id:"PO-0091", supplier:"PCB Express",      materialId:"RM006", qty:30,   unitCost:36.00,status:"Confirmed",  orderDate:"2024-01-20", etaDate:"2024-01-30", total:1080 },
  ],
  suppliers: [
    { id:"SUP01", name:"MetalCore Ltd",      contact:"James Wu",       email:"j.wu@metalcore.com",   phone:"+44 161 500 1201", rating:4.8, leadDays:8,  category:"Raw Metal" },
    { id:"SUP02", name:"SealTech GmbH",      contact:"Petra Braun",    email:"p.braun@sealtech.de",  phone:"+49 89 4400 7700", rating:4.2, leadDays:10, category:"Seals & Gaskets" },
    { id:"SUP03", name:"BearingWorld",       contact:"Karen Mills",    email:"k.mills@bworld.co.uk", phone:"+44 117 930 4455", rating:4.6, leadDays:7,  category:"Mechanical" },
    { id:"SUP04", name:"PCB Express",        contact:"Tony Reyes",     email:"t.reyes@pcbexpress.io", phone:"+1 512 700 9900", rating:4.9, leadDays:9,  category:"Electronics" },
    { id:"SUP05", name:"AlumaTech Corp",     contact:"Rachel Ford",    email:"r.ford@alumatech.com", phone:"+1 416 844 3322", rating:4.3, leadDays:12, category:"Aluminum" },
  ],
};

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function appReducer(state, { type, payload }) {
  switch(type) {
    case "ADD_SO":       return { ...state, salesOrders: [payload, ...state.salesOrders] };
    case "UPDATE_SO":    return { ...state, salesOrders: state.salesOrders.map(o => o.id===payload.id ? {...o,...payload} : o) };
    case "ADD_WO":       return { ...state, workOrders: [payload, ...state.workOrders] };
    case "UPDATE_WO":    return { ...state, workOrders: state.workOrders.map(w => w.id===payload.id ? {...w,...payload} : w) };
    case "ADD_PO":       return { ...state, purchaseOrders: [payload, ...state.purchaseOrders] };
    case "ADJUST_STOCK": return { ...state, rawMaterials: state.rawMaterials.map(m => m.id===payload.id ? {...m, stock:payload.stock} : m) };
    default: return state;
  }
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt$  = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const fmtDt = d => d ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const genId = prefix => `${prefix}-${String(Math.floor(Math.random()*9000)+1000)}`;

const STATUS_META = {
  "Quote":       { color:"#4a5568", bg:"#2d3748" },
  "Pending":     { color:"#718096", bg:"#2d3748" },
  "Picking":     { color:"#ed8936", bg:"#7b341e22" },
  "In Progress": { color:"#ecc94b", bg:"#74510022" },
  "In Production":{ color:"#ecc94b",bg:"#74510022" },
  "Assembly":    { color:"#ecc94b", bg:"#74510022" },
  "Scheduled":   { color:"#63b3ed", bg:"#1a4a7022" },
  "Confirmed":   { color:"#63b3ed", bg:"#1a4a7022" },
  "Ordered":     { color:"#63b3ed", bg:"#1a4a7022" },
  "In Transit":  { color:"#90cdf4", bg:"#153e6022" },
  "Completed":   { color:"#68d391", bg:"#1c4a2c22" },
  "Shipped":     { color:"#68d391", bg:"#1c4a2c22" },
  "Received":    { color:"#68d391", bg:"#1c4a2c22" },
  "Delivered":   { color:"#68d391", bg:"#1c4a2c22" },
  "Cancelled":   { color:"#fc8181", bg:"#4a1c1c22" },
  "Low Stock":   { color:"#fc8181", bg:"#4a1c1c22" },
  "Critical":    { color:"#fc8181", bg:"#4a1c1c22" },
  "Normal":      { color:"#68d391", bg:"#1c4a2c22" },
  "Overstock":   { color:"#ed8936", bg:"#7b341e22" },
};

const Chip = ({ label }) => {
  const m = STATUS_META[label] || { color:"#94a3b8", bg:"#1e2d3d" };
  return (
    <span style={{ background:m.bg, color:m.color, border:`1px solid ${m.color}33`, borderRadius:3,
      padding:"2px 8px", fontSize:10, fontWeight:700, letterSpacing:"0.08em",
      textTransform:"uppercase", whiteSpace:"nowrap", fontFamily:"'Barlow Condensed', sans-serif" }}>
      {label}
    </span>
  );
};

const PriorityFlag = ({ p }) => (
  <span style={{ color: p==="HIGH"?"#fc8181":"#4a5568", fontSize:10, fontWeight:800,
    fontFamily:"'Share Tech Mono',monospace", letterSpacing:"0.06em" }}>
    {p==="HIGH" ? "▲ HIGH" : "◆ STD"}
  </span>
);

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card = ({ children, style={} }) => (
  <div style={{ background:"#0d1621", border:"1px solid #1a2a3a", borderRadius:6,
    boxShadow:"0 2px 12px #00000055", ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children, accent="#ff6b2b" }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
    <div style={{ width:3, height:16, background:accent, borderRadius:1 }} />
    <span style={{ color:"#8fadc5", fontSize:10, fontWeight:700, letterSpacing:"0.12em",
      textTransform:"uppercase", fontFamily:"'Barlow Condensed', sans-serif" }}>{children}</span>
  </div>
);

const Tbl = ({ heads, rows, style={} }) => (
  <table style={{ width:"100%", borderCollapse:"collapse", ...style }}>
    <thead>
      <tr>{heads.map(h=>(
        <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"#3a5068",
          fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
          fontFamily:"'Share Tech Mono',monospace", borderBottom:"1px solid #111d2a",
          background:"#080e18", whiteSpace:"nowrap" }}>{h}</th>
      ))}</tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>
);

const TR = ({ cells, highlight=false }) => (
  <tr style={{ borderBottom:"1px solid #0d1926", background: highlight?"#0f1e2d":"transparent",
    transition:"background .12s", cursor:"default" }}
    onMouseEnter={e=>e.currentTarget.style.background="#111f30"}
    onMouseLeave={e=>e.currentTarget.style.background=highlight?"#0f1e2d":"transparent"}>
    {cells.map((c,i)=>(
      <td key={i} style={{ padding:"10px 14px", verticalAlign:"middle" }}>{c}</td>
    ))}
  </tr>
);

const T = ({ v, dim=false, mono=false, bold=false, color }) => (
  <span style={{ color: color||(dim?"#3a5068":"#8fadc5"), fontSize:12,
    fontFamily: mono?"'Share Tech Mono',monospace":"'Barlow',sans-serif",
    fontWeight: bold?600:400 }}>{v}</span>
);

const Input = ({ ...p }) => (
  <input {...p} style={{ width:"100%", background:"#060d18", border:"1px solid #1a2a3a",
    color:"#c8d6e5", padding:"8px 10px", borderRadius:4, fontSize:12,
    fontFamily:"'Barlow',sans-serif", outline:"none",
    boxSizing:"border-box", ...p.style }}
    onFocus={e=>e.target.style.borderColor="#ff6b2b88"}
    onBlur={e=>e.target.style.borderColor="#1a2a3a"} />
);

const Sel = ({ children, ...p }) => (
  <select {...p} style={{ width:"100%", background:"#060d18", border:"1px solid #1a2a3a",
    color:"#c8d6e5", padding:"8px 10px", borderRadius:4, fontSize:12,
    fontFamily:"'Barlow',sans-serif", outline:"none",
    boxSizing:"border-box", ...p.style }}
    onFocus={e=>e.target.style.borderColor="#ff6b2b88"}
    onBlur={e=>e.target.style.borderColor="#1a2a3a"}>
    {children}
  </select>
);

const Label = ({ children }) => (
  <div style={{ color:"#3a5068", fontSize:9, fontWeight:700, letterSpacing:"0.12em",
    textTransform:"uppercase", fontFamily:"'Share Tech Mono',monospace", marginBottom:5 }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant="primary", small=false, disabled=false }) => {
  const colors = {
    primary:  { bg:"#c1440e", hover:"#d4521a", text:"#fff", border:"#ff6b2b44" },
    ghost:    { bg:"transparent", hover:"#111d2a", text:"#8fadc5", border:"#1a2a3a" },
    blue:     { bg:"#0d2d48", hover:"#113a5e", text:"#63b3ed", border:"#1a4a7044" },
    danger:   { bg:"#2d1212", hover:"#3d1a1a", text:"#fc8181", border:"#4a1c1c44" },
    success:  { bg:"#0f2d1c", hover:"#163d26", text:"#68d391", border:"#1c4a2c44" },
  };
  const c = colors[variant]||colors.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.text,
        padding: small?"4px 10px":"8px 16px", borderRadius:4, fontSize: small?10:12,
        fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:"0.06em",
        textTransform:"uppercase", cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1,
        transition:"background .15s", whiteSpace:"nowrap" }}
      onMouseEnter={e=>{ if(!disabled) e.target.style.background=c.hover; }}
      onMouseLeave={e=>{ e.target.style.background=c.bg; }}>
      {children}
    </button>
  );
};

const Modal = ({ title, onClose, children, width=520 }) => (
  <div style={{ position:"fixed", inset:0, background:"#000000bb", zIndex:999,
    display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
    onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
    <Card style={{ width:"100%", maxWidth:width, maxHeight:"88vh", overflow:"auto",
      border:"1px solid #1e3348", boxShadow:"0 20px 60px #00000088",
      animation:"slide-in .2s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"14px 20px", borderBottom:"1px solid #0d1926", background:"#080e18" }}>
        <span style={{ color:"#c8d6e5", fontSize:14, fontWeight:700,
          fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.04em",
          textTransform:"uppercase" }}>{title}</span>
        <button onClick={onClose} style={{ background:"none", border:"none",
          color:"#3a5068", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px" }}>✕</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </Card>
  </div>
);

const Field = ({ label, children, half=false }) => (
  <div style={{ marginBottom:14, width:half?"calc(50% - 6px)":"100%" }}>
    <Label>{label}</Label>
    {children}
  </div>
);

const Row2 = ({ children }) => (
  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>{children}</div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent="#ff6b2b", icon }) => (
  <Card style={{ padding:"16px 18px", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, right:0, width:40, height:40,
      background:`${accent}11`, borderRadius:"0 6px 0 40px" }} />
    <div style={{ color:"#2a3d50", fontSize:22, marginBottom:6 }}>{icon}</div>
    <div style={{ color:"#3a5068", fontSize:9, fontWeight:700, letterSpacing:"0.12em",
      textTransform:"uppercase", fontFamily:"'Share Tech Mono',monospace", marginBottom:4 }}>{label}</div>
    <div style={{ color:accent, fontFamily:"'Barlow Condensed',sans-serif",
      fontSize:30, fontWeight:800, lineHeight:1, letterSpacing:"-0.01em" }}>{value}</div>
    {sub && <div style={{ color:"#2a3d50", fontSize:10, marginTop:4,
      fontFamily:"'Barlow',sans-serif" }}>{sub}</div>}
  </Card>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const Progress = ({ value, color="#ecc94b", height=6 }) => (
  <div style={{ background:"#0a1520", borderRadius:2, height, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(value,100)}%`, height:"100%",
      background:`linear-gradient(90deg,${color}88,${color})`, borderRadius:2,
      transition:"width .6s ease" }} />
  </div>
);

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dash",   label:"Command Center",  icon:"◈" },
  { id:"mfg",    label:"Manufacturing",   icon:"⚙" },
  { id:"inv",    label:"Inventory",       icon:"▦" },
  { id:"sales",  label:"Sales Orders",    icon:"◻" },
  { id:"prod",   label:"Production",      icon:"▷" },
  { id:"proc",   label:"Procurement",     icon:"⊞" },
];

// ════════════════════════════════════════════════════════════════════════════
// MODULE: DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const Dashboard = ({ S }) => {
  const { salesOrders, workOrders, rawMaterials, purchaseOrders, finishedGoods, bom } = S;
  const activeWOs   = workOrders.filter(w=>w.status==="In Progress");
  const pendingSOs  = salesOrders.filter(o=>["Pending","Quote","Picking"].includes(o.status));
  const critStock   = rawMaterials.filter(m=>m.stock <= m.minStock);
  const openPOs     = purchaseOrders.filter(p=>p.status!=="Received");
  const revenue     = salesOrders.filter(o=>o.status==="Delivered"||o.status==="Shipped").reduce((s,o)=>s+o.total,0);
  const pipeline    = salesOrders.filter(o=>!["Cancelled"].includes(o.status)).reduce((s,o)=>s+o.total,0);

  const soStatusCounts = ["Quote","Pending","Picking","In Production","Shipped","Delivered"]
    .map(s=>({ s, n: salesOrders.filter(o=>o.status===s).length }));

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase", lineHeight:1 }}>
          Command Center
        </h1>
        <p style={{ color:"#2a3d50", fontSize:11, marginTop:4, fontFamily:"'Barlow',sans-serif" }}>
          Assembly / Make-to-Order · Real-time Operations
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10, marginBottom:20 }}>
        <StatCard label="Pipeline Value"   value={fmt$(pipeline)} sub={`${salesOrders.filter(o=>o.status!=="Cancelled").length} active orders`} accent="#ff6b2b" icon="◈" />
        <StatCard label="Revenue Shipped"  value={fmt$(revenue)}  sub="Invoiced this period" accent="#68d391" icon="▲" />
        <StatCard label="Active Work Orders" value={activeWOs.length} sub={`${workOrders.filter(w=>w.status==="Scheduled").length} scheduled`} accent="#ecc94b" icon="⚙" />
        <StatCard label="Awaiting Fulfilment" value={pendingSOs.length} sub="Orders to process" accent="#63b3ed" icon="◻" />
        <StatCard label="Critical Stock"   value={critStock.length} sub="Below minimum level" accent="#fc8181" icon="▼" />
        <StatCard label="Open POs"         value={openPOs.length} sub={fmt$(openPOs.reduce((s,p)=>s+p.total,0))+" committed"} accent="#b794f4" icon="⊞" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:14, marginBottom:14 }}>
        {/* Active Work Orders */}
        <Card style={{ padding:18 }}>
          <SectionTitle accent="#ecc94b">Active Work Orders</SectionTitle>
          {activeWOs.length===0 && <T v="No active work orders" dim />}
          {activeWOs.map(wo=>{
            const fg = finishedGoods.find(f=>f.id===wo.fgId);
            const so = salesOrders.find(s=>s.id===wo.soId);
            return (
              <div key={wo.id} style={{ marginBottom:14, paddingBottom:14,
                borderBottom:"1px solid #0d1926" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div>
                    <span style={{ color:"#ecc94b", fontSize:11, fontFamily:"'Share Tech Mono',monospace",
                      marginRight:8 }}>{wo.id}</span>
                    <span style={{ color:"#8fadc5", fontSize:13, fontWeight:600,
                      fontFamily:"'Barlow Condensed',sans-serif" }}>{fg?.name}</span>
                  </div>
                  <Chip label={wo.stage} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  marginBottom:6 }}>
                  <T v={`Qty ${wo.qty} · ${wo.line} · for ${so?.customer}`} dim />
                  <T v={`${wo.progress}%`} bold color="#ecc94b" />
                </div>
                <Progress value={wo.progress} color="#ecc94b" />
              </div>
            );
          })}
        </Card>

        {/* Alerts */}
        <Card style={{ padding:18 }}>
          <SectionTitle accent="#fc8181">Alerts & Actions Required</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {critStock.map(m=>(
              <div key={m.id} style={{ background:"#1a0d0d", border:"1px solid #4a1c1c33",
                borderLeft:"3px solid #fc8181", borderRadius:4, padding:"8px 10px" }}>
                <div style={{ color:"#fc8181", fontSize:10, fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>
                  Low Stock — {m.name}
                </div>
                <div style={{ color:"#5a3030", fontSize:11 }}>
                  {m.stock} {m.unit} remaining · min {m.minStock} {m.unit}
                </div>
              </div>
            ))}
            {salesOrders.filter(o=>o.priority==="HIGH"&&o.status!=="Delivered").map(o=>(
              <div key={o.id} style={{ background:"#1a1000", border:"1px solid #7b341e33",
                borderLeft:"3px solid #ed8936", borderRadius:4, padding:"8px 10px" }}>
                <div style={{ color:"#ed8936", fontSize:10, fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>
                  High Priority — {o.id}
                </div>
                <div style={{ color:"#5a3a18", fontSize:11 }}>
                  {o.customer} · Due {fmtDt(o.dueDate)}
                  {o.notes && <span style={{ marginLeft:6, fontStyle:"italic" }}>— {o.notes}</span>}
                </div>
              </div>
            ))}
            {openPOs.filter(p=>p.status==="In Transit").map(p=>{
              const m = SEED.rawMaterials.find(r=>r.id===p.materialId);
              return (
                <div key={p.id} style={{ background:"#0d1526", border:"1px solid #1a4a7033",
                  borderLeft:"3px solid #63b3ed", borderRadius:4, padding:"8px 10px" }}>
                  <div style={{ color:"#63b3ed", fontSize:10, fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>
                    In Transit — {p.id}
                  </div>
                  <div style={{ color:"#1e3a55", fontSize:11 }}>{m?.name} · ETA {fmtDt(p.etaDate)}</div>
                </div>
              );
            })}
            {[...critStock,...salesOrders.filter(o=>o.priority==="HIGH"&&o.status!=="Delivered"),...openPOs.filter(p=>p.status==="In Transit")].length===0 &&
              <T v="✓ All systems nominal" color="#68d391" />}
          </div>
        </Card>
      </div>

      {/* Order pipeline funnel */}
      <Card style={{ padding:18 }}>
        <SectionTitle>Order Pipeline Status</SectionTitle>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {soStatusCounts.map(({s,n})=>{
            const m = STATUS_META[s]||{color:"#3a5068",bg:"#111d2a"};
            return (
              <div key={s} style={{ background:m.bg, border:`1px solid ${m.color}22`,
                borderRadius:4, padding:"10px 16px", minWidth:80, textAlign:"center" }}>
                <div style={{ color:m.color, fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:28, fontWeight:800, lineHeight:1 }}>{n}</div>
                <div style={{ color:"#2a3d50", fontSize:9, fontWeight:700,
                  letterSpacing:"0.1em", textTransform:"uppercase", marginTop:4,
                  fontFamily:"'Share Tech Mono',monospace" }}>{s}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: MANUFACTURING (BOM + MTO)
// ════════════════════════════════════════════════════════════════════════════
const Manufacturing = ({ S }) => {
  const { finishedGoods, bom, rawMaterials } = S;
  const [selectedFG, setSelectedFG] = useState(finishedGoods[0].id);
  const [buildQty, setBuildQty] = useState(1);

  const fg      = finishedGoods.find(f=>f.id===selectedFG);
  const bomLines = bom[selectedFG] || [];

  const feasibility = bomLines.map(line => {
    const mat  = rawMaterials.find(m=>m.id===line.materialId);
    const need = line.qty * buildQty;
    const has  = mat?.stock || 0;
    const ok   = has >= need;
    const pct  = Math.min((has/need)*100, 100);
    return { ...line, mat, need, has, ok, pct };
  });

  const canBuild   = feasibility.every(f=>f.ok);
  const shortfalls = feasibility.filter(f=>!f.ok);
  const totalMaterialCost = feasibility.reduce((s,f)=>{
    return s + (f.mat?.cost||0)*f.line?.qty*buildQty;
  }, feasibility.reduce((s,f)=>s+(f.mat?.cost||0)*f.need,0) / (feasibility.length||1) * 0);

  const materialCost = bomLines.reduce((s,l)=>{
    const m = rawMaterials.find(r=>r.id===l.materialId);
    return s + (m?.cost||0)*l.qty;
  }, 0) * buildQty;

  const margin = fg ? ((fg.basePrice - materialCost/buildQty)/fg.basePrice*100).toFixed(1) : 0;

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase" }}>
          Manufacturing & BOM
        </h1>
        <p style={{ color:"#2a3d50", fontSize:11, marginTop:4 }}>
          Bill of Materials · Feasibility Check · Material Requirements
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card style={{ padding:18 }}>
          <SectionTitle accent="#ff6b2b">Finished Goods</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {finishedGoods.map(fg=>(
              <div key={fg.id} onClick={()=>setSelectedFG(fg.id)}
                style={{ background: selectedFG===fg.id?"#0f2030":"#080e18",
                  border:`1px solid ${selectedFG===fg.id?"#ff6b2b55":"#1a2a3a"}`,
                  borderLeft:`3px solid ${selectedFG===fg.id?"#ff6b2b":"#1a2a3a"}`,
                  borderRadius:4, padding:"10px 14px", cursor:"pointer",
                  transition:"all .15s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ color:"#c8d6e5", fontSize:13, fontWeight:600,
                      fontFamily:"'Barlow Condensed',sans-serif" }}>{fg.name}</div>
                    <div style={{ color:"#2a3d50", fontSize:10, marginTop:2 }}>
                      {fg.id} · {fg.category} · Lead {fg.leadDays}d
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#68d391", fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:16, fontWeight:700 }}>{fmt$(fg.basePrice)}</div>
                    <div style={{ color:"#2a3d50", fontSize:9 }}>base price</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding:18 }}>
          <SectionTitle accent="#63b3ed">Feasibility Check</SectionTitle>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <Label>Build Quantity</Label>
              <Input type="number" value={buildQty} min={1}
                onChange={e=>setBuildQty(Math.max(1,parseInt(e.target.value)||1))}
                style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:16 }} />
            </div>
            <div style={{ paddingTop:18 }}>
              <div style={{ background: canBuild?"#0f2d1c":"#1a0d0d",
                border:`1px solid ${canBuild?"#1c4a2c":"#4a1c1c"}`,
                borderRadius:4, padding:"8px 14px", textAlign:"center" }}>
                <div style={{ color: canBuild?"#68d391":"#fc8181",
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:13,
                  fontWeight:800, letterSpacing:"0.06em" }}>
                  {canBuild ? "✓ FEASIBLE" : `✗ ${shortfalls.length} SHORTFALL${shortfalls.length>1?"S":""}`}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            <div style={{ background:"#080e18", border:"1px solid #1a2a3a", borderRadius:4, padding:"10px 12px" }}>
              <div style={{ color:"#2a3d50", fontSize:9, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:"0.1em", textTransform:"uppercase" }}>Material Cost</div>
              <div style={{ color:"#fc8181", fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:20, fontWeight:800 }}>{fmt$(materialCost)}</div>
              <div style={{ color:"#2a3d50", fontSize:9 }}>for {buildQty} unit{buildQty>1?"s":""}</div>
            </div>
            <div style={{ background:"#080e18", border:"1px solid #1a2a3a", borderRadius:4, padding:"10px 12px" }}>
              <div style={{ color:"#2a3d50", fontSize:9, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:"0.1em", textTransform:"uppercase" }}>Est. Margin</div>
              <div style={{ color:"#68d391", fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:20, fontWeight:800 }}>{margin}%</div>
              <div style={{ color:"#2a3d50", fontSize:9 }}>per unit at base price</div>
            </div>
          </div>

          {shortfalls.map(f=>(
            <div key={f.materialId} style={{ background:"#110808", border:"1px solid #4a1c1c33",
              borderRadius:4, padding:"6px 10px", marginBottom:6 }}>
              <span style={{ color:"#fc8181", fontSize:11 }}>
                ✗ {f.mat?.name} — need {f.need} {f.mat?.unit}, have {f.has} {f.mat?.unit}
                <span style={{ color:"#5a2020" }}> (short {f.need-f.has})</span>
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* BOM Table */}
      <Card>
        <div style={{ padding:"14px 18px 0", borderBottom:"1px solid #0d1926" }}>
          <SectionTitle>Bill of Materials — {fg?.name} (×{buildQty})</SectionTitle>
        </div>
        <Tbl
          heads={["Material","Operation","Per Unit","Required","In Stock","Coverage","Unit Cost","Line Cost","Status"]}
          rows={feasibility.map(f=>(
            <TR key={f.materialId} cells={[
              <T v={f.mat?.name||f.materialId} />,
              <T v={f.operation} dim />,
              <T v={`${f.line?.qty||f.qty} ${f.mat?.unit}`} mono dim />,
              <T v={`${f.need} ${f.mat?.unit}`} bold color={f.ok?"#c8d6e5":"#fc8181"} />,
              <T v={`${f.has} ${f.mat?.unit}`} mono />,
              <div style={{ minWidth:80 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <T v={`${f.pct.toFixed(0)}%`} dim />
                </div>
                <Progress value={f.pct} color={f.ok?"#68d391":"#fc8181"} height={4} />
              </div>,
              <T v={fmt$(f.mat?.cost||0)} dim />,
              <T v={fmt$((f.mat?.cost||0)*f.need)} bold />,
              <Chip label={f.ok?"Normal":"Low Stock"} />,
            ]} />
          ))}
        />
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: INVENTORY
// ════════════════════════════════════════════════════════════════════════════
const Inventory = ({ S, dispatch }) => {
  const { rawMaterials } = S;
  const [adjItem, setAdjItem] = useState(null);
  const [adjQty, setAdjQty]   = useState("");
  const [adjMode, setAdjMode] = useState("set");
  const [filter, setFilter]   = useState("all");

  const filtered = filter==="low"   ? rawMaterials.filter(m=>m.stock<=m.minStock)
                 : filter==="normal"? rawMaterials.filter(m=>m.stock>m.minStock)
                 : rawMaterials;

  const handleAdj = () => {
    if(!adjItem||adjQty==="") return;
    const n = adjMode==="set" ? parseInt(adjQty)
            : adjMode==="add" ? adjItem.stock+parseInt(adjQty)
            : adjItem.stock-parseInt(adjQty);
    dispatch({ type:"ADJUST_STOCK", payload:{ id:adjItem.id, stock:Math.max(0,n) } });
    setAdjItem(null);
  };

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase" }}>
            Raw Materials Inventory
          </h1>
          <p style={{ color:"#2a3d50", fontSize:11, marginTop:4 }}>Stock levels, locations & reorder alerts</p>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["all","low","normal"].map(f=>(
            <Btn key={f} variant={filter===f?"primary":"ghost"} small onClick={()=>setFilter(f)}>
              {f==="all"?"All":f==="low"?"Low Stock":"Normal"}
            </Btn>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:16 }}>
        <StatCard label="Total SKUs"     value={rawMaterials.length}    accent="#8fadc5" icon="▦" />
        <StatCard label="Critical"       value={rawMaterials.filter(m=>m.stock<=m.minStock).length} accent="#fc8181" icon="▼" sub="Below min level" />
        <StatCard label="Stock Value"    value={fmt$(rawMaterials.reduce((s,m)=>s+m.stock*m.cost,0))} accent="#68d391" icon="$" />
      </div>

      <Card>
        <Tbl
          heads={["ID","Material","Stock","Min","Unit","Unit Cost","Stock Value","Coverage","Status","Action"]}
          rows={filtered.map(m=>{
            const pct    = Math.min((m.stock/m.minStock)*100,200);
            const status = m.stock<=m.minStock*0.5?"Critical":m.stock<=m.minStock?"Low Stock":m.stock>m.minStock*3?"Overstock":"Normal";
            const sColor = STATUS_META[status]?.color||"#8fadc5";
            return (
              <TR key={m.id} highlight={m.stock<=m.minStock} cells={[
                <T v={m.id} mono dim />,
                <T v={m.name} bold />,
                <span style={{ color:sColor, fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:15, fontWeight:700 }}>{m.stock}</span>,
                <T v={m.minStock} dim />,
                <T v={m.unit} dim />,
                <T v={fmt$(m.cost)} dim />,
                <T v={fmt$(m.stock*m.cost)} />,
                <div style={{ minWidth:70 }}>
                  <Progress value={Math.min(pct/2,100)} color={sColor} height={4} />
                  <T v={`${pct.toFixed(0)}%`} dim />
                </div>,
                <Chip label={status} />,
                <Btn small variant="ghost" onClick={()=>{setAdjItem(m);setAdjQty("");}}>Adjust</Btn>,
              ]} />
            );
          })}
        />
      </Card>

      {adjItem && (
        <Modal title={`Adjust Stock — ${adjItem.name}`} onClose={()=>setAdjItem(null)}>
          <div style={{ background:"#080e18", border:"1px solid #1a2a3a", borderRadius:4,
            padding:"10px 14px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <T v="Current stock:" dim /><T v={`${adjItem.stock} ${adjItem.unit}`} bold />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <T v="Minimum level:" dim /><T v={`${adjItem.minStock} ${adjItem.unit}`} dim />
            </div>
          </div>
          <Field label="Adjustment Mode">
            <Sel value={adjMode} onChange={e=>setAdjMode(e.target.value)}>
              <option value="set">Set to exact value</option>
              <option value="add">Add to current</option>
              <option value="sub">Remove from current</option>
            </Sel>
          </Field>
          <Field label={adjMode==="set"?"New Quantity":adjMode==="add"?"Quantity to Add":"Quantity to Remove"}>
            <Input type="number" value={adjQty} min={0} onChange={e=>setAdjQty(e.target.value)}
              placeholder="0" />
          </Field>
          {adjQty!=="" && (
            <div style={{ background:"#060d18", border:"1px solid #1a2a3a", borderRadius:4,
              padding:"8px 12px", marginBottom:14 }}>
              <T v="Result: " dim />
              <T v={`${adjMode==="set"?parseInt(adjQty):adjMode==="add"?adjItem.stock+parseInt(adjQty):adjItem.stock-parseInt(adjQty)} ${adjItem.unit}`} bold color="#ecc94b" />
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={handleAdj}>Confirm Adjustment</Btn>
            <Btn variant="ghost" onClick={()=>setAdjItem(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: SALES ORDERS (MTO)
// ════════════════════════════════════════════════════════════════════════════
const SalesOrders = ({ S, dispatch }) => {
  const { salesOrders, finishedGoods, workOrders } = S;
  const [modal, setModal] = useState(null);
  const blank = { customer:"", fgId:finishedGoods[0].id, qty:"1", dueDate:"", priority:"NORMAL", notes:"" };
  const [form, setForm] = useState(blank);

  const handleCreate = () => {
    const fg = finishedGoods.find(f=>f.id===form.fgId);
    if(!form.customer||!fg||!form.qty) return;
    const id = genId("SO");
    dispatch({ type:"ADD_SO", payload:{
      id, customer:form.customer, fgId:form.fgId,
      qty:parseInt(form.qty), date:new Date().toISOString().slice(0,10),
      dueDate:form.dueDate||"", status:"Pending",
      priority:form.priority, total:fg.basePrice*parseInt(form.qty),
      notes:form.notes
    }});
    setModal(null); setForm(blank);
  };

  const sosByStatus = {
    "Quote":       salesOrders.filter(o=>o.status==="Quote"),
    "Pending":     salesOrders.filter(o=>o.status==="Pending"),
    "In Production": salesOrders.filter(o=>["Picking","In Production","In Progress"].includes(o.status)),
    "Completed":   salesOrders.filter(o=>["Shipped","Delivered"].includes(o.status)),
  };

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase" }}>
            Sales Orders
          </h1>
          <p style={{ color:"#2a3d50", fontSize:11, marginTop:4 }}>Make-to-Order · Quotes to Delivery</p>
        </div>
        <Btn onClick={()=>setModal("new")}>+ New Order</Btn>
      </div>

      <Card>
        <Tbl
          heads={["Order","Customer","Product","Qty","Due Date","Priority","Total","Status","WO","Actions"]}
          rows={salesOrders.map(so=>{
            const fg = finishedGoods.find(f=>f.id===so.fgId);
            const wo = workOrders.find(w=>w.soId===so.id);
            return (
              <TR key={so.id} highlight={so.priority==="HIGH"} cells={[
                <T v={so.id} mono color="#ff6b2b" />,
                <T v={so.customer} bold />,
                <T v={fg?.name||so.fgId} />,
                <T v={`${so.qty} pcs`} mono />,
                <T v={so.dueDate?fmtDt(so.dueDate):"—"} dim />,
                <PriorityFlag p={so.priority} />,
                <T v={fmt$(so.total)} bold color="#68d391" />,
                <Chip label={so.status} />,
                <span style={{ color: wo?"#ecc94b":"#1a2a3a", fontSize:10,
                  fontFamily:"'Share Tech Mono',monospace" }}>
                  {wo?wo.id:"—"}
                </span>,
                <div style={{ display:"flex", gap:4 }}>
                  <Sel value={so.status} style={{ width:"auto",padding:"3px 6px",fontSize:10 }}
                    onChange={e=>dispatch({type:"UPDATE_SO",payload:{id:so.id,status:e.target.value}})}>
                    {["Quote","Pending","Picking","In Production","Shipped","Delivered","Cancelled"].map(s=>(
                      <option key={s}>{s}</option>
                    ))}
                  </Sel>
                </div>,
              ]} />
            );
          })}
        />
      </Card>

      {modal==="new" && (
        <Modal title="New Make-to-Order Sales Order" onClose={()=>setModal(null)}>
          <Field label="Customer / Company">
            <Input value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}
              placeholder="e.g. Meridian Aerospace" />
          </Field>
          <Field label="Finished Good">
            <Sel value={form.fgId} onChange={e=>setForm({...form,fgId:e.target.value})}>
              {finishedGoods.map(f=>(
                <option key={f.id} value={f.id}>{f.name} — {fmt$(f.basePrice)}</option>
              ))}
            </Sel>
          </Field>
          <Row2>
            <Field label="Quantity" half>
              <Input type="number" value={form.qty} min={1}
                onChange={e=>setForm({...form,qty:e.target.value})} />
            </Field>
            <Field label="Required Date" half>
              <Input type="date" value={form.dueDate}
                onChange={e=>setForm({...form,dueDate:e.target.value})} />
            </Field>
          </Row2>
          <Field label="Priority">
            <Sel value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High Priority</option>
            </Sel>
          </Field>
          <Field label="Notes / Special Requirements">
            <Input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
              placeholder="Optional notes..." />
          </Field>
          {form.qty && (
            <div style={{ background:"#060d18", border:"1px solid #1a2a3a", borderRadius:4,
              padding:"10px 14px", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <T v="Order Value:" dim />
                <T v={fmt$((finishedGoods.find(f=>f.id===form.fgId)?.basePrice||0)*parseInt(form.qty||0))}
                  bold color="#68d391" />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <T v="Est. Lead Time:" dim />
                <T v={`${finishedGoods.find(f=>f.id===form.fgId)?.leadDays||"?"} working days`} dim />
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={handleCreate}>Create Order</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: PRODUCTION
// ════════════════════════════════════════════════════════════════════════════
const Production = ({ S, dispatch }) => {
  const { workOrders, salesOrders, finishedGoods } = S;
  const [modal, setModal] = useState(false);
  const blank = { soId:"", fgId:"", qty:"", line:"Line A", startDate:"", endDate:"" };
  const [form, setForm] = useState(blank);

  const pendingSOs = salesOrders.filter(o=>
    ["Pending","Quote","Picking"].includes(o.status) &&
    !workOrders.find(w=>w.soId===o.id)
  );

  const handleCreate = () => {
    const so = salesOrders.find(s=>s.id===form.soId);
    if(!so) return;
    const fg = finishedGoods.find(f=>f.id===so.fgId);
    dispatch({ type:"ADD_WO", payload:{
      id:genId("WO"), soId:so.id, fgId:so.fgId,
      qty: parseInt(form.qty)||so.qty,
      line:form.line, status:"Scheduled", stage:"Pending",
      progress:0, startDate:form.startDate, endDate:form.endDate
    }});
    dispatch({ type:"UPDATE_SO", payload:{ id:so.id, status:"In Production" } });
    setModal(false); setForm(blank);
  };

  const LINES = ["Line A","Line B","Line C","Line D"];

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase" }}>
            Production Floor
          </h1>
          <p style={{ color:"#2a3d50", fontSize:11, marginTop:4 }}>Work Orders · Assembly Lines · Progress Tracking</p>
        </div>
        <Btn variant="blue" onClick={()=>setModal(true)}>+ Release Work Order</Btn>
      </div>

      {/* Line view */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12, marginBottom:16 }}>
        {LINES.map(line => {
          const lWOs = workOrders.filter(w=>w.line===line);
          const active = lWOs.find(w=>w.status==="In Progress");
          return (
            <Card key={line} style={{ padding:16,
              borderTop:`2px solid ${active?"#ecc94b":"#1a2a3a"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:15, fontWeight:700, letterSpacing:"0.06em" }}>{line}</span>
                <Chip label={active?"In Progress":lWOs.find(w=>w.status==="Scheduled")?"Scheduled":"Idle"} />
              </div>
              {active ? (
                <div>
                  <T v={finishedGoods.find(f=>f.id===active.fgId)?.name||active.fgId} bold />
                  <div style={{ marginTop:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <T v={active.stage} dim />
                      <T v={`${active.progress}%`} bold color="#ecc94b" />
                    </div>
                    <Progress value={active.progress} color="#ecc94b" height={6} />
                  </div>
                  <T v={`${active.id} · Qty ${active.qty}`} dim />
                </div>
              ) : (
                <T v="No active job" dim />
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <div style={{ padding:"14px 18px 0" }}>
          <SectionTitle>All Work Orders</SectionTitle>
        </div>
        <Tbl
          heads={["WO#","Sales Order","Product","Qty","Line","Start","End","Stage","Progress","Status","Update"]}
          rows={workOrders.map(wo=>{
            const fg = finishedGoods.find(f=>f.id===wo.fgId);
            const so = salesOrders.find(s=>s.id===wo.soId);
            const pColor = wo.progress===100?"#68d391":wo.progress>0?"#ecc94b":"#3a5068";
            return (
              <TR key={wo.id} cells={[
                <T v={wo.id} mono color="#63b3ed" />,
                <T v={wo.soId} mono dim />,
                <T v={fg?.name||wo.fgId} />,
                <T v={`${wo.qty} pcs`} mono />,
                <T v={wo.line} />,
                <T v={fmtDt(wo.startDate)} dim />,
                <T v={fmtDt(wo.endDate)} dim />,
                <T v={wo.stage} />,
                <div style={{ minWidth:90 }}>
                  <Progress value={wo.progress} color={pColor} height={4} />
                  <T v={`${wo.progress}%`} dim />
                </div>,
                <Chip label={wo.status} />,
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <Input type="number" placeholder="%" min={0} max={100}
                    style={{ width:54, padding:"3px 6px", fontSize:11 }}
                    onBlur={e=>{
                      const v=parseInt(e.target.value);
                      if(!isNaN(v)) dispatch({type:"UPDATE_WO",payload:{
                        id:wo.id, progress:v,
                        status:v===100?"Completed":v>0?"In Progress":"Scheduled",
                        stage:v===100?"Complete":v>50?"Assembly":v>0?"Fabrication":"Pending"
                      }});
                      e.target.value="";
                    }} />
                </div>,
              ]} />
            );
          })}
        />
      </Card>

      {modal && (
        <Modal title="Release Work Order" onClose={()=>setModal(false)}>
          {pendingSOs.length===0 ? (
            <div>
              <T v="No pending sales orders without work orders." dim />
              <div style={{ marginTop:12 }}>
                <Btn variant="ghost" onClick={()=>setModal(false)}>Close</Btn>
              </div>
            </div>
          ) : (
            <>
              <Field label="Link to Sales Order">
                <Sel value={form.soId} onChange={e=>{
                  const so = salesOrders.find(s=>s.id===e.target.value);
                  setForm({...form,soId:e.target.value,fgId:so?.fgId||"",qty:so?.qty||""});
                }}>
                  <option value="">Select sales order...</option>
                  {pendingSOs.map(o=>{
                    const fg=finishedGoods.find(f=>f.id===o.fgId);
                    return <option key={o.id} value={o.id}>{o.id} — {o.customer} — {fg?.name} ×{o.qty}</option>;
                  })}
                </Sel>
              </Field>
              <Row2>
                <Field label="Production Qty" half>
                  <Input type="number" value={form.qty}
                    onChange={e=>setForm({...form,qty:e.target.value})}
                    placeholder="0" />
                </Field>
                <Field label="Assembly Line" half>
                  <Sel value={form.line} onChange={e=>setForm({...form,line:e.target.value})}>
                    {LINES.map(l=><option key={l}>{l}</option>)}
                  </Sel>
                </Field>
              </Row2>
              <Row2>
                <Field label="Start Date" half>
                  <Input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
                </Field>
                <Field label="End Date" half>
                  <Input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} />
                </Field>
              </Row2>
              <div style={{ display:"flex", gap:8 }}>
                <Btn variant="blue" onClick={handleCreate}>Release to Production</Btn>
                <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: PROCUREMENT
// ════════════════════════════════════════════════════════════════════════════
const Procurement = ({ S, dispatch }) => {
  const { purchaseOrders, suppliers, rawMaterials } = S;
  const [modal, setModal] = useState(false);
  const blank = { supplierId:"", materialId:"", qty:"", unitCost:"", orderDate:new Date().toISOString().slice(0,10), etaDate:"" };
  const [form, setForm] = useState(blank);

  const handleCreate = () => {
    const m = rawMaterials.find(r=>r.id===form.materialId);
    const s = suppliers.find(s=>s.id===form.supplierId);
    if(!m||!s||!form.qty||!form.unitCost) return;
    dispatch({ type:"ADD_PO", payload:{
      id:genId("PO"), supplier:s.name,
      materialId:form.materialId, qty:parseInt(form.qty),
      unitCost:parseFloat(form.unitCost), status:"Ordered",
      orderDate:form.orderDate, etaDate:form.etaDate,
      total:parseInt(form.qty)*parseFloat(form.unitCost)
    }});
    setModal(false); setForm(blank);
  };

  const critMats = rawMaterials.filter(m=>m.stock<=m.minStock);

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <h1 style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:26, fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase" }}>
            Procurement
          </h1>
          <p style={{ color:"#2a3d50", fontSize:11, marginTop:4 }}>Purchase Orders · Suppliers · Reorder Management</p>
        </div>
        <Btn variant="success" onClick={()=>setModal(true)}>+ New Purchase Order</Btn>
      </div>

      {critMats.length>0 && (
        <div style={{ background:"#0f0808", border:"1px solid #4a1c1c44",
          borderLeft:"3px solid #fc8181", borderRadius:4, padding:"10px 14px", marginBottom:14 }}>
          <T v={`⚠ ${critMats.length} material${critMats.length>1?"s":""} below minimum: ${critMats.map(m=>m.name).join(", ")}`}
            color="#fc8181" />
        </div>
      )}

      {/* Supplier cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
        {suppliers.map(s=>(
          <Card key={s.id} style={{ padding:"12px 14px" }}>
            <div style={{ color:"#c8d6e5", fontSize:13, fontWeight:600,
              fontFamily:"'Barlow Condensed',sans-serif", marginBottom:2 }}>{s.name}</div>
            <div style={{ color:"#2a3d50", fontSize:10, marginBottom:6 }}>{s.category}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#ecc94b", fontSize:11 }}>{"★".repeat(Math.round(s.rating))} {s.rating}</span>
              <span style={{ color:"#3a5068", fontSize:10,
                fontFamily:"'Share Tech Mono',monospace" }}>Lead {s.leadDays}d</span>
            </div>
            <div style={{ color:"#1a3048", fontSize:10, marginTop:4 }}>{s.contact} · {s.email}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Tbl
          heads={["PO #","Supplier","Material","Qty","Unit Cost","Total","Order Date","ETA","Status"]}
          rows={purchaseOrders.map(po=>{
            const m = rawMaterials.find(r=>r.id===po.materialId);
            return (
              <TR key={po.id} cells={[
                <T v={po.id} mono color="#b794f4" />,
                <T v={po.supplier} bold />,
                <T v={m?.name||po.materialId} />,
                <T v={`${po.qty} ${m?.unit||""}`} mono />,
                <T v={fmt$(po.unitCost)} dim />,
                <T v={fmt$(po.total)} bold color="#68d391" />,
                <T v={fmtDt(po.orderDate)} dim />,
                <T v={fmtDt(po.etaDate)} />,
                <Chip label={po.status} />,
              ]} />
            );
          })}
        />
      </Card>

      {modal && (
        <Modal title="New Purchase Order" onClose={()=>setModal(false)}>
          <Field label="Supplier">
            <Sel value={form.supplierId} onChange={e=>setForm({...form,supplierId:e.target.value})}>
              <option value="">Select supplier...</option>
              {suppliers.map(s=>(
                <option key={s.id} value={s.id}>{s.name} — {s.category} (Lead {s.leadDays}d)</option>
              ))}
            </Sel>
          </Field>
          <Field label="Material">
            <Sel value={form.materialId} onChange={e=>{
              const m=rawMaterials.find(r=>r.id===e.target.value);
              setForm({...form,materialId:e.target.value,unitCost:m?.cost||""});
            }}>
              <option value="">Select material...</option>
              {rawMaterials.map(m=>(
                <option key={m.id} value={m.id}>{m.name} — stock: {m.stock} {m.unit} (min {m.minStock})</option>
              ))}
            </Sel>
          </Field>
          <Row2>
            <Field label="Quantity" half>
              <Input type="number" value={form.qty} min={1}
                onChange={e=>setForm({...form,qty:e.target.value})} />
            </Field>
            <Field label="Unit Cost ($)" half>
              <Input type="number" value={form.unitCost} step="0.01"
                onChange={e=>setForm({...form,unitCost:e.target.value})} />
            </Field>
          </Row2>
          <Row2>
            <Field label="Order Date" half>
              <Input type="date" value={form.orderDate}
                onChange={e=>setForm({...form,orderDate:e.target.value})} />
            </Field>
            <Field label="ETA Date" half>
              <Input type="date" value={form.etaDate}
                onChange={e=>setForm({...form,etaDate:e.target.value})} />
            </Field>
          </Row2>
          {form.qty&&form.unitCost&&(
            <div style={{ background:"#060d18", border:"1px solid #1a2a3a",
              borderRadius:4, padding:"10px 14px", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <T v="PO Total:" dim />
                <T v={fmt$(parseInt(form.qty||0)*parseFloat(form.unitCost||0))} bold color="#b794f4" />
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="success" onClick={handleCreate}>Raise Purchase Order</Btn>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════
export default function ForgeERP() {
  const [S, dispatch] = useReducer(appReducer, SEED);
  const [active, setActive] = useState("dash");
  const [clock, setClock] = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setClock(new Date()),1000); return ()=>clearInterval(t); },[]);

  const alerts = S.rawMaterials.filter(m=>m.stock<=m.minStock).length
               + S.salesOrders.filter(o=>o.priority==="HIGH"&&!["Delivered","Cancelled"].includes(o.status)).length;

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", height:"100vh", background:"#080c12",
        fontFamily:"'Barlow',sans-serif", color:"#8fadc5", overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width:210, background:"#060c16", borderRight:"1px solid #0d1926",
          display:"flex", flexDirection:"column", flexShrink:0, position:"relative", zIndex:10 }}>

          {/* Logo */}
          <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #0d1926" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ background:"linear-gradient(135deg,#ff6b2b,#c1440e)",
                borderRadius:4, padding:"6px 8px", fontSize:18, lineHeight:1 }}>⚙</div>
              <div>
                <div style={{ color:"#c8d6e5", fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:18, fontWeight:900, letterSpacing:"0.1em", lineHeight:1 }}>FORGE</div>
                <div style={{ color:"#2a3d50", fontSize:8, letterSpacing:"0.2em",
                  fontFamily:"'Share Tech Mono',monospace" }}>MFG · ERP · v2.0</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
            {NAV.map(item=>{
              const on = active===item.id;
              const badge = item.id==="inv"&&alerts>0 ? alerts : 0;
              return (
                <button key={item.id} onClick={()=>setActive(item.id)}
                  style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                    padding:"10px 18px", background: on?"#0d1926":"transparent",
                    border:"none", borderLeft:`2px solid ${on?"#ff6b2b":"transparent"}`,
                    color: on?"#c8d6e5":"#2a3d50", cursor:"pointer",
                    fontSize:12, fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight: on?700:500, letterSpacing:"0.06em",
                    textTransform:"uppercase", textAlign:"left",
                    transition:"all .12s" }}
                  onMouseEnter={e=>{ if(!on){ e.currentTarget.style.color="#8fadc5"; e.currentTarget.style.background="#0a1520"; }}}
                  onMouseLeave={e=>{ if(!on){ e.currentTarget.style.color="#2a3d50"; e.currentTarget.style.background="transparent"; }}}>
                  <span style={{ fontSize:14, width:16, textAlign:"center", opacity: on?1:.6 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {badge>0 && (
                    <span style={{ background:"#c1440e", color:"white", borderRadius:3,
                      padding:"1px 5px", fontSize:9, fontWeight:800,
                      fontFamily:"'Share Tech Mono',monospace" }}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer clock */}
          <div style={{ padding:"12px 18px", borderTop:"1px solid #0d1926" }}>
            <div style={{ background:"#060d18", border:"1px solid #0d1926", borderRadius:4, padding:"8px 10px" }}>
              <div style={{ color:"#ff6b2b", fontFamily:"'Share Tech Mono',monospace",
                fontSize:14, fontWeight:500, letterSpacing:"0.1em" }}>
                {clock.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
              </div>
              <div style={{ color:"#2a3d50", fontFamily:"'Share Tech Mono',monospace",
                fontSize:9, marginTop:2, letterSpacing:"0.08em" }}>
                {clock.toLocaleDateString([],{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).toUpperCase()}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:8 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#68d391",
                animation:"pulse-dot 2s infinite" }} />
              <span style={{ color:"#1a2d1a", fontSize:9, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:"0.08em" }}>SYSTEMS ONLINE</span>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px",
          background:"linear-gradient(180deg,#080c12 0%,#060910 100%)" }}>
          {active==="dash"  && <Dashboard    S={S} />}
          {active==="mfg"   && <Manufacturing S={S} />}
          {active==="inv"   && <Inventory     S={S} dispatch={dispatch} />}
          {active==="sales" && <SalesOrders   S={S} dispatch={dispatch} />}
          {active==="prod"  && <Production    S={S} dispatch={dispatch} />}
          {active==="proc"  && <Procurement   S={S} dispatch={dispatch} />}
        </div>
      </div>
    </>
  );
}
