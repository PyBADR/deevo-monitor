import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════════════════
const C = {
  void: "#05050d", deep: "#08081a", surface: "#0c0c1e", raised: "#111128",
  border: "#1e1e3a", borderHi: "#3d6bff",
  amber: "#f5a623", amberDim: "#f5a62340", amberGlow: "#f5a62320",
  teal: "#00d4aa", tealDim: "#00d4aa30",
  blue: "#3d6bff", blueDim: "#3d6bff20",
  violet: "#7c3aff", rose: "#e11d48",
  red: "#ff2d2d", redDim: "#ff2d2d20",
  gold: "#ffd700", orange: "#ff6b35",
  text: "#c8cfe0", textDim: "#3a3a5c", textBright: "#eef0f8",
  success: "#00d4aa", warn: "#f5a623", danger: "#ff2d2d",
};
const riskColor = s => s>=80?C.red:s>=65?C.orange:s>=50?C.amber:s>=35?C.gold:C.teal;
const riskLabel = s => s>=80?"CRITICAL":s>=65?"HIGH":s>=50?"ELEVATED":s>=35?"MODERATE":"LOW";
// ══════════════════════════════════════════════════════════════════════════════
// DATA MODEL
// ══════════════════════════════════════════════════════════════════════════════
const ENTITIES = [
  {id:"kwt",type:"COUNTRY",sub:"GCC_STATE",label:"Kuwait",lat:29.3,lng:47.7,risk:62,claimsActive:12,fraudAlerts:3,gdp:134,population:4.3},
  {id:"sau",type:"COUNTRY",sub:"GCC_STATE",label:"Saudi Arabia",lat:23.9,lng:45.1,risk:71,claimsActive:89,fraudAlerts:7,gdp:1060,population:35},
  {id:"uae",type:"COUNTRY",sub:"GCC_STATE",label:"UAE",lat:23.4,lng:53.8,risk:48,claimsActive:44,fraudAlerts:2,gdp:507,population:9.9},
  {id:"qat",type:"COUNTRY",sub:"GCC_STATE",label:"Qatar",lat:25.3,lng:51.2,risk:54,claimsActive:18,fraudAlerts:1,gdp:237,population:2.9},
  {id:"bhr",type:"COUNTRY",sub:"GCC_STATE",label:"Bahrain",lat:26.0,lng:50.5,risk:59,claimsActive:9,fraudAlerts:2,gdp:44,population:1.7},
  {id:"omn",type:"COUNTRY",sub:"GCC_STATE",label:"Oman",lat:21.5,lng:55.9,risk:44,claimsActive:11,fraudAlerts:1,gdp:104,population:4.5},
  {id:"irn",type:"THREAT",sub:"STATE_ACTOR",label:"Iran",lat:32.4,lng:53.7,risk:95,threatLevel:"CRITICAL"},
  {id:"yem",type:"CONFLICT",sub:"ACTIVE_CONFLICT",label:"Yemen",lat:15.5,lng:48.5,risk:88},
  {id:"hormuz",type:"CHOKEPOINT",sub:"SEA_LANE",label:"Hormuz",lat:26.6,lng:56.5,risk:90,throughput:"20M bbl/d",disruption:92},
  {id:"babelm",type:"CHOKEPOINT",sub:"SEA_LANE",label:"Bab-el-Mandeb",lat:12.6,lng:43.4,risk:74},
  {id:"ras_tanura",type:"INFRA",sub:"OIL_TERMINAL",label:"Ras Tanura",lat:26.7,lng:50.1,risk:78},
  {id:"jebel_ali",type:"INFRA",sub:"PORT",label:"Jebel Ali",lat:24.97,lng:55.06,risk:41},
  {id:"gig",type:"INSURER",sub:"CLIENT",label:"GIG Takaful KW",lat:29.38,lng:47.99,risk:31,policies:8500},
  {id:"tawuniya",type:"INSURER",sub:"PROSPECT",label:"Tawuniya KSA",lat:24.7,lng:46.7,risk:38,policies:12400},
  {id:"adnic",type:"INSURER",sub:"PROSPECT",label:"ADNIC UAE",lat:24.45,lng:54.37,risk:33,policies:6200},
  {id:"sama",type:"REGULATOR",sub:"CENTRAL_BANK",label:"SAMA",lat:24.68,lng:46.72,risk:20},
  {id:"cbk",type:"REGULATOR",sub:"CENTRAL_BANK",label:"CBK Kuwait",lat:29.35,lng:48.0,risk:18},
];
const EDGES = [
  {from:"irn",to:"hormuz",type:"THREATENS",weight:0.92,label:"Naval blockade threat",layer:"GEOPOLITICAL",animated:true,color:C.red},
  {from:"irn",to:"sau",type:"GEOPOLITICAL_RISK",weight:0.71,label:"Proxy conflict risk",layer:"GEOPOLITICAL",color:C.red},
  {from:"irn",to:"kwt",type:"GEOPOLITICAL_RISK",weight:0.62,label:"Regional spillover",layer:"GEOPOLITICAL",color:C.red},
  {from:"yem",to:"babelm",type:"THREATENS",weight:0.74,label:"Houthi operations",layer:"GEOPOLITICAL",animated:true,color:C.orange},
  {from:"hormuz",to:"gig",type:"RISK_PROPAGATION",weight:0.78,label:"Marine exposure",layer:"CLAIMS",animated:true,color:C.amber},
  {from:"hormuz",to:"qat",type:"RISK_PROPAGATION",weight:0.81,label:"LNG export risk",layer:"CLAIMS",color:C.amber},
  {from:"hormuz",to:"ras_tanura",type:"SUPPLY_CHAIN",weight:0.85,label:"Export disruption",layer:"MARITIME",color:C.blue},
  {from:"ras_tanura",to:"sau",type:"ECONOMIC_LINK",weight:0.90,label:"Revenue dependency",layer:"GEOPOLITICAL",color:C.blue},
  {from:"kwt",to:"gig",type:"CLAIMS_EXPOSURE",weight:0.88,label:"Motor cluster fraud",layer:"FRAUD",color:C.violet},
  {from:"gig",to:"tawuniya",type:"REINSURANCE_FLOW",weight:0.44,label:"Treaty share 15%",layer:"REINSURANCE",color:"#7c3aff"},
  {from:"sama",to:"tawuniya",type:"REGULATORY_LINK",weight:0.95,label:"IFRS17 mandate",layer:"GEOPOLITICAL",color:C.teal},
  {from:"cbk",to:"gig",type:"REGULATORY_LINK",weight:0.95,label:"CBK circular",layer:"GEOPOLITICAL",color:C.teal},
  {from:"jebel_ali",to:"uae",type:"ECONOMIC_LINK",weight:0.85,label:"Trade hub",layer:"MARITIME",color:C.blue},
  {from:"babelm",to:"omn",type:"RISK_PROPAGATION",weight:0.55,label:"Shipping lane risk",layer:"MARITIME",color:C.orange},
];
const SIGNALS = [
  {id:"s1",time:"02:14",src:"Reuters",layer:"L1",type:"GEOPOLITICAL",text:"Iran IRGC: 'Hormuz closure imminent if strikes proceed'",severity:"CRITICAL",entities:["irn","hormuz"],conf:0.94},
  {id:"s2",time:"01:58",src:"CrisisWatch",layer:"L2",type:"CONFLICT",text:"Thermal +381MW near Fordow nuclear facility",severity:"HIGH",entities:["irn"],conf:0.87},
  {id:"s3",time:"01:42",src:"FRIN Model",layer:"L3",type:"FRAUD",text:"Motor claim cluster detected — Kuwait City South",severity:"HIGH",entities:["kwt","gig"],conf:0.91},
  {id:"s4",time:"01:20",src:"SAMA",layer:"L1",type:"REGULATORY",text:"SAMA circular: IFRS17 PAA disclosure mandatory Q2",severity:"MEDIUM",entities:["sau","tawuniya"],conf:0.99},
  {id:"s5",time:"00:55",src:"AIS Monitor",layer:"L2",type:"MARITIME",text:"3 vessels AIS-dark — Persian Gulf Hormuz approach",severity:"HIGH",entities:["hormuz","irn"],conf:0.82},
  {id:"s6",time:"00:30",src:"ML Anomaly",layer:"L3",type:"FRAUD",text:"Staged accident: 12 linked claims, 3 providers",severity:"HIGH",entities:["kwt"],conf:0.89},
];
const DECISIONS = [
  {
    id:"D001",title:"WAR CLAUSE ACTIVATION",severity:"CRITICAL",status:"PENDING_HUMAN",
    trigger:["s1","s5"],
    reasoning:[
      {step:1,layer:"L1\u00B7DATA",text:"2 correlated: Reuters + AIS dark vessels",conf:0.91},
      {step:2,layer:"L2\u00B7FEATURE",text:"Hormuz risk 90/100 (+18 in 12h)",conf:0.94},
      {step:3,layer:"L3\u00B7MODEL",text:"FRIN Marine: claim prob 94%",conf:0.94},
      {step:4,layer:"L4\u00B7AGENT",text:"RULE_001 WAR_CLAUSE fired",conf:1.0},
      {step:5,layer:"L7\u00B7GOVERNANCE",text:"Human approval gate triggered",conf:1.0},
    ],
    actions:[
      {id:"a1",label:"Flag 47 marine policies",risk:"LOW",rev:true,auto:true},
      {id:"a2",label:"Suspend marine underwriting",risk:"MEDIUM",rev:true,auto:false},
      {id:"a3",label:"Notify reinsurance desk",risk:"LOW",rev:true,auto:true},
      {id:"a4",label:"Legal review \u2014 war endorsement",risk:"HIGH",rev:false,auto:false},
    ],
    impact:{policies:47,exposure:"12.4M KWD",prob:0.94,timeToAct:"<4h"},
  },
  {
    id:"D002",title:"FRAUD CLUSTER \u2014 KUWAIT",severity:"HIGH",status:"AI_PROCESSING",
    trigger:["s3","s6"],
    reasoning:[
      {step:1,layer:"L1\u00B7DATA",text:"12 motor claims, 3 providers, same zone",conf:0.89},
      {step:2,layer:"L2\u00B7FEATURE",text:"Network graph density 0.83, clique detected",conf:0.91},
      {step:3,layer:"L3\u00B7MODEL",text:"FRIN score 91/100 \u2014 staged accident",conf:0.91},
      {step:4,layer:"L4\u00B7AGENT",text:"4 claimants share phone prefix \u2014 ring",conf:0.87},
    ],
    actions:[
      {id:"b1",label:"Hold 12 claims pending SIU",risk:"MEDIUM",rev:true,auto:true},
      {id:"b2",label:"Field investigation \u2014 Kuwait City South",risk:"LOW",rev:true,auto:false},
      {id:"b3",label:"Flag 3 providers for audit",risk:"LOW",rev:true,auto:true},
    ],
    impact:{policies:12,exposure:"84K KWD",prob:0.91,timeToAct:"<24h"},
  },
];
const FORECAST_SERIES = {
  hormuzRisk: Array.from({length:30},(_,i)=>({t:i,v:72+Math.sin(i*0.4)*8+i*0.6+(Math.random()-0.5)*4})),
  marineClaims: Array.from({length:30},(_,i)=>({t:i,v:8+i*0.8+Math.sin(i*0.3)*3+(Math.random()-0.5)*2})),
  fraudIndex: Array.from({length:30},(_,i)=>({t:i,v:52+Math.sin(i*0.5)*6+(Math.random()-0.5)*4})),
  oilPrice: Array.from({length:30},(_,i)=>({t:i,v:104+Math.sin(i*0.35)*5+(Math.random()-0.5)*3})),
};
const ARCH_LAYERS = [
  {id:1,name:"DATA INGESTION",nameAr:"\u0627\u0633\u062A\u064A\u0639\u0627\u0628 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",color:C.blue,icon:"\u25C8",
   components:["103 RSS Feeds","AIS Vessel Tracker","SAMA/CBK APIs","Satellite Thermal","OSINT Feeds","CrisisWatch"],
   throughput:"2.4K signals/s",latency:"<100ms"},
  {id:2,name:"FEATURE ENGINEERING",nameAr:"\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A",color:"#5b4aff",icon:"\u25C9",
   components:["NLP Classifier","Geo-Risk Scorer","Time-Series Engine","Correlation Matrix","Entity Linker","Sentiment Analyzer"],
   throughput:"847 features/signal",latency:"<80ms"},
  {id:3,name:"ML MODELS",nameAr:"\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u062A\u0639\u0644\u0645",color:C.violet,icon:"\u25CE",
   components:["FRIN Fraud Model","Marine Risk Model","IFRS17 Actuarial","Anomaly Detector","Claim Predictor","NER Model"],
   throughput:"12 models active",latency:"94ms avg"},
  {id:4,name:"AI AGENTS",nameAr:"\u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621",color:"#c026d3",icon:"\u25D1",
   components:["Correlation Agent","Alert Agent","FRIN Agent","Compliance Agent","Forecast Agent","Audit Agent","Report Agent"],
   throughput:"7 agents live",latency:"<5ms"},
  {id:5,name:"API GATEWAY",nameAr:"\u0628\u0648\u0627\u0628\u0629 API",color:C.amber,icon:"\u25D0",
   components:["FastAPI Router","Auth Middleware","Rate Limiter","WebSocket Hub","Cache Layer","Audit Logger"],
   throughput:"34 endpoints",latency:"<5ms"},
  {id:6,name:"INTELLIGENCE UI",nameAr:"\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0630\u0643\u0627\u0621",color:C.teal,icon:"\u25CD",
   components:["GCC Map View","Graph Network","Timeline Replay","Decision Engine","Signal Feed","KPI Dashboard"],
   throughput:"4 variants",latency:"60fps"},
  {id:7,name:"GOVERNANCE",nameAr:"\u0627\u0644\u062D\u0648\u0643\u0645\u0629",color:"#94a3b8",icon:"\u25C6",
   components:["SHA-256 Audit Trail","Human-in-Loop Gates","PDPL Compliance","IFRS17 Controls","Explainable AI","Access Control"],
   throughput:"Immutable logs",latency:"SHA-256 seal"},
];
// ══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════════════════════
const project = (lat,lng,W,H) => {
  const minLng=38,maxLng=65,minLat=10,maxLat=38;
  return {
    x: Math.max(16,Math.min(W-16,((lng-minLng)/(maxLng-minLng))*W)),
    y: Math.max(16,Math.min(H-16,H-((lat-minLat)/(maxLat-minLat))*H)),
  };
};
function Spark({data,color=C.blue,w=64,h=22,filled=false}){
  if(!data?.length)return null;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*(h-3)-1}`);
  const pstr=pts.join(" ");
  return(
    <svg width={w} height={h} style={{overflow:"visible",display:"block"}}>
      {filled&&<polygon points={`0,${h} ${pstr} ${w},${h}`} fill={color} opacity="0.12"/>}
      <polyline points={pstr} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1].split(",")[0]} cy={pts[pts.length-1].split(",")[1]} r="2.5" fill={color}/>
    </svg>
  );
}
function ConfBar({v,color=C.blue}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:5}}>
      <div style={{flex:1,height:2,background:C.border,borderRadius:1}}>
        <div style={{width:`${v*100}%`,height:"100%",background:color,borderRadius:1,transition:"width 0.8s"}}/>
      </div>
      <span style={{fontSize:8,color,fontFamily:"monospace",minWidth:28}}>{Math.round(v*100)}%</span>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// FORCE GRAPH ENGINE
// ══════════════════════════════════════════════════════════════════════════════
function useForceGraph(entities,edges,W,H){
  const [positions,setPositions]=useState(()=>{
    const pos={};
    entities.forEach((e,i)=>{
      const angle=(i/entities.length)*Math.PI*2;
      const r=Math.min(W,H)*0.32;
      pos[e.id]={x:W/2+Math.cos(angle)*r*(0.6+Math.random()*0.4),y:H/2+Math.sin(angle)*r*(0.6+Math.random()*0.4),vx:0,vy:0};
    });
    return pos;
  });
  useEffect(()=>{
    let frame;
    const REPEL=2800, ATTRACT=0.04, DAMP=0.82, CENTER=0.008;
    const sim=()=>{
      setPositions(prev=>{
        const next={...prev};
        entities.forEach(e=>{if(!next[e.id].vx)next[e.id]={...next[e.id],vx:0,vy:0};});
        entities.forEach(a=>{
          entities.forEach(b=>{
            if(a.id===b.id)return;
            const dx=next[b.id].x-next[a.id].x, dy=next[b.id].y-next[a.id].y;
            const dist=Math.sqrt(dx*dx+dy*dy)||1;
            const force=REPEL/(dist*dist);
            next[a.id]={...next[a.id],vx:next[a.id].vx-(dx/dist)*force*0.01,vy:next[a.id].vy-(dy/dist)*force*0.01};
          });
        });
        edges.forEach(edge=>{
          const a=next[edge.from],b=next[edge.to];
          if(!a||!b)return;
          const dx=b.x-a.x,dy=b.y-a.y;
          const dist=Math.sqrt(dx*dx+dy*dy)||1;
          const target=120+edge.weight*60;
          const force=(dist-target)*ATTRACT;
          next[edge.from]={...next[edge.from],vx:next[edge.from].vx+(dx/dist)*force,vy:next[edge.from].vy+(dy/dist)*force};
          next[edge.to]={...next[edge.to],vx:next[edge.to].vx-(dx/dist)*force,vy:next[edge.to].vy-(dy/dist)*force};
        });
        entities.forEach(e=>{
          let {x,y,vx,vy}=next[e.id];
          vx+=(W/2-x)*CENTER; vy+=(H/2-y)*CENTER;
          vx*=DAMP; vy*=DAMP;
          x=Math.max(40,Math.min(W-40,x+vx));
          y=Math.max(40,Math.min(H-40,y+vy));
          next[e.id]={x,y,vx,vy};
        });
        return next;
      });
    };
    let count=0;
    const run=()=>{if(count++<80){sim();frame=requestAnimationFrame(run);}};
    frame=requestAnimationFrame(run);
    return()=>cancelAnimationFrame(frame);
  },[W,H]);
  return positions;
}
// ══════════════════════════════════════════════════════════════════════════════
// VIEW: GCC MAP
// ══════════════════════════════════════════════════════════════════════════════
function MapView({entities,edges,signals,activeLayers,selected,onSelect}){
  const ref=useRef(null);
  const [W,setW]=useState(800);
  const H=420;
  useEffect(()=>{
    const ro=new ResizeObserver(e=>setW(e[0].contentRect.width));
    if(ref.current)ro.observe(ref.current);
    return()=>ro.disconnect();
  },[]);
  const projected=useMemo(()=>entities.map(e=>({...e,...project(e.lat,e.lng,W,H)})),[entities,W]);
  const [animTick,setAnimTick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setAnimTick(t=>t+1),80);return()=>clearInterval(iv);},[]);
  const gridLines=useMemo(()=>{
    const lines=[];
    for(let lng=40;lng<=64;lng+=4){const s=project(10,lng,W,H),e=project(38,lng,W,H);lines.push(<line key={`v${lng}`} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="#12122a" strokeWidth="0.6"/>);}
    for(let lat=12;lat<=36;lat+=4){const s=project(lat,38,W,H),e=project(lat,65,W,H);lines.push(<line key={`h${lat}`} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="#12122a" strokeWidth="0.6"/>);}
    return lines;
  },[W]);
  return(
    <div ref={ref} style={{flex:1,position:"relative",background:C.void,overflow:"hidden"}}>
      <svg width="100%" height={H} style={{display:"block"}}>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%"><stop offset="0%" stopColor="#0a0a22"/><stop offset="100%" stopColor={C.void}/></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="100%" height={H} fill="url(#bgGrad)"/>
        {gridLines}
        {[["Persian Gulf",26.5,52],["Gulf of Oman",23.5,58.5],["Red Sea",20,38.8],["Arabian Sea",16,62]].map(([lbl,lat,lng])=>{
          const p=project(+lat,+lng,W,H);
          return <text key={lbl} x={p.x} y={p.y} fill="#1a1a38" fontSize={9} fontFamily="IBM Plex Mono" textAnchor="middle" fontStyle="italic" letterSpacing="1">{lbl}</text>;
        })}
        {EDGES.filter(e=>{
          const layerMap={THREATENS:"GEOPOLITICAL",GEOPOLITICAL_RISK:"GEOPOLITICAL",RISK_PROPAGATION:"CLAIMS",CLAIMS_EXPOSURE:"FRAUD",REINSURANCE_FLOW:"REINSURANCE",SUPPLY_CHAIN:"MARITIME",REGULATORY_LINK:"GEOPOLITICAL",ECONOMIC_LINK:"MARITIME"};
          return activeLayers[layerMap[e.type]||"GEOPOLITICAL"];
        }).map(edge=>{
          const from=projected.find(e=>e.id===edge.from);
          const to=projected.find(e=>e.id===edge.to);
          if(!from||!to)return null;
          const mx=from.x+(to.x-from.x)*0.5+(to.y-from.y)*0.18;
          const my=from.y+(to.y-from.y)*0.5-(to.x-from.x)*0.18;
          const offset=(animTick*2)%60;
          return(
            <g key={edge.from+edge.to}>
              <path d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`} fill="none" stroke={edge.color} strokeWidth="1.2" opacity="0.35"/>
              {edge.animated&&<path d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`} fill="none" stroke={edge.color} strokeWidth="2" opacity="0.8" strokeDasharray="6 50" strokeDashoffset={-offset}/>}
              <circle cx={mx} cy={my} r="2" fill={edge.color} opacity="0.6"/>
            </g>
          );
        })}
        {projected.map(ent=>{
          const col=riskColor(ent.risk);
          const isSel=selected===ent.id;
          const isHigh=ent.risk>75;
          const sz=ent.type==="COUNTRY"?10:ent.type==="THREAT"?11:ent.type==="CHOKEPOINT"?8:6;
          const pulse=(animTick%30)/30;
          return(
            <g key={ent.id} style={{cursor:"pointer"}} onClick={()=>onSelect(ent.id===selected?null:ent.id)}>
              {isHigh&&<circle cx={ent.x} cy={ent.y} r={sz+8+pulse*18} fill="none" stroke={col} strokeWidth="1" opacity={0.6*(1-pulse)}/>}
              {isSel&&<circle cx={ent.x} cy={ent.y} r={sz+7} fill="none" stroke={C.blue} strokeWidth="1.5" strokeDasharray="4 2" style={{animation:"dash 2s linear infinite"}}/>}
              {ent.type==="CHOKEPOINT"
                ?<polygon points={`${ent.x},${ent.y-sz} ${ent.x+sz},${ent.y+sz*0.7} ${ent.x-sz},${ent.y+sz*0.7}`} fill={`${col}25`} stroke={col} strokeWidth={isSel?2:1.5} filter={isHigh?"url(#glow)":"none"}/>
                :ent.type==="INFRA"
                ?<rect x={ent.x-sz*0.8} y={ent.y-sz*0.8} width={sz*1.6} height={sz*1.6} rx="2" fill={`${col}20`} stroke={col} strokeWidth={isSel?2:1} transform={`rotate(45,${ent.x},${ent.y})`}/>
                :<circle cx={ent.x} cy={ent.y} r={sz} fill={`${col}${ent.type==="THREAT"?"35":"18"}`} stroke={col} strokeWidth={isSel?2:1.2} filter={isHigh?"url(#glow)":"none"}/>
              }
              <circle cx={ent.x} cy={ent.y} r="2" fill={col} opacity={isHigh?0.5+pulse*0.5:1}/>
              <text x={ent.x} y={ent.y+sz+12} textAnchor="middle" fill={isSel?C.textBright:C.textDim} fontSize={8.5} fontFamily="IBM Plex Mono" fontWeight={isSel?"700":"400"}>{ent.label}</text>
              {isSel&&<text x={ent.x+sz+4} y={ent.y+4} fill={col} fontSize={9} fontFamily="IBM Plex Mono" fontWeight="700">{Math.round(ent.risk)}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{position:"absolute",top:8,left:10,fontSize:8,color:C.textDim,fontFamily:"IBM Plex Mono",lineHeight:1.9}}>
        <div style={{color:C.amber}}>GCC REGION</div>
        <div>10\u201338\u00B0N \u00B7 38\u201365\u00B0E</div>
        <div style={{color:C.blue}}>ENTITIES: {entities.length}</div>
        <div style={{color:C.violet}}>EDGES: {EDGES.length}</div>
      </div>
      <div style={{position:"absolute",bottom:8,left:10,background:"#0a0a1a90",border:`1px solid ${C.border}`,borderRadius:4,padding:"6px 10px"}}>
        <div style={{fontSize:7.5,color:C.textDim,marginBottom:4,letterSpacing:1}}>RISK LEVEL</div>
        {[["CRITICAL",C.red],["HIGH",C.orange],["ELEVATED",C.amber],["MODERATE",C.gold],["LOW",C.teal]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>
            <span style={{fontSize:7.5,color:C.textDim}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// VIEW: GRAPH NETWORK
// ══════════════════════════════════════════════════════════════════════════════
function GraphView({entities,edges,activeLayers,selected,onSelect}){
  const ref=useRef(null);
  const [dims,setDims]=useState({W:800,H:500});
  useEffect(()=>{
    const ro=new ResizeObserver(e=>{const r=e[0].contentRect;setDims({W:r.width,H:r.height});});
    if(ref.current)ro.observe(ref.current);
    return()=>ro.disconnect();
  },[]);
  const positions=useForceGraph(entities,edges,dims.W,dims.H);
  const [hovered,setHovered]=useState(null);
  const visEdges=edges.filter(e=>{
    const lm={THREATENS:"GEOPOLITICAL",GEOPOLITICAL_RISK:"GEOPOLITICAL",RISK_PROPAGATION:"CLAIMS",CLAIMS_EXPOSURE:"FRAUD",REINSURANCE_FLOW:"REINSURANCE",SUPPLY_CHAIN:"MARITIME",REGULATORY_LINK:"GEOPOLITICAL",ECONOMIC_LINK:"MARITIME"};
    return activeLayers[lm[e.type]||"GEOPOLITICAL"];
  });
  return(
    <div ref={ref} style={{flex:1,background:C.void,position:"relative",overflow:"hidden"}}>
      <svg width="100%" height="100%" style={{display:"block"}}>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={C.textDim} opacity="0.5"/>
          </marker>
          <filter id="nodeGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {Array.from({length:30},(_,i)=>(
          <circle key={i} cx={(i*137.5)%dims.W} cy={(i*97.3)%dims.H} r="1" fill={C.blue} opacity="0.06"/>
        ))}
        {visEdges.map(edge=>{
          const a=positions[edge.from],b=positions[edge.to];
          if(!a||!b)return null;
          const isHov=hovered===edge.from+edge.to;
          const isRelated=selected&&(edge.from===selected||edge.to===selected);
          const op=selected?(isRelated?0.9:0.15):(isHov?0.9:0.4);
          const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1;
          const r=14;
          const ex=b.x-(dx/len)*r,ey=b.y-(dy/len)*r;
          return(
            <g key={edge.from+edge.to} onMouseEnter={()=>setHovered(edge.from+edge.to)} onMouseLeave={()=>setHovered(null)}>
              <line x1={a.x} y1={a.y} x2={ex} y2={ey} stroke={edge.color} strokeWidth={isHov||isRelated?2:1.2} opacity={op} markerEnd="url(#arr)"/>
              {isHov&&<text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6} fill={edge.color} fontSize={8} fontFamily="IBM Plex Mono" textAnchor="middle">{edge.label}</text>}
              <circle cx={(a.x+b.x)/2} cy={(a.y+b.y)/2} r={2+edge.weight*2} fill={edge.color} opacity={op*0.7}/>
            </g>
          );
        })}
        {entities.map(ent=>{
          const pos=positions[ent.id];
          if(!pos)return null;
          const col=riskColor(ent.risk);
          const isSel=selected===ent.id;
          const sz=ent.type==="COUNTRY"?18:ent.type==="THREAT"?20:ent.type==="INSURER"?16:14;
          const isRelated=selected&&EDGES.some(e=>(e.from===selected&&e.to===ent.id)||(e.to===selected&&e.from===ent.id));
          const dimmed=selected&&!isSel&&!isRelated;
          return(
            <g key={ent.id} style={{cursor:"pointer"}} onClick={()=>onSelect(ent.id===selected?null:ent.id)} opacity={dimmed?0.2:1}>
              {(isSel||ent.risk>75)&&<circle cx={pos.x} cy={pos.y} r={sz+8} fill={col} opacity="0.08" filter="url(#nodeGlow)"/>}
              {isSel&&<circle cx={pos.x} cy={pos.y} r={sz+5} fill="none" stroke={C.blue} strokeWidth="1.5" strokeDasharray="4 2"/>}
              {ent.type==="COUNTRY"
                ?<circle cx={pos.x} cy={pos.y} r={sz} fill={`${col}20`} stroke={col} strokeWidth={isSel?2:1.5}/>
                :ent.type==="THREAT"
                ?<polygon points={entities.map((_,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;return`${pos.x+Math.cos(a)*sz},${pos.y+Math.sin(a)*sz}`;}).slice(0,5).join(" ")} fill={`${col}25`} stroke={col} strokeWidth="1.5"/>
                :ent.type==="CHOKEPOINT"
                ?<polygon points={`${pos.x},${pos.y-sz} ${pos.x+sz*0.87},${pos.y+sz*0.5} ${pos.x-sz*0.87},${pos.y+sz*0.5}`} fill={`${col}25`} stroke={col} strokeWidth="1.5"/>
                :<rect x={pos.x-sz} y={pos.y-sz} width={sz*2} height={sz*2} rx="4" fill={`${col}20`} stroke={col} strokeWidth="1.2"/>
              }
              <text x={pos.x} y={pos.y+4} textAnchor="middle" fill={col} fontSize={ent.type==="COUNTRY"?9:8} fontFamily="IBM Plex Mono" fontWeight="700">
                {ent.id.toUpperCase().slice(0,3)}
              </text>
              <text x={pos.x} y={pos.y+sz+14} textAnchor="middle" fill={isSel?C.textBright:C.textDim} fontSize={8.5} fontFamily="IBM Plex Mono">
                {ent.label.length>12?ent.label.slice(0,12)+"\u2026":ent.label}
              </text>
              <rect x={pos.x+sz-2} y={pos.y-sz-2} width={20} height={12} rx="2" fill={`${col}25`} stroke={col} strokeWidth="0.8"/>
              <text x={pos.x+sz+8} y={pos.y-sz+8} textAnchor="middle" fill={col} fontSize={7.5} fontFamily="IBM Plex Mono" fontWeight="700">{Math.round(ent.risk)}</text>
            </g>
          );
        })}
      </svg>
      <div style={{position:"absolute",top:10,right:10,background:"#0a0a1a90",border:`1px solid ${C.border}`,borderRadius:4,padding:"8px 12px",fontSize:8,fontFamily:"IBM Plex Mono"}}>
        <div style={{color:C.amber,marginBottom:4,letterSpacing:1}}>GRAPH INTELLIGENCE</div>
        <div style={{color:C.textDim,lineHeight:2}}>
          Nodes: {entities.length}<br/>
          Edges: {visEdges.length}<br/>
          Layout: Force-Directed<br/>
          Algo: Barnes-Hut sim
        </div>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// VIEW: TIMELINE + FORECAST
// ══════════════════════════════════════════════════════════════════════════════
function TimelineView(){
  const [replay,setReplay]=useState(70);
  const [playMode,setPlayMode]=useState(false);
  const ref=useRef(null);
  const [W,setW]=useState(700);
  useEffect(()=>{
    const ro=new ResizeObserver(e=>setW(e[0].contentRect.width));
    if(ref.current)ro.observe(ref.current);
    return()=>ro.disconnect();
  },[]);
  useEffect(()=>{
    if(!playMode)return;
    const iv=setInterval(()=>setReplay(r=>{if(r>=100){setPlayMode(false);return 100;}return r+0.5;}),80);
    return()=>clearInterval(iv);
  },[playMode]);
  const seriesH=80;
  const seriesData=[
    {key:"hormuzRisk",label:"Hormuz Risk Score",color:C.red,unit:"/100",forecast:true},
    {key:"marineClaims",label:"Marine Claims Index",color:C.amber,unit:"index",forecast:true},
    {key:"fraudIndex",label:"FRIN Fraud Index",color:C.violet,unit:"/100",forecast:false},
    {key:"oilPrice",label:"Brent Crude",color:C.orange,unit:"$/bbl",forecast:true},
  ];
  const events=[
    {t:20,label:"SAMA circular",color:C.teal,severity:"MEDIUM"},
    {t:35,label:"Hormuz signal",color:C.red,severity:"CRITICAL"},
    {t:50,label:"Fraud cluster",color:C.violet,severity:"HIGH"},
    {t:65,label:"AIS dark vessels",color:C.red,severity:"HIGH"},
    {t:replay,label:"NOW",color:C.blue,severity:"INFO"},
  ];
  return(
    <div ref={ref} style={{flex:1,background:C.void,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 14px"}}>
        <span style={{fontSize:8,color:C.amber,letterSpacing:2,fontFamily:"IBM Plex Mono"}}>TEMPORAL INTELLIGENCE \u2014 LAST 30 DAYS</span>
        <div style={{flex:1,position:"relative"}}>
          <input type="range" min="0" max="100" value={replay} onChange={e=>setReplay(+e.target.value)}
            style={{width:"100%",accentColor:C.blue,cursor:"pointer"}}/>
          {events.map(ev=>(
            <div key={ev.label} style={{position:"absolute",left:`${ev.t}%`,top:-4,transform:"translateX(-50%)",width:2,height:8,background:ev.color,borderRadius:1}}/>
          ))}
        </div>
        <span style={{fontSize:9,color:C.blue,fontFamily:"IBM Plex Mono",minWidth:40}}>T-{Math.round((100-replay)*0.3)}d</span>
        <button onClick={()=>setPlayMode(p=>!p)} style={{padding:"4px 12px",fontSize:8,fontWeight:700,border:`1px solid ${playMode?C.amber:C.border}`,background:playMode?`${C.amber}20`:"transparent",color:playMode?C.amber:C.textDim,borderRadius:3,cursor:"pointer",fontFamily:"IBM Plex Mono"}}>
          {playMode?"\u23F8 PAUSE":"\u25B6 PLAY"}
        </button>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {events.slice(0,-1).map(ev=>(
          <div key={ev.label} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:`${ev.color}15`,border:`1px solid ${ev.color}30`,borderRadius:3}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:ev.color}}/>
            <span style={{fontSize:8,color:ev.color,fontFamily:"IBM Plex Mono"}}>{ev.label}</span>
          </div>
        ))}
      </div>
      {seriesData.map(({key,label,color,unit,forecast})=>{
        const data=FORECAST_SERIES[key];
        const cutoff=Math.round((replay/100)*data.length);
        const historical=data.slice(0,cutoff);
        const future=data.slice(cutoff);
        const mn=Math.min(...data.map(d=>d.v));
        const mx=Math.max(...data.map(d=>d.v));
        const rng=mx-mn||1;
        const toY=v=>seriesH-((v-mn)/rng)*(seriesH-12)-4;
        const toX=i=>(i/(data.length-1))*(W-130);
        const histPts=historical.map((d,i)=>`${toX(i)},${toY(d.v)}`).join(" ");
        const futurePts=future.map((d,i)=>`${toX(cutoff+i)},${toY(d.v)}`).join(" ");
        return(
          <div key={key} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <span style={{fontSize:9,color,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{label}</span>
                {forecast&&<span style={{marginLeft:8,fontSize:7.5,color:C.textDim,background:`${color}15`,padding:"1px 5px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>FORECAST ACTIVE</span>}
              </div>
              <span style={{fontSize:10,color,fontWeight:700,fontFamily:"IBM Plex Mono"}}>
                {historical.length>0?historical[historical.length-1].v.toFixed(1):data[0].v.toFixed(1)} {unit}
              </span>
            </div>
            <svg width={W-130} height={seriesH} style={{display:"block",overflow:"visible"}}>
              {[0.25,0.5,0.75].map(f=>(
                <line key={f} x1="0" y1={seriesH*f} x2={W-130} y2={seriesH*f} stroke={C.border} strokeWidth="0.5"/>
              ))}
              {historical.length>1&&(
                <>
                  <polygon points={`0,${seriesH} ${histPts} ${toX(historical.length-1)},${seriesH}`} fill={color} opacity="0.08"/>
                  <polyline points={histPts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
                </>
              )}
              {forecast&&future.length>1&&(
                <>
                  <polygon points={`${toX(cutoff)},${seriesH} ${futurePts} ${toX(data.length-1)},${seriesH}`} fill={color} opacity="0.04"/>
                  <polyline points={`${historical.length>0?`${toX(historical.length-1)},${toY(historical[historical.length-1].v)} `:""}${futurePts}`} fill="none" stroke={color} strokeWidth="1.4" strokeDasharray="5 3" strokeLinejoin="round" opacity="0.6"/>
                </>
              )}
              {cutoff>0&&cutoff<data.length&&(
                <line x1={toX(cutoff)} y1={0} x2={toX(cutoff)} y2={seriesH} stroke={C.blue} strokeWidth="1" strokeDasharray="3 2"/>
              )}
              {forecast&&future.length>1&&(
                <polygon points={`${toX(cutoff)},${toY(future[0].v+5)} ${future.map((d,i)=>`${toX(cutoff+i)},${toY(d.v+5)}`).join(" ")} ${future.map((d,i)=>`${toX(cutoff+future.length-1-i)},${toY(future[future.length-1-i].v-5)}`).join(" ")} ${toX(cutoff)},${toY(future[0].v-5)}`} fill={color} opacity="0.05"/>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// VIEW: ARCHITECTURE
// ══════════════════════════════════════════════════════════════════════════════
function ArchView(){
  const [activeLayer,setActiveLayer]=useState(null);
  const al=activeLayer!=null?ARCH_LAYERS[activeLayer]:null;
  return(
    <div style={{flex:1,background:C.void,overflow:"auto",padding:16,display:"grid",gridTemplateColumns:"1fr 320px",gap:12}}>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:8,color:C.amber,letterSpacing:2,fontFamily:"IBM Plex Mono",marginBottom:4}}>DEEVO 7-LAYER INTELLIGENCE ARCHITECTURE</div>
        {ARCH_LAYERS.map((lyr,i)=>{
          const isAct=activeLayer===i;
          return(
            <div key={lyr.id} onClick={()=>setActiveLayer(isAct?null:i)} style={{background:isAct?`${lyr.color}12`:C.surface,border:`1px solid ${isAct?lyr.color:C.border}`,borderRadius:6,padding:"12px 16px",cursor:"pointer",transition:"all 0.2s",boxShadow:isAct?`0 0 24px ${lyr.color}20`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:`${lyr.color}15`,border:`2px solid ${lyr.color}${isAct?"":"60"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:lyr.color,flexShrink:0}}>{lyr.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,color:isAct?lyr.color:C.text,fontFamily:"IBM Plex Mono"}}>L{lyr.id} \u00B7 {lyr.name}</span>
                    <div style={{display:"flex",gap:6}}>
                      <span style={{fontSize:8,color:lyr.color,background:`${lyr.color}15`,padding:"2px 7px",borderRadius:10,fontFamily:"IBM Plex Mono"}}>{lyr.throughput}</span>
                      <span style={{fontSize:8,color:C.textDim,background:C.raised,padding:"2px 7px",borderRadius:10,fontFamily:"IBM Plex Mono"}}>{lyr.latency}</span>
                    </div>
                  </div>
                  <div style={{fontSize:8.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{lyr.nameAr}</div>
                  <div style={{marginTop:6,height:2,background:C.border,borderRadius:1}}>
                    <div style={{width:`${(8-lyr.id)/7*100}%`,height:"100%",background:lyr.color,borderRadius:1,transition:"width 0.5s"}}/>
                  </div>
                </div>
              </div>
              {isAct&&(
                <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:5}}>
                  {lyr.components.map(c=>(
                    <span key={c} style={{fontSize:8,color:lyr.color,background:`${lyr.color}12`,border:`1px solid ${lyr.color}25`,padding:"3px 8px",borderRadius:3,fontFamily:"IBM Plex Mono"}}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {al?(
          <div style={{background:C.surface,border:`1px solid ${al.color}`,borderRadius:6,padding:14}}>
            <div style={{fontSize:8,color:al.color,letterSpacing:2,marginBottom:8,fontFamily:"IBM Plex Mono"}}>L{al.id} COMPONENTS</div>
            {al.components.map((c,i)=>(
              <div key={c} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:`${al.color}20`,border:`1px solid ${al.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:al.color,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:9,color:C.text,fontFamily:"IBM Plex Mono"}}>{c}</span>
              </div>
            ))}
            <div style={{marginTop:10,padding:8,background:`${al.color}08`,borderRadius:4}}>
              <div style={{fontSize:8,color:al.color,marginBottom:4}}>PERFORMANCE</div>
              <div style={{fontSize:9,color:C.textDim,fontFamily:"IBM Plex Mono",lineHeight:1.8}}>
                Throughput: {al.throughput}<br/>
                Latency: {al.latency}
              </div>
            </div>
          </div>
        ):(
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:14}}>
            <div style={{fontSize:8,color:C.amber,letterSpacing:2,marginBottom:8,fontFamily:"IBM Plex Mono"}}>SYSTEM SPECS</div>
            {[
              {label:"Total Signals/s",value:"2,400",color:C.blue},
              {label:"Active Models",value:"12",color:C.violet},
              {label:"AI Agents",value:"7",color:C.rose},
              {label:"API Endpoints",value:"34",color:C.amber},
              {label:"Audit Entries",value:"SHA-256",color:C.teal},
              {label:"Variants",value:"4",color:C.textDim},
            ].map(s=>(
              <div key={s.label} style={{display:"flex",justifyContent:"space-between",marginBottom:6,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:9,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{s.label}</span>
                <span style={{fontSize:10,fontWeight:700,color:s.color,fontFamily:"IBM Plex Mono"}}>{s.value}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:14}}>
          <div style={{fontSize:8,color:C.amber,letterSpacing:2,marginBottom:10,fontFamily:"IBM Plex Mono"}}>BACKEND STACK</div>
          {[
            {layer:"Ingestion",tech:"FastAPI \u00B7 Redis Streams",color:C.blue},
            {layer:"Processing",tech:"Python \u00B7 LangGraph",color:C.violet},
            {layer:"Storage",tech:"PostgreSQL \u00B7 PostGIS",color:C.teal},
            {layer:"Cache",tech:"Upstash Redis \u00B7 3-tier",color:C.amber},
            {layer:"AI/ML",tech:"Ollama \u00B7 llama3.2 local",color:C.rose},
            {layer:"Deploy",tech:"Vercel Edge \u00B7 Railway",color:C.textDim},
            {layer:"Audit",tech:"SHA-256 chain \u00B7 PDPL",color:"#94a3b8"},
          ].map(s=>(
            <div key={s.layer} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{width:70,fontSize:8,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{s.layer}</span>
              <span style={{flex:1,fontSize:8.5,color:s.color,fontFamily:"IBM Plex Mono"}}>{s.tech}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:14}}>
          <div style={{fontSize:8,color:C.amber,letterSpacing:2,marginBottom:8,fontFamily:"IBM Plex Mono"}}>USE CASES</div>
          {[
            {title:"Fraud Detection",desc:"FRIN motor cluster \u2192 SIU escalation",color:C.violet,time:"91ms"},
            {title:"Claim Escalation",desc:"Hormuz signal \u2192 war clause review",color:C.red,time:"340ms"},
            {title:"Geo-Risk Impact",desc:"Iran thermal \u2192 energy policy hold",color:C.amber,time:"220ms"},
            {title:"IFRS17 Compliance",desc:"SAMA circular \u2192 CSM recalculation",color:C.teal,time:"instant"},
          ].map(uc=>(
            <div key={uc.title} style={{padding:"6px 8px",marginBottom:5,background:C.raised,borderRadius:4,borderLeft:`2px solid ${uc.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:9,color:uc.color,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{uc.title}</span>
                <span style={{fontSize:8,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{uc.time}</span>
              </div>
              <div style={{fontSize:8.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{uc.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// PANEL: DECISION ENGINE
// ══════════════════════════════════════════════════════════════════════════════
function DecisionPanel(){
  const [dIdx,setDIdx]=useState(0);
  const [approved,setApproved]=useState({});
  const [subTab,setSubTab]=useState("DECISION");
  const d=DECISIONS[dIdx];
  return(
    <div style={{width:300,background:C.surface,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        {["DECISION","SIGNALS"].map(t=>(
          <button key={t} onClick={()=>setSubTab(t)} style={{flex:1,padding:"8px 4px",fontSize:8,fontWeight:700,letterSpacing:1,border:"none",background:"transparent",color:subTab===t?C.blue:C.textDim,borderBottom:`2px solid ${subTab===t?C.blue:"transparent"}`,fontFamily:"IBM Plex Mono",cursor:"pointer"}}>
            {t==="DECISION"?"\u26A1 DECISION":"\uD83D\uDCE1 SIGNALS"}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {subTab==="DECISION"?(
          <div style={{padding:12}}>
            <div style={{display:"flex",gap:4,marginBottom:10}}>
              {DECISIONS.map((dec,i)=>(
                <div key={dec.id} onClick={()=>setDIdx(i)} style={{flex:1,padding:"5px 8px",background:i===dIdx?`${C.blue}15`:C.raised,border:`1px solid ${i===dIdx?C.blue:C.border}`,borderRadius:3,cursor:"pointer"}}>
                  <div style={{fontSize:7.5,color:i===dIdx?C.blue:C.textDim,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{dec.id}</div>
                  <div style={{fontSize:7.5,color:dec.severity==="CRITICAL"?C.red:C.amber,fontFamily:"IBM Plex Mono"}}>{dec.severity}</div>
                </div>
              ))}
            </div>
            <div style={{background:d.severity==="CRITICAL"?`${C.red}08`:`${C.amber}08`,border:`1px solid ${d.severity==="CRITICAL"?C.red:C.amber}30`,borderRadius:4,padding:10,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:8,color:d.severity==="CRITICAL"?C.red:C.amber,fontWeight:700,letterSpacing:1,fontFamily:"IBM Plex Mono"}}>{d.severity}</span>
                <span style={{fontSize:7.5,color:C.textDim,background:C.raised,padding:"1px 5px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>{d.status.replace("_"," ")}</span>
              </div>
              <div style={{fontSize:10,fontWeight:700,color:C.textBright,lineHeight:1.4,fontFamily:"IBM Plex Mono"}}>{d.title}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:10}}>
              {[
                {l:"Exposure",v:d.impact.exposure,c:C.red},
                {l:"Policies",v:d.impact.policies,c:C.amber},
                {l:"Probability",v:`${Math.round(d.impact.prob*100)}%`,c:C.violet},
                {l:"Act By",v:d.impact.timeToAct,c:C.teal},
              ].map(({l,v,c})=>(
                <div key={l} style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:3,padding:"6px 8px"}}>
                  <div style={{fontSize:7.5,color:C.textDim,marginBottom:2,fontFamily:"IBM Plex Mono"}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:700,color:c,fontFamily:"IBM Plex Mono"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:8,color:C.textDim,letterSpacing:1.5,marginBottom:8,fontFamily:"IBM Plex Mono"}}>\u2B21 AI REASONING \u2014 EXPLAINABLE</div>
            {d.reasoning.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:`${C.violet}20`,border:`1px solid ${C.violet}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:C.violet,flexShrink:0,fontFamily:"IBM Plex Mono"}}>{r.step}</div>
                  {i<d.reasoning.length-1&&<div style={{width:1,height:14,background:`${C.violet}30`}}/>}
                </div>
                <div style={{flex:1,paddingTop:1}}>
                  <div style={{fontSize:7.5,color:C.violet,marginBottom:2,fontFamily:"IBM Plex Mono"}}>{r.layer}</div>
                  <div style={{fontSize:9,color:C.text,marginBottom:4,lineHeight:1.4}}>{r.text}</div>
                  <ConfBar v={r.conf} color={C.violet}/>
                </div>
              </div>
            ))}
            <div style={{fontSize:8,color:C.textDim,letterSpacing:1.5,margin:"10px 0 8px",fontFamily:"IBM Plex Mono"}}>RECOMMENDED ACTIONS</div>
            {d.actions.map(action=>{
              const isOn=approved[action.id];
              const rc=action.risk==="HIGH"?C.red:action.risk==="MEDIUM"?C.amber:C.teal;
              return(
                <div key={action.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,padding:"7px 8px",background:isOn?`${C.teal}08`:C.raised,border:`1px solid ${isOn?C.teal:C.border}`,borderRadius:3}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:9,color:isOn?C.teal:C.text,marginBottom:3,lineHeight:1.3}}>{action.label}</div>
                    <div style={{display:"flex",gap:4}}>
                      <span style={{fontSize:7,color:rc,background:`${rc}15`,padding:"1px 4px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>{action.risk}</span>
                      {action.auto&&<span style={{fontSize:7,color:C.blue,background:`${C.blue}15`,padding:"1px 4px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>AUTO</span>}
                      {!action.rev&&<span style={{fontSize:7,color:C.red,background:`${C.red}15`,padding:"1px 4px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>IRREVERSIBLE</span>}
                    </div>
                  </div>
                  <div onClick={()=>setApproved(p=>({...p,[action.id]:!p[action.id]}))} style={{width:26,height:15,borderRadius:8,background:isOn?C.teal:C.border,cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                    <div style={{width:11,height:11,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:isOn?13:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.5)"}}/>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:12,padding:10,background:`${C.amber}08`,border:`1px solid ${C.amber}25`,borderRadius:4}}>
              <div style={{fontSize:7.5,color:C.amber,marginBottom:4,fontFamily:"IBM Plex Mono",letterSpacing:1}}>\u26A0 L7\u00B7GOVERNANCE \u2014 HUMAN GATE</div>
              <div style={{fontSize:8.5,color:C.textDim,marginBottom:8,lineHeight:1.5}}>Final approval required. SHA-256 audit trail created on action.</div>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:1,padding:"6px",fontSize:8,fontWeight:700,border:`1px solid ${C.teal}`,background:`${C.teal}15`,color:C.teal,borderRadius:3,cursor:"pointer",fontFamily:"IBM Plex Mono",letterSpacing:1}}>\u2713 APPROVE</button>
                <button style={{flex:1,padding:"6px",fontSize:8,fontWeight:700,border:`1px solid ${C.border}`,background:"transparent",color:C.textDim,borderRadius:3,cursor:"pointer",fontFamily:"IBM Plex Mono"}}>DEFER</button>
              </div>
            </div>
          </div>
        ):(
          <div>
            <div style={{padding:"8px 12px 4px",fontSize:8,color:C.textDim,letterSpacing:1.5,fontFamily:"IBM Plex Mono"}}>LIVE SIGNAL STREAM</div>
            {SIGNALS.map((sig)=>{
              const sc=sig.severity==="CRITICAL"?C.red:sig.severity==="HIGH"?C.amber:C.teal;
              return(
                <div key={sig.id} style={{padding:"8px 12px",borderBottom:"1px solid #0f0f1e",borderLeft:`2px solid ${sc}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{display:"flex",gap:4}}>
                      <span style={{fontSize:7.5,color:sc,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{sig.severity}</span>
                      <span style={{fontSize:7.5,color:C.blue,background:`${C.blue}12`,padding:"0 4px",borderRadius:2,fontFamily:"IBM Plex Mono"}}>{sig.layer}</span>
                    </div>
                    <span style={{fontSize:7.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{sig.time}</span>
                  </div>
                  <div style={{fontSize:9,color:C.text,lineHeight:1.45,marginBottom:4}}>{sig.text}</div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:7.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{sig.src}</span>
                    <ConfBar v={sig.conf} color={sc}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// LEFT SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
function LeftSidebar({entities,activeLayers,onLayerToggle,selected,onSelect}){
  const LAYER_DEFS=[
    {id:"GEOPOLITICAL",color:C.red,label:"GEO"},
    {id:"CLAIMS",color:C.amber,label:"CLAIMS"},
    {id:"FRAUD",color:C.violet,label:"FRAUD"},
    {id:"MARITIME",color:C.blue,label:"MARITIME"},
    {id:"REINSURANCE",color:"#7c3aff",label:"REINSURE"},
  ];
  return(
    <div style={{width:190,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
      <div style={{padding:"10px 10px 6px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{fontSize:7.5,color:C.textDim,letterSpacing:1.5,marginBottom:6,fontFamily:"IBM Plex Mono"}}>INTELLIGENCE LAYERS</div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {LAYER_DEFS.map(({id,color,label})=>{
            const on=activeLayers[id];
            return(
              <div key={id} onClick={()=>onLayerToggle(id)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"4px 6px",borderRadius:3,background:on?`${color}10`:"transparent",border:`1px solid ${on?color:C.border}`,transition:"all 0.15s"}}>
                <div style={{width:20,height:12,borderRadius:6,background:on?color:C.border,position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:on?10:2,transition:"left 0.2s"}}/>
                </div>
                <span style={{fontSize:8,color:on?color:C.textDim,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{padding:"8px 10px 4px",fontSize:7.5,color:C.textDim,letterSpacing:1.5,fontFamily:"IBM Plex Mono"}}>ENTITIES \u00B7 {entities.length}</div>
        {entities.map(ent=>{
          const col=riskColor(ent.risk);
          const isSel=selected===ent.id;
          return(
            <div key={ent.id} onClick={()=>onSelect(ent.id===selected?null:ent.id)} style={{padding:"6px 10px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isSel?`${C.blue}08`:"transparent",borderLeft:`2px solid ${isSel?C.blue:"transparent"}`,transition:"all 0.1s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:8.5,color:isSel?C.textBright:C.text,fontWeight:isSel?700:400,fontFamily:"IBM Plex Mono"}}>{ent.label}</span>
                <span style={{fontSize:8,fontWeight:700,color:col,fontFamily:"IBM Plex Mono"}}>{Math.round(ent.risk)}</span>
              </div>
              <div style={{height:2,background:C.border,borderRadius:1}}>
                <div style={{width:`${ent.risk}%`,height:"100%",background:col,borderRadius:1,transition:"width 0.5s"}}/>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,padding:"8px 10px",flexShrink:0}}>
        {[
          {l:"SIGNALS/s",v:"2.4K",c:C.blue},
          {l:"MODELS",v:"12",c:C.violet},
          {l:"AGENTS",v:"7",c:C.rose},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:7.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{s.l}</span>
            <span style={{fontSize:8,fontWeight:700,color:s.c,fontFamily:"IBM Plex Mono"}}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function DeevoComplete(){
  const [view,setView]=useState("MAP");
  const [selected,setSelected]=useState(null);
  const [activeLayers,setActiveLayers]=useState({GEOPOLITICAL:true,CLAIMS:true,FRAUD:true,MARITIME:true,REINSURANCE:false});
  const [entities,setEntities]=useState(ENTITIES);
  const [tick,setTick]=useState(0);
  const [time,setTime]=useState(new Date());
  useEffect(()=>{
    const iv=setInterval(()=>{
      setTick(t=>t+1);
      setTime(new Date());
      setEntities(prev=>prev.map(e=>({...e,risk:e.type==="THREAT"?e.risk:Math.max(10,Math.min(99,e.risk+(Math.random()-0.5)*1.2))})));
    },2500);
    return()=>clearInterval(iv);
  },[]);
  const toggleLayer=useCallback(l=>setActiveLayers(p=>({...p,[l]:!p[l]})),[]);
  const VIEWS=[
    {id:"MAP",icon:"\u25CE",label:"GEO MAP"},
    {id:"GRAPH",icon:"\u25C8",label:"GRAPH"},
    {id:"TIMELINE",icon:"\u25D0",label:"TIMELINE"},
    {id:"ARCH",icon:"\u25C6",label:"ARCHITECTURE"},
  ];
  const CSS=`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:${C.void};}
    ::-webkit-scrollbar{width:2px;height:2px;}
    ::-webkit-scrollbar-thumb{background:${C.blue}50;border-radius:1px;}
    input[type=range]{cursor:pointer;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes dash{to{stroke-dashoffset:-12}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  `;
  const maxRisk=Math.max(...entities.map(e=>e.risk));
  const criticalEntities=entities.filter(e=>e.risk>=80);
  return(
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:C.void,color:C.text,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",fontSize:11}}>
      <style>{CSS}</style>
      <div style={{height:42,background:C.deep,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:12,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="10,1 19,5.5 19,14.5 10,19 1,14.5 1,5.5" fill="none" stroke={C.amber} strokeWidth="1.5"/>
            <circle cx="10" cy="10" r="3.5" fill={C.amber} opacity="0.9"/>
          </svg>
          <span style={{fontSize:14,fontWeight:700,letterSpacing:3,color:C.textBright}}>DEEVO</span>
          <span style={{fontSize:9,color:C.textDim,letterSpacing:2}}>DECISION INTELLIGENCE</span>
        </div>
        <div style={{width:1,height:22,background:C.border}}/>
        <div style={{display:"flex",gap:2}}>
          {VIEWS.map(({id,icon,label})=>(
            <button key={id} onClick={()=>setView(id)} style={{padding:"4px 10px",fontSize:8.5,fontWeight:700,letterSpacing:1,border:`1px solid ${view===id?C.amber:C.border}`,background:view===id?`${C.amber}18`:"transparent",color:view===id?C.amber:C.textDim,borderRadius:3,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",transition:"all 0.15s"}}>
              {icon} {label}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        {criticalEntities.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:`${C.red}15`,border:`1px solid ${C.red}30`,borderRadius:3}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.red,animation:"pulse 1s infinite"}}/>
            <span style={{fontSize:8,color:C.red,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{criticalEntities.length} CRITICAL</span>
          </div>
        )}
        <div style={{padding:"3px 8px",background:`${C.amber}15`,border:`1px solid ${C.amber}30`,borderRadius:3,fontSize:8,color:C.amber,fontWeight:700,fontFamily:"IBM Plex Mono"}}>
          \u26A0 DEFCON 2
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:C.teal,animation:"pulse 1.5s infinite"}}/>
          <span style={{fontSize:8,color:C.teal,fontFamily:"IBM Plex Mono"}}>LIVE</span>
        </div>
        <div style={{width:1,height:22,background:C.border}}/>
        <span style={{fontSize:8,color:C.textDim,fontFamily:"monospace"}}>{time.toISOString().slice(11,19)} UTC</span>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <LeftSidebar entities={entities} activeLayers={activeLayers} onLayerToggle={toggleLayer} selected={selected} onSelect={setSelected} view={view}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {view==="MAP"&&<MapView entities={entities} edges={EDGES} signals={SIGNALS} activeLayers={activeLayers} selected={selected} onSelect={setSelected}/>}
          {view==="GRAPH"&&<GraphView entities={entities} edges={EDGES} activeLayers={activeLayers} selected={selected} onSelect={setSelected}/>}
          {view==="TIMELINE"&&<TimelineView/>}
          {view==="ARCH"&&<ArchView/>}
          <div style={{height:28,background:C.deep,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 12px",gap:14,flexShrink:0}}>
            {[
              {l:"MAX RISK",v:`${Math.round(maxRisk)}/100`,c:riskColor(maxRisk)},
              {l:"ENTITIES",v:entities.length,c:C.textDim},
              {l:"ACTIVE EDGES",v:EDGES.filter(e=>activeLayers[{THREATENS:"GEOPOLITICAL",GEOPOLITICAL_RISK:"GEOPOLITICAL",RISK_PROPAGATION:"CLAIMS",CLAIMS_EXPOSURE:"FRAUD",REINSURANCE_FLOW:"REINSURANCE",SUPPLY_CHAIN:"MARITIME",REGULATORY_LINK:"GEOPOLITICAL",ECONOMIC_LINK:"MARITIME"}[e.type]||"GEOPOLITICAL"]).length,c:C.blue},
              {l:"SIGNALS TODAY",v:"2,847",c:C.violet},
              {l:"DECISIONS PENDING",v:"1",c:C.amber},
              {l:"AUDIT CHAIN",v:"SHA-256 \u2713",c:C.teal},
              {l:"PDPL",v:"COMPLIANT",c:C.teal},
            ].map(({l,v,c})=>(
              <div key={l} style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:7.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>{l}:</span>
                <span style={{fontSize:8,color:c,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{v}</span>
              </div>
            ))}
            <div style={{flex:1}}/>
            <span style={{fontSize:7.5,color:C.textDim,fontFamily:"IBM Plex Mono"}}>DEEVO INTELLIGENCE MONITOR v3.0 \u00B7 GCC EDITION</span>
          </div>
        </div>
        <DecisionPanel/>
      </div>
    </div>
  );
}