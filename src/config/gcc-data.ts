export type GCCCode = 'SA'|'UAE'|'KW'|'QA'|'BH'|'OM';
export interface GCCCountry { code:GCCCode;name:string;capital:string;lat:number;lng:number;gdp_usd_billion:number;gdp_growth_pct:number;gdp_per_capita:number;population_million:number;oil_revenue_pct:number;vision_plan:string;currency:string;exchange_rate_usd:number;sovereign_fund_usd_billion:number;credit_rating:string;color:string;sectors:SectorConfig[];airports:Airport[]; }
export interface SectorConfig { id:string;label:string;gdp_contribution_pct:number;employment_pct:number;growth_pct:number;private_pct:number;listed_companies:number;market_cap_usd_billion:number;risk_score:number;subsectors:string[]; }
export interface Airport { iata:string;icao:string;name:string;city:string;lat:number;lng:number;type:'mega'|'international'|'domestic';pax_annual_million:number;cargo_tonnes_annual:number;runways:number;capacity_pax_million:number;airlines_count:number;destinations:number;operator:string;hub_for:string[]; }
export interface GeoEvent { id:string;title:string;type:'missile'|'sanction'|'trade'|'policy'|'natural'|'cyber'|'military';severity:'CRITICAL'|'HIGH'|'MEDIUM'|'LOW';origin_lat:number;origin_lng:number;target_lat?:number;target_lng?:number;timestamp:number;impacts:EventImpact[];description:string; }
export interface EventImpact { asset:string;direction:'UP'|'DOWN'|'VOLATILE';magnitude_pct:number;confidence:number;rationale:string;timeframe:'1H'|'24H'|'1W'|'1M'; }
export interface MapLayer { id:string;label:string;category:'economic'|'infrastructure'|'sectors'|'geopolitical'|'analytics';color:string;active:boolean;description:string; }

export const GDP_TIMELINE: Record<GCCCode,{year:number;gdp:number}[]> = {
  SA:[{year:2018,gdp:786},{year:2019,gdp:793},{year:2020,gdp:700},{year:2021,gdp:833},{year:2022,gdp:1109},{year:2023,gdp:1068},{year:2024,gdp:1072}],
  UAE:[{year:2018,gdp:422},{year:2019,gdp:422},{year:2020,gdp:359},{year:2021,gdp:415},{year:2022,gdp:507},{year:2023,gdp:504},{year:2024,gdp:527}],
  KW:[{year:2018,gdp:141},{year:2019,gdp:137},{year:2020,gdp:106},{year:2021,gdp:136},{year:2022,gdp:185},{year:2023,gdp:162},{year:2024,gdp:164}],
  QA:[{year:2018,gdp:192},{year:2019,gdp:183},{year:2020,gdp:147},{year:2021,gdp:179},{year:2022,gdp:236},{year:2023,gdp:220},{year:2024,gdp:223}],
  BH:[{year:2018,gdp:37},{year:2019,gdp:38},{year:2020,gdp:34},{year:2021,gdp:39},{year:2022,gdp:44},{year:2023,gdp:44},{year:2024,gdp:45}],
  OM:[{year:2018,gdp:79},{year:2019,gdp:77},{year:2020,gdp:63},{year:2021,gdp:85},{year:2022,gdp:108},{year:2023,gdp:104},{year:2024,gdp:107}],
};

export const GCC_COUNTRIES: GCCCountry[] = [
  {code:'SA',name:'Saudi Arabia',capital:'Riyadh',lat:24.7136,lng:46.6753,gdp_usd_billion:1072,gdp_growth_pct:2.6,gdp_per_capita:29000,population_million:36.9,oil_revenue_pct:62,vision_plan:'Vision 2030',currency:'SAR',exchange_rate_usd:3.75,sovereign_fund_usd_billion:776,credit_rating:'A+',color:'#10b981',
    sectors:[
      {id:'oil_gas',label:'Oil & Gas',gdp_contribution_pct:42,employment_pct:3,growth_pct:1.2,private_pct:35,listed_companies:8,market_cap_usd_billion:2100,risk_score:45,subsectors:['Upstream','Downstream','Petrochemicals','LNG']},
      {id:'banking',label:'Banking',gdp_contribution_pct:9,employment_pct:4,growth_pct:7.4,private_pct:70,listed_companies:12,market_cap_usd_billion:312,risk_score:28,subsectors:['Retail Banking','Islamic Finance','Investment','Takaful']},
      {id:'insurance',label:'Insurance',gdp_contribution_pct:2.1,employment_pct:1.2,growth_pct:12.3,private_pct:95,listed_companies:28,market_cap_usd_billion:18,risk_score:32,subsectors:['Motor','Medical','Property','Life','Engineering']},
      {id:'aviation',label:'Aviation',gdp_contribution_pct:3.8,employment_pct:2.1,growth_pct:18.4,private_pct:40,listed_companies:4,market_cap_usd_billion:24,risk_score:22,subsectors:['SAUDIA','flyadeal','flynas','Cargo','Airports']},
      {id:'construction',label:'Giga Projects',gdp_contribution_pct:8.2,employment_pct:14,growth_pct:9.1,private_pct:55,listed_companies:22,market_cap_usd_billion:31,risk_score:38,subsectors:['NEOM','Qiddiya','ROSHN','Infrastructure']},
      {id:'fintech',label:'Fintech',gdp_contribution_pct:1.4,employment_pct:0.8,growth_pct:34.2,private_pct:98,listed_companies:6,market_cap_usd_billion:9,risk_score:25,subsectors:['Payments','BNPL','Crypto','Neobanks','Insurtech']},
      {id:'ecommerce',label:'E-Commerce',gdp_contribution_pct:1.8,employment_pct:2.3,growth_pct:21.7,private_pct:99,listed_companies:9,market_cap_usd_billion:14,risk_score:20,subsectors:['Noon','Salla','Zid','Retail Tech','Logistics']},
    ],
    airports:[
      {iata:'RUH',icao:'OERK',name:'King Khalid International',city:'Riyadh',lat:24.9576,lng:46.6988,type:'mega',pax_annual_million:38.8,cargo_tonnes_annual:280000,runways:4,capacity_pax_million:80,airlines_count:58,destinations:140,operator:'GACA',hub_for:['SAUDIA','flynas']},
      {iata:'JED',icao:'OEJN',name:'King Abdulaziz International',city:'Jeddah',lat:21.6796,lng:39.1565,type:'mega',pax_annual_million:44.1,cargo_tonnes_annual:340000,runways:4,capacity_pax_million:80,airlines_count:62,destinations:152,operator:'GACA',hub_for:['SAUDIA','flyadeal']},
      {iata:'DMM',icao:'OEDF',name:'King Fahd International',city:'Dammam',lat:26.4712,lng:49.7979,type:'international',pax_annual_million:12.4,cargo_tonnes_annual:148000,runways:2,capacity_pax_million:24,airlines_count:34,destinations:68,operator:'GACA',hub_for:[]},
    ]},
  {code:'UAE',name:'United Arab Emirates',capital:'Abu Dhabi',lat:24.4539,lng:54.3773,gdp_usd_billion:527,gdp_growth_pct:4.0,gdp_per_capita:48000,population_million:10.0,oil_revenue_pct:30,vision_plan:'We the UAE 2031',currency:'AED',exchange_rate_usd:3.67,sovereign_fund_usd_billion:1500,credit_rating:'AA-',color:'#f59e0b',
    sectors:[
      {id:'oil_gas',label:'Oil & Gas',gdp_contribution_pct:28,employment_pct:2,growth_pct:0.8,private_pct:20,listed_companies:6,market_cap_usd_billion:620,risk_score:30,subsectors:['ADNOC','ENOC','Offshore','Refining']},
      {id:'banking',label:'Banking',gdp_contribution_pct:12,employment_pct:5,growth_pct:8.2,private_pct:65,listed_companies:22,market_cap_usd_billion:218,risk_score:22,subsectors:['FAB','ENBD','ADCB','DIB','Mashreq']},
      {id:'insurance',label:'Insurance',gdp_contribution_pct:3.2,employment_pct:1.8,growth_pct:9.4,private_pct:92,listed_companies:35,market_cap_usd_billion:22,risk_score:25,subsectors:['AXA Gulf','RSA','Daman','Emirates Insurance']},
      {id:'aviation',label:'Aviation Hub',gdp_contribution_pct:14.1,employment_pct:8.2,growth_pct:22.1,private_pct:55,listed_companies:3,market_cap_usd_billion:78,risk_score:18,subsectors:['Emirates','Etihad','flydubai','Air Arabia','dnata']},
      {id:'fintech',label:'Fintech',gdp_contribution_pct:2.8,employment_pct:1.4,growth_pct:42.1,private_pct:99,listed_companies:14,market_cap_usd_billion:18,risk_score:20,subsectors:['Careem Pay','YAP','Keyper','DIFC Fintechs']},
      {id:'real_estate',label:'Real Estate',gdp_contribution_pct:8.4,employment_pct:6,growth_pct:15.2,private_pct:60,listed_companies:18,market_cap_usd_billion:84,risk_score:32,subsectors:['Emaar','Aldar','DAMAC','Nakheel']},
    ],
    airports:[
      {iata:'DXB',icao:'OMDB',name:'Dubai International',city:'Dubai',lat:25.2532,lng:55.3657,type:'mega',pax_annual_million:86.9,cargo_tonnes_annual:2800000,runways:2,capacity_pax_million:100,airlines_count:100,destinations:240,operator:'DCAA',hub_for:['Emirates','flydubai']},
      {iata:'AUH',icao:'OMAA',name:'Abu Dhabi International',city:'Abu Dhabi',lat:24.4330,lng:54.6511,type:'mega',pax_annual_million:28.4,cargo_tonnes_annual:580000,runways:2,capacity_pax_million:45,airlines_count:72,destinations:156,operator:'ADAC',hub_for:['Etihad']},
      {iata:'SHJ',icao:'OMSJ',name:'Sharjah International',city:'Sharjah',lat:25.3286,lng:55.5172,type:'international',pax_annual_million:14.8,cargo_tonnes_annual:450000,runways:1,capacity_pax_million:20,airlines_count:28,destinations:81,operator:'Sharjah Aviation',hub_for:['Air Arabia']},
      {iata:'DWC',icao:'OMDW',name:'Al Maktoum International',city:'Dubai South',lat:24.8964,lng:55.1614,type:'mega',pax_annual_million:1.2,cargo_tonnes_annual:680000,runways:2,capacity_pax_million:260,airlines_count:12,destinations:28,operator:'DCAA',hub_for:[]},
    ]},
  {code:'KW',name:'Kuwait',capital:'Kuwait City',lat:29.3759,lng:47.9774,gdp_usd_billion:164,gdp_growth_pct:2.8,gdp_per_capita:34000,population_million:4.9,oil_revenue_pct:89,vision_plan:'Kuwait Vision 2035',currency:'KWD',exchange_rate_usd:0.308,sovereign_fund_usd_billion:750,credit_rating:'AA-',color:'#3b82f6',
    sectors:[
      {id:'oil_gas',label:'Oil & Gas',gdp_contribution_pct:55,employment_pct:3,growth_pct:1.1,private_pct:10,listed_companies:4,market_cap_usd_billion:240,risk_score:35,subsectors:['KPC','KNPC','KOC','KGOC','PIC']},
      {id:'banking',label:'Banking',gdp_contribution_pct:14,employment_pct:6,growth_pct:5.2,private_pct:80,listed_companies:11,market_cap_usd_billion:62,risk_score:24,subsectors:['NBK','KFH','CBK','Warba','Ahli']},
      {id:'insurance',label:'Insurance',gdp_contribution_pct:1.8,employment_pct:1.1,growth_pct:8.4,private_pct:98,listed_companies:16,market_cap_usd_billion:4.2,risk_score:30,subsectors:['Motor TPL','Medical','Property','Marine','Engineering']},
      {id:'aviation',label:'Aviation',gdp_contribution_pct:2.1,employment_pct:1.8,growth_pct:14.2,private_pct:30,listed_companies:2,market_cap_usd_billion:5.8,risk_score:28,subsectors:['Kuwait Airways','Jazeera Airways','KAC Cargo']},
    ],
    airports:[
      {iata:'KWI',icao:'OKBK',name:'Kuwait International Airport',city:'Kuwait City',lat:29.2267,lng:47.9688,type:'international',pax_annual_million:12.4,cargo_tonnes_annual:180000,runways:2,capacity_pax_million:25,airlines_count:42,destinations:94,operator:'DGCA',hub_for:['Kuwait Airways','Jazeera']},
    ]},
  {code:'QA',name:'Qatar',capital:'Doha',lat:25.2854,lng:51.5310,gdp_usd_billion:223,gdp_growth_pct:2.2,gdp_per_capita:83000,population_million:2.9,oil_revenue_pct:65,vision_plan:'Qatar National Vision 2030',currency:'QAR',exchange_rate_usd:3.64,sovereign_fund_usd_billion:475,credit_rating:'AA-',color:'#a855f7',
    sectors:[
      {id:'oil_gas',label:'Oil & Gas / LNG',gdp_contribution_pct:48,employment_pct:3,growth_pct:2.8,private_pct:20,listed_companies:5,market_cap_usd_billion:890,risk_score:32,subsectors:['QatarEnergy','North Field LNG','Ras Laffan','Petrochemicals']},
      {id:'banking',label:'Banking',gdp_contribution_pct:10,employment_pct:5,growth_pct:6.8,private_pct:72,listed_companies:8,market_cap_usd_billion:44,risk_score:20,subsectors:['QNB','Commercial Bank','Doha Bank','Qatar Islamic']},
      {id:'aviation',label:'Aviation',gdp_contribution_pct:4.2,employment_pct:3.2,growth_pct:19.8,private_pct:45,listed_companies:2,market_cap_usd_billion:18,risk_score:16,subsectors:['Qatar Airways','Hamad International Cargo']},
    ],
    airports:[
      {iata:'DOH',icao:'OTHH',name:'Hamad International Airport',city:'Doha',lat:25.2731,lng:51.6081,type:'mega',pax_annual_million:45.8,cargo_tonnes_annual:1800000,runways:2,capacity_pax_million:65,airlines_count:85,destinations:184,operator:'Hamad International',hub_for:['Qatar Airways']},
    ]},
  {code:'BH',name:'Bahrain',capital:'Manama',lat:26.0667,lng:50.5577,gdp_usd_billion:45,gdp_growth_pct:3.4,gdp_per_capita:27000,population_million:1.8,oil_revenue_pct:72,vision_plan:'Bahrain Economic Vision 2030',currency:'BHD',exchange_rate_usd:0.376,sovereign_fund_usd_billion:11,credit_rating:'B+',color:'#ef4444',
    sectors:[
      {id:'banking',label:'Banking & Finance',gdp_contribution_pct:18,employment_pct:8,growth_pct:6.1,private_pct:85,listed_companies:22,market_cap_usd_billion:28,risk_score:34,subsectors:['BBK','Ahli United','ABC','Ithmaar','BISB']},
      {id:'fintech',label:'Fintech Hub',gdp_contribution_pct:3.1,employment_pct:2.2,growth_pct:38.4,private_pct:99,listed_companies:18,market_cap_usd_billion:4.2,risk_score:22,subsectors:['CBB Sandbox','Rain','Tarabut Gateway','Benefit']},
      {id:'aviation',label:'Aviation',gdp_contribution_pct:3.8,employment_pct:2.8,growth_pct:12.4,private_pct:45,listed_companies:2,market_cap_usd_billion:3.2,risk_score:24,subsectors:['Gulf Air','Bahrain Airport Services']},
    ],
    airports:[
      {iata:'BAH',icao:'OBBI',name:'Bahrain International Airport',city:'Manama',lat:26.2708,lng:50.6336,type:'international',pax_annual_million:12.2,cargo_tonnes_annual:290000,runways:2,capacity_pax_million:20,airlines_count:38,destinations:87,operator:'BAC',hub_for:['Gulf Air']},
    ]},
  {code:'OM',name:'Oman',capital:'Muscat',lat:23.5880,lng:58.3829,gdp_usd_billion:107,gdp_growth_pct:4.1,gdp_per_capita:20000,population_million:4.9,oil_revenue_pct:68,vision_plan:'Oman Vision 2040',currency:'OMR',exchange_rate_usd:0.385,sovereign_fund_usd_billion:28,credit_rating:'BB+',color:'#f97316',
    sectors:[
      {id:'oil_gas',label:'Oil & Gas',gdp_contribution_pct:38,employment_pct:3,growth_pct:2.2,private_pct:22,listed_companies:4,market_cap_usd_billion:68,risk_score:38,subsectors:['PDO','OQ','BP Oman','Sohar Refinery']},
      {id:'logistics',label:'Logistics & Ports',gdp_contribution_pct:6.8,employment_pct:4.2,growth_pct:8.8,private_pct:55,listed_companies:6,market_cap_usd_billion:8.2,risk_score:25,subsectors:['Port Sultan Qaboos','Sohar Port','Salalah Port','Oman Rail']},
      {id:'tourism',label:'Tourism',gdp_contribution_pct:4.2,employment_pct:5.8,growth_pct:18.4,private_pct:80,listed_companies:12,market_cap_usd_billion:4.8,risk_score:20,subsectors:['Integrated Tourism Complexes','Hospitality','Heritage Sites']},
    ],
    airports:[
      {iata:'MCT',icao:'OOMS',name:'Muscat International Airport',city:'Muscat',lat:23.5933,lng:58.2844,type:'international',pax_annual_million:14.8,cargo_tonnes_annual:220000,runways:2,capacity_pax_million:24,airlines_count:44,destinations:94,operator:'OAMC',hub_for:['Oman Air','SalamAir']},
      {iata:'SLL',icao:'OOSA',name:'Salalah International Airport',city:'Salalah',lat:17.0387,lng:54.0913,type:'international',pax_annual_million:1.8,cargo_tonnes_annual:42000,runways:1,capacity_pax_million:4,airlines_count:14,destinations:22,operator:'OAMC',hub_for:[]},
    ]},
];

export const GLOBAL_PARTNERS = [
  {code:'US',name:'United States',lat:37.09,lng:-95.71,gdp:27360,color:'#60a5fa',gcc_trade_usd_billion:98.4,key_sectors:['Defense','Tech','Finance','Agriculture']},
  {code:'CN',name:'China',lat:35.86,lng:104.19,gdp:17886,color:'#f87171',gcc_trade_usd_billion:286.2,key_sectors:['Manufacturing','Infrastructure','Tech','EVs']},
  {code:'IN',name:'India',lat:20.59,lng:78.96,gdp:3730,color:'#fb923c',gcc_trade_usd_billion:162.4,key_sectors:['Remittances','IT Services','Jewelry','Pharma']},
  {code:'JP',name:'Japan',lat:36.20,lng:138.25,gdp:4230,color:'#e879f9',gcc_trade_usd_billion:84.1,key_sectors:['Auto','Electronics','Engineering','Energy']},
  {code:'DE',name:'Germany',lat:51.17,lng:10.45,gdp:4460,color:'#a3e635',gcc_trade_usd_billion:44.8,key_sectors:['Engineering','Auto','Chemicals','Finance']},
  {code:'GB',name:'United Kingdom',lat:55.38,lng:-3.44,gdp:3090,color:'#34d399',gcc_trade_usd_billion:38.2,key_sectors:['Finance','Defense','Real Estate','Education']},
  {code:'RU',name:'Russia',lat:61.52,lng:105.32,gdp:2240,color:'#f9a8d4',gcc_trade_usd_billion:12.4,key_sectors:['Energy','Wheat','Arms','Nuclear']},
  {code:'IL',name:'Israel',lat:31.05,lng:34.85,gdp:527,color:'#93c5fd',gcc_trade_usd_billion:4.8,key_sectors:['Tech','Defense','Agriculture','Pharma']},
  {code:'CA',name:'Canada',lat:56.13,lng:-106.35,gdp:2140,color:'#fde68a',gcc_trade_usd_billion:8.2,key_sectors:['Energy','Agriculture','Finance','Education']},
];

export const MARKET_SYMBOLS = {
  commodities:[
    {symbol:'BRENT',name:'Brent Crude',price:87.42,change:-1.24,unit:'USD/bbl'},
    {symbol:'WTI',name:'WTI Crude',price:83.18,change:-1.08,unit:'USD/bbl'},
    {symbol:'GOLD',name:'Gold',price:2318.40,change:8.20,unit:'USD/oz'},
    {symbol:'SILVER',name:'Silver',price:27.84,change:0.34,unit:'USD/oz'},
    {symbol:'NGAS',name:'Nat Gas',price:2.28,change:-0.04,unit:'USD/MMBtu'},
    {symbol:'LNG',name:'LNG Asia',price:11.84,change:0.28,unit:'USD/MMBtu'},
  ],
  forex:[
    {symbol:'USDSAR',name:'USD/SAR',price:3.7503,change:0.0001},
    {symbol:'USDAED',name:'USD/AED',price:3.6725,change:0.0000},
    {symbol:'USDKWD',name:'USD/KWD',price:0.3081,change:-0.0001},
    {symbol:'USDQAR',name:'USD/QAR',price:3.6413,change:0.0000},
    {symbol:'EURUSD',name:'EUR/USD',price:1.0842,change:-0.0024},
    {symbol:'USDJPY',name:'USD/JPY',price:154.82,change:0.42},
  ],
  crypto:[
    {symbol:'BTC',name:'Bitcoin',price:67420,change:-2.14},
    {symbol:'ETH',name:'Ethereum',price:3184,change:-1.88},
    {symbol:'XRP',name:'Ripple',price:0.524,change:-0.92},
    {symbol:'USDT',name:'Tether',price:1.000,change:0.00},
  ],
  indices:[
    {symbol:'TASI',name:'Tadawul (TASI)',price:11842,change:0.84,country:'SA'},
    {symbol:'ADX',name:'Abu Dhabi (ADX)',price:9248,change:0.42,country:'UAE'},
    {symbol:'DFM',name:'Dubai (DFM)',price:4184,change:0.28,country:'UAE'},
    {symbol:'KSE',name:'Kuwait SE (KSE)',price:7284,change:-0.14,country:'KW'},
    {symbol:'QSE',name:'Qatar SE (QSE)',price:9814,change:0.08,country:'QA'},
    {symbol:'BHB',name:'Bahrain (BHB)',price:1924,change:0.22,country:'BH'},
    {symbol:'MSM',name:'Muscat (MSM)',price:4381,change:0.54,country:'OM'},
  ],
};

export const SAMPLE_GEO_EVENTS: GeoEvent[] = [
  {
    id:'EVT001',title:'Iran Ballistic Missile Launch — Hormuz Proximity',
    type:'missile',severity:'CRITICAL',
    origin_lat:32.4279,origin_lng:53.6880,target_lat:26.5,target_lng:56.2,
    timestamp:Date.now()-3600000,
    description:'IRGC missile test near Hormuz chokepoint — 21% global oil transit at risk.',
    impacts:[
      {asset:'BRENT',direction:'UP',magnitude_pct:8.4,confidence:0.92,timeframe:'24H',rationale:'Hormuz closure risk premium; 20% of global oil supply threatened'},
      {asset:'WTI',direction:'UP',magnitude_pct:7.8,confidence:0.91,timeframe:'24H',rationale:'Correlated Brent move; US strategic reserve draw likely'},
      {asset:'GOLD',direction:'UP',magnitude_pct:3.2,confidence:0.88,timeframe:'24H',rationale:'Safe haven demand spike; flight from risk assets'},
      {asset:'BTC',direction:'DOWN',magnitude_pct:-4.8,confidence:0.72,timeframe:'24H',rationale:'Risk-off sentiment; institutional capital exits crypto'},
      {asset:'EURUSD',direction:'DOWN',magnitude_pct:-1.4,confidence:0.78,timeframe:'1W',rationale:'EUR exposed to European energy dependency; USD safe haven'},
      {asset:'GCC_INSURANCE',direction:'UP',magnitude_pct:12.4,confidence:0.84,timeframe:'1W',rationale:'Marine/energy reinsurance premiums spike; war risk clauses activated'},
      {asset:'DXB_FLIGHTS',direction:'DOWN',magnitude_pct:-18.2,confidence:0.68,timeframe:'24H',rationale:'NOTAM issued; 240+ flights rerouted via Indian Ocean'},
      {asset:'LNG',direction:'UP',magnitude_pct:14.2,confidence:0.86,timeframe:'1W',rationale:'Qatar LNG via Hormuz at risk; Asian spot prices surge'},
    ],
  },
  {
    id:'EVT002',title:'US Federal Reserve — 25bps Hold, Dovish Guidance',
    type:'policy',severity:'HIGH',
    origin_lat:38.8951,origin_lng:-77.0364,
    timestamp:Date.now()-7200000,
    description:'Fed holds at 5.25–5.50%; guidance signals 2 cuts in 2024 H2.',
    impacts:[
      {asset:'GOLD',direction:'UP',magnitude_pct:2.8,confidence:0.85,timeframe:'1W',rationale:'Dollar weakens on dovish pivot expectations'},
      {asset:'BTC',direction:'UP',magnitude_pct:6.2,confidence:0.74,timeframe:'1W',rationale:'Liquidity expectations fuel risk asset rally'},
      {asset:'TASI',direction:'UP',magnitude_pct:1.8,confidence:0.80,timeframe:'1W',rationale:'Lower US rates reduce capital outflow pressure from GCC'},
      {asset:'USDSAR',direction:'DOWN',magnitude_pct:-0.2,confidence:0.60,timeframe:'1M',rationale:'Pegged currency: SAMA mirrors Fed; minimal forex impact'},
    ],
  },
  {
    id:'EVT003',title:'Red Sea Houthi Attack — Container Diversion',
    type:'military',severity:'HIGH',
    origin_lat:14.5,origin_lng:42.8,target_lat:13.2,target_lng:43.4,
    timestamp:Date.now()-14400000,
    description:'Houthi attack forces Cape of Good Hope rerouting — 40% container shipping diverted.',
    impacts:[
      {asset:'SHIPPING',direction:'UP',magnitude_pct:24.2,confidence:0.90,timeframe:'1M',rationale:'Suez Canal transit down 67%; Cape route adds 14 days'},
      {asset:'GCC_INSURANCE',direction:'UP',magnitude_pct:18.4,confidence:0.88,timeframe:'1M',rationale:'Marine war risk premiums up 400%; JC Hull clauses invoked'},
      {asset:'ECOMMERCE',direction:'DOWN',magnitude_pct:-3.4,confidence:0.72,timeframe:'1M',rationale:'GCC e-commerce delivery delays 3–4 weeks'},
    ],
  },
];

export const MAP_LAYERS: MapLayer[] = [
  {id:'gdp',label:'GDP FLOWS',category:'economic',color:'#10b981',active:true,description:'GDP size and growth rate per country'},
  {id:'trade',label:'TRADE CORRIDORS',category:'economic',color:'#f59e0b',active:true,description:'Bilateral trade flows'},
  {id:'investment',label:'FDI FLOWS',category:'economic',color:'#3b82f6',active:false,description:'Foreign direct investment flows'},
  {id:'sovereign',label:'SOVEREIGN FUNDS',category:'economic',color:'#a855f7',active:true,description:'Sovereign wealth fund deployment'},
  {id:'airports',label:'AIRPORTS',category:'infrastructure',color:'#06b6d4',active:true,description:'Airport capacity and traffic'},
  {id:'oil_pipes',label:'OIL PIPELINES',category:'infrastructure',color:'#ef4444',active:true,description:'Oil and gas pipeline networks'},
  {id:'ports',label:'SEAPORTS',category:'infrastructure',color:'#84cc16',active:false,description:'Port capacity and shipping'},
  {id:'chokepoints',label:'CHOKEPOINTS',category:'geopolitical',color:'#f97316',active:true,description:'Strategic maritime chokepoints'},
  {id:'insurance',label:'INSURANCE',category:'sectors',color:'#ec4899',active:true,description:'Insurance sector data'},
  {id:'banking',label:'BANKING',category:'sectors',color:'#8b5cf6',active:true,description:'Banking sector data'},
  {id:'fintech',label:'FINTECH',category:'sectors',color:'#14b8a6',active:false,description:'Fintech ecosystem'},
  {id:'oil_sector',label:'OIL & GAS',category:'sectors',color:'#dc2626',active:true,description:'Hydrocarbon sector'},
  {id:'risk_heatmap',label:'RISK HEATMAP',category:'analytics',color:'#f43f5e',active:false,description:'Composite economic risk score'},
  {id:'d_blur',label:'D-BLUR INTEL',category:'analytics',color:'#64748b',active:false,description:'Classified intelligence layer'},
  {id:'geopolitical',label:'GEO EVENTS',category:'geopolitical',color:'#fb923c',active:true,description:'Geopolitical events'},
];

export const CHOKEPOINTS = [
  {name:'Strait of Hormuz',lat:26.57,lng:56.49,riskLevel:'CRITICAL',oil_pct:21,commodity:'Oil/LNG',transit_mb_day:21},
  {name:'Bab el-Mandeb',lat:12.58,lng:43.41,riskLevel:'HIGH',oil_pct:10,commodity:'Oil/Container',transit_mb_day:9.2},
  {name:'Suez Canal',lat:30.59,lng:32.26,riskLevel:'HIGH',oil_pct:9,commodity:'Multi-commodity',transit_mb_day:8.4},
  {name:'Strait of Malacca',lat:2.50,lng:102.00,riskLevel:'MEDIUM',oil_pct:16,commodity:'Oil/LNG',transit_mb_day:16.2},
];
