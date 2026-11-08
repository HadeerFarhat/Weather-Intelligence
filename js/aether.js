/**
 * AETHER — Real coordinates for all 27 governorates + interactive map
 */
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WX_URL  = 'https://api.open-meteo.com/v1/forecast';

/* 27 Egyptian Governorates — unique real coordinates */
const EGYPT = [
  { id:'cairo',          ar:'القاهرة',       en:'Cairo',           lat:30.0444, lon:31.2357 },
  { id:'giza',           ar:'الجيزة',        en:'Giza',            lat:30.0131, lon:31.2089 },
  { id:'alexandria',     ar:'الإسكندرية',    en:'Alexandria',      lat:31.2001, lon:29.9187 },
  { id:'qalyubia',       ar:'القليوبية',     en:'Qalyubia',        lat:30.1792, lon:31.2064 },
  { id:'sharqia',        ar:'الشرقية',       en:'Sharqia',         lat:30.5877, lon:31.5020 },
  { id:'dakahlia',       ar:'الدقهلية',      en:'Dakahlia',        lat:31.0409, lon:31.3785 },
  { id:'gharbia',        ar:'الغربية',       en:'Gharbia',         lat:30.8754, lon:31.0340 },
  { id:'monufia',        ar:'المنوفية',      en:'Monufia',         lat:30.5972, lon:30.9876 },
  { id:'beheira',        ar:'البحيرة',       en:'Beheira',         lat:30.8481, lon:30.3436 },
  { id:'kafr_el_sheikh', ar:'كفر الشيخ',     en:'Kafr El Sheikh',  lat:31.1107, lon:30.9388 },
  { id:'damietta',       ar:'دمياط',         en:'Damietta',        lat:31.4165, lon:31.8133 },
  { id:'port_said',      ar:'بورسعيد',       en:'Port Said',       lat:31.2653, lon:32.3019 },
  { id:'ismailia',       ar:'الإسماعيلية',   en:'Ismailia',        lat:30.5965, lon:32.2715 },
  { id:'suez',           ar:'السويس',        en:'Suez',            lat:29.9668, lon:32.5498 },
  { id:'north_sinai',    ar:'شمال سيناء',    en:'North Sinai',     lat:31.1313, lon:33.7984 },
  { id:'south_sinai',    ar:'جنوب سيناء',    en:'South Sinai',     lat:28.2410, lon:33.6230 },
  { id:'beni_suef',      ar:'بني سويف',      en:'Beni Suef',       lat:29.0661, lon:31.0994 },
  { id:'fayoum',         ar:'الفيوم',        en:'Fayoum',          lat:29.3084, lon:30.8428 },
  { id:'minya',          ar:'المنيا',        en:'Minya',           lat:28.1099, lon:30.7503 },
  { id:'assiut',         ar:'أسيوط',         en:'Assiut',          lat:27.1809, lon:31.1837 },
  { id:'sohag',          ar:'سوهاج',         en:'Sohag',           lat:26.5591, lon:31.6956 },
  { id:'qena',           ar:'قنا',           en:'Qena',            lat:26.1551, lon:32.7160 },
  { id:'luxor',          ar:'الأقصر',        en:'Luxor',           lat:25.6872, lon:32.6396 },
  { id:'aswan',          ar:'أسوان',         en:'Aswan',           lat:24.0889, lon:32.8998 },
  { id:'red_sea',        ar:'البحر الأحمر',  en:'Red Sea',         lat:27.2579, lon:33.8116 },
  { id:'new_valley',     ar:'الوادي الجديد', en:'New Valley',      lat:25.4400, lon:30.5500 },
  { id:'matrouh',        ar:'مطروح',         en:'Matrouh',         lat:31.3543, lon:27.2373 }
];

/* Project lat/lon → SVG coords (viewBox 0 0 400 480)
   Egypt roughly: lat 22–32 N, lon 25–36 E */
function toXY(lat, lon) {
  const x = ((lon - 24.5) / (36.5 - 24.5)) * 360 + 20;
  const y = ((32.5 - lat) / (32.5 - 21.5)) * 420 + 30;
  return { x: Math.max(20, Math.min(380, x)), y: Math.max(25, Math.min(450, y)) };
}

const DEFAULTS = { tempUnit:'celsius', windUnit:'kmh', timeFormat:'24', theme:'dark', lang:'ar' };

const WMO = {
  0:{e:'☀️',ar:'صافي',en:'Clear',c:'clear'},1:{e:'🌤️',ar:'صافي غالباً',en:'Mainly clear',c:'clear'},
  2:{e:'⛅',ar:'غائم جزئياً',en:'Partly cloudy',c:'cloud'},3:{e:'☁️',ar:'غائم',en:'Overcast',c:'cloud'},
  45:{e:'🌫️',ar:'ضباب',en:'Fog',c:'fog'},48:{e:'🌫️',ar:'ضباب متجمد',en:'Rime fog',c:'fog'},
  51:{e:'🌧️',ar:'رذاذ خفيف',en:'Light drizzle',c:'rain'},53:{e:'🌧️',ar:'رذاذ',en:'Drizzle',c:'rain'},
  55:{e:'🌧️',ar:'رذاذ كثيف',en:'Dense drizzle',c:'rain'},61:{e:'🌧️',ar:'مطر خفيف',en:'Light rain',c:'rain'},
  63:{e:'🌧️',ar:'مطر',en:'Rain',c:'rain'},65:{e:'🌧️',ar:'مطر غزير',en:'Heavy rain',c:'rain'},
  71:{e:'🌨️',ar:'ثلج خفيف',en:'Light snow',c:'snow'},73:{e:'🌨️',ar:'ثلج',en:'Snow',c:'snow'},
  75:{e:'❄️',ar:'ثلج كثيف',en:'Heavy snow',c:'snow'},80:{e:'🌦️',ar:'زخات خفيفة',en:'Light showers',c:'rain'},
  81:{e:'🌦️',ar:'زخات مطر',en:'Showers',c:'rain'},82:{e:'🌦️',ar:'زخات غزيرة',en:'Heavy showers',c:'rain'},
  95:{e:'⛈️',ar:'عاصفة رعدية',en:'Thunderstorm',c:'storm'},96:{e:'⛈️',ar:'عاصفة مع برد',en:'Storm + hail',c:'storm'},
  99:{e:'⛈️',ar:'عاصفة برد كثيف',en:'Heavy hail',c:'storm'}
};

const i18n = {
  ar:{
    search:'ابحث عن محافظة أو مدينة...', loading:'جاري جلب طقس', error:'حدث خطأ',
    retry:'إعادة المحاولة', feels:'الإحساس', humidity:'الرطوبة', wind:'الرياح',
    pressure:'الضغط', clouds:'الغيوم', uv:'UV', visibility:'الرؤية', precip:'هطول',
    today:'اليوم', tomorrow:'غداً', now:'الآن', noResults:'لا نتائج',
    offline:'أنت غير متصل', rateLimit:'تم تجاوز الحد اليومي للـ API. حاول لاحقاً.',
    locDenied:'تم رفض إذن الموقع', locError:'تعذر تحديد الموقع',
    high:'العظمى', low:'الصغرى', settings:'الإعدادات',
    secAppearance:'المظهر', secUnits:'الوحدات', secData:'البيانات',
    lblTheme:'السمة', lblLang:'اللغة', lblTemp:'درجة الحرارة', lblWind:'الرياح', lblTime:'الوقت',
    clearRecent:'مسح سجل البحث', clearFavs:'مسح المفضلة',
    exportSet:'تصدير الإعدادات', importSet:'استيراد الإعدادات', resetAll:'إعادة تعيين الكل',
    dark:'داكن', light:'فاتح', system:'نظام',
    tabDash:'لوحة الطقس', tabMap:'خريطة مصر'
  },
  en:{
    search:'Search governorate or city...', loading:'Loading weather for', error:'Something went wrong',
    retry:'Retry', feels:'Feels like', humidity:'Humidity', wind:'Wind',
    pressure:'Pressure', clouds:'Clouds', uv:'UV', visibility:'Visibility', precip:'Precip',
    today:'Today', tomorrow:'Tomorrow', now:'Now', noResults:'No results',
    offline:'You are offline', rateLimit:'Daily API limit reached. Try again later.',
    locDenied:'Location permission denied', locError:'Could not get location',
    high:'High', low:'Low', settings:'Settings',
    secAppearance:'Appearance', secUnits:'Units', secData:'Data',
    lblTheme:'Theme', lblLang:'Language', lblTemp:'Temperature', lblWind:'Wind', lblTime:'Time',
    clearRecent:'Clear search history', clearFavs:'Clear favorites',
    exportSet:'Export settings', importSet:'Import settings', resetAll:'Reset all',
    dark:'Dark', light:'Light', system:'System',
    tabDash:'Dashboard', tabMap:'Egypt Map'
  }
};

let S = { settings:{...DEFAULTS}, loc:null, data:null, favs:[], recent:[], chart:null, timer:null };

const $ = id => document.getElementById(id);
const t = key => i18n[S.settings.lang][key] || i18n.en[key] || key;
const show = (el, on) => el.classList.toggle('hidden', !on);

function loadStore() {
  try { const s=localStorage.getItem('wly_set'); if(s) S.settings={...DEFAULTS,...JSON.parse(s)}; } catch{}
  try { S.favs=JSON.parse(localStorage.getItem('wly_fav')||'[]'); } catch{S.favs=[];}
  try { S.recent=JSON.parse(localStorage.getItem('wly_rec')||'[]'); } catch{S.recent=[];}
}
function saveSettings(){ localStorage.setItem('wly_set', JSON.stringify(S.settings)); }
function saveFavs(){ localStorage.setItem('wly_fav', JSON.stringify(S.favs)); }
function saveRecent(){ localStorage.setItem('wly_rec', JSON.stringify(S.recent.slice(0,8))); }

function applyTheme() {
  let th=S.settings.theme;
  if(th==='system') th=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.setAttribute('data-theme', th);
  $('themeBtn').textContent = th==='dark'?'☀':'☾';
}
function applyLang() {
  document.documentElement.lang=S.settings.lang;
  document.documentElement.dir=S.settings.lang==='ar'?'rtl':'ltr';
  $('searchInput').placeholder=t('search');
  $('settingsTitle').textContent=t('settings');
  document.querySelectorAll('.nav-tab').forEach(tb=>{
    if(tb.dataset.view==='dash') tb.textContent=t('tabDash');
    if(tb.dataset.view==='egypt') tb.textContent=t('tabMap');
  });
  // settings labels
  ['secAppearance','secUnits','secData','lblTheme','lblLang','lblTemp','lblWind','lblTime'].forEach(k=>{
    const el=$(k); if(el) el.textContent=t(k);
  });
  $('clearRecentBtn').textContent=t('clearRecent');
  $('clearFavsBtn').textContent=t('clearFavs');
  $('exportBtn').textContent=t('exportSet');
  $('importBtn').textContent=t('importSet');
  $('resetBtn').textContent=t('resetAll');
  $('themeSeg').querySelectorAll('[data-v]').forEach(b=>{
    if(b.dataset.v==='dark') b.textContent=t('dark');
    if(b.dataset.v==='light') b.textContent=t('light');
    if(b.dataset.v==='system') b.textContent=t('system');
  });
}

function fmtTemp(c){ if(c==null)return'—'; return S.settings.tempUnit==='fahrenheit'?Math.round(c*9/5+32)+'°':Math.round(c)+'°'; }
function fmtWind(kmh){
  if(kmh==null)return'—';
  if(S.settings.windUnit==='mph')return(kmh*0.621).toFixed(1)+' mph';
  if(S.settings.windUnit==='ms')return(kmh/3.6).toFixed(1)+' m/s';
  return kmh.toFixed(1)+' كم/س';
}
function fmtTime(d){
  return new Date(d).toLocaleTimeString(S.settings.lang==='ar'?'ar-EG':'en-US',{
    hour:'2-digit',minute:'2-digit',hour12:S.settings.timeFormat==='12'
  });
}
function wmo(code){ return WMO[code]||{e:'🌡️',ar:'—',en:'—',c:'cloud'}; }
function desc(code){ const w=wmo(code); return S.settings.lang==='ar'?w.ar:w.en; }

/* ===== API ===== */
async function searchCities(q) {
  const ql=q.toLowerCase().trim();
  const local=EGYPT.filter(g=>g.ar.includes(q)||g.en.toLowerCase().includes(ql)||g.id.includes(ql))
    .map(g=>({
      name:S.settings.lang==='ar'?g.ar:g.en,
      country:S.settings.lang==='ar'?'مصر':'Egypt',
      admin1:'', latitude:g.lat, longitude:g.lon, timezone:'Africa/Cairo', isEgypt:true
    }));
  let remote=[];
  try {
    const res=await fetch(`${GEO_URL}?name=${encodeURIComponent(q)}&count=5&language=${S.settings.lang}`);
    if(res.ok){
      const data=await res.json();
      remote=(data.results||[]).map(r=>({
        name:r.name, country:r.country||'', admin1:r.admin1||'',
        latitude:r.latitude, longitude:r.longitude, timezone:r.timezone||'auto'
      }));
    }
  } catch{}
  const seen=new Set(), merged=[];
  [...local,...remote].forEach(r=>{
    const k=r.latitude.toFixed(2)+','+r.longitude.toFixed(2);
    if(!seen.has(k)){ seen.add(k); merged.push(r); }
  });
  return merged.slice(0,10);
}

function cacheKey(lat, lon) {
  return 'aether_wx_' + Number(lat).toFixed(2) + '_' + Number(lon).toFixed(2);
}
function saveWxCache(lat, lon, data) {
  try {
    localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ t: Date.now(), data }));
  } catch {}
}
function loadWxCache(lat, lon, maxAgeMs) {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (maxAgeMs && Date.now() - parsed.t > maxAgeMs) return null;
    return parsed;
  } catch { return null; }
}

async function fetchWeather(lat, lon, tz='auto') {
  const p=new URLSearchParams({
    latitude:lat, longitude:lon, timezone:tz,
    temperature_unit:'celsius', wind_speed_unit:'kmh',
    current:'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation',
    hourly:'temperature_2m,precipitation_probability,weather_code,uv_index,visibility',
    daily:'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    forecast_days:7
  });
  const url=`${WX_URL}?${p}`;
  console.log('[AETHER] API request:', { lat, lon, url: url.slice(0,120)+'...' });
  const res=await fetch(url);
  if(!res.ok){
    if(res.status===429) throw new Error('RATE_LIMIT');
    throw new Error(t('error'));
  }
  const data=await res.json();
  console.log('[AETHER] API response for', lat, lon, '→ temp=', data.current?.temperature_2m);
  saveWxCache(lat, lon, data);
  return data;
}

/* ===== Map ===== */
function renderMapMarkers(filter='') {
  const g=document.getElementById('markers');
  if(!g) return;
  const ql=filter.toLowerCase().trim();
  const list=ql?EGYPT.filter(x=>x.ar.includes(filter)||x.en.toLowerCase().includes(ql)):EGYPT;
  g.innerHTML=list.map(gov=>{
    const {x,y}=toXY(gov.lat, gov.lon);
    const active=S.loc&&Math.abs(S.loc.lat-gov.lat)<0.05;
    const label=S.settings.lang==='ar'?gov.ar:gov.en;
    return `<g class="map-marker${active?' active':''}" data-id="${gov.id}" transform="translate(${x},${y})">
      <circle r="${active?7:5}" />
      <text y="-10">${label}</text>
    </g>`;
  }).join('');

  // list under map
  const listEl=$('govGrid');
  listEl.innerHTML=list.map(gov=>{
    const active=S.loc&&Math.abs(S.loc.lat-gov.lat)<0.05;
    return `<button class="gov-item${active?' active':''}" data-id="${gov.id}">
      <div class="ga">${gov.ar}</div><div class="ge">${gov.en} · ${gov.lat.toFixed(2)}, ${gov.lon.toFixed(2)}</div>
    </button>`;
  }).join('');
}

function setupMap() {
  renderMapMarkers();
  $('egyptFilter').addEventListener('input', e=>renderMapMarkers(e.target.value));

  document.getElementById('markers').addEventListener('click', e=>{
    const m=e.target.closest('.map-marker[data-id]');
    if(!m) return;
    pickGov(m.dataset.id);
  });
  $('govGrid').addEventListener('click', e=>{
    const item=e.target.closest('.gov-item[data-id]');
    if(!item) return;
    pickGov(item.dataset.id);
  });
}

function pickGov(id) {
  const g=EGYPT.find(x=>x.id===id);
  if(!g) return;
  // Switch to dashboard and load
  document.querySelectorAll('.nav-tab').forEach(tb=>tb.classList.toggle('active', tb.dataset.view==='dash'));
  show($('view-dash'), true);
  show($('view-egypt'), false);
  selectLoc({
    name: S.settings.lang==='ar'?g.ar:g.en,
    country: S.settings.lang==='ar'?'مصر':'Egypt',
    admin1:'', latitude:g.lat, longitude:g.lon, timezone:'Africa/Cairo'
  });
}

/* ===== Tabs ===== */
function setupTabs() {
  document.querySelectorAll('.nav-tab').forEach(tb=>{
    tb.addEventListener('click', ()=>{
      document.querySelectorAll('.nav-tab').forEach(x=>x.classList.remove('active'));
      tb.classList.add('active');
      const isMap=tb.dataset.view==='egypt';
      show($('view-dash'), !isMap);
      show($('view-egypt'), isMap);
      if(isMap) renderMapMarkers($('egyptFilter').value);
    });
  });
}

/* ===== UI ===== */
function setLoading(on) {
  show($('loader'), on);
  if(on){
    show($('main'), false); show($('error'), false);
    $('loadText').textContent = S.loc ? S.loc.name : '...';
    $('loadCoords').textContent = S.loc ? `${S.loc.lat.toFixed(4)}, ${S.loc.lon.toFixed(4)}` : '';
  }
}
function setError(msg) {
  $('errorText').textContent=msg;
  $('errorLoc').textContent = S.loc ? `${S.loc.name} (${S.loc.lat.toFixed(4)}, ${S.loc.lon.toFixed(4)})` : '';
  show($('error'), true); show($('main'), false); show($('loader'), false);
}

function renderChips() {
  const box=$('chips'); box.innerHTML='';
  S.favs.forEach(f=>{
    const b=document.createElement('button'); b.className='chip fav'; b.textContent='★ '+f.name;
    b.onclick=()=>selectLoc(f); box.appendChild(b);
  });
  S.recent.filter(r=>!S.favs.some(f=>Math.abs(f.lat-r.lat)<0.01)).slice(0,4).forEach(r=>{
    const b=document.createElement('button'); b.className='chip'; b.textContent=r.name;
    b.onclick=()=>selectLoc(r); box.appendChild(b);
  });
}

function renderCurrent() {
  const d=S.data, c=d.current, daily=d.daily, w=wmo(c.weather_code);
  $('cityName').textContent = S.loc.name + (S.loc.country ? ', '+S.loc.country : '');
  $('locMeta').textContent = `${S.loc.lat.toFixed(4)}°N, ${S.loc.lon.toFixed(4)}°E`;
  $('emoji').textContent=w.e;
  $('temp').textContent=fmtTemp(c.temperature_2m);
  $('feels').textContent=`${t('feels')}: ${fmtTemp(c.apparent_temperature)}`;
  $('desc').textContent=desc(c.weather_code);
  $('hero').setAttribute('data-c', w.c||'cloud');
  // Adaptive atmosphere engine
  const hour = new Date().getHours();
  let atm = w.c || 'clear';
  if (hour < 5 || hour >= 20) atm = 'night';
  document.body.setAttribute('data-atmosphere', atm);

  const isFav=S.favs.some(f=>Math.abs(f.lat-S.loc.lat)<0.01&&Math.abs(f.lon-S.loc.lon)<0.01);
  $('favBtn').textContent=isFav?'★':'☆';
  $('favBtn').classList.toggle('on', isFav);

  $('summary').textContent=
    `${t('high')} ${fmtTemp(daily.temperature_2m_max[0])} · ${t('low')} ${fmtTemp(daily.temperature_2m_min[0])}`+
    (daily.precipitation_probability_max[0]>15?` · ${daily.precipitation_probability_max[0]}%`:'');

  const now=new Date();
  const hourIdx=Math.max(0, d.hourly.time.findIndex(t=>new Date(t)>now)-1);
  const uv=d.hourly.uv_index?.[hourIdx]??daily.uv_index_max[0];
  const vis=d.hourly.visibility?.[hourIdx];
  const metrics=[
    {icon:'💧',label:t('humidity'),val:c.relative_humidity_2m+'%'},
    {icon:'💨',label:t('wind'),val:fmtWind(c.wind_speed_10m)},
    {icon:'🌡️',label:t('pressure'),val:Math.round(c.pressure_msl)+' hPa'},
    {icon:'☁️',label:t('clouds'),val:c.cloud_cover+'%'},
  ];
  if(uv!=null) metrics.push({icon:'☀️',label:t('uv'),val:Number(uv).toFixed(1)});
  if(vis!=null) metrics.push({icon:'👁️',label:t('visibility'),val:(vis/1000).toFixed(1)+' km'});
  $('metrics').innerHTML=metrics.map(m=>
    `<div class="stat"><div class="stat-ico">${m.icon}</div>
    <div><span class="stat-lbl">${m.label}</span><div class="stat-val">${m.val}</div></div></div>`
  ).join('');
}

function renderHourly() {
  const d=S.data, now=Date.now();
  let start=d.hourly.time.findIndex(t=>new Date(t).getTime()>=now-36e5);
  if(start<0) start=0;
  $('hourly').innerHTML=d.hourly.time.slice(start,start+24).map((time,i)=>{
    const idx=start+i; const w=wmo(d.hourly.weather_code[idx]);
    const rain=d.hourly.precipitation_probability[idx];
    return `<div class="hour">
      <div class="hour-t">${i===0?t('now'):fmtTime(time)}</div>
      <span class="hour-e">${w.e}</span>
      <div class="hour-temp">${fmtTemp(d.hourly.temperature_2m[idx])}</div>
      ${rain>10?`<div class="hour-r">${rain}%</div>`:''}</div>`;
  }).join('');
}

function renderChart() {
  if(typeof Chart==='undefined'||!S.data) return;
  const d=S.data, now=Date.now();
  let start=d.hourly.time.findIndex(t=>new Date(t).getTime()>=now-36e5);
  if(start<0) start=0;
  const labels=d.hourly.time.slice(start,start+24).map(t=>fmtTime(t));
  const temps=d.hourly.temperature_2m.slice(start,start+24).map(v=>S.settings.tempUnit==='fahrenheit'?v*9/5+32:v);
  if(S.chart) S.chart.destroy();
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  S.chart=new Chart($('chart'),{
    type:'line',
    data:{labels,datasets:[{data:temps,borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.1)',fill:true,tension:0.35,pointRadius:0,pointHoverRadius:4,borderWidth:2}]},
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        x:{grid:{display:false},ticks:{color:isDark?'#7d8da6':'#64748b',maxTicksLimit:7,font:{size:10}}},
        y:{grid:{color:isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)'},ticks:{color:isDark?'#7d8da6':'#64748b',font:{size:10},callback:v=>Math.round(v)+'°'}}
      },
      interaction:{mode:'nearest',axis:'x',intersect:false}
    }
  });
}

function renderDays() {
  const d=S.data.daily;
  const gMax=Math.max(...d.temperature_2m_max), gMin=Math.min(...d.temperature_2m_min);
  const range=gMax-gMin||1;
  $('days').innerHTML=d.time.map((date,i)=>{
    const day=new Date(date+'T12:00:00');
    let name=i===0?t('today'):i===1?t('tomorrow'):
      day.toLocaleDateString(S.settings.lang==='ar'?'ar-EG':'en-US',{weekday:'short'});
    const w=wmo(d.weather_code[i]);
    const max=d.temperature_2m_max[i], min=d.temperature_2m_min[i];
    const left=((min-gMin)/range)*100, width=Math.max(((max-min)/range)*100,8);
    return `<div class="day">
      <div class="day-n">${name}</div><div class="day-e">${w.e}</div>
      <div class="day-bar"><div class="day-bar-f" style="margin-inline-start:${left}%;width:${width}%"></div></div>
      <div class="day-t">${fmtTemp(max)} <span>${fmtTemp(min)}</span></div></div>`;
  }).join('');
}

function renderDetails() {
  const c=S.data.current, d=S.data.daily;
  const items=[
    {label:t('precip'),val:(c.precipitation??0)+' mm'},
    {label:S.settings.lang==='ar'?'هبات':'Gusts',val:fmtWind(c.wind_gusts_10m)},
    {label:t('uv')+' max',val:(d.uv_index_max[0]??'—').toString()},
    {label:S.settings.lang==='ar'?'هطول اليوم':'Precip today',val:(d.precipitation_sum[0]??0)+' mm'},
    {label:S.settings.lang==='ar'?'أقصى رياح':'Max wind',val:fmtWind(d.wind_speed_10m_max[0])},
    {label:S.settings.lang==='ar'?'احتمال المطر':'Rain chance',val:(d.precipitation_probability_max[0]??0)+'%'}
  ];
  $('details').innerHTML=items.map(it=>
    `<div class="det"><div class="lbl">${it.label}</div><div class="val">${it.val}</div></div>`
  ).join('');
}

function renderSun() {
  const rise=new Date(S.data.daily.sunrise[0]);
  const set=new Date(S.data.daily.sunset[0]);
  $('sunrise').textContent=fmtTime(rise);
  $('sunset').textContent=fmtTime(set);
  const now=Date.now();
  let pct=0;
  if(now>rise.getTime()&&now<set.getTime()) pct=((now-rise.getTime())/(set.getTime()-rise.getTime()))*100;
  else if(now>=set.getTime()) pct=100;
  $('sunFill').style.width=pct+'%';
  $('sunDot').style.left=pct+'%';
}

function renderInsights() {
  const c=S.data.current, d=S.data.daily, w=wmo(c.weather_code);
  const tips=[];
  if(w.c==='rain'||w.c==='storm') tips.push({i:'☔',t:S.settings.lang==='ar'?'احمل مظلة — هناك احتمال للهطول.':'Carry an umbrella — rain is likely.'});
  if(c.temperature_2m>35) tips.push({i:'🥵',t:S.settings.lang==='ar'?'حرارة مرتفعة — اشرب ماء وتجنب الشمس.':'High heat — stay hydrated and avoid sun.'});
  if(c.temperature_2m<10) tips.push({i:'🧥',t:S.settings.lang==='ar'?'الجو بارد — ارتدِ ملابس دافئة.':'Cold — dress warmly.'});
  if((d.uv_index_max[0]||0)>6) tips.push({i:'🧴',t:S.settings.lang==='ar'?'UV مرتفع — استخدم واقي شمس.':'High UV — use sunscreen.'});
  if(c.wind_speed_10m>40) tips.push({i:'💨',t:S.settings.lang==='ar'?'رياح قوية — كن حذراً.':'Strong winds — be careful.'});
  if(w.c==='clear'&&c.temperature_2m>18&&c.temperature_2m<30) tips.push({i:'😎',t:S.settings.lang==='ar'?'طقس ممتاز للخروج!':'Great weather to go outside!'});
  if(!tips.length) tips.push({i:'👍',t:S.settings.lang==='ar'?'الطقس مستقر نسبياً.':'Relatively stable weather.'});
  $('insights').innerHTML=tips.map(x=>
    `<div class="insight"><span class="insight-ico">${x.i}</span><span class="insight-txt">${x.t}</span></div>`
  ).join('');
}

function renderAll() {
  if(!S.data) return;
  renderCurrent(); renderHourly(); renderChart(); renderDays();
  renderDetails(); renderSun(); renderInsights();
  show($('main'), true);
  renderMapMarkers($('egyptFilter')?.value||'');
}

/* ===== Actions ===== */
async function selectLoc(loc) {
  S.loc={
    name:loc.name, country:loc.country||loc.country_code||'',
    admin1:loc.admin1||'',
    lat:loc.latitude??loc.lat, lon:loc.longitude??loc.lon,
    tz:loc.timezone||'auto'
  };
  // Clear previous weather so UI doesn't show stale data
  S.data=null;
  show($('main'), false);

  S.recent=S.recent.filter(r=>!(Math.abs(r.lat-S.loc.lat)<0.01));
  S.recent.unshift({...S.loc});
  saveRecent(); renderChips();

  // Update location bar immediately
  $('cityName').textContent=S.loc.name+(S.loc.country?', '+S.loc.country:'');
  $('locMeta').textContent=`${S.loc.lat.toFixed(4)}°N, ${S.loc.lon.toFixed(4)}°E`;

  await loadWeather();
}

async function loadWeather() {
  if(!S.loc) return;
  if(!navigator.onLine){
    const cached = loadWxCache(S.loc.lat, S.loc.lon, 0);
    if (cached && cached.data) {
      S.data = cached.data;
      localStorage.setItem('wly_last', JSON.stringify(S.loc));
      renderAll();
      const banner = document.getElementById('cacheBanner');
      if (banner) { banner.textContent = S.settings.lang==='ar' ? 'عرض بيانات محفوظة (غير متصل)' : 'Showing cached data (offline)'; banner.classList.remove('hidden'); }
      return;
    }
    setError(t('offline'));
    return;
  }
  setLoading(true);
  try {
    S.data=await fetchWeather(S.loc.lat, S.loc.lon, S.loc.tz);
    localStorage.setItem('wly_last', JSON.stringify(S.loc));
    const banner = document.getElementById('cacheBanner');
    if (banner) banner.classList.add('hidden');
    renderAll();
  } catch(err) {
    // Prefer cached weather for this exact location over a blank error screen
    const cached = loadWxCache(S.loc.lat, S.loc.lon, 0);
    if (cached && cached.data) {
      S.data = cached.data;
      localStorage.setItem('wly_last', JSON.stringify(S.loc));
      renderAll();
      const banner = document.getElementById('cacheBanner');
      if (banner) {
        banner.textContent = err.message === 'RATE_LIMIT'
          ? (S.settings.lang==='ar' ? 'حد الـ API — عرض آخر بيانات محفوظة لهذا الموقع' : 'API limit — showing last cached data for this location')
          : (S.settings.lang==='ar' ? 'عرض بيانات محفوظة' : 'Showing cached data');
        banner.classList.remove('hidden');
      }
    } else {
      setError(err.message === 'RATE_LIMIT' ? t('rateLimit') : (err.message||t('error')));
    }
  } finally {
    setLoading(false);
  }
}

function toggleFav() {
  if(!S.loc) return;
  const i=S.favs.findIndex(f=>Math.abs(f.lat-S.loc.lat)<0.01&&Math.abs(f.lon-S.loc.lon)<0.01);
  if(i>=0) S.favs.splice(i,1);
  else { S.favs.unshift({...S.loc}); if(S.favs.length>10) S.favs.pop(); }
  saveFavs(); renderChips(); if(S.data) renderCurrent();
}

/* Search */
function setupSearch() {
  const input=$('searchInput'), box=$('suggestions'), clear=$('clearBtn');
  input.addEventListener('input',()=>{
    const q=input.value.trim();
    clear.classList.toggle('hidden',!q);
    clearTimeout(S.timer);
    if(q.length<1){ show(box,false); return; }
    S.timer=setTimeout(async()=>{
      try {
        const results=await searchCities(q);
        if(!results.length) box.innerHTML=`<div class="suggestion"><span class="meta">${t('noResults')}</span></div>`;
        else box.innerHTML=results.map(r=>`
          <div class="suggestion" data-lat="${r.latitude}" data-lon="${r.longitude}"
               data-name="${r.name}" data-country="${r.country||''}"
               data-admin1="${r.admin1||''}" data-tz="${r.timezone||'auto'}">
            <div class="name">${r.name}${r.isEgypt?' 🇪🇬':''}</div>
            <div class="meta">${[r.admin1,r.country].filter(Boolean).join(', ')} · ${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}</div>
          </div>`).join('');
        show(box,true);
      } catch{ show(box,false); }
    },250);
  });
  box.addEventListener('click',e=>{
    const item=e.target.closest('.suggestion[data-lat]');
    if(!item) return;
    input.value=item.dataset.name; show(box,false);
    selectLoc({
      name:item.dataset.name, country:item.dataset.country, admin1:item.dataset.admin1,
      latitude:+item.dataset.lat, longitude:+item.dataset.lon, timezone:item.dataset.tz
    });
  });
  clear.onclick=()=>{ input.value=''; clear.classList.add('hidden'); show(box,false); input.focus(); };
  document.addEventListener('click',e=>{ if(!e.target.closest('.search-wrap')) show(box,false); });
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ const f=box.querySelector('.suggestion[data-lat]'); if(f) f.click(); }
  });
}

function useGeo() {
  if(!navigator.geolocation){ setError(t('locError')); return; }
  setLoading(true);
  navigator.geolocation.getCurrentPosition(async pos=>{
    try {
      const {latitude,longitude}=pos.coords;
      const data=await fetchWeather(latitude,longitude,'auto');
      S.loc={name:S.settings.lang==='ar'?'موقعي':'My Location',country:'',admin1:'',lat:latitude,lon:longitude,tz:data.timezone||'auto'};
      S.data=data;
      localStorage.setItem('wly_last',JSON.stringify(S.loc));
      renderChips(); renderAll();
    } catch(e){ setError(e.message); }
    finally{ setLoading(false); }
  }, err=>{
    setLoading(false);
    setError(err.code===1?t('locDenied'):t('locError'));
  },{timeout:10000});
}

function setupSettings() {
  const modal=$('settingsOverlay');
  $('settingsBtn').onclick=()=>{ show(modal,true); syncSegs(); };
  $('closeSettings').onclick=()=>show(modal,false);
  modal.addEventListener('click',e=>{ if(e.target===modal) show(modal,false); });

  function bindSeg(id,key){
    $(id).addEventListener('click',e=>{
      const btn=e.target.closest('[data-v]'); if(!btn) return;
      S.settings[key]=btn.dataset.v; saveSettings();
      if(key==='theme') applyTheme();
      if(key==='lang'){ applyLang(); renderChips(); renderMapMarkers($('egyptFilter')?.value||''); }
      syncSegs(); if(S.data) renderAll();
    });
  }
  bindSeg('tempSeg','tempUnit'); bindSeg('windSeg','windUnit');
  bindSeg('timeSeg','timeFormat'); bindSeg('themeSeg','theme'); bindSeg('langSeg','lang');

  $('themeBtn').onclick=()=>{
    const cur=document.documentElement.getAttribute('data-theme');
    S.settings.theme=cur==='dark'?'light':'dark';
    saveSettings(); applyTheme(); syncSegs(); if(S.data) renderAll();
  };
  $('clearRecentBtn').onclick=()=>{ S.recent=[]; saveRecent(); renderChips(); };
  $('clearFavsBtn').onclick=()=>{ S.favs=[]; saveFavs(); renderChips(); if(S.data) renderCurrent(); };
  $('exportBtn').onclick=()=>{
    const data={settings:S.settings,favs:S.favs,recent:S.recent};
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    a.download='weatherly-settings.json'; a.click();
  };
  $('importBtn').onclick=()=>$('importFile').click();
  $('importFile').addEventListener('change',e=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(data.settings){ S.settings={...DEFAULTS,...data.settings}; saveSettings(); }
        if(data.favs){ S.favs=data.favs; saveFavs(); }
        if(data.recent){ S.recent=data.recent; saveRecent(); }
        applyTheme(); applyLang(); syncSegs(); renderChips(); if(S.data) renderAll();
      }catch{}
    };
    reader.readAsText(file);
  });
  $('resetBtn').onclick=()=>{
    S.settings={...DEFAULTS}; saveSettings(); applyTheme(); applyLang(); syncSegs(); if(S.data) renderAll();
  };
}

function syncSegs() {
  const map={tempSeg:S.settings.tempUnit,windSeg:S.settings.windUnit,timeSeg:S.settings.timeFormat,themeSeg:S.settings.theme,langSeg:S.settings.lang};
  Object.entries(map).forEach(([id,val])=>{
    $(id).querySelectorAll('[data-v]').forEach(b=>b.classList.toggle('active',b.dataset.v===val));
  });
}

function init() {
  loadStore(); applyTheme(); applyLang();
  setupSearch(); setupSettings(); setupTabs(); setupMap();
  renderChips();

  $('geoBtn').onclick=useGeo;
  $('favBtn').onclick=toggleFav;
  $('retryBtn').onclick=()=>{
    if(S.loc) loadWeather();
    else{ const last=localStorage.getItem('wly_last'); if(last) try{selectLoc(JSON.parse(last));}catch{} }
  };

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
    if(S.settings.theme==='system') applyTheme();
  });

  const last=localStorage.getItem('wly_last');
  if(last){ try{ selectLoc(JSON.parse(last)); return; }catch{} }
  const cairo=EGYPT[0];
  selectLoc({
    name:S.settings.lang==='ar'?cairo.ar:cairo.en,
    country:S.settings.lang==='ar'?'مصر':'Egypt',
    admin1:'', latitude:cairo.lat, longitude:cairo.lon, timezone:'Africa/Cairo'
  });
}

document.addEventListener('DOMContentLoaded', init);
