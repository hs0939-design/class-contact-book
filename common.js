function pad(n){ return n<10 ? '0'+n : ''+n; }
function dateKey(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function keyToDate(key){ const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDateLabel(d){
  const wk = ['日','一','二','三','四','五','六'][d.getDay()];
  return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日 週'+wk;
}
function sameDay(a,b){ return dateKey(a)===dateKey(b); }
function uid(){ return Math.random().toString(36).slice(2,9); }
function fmtUpdated(iso){
  if(!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function escapeHtml(s){
  if(s==null) return '';
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s){ return escapeHtml(s); }

function buildCalendarCells(calMonth){
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = new Date(y,m,1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const cells = [];
  for(let i=0;i<startDow;i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
  return cells;
}

function renderCalendarGrid(calMonth, currentDate, entryDatesSet, onPickFnName){
  return `
    ${['日','一','二','三','四','五','六'].map(d=>`<div class="dow">${d}</div>`).join('')}
    ${buildCalendarCells(calMonth).map(d=>{
      if(!d) return `<div class="cal-day muted"></div>`;
      const key = dateKey(d);
      const sel = sameDay(d, currentDate);
      const isT = sameDay(d, new Date());
      const has = entryDatesSet.has(key);
      return `<button class="cal-day ${sel?'selected':''} ${isT?'hastoday':''}" onclick="${onPickFnName}('${key}')">${d.getDate()}${has?'<span class="dot"></span>':''}</button>`;
    }).join('')}
  `;
}

/* fetch a static JSON file relative to the page (used for public reads) */
async function fetchJson(path){
  try{
    const res = await fetch(path + '?t=' + Date.now(), {cache:'no-store'});
    if(!res.ok) return null;
    return await res.json();
  }catch(e){ return null; }
}

/* ---------- theme / color customization ---------- */
const DEFAULT_COLORS = { paper:'#F7F4EC', ink:'#2B2A26', navy:'#1F2D50', gold:'#C9A24B' };

function clamp(n,min,max){ return Math.min(max, Math.max(min, n)); }
function hexToRgb(hex){
  hex = (hex||'#000000').replace('#','');
  if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  const n = parseInt(hex,16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function rgbToHex(r,g,b){
  return '#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
}
function shade(hex, percent){
  const {r,g,b} = hexToRgb(hex);
  const t = percent<0 ? 0 : 255;
  const p = Math.abs(percent);
  return rgbToHex(r+(t-r)*p, g+(t-g)*p, b+(t-b)*p);
}
function hslToHex(h,s,l){
  s/=100; l/=100;
  const k = n => (n+h/30)%12;
  const a = s*Math.min(l,1-l);
  const f = n => l - a*Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n),1)));
  return rgbToHex(255*f(0), 255*f(8), 255*f(4));
}
function randomTheme(){
  const h = Math.floor(Math.random()*360);
  return {
    paper: hslToHex(h, 28, 95),
    ink: hslToHex(h, 20, 16),
    navy: hslToHex(h, 45, 27),
    gold: hslToHex((h+40)%360, 55, 55),
  };
}
function applyTheme(colors){
  const c = Object.assign({}, DEFAULT_COLORS, colors||{});
  const root = document.documentElement.style;
  root.setProperty('--paper', c.paper);
  root.setProperty('--paper-line', shade(c.paper, -0.08));
  root.setProperty('--ink', c.ink);
  root.setProperty('--ink-soft', shade(c.ink, 0.45));
  root.setProperty('--navy', c.navy);
  root.setProperty('--navy-2', shade(c.navy, -0.2));
  root.setProperty('--gold', c.gold);
  root.setProperty('--board-bg', shade(c.navy, -0.4));
  root.setProperty('--board-bg-2', shade(c.navy, -0.55));
  root.setProperty('--chalk', shade(c.paper, 0.08));
}

/* ---------- board mode font-size preference (per device) ---------- */
function loadBoardFont(){
  try{
    const raw = localStorage.getItem('contactbook_board_font');
    if(raw) return Object.assign({text:30, date:26}, JSON.parse(raw));
  }catch(e){}
  return {text:30, date:26};
}
function saveBoardFont(f){
  localStorage.setItem('contactbook_board_font', JSON.stringify(f));
  document.documentElement.style.setProperty('--board-text-size', f.text+'px');
  document.documentElement.style.setProperty('--board-date-size', f.date+'px');
}
