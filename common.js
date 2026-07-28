const SUBJECTS = [
  {key:'國語', color:'var(--stamp-red)'},
  {key:'數學', color:'var(--stamp-blue)'},
  {key:'英語', color:'var(--stamp-green)'},
  {key:'自然', color:'var(--stamp-teal)'},
  {key:'社會', color:'var(--stamp-plum)'},
  {key:'其他', color:'var(--stamp-gray)'},
];

function pad(n){ return n<10 ? '0'+n : ''+n; }
function dateKey(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function keyToDate(key){ const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDateLabel(d){
  const wk = ['日','一','二','三','四','五','六'][d.getDay()];
  return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日 週'+wk;
}
function sameDay(a,b){ return dateKey(a)===dateKey(b); }
function uid(){ return Math.random().toString(36).slice(2,9); }
function subjectColor(key){
  const s = SUBJECTS.find(s=>s.key===key);
  return s ? s.color : 'var(--stamp-gray)';
}
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
