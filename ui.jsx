/* ============================================================
   HOOR — UI primitives, icon set, app context
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useContext, createContext, useCallback } = React;

/* ---------- Icon set (line icons, 24x24, stroke=currentColor) ---------- */
const ICONS = {
  menu:'M3 6h18M3 12h18M3 18h18',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  heart:'M12 21s-7.5-4.6-10-9.2C.4 8.6 1.7 5 5 5c2 0 3.2 1.2 4 2.4C9.8 6.2 11 5 13 5c3.3 0 4.6 3.6 3 6.8C20.5 16.4 12 21 12 21z',
  bag:'M6 7h12l1 13H5L6 7zM9 7V5a3 3 0 0 1 6 0v2',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0',
  x:'M6 6l12 12M18 6L6 18',
  chevDown:'M5 9l7 7 7-7',
  chevLeft:'M15 5l-7 7 7 7',
  chevRight:'M9 5l7 7-7 7',
  check:'M5 12l5 5L20 6',
  plus:'M12 5v14M5 12h14',
  minus:'M5 12h14',
  trash:'M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13h10l1-13',
  edit:'M4 20h4l11-11a2.1 2.1 0 0 0-3-3L5 17v3z',
  star:'M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.4 9.3l6-.7L12 3z',
  instagram:'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01',
  phone:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail:'M3 6h18v12H3zM3 7l9 6 9-6',
  location:'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  truck:'M3 7h11v8H3zM14 10h4l3 3v2h-7M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  leaf:'M4 20c0-9 7-14 16-14 0 9-5 16-14 16-1 0-2-1-2-2zM4 20c4-4 8-6 12-7',
  pkg:'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10',
  sliders:'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M14 4v4M6 10v4M12 16v4',
  arrowLeft:'M19 12H5M11 18l-6-6 6-6',
  arrowRight:'M5 12h14M13 6l6 6-6 6',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  logout:'M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3M16 17l5-5-5-5M21 12H9',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  box:'M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 4 9-4M12 11v10',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.8 7.8 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.8 7.8 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7.8 7.8 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.8 7.8 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7.8 7.8 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5z',
  chat:'M4 5h16v11H9l-5 4V5z',
  sparkle:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z',
  card:'M3 6h18v12H3zM3 10h18M7 15h4',
  lock:'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3',
  sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  list:'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  filter:'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  ruler:'M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4',
  award:'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13l-1.5 8 5-3 5 3-1.5-8',
  refresh:'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
  gift:'M4 11h16v9H4zM4 7h16v4H4zM12 7v13M12 7S10 3 7.5 4 9 7 12 7zM12 7s2-4 4.5-3S15 7 12 7z',
  store:'M4 9h16l-1-5H5L4 9zM4 9v11h16V9M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0 2.5 2.5 0 0 0 5 0',
  soundOn:'M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12',
  soundOff:'M11 5L6 9H3v6h3l5 4V5zM22 9l-5 6M17 9l5 6',
};
function Icon({ name, size=22, stroke=1.7, style, className }){
  const d = ICONS[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}>
      {d.split('M').filter(Boolean).map((seg,i)=> <path key={i} d={'M'+seg} />)}
    </svg>
  );
}

/* ---------- small display helpers ---------- */
function Money({ value, cur=true, className='' }){
  return (
    <span className={'price '+className}>
      {fmtToman(value)}{cur && <span className="cur">تومان</span>}
    </span>
  );
}
function Stars({ value=5, size=14 }){
  return (
    <span className="center" style={{gap:1, color:'#C99A3B'}}>
      {[0,1,2,3,4].map(i=>(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < Math.round(value) ? 'currentColor':'none'} stroke="currentColor" strokeWidth="1.4">
          <path d={ICONS.star}/>
        </svg>
      ))}
    </span>
  );
}
function WoodDot({ wood }){
  const w = WOOD_TYPES.find(x=>x.id===wood)||{};
  return <span className="wood-dot" style={{background:w.color}} title={w.name}></span>;
}

/* ---------- App context (router + store) ---------- */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ---------- Toast host ---------- */
function ToastHost({ toasts }){
  return (
    <div className="toast-wrap">
      {toasts.map(t=>(
        <div key={t.id} className={'toast '+(t.kind||'ok')}>
          <span className="ic"><Icon name={t.kind==='info'?'sparkle':'check'} size={18}/></span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { ICONS, Icon, Money, Stars, WoodDot, AppCtx, useApp, ToastHost,
  useState, useEffect, useRef, useMemo, useContext, useCallback });
