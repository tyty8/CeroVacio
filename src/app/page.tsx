"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

/* ---------- Data: Chilean cities mapped to SVG viewBox ---------- */
type City = { name: string; region: string; x: number; y: number };

const SCL_COMMUNAS: City[] = [
  { name: "Santiago Centro", region: "RM", x: 102, y: 452 },
  { name: "Providencia", region: "RM", x: 104, y: 450 },
  { name: "Las Condes", region: "RM", x: 107, y: 448 },
  { name: "Vitacura", region: "RM", x: 106, y: 446 },
  { name: "Lo Barnechea", region: "RM", x: 108, y: 444 },
  { name: "Ñuñoa", region: "RM", x: 104, y: 453 },
  { name: "La Florida", region: "RM", x: 106, y: 457 },
  { name: "Puente Alto", region: "RM", x: 105, y: 461 },
  { name: "San Bernardo", region: "RM", x: 101, y: 461 },
  { name: "Maipú", region: "RM", x: 99, y: 455 },
  { name: "Pudahuel", region: "RM", x: 99, y: 451 },
  { name: "Quilicura", region: "RM", x: 101, y: 448 },
  { name: "Renca", region: "RM", x: 100, y: 450 },
  { name: "Estación Central", region: "RM", x: 101, y: 453 },
  { name: "Cerrillos", region: "RM", x: 100, y: 454 },
  { name: "Colina", region: "RM", x: 103, y: 443 },
  { name: "Melipilla", region: "RM", x: 96, y: 457 },
  { name: "Buin", region: "RM", x: 102, y: 464 },
];

const CL_CITIES: City[] = [
  ...SCL_COMMUNAS,
  { name: "Arica", region: "XV Región", x: 96, y: 40 },
  { name: "Iquique", region: "I Región", x: 95, y: 95 },
  { name: "Antofagasta", region: "II Región", x: 90, y: 195 },
  { name: "Calama", region: "II Región", x: 108, y: 175 },
  { name: "Copiapó", region: "III Región", x: 88, y: 285 },
  { name: "La Serena", region: "IV Región", x: 88, y: 360 },
  { name: "Coquimbo", region: "IV Región", x: 86, y: 372 },
  { name: "Valparaíso", region: "V Región", x: 80, y: 440 },
  { name: "Viña del Mar", region: "V Región", x: 84, y: 436 },
  { name: "Rancagua", region: "VI Región", x: 102, y: 482 },
  { name: "Talca", region: "VII Región", x: 100, y: 520 },
  { name: "Chillán", region: "Ñuble", x: 102, y: 555 },
  { name: "Concepción", region: "VIII Región", x: 82, y: 580 },
  { name: "Los Ángeles", region: "VIII Región", x: 100, y: 595 },
  { name: "Temuco", region: "IX Región", x: 98, y: 635 },
  { name: "Valdivia", region: "XIV Región", x: 90, y: 672 },
  { name: "Osorno", region: "X Región", x: 98, y: 700 },
  { name: "Puerto Montt", region: "X Región", x: 92, y: 725 },
  { name: "Coyhaique", region: "XI Región", x: 110, y: 760 },
  { name: "Punta Arenas", region: "XII Región", x: 125, y: 795 },
];

/* ---------- Helpers ---------- */
function computeQuote(fromCity: City, toCity: City) {
  const dx = Math.abs(fromCity.x - toCity.x);
  const dy = Math.abs(fromCity.y - toCity.y);
  const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 12);
  const marketPrice = Math.round(dist * 950 + 45000);
  const ourPrice = Math.round(marketPrice * 0.62);
  const savings = marketPrice - ourPrice;
  const eta = Math.max(1, Math.round(dist / 550));
  return { dist, marketPrice, ourPrice, savings, eta };
}
function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL") + " CLP";
}

/* ---------- Top nav ---------- */
function TopBarV2() {
  const [openSol, setOpenSol] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  useEffect(() => {
    if (!openSol) return;
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest(".has-menu")) setOpenSol(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openSol]);

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div className="topnav-left">
          <div className="brand">
            <div className="brand-mark">L</div>
            <span>Luxutech</span>
          </div>
          <span className="brand-tagline">Red de backhaul · Región Metropolitana</span>
        </div>
        <nav className="topnav-center">
          <div className="has-menu">
            <a
              href="#soluciones"
              onClick={(e) => {
                e.preventDefault();
                setOpenSol((v) => !v);
              }}
            >
              Soluciones
              <svg className={`caret ${openSol ? "open" : ""}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {openSol && (
              <div className="menu-pop">
                <div className="menu-col">
                  <div className="menu-label">POR INDUSTRIA</div>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" /><path d="M2 7H14" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">E-commerce</div><div className="mi-s">Fulfillment y última milla</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6L8 3L13 6V13H3V6Z" stroke="currentColor" strokeWidth="1.3" /><rect x="6.5" y="9" width="3" height="4" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">Retail</div><div className="mi-s">Tiendas y bodegas</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13L8 3L14 13H2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M5.5 10H10.5" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">Construcción</div><div className="mi-s">Materiales y equipos</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 6.5C6 6.5 6.5 8 8 8C9.5 8 10 6.5 10 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    </div>
                    <div><div className="mi-t">Alimentos</div><div className="mi-s">Cadena de frío incluida</div></div>
                  </a>
                </div>
                <div className="menu-col">
                  <div className="menu-label">POR TAMAÑO</div>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">Paquete</div><div className="mi-s">Hasta 30 kg</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" stroke="currentColor" strokeWidth="1.3" /><path d="M2 6H14M2 10H14M6 3V13M10 3V13" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">Pallet</div><div className="mi-s">Hasta 1.000 kg</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="5" width="10" height="6" stroke="currentColor" strokeWidth="1.3" /><rect x="11" y="7" width="4" height="4" stroke="currentColor" strokeWidth="1.3" /><circle cx="4" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </div>
                    <div><div className="mi-t">Camión completo</div><div className="mi-s">FTL · 3T a 28T</div></div>
                  </a>
                  <a href="#" className="menu-item">
                    <div className="mi-ic">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M3 8L6 5M3 8L6 11M13 8L10 5M13 8L10 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div><div className="mi-t">Recurrente</div><div className="mi-s">Rutas fijas · API</div></div>
                  </a>
                </div>
              </div>
            )}
          </div>
          <a href="#precios">Precios</a>
          <a href="#transportistas">Transportistas</a>
        </nav>
        <div className="topnav-right">
          <a href="#login" className="nav-ghost">Ingresar</a>
          <a href="#cta" className="nav-cta">Cotizar ahora →</a>
          <button className="nav-burger" onClick={() => setOpenMobile((v) => !v)} aria-label="Menú">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {openMobile ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {openMobile && (
        <div className="mobile-menu">
          <div className="mm-label">SOLUCIONES · POR INDUSTRIA</div>
          <a href="#" className="mm-link">E-commerce</a>
          <a href="#" className="mm-link">Retail</a>
          <a href="#" className="mm-link">Construcción</a>
          <a href="#" className="mm-link">Alimentos</a>
          <div className="mm-label">POR TAMAÑO</div>
          <a href="#" className="mm-link">Paquete</a>
          <a href="#" className="mm-link">Pallet</a>
          <a href="#" className="mm-link">Camión completo</a>
          <a href="#" className="mm-link">Recurrente · API</a>
          <div className="mm-sep" />
          <a href="#precios" className="mm-link">Precios</a>
          <a href="#transportistas" className="mm-link">Transportistas</a>
          <a href="#login" className="mm-link">Ingresar</a>
        </div>
      )}
    </div>
  );
}

/* ---------- Status bar ---------- */
function StatusBar() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const hh = t ? String(t.getHours()).padStart(2, "0") : "--";
  const mm = t ? String(t.getMinutes()).padStart(2, "0") : "--";
  const ss = t ? String(t.getSeconds()).padStart(2, "0") : "--";
  return (
    <div className="statusbar">
      <div className="sb-group">
        <div className="sb-item">
          <span className="sb-dot sb-dot-pos" />
          <span className="sb-k">RED RM</span>
          <span className="sb-v">ACTIVA</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-k">CAMIONES</span>
          <span className="sb-v">892</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-k">COMUNAS</span>
          <span className="sb-v">52 / 52</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-k">ON-TIME</span>
          <span className="sb-v">97,4%</span>
        </div>
      </div>
      <div className="sb-group sb-group-center">
        <div className="sb-item">
          <span className="sb-k">v</span>
          <span className="sb-v">4.2.1</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-k">BUILD</span>
          <span className="sb-v">#8421 · prod</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-dot sb-dot-pos" />
          <span className="sb-k">API</span>
          <span className="sb-v">47ms</span>
        </div>
      </div>
      <div className="sb-group">
        <div className="sb-item">
          <span className="sb-k">RATING</span>
          <span className="sb-v" style={{ color: "var(--accent)", letterSpacing: ".1em" }}>★★★★★</span>
          <span className="sb-v">4,9</span>
          <span className="sb-k">· 2.418 reseñas</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <span className="sb-k">SCL</span>
          <span className="sb-v">
            {hh}:{mm}
            <span style={{ color: "var(--muted)" }}>:{ss}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Map ---------- */
function MapV2({ from, to, animateKey }: { from: string; to: string; animateKey: string }) {
  const fromCity = from ? CL_CITIES.find((c) => c.name.toLowerCase() === from.toLowerCase()) : null;
  const toCity = to ? CL_CITIES.find((c) => c.name.toLowerCase() === to.toLowerCase()) : null;

  const SCL_VIEW = { x: 90, y: 438, w: 28, h: 32 };

  const routePath = useMemo(() => {
    if (!fromCity || !toCity) return null;
    const mx = (fromCity.x + toCity.x) / 2;
    const my = (fromCity.y + toCity.y) / 2;
    const dx = toCity.x - fromCity.x;
    const dy = toCity.y - fromCity.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ox = (-dy / dist) * Math.min(3, dist * 0.15);
    return `M ${fromCity.x} ${fromCity.y} Q ${mx + ox} ${my - 1} ${toCity.x} ${toCity.y}`;
  }, [fromCity, toCity]);

  const roads = [
    { d: "M 95 450 L 115 450", w: 0.4 },
    { d: "M 102 440 L 102 465", w: 0.4 },
    { d: "M 98 442 Q 102 445 108 444 Q 112 450 108 458 Q 102 462 96 458 Q 92 452 98 442 Z", w: 0.35 },
    { d: "M 96 446 Q 105 444 114 446", w: 0.3 },
  ];

  const ambient = useMemo(() => {
    const pairs: [string, string][] = [
      ["Providencia", "Pudahuel"],
      ["Las Condes", "Maipú"],
      ["Puente Alto", "Quilicura"],
      ["Colina", "Buin"],
      ["Lo Barnechea", "Melipilla"],
      ["San Bernardo", "Vitacura"],
    ];
    return pairs
      .map(([a, b]) => {
        const A = CL_CITIES.find((c) => c.name === a);
        const B = CL_CITIES.find((c) => c.name === b);
        if (!A || !B) return null;
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2;
        return { d: `M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`, key: `${a}-${b}` };
      })
      .filter((x): x is { d: string; key: string } => !!x);
  }, []);

  const localCities = CL_CITIES.filter(
    (c) => c.x >= SCL_VIEW.x && c.x <= SCL_VIEW.x + SCL_VIEW.w && c.y >= SCL_VIEW.y && c.y <= SCL_VIEW.y + SCL_VIEW.h,
  );

  return (
    <div className="map-root">
      <svg viewBox={`${SCL_VIEW.x} ${SCL_VIEW.y} ${SCL_VIEW.w} ${SCL_VIEW.h}`} style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid2" width="2" height="2" patternUnits="userSpaceOnUse">
            <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#FFFFFF08" strokeWidth="0.08" />
          </pattern>
          <pattern id="grid2big" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#FFFFFF12" strokeWidth="0.12" />
          </pattern>
        </defs>

        <rect x={SCL_VIEW.x} y={SCL_VIEW.y} width={SCL_VIEW.w} height={SCL_VIEW.h} fill="url(#grid2)" />
        <rect x={SCL_VIEW.x} y={SCL_VIEW.y} width={SCL_VIEW.w} height={SCL_VIEW.h} fill="url(#grid2big)" />

        <path d="M 94 441 L 112 441 L 116 448 L 116 460 L 112 468 L 97 468 L 93 462 L 92 448 Z" fill="var(--surface)" opacity=".6" stroke="var(--line-strong)" strokeWidth="0.15" />
        <path d="M 112 441 L 116 448 L 116 460 L 112 468 L 112 441 Z" fill="#FFFFFF06" />
        <text x="113.5" y="455" fontSize="1.4" fill="var(--muted)" fontFamily="var(--mono)" letterSpacing=".08em" opacity=".5" transform="rotate(90 113.5 455)">
          CORDILLERA
        </text>

        {roads.map((r, i) => (
          <path key={i} d={r.d} fill="none" stroke="#FFFFFF22" strokeWidth={r.w} strokeLinecap="round" />
        ))}

        {ambient.map((r) => (
          <path key={r.key} d={r.d} fill="none" stroke="var(--accent)" strokeOpacity=".18" strokeWidth="0.15" strokeDasharray="0.5 0.6" />
        ))}

        {localCities.map((c) => {
          const isSel = (fromCity && c.name === fromCity.name) || (toCity && c.name === toCity.name);
          const isCenter = c.name === "Santiago Centro";
          return (
            <g key={c.name}>
              <circle
                cx={c.x}
                cy={c.y}
                r={isSel ? 0.9 : isCenter ? 0.55 : 0.32}
                fill={isSel ? "var(--accent)" : isCenter ? "var(--ink)" : "var(--ink-2)"}
                opacity={isSel ? 1 : isCenter ? 0.9 : 0.55}
              />
              {isSel && <circle cx={c.x} cy={c.y} r="2.4" fill="none" stroke="var(--accent)" strokeWidth="0.12" opacity=".5" />}
              {!isSel && (
                <text
                  x={c.x + 0.7}
                  y={c.y + 0.4}
                  fontSize="0.9"
                  fill="var(--muted)"
                  fontFamily="var(--mono)"
                  letterSpacing=".04em"
                  opacity={isCenter ? 0.9 : 0.4}
                >
                  {c.name.split(" ")[0].toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {routePath && (
          <g key={animateKey}>
            <path
              d={routePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.2"
              strokeDasharray="40"
              strokeDashoffset="40"
              style={{ animation: "lux-drawR 1.2s cubic-bezier(.7,.1,.3,1) forwards", filter: "drop-shadow(0 0 1px var(--accent))" }}
            />
            <path
              d={routePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.45"
              strokeLinecap="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              style={{ animation: "lux-drawR 1.2s cubic-bezier(.7,.1,.3,1) forwards" }}
            />
            <circle r="0.6" fill="var(--accent)">
              <animateMotion dur="1.2s" fill="freeze" path={routePath} />
            </circle>
          </g>
        )}

        {fromCity && (
          <g>
            <circle cx={fromCity.x} cy={fromCity.y} r="1.4" fill="none" stroke="var(--ink)" strokeWidth="0.15" />
            <rect x={fromCity.x + 1.4} y={fromCity.y - 2.2} width="10" height="3.4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="0.1" />
            <text x={fromCity.x + 2} y={fromCity.y - 0.6} fontSize="1.2" fontWeight="600" fill="var(--ink)" fontFamily="var(--sans)">
              {fromCity.name.toUpperCase()}
            </text>
            <text x={fromCity.x + 2} y={fromCity.y + 0.8} fontSize="0.7" fill="var(--muted)" fontFamily="var(--mono)" letterSpacing=".1em">
              ORIGEN · RM
            </text>
          </g>
        )}
        {toCity && (
          <g>
            <circle cx={toCity.x} cy={toCity.y} r="1.4" fill="var(--accent)" />
            <rect x={toCity.x + 1.4} y={toCity.y - 2.2} width="10" height="3.4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="0.1" />
            <text x={toCity.x + 2} y={toCity.y - 0.6} fontSize="1.2" fontWeight="600" fill="var(--ink)" fontFamily="var(--sans)">
              {toCity.name.toUpperCase()}
            </text>
            <text x={toCity.x + 2} y={toCity.y + 0.8} fontSize="0.7" fill="var(--accent)" fontFamily="var(--mono)" letterSpacing=".1em">
              DESTINO · RM
            </text>
          </g>
        )}
      </svg>

      <div className="map-overlay tl">
        <div className="map-coord-block">
          <div className="v">REGIÓN METROPOLITANA</div>
          <div className="l">52 COMUNAS · 7,1M HAB</div>
        </div>
      </div>
      <div className="map-overlay tr">
        <div className="map-coord-block">
          <div className="v" style={{ color: "var(--pos)" }}>● LIVE · 892 RUTAS</div>
          <div className="l">SYNC 2.4s</div>
        </div>
      </div>
      <div className="map-overlay bl">
        <div className="map-corner">
          <span className="sq" /> 33°27&apos;S · 70°40&apos;W · SANTIAGO
        </div>
      </div>
      <div className="map-overlay br">
        <div className="map-corner">
          ZOOM 1:250.000 <span className="sq" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Autocomplete field ---------- */
function ACFieldV2({
  prefix,
  value,
  onChange,
  placeholder,
  exclude,
}: {
  prefix: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  exclude: string;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const matches =
    value.length >= 1
      ? CL_CITIES.filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()) && c.name !== exclude).slice(0, 5)
      : CL_CITIES.filter((c) => c.name !== exclude).slice(0, 6);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div
      className="field"
      ref={ref}
      onFocus={() => {
        setOpen(true);
        setFocused(true);
      }}
    >
      <span className="prefix">{prefix}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && focused && matches.length > 0 && (
        <div className="ac-pop">
          {matches.map((c) => (
            <div
              key={c.name}
              className="ac-item"
              onMouseDown={() => {
                onChange(c.name);
                setOpen(false);
                setFocused(false);
              }}
            >
              <span>{c.name}</span>
              <span className="rg">{c.region}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Live counter ---------- */
function LiveCounter() {
  const [n, setN] = useState(347);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + (Math.random() < 0.6 ? 1 : 0)), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="live-counter">
      <span className="lc-dot" />
      <span className="lc-v">{n.toLocaleString("es-CL")}</span>
      <span className="lc-l">empresas cotizaron hoy</span>
    </div>
  );
}

/* ---------- Cockpit form ---------- */
type Route = { from: string; to: string };

function CockpitForm({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [key, setKey] = useState(0);

  const from = route.from;
  const to = route.to;
  const setFrom = (v: string) => setRoute({ from: v, to });
  const setTo = (v: string) => setRoute({ from, to: v });

  const fromCity = CL_CITIES.find((c) => c.name.toLowerCase() === from.toLowerCase());
  const toCity = CL_CITIES.find((c) => c.name.toLowerCase() === to.toLowerCase());
  const quote = fromCity && toCity ? computeQuote(fromCity, toCity) : null;

  const available = quote ? Math.round(quote.dist / 8 + 12) : 892;

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quote) return;
    setSubmitted(true);
    setKey((k) => k + 1);
  };

  return (
    <>
      <div className="panel-head">
        <div className="kicker">
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "lux-pulse 1.6s ease-in-out infinite",
            }}
          />
          LUXUTECH · RM COCKPIT · v4.2
        </div>
        <h1>
          Los camiones cruzan Santiago <span className="hi">vacíos</span>. Llenamos el retorno.
        </h1>
        <p className="lede">
          Red de backhaul entre las 52 comunas de la Región Metropolitana. Cotiza, reserva y trackea en una sola pantalla.
        </p>
      </div>

      <div className="form-block">
        <div className="lbl">
          <span>› Nueva cotización · RM</span>
          <span className="counter">{available} camiones disp.</span>
        </div>

        <form onSubmit={onSubmit}>
          <ACFieldV2 prefix="FROM" value={from} onChange={setFrom} placeholder="Comuna de origen" exclude={to} />
          <ACFieldV2 prefix="TO" value={to} onChange={setTo} placeholder="Comuna de destino" exclude={from} />

          <button type="submit" className="submit-btn" disabled={!fromCity || !toCity}>
            {quote ? "Calcular precio" : "Selecciona origen y destino"} <span className="kbd">↵</span>
          </button>
        </form>

        <div className="micro-trust">
          <div><span>✓</span>Sin registro</div>
          <div><span>✓</span>Precio 48h</div>
          <div><span>✓</span>HDI Seguros</div>
        </div>

        <LiveCounter />

        <div className="trust-ext">
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 3V7C2 10 4 12.5 7 13C10 12.5 12 10 12 7V3L7 1Z" stroke="currentColor" strokeWidth="1.2" /><path d="M5 7L6.5 8.5L9 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div className="trust-t">HDI Seguros · hasta $50M CLP</div>
              <div className="trust-s">Cobertura total del envío, incluida en el precio</div>
            </div>
          </div>
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M4 5H10M4 7H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </div>
            <div>
              <div className="trust-t">Facturación SII automática</div>
              <div className="trust-s">Integrado con Bsale, Defontana y Nubox</div>
            </div>
          </div>
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </div>
            <div>
              <div className="trust-t">Tracking GPS + foto al cargar</div>
              <div className="trust-s">Ves el camión en vivo, confirmas con foto</div>
            </div>
          </div>
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 3.5C1.5 2.9 2 2.5 2.5 2.5H11.5C12 2.5 12.5 2.9 12.5 3.5V9.5C12.5 10.1 12 10.5 11.5 10.5H9L7 12.5L5 10.5H2.5C2 10.5 1.5 10.1 1.5 9.5V3.5Z" stroke="currentColor" strokeWidth="1.2" /></svg>
            </div>
            <div>
              <div className="trust-t">Soporte WhatsApp &lt; 2 min · 24/7</div>
              <div className="trust-s">Humanos reales en Providencia, no bots</div>
            </div>
          </div>
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5L13 5L9.5 8L11 12.5L7 9.8L3 12.5L4.5 8L1 5L5.5 5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div className="trust-t">4,9 / 5 · 2.418 reseñas</div>
              <div className="trust-s">Google · Trustpilot · verificadas</div>
            </div>
          </div>
          <div className="trust-row-ext">
            <div className="trust-ic">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div className="trust-t">Transportistas verificados</div>
              <div className="trust-s">Licencias, antecedentes y revisión técnica al día</div>
            </div>
          </div>
        </div>

        <div className="reg-row">
          <div className="reg-label">REGULADORES Y RESPALDO</div>
          <div className="reg-logos">
            <div className="reg-chip">SII</div>
            <div className="reg-chip">MTT</div>
            <div className="reg-chip">HDI</div>
            <div className="reg-chip">Kaszek</div>
            <div className="reg-chip">YC W24</div>
          </div>
        </div>

        <div className="clients-strip">
          <div className="reg-label">CONFÍAN EN NOSOTROS</div>
          <div className="clients-logos">
            <div className="client-logo">Kontur</div>
            <div className="client-logo">Jumbo</div>
            <div className="client-logo">Sodimac</div>
            <div className="client-logo">Ripley</div>
            <div className="client-logo">CMPC</div>
          </div>
        </div>
      </div>

      {submitted && quote && fromCity && toCity && (
        <div className="quote-result" key={key}>
          <div className="qr-header">
            <div>
              <div className="qr-route">
                {fromCity.name.toUpperCase()} → {toCity.name.toUpperCase()}
              </div>
              <div className="qr-price">{formatCLP(quote.ourPrice).replace(" CLP", "")}</div>
              <div className="qr-badge">−38% vs mercado · 48h lock</div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                lineHeight: 1.5,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              <div>{quote.dist.toLocaleString("es-CL")} KM</div>
              <div>ETA {quote.eta}D</div>
              <div style={{ color: "var(--accent)" }}>SALE EN 47 MIN</div>
            </div>
          </div>

          <div className="compare-table">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 10,
              }}
            >
              MERCADO · HOY
            </div>
            <div className="compare-row hl">
              <div>› Luxutech</div>
              <div className="p">{formatCLP(quote.ourPrice).replace(" CLP", "")}</div>
            </div>
            <div className="compare-row">
              <div>Chilexpress Cargo</div>
              <div className="p">{formatCLP(Math.round(quote.marketPrice * 0.98)).replace(" CLP", "")}</div>
            </div>
            <div className="compare-row">
              <div>Starken</div>
              <div className="p">{formatCLP(Math.round(quote.marketPrice * 1.02)).replace(" CLP", "")}</div>
            </div>
            <div className="compare-row">
              <div>Broker tradicional</div>
              <div className="p">{formatCLP(Math.round(quote.marketPrice * 1.06)).replace(" CLP", "")}</div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Te enviamos el lock de precio a " + email);
            }}
          >
            <div className="email-row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.cl" />
              <button type="submit">LOCK →</button>
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Recibes el precio por email · válido 48 horas
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/* ---------- Live feed ---------- */
const FEED_ROUTES: [string, string][] = [
  ["Providencia", "Maipú"], ["Las Condes", "Pudahuel"], ["Vitacura", "San Bernardo"],
  ["Santiago Centro", "Puente Alto"], ["Ñuñoa", "Quilicura"], ["La Florida", "Cerrillos"],
  ["Lo Barnechea", "Melipilla"], ["Colina", "Buin"], ["Estación Central", "Renca"],
  ["Las Condes", "Santiago Centro"], ["Providencia", "Puente Alto"], ["Maipú", "Ñuñoa"],
  ["Vitacura", "Pudahuel"], ["Santiago Centro", "Quilicura"], ["Lo Barnechea", "La Florida"],
];

const COMPANIES = [
  "Distribuidora Norte", "LogiChile SpA", "Muebles Biobío", "Frutos del Maule",
  "TransAndes", "Minera Andacollo", "Retail Sur", "Kontur", "Vinos Colchagua",
  "Pesquera Austral", "Ferretería Central", "Lácteos del Sur", "Cerámica Talagante",
  "Papelera CMPC", "Agrícola Curicó",
];

type Shipment = {
  id: number;
  code: string;
  from: string;
  to: string;
  company: string;
  saved: number;
  status: "pending" | "entregado";
  time: string;
};

function makeShipment(id: number, rand: () => number = Math.random): Shipment {
  const [a, b] = FEED_ROUTES[Math.floor(rand() * FEED_ROUTES.length)];
  const company = COMPANIES[Math.floor(rand() * COMPANIES.length)];
  const saved = Math.round(120 + rand() * 680) * 1000;
  const pending = rand() < 0.2;
  const minsAgo = pending ? 0 : Math.floor(rand() * 8) + 1;
  return {
    id,
    code: "LX-" + Math.floor(10000 + rand() * 89999),
    from: a,
    to: b,
    company,
    saved,
    status: pending ? "pending" : "entregado",
    time: pending ? "ahora" : `hace ${minsAgo}m`,
  };
}

// Deterministic seeded RNG for initial SSR-safe items
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Feed() {
  const [items, setItems] = useState<Shipment[]>(() => {
    const rng = mulberry32(42);
    return Array.from({ length: 10 }, (_, i) => makeShipment(i, rng));
  });
  const [nextId, setNextId] = useState(10);

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => [makeShipment(nextId), ...prev.slice(0, 11)]);
      setNextId((n) => n + 1);
    }, 3200);
    return () => clearInterval(t);
  }, [nextId]);

  return (
    <>
      <div className="feed-head">
        <h3>› Feed · envíos RM hoy</h3>
        <div className="live">
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--pos)",
              animation: "lux-pulse 1.6s ease-in-out infinite",
            }}
          />
          LIVE
        </div>
      </div>
      <div className="feed-list">
        {items.map((it, idx) => (
          <div key={it.id} className="feed-item" style={{ animationDelay: idx === 0 ? "0s" : `${idx * 0.02}s` }}>
            <div className="row1">
              <span>{it.code}</span>
              <span className={"st" + (it.status === "pending" ? " pending" : "")}>
                ● {it.status === "pending" ? "CARGANDO" : "ENTREGADO"}
              </span>
            </div>
            <div className="route">
              {it.from} <span className="arr">→</span> {it.to}
            </div>
            <div className="meta">
              <span>{it.company.length > 22 ? it.company.slice(0, 20) + "…" : it.company}</span>
              <span className="saved">−${(it.saved / 1000).toFixed(0)}k</span>
            </div>
            <div className="meta" style={{ marginTop: 2 }}>
              <span>{it.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="stats-strip">
        <div><b>14.328</b>envíos marzo</div>
        <div><b>97,4%</b>a tiempo</div>
        <div><b>38%</b>ahorro avg</div>
      </div>
    </>
  );
}

/* ---------- Below-fold sections ---------- */
function Mechanism() {
  return (
    <section className="band" id="mecanismo">
      <div className="wrap">
        <div className="band-head">
          <div>
            <div className="num">§ 01 · MÉTODO</div>
            <h2 style={{ marginTop: 16 }}>
              Un solo pipeline. Tres pasos. <em>Diez segundos.</em>
            </h2>
          </div>
        </div>
        <div className="mech-grid">
          <div className="mech-cell">
            <div className="idx">STEP 01</div>
            <h3>Ingresa origen → destino</h3>
            <p>Autocompletado con 340+ comunas. No necesitas calcular volumen ni peso: lo estimamos por tu industria.</p>
            <div className="diagram">
              <span className="chip">input.from</span>
              <span className="chip">input.to</span>
              <span className="chip hl">GET /quote</span>
            </div>
          </div>
          <div className="mech-cell">
            <div className="idx">STEP 02</div>
            <h3>Cruzamos con camiones en retorno</h3>
            <p>Algoritmo propio empareja tu envío con rutas vacías. Pagas por un viaje que igual iba a pasar.</p>
            <div className="diagram">
              <span className="chip">match.engine</span>
              <span className="chip">2.400 camiones</span>
              <span className="chip hl">−38% precio</span>
            </div>
          </div>
          <div className="mech-cell">
            <div className="idx">STEP 03</div>
            <h3>Reserva y trackea</h3>
            <p>Un clic reserva. Tracking GPS, foto al cargar, seguro HDI incluido, factura automática vía SII.</p>
            <div className="diagram">
              <span className="chip">GPS live</span>
              <span className="chip">HDI seguro</span>
              <span className="chip hl">factura.pdf</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="band" id="metricas">
      <div className="wrap">
        <div className="band-head">
          <div>
            <div className="num">§ 02 · MÉTRICAS · MARZO 2026</div>
            <h2 style={{ marginTop: 16 }}>
              No te pedimos que creas. <em>Te mostramos el log.</em>
            </h2>
          </div>
        </div>
        <div className="mx-grid">
          <div className="mx-cell">
            <div className="l">VOLUMEN</div>
            <div className="v">14.328</div>
            <div className="delta">↑ 34% vs feb</div>
          </div>
          <div className="mx-cell">
            <div className="l">ON-TIME</div>
            <div className="v">97,4<span className="u">%</span></div>
            <div className="delta">↑ 2,1 pts</div>
          </div>
          <div className="mx-cell">
            <div className="l">AHORRO AVG</div>
            <div className="v">38<span className="u">%</span></div>
            <div className="delta">vs mercado</div>
          </div>
          <div className="mx-cell">
            <div className="l">RESPUESTA WA</div>
            <div className="v">&lt;2<span className="u">min</span></div>
            <div className="delta">p95 · 24/7</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigCTA() {
  const [email, setEmail] = useState("");
  return (
    <section className="big-cta" id="cta">
      <div className="wrap">
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: ".1em",
            marginBottom: 24,
          }}
        >
          § 03 · EMPEZAR
        </div>
        <h2>
          El próximo camión
          <br />
          sale en <em>47 minutos</em>.
        </h2>
        <p>Sin contratos. Sin mínimos. Sin vendedor llamándote. Pagas solo cuando el camión está cargado.</p>
        <form
          className="cta-inline"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Listo! Contacto a " + email);
          }}
        >
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.cl" />
          <button type="submit">RECIBIR PRECIOS →</button>
        </form>
        <div className="sub-cta">Respondemos en WhatsApp en menos de 2 min · 24/7</div>
      </div>
      <footer className="foot" style={{ marginTop: 80 }}>
        © 2026 LUXUTECH SPA · PROVIDENCIA, SANTIAGO · v4.2.1
      </footer>
    </section>
  );
}

/* ---------- Root ---------- */
export default function Home() {
  const [route, setRoute] = useState<Route>({ from: "Providencia", to: "" });

  return (
    <div className="lux-landing">
      <TopBarV2 />
      <div className="cockpit">
        <div className="cockpit-left">
          <CockpitForm route={route} setRoute={setRoute} />
        </div>
        <div className="cockpit-map">
          <MapV2 from={route.from} to={route.to} animateKey={`${route.from}-${route.to}`} />
        </div>
        <div className="cockpit-right">
          <Feed />
        </div>
      </div>
      <StatusBar />
      <div className="below">
        <Mechanism />
        <Metrics />
        <BigCTA />
      </div>
    </div>
  );
}
