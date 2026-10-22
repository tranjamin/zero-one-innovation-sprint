import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Clock, Users, PiggyBank, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

/** Illustrative share of supply per hour: local (neighbours), regional (wind/hydro), plant. */
function mix(hour: number) {
  const sun = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI));
  const wind = 0.35 + 0.15 * Math.cos((hour / 24) * 2 * Math.PI);
  const demand = 0.6 + 0.3 * Math.exp(-((hour - 19) ** 2) / 6) + 0.2 * Math.exp(-((hour - 8) ** 2) / 4);
  const local = Math.min(demand, sun * 0.9);
  const regional = Math.min(demand - local, wind);
  const plant = Math.max(0, demand - local - regional);
  const total = local + regional + plant;
  return { local: local / total, regional: regional / total, plant: plant / total, sun };
}

function EnergyFlow() {
  const [hour, setHour] = useState(6);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setHour((h) => (h + 0.1) % 24), 60);
    return () => clearInterval(t);
  }, [playing]);
  const m = mix(hour);
  // Illustrative plan: charge when local/regional supply is high (cheap), pause in the evening peak.
  const evOn = (hour >= 0 && hour < 5) || (hour >= 11 && hour < 16);
  const boilerOn = (hour >= 2 && hour < 4) || (hour >= 12 && hour < 15);
  const prog = (h: number, wins: [number, number][]) =>
    wins.reduce((s, [a, b]) => s + Math.max(0, Math.min(h, b) - a) / (b - a), 0) / wins.length;
  const evPct = Math.round(30 + 50 * prog(hour, [[0, 5], [11, 16]]));
  const boilerPct = Math.round(20 + 80 * prog(hour, [[2, 4], [12, 15]]));
  const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
  const wire = (d: string, share: number, cls: string, on = true) => (
    <g>
      <path d={d} fill="none" className="stroke-border" strokeWidth="3" />
      {on && share > 0.02 && (
        <path d={d} fill="none" className={cls} strokeWidth={1.5 + share * 3} strokeDasharray="3 7"
          style={{ strokeDashoffset: -hour * 150 }} opacity={0.4 + share * 0.6} />
      )}
    </g>
  );
  const label = (x: number, y: number, t: string) => (
    <text x={x} y={y} textAnchor="middle" className="fill-muted-foreground" fontSize="8">{t}</text>
  );
  const anyLoad = evOn || boilerOn;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 320 240" className="w-full rounded-lg bg-muted" role="img" aria-label="Top-down schematic of energy charging an EV and boiler">
        <text x="12" y="16" className="fill-foreground" fontSize="12" fontWeight="700">{fmt(hour)}</text>
        {/* Wires (orthogonal, schematic style) into the home's distribution bus at (160,120) */}
        {wire("M44 120 H 120", m.plant, "stroke-destructive")}
        {wire("M276 120 H 200", m.regional, "stroke-info")}
        {wire("M160 44 V 92", m.local, "stroke-success")}
        {wire("M140 148 V 175 H 80 V 190", 1, "stroke-primary", evOn)}
        {wire("M180 148 V 175 H 240 V 190", 1, "stroke-primary", boilerOn)}
        {/* Junction nodes */}
        {[[120, 120], [200, 120], [160, 92], [140, 148], [180, 148]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" className="fill-foreground" />
        ))}
        {/* Power plant: top-down roof with two cooling towers */}
        <rect x="12" y="104" width="32" height="32" rx="2" className="fill-secondary stroke-foreground" />
        <circle cx="22" cy="114" r="5" className="fill-card stroke-foreground" />
        <circle cx="34" cy="126" r="5" className="fill-card stroke-foreground" />
        {label(28, 150, "Power plant")}
        {/* Regional wind farm: rotors seen from above */}
        {[[288, 108], [300, 130], [280, 134]].map(([x, y], k) => (
          <g key={k} style={{ transformOrigin: `${x}px ${y}px`, transform: `rotate(${hour * 400 * (0.4 + m.regional)}deg)` }}>
            <line x1={x - 7} y1={y} x2={x + 7} y2={y} className="stroke-info" strokeWidth="2" />
            <circle cx={x} cy={y} r="1.8" className="fill-foreground" />
          </g>
        ))}
        {label(290, 152, "Regional wind")}
        {/* Neighbours: rooftops with solar panel grids */}
        {[110, 160, 210].map((x) => (
          <g key={x}>
            <rect x={x - 16} y="18" width="32" height="22" rx="2" className="fill-secondary stroke-border" />
            {[0, 1, 2].map((c) => [0, 1].map((r) => (
              <rect key={`${c}${r}`} x={x - 13 + c * 9} y={21 + r * 8} width="8" height="7" className="fill-success" opacity={0.2 + m.sun * 0.8} />
            )))}
            {x !== 160 && <path d={`M${x} 40 V 44 H 160`} fill="none" className="stroke-border" strokeWidth="2" />}
          </g>
        ))}
        {label(160, 12, "Neighbours' solar")}
        {/* Your home: floor plan with bus bar */}
        <rect x="120" y="92" width="80" height="56" rx="3" className="fill-card stroke-primary" strokeWidth="1.5" />
        <rect x="132" y="116" width="56" height="8" rx="1" className={anyLoad ? "fill-primary" : "fill-border"} />
        {label(160, 108, "Your home")}
        {label(160, 140, "Smart controller")}
        {/* EV: car from above */}
        <g>
          <rect x="62" y="190" width="36" height="40" rx="8" className="fill-card stroke-foreground" />
          <rect x="67" y="196" width="26" height="8" rx="2" className="fill-secondary" />
          <rect x="66" y="212" width="28" height="12" rx="1" className="fill-border" />
          <rect x="66" y="212" width={28 * (evPct / 100)} height="12" rx="1" className={evOn ? "fill-primary" : "fill-muted-foreground"} />
          <text x="80" y="221" textAnchor="middle" className="fill-foreground" fontSize="7" fontWeight="700">{evPct}%</text>
          {label(122, 214, "EV")}
        </g>
        {/* Boiler: round tank from above */}
        <g>
          <circle cx="240" cy="210" r="19" className="fill-card stroke-foreground" />
          <circle cx="240" cy="210" r="15" className="fill-border" />
          <circle cx="240" cy="210" r={15 * Math.sqrt(boilerPct / 100)} className={boilerOn ? "fill-destructive" : "fill-muted-foreground"} opacity="0.8" />
          <text x="240" y="213" textAnchor="middle" className="fill-foreground" fontSize="7" fontWeight="700">{boilerPct}%</text>
          {label(282, 214, "Boiler")}
        </g>
      </svg>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[["Local", m.local, "bg-success"], ["Regional", m.regional, "bg-info"], ["Power plant", m.plant, "bg-destructive"]].map(([l, v, c]) => (
          <div key={l as string} className="rounded-md border border-border p-2">
            <div className="flex items-center gap-1.5 text-muted-foreground"><span className={`h-2 w-2 rounded-full ${c}`} />{l as string}</div>
            <div className="mt-1 font-display text-base font-bold">{Math.round((v as number) * 100)}%</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-secondary px-2 py-1">EV: {evOn ? "charging" : "waiting for cheaper energy"}</span>
        <span className="rounded-full bg-secondary px-2 py-1">Boiler: {boilerOn ? "heating" : "waiting for cheaper energy"}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</Button>
        <input type="range" min={0} max={23.9} step={0.1} value={hour} aria-label="Time of day"
          onChange={(e) => { setPlaying(false); setHour(Number(e.target.value)); }} className="flex-1 accent-primary" />
      </div>
      <p className="text-xs text-muted-foreground">Illustrative: the EV and boiler charge overnight on regional wind and at midday on neighbours' solar, and pause during the evening power-plant peak.</p>
    </div>
  );
}

const features = [
  { icon: Clock, title: "Smart scheduling", text: "Your EV and boiler charge in the cheapest hours — always ready by your deadline." },
  { icon: Users, title: "Energy communities", text: "We predict neighbours' surpluses and soak them up locally." },
  { icon: PiggyBank, title: "Tariff benefits", text: "Fixed-price customers share in savings from flexible demand." },
  { icon: ShieldCheck, title: "You stay in control", text: "Set constraints like “car at 80% by 07:00” and override anytime." },
];

export function IntroSlideshow() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  useEffect(() => setOpen(true), []);
  const slides = [
    <div key="pitch" className="space-y-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Zap className="h-7 w-7" /></div>
      <h2 className="font-display text-2xl font-bold">Charge smarter. Pay less. Share more.</h2>
      <p className="text-muted-foreground">Wien Energie Smart Charging automatically runs your biggest appliances when power is cheapest and greenest — using your neighbours' solar surplus first.</p>
      <div className="grid grid-cols-3 gap-2 pt-2 text-sm">
        {[["up to 30%", "lower charging costs"], ["0 effort", "set it once"], ["more local", "community energy"]].map(([a, b]) => (
          <div key={a} className="rounded-md bg-muted p-3"><div className="font-display font-bold text-primary">{a}</div><div className="text-xs text-muted-foreground">{b}</div></div>
        ))}
      </div>
    </div>,
    <div key="features" className="space-y-4">
      <h2 className="font-display text-xl font-bold">Key features</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-border p-3">
            <f.icon className="h-5 w-5 text-primary" />
            <div className="mt-2 font-semibold">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>
    </div>,
    <div key="flow" className="space-y-3">
      <h2 className="font-display text-xl font-bold">How energy moves through your day</h2>
      <EnergyFlow />
    </div>,
  ];
  const last = i === slides.length - 1;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
        <DialogTitle className="sr-only">Welcome to Wien Energie Smart Charging</DialogTitle>
        <DialogDescription className="sr-only">Introduction slideshow</DialogDescription>
        {slides[i]}
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft className="h-4 w-4" />Back</Button>
          <div className="flex gap-1.5">
            {slides.map((_, k) => (
              <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-2 bg-border"}`} />
            ))}
          </div>
          <Button size="sm" onClick={() => (last ? setOpen(false) : setI(i + 1))}>{last ? "Get started" : <>Next<ChevronRight className="h-4 w-4" /></>}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
