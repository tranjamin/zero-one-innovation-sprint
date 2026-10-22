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
  const sunX = 20 + (hour / 24) * 280;
  const sunY = 70 - m.sun * 55;
  const flows = [
    { key: "plant", label: "Power plant", d: "M40 150 C 90 150, 120 175, 160 180", share: m.plant, cls: "stroke-destructive" },
    { key: "regional", label: "Regional wind & hydro", d: "M280 150 C 230 150, 200 175, 160 180", share: m.regional, cls: "stroke-info" },
    { key: "local", label: "Neighbours' solar", d: "M160 110 C 160 130, 160 150, 160 180", share: m.local, cls: "stroke-success" },
  ];
  const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 320 220" className="w-full rounded-lg bg-muted" role="img" aria-label="Animated energy flow during the day">
        <circle cx={sunX} cy={sunY} r="9" className="fill-primary" opacity={m.sun > 0.02 ? 1 : 0.15} />
        {/* plant */}
        <rect x="20" y="130" width="28" height="30" className="fill-secondary stroke-border" />
        <rect x="26" y="112" width="6" height="18" className="fill-secondary stroke-border" />
        {/* wind turbine */}
        <line x1="285" y1="160" x2="285" y2="120" className="stroke-foreground" strokeWidth="2" />
        <g style={{ transformOrigin: "285px 120px", transform: `rotate(${hour * 360}deg)` }}>
          {[0, 120, 240].map((a) => (
            <line key={a} x1="285" y1="120" x2="285" y2="104" className="stroke-foreground" strokeWidth="2" transform={`rotate(${a} 285 120)`} />
          ))}
        </g>
        {/* neighbours with solar */}
        {[130, 160, 190].map((x) => (
          <g key={x}>
            <polygon points={`${x - 12},100 ${x},88 ${x + 12},100`} className="fill-success" opacity={0.4 + m.sun * 0.6} />
            <rect x={x - 10} y="100" width="20" height="14" className="fill-secondary stroke-border" />
          </g>
        ))}
        {/* your home */}
        <polygon points="140,180 160,165 180,180" className="fill-primary" />
        <rect x="144" y="180" width="32" height="22" className="fill-card stroke-primary" />
        <text x="160" y="215" textAnchor="middle" className="fill-muted-foreground" fontSize="9">Your home</text>
        {flows.map((f) => (
          <path key={f.key} d={f.d} fill="none" className={f.cls} strokeLinecap="round"
            strokeWidth={1 + f.share * 9} strokeDasharray="4 8" opacity={0.25 + f.share}
            style={{ strokeDashoffset: -hour * 120 }} />
        ))}
        <text x="160" y="20" textAnchor="middle" className="fill-foreground" fontSize="13" fontWeight="700">{fmt(hour)}</text>
      </svg>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[["Local", m.local, "bg-success"], ["Regional", m.regional, "bg-info"], ["Power plant", m.plant, "bg-destructive"]].map(([l, v, c]) => (
          <div key={l as string} className="rounded-md border border-border p-2">
            <div className="flex items-center gap-1.5 text-muted-foreground"><span className={`h-2 w-2 rounded-full ${c}`} />{l as string}</div>
            <div className="mt-1 font-display text-base font-bold">{Math.round((v as number) * 100)}%</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</Button>
        <input type="range" min={0} max={23.9} step={0.1} value={hour} aria-label="Time of day"
          onChange={(e) => { setPlaying(false); setHour(Number(e.target.value)); }} className="flex-1 accent-primary" />
      </div>
      <p className="text-xs text-muted-foreground">Illustrative: midday solar from neighbours, regional wind overnight, power plants cover the evening peak. We charge your devices when the cleanest, cheapest energy is flowing.</p>
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
