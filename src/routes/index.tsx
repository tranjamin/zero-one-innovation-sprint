import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zero One Hackathon — From 0 to 1 in a weekend" },
      { name: "description", content: "Zero One Hackathon: build something from nothing in 48 hours. Teams, mentors, prizes." },
      { property: "og:title", content: "Zero One Hackathon" },
      { property: "og:description", content: "Build something from nothing in 48 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tracks = [
  { n: "01", t: "AI & Agents", d: "Tools that think, plan and act." },
  { n: "10", t: "Climate & Energy", d: "Software for a cooler planet." },
  { n: "11", t: "Open Track", d: "Anything that goes from 0 to 1." },
];

const schedule = [
  ["Fri 18:00", "Doors open & kickoff"],
  ["Fri 20:00", "Hacking begins"],
  ["Sat 13:00", "Mentor office hours"],
  ["Sun 14:00", "Code freeze"],
  ["Sun 15:00", "Demos & judging"],
  ["Sun 18:00", "Awards"],
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 font-mono text-sm">
        <span className="font-bold text-primary">0/1</span>
        <div className="flex gap-6 text-muted-foreground">
          <a href="#tracks" className="hover:text-primary">tracks</a>
          <a href="#schedule" className="hover:text-primary">schedule</a>
          <a href="#register" className="hover:text-primary">register</a>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44">
          <p className="font-mono text-sm text-primary">&gt; init hackathon --weekend</p>
          <h1 className="mt-6 text-6xl font-bold leading-none tracking-tight md:text-9xl">
            Zero<span className="text-primary text-glow">/</span>One
            <span className="cursor-blink text-primary">_</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            48 hours. One idea. Take it from nothing to something real — with mentors, free food and prizes on the line.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
            <a href="#register" className="rounded bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_0_40px_var(--glow)] transition hover:opacity-90">
              Register now →
            </a>
            <a href="#tracks" className="rounded border border-border px-6 py-3 hover:border-primary">
              View tracks
            </a>
          </div>
        </div>
      </section>

      <section id="tracks" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-mono text-sm text-primary">// tracks</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-3">
          {tracks.map((t) => (
            <div key={t.n} className="bg-card p-8">
              <span className="font-mono text-primary">{t.n}</span>
              <h3 className="mt-4 text-2xl font-bold">{t.t}</h3>
              <p className="mt-2 text-muted-foreground">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-mono text-sm text-primary">// schedule</h2>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {schedule.map(([time, what]) => (
            <li key={time} className="flex gap-8 py-5">
              <span className="w-28 shrink-0 font-mono text-muted-foreground">{time}</span>
              <span className="text-lg">{what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="register" className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold md:text-6xl">Ready to ship<span className="text-primary">?</span></h2>
        <p className="mt-4 text-muted-foreground">Spots are limited. Solo or with a team of up to 4.</p>
        <a href="mailto:hello@zeroone.dev" className="mt-8 inline-block rounded bg-primary px-8 py-4 font-mono font-bold text-primary-foreground">
          Claim your spot →
        </a>
      </section>

      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted-foreground">
        01011010 · Zero One Hackathon · 2026
      </footer>
    </main>
  );
}
