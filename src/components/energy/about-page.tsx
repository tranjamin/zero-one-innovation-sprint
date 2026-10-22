import { PlugZap, Clock3, BarChart3, Sun, Leaf, Wallet, Users, TrendingUp, ArrowRight, ShieldCheck, Gift, CircleCheck } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeading } from './primitives';
import { useEnergy } from './energy-provider';
import { benefit, energySlots, planCharging, money } from '@/lib/energy';

const steps = [
  { n: '01', icon: PlugZap, title: 'Tell us what you have', body: 'Add each appliance and say what it is — an electric vehicle, a hot water boiler or a washing machine.' },
  { n: '02', icon: Clock3, title: 'Set a target and a deadline', body: '“Charge to 60% by 07:00 tomorrow.” That single line is everything the optimiser needs from you.' },
  { n: '03', icon: BarChart3, title: 'We search every hour ahead', body: 'The next 24 hours are ranked by price, and by forecast neighbour solar if you are in a community.' },
  { n: '04', icon: Wallet, title: 'The benefit lands', body: 'A lower bill on a variable plan, or monthly credit on a fixed one. Either way, your deadline is met.' },
];
const inputs = [
  { icon: BarChart3, title: 'Hourly energy prices', body: 'Twenty-four hours of market prices. In this demo they run from 9 to 35 ct per kWh.' },
  { icon: Sun, title: 'Neighbour solar forecast', body: 'The surplus your community rooftops are expected to send, hour by hour.' },
  { icon: PlugZap, title: 'Appliance state & power', body: 'Where each device sits now, how fast it can charge, and what it costs to move one unit.' },
  { icon: Clock3, title: 'Your targets & deadlines', body: '60% by 07:00. 60 °C by 18:00. A cycle finished before 19:00.' },
];
const rules = [
  { icon: Clock3, title: 'Your deadline outranks the price', body: 'A cheaper plan that misses your target is never labelled ready — you get a clear warning instead.' },
  { icon: BarChart3, title: 'Plans stay provisional', body: 'Prices and sunshine move, so plans are re-checked as fresh forecasts arrive.' },
  { icon: ShieldCheck, title: 'Nothing is locked in', body: 'Turn smart charging off on any appliance. This demo never commands a real device.' },
  { icon: Leaf, title: 'Local surplus first', body: 'In an energy community, predicted neighbour solar is used before grid energy.' },
];
const benefits = [
  { icon: TrendingUp, tag: 'VARIABLE TARIFF', title: 'You pay less for the same charging', body: 'Charging is moved into the cheapest hours, so every kilowatt-hour you buy costs less. The saving shows straight on your bill.' },
  { icon: Gift, tag: 'FIXED TARIFF', title: 'The difference comes back as credit', body: 'When the energy you actually used cost less than the fixed price you purchased, that positive difference becomes monthly credit you can redeem.' },
  { icon: Users, tag: 'ENERGY COMMUNITY', title: 'You run on the neighbour’s sunshine', body: 'Surplus that would otherwise be sold away is used at home instead — cheaper for you, and it stays local and renewable.' },
];

export function AboutPage() {
  const { tariff, community, appliances } = useEnergy();
  const projected = appliances.reduce((sum, a) => { const p = planCharging(a, energySlots, community); const b = benefit(p.energy, p.energy ? p.cost / p.energy : 0, 0.3, tariff); return sum + b.savings + b.credits; }, 0);
  return <>
    <PageHeading eyebrow="UNDER THE HOOD" title="About Smart Energy" description="How your charging plan is made — and what you get out of it." action={<Button variant="outline" asChild><Link to="/appliances">See your plan<ArrowRight/></Link></Button>} />
    <section className="about-steps">{steps.map(s => <article className="about-step" key={s.n}><div className="about-step-num"><i>{s.n}</i><s.icon size={17} /></div><h3>{s.title}</h3><p>{s.body}</p></article>)}</section>
    <div className="two-column-section">
      <section>
        <div className="section-heading"><div><h2>What the optimiser reads</h2><p>Four signals, refreshed every hour.</p></div><BarChart3 className="text-primary" /></div>
        <div className="about-inputs">{inputs.map(i => <div className="about-input" key={i.title}><i.icon size={19} /><strong>{i.title}</strong><span>{i.body}</span></div>)}</div>
        <div className="chart-insight"><CircleCheck size={18} /><p><strong>Nothing leaves your home.</strong> Only the price, forecast and constraint data above is used to build a plan.</p></div>
      </section>
      <section>
        <div className="section-heading"><div><h2>Rules the plan always keeps</h2><p>Written into the optimiser, not left to chance.</p></div><ShieldCheck className="text-success" /></div>
        {rules.map(r => <div className="about-rule" key={r.title}><r.icon size={17} /><div><strong>{r.title}</strong><p>{r.body}</p></div></div>)}
      </section>
    </div>
    <section className="about-benefit-section">
      <div className="section-heading"><div><h2>How clients benefit</h2><p>Three ways the same optimisation pays you back.</p></div><Wallet className="text-primary" /></div>
      <div className="about-benefits">{benefits.map(b => { const active = b.tag === 'ENERGY COMMUNITY' ? community : tariff === 'variable' ? b.tag === 'VARIABLE TARIFF' : b.tag === 'FIXED TARIFF'; return <article className={`about-benefit ${active ? 'about-benefit-active' : ''}`} key={b.tag}><div className="about-benefit-top"><span className="about-tag">{b.tag}</span>{active && <span className="about-plan-pill"><CircleCheck size={11} />Your plan</span>}</div><b.icon size={22} /><h3>{b.title}</h3><p>{b.body}</p></article>; })}</div>
    </section>
    <section className="next-plan-savings"><TrendingUp size={22} /><div><h3>{money(projected)} projected benefit from your next charging plan</h3><p>Based on your current appliance targets, against a 30 ct/kWh illustrative reference tariff.</p></div><Button variant="ghost" asChild><Link to="/savings">Savings & credits<ArrowRight/></Link></Button></section>
    <div className="bottom-note"><ShieldCheck size={16} /><span>This is an interactive concept with a demo household. Prices, forecasts and totals are illustrative, no live meter or appliance is connected, and changes reset when the page is reloaded.</span></div>
  </>;
}
