export type Tariff = 'variable' | 'fixed';
export type Appliance = { id: string; name: string; model: string; kind: 'car' | 'boiler' | 'washer'; current: number; target: number; deadline: string; power: number; energyPerUnit: number; enabled: boolean };
export type EnergySource = 'community' | 'regional' | 'plant' | 'grid';
export type EnergySlot = { start: string; price: number; surplus: number; source?: EnergySource };
export const demoNow = '2026-10-22T13:00:00+02:00';
export const energySlots: EnergySlot[] = Array.from({ length: 24 }, (_, i) => {
  const date = new Date(new Date(demoNow).getTime() + i * 3600000);
  const hour = (13 + i) % 24;
  const prices = [12, 10, 9, 10, 13, 18, 25, 30, 28, 24, 21, 18, 16, 14, 12, 11, 15, 24, 32, 35, 30, 25, 20, 16];
  return { start: date.toISOString(), price: (prices[hour] ?? 20) / 100, surplus: hour >= 13 && hour <= 16 ? [4.1, 6.8, 5.2, 2.4][hour - 13] ?? 0 : 0, source: hour >= 17 && hour <= 22 ? 'plant' : 'regional' };
});
export const initialAppliances: Appliance[] = [
  { id: 'ev', name: 'Electric vehicle', model: 'Volkswagen ID.4 · Garage', kind: 'car', current: 32, target: 60, deadline: '2026-10-23T07:00', power: 7.2, energyPerUnit: 0.6, enabled: true },
  { id: 'boiler', name: 'Hot water boiler', model: 'Vaillant ecoTEC · Utility room', kind: 'boiler', current: 48, target: 60, deadline: '2026-10-22T18:00', power: 3, energyPerUnit: 0.25, enabled: true },
  { id: 'washer', name: 'Washing machine', model: 'Bosch Serie 6 · Laundry', kind: 'washer', current: 0, target: 100, deadline: '2026-10-22T19:00', power: 1.5, energyPerUnit: 0.015, enabled: true },
];
export function benefit(kwh: number, actualPrice: number, comparisonPrice: number, tariff: Tariff) {
  const difference = Math.max(0, kwh * (comparisonPrice - actualPrice));
  return { savings: tariff === 'variable' ? difference : 0, credits: tariff === 'fixed' ? difference : 0 };
}
export function planCharging(appliance: Appliance, slots: EnergySlot[], community: boolean) {
  const required = Math.max(0, (appliance.target - appliance.current) * appliance.energyPerUnit);
  if (!appliance.enabled) return { slots: [] as EnergySlot[], cost: 0, energy: 0, feasible: false, required };
  const deadline = new Date(`${appliance.deadline}:00+02:00`).getTime();
  const candidates = slots.filter(s => new Date(s.start).getTime() + 3600000 <= deadline).sort((a, b) => community && a.surplus !== b.surplus ? b.surplus - a.surplus : a.price - b.price);
  let remaining = required;
  let cost = 0;
  const selected: EnergySlot[] = [];
  for (const slot of candidates) {
    if (remaining <= 0.00001) break;
    const available = community && slot.surplus > 0 ? Math.min(appliance.power, slot.surplus) : appliance.power;
    const energy = Math.min(remaining, available);
    remaining -= energy;
    cost += energy * slot.price;
    selected.push({...slot, source: community && slot.surplus > 0 ? 'community' : slot.source ?? 'grid'});
  }
  return { slots: selected.sort((a,b) => a.start.localeCompare(b.start)), cost, energy: required - remaining, feasible: remaining <= 0.00001, required };
}
export const money = (value: number) => new Intl.NumberFormat('en-AT', { style: 'currency', currency: 'EUR' }).format(value);
export const time = (iso: string) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Vienna' }).format(new Date(iso));
export const sourceLabels: Record<EnergySource, string> = {
  community: 'Community · neighbours’ solar', regional: 'Regional · wind / hydro', plant: 'Power plant · grid supply', grid: 'Grid · source not specified',
};
export function chargingWindows(slots: EnergySlot[]) {
  const windows: {start: string; end: string; source: EnergySource}[] = [];
  for (const slot of [...slots].sort((a,b) => a.start.localeCompare(b.start))) {
    const source = slot.source ?? 'grid';
    const end = new Date(new Date(slot.start).getTime() + 3600000).toISOString();
    const previous = windows.at(-1);
    if (previous && new Date(previous.end).getTime() === new Date(slot.start).getTime() && previous.source === source) previous.end = end;
    else windows.push({start: slot.start, end, source});
  }
  return windows;
}
export function scheduleLabel(plan: ReturnType<typeof planCharging>, t: (message: string) => string = message => message, language: 'de' | 'en' = 'en') {
  if (!plan.slots.length) return t(plan.required === 0 ? 'Target already reached' : 'Optimisation paused');
  const windows = chargingWindows(plan.slots);
  const dateFormatter = new Intl.DateTimeFormat(language === 'de' ? 'de-AT' : 'en-GB', {day:'2-digit', month:'2-digit', timeZone:'Europe/Vienna'});
  const dates = new Set(windows.flatMap(w => [dateFormatter.format(new Date(w.start)), dateFormatter.format(new Date(w.end))]));
  return windows.map(w => `${dates.size > 1 ? `${dateFormatter.format(new Date(w.start))}, ` : ''}${time(w.start)}–${time(w.end)} · ${t(sourceLabels[w.source])}`).join('; ');
}
export const sampleSurplusHours = [{hour:'10:00',kwh:3.2},{hour:'11:00',kwh:6.4},{hour:'12:00',kwh:9.6},{hour:'13:00',kwh:11.2},{hour:'14:00',kwh:8.8},{hour:'15:00',kwh:4.8}];
export function splitEvenly(kwh: number, members: number) { return members > 0 ? kwh / members : 0; }
/** Illustrative household solar production when the supplied profile has none. */
export const sampleHouseholdSolarKwh = 14.6;
/** Illustrative next predicted community surplus window and the appliances charging in it. Other members are anonymised. */
export const sampleNextSurplus = {window:'11:00–15:00', totalKwh:40.0, yourSolarSentKwh:5.4, devices:[
 {owner:'you',type:'ev',kwh:4.2},{owner:'you',type:'boiler',kwh:2.1},
 {owner:'Familie Hofer',type:'ev',kwh:6.3},{owner:'Familie Lindner',type:'heat_pump',kwh:4.6},{owner:'Familie Krenn',type:'boiler',kwh:3.8},{owner:'Familie Danner',type:'washer',kwh:1.2},{owner:'Familie Prem',type:'ev',kwh:6.3},{owner:'Familie Zöchling',type:'battery',kwh:5.6}]} as const;
/** Illustrative solar the user sends to the community on the selected day when the data shows none. */
export const sampleSolarSentKwh = 6.2;
