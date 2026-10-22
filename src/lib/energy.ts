export type Tariff = 'variable' | 'fixed';
export type Appliance = { id: string; name: string; model: string; kind: 'car' | 'boiler' | 'washer'; current: number; target: number; deadline: string; power: number; energyPerUnit: number; enabled: boolean };
export type EnergySlot = { start: string; price: number; surplus: number };
export const demoNow = '2026-10-22T13:00:00+02:00';
export const energySlots: EnergySlot[] = Array.from({ length: 24 }, (_, i) => {
  const date = new Date(new Date(demoNow).getTime() + i * 3600000);
  const hour = (13 + i) % 24;
  const prices = [12, 10, 9, 10, 13, 18, 25, 30, 28, 24, 21, 18, 16, 14, 12, 11, 15, 24, 32, 35, 30, 25, 20, 16];
  return { start: date.toISOString(), price: (prices[hour] ?? 20) / 100, surplus: hour >= 13 && hour <= 16 ? [4.1, 6.8, 5.2, 2.4][hour - 13] ?? 0 : 0 };
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
    selected.push(slot);
  }
  return { slots: selected.sort((a,b) => a.start.localeCompare(b.start)), cost, energy: required - remaining, feasible: remaining <= 0.00001, required };
}
export const money = (value: number) => new Intl.NumberFormat('en-AT', { style: 'currency', currency: 'EUR' }).format(value);
export const time = (iso: string) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Vienna' }).format(new Date(iso));
export function scheduleLabel(plan: ReturnType<typeof planCharging>) {
  if (!plan.slots.length) return plan.required === 0 ? 'Target already reached' : 'Optimisation paused';
  return plan.slots.map(s => `${time(s.start)}–${time(new Date(new Date(s.start).getTime()+3600000).toISOString())}`).join(', ');
}
