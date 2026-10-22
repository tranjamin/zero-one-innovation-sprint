import { describe, expect, it } from 'vitest';
import { benefit, planCharging, initialAppliances, energySlots, chargingWindows } from './energy';
describe('Customer tariff benefits', () => {
  it('reduces variable-plan cost by the actual price difference', () => { expect(benefit(10, 0.12, 0.30, 'variable')).toEqual({ savings: 1.7999999999999998, credits: 0 }); });
  it('gives fixed-plan customers redeemable credit equal to the positive difference', () => { expect(benefit(10, 0.1, 0.3, 'fixed').credits).toBeCloseTo(2); });
  it('never creates negative credit', () => { expect(benefit(10, 0.4, 0.3, 'fixed').credits).toBe(0); });
});
describe('Consolidated provisional windows', () => {
  const slot = (hour: number, source: 'community' | 'regional' | 'plant') => ({start: `2026-10-22T${hour}:00:00+02:00`, price: 0.12, surplus: 0, source});
  it('consolidates 13–14 and 14–15 into 13–15 for the same source', () => {
    expect(chargingWindows([slot(13,'community'), slot(14,'community')])).toEqual([{start:'2026-10-22T13:00:00+02:00', end:'2026-10-22T13:00:00.000Z', source:'community'}]);
  });
  it('keeps community, regional and power plant periods separate', () => {
    expect(chargingWindows([slot(13,'community'),slot(14,'regional'),slot(15,'plant')]).map(w => w.source)).toEqual(['community','regional','plant']);
  });
  it('does not merge periods separated by a gap', () => {
    expect(chargingWindows([slot(13,'regional'),slot(15,'regional')])).toHaveLength(2);
  });
  it('does not call grid energy community energy when membership is off', () => {
    const car = initialAppliances[0]; if (!car) throw new Error('Missing car');
    expect(planCharging(car,energySlots,false).slots.every(s => s.source !== 'community')).toBe(true);
  });
});
describe('Appliance constraints', () => {
  it('charges the car from 32% to 60% by 7am tomorrow using the cheapest slots', () => {
    const car = initialAppliances[0]; if (!car) throw new Error('Missing car');
    const plan = planCharging(car, energySlots, false);
    expect(plan.feasible).toBe(true); expect(plan.energy).toBeCloseTo(16.8);
    expect(plan.slots.map(s => s.price)).toEqual([0.1, 0.09, 0.1]);
    expect(plan.slots.every(s => new Date(s.start).getTime()+3600000 <= new Date('2026-10-23T07:00:00+02:00').getTime())).toBe(true);
  });
  it('prioritises neighbours’ surplus for an energy community', () => {
    const car = initialAppliances[0]; if (!car) throw new Error('Missing car');
    const plan = planCharging(car, energySlots, true);
    expect(plan.slots.some(s => s.surplus > 0)).toBe(true);
    expect(plan.slots[0]?.surplus).toBeGreaterThan(0);
  });
  it('reports an impossible deadline rather than claiming the target will be reached', () => {
    const car = initialAppliances[0]; if (!car) throw new Error('Missing car');
    expect(planCharging({...car, deadline:'2026-10-22T13:00'}, energySlots, false).feasible).toBe(false);
  });
});
