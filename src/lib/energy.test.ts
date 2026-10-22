import { describe, expect, it } from 'vitest';
import { benefit, planCharging, initialAppliances, energySlots } from './energy';
describe('Customer tariff benefits', () => {
  it('reduces variable-plan cost by the actual price difference', () => { expect(benefit(10, 0.12, 0.30, 'variable')).toEqual({ savings: 1.7999999999999998, credits: 0 }); });
  it('gives fixed-plan customers redeemable credit equal to the positive difference', () => { expect(benefit(10, 0.1, 0.3, 'fixed').credits).toBeCloseTo(2); });
  it('never creates negative credit', () => { expect(benefit(10, 0.4, 0.3, 'fixed').credits).toBe(0); });
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
