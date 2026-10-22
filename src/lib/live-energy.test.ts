import {describe,it,expect} from 'vitest';
import {num,joinDeviceValues,timelineWindows,viennaTime,FIXED_TARIFF_TEXT} from './live-energy';
describe('External energy data',()=>{
 it('converts string numeric columns',()=>expect(num({energy_kwh:'21.60'},'energy_kwh')).toBe(21.6));
 it('joins device market values by both run and device',()=>expect(joinDeviceValues([{run_id:'summer',device_id:'ev'}],[{run_id:'winter',device_id:'ev',avg_market_price_ct:20},{run_id:'summer',device_id:'ev',avg_market_price_ct:8}])[0]?.['avg_market_price_ct']).toBe(8));
 it('displays timestamps in Vienna summer time',()=>expect(viennaTime('2026-06-21T09:00:00Z')).toBe('11:00'));
 it('displays timestamps in Vienna winter time',()=>expect(viennaTime('2026-01-21T09:00:00Z')).toBe('10:00'));
 it('groups contiguous quarter-hours but preserves source changes and gaps',()=>{
 const rows=[{ts:'2026-06-21T09:00:00Z',price_source:'community'},{ts:'2026-06-21T09:15:00Z',price_source:'community'},{ts:'2026-06-21T09:30:00Z',price_source:'market'},{ts:'2026-06-21T10:00:00Z',price_source:'market'}];
 expect(timelineWindows(rows).map(w=>[w.end,w.source])).toEqual([['2026-06-21T09:30:00.000Z','community'],['2026-06-21T09:45:00.000Z','market'],['2026-06-21T10:15:00.000Z','market']]);
 });
});
