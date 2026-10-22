import { queryOptions } from '@tanstack/react-query';
import { supabase } from './supabase';
export type DataRow = Record<string, unknown>;
export type EnergyDay = '2026-06-21' | '2026-01-21';
export type EnergyMode = 'flex' | 'nachbarstrom';
export const num = (row: DataRow, key: string) => Number(row[key] ?? 0);
export const text = (row: DataRow, key: string) => String(row[key] ?? '');
export const viennaTime = (value: string) => !value ? '—' : /^\d{2}:\d{2}$/.test(value) ? value : new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Vienna'}).format(new Date(value));
export const sourceNames: Record<string,string> = {own:'Your solar',community:"Neighbours' solar",market:'Grid (cheap hours)'};
export function joinDeviceValues(plans: DataRow[], values: DataRow[]) {
 return plans.map(plan => ({...plan,...values.find(value => value.run_id === plan.run_id && value.device_id === plan.device_id)}));
}
export function timelineWindows(rows: DataRow[]) {
 const windows: {start:string;end:string;source:string}[] = [];
 for (const row of rows) {
  const start=text(row,'ts'); const source=text(row,'price_source');
  const end=new Date(new Date(start).getTime()+15*60000).toISOString();
  const previous=windows.at(-1);
  if(previous && previous.source===source && new Date(previous.end).getTime()===new Date(start).getTime()) previous.end=end;
  else windows.push({start,end,source});
 }
 return windows;
}
export const householdOptions = () => queryOptions({queryKey:['energy-household'],staleTime:60000,queryFn:async () => {
 const {data,error}=await supabase.from('households').select('*').eq('display_name','Benjamin').single();
 if(error) throw error; return data as DataRow;
}});
export const scenarioOptions = (householdId:string,day:EnergyDay,mode:EnergyMode) => queryOptions({queryKey:['energy-scenario',householdId,day,mode],staleTime:60000,queryFn:async () => {
 const householdQuery=(view:string)=>supabase.from(view).select('*').eq('household_id',householdId).eq('day',day).eq('mode',mode);
 const results=await Promise.all([
  householdQuery('app_household_overview').single(),
  householdQuery('app_household_timeline').order('ts'),
  householdQuery('app_device_plan'),
  supabase.from('app_community').select('*').eq('day',day).eq('mode',mode).single(),
  supabase.from('app_community_trades').select('*').eq('buyer_id',householdId).eq('day',day).eq('mode',mode).order('kwh',{ascending:false}).limit(5),
 ]);
 for(const result of results) if(result.error) throw result.error;
 const overview=results[0]?.data as DataRow; const timeline=results[1]?.data as DataRow[]; const plans=results[2]?.data as DataRow[];
 const runId=text(overview,'run_id');
 const {data:values,error}=await supabase.from('app_device_market_value').select('*').eq('run_id',runId).in('device_id',plans.map(p=>text(p,'device_id')));
 if(error) throw error;
 return {overview,timeline,devices:joinDeviceValues(plans,(values ?? []) as DataRow[]),communityData:results[3]?.data as DataRow,trades:results[4]?.data as DataRow[]};
}});
export const DATA_NOTE = 'Demo data: real Austrian day-ahead prices (EPEX via aWATTar) for 21 Jun and 21 Jan 2026; household profiles and solar are modelled. Assumptions: grid fee 8 ct/kWh, 40 % grid-fee discount within the community, neighbour price 7 ct/kWh (or market if higher), 1 ct/kWh platform fee.';
export const FIXED_TARIFF_TEXT = 'You keep your fixed price of {price} ct/kWh. Moving appliances lets Wien Energie buy cheaper energy, and you get 30 % of that saving as credits.';
