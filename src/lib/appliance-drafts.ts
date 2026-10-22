import {num,text,type DataRow} from './live-energy';
export type ApplianceDraft = {type:string;name:string;model:string;location:string;power:number;energy:number;readyBy:string;target:number;enabled:boolean};
export function draftFromDevice(device:DataRow):ApplianceDraft {
 return {type:text(device,'type'),name:text(device,'name'),model:text(device,'model'),location:text(device,'location'),power:num(device,'power_kw'),energy:num(device,'energy_kwh'),readyBy:text(device,'ready_by'),target:device['ready_soc']==null?60:num(device,'ready_soc')*100,enabled:true};
}
export function validDraft(draft:ApplianceDraft){return draft.name.trim().length>0&&draft.power>0&&draft.energy>0&&draft.readyBy.trim().length>0&&(draft.type!=='ev_charger'||(draft.target>0&&draft.target<=100));}