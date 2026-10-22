import {useState} from 'react';
import {CarFront,Thermometer,WashingMachine,Fan,ShieldAlert,Plus,Save} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Switch} from '@/components/ui/switch';
import {useLanguage} from './language-provider';
import {validDraft,type ApplianceDraft} from '@/lib/appliance-drafts';
const kinds=[{type:'ev_charger',label:'EV',icon:CarFront},{type:'water_heater',label:'Boiler',icon:Thermometer},{type:'washing_machine',label:'Washer',icon:WashingMachine},{type:'heat_pump',label:'Heat pump',icon:Fan}];
export function ApplianceEditor({initial,isNew,onClose,onKeep}:{initial:ApplianceDraft;isNew:boolean;onClose:()=>void;onKeep:(draft:ApplianceDraft)=>void}){
 const {t}=useLanguage();const [draft,setDraft]=useState(initial);
 return <Dialog open onOpenChange={open=>{if(!open)onClose()}}><DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>{t(isNew?'Add an appliance':'Edit constraints')}</DialogTitle><DialogDescription>{t('Set your target and when your appliance needs to be ready.')}</DialogDescription></DialogHeader><form className="space-y-5" onSubmit={e=>{e.preventDefault();if(validDraft(draft))onKeep(draft)}}>
 {isNew&&<div className="device-type-selector flex-wrap" role="group" aria-label={t('Appliance type')}>{kinds.map(k=><Button key={k.type} type="button" variant={draft.type===k.type?'default':'outline'} aria-pressed={draft.type===k.type} onClick={()=>setDraft({...draft,type:k.type})}><k.icon size={16}/>{t(k.label)}</Button>)}</div>}
 <label className="form-field">{t('Appliance name')}<Input required value={draft.name} maxLength={80} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
 {isNew&&<div className="settings-fields"><label className="form-field">{t('Model')}<Input value={draft.model} onChange={e=>setDraft({...draft,model:e.target.value})}/></label><label className="form-field">{t('Location')}<Input value={draft.location} onChange={e=>setDraft({...draft,location:e.target.value})}/></label></div>}
 <div className="settings-fields"><label className="form-field">{t('Power (kW)')}<Input required type="number" min="0.1" step="0.1" value={draft.power} onChange={e=>setDraft({...draft,power:Number(e.target.value)})}/></label><label className="form-field">{t('Required energy (kWh)')}<Input required type="number" min="0.1" step="0.1" value={draft.energy} onChange={e=>setDraft({...draft,energy:Number(e.target.value)})}/></label></div>
 {draft.type==='ev_charger'&&<label className="form-field">{t('Target battery (%)')}<Input required type="number" min="1" max="100" value={draft.target} onChange={e=>setDraft({...draft,target:Number(e.target.value)})}/></label>}
 <label className="form-field">{t('Ready by')}<Input required value={draft.readyBy} placeholder="07:00" onChange={e=>setDraft({...draft,readyBy:e.target.value})}/></label>
 <div className="setting-toggle"><strong>{t('Smart optimisation')}</strong><Switch className="appliance-switch" checked={draft.enabled} onCheckedChange={enabled=>setDraft({...draft,enabled})} aria-label={t('Smart optimisation')}/></div>
 <div className="warning-note"><ShieldAlert size={18}/><span>{t('Your connection currently allows reading only. Keep this as a draft; saving to your household and recalculating plans need authorised access.')}</span></div>
 <div className="flex flex-wrap gap-3"><Button type="submit" disabled={!validDraft(draft)}>{isNew?<Plus/>:<Save/>}{t('Keep draft')}</Button><Button type="button" variant="outline" disabled><Save/>{t('Save to household')}</Button></div>
 </form></DialogContent></Dialog>;
}