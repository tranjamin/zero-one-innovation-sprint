import {createContext,useContext,type ReactNode} from 'react';
import {getRouteApi,useNavigate} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {householdOptions,scenarioOptions,text,type DataRow,type EnergyDay,type EnergyMode} from '@/lib/live-energy';
const root=getRouteApi('__root__');
type Value=ReturnType<typeof useData>;
const Context=createContext<Value|null>(null);
function useData(){
 const search=root.useSearch();
 const day:EnergyDay=search.day ?? '2026-06-21'; const mode=('nachbarstrom' as EnergyMode);
 const navigate=useNavigate();
 const {data:household}=useSuspenseQuery(householdOptions());
 const {data}=useSuspenseQuery(scenarioOptions(text(household,'id'),day,mode));
 return {...data,household,day,mode,setDay:(value:EnergyDay)=>navigate({to:'.',search:prev=>({...prev,day:value})}),setMode:(value:EnergyMode)=>navigate({to:'.',search:prev=>({...prev,mode:value})})};
}
export function LiveEnergyProvider({children}:{children:ReactNode}){const value=useData();return <Context.Provider value={value}>{children}</Context.Provider>}
export function useLiveEnergy(){const value=useContext(Context);if(!value)throw new Error('Energy data is unavailable');return value;}
