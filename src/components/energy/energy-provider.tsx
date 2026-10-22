import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialAppliances, type Appliance, type Tariff } from '@/lib/energy';
type EnergyContextValue = { appliances: Appliance[]; updateAppliance: (appliance: Appliance) => void; addAppliance: (kind: Appliance['kind'], name: string) => void; tariff: Tariff; setTariff: (tariff: Tariff) => void; community: boolean; setCommunity: (value: boolean) => void; notifications: boolean; setNotifications: (value: boolean) => void; redeemed: boolean; redeem: () => void };
const EnergyContext = createContext<EnergyContextValue | null>(null);
export function EnergyProvider({ children }: { children: ReactNode }) {
  const [appliances, setAppliances] = useState(initialAppliances);
  const [tariff, setTariff] = useState<Tariff>('variable');
  const [community, setCommunity] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [redeemed, setRedeemed] = useState(false);
  function addAppliance(kind: Appliance['kind'], name: string) {
    const template = initialAppliances.find(a => a.kind === kind); if (!template) return;
    setAppliances(prev => [...prev, {...template, id: `device-${Date.now()}`, name, model: 'New appliance · Home'}]);
  }
  return <EnergyContext.Provider value={{ appliances, updateAppliance: a => setAppliances(prev => prev.map(p => p.id === a.id ? a : p)), addAppliance, tariff, setTariff, community, setCommunity, notifications, setNotifications, redeemed, redeem: () => setRedeemed(true) }}>{children}</EnergyContext.Provider>;
}
export function useEnergy() { const value = useContext(EnergyContext); if (!value) throw new Error('Energy provider is required'); return value; }
