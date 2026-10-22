import { useLanguage } from './language-provider';
import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, PlugZap, Users, Wallet, Settings, ArrowUpRight, ChevronDown, Bell, Zap, Leaf, X, Menu, CircleHelp, Info } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useEnergy } from './energy-provider';
import {useLiveEnergy} from './live-energy-provider';
import {num,text} from '@/lib/live-energy';
const nav = [{to:'/',label:'Overview',icon:LayoutDashboard},{to:'/appliances',label:'Appliances',icon:PlugZap},{to:'/community',label:'Energy community',icon:Users},{to:'/savings',label:'Savings & credits',icon:Wallet},{to:'/about',label:'About',icon:Info},{to:'/settings',label:'Settings',icon:Settings}] as const;
export function AppShell({ children }: { children: ReactNode }) { const { t, language, setLanguage } = useLanguage(); 
  const pathname = useRouterState({ select:s => s.location.pathname });
  const [menu, setMenu] = useState(false); const [showNotifications, setShowNotifications] = useState(false);
  const { community } = useEnergy();
  const {day,mode,setDay,setMode,overview,household} = useLiveEnergy();
  return <div className="app-layout">
    <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
      <Link to="/" search={prev=>prev} className="brand" aria-label={t("Wien Energie home")}><span>WIEN<span className="brand-energy">ENERGIE</span></span><Zap className="brand-bolt" fill="currentColor"/></Link>
      <div className="product-mark"><span className="text-primary">●</span> {t("Smart energy, your way.")}</div>
      <div className="nav-caption">{t("YOUR ENERGY")}</div>
      <nav aria-label={t("Main navigation")} className="side-nav">{nav.map(item => <Button key={item.to} variant="ghost" asChild className={`nav-item ${pathname===item.to ? 'nav-active' : ''}`}><Link to={item.to} search={prev=>prev} onClick={()=>setMenu(false)}><item.icon size={19}/><span>{t(item.label)}</span>{item.to === '/appliances' && <span className="nav-count">{num(overview,'devices_connected')}</span>}</Link></Button>)}</nav>
      <div className="sidebar-bottom"><div className="community-small"><div className="flex items-center gap-2 text-sm font-semibold"><Leaf size={17}/>{community ? t("Better, together.") : t("Smarter energy.")}</div><p>{community ? t("Your neighbourhood is powering a greener tomorrow.") : t("Get more from local, renewable energy.")}</p><Button variant="link" asChild className="p-0 h-auto text-xs"><Link to="/community" search={prev=>prev}>{t("Your energy community")} <ArrowUpRight size={14}/></Link></Button></div>
      <Button variant="ghost" asChild className="justify-start text-muted-foreground mt-4 w-full"><Link to="/info" search={prev=>prev}><CircleHelp/>{t("Help & information")}<ArrowUpRight className="ml-auto"/></Link></Button>
      <div className="profile-row"><span className="avatar">BT</span><div><strong>{text(household,'display_name')}</strong><span>{t("Personal account")}</span></div><Button variant="ghost" size="icon" asChild aria-label={t("Account settings")}><Link to="/settings" search={prev=>prev}><ChevronDown/></Link></Button></div></div>
    </aside>
    {menu && <div className="mobile-backdrop" onClick={()=>setMenu(false)}/>}
    <div className="main-wrap"><header className="topbar"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label={t("Open navigation")}>{menu ? <X/> : <Menu/>}</Button><span className="breadcrumb"><strong>{t(nav.find(n=>n.to===pathname)?.label ?? 'Help & information')}</strong></span></div><div className="flex items-center gap-5"><select className="native-select language-select" aria-label={t("Language")} value={language} onChange={e=>setLanguage(e.target.value === "de" ? "de" : "en")}><option value="de">Deutsch</option><option value="en">English</option></select><div className="relative"><Button variant="ghost" size="icon" aria-label={t("Notifications")} onClick={()=>setShowNotifications(!showNotifications)}><Bell size={18}/><span className="notification-dot"/></Button>{showNotifications && <div className="notification-panel"><strong>{t("Your energy updates")}</strong><p><Leaf size={16}/> {t('Your local energy today')}: {num(overview,'bought_from_neighbours_kwh')} kWh</p><p><PlugZap size={16}/> {t('Connected appliances')}: {num(overview,'devices_connected')}</p><span className="text-xs text-muted-foreground">{day}</span></div>}</div><Link to="/settings" search={prev=>prev} className="avatar avatar-small">BT</Link></div></header>{pathname!=='/community' && <div className="scenario-controls"><div role="group" aria-label={t("Day scenario")}>{([ ["2026-06-21","Summer · 21 Jun"],["2026-01-21","Winter · 21 Jan"] ] as const).map(([value,label])=><Button key={value} size="sm" variant={day===value?"default":"outline"} aria-pressed={day===value} onClick={()=>{void setDay(value)}}>{t(label)}</Button>)}</div><div role="group" aria-label={t("Energy mode")}>{([ ["flex","Smart devices"],["nachbarstrom","Smart + neighbours"] ] as const).map(([value,label])=><Button key={value} size="sm" variant={mode===value?"default":"outline"} aria-pressed={mode===value} onClick={()=>{void setMode(value)}}>{t(label)}</Button>)}</div></div>}<main className="page-content">{children}</main><footer className="app-footer"><span>{t("Wien Energie · Smart Energy")}</span><span>{t('Modelled households · Austrian day-ahead prices · All times Vienna')}</span></footer></div>
  </div>;
}
